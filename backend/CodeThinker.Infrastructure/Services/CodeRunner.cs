using CodeThinker.Application.Services;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Text;

namespace CodeThinker.Infrastructure.Services;

public class CodeRunner : ICodeRunner
{
    private readonly ILogger<CodeRunner> _logger;
    private readonly string _tempDir;

    public CodeRunner(ILogger<CodeRunner> logger)
    {
        _logger = logger;
        _tempDir = Path.Combine(Path.GetTempPath(), "CodeThinker", Guid.NewGuid().ToString());
        Directory.CreateDirectory(_tempDir);
    }

    public async Task<CodeExecutionResult> RunCodeAsync(string language, string code, string input, TimeSpan timeout, long maxMemoryKb = 128_000)
    {
        var result = new CodeExecutionResult();
        var stopwatch = Stopwatch.StartNew();

        try
        {
            var fileName = language.ToLowerInvariant() switch
            {
                "python" => await PreparePythonFileAsync(code),
                "csharp" => await PrepareCSharpFileAsync(code),
                _ => throw new NotSupportedException($"Language {language} is not supported")
            };

            var inputFileName = Path.Combine(_tempDir, "input.txt");
            await File.WriteAllTextAsync(inputFileName, input);

            var startInfo = new ProcessStartInfo
            {
                FileName = language.ToLowerInvariant() switch
                {
                    "python" => "python",
                    "csharp" => "dotnet",
                    _ => throw new NotSupportedException($"Language {language} is not supported")
                },
                Arguments = language.ToLowerInvariant() switch
                {
                    "python" => $"\"{fileName}\"",
                    "csharp" => $"run --project \"{Path.GetDirectoryName(fileName)}\"",
                    _ => throw new NotSupportedException($"Language {language} is not supported")
                },
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = _tempDir
            };

            using var process = new Process { StartInfo = startInfo };
            
            var outputBuilder = new StringBuilder();
            var errorBuilder = new StringBuilder();

            process.OutputDataReceived += (_, e) => {
                if (e.Data != null) outputBuilder.AppendLine(e.Data);
            };
            process.ErrorDataReceived += (_, e) => {
                if (e.Data != null) errorBuilder.AppendLine(e.Data);
            };

            _logger.LogInformation("Starting code execution for {Language}", language);

            if (!process.Start())
            {
                result.Error = "Failed to start process";
                return result;
            }

            process.BeginOutputReadLine();
            process.BeginErrorReadLine();

            // Write input to the process
            if (!string.IsNullOrEmpty(input))
            {
                await process.StandardInput.WriteAsync(input);
                process.StandardInput.Close();
            }

            // Wait for completion with timeout
            var completed = process.WaitForExit((int)timeout.TotalMilliseconds);

            stopwatch.Stop();
            result.ExecutionTimeMs = (int)stopwatch.ElapsedMilliseconds;

            if (!completed)
            {
                _logger.LogWarning("Code execution timed out after {TimeoutMs}ms", timeout.TotalMilliseconds);
                try
                {
                    process.Kill(entireProcessTree: true);
                    await Task.Delay(100); // Give it time to die
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to kill timed out process");
                }

                result.TimedOut = true;
                result.Error = $"Execution timed out after {timeout.TotalMilliseconds}ms";
                return result;
            }

            result.ExitCode = process.ExitCode;
            result.Output = outputBuilder.ToString();
            result.Error = errorBuilder.ToString();
            result.Success = process.ExitCode == 0 && string.IsNullOrEmpty(result.Error);

            _logger.LogInformation("Code execution completed in {ElapsedMs}ms with exit code {ExitCode}", 
                result.ExecutionTimeMs, result.ExitCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during code execution");
            result.Error = ex.Message;
            result.Success = false;
        }
        finally
        {
            try
            {
                if (Directory.Exists(_tempDir))
                {
                    Directory.Delete(_tempDir, recursive: true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to clean up temp directory {TempDir}", _tempDir);
            }
        }

        return result;
    }

    private async Task<string> PreparePythonFileAsync(string code)
    {
        var fileName = Path.Combine(_tempDir, "solution.py");
        await File.WriteAllTextAsync(fileName, code);
        return fileName;
    }

    private async Task<string> PrepareCSharpFileAsync(string code)
    {
        // Create a minimal console project
        var projectDir = Path.Combine(_tempDir, "Solution");
        Directory.CreateDirectory(projectDir);

        var csproj = """
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
""";

        var programCs = code;

        await File.WriteAllTextAsync(Path.Combine(projectDir, "Solution.csproj"), csproj);
        await File.WriteAllTextAsync(Path.Combine(projectDir, "Program.cs"), programCs);

        return Path.Combine(projectDir, "Program.cs");
    }
}
