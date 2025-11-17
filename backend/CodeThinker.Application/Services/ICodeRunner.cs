namespace CodeThinker.Application.Services;

public class CodeExecutionResult
{
    public bool Success { get; set; }
    public string Output { get; set; } = string.Empty;
    public string Error { get; set; } = string.Empty;
    public int ExitCode { get; set; }
    public int ExecutionTimeMs { get; set; }
    public long MemoryUsedKb { get; set; }
    public bool TimedOut { get; set; }
}

public interface ICodeRunner
{
    Task<CodeExecutionResult> RunCodeAsync(string language, string code, string input, TimeSpan timeout, long maxMemoryKb = 128_000);
}
