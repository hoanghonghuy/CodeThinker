namespace CodeThinker.Domain.Entities;

public enum SubmissionStatus
{
    Pending,
    Running,
    Passed,
    Failed,
    Error,
    Timeout
}

public class Submission : Common.BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid ChallengeId { get; set; }
    public Challenge Challenge { get; set; } = null!;

    public string Language { get; set; } = string.Empty; // "python", "csharp"
    public string Code { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;
    public string? Output { get; set; }
    public string? Error { get; set; }
    public int PointsAwarded { get; set; } = 0;
    public int ExecutionTimeMs { get; set; } = 0;
    public int MemoryUsedKb { get; set; } = 0;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
