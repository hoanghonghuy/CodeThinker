namespace CodeThinker.Domain.Entities;

public class TestCase : Common.BaseEntity
{
    public Guid ChallengeId { get; set; }
    public Challenge Challenge { get; set; } = null!;

    public int Order { get; set; } // 1, 2, 3...
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public bool IsHidden { get; set; } = false; // Visible to user or not
    public int Points { get; set; } = 10; // Points awarded if this test passes
}
