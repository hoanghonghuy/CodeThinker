namespace CodeThinker.Domain.Entities;

public class Challenge : Common.BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "Easy";
    public List<string> Topics { get; set; } = new List<string>();
    public string Status { get; set; } = "not_started";
    public int EstimatedHours { get; set; } = 0;
    public List<string> Tags { get; set; } = new List<string>();
    public string? Solution { get; set; }
    public string? Hints { get; set; }
    
    // Foreign key for Track
    public Guid? TrackId { get; set; }
    
    // Progress tracking
    public int ProgressCurrent { get; set; } = 0;
    public int ProgressTotal { get; set; } = 100;
    
    // Navigation properties
    public virtual Track? Track { get; set; }
    public virtual ICollection<Challenge> Challenges { get; set; } = new List<Challenge>();
    public virtual ICollection<UserChallenge> UserProgress { get; set; } = new List<UserChallenge>();
    public virtual ICollection<TestCase> TestCases { get; set; } = new List<TestCase>();
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
