namespace CodeThinker.Domain.Entities;

public class Track : Common.BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "Beginner";
    public List<string> Topics { get; set; } = new List<string>();
    public string Status { get; set; } = "not_started";
    public int EstimatedHours { get; set; } = 0;
    public List<string> Tags { get; set; } = new List<string>();
    
    // Progress tracking
    public int ProgressCurrent { get; set; } = 0;
    public int ProgressTotal { get; set; } = 100;
    
    // Navigation properties
    public virtual ICollection<Challenge> Challenges { get; set; } = new List<Challenge>();
    public virtual ICollection<UserTrack> UserProgress { get; set; } = new List<UserTrack>();
}
