namespace CodeThinker.Domain.Entities;

public class UserTrack : Common.BaseEntity
{
    public Guid UserId { get; set; }
    public Guid TrackId { get; set; }
    public string Status { get; set; } = "not_started";
    public int ProgressCurrent { get; set; } = 0;
    public int ProgressTotal { get; set; } = 100;
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Track Track { get; set; } = null!;
}
