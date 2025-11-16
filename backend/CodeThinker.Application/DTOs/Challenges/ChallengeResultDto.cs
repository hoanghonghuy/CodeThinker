namespace CodeThinker.Application.DTOs.Challenges;

public class ChallengeResultDto
{
    public bool IsCorrect { get; set; }
    public string Message { get; set; } = string.Empty;
    public int PointsEarned { get; set; }
    public UserChallengeProgressDto Progress { get; set; } = null!;
    public List<string> AchievementsUnlocked { get; set; } = new List<string>();
}
