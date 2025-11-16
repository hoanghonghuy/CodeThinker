namespace CodeThinker.Application.DTOs.Auth;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = string.Empty;
    public string UiLanguage { get; set; } = string.Empty;
    public string SelfAssessedLevel { get; set; } = string.Empty;
    public string EditorTheme { get; set; } = string.Empty;
    public int EditorFontSize { get; set; }
    public string EditorWordWrap { get; set; } = string.Empty;
    public bool EditorMinimap { get; set; }
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool WeeklyProgress { get; set; }
    public int Points { get; set; }
    public int Streak { get; set; }
    public int CompletedChallenges { get; set; }
    public DateTime LastActive { get; set; }
}
