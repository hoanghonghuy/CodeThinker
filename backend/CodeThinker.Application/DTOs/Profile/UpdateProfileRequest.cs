using System.ComponentModel.DataAnnotations;

namespace CodeThinker.Application.DTOs.Profile;

public class UpdateProfileRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DisplayName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string PreferredLanguage { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string UiLanguage { get; set; } = "en";

    [Required]
    [MaxLength(20)]
    public string SelfAssessedLevel { get; set; } = "Beginner";

    [Required]
    [MaxLength(50)]
    public string EditorTheme { get; set; } = "vs-dark";

    [Range(10, 30)]
    public int EditorFontSize { get; set; } = 14;

    [Required]
    [MaxLength(20)]
    public string EditorWordWrap { get; set; } = "on";

    public bool EditorMinimap { get; set; } = true;

    public bool EmailNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public bool WeeklyProgress { get; set; } = true;
}
