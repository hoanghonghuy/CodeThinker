using System.ComponentModel.DataAnnotations;

namespace CodeThinker.Application.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string DisplayName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string PreferredLanguage { get; set; } = "JavaScript";
    
    [StringLength(10)]
    public string UiLanguage { get; set; } = "en";
    
    [StringLength(20)]
    public string SelfAssessedLevel { get; set; } = "Beginner";
}
