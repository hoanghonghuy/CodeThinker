using CodeThinker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CodeThinker.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets for entities
    public DbSet<User> Users { get; set; }
    public DbSet<Challenge> Challenges { get; set; }
    public DbSet<Track> Tracks { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<UserTrack> UserTracks { get; set; }
    public DbSet<UserChallenge> UserChallenges { get; set; }
    public DbSet<TestCase> TestCases { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<UserStats> UserStats { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.PreferredLanguage).HasMaxLength(50);
            entity.Property(e => e.UiLanguage).HasMaxLength(10);
            entity.Property(e => e.SelfAssessedLevel).HasMaxLength(20);
            entity.Property(e => e.EditorTheme).HasMaxLength(50);
            entity.Property(e => e.EditorWordWrap).HasMaxLength(20);
        });

        // Configure Challenge entity
        modelBuilder.Entity<Challenge>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Difficulty).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.Solution);
            entity.Property(e => e.Hints);
            
            // Configure JSON columns for array properties
            entity.Property(e => e.Topics).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("jsonb");
            
            // Relationship with Track
            entity.HasOne(e => e.Track)
                  .WithMany(t => t.Challenges)
                  .HasForeignKey(e => e.TrackId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Track entity
        modelBuilder.Entity<Track>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Difficulty).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(20);
            
            // Configure JSON columns for array properties
            entity.Property(e => e.Topics).HasColumnType("jsonb");
            entity.Property(e => e.Tags).HasColumnType("jsonb");
        });

        // Configure Achievement entity
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Icon).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Rarity).IsRequired().HasMaxLength(20);
        });

        // Configure UserAchievement (many-to-many)
        modelBuilder.Entity<UserAchievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Achievements)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Achievement)
                  .WithMany(a => a.UserAchievements)
                  .HasForeignKey(e => e.AchievementId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure UserTrack (many-to-many)
        modelBuilder.Entity<UserTrack>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.TrackId }).IsUnique();
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Tracks)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Track)
                  .WithMany(t => t.UserProgress)
                  .HasForeignKey(e => e.TrackId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure UserChallenge (many-to-many)
        modelBuilder.Entity<UserChallenge>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ChallengeId }).IsUnique();
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.UserChallenges)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Challenge)
                  .WithMany(c => c.UserProgress)
                  .HasForeignKey(e => e.ChallengeId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure TestCase
        modelBuilder.Entity<TestCase>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Input).IsRequired();
            entity.Property(e => e.ExpectedOutput).IsRequired();
            
            entity.HasOne(e => e.Challenge)
                  .WithMany(c => c.TestCases)
                  .HasForeignKey(e => e.ChallengeId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Submission
        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired();
            entity.Property(e => e.Language).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.Output);
            entity.Property(e => e.Error);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Submissions)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Challenge)
                  .WithMany(c => c.Submissions)
                  .HasForeignKey(e => e.ChallengeId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure UserStats (one-to-one with User)
        modelBuilder.Entity<UserStats>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            
            entity.HasOne(e => e.User)
                  .WithOne(u => u.UserStats)
                  .HasForeignKey<UserStats>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
