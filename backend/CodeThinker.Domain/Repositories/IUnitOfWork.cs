using CodeThinker.Domain.Entities;

namespace CodeThinker.Domain.Repositories;

public interface IUnitOfWork : IDisposable
{
    // Repositories
    IRepository<User> Users { get; }
    IRepository<Challenge> Challenges { get; }
    IRepository<Track> Tracks { get; }
    IRepository<Achievement> Achievements { get; }
    IRepository<UserAchievement> UserAchievements { get; }
    IRepository<UserTrack> UserTracks { get; }
    IRepository<UserChallenge> UserChallenges { get; }
    
    // Transaction management
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
