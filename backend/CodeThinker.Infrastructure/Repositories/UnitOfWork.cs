using CodeThinker.Domain.Entities;
using CodeThinker.Domain.Repositories;
using CodeThinker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Storage;

namespace CodeThinker.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;
    
    // Repositories
    private readonly IRepository<User> _users;
    private readonly IRepository<Challenge> _challenges;
    private readonly IRepository<Track> _tracks;
    private readonly IRepository<Achievement> _achievements;
    private readonly IRepository<UserAchievement> _userAchievements;
    private readonly IRepository<UserTrack> _userTracks;
    private readonly IRepository<UserChallenge> _userChallenges;
    private readonly IRepository<TestCase> _testCases;
    private readonly IRepository<Submission> _submissions;
    private readonly IRepository<UserStats> _userStats;

    // Custom repositories
    private readonly ITestCaseRepository _testCasesCustom;
    private readonly ISubmissionRepository _submissionsCustom;
    private readonly IUserStatsRepository _userStatsCustom;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        _users = new Repository<User>(context);
        _challenges = new Repository<Challenge>(context);
        _tracks = new Repository<Track>(context);
        _achievements = new Repository<Achievement>(context);
        _userAchievements = new Repository<UserAchievement>(context);
        _userTracks = new Repository<UserTrack>(context);
        _userChallenges = new Repository<UserChallenge>(context);
        _testCases = new Repository<TestCase>(context);
        _submissions = new Repository<Submission>(context);
        _userStats = new Repository<UserStats>(context);

        _testCasesCustom = new TestCaseRepository(context);
        _submissionsCustom = new SubmissionRepository(context);
        _userStatsCustom = new UserStatsRepository(context);
    }

    // Repository properties
    public IRepository<User> Users => _users;
    public IRepository<Challenge> Challenges => _challenges;
    public IRepository<Track> Tracks => _tracks;
    public IRepository<Achievement> Achievements => _achievements;
    public IRepository<UserAchievement> UserAchievements => _userAchievements;
    public IRepository<UserTrack> UserTracks => _userTracks;
    public IRepository<UserChallenge> UserChallenges => _userChallenges;
    public IRepository<TestCase> TestCases => _testCases;
    public IRepository<Submission> Submissions => _submissions;
    public IRepository<UserStats> UserStats => _userStats;

    // Custom repository properties
    public ITestCaseRepository TestCasesCustom => _testCasesCustom;
    public ISubmissionRepository SubmissionsCustom => _submissionsCustom;
    public IUserStatsRepository UserStatsCustom => _userStatsCustom;

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
