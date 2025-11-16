import type { LeaderboardEntry } from "@/lib/leaderboard-mock";
import { useLocale } from "@/components/providers/locale-provider";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const { t } = useLocale();
  
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600";
      case 3:
        return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert":
        return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20";
      case "Advanced":
        return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
      case "Intermediate":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
      case "Beginner":
        return "text-muted-foreground bg-muted";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Level
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Points
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Streak
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Completed
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Country
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId;
              
              return (
                <tr
                  key={entry.userId}
                  className={`transition-colors hover:bg-accent ${
                    isCurrentUser ? "bg-primary/5 font-medium" : ""
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium border ${getRankBadgeColor(
                          entry.rank
                        )}`}
                      >
                        {getRankIcon(entry.rank)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg mr-3">{entry.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {entry.displayName}
                          {isCurrentUser && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {t.leaderboard.you}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.leaderboard.lastActive} {new Date(entry.lastActive).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                      entry.level
                    )}`}>
                      {entry.level}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground font-medium">
                      {entry.points.toLocaleString()}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-foreground">{entry.streak}</span>
                      <span className="ml-1 text-xs text-muted-foreground">{t.leaderboard.days}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {entry.completedChallenges}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-lg">{entry.country}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
