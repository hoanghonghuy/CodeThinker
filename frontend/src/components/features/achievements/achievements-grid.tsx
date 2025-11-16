import type { Achievement } from "@/lib/achievements-mock";
import { getRarityColor, getRarityTextColor } from "@/lib/achievements-mock";
import { useLocale } from "@/components/providers/locale-provider";

interface AchievementsGridProps {
  achievements: Achievement[];
  showUnlockedOnly?: boolean;
  compact?: boolean;
}

export function AchievementsGrid({ 
  achievements, 
  showUnlockedOnly = false, 
  compact = false 
}: AchievementsGridProps) {
  const { t } = useLocale();
  
  const filteredAchievements = showUnlockedOnly 
    ? achievements.filter(a => a.unlocked)
    : achievements;

  const getProgressPercentage = (progress: Achievement["progress"]) => {
    return Math.min(100, Math.round((progress.current / progress.required) * 100));
  };

  if (filteredAchievements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {showUnlockedOnly ? t.achievements.noUnlockedAchievements : t.achievements.noAchievements}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
      {filteredAchievements.map((achievement) => {
        const progressPercentage = getProgressPercentage(achievement.progress);
        const isUnlocked = achievement.unlocked;
        
        return (
          <div
            key={achievement.id}
            className={`relative rounded-lg border p-4 transition-all hover:shadow-md ${
              isUnlocked 
                ? getRarityColor(achievement.rarity)
                : 'border-muted bg-muted opacity-75'
            }`}
          >
            {/* Achievement Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className={`text-2xl ${!isUnlocked && 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                isUnlocked 
                  ? getRarityTextColor(achievement.rarity)
                  : 'text-muted-foreground'
              }`}>
                {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
              </div>
            </div>

            {/* Achievement Info */}
            <h3 className={`font-semibold text-sm mb-1 ${
              isUnlocked ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {achievement.title}
            </h3>
            <p className={`text-xs mb-3 line-clamp-2 ${
              isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              {achievement.description}
            </p>

            {/* Progress */}
            {!isUnlocked && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.achievements.progress}</span>
                  <span className="font-medium">
                    {achievement.progress.current}/{achievement.progress.required}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {progressPercentage}%
                </div>
              </div>
            )}

            {/* Unlocked Date */}
            {isUnlocked && achievement.unlockedAt && (
              <div className="text-xs text-muted-foreground mt-2">
                {t.achievements.unlockedOn}: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}

            {/* Locked Overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
                <div className="text-center">
                  <div className="text-3xl mb-1">🔒</div>
                  <div className="text-xs font-medium text-muted-foreground">{t.achievements.locked}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
