"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaderboardTable } from "@/components/features/leaderboard/leaderboard-table";
import { apiClient } from "@/lib/api-client";
import type { LeaderboardEntry, LeaderboardTimeframe, LeaderboardSortBy } from "@/lib/leaderboard-mock";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>("all-time");
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("points");

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getLeaderboard(timeframe, sortBy);
        setEntries(data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [timeframe, sortBy]);

  const currentUserEntry = entries.find(entry => entry.userId === "current-user");
  const topEntries = entries.slice(0, 10);

  const timeframeOptions = [
    { value: "all-time", label: "All Time" },
    { value: "monthly", label: "This Month" },
    { value: "weekly", label: "This Week" },
  ];

  const sortOptions = [
    { value: "points", label: "Points" },
    { value: "streak", label: "Streak" },
    { value: "completed", label: "Completed" },
  ];

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          See how you rank against other learners on the platform.
        </p>
      </div>

      {/* Current User Stats */}
      {currentUserEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">#{currentUserEntry.rank}</div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{currentUserEntry.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{currentUserEntry.streak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{currentUserEntry.completedChallenges}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{currentUserEntry.level}</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{currentUserEntry.country}</div>
                <div className="text-xs text-muted-foreground">Country</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Sorting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Timeframe
              </label>
              <Select value={timeframe} onValueChange={(value: LeaderboardTimeframe) => setTimeframe(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={(value: LeaderboardSortBy) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setTimeframe("all-time");
                  setSortBy("points");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Top 10 Learners</h2>
        <LeaderboardTable entries={topEntries} currentUserId="current-user" />
      </div>

      {/* Full Leaderboard */}
      {entries.length > 10 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Full Leaderboard</h2>
          <LeaderboardTable entries={entries} currentUserId="current-user" />
        </div>
      )}
    </div>
  );
}
