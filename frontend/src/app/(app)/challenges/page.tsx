"use client";

import { useEffect, useMemo, useState } from "react";

import { useLocale } from "@/components/providers/locale-provider";
import {
  ChallengeList,
  type ChallengeSummary,
} from "@/components/features/challenges/challenge-list";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard";
type SortMode = "newest" | "easiest" | "hardest";

export default function ChallengesPage() {
  const { t } = useLocale();

  const [challenges, setChallenges] = useState<ChallengeSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [topic, setTopic] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiClient.listChallenges();
        if (!cancelled) {
          setChallenges(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allTopics = useMemo(() => {
    if (!challenges) return [] as string[];
    const set = new Set<string>();
    for (const c of challenges) {
      for (const topic of c.topics) {
        set.add(topic);
      }
    }
    return Array.from(set).sort();
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    if (!challenges) return [] as ChallengeSummary[];

    const filtered = challenges.filter((c) => {
      if (difficulty !== "all" && c.difficulty !== difficulty) return false;
      if (topic !== "all" && !c.topics.includes(topic)) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!c.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    const difficultyRank: Record<string, number> = {
      Easy: 1,
      Medium: 2,
      Hard: 3,
    };

    return [...filtered].sort((a, b) => {
      if (sortMode === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      const rankA = difficultyRank[a.difficulty] ?? 0;
      const rankB = difficultyRank[b.difficulty] ?? 0;

      if (sortMode === "easiest") {
        return rankA - rankB;
      }

      // hardest
      return rankB - rankA;
    });
  }, [challenges, difficulty, topic, search, sortMode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.challenges.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.challenges.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-md border bg-card/40 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">Độ khó:</span>
          <div className="flex flex-wrap gap-1">
            {([
              ["all", "Tất cả"],
              ["Easy", "Easy"],
              ["Medium", "Medium"],
              ["Hard", "Hard"],
            ] as const).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={difficulty === value ? "default" : "outline"}
                className="h-7 px-2 text-[11px]"
                onClick={() => setDifficulty(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-muted-foreground" htmlFor="topic-filter">
            Chủ đề:
          </label>
          <select
            id="topic-filter"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-xs"
          >
            <option value="all">Tất cả</option>
            {allTopics.map((tTopic) => (
              <option key={tTopic} value={tTopic}>
                {tTopic}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full min-w-40 rounded-md border bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-40"
          />
          <div className="flex items-center gap-1">
            <span className="hidden text-muted-foreground sm:inline">Sắp xếp:</span>
            <select
              value={sortMode}
              onChange={(event) =>
                setSortMode(event.target.value as SortMode)
              }
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              <option value="newest">Mới nhất</option>
              <option value="easiest">Dễ → khó</option>
              <option value="hardest">Khó → dễ</option>
            </select>
          </div>
        </div>
      </div>

      {loading || !challenges ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Không tìm thấy thử thách nào với bộ lọc hiện tại.
        </p>
      ) : (
        <ChallengeList challenges={filteredChallenges} messages={t.challenges} />
      )}
    </div>
  );
}
