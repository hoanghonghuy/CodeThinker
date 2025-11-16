"use client";

import { Suspense, useEffect, useState } from "react";
import { TrackList } from "@/components/features/tracks/track-list";
import { apiClient } from "@/lib/api-client";
import { useLocale } from "@/components/providers/locale-provider";
import type { TrackWithProgress } from "@/lib/tracks-mock";

function TracksContent() {
  const { t } = useLocale();
  const [tracks, setTracks] = useState<TrackWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getTracksWithProgress().then((tracksData) => {
      setTracks(tracksData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.tracks.title}</h1>
        <p className="text-muted-foreground">
          {t.tracks.subtitle}
        </p>
      </div>

      {tracks.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">Chưa có lộ trình nào.</p>
        </div>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
}

export default function TracksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TracksContent />
    </Suspense>
  );
}
