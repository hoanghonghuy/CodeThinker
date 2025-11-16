import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TrackDetail } from "@/components/features/tracks/track-detail";
import { apiClient } from "@/lib/api-client";

async function TrackContent({ trackId }: { trackId: string }) {
  const [track, challenges] = await Promise.all([
    apiClient.getTrackWithProgressById(trackId),
    apiClient.listChallenges(),
  ]);

  if (!track) {
    notFound();
  }

  return <TrackDetail track={track} challenges={challenges} />;
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div>Loading track...</div>}>
      <TrackContent trackId={id} />
    </Suspense>
  );
}
