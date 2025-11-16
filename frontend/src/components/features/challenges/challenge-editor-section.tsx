"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CodeEditorPanel,
  type RunStatus,
} from "@/components/features/editor/code-editor-panel";

export type SubmissionHistoryEntry = {
  id: string;
  status: RunStatus;
  language: string;
  message: string;
  ranAt: string;
};

export function ChallengeEditorSection({
  challengeId,
}: {
  challengeId: string;
}) {
  const [history, setHistory] = useState<SubmissionHistoryEntry[]>([]);

  const handleMockRun = (payload: {
    challengeId: string;
    language: string;
    status: RunStatus;
    message: string;
    ranAt: Date;
  }) => {
    const id = `${payload.ranAt.getTime()}-${history.length + 1}`;
    setHistory((prev) => [
      {
        id,
        status: payload.status,
        language: payload.language,
        message: payload.message,
        ranAt: payload.ranAt.toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      <CodeEditorPanel
        challengeId={challengeId}
        initialLanguage="python"
        onMockRun={handleMockRun}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lịch sử chạy (mock)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {history.length === 0 ? (
            <p className="text-muted-foreground">
              Chưa có lần chạy nào. Hãy viết một đoạn code và bấm &quot;Run mock&quot;
              để xem kết quả.
            </p>
          ) : (
            <div className="space-y-1">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between rounded-md border bg-card px-3 py-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          entry.status === "success"
                            ? "default"
                            : entry.status === "error"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {entry.status === "success"
                          ? "PASS (mock)"
                          : entry.status === "error"
                          ? "FAIL (mock)"
                          : entry.status === "running"
                          ? "Running"
                          : "Idle"}
                      </Badge>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {entry.ranAt}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {entry.message}
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {entry.language.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
