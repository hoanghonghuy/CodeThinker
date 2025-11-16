"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeEditorPanel, type RunStatus } from "@/components/features/editor/code-editor-panel";
import type { ChallengeSummary } from "@/components/features/challenges/challenge-list";

type ChallengeSolveChallenge = ChallengeSummary & {
  summary?: string;
};

export type SubmissionHistoryEntry = {
  id: string;
  status: RunStatus;
  language: string;
  message: string;
  ranAt: string;
};

export function ChallengeSolveTabs({
  challenge,
}: {
  challenge: ChallengeSolveChallenge;
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
    <Tabs defaultValue="problem" className="space-y-4">
      <TabsList>
        <TabsTrigger value="problem">Problem</TabsTrigger>
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="hints">Hints</TabsTrigger>
      </TabsList>

      <TabsContent value="problem" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Mô tả chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              {challenge.summary ??
                "Chi tiết bài toán sẽ được lấy từ backend trong các bản cập nhật tiếp theo. Hiện tại hiển thị mô tả tóm tắt từ ChallengeSummary."}
            </p>
            <p>
              Phần này sau này sẽ được lấy từ backend, bao gồm mô tả đầy đủ, định
              dạng input/output và các ràng buộc chi tiết hơn.
            </p>
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-foreground">Ví dụ (giả lập)</p>
              <p>
                <span className="font-mono">Input</span>: tuỳ từng bài (ví dụ:
                mảng số nguyên, request HTTP, câu truy vấn SQL...)
              </p>
              <p>
                <span className="font-mono">Output</span>: kết quả xử lý tương
                ứng cần trả về.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="editor">
        <CodeEditorPanel
          challengeId={challenge.id}
          initialLanguage="python"
          onMockRun={handleMockRun}
        />
      </TabsContent>

      <TabsContent value="history">
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
      </TabsContent>

      <TabsContent value="hints">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hints (mock)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>
              Phần này sẽ hiển thị một vài gợi ý dần dần, thay vì đưa ra lời giải
              hoàn chỉnh. Bạn có thể coi đây là nơi tự nhắc mình kiểm tra lại
              giả định, edge case và cách debug.
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Trước khi chạy, hãy thử nghĩ ra ít nhất 3 test case biên.</li>
              <li>
                Khi FAIL, đọc kỹ error message và stack trace rồi log thêm chứ
                đừng sửa bừa.
              </li>
              <li>
                Nếu vẫn bí, hãy ghi lại input cụ thể gây lỗi để phân tích
                offline.
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
