"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditorPanel, type RunStatus } from "@/components/features/editor/code-editor-panel";
import { TestResultsPanel } from "@/components/features/challenges/test-results-panel";
import { apiClient } from "@/lib/api-client";
import { submissionApi } from "@/lib/backend-api";
import { useAuth } from "@/components/providers/auth-provider";
import type { ChallengeSummary } from "@/components/features/challenges/challenge-list";
import type { SubmissionResponse } from "@/lib/backend-api";

type ChallengeSolveChallenge = ChallengeSummary & {
  summary?: string;
};

export type SubmissionHistoryEntry = {
  id: string;
  status: RunStatus;
  language: string;
  message: string;
  ranAt: string;
  pointsAwarded: number;
  executionTimeMs: number;
  output?: string;
  error?: string;
};

export function ChallengeSolveTabs({
  challenge,
}: {
  challenge: ChallengeSolveChallenge;
}) {
  const { user } = useAuth();
  const [history, setHistory] = useState<SubmissionHistoryEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [latestSubmission, setLatestSubmission] = useState<SubmissionResponse | null>(null);

  useEffect(() => {
    // Check if challenge was already started and fetch submission history
    setHasStarted(false);
    fetchSubmissionHistory();
  }, [challenge.id]);

  const fetchSubmissionHistory = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const submissions = await submissionApi.getSubmissions(token, challenge.id);
      const historyEntries: SubmissionHistoryEntry[] = submissions.map(sub => ({
        id: sub.id,
        status: sub.status.toLowerCase() as RunStatus,
        language: sub.language,
        message: sub.error || sub.output || 'No output',
        ranAt: new Date(sub.submittedAt).toLocaleTimeString(),
        pointsAwarded: sub.pointsAwarded,
        executionTimeMs: sub.executionTimeMs,
        output: sub.output,
        error: sub.error,
      }));
      
      setHistory(historyEntries);
    } catch (error) {
      console.error('Failed to fetch submission history:', error);
    }
  };

  const handleStartChallenge = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để bắt đầu thử thách.");
      return;
    }
    try {
      const progress = await apiClient.startChallenge(challenge.id);
      if (progress) {
        setHasStarted(true);
        toast.success("Đã bắt đầu thử thách!");
      }
    } catch (error) {
      console.error("Failed to start challenge:", error);
      toast.error("Không thể bắt đầu thử thách.");
    }
  };

  const handleSubmitSolution = async (payload: { code: string; language: string }) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để nộp bài.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Không tìm thấy token xác thực.");
        return;
      }

      const result = await submissionApi.submitCode(token, {
        challengeId: challenge.id,
        language: payload.language,
        code: payload.code,
      });

      setLatestSubmission(result);

      // Add to history
      const historyEntry: SubmissionHistoryEntry = {
        id: result.id,
        status: result.status.toLowerCase() as RunStatus,
        language: result.language,
        message: result.error || result.output || 'No output',
        ranAt: new Date(result.submittedAt).toLocaleTimeString(),
        pointsAwarded: result.pointsAwarded,
        executionTimeMs: result.executionTimeMs,
        output: result.output,
        error: result.error,
      };

      setHistory(prev => [historyEntry, ...prev]);

      // Show appropriate toast
      if (result.status === 'Passed') {
        toast.success(`Chính xác! +${result.pointsAwarded} điểm`);
      } else if (result.status === 'Failed') {
        toast.error("Một số test case đang FAIL. Kiểm tra lại code của bạn.");
      } else if (result.status === 'Error') {
        toast.error("Lỗi thực thi. Kiểm tra lại cú pháp và logic code.");
      } else if (result.status === 'Timeout') {
        toast.error("Code chạy quá thời gian cho phép. Tối ưu thuật toán.");
      } else {
        toast.info("Đã nộp bài. Đang chờ kết quả...");
      }
    } catch (error) {
      console.error("Failed to submit challenge:", error);
      toast.error("Không thể nộp bài. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {!hasStarted && user && (
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleStartChallenge} className="w-full">
                Bắt đầu thử thách
              </Button>
            </CardContent>
          </Card>
        )}
        {!user && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Bạn cần đăng nhập để bắt đầu thử thách.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="editor" className="space-y-4">
        <CodeEditorPanel
          challengeId={challenge.id}
          initialLanguage="python"
          onMockRun={handleMockRun}
          onSubmit={handleSubmitSolution}
          isSubmitting={isSubmitting}
        />
        <TestResultsPanel submission={latestSubmission} />
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lịch sử nộp bài</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {history.length === 0 ? (
              <p className="text-muted-foreground">
                Chưa có lần nộp bài nào. Hãy viết code và nộp bài để xem kết quả.
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-md border bg-card p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            entry.status === "passed"
                              ? "default"
                              : entry.status === "failed"
                              ? "destructive"
                              : entry.status === "error"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {entry.status === "passed"
                            ? "PASS"
                            : entry.status === "failed"
                            ? "FAIL"
                            : entry.status === "error"
                            ? "ERROR"
                            : entry.status === "timeout"
                            ? "TIMEOUT"
                            : entry.status.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {entry.ranAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {entry.language.toUpperCase()}
                        </span>
                        {entry.pointsAwarded > 0 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{entry.pointsAwarded}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                      <div>Thời gian: {entry.executionTimeMs}ms</div>
                      <div>ID: {entry.id.substring(0, 8)}...</div>
                    </div>

                    {entry.output && (
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Output:</div>
                        <pre className="bg-muted p-1 rounded text-[10px] font-mono overflow-x-auto whitespace-pre-wrap">
                          {entry.output.substring(0, 200)}
                          {entry.output.length > 200 && '...'}
                        </pre>
                      </div>
                    )}

                    {entry.error && (
                      <div>
                        <div className="text-[10px] text-muted-foreground mb-1">Error:</div>
                        <pre className="bg-destructive/10 p-1 rounded text-[10px] font-mono overflow-x-auto whitespace-pre-wrap text-destructive">
                          {entry.error.substring(0, 200)}
                          {entry.error.length > 200 && '...'}
                        </pre>
                      </div>
                    )}
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
