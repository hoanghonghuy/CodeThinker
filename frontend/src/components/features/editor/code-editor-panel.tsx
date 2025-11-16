"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type SupportedLanguage = "python" | "csharp";

export type RunStatus = "idle" | "running" | "success" | "error";

export type CodeEditorPanelProps = {
  challengeId: string;
  initialLanguage?: SupportedLanguage;
  onMockRun?: (payload: {
    challengeId: string;
    language: SupportedLanguage;
    status: RunStatus;
    message: string;
    ranAt: Date;
  }) => void;
  onSubmit?: (solution: string) => void;
  isSubmitting?: boolean;
};

export function CodeEditorPanel({
  challengeId,
  initialLanguage = "python",
  onMockRun,
  onSubmit,
  isSubmitting,
}: CodeEditorPanelProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const key = `ct.code.${challengeId}.${initialLanguage}`;
      const stored = window.localStorage.getItem(key);
      return stored ?? "";
    } catch {
      return "";
    }
  });
  const [status, setStatus] = useState<RunStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window === "undefined") return 14;
    try {
      const raw = window.localStorage.getItem("ct.editorSettings");
      if (raw) {
        const parsed = JSON.parse(raw) as { fontSize?: number };
        if (parsed.fontSize && typeof parsed.fontSize === "number") {
          return parsed.fontSize;
        }
      }
    } catch {
    }
    return 14;
  });

  useEffect(() => {
    try {
      const existingRaw = window.localStorage.getItem("ct.editorSettings");
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const next = { ...existing, fontSize };
      window.localStorage.setItem("ct.editorSettings", JSON.stringify(next));
    } catch {
    }
  }, [fontSize]);

  const handleSave = useCallback(() => {
    try {
      const key = `ct.code.${challengeId}.${language}`;
      window.localStorage.setItem(key, code);
    } catch {
    }
  }, [challengeId, language, code]);

  const handleRun = useCallback(() => {
    setStatus("running");
    setMessage("");
    const started = new Date();
    setLastRunAt(started.toLocaleTimeString());

    setTimeout(() => {
      const trimmed = code.trim();
      const ok = trimmed.length > 0 && Math.random() > 0.3;

      const nextStatus: RunStatus = ok ? "success" : "error";
      const nextMessage = ok
        ? "Bài nộp mock đã PASS. Sau này sẽ gọi backend để chấm thật với test case ẩn."
        : "Một số test mock đang FAIL. Hãy kiểm tra lại các trường hợp biên / logic vòng lặp và xử lý lỗi.";

      setStatus(nextStatus);
      setMessage(nextMessage);

      if (onMockRun) {
        onMockRun({
          challengeId,
          language,
          status: nextStatus,
          message: nextMessage,
          ranAt: started,
        });
      }
    }, 700);
  }, [challengeId, language, code, onMockRun]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(code);
    }
  }, [code, onSubmit]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleRun();
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === "s" || event.key === "S")
      ) {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handleRun, handleSave]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Code editor (mock)</CardTitle>
          <p className="text-xs text-muted-foreground">
            Challenge ID: <span className="font-mono">{challengeId}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Ngôn ngữ:</span>
            <select
              value={language}
              onChange={(event) => {
                const next = event.target.value as SupportedLanguage;
                setLanguage(next);
                if (typeof window !== "undefined") {
                  try {
                    const key = `ct.code.${challengeId}.${next}`;
                    const stored = window.localStorage.getItem(key);
                    setCode(stored ?? "");
                  } catch {
                  }
                }
              }}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              <option value="python">Python</option>
              <option value="csharp">C#</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Font:</span>
            <select
              value={fontSize}
              onChange={(event) =>
                setFontSize(Number.parseInt(event.target.value, 10) || 14)
              }
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              <option value={12}>Nhỏ</option>
              <option value={14}>Vừa</option>
              <option value={16}>Lớn</option>
            </select>
          </div>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={status === "running"}
            className="text-xs"
          >
            {status === "running" ? "Đang chạy (mock)..." : "Run mock"}
          </Button>
          {onSubmit && (
            <Button
              size="sm"
              variant="default"
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              className="text-xs"
            >
              {isSubmitting ? "Đang nộp..." : "Submit for Grading"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-80 overflow-hidden rounded-md border bg-card">
          <MonacoEditor
            height="100%"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Trạng thái:</span>
            {status === "idle" && <Badge variant="outline">Chưa chạy</Badge>}
            {status === "running" && (
              <Badge variant="secondary">Đang chạy mock...</Badge>
            )}
            {status === "success" && (
              <Badge variant="default">PASS (mock)</Badge>
            )}
            {status === "error" && (
              <Badge variant="destructive">Có lỗi (mock)</Badge>
            )}
          </div>
          {lastRunAt && (
            <span className="text-muted-foreground">
              Lần chạy gần nhất: <span className="font-mono">{lastRunAt}</span>
            </span>
          )}
        </div>

        {message && (
          <p
            className="text-xs"
            data-status={status}
          >
            {message}
          </p>
        )}

        <p className="text-[11px] text-muted-foreground">
          Đây chỉ là flow mock để minh hoạ UX. Khi backend hoàn tất, nút Run sẽ gọi
          API submission / status theo thiết kế trong PRD.
        </p>
      </CardContent>
    </Card>
  );
}
