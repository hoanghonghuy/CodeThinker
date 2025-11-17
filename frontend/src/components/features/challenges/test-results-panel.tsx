"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, AlertCircle, CheckCircle, XCircle, Timer } from "lucide-react";
import type { SubmissionResponse } from "@/lib/backend-api";

interface TestResultsPanelProps {
  submission: SubmissionResponse | null;
}

export function TestResultsPanel({ submission }: TestResultsPanelProps) {
  if (!submission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Kết quả test</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Chưa có kết quả. Hãy viết code và nộp bài để xem kết quả test case.
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (submission.status) {
      case "Passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Error":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "Timeout":
        return <Timer className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (submission.status) {
      case "Passed":
        return "default";
      case "Failed":
        return "destructive";
      case "Error":
        return "secondary";
      case "Timeout":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          Kết quả test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status and points */}
        <div className="flex items-center justify-between">
          <Badge variant={getStatusColor()}>
            {submission.status}
          </Badge>
          {submission.pointsAwarded > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">+{submission.pointsAwarded} điểm</span>
            </div>
          )}
        </div>

        {/* Execution info */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Thời gian:</span>
            <div className="font-mono">{submission.executionTimeMs}ms</div>
          </div>
          <div>
            <span className="text-muted-foreground">Ngôn ngữ:</span>
            <div className="font-mono">{submission.language.toUpperCase()}</div>
          </div>
        </div>

        {/* Output */}
        {submission.output && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Output:</div>
            <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap">
              {submission.output}
            </pre>
          </div>
        )}

        {/* Error */}
        {submission.error && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Error:</div>
            <pre className="bg-destructive/10 p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap text-destructive">
              {submission.error}
            </pre>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Nộp lúc: {new Date(submission.submittedAt).toLocaleString("vi-VN")}
        </div>
      </CardContent>
    </Card>
  );
}
