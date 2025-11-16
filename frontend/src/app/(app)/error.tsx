"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold tracking-tight">
        Đã có lỗi xảy ra trong ứng dụng.
      </h1>
      <p className="text-sm text-muted-foreground">
        Hãy thử tải lại trang. Nếu lỗi vẫn tiếp diễn, bạn có thể kiểm tra lại mạng
        hoặc thử lại sau.
      </p>
      <Button type="button" onClick={reset} className="mt-2 px-4 py-2 text-xs">
        Thử tải lại
      </Button>
    </div>
  );
}
