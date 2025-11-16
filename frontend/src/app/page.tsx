import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:justify-between">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Đang trong giai đoạn MVP, tập trung vào tư duy và debug độc lập
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Luyện tư duy lập trình và kỹ năng debug, không phụ thuộc AI sinh code.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            CodeThinker là môi trường luyện tập cho developer độc lập: bài tập thực tế,
            hệ thống chấm tự động, gợi ý vừa đủ, và dashboard theo dõi tiến độ học tập.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground md:text-sm">
            <span>• Bài tập từ thuật toán đến backend thực tế</span>
            <span>• Tập trung vào đọc lỗi, trace stack, và suy luận</span>
            <span>• Không sinh code sẵn — bạn tự chiến đấu với bug</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-4 text-sm">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:text-sm"
            >
              Vào dashboard
            </Link>
            <Link
              href="/challenges"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:text-sm"
            >
              Xem danh sách thử thách
            </Link>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm space-y-4 rounded-xl border bg-card p-4 text-xs text-muted-foreground md:mt-0 md:text-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Ví dụ lộ trình một ngày
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <div>
                <p className="font-medium text-foreground">
                  20 phút đọc lại bài cũ và fix bug tồn đọng
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Xem lại submission cũ, đọc error message, ghi chú những pattern lỗi lặp lại.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <div>
                <p className="font-medium text-foreground">
                  30–40 phút làm một thử thách mới</p>
                <p className="text-[11px] text-muted-foreground">
                  Bắt đầu từ đề bài, tự phân tích input/output, chủ động viết test case đơn giản trước.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <div>
                <p className="font-medium text-foreground">
                  10 phút tổng kết và ghi chép
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ghi lại insight: lỗi nào mất thời gian nhất, lần sau sẽ debug nhanh hơn như thế nào.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
