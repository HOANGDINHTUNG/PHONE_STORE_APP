import { AccountShell } from "../components/AccountShell";
import { useParams } from "react-router-dom";

export function ReturnDetailsPage() {
  const { id } = useParams();

  return (
    <AccountShell
      title={`Yêu cầu đổi trả #${id || "RT-12345"}`}
      description="Chi tiết và tiến trình xử lý yêu cầu đổi trả của bạn."
    >
      <div className="flex-grow w-full space-y-lg">
        {/* Page Header */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(214,51,108,0.08)] p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
            <div>
              <h1 className="text-headline-md font-headline-md text-on-background mb-2">
                Yêu cầu đổi trả{" "}
                <span className="text-primary font-bold">
                  #{id || "RT-12345"}
                </span>
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Ngày tạo: 24/10/2023, 14:30
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full border border-outline-variant">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Đang kiểm tra
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            {/* Timeline Section */}
            <div className="lg:col-span-1">
              <h2 className="text-label-sm font-label-sm font-bold text-on-background uppercase tracking-wider mb-6 text-outline">
                Tiến trình xử lý
              </h2>
              <div className="relative space-y-6">
                <style>{`
                  .timeline-connector {
                    position: absolute;
                    left: 1.25rem;
                    top: 2.5rem;
                    bottom: -0.5rem;
                    width: 2px;
                    background-color: theme('colors.outline-variant');
                    z-index: 0;
                  }
                  .timeline-item:last-child .timeline-connector {
                    display: none;
                  }
                `}</style>

                {/* Pending */}
                <div className="timeline-item relative flex items-start gap-4">
                  <div className="timeline-connector"></div>
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary-fixed-dim flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      check
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-label-sm font-label-sm font-bold text-on-background">
                      Đã tiếp nhận yêu cầu
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      24/10, 14:30
                    </p>
                  </div>
                </div>

                {/* Approved */}
                <div className="timeline-item relative flex items-start gap-4">
                  <div className="timeline-connector"></div>
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary-fixed-dim flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      check
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-label-sm font-label-sm font-bold text-on-background">
                      Đã duyệt
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      25/10, 09:15
                    </p>
                  </div>
                </div>

                {/* In Transit */}
                <div className="timeline-item relative flex items-start gap-4">
                  <div className="timeline-connector"></div>
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary-fixed-dim flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      check
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-label-sm font-label-sm font-bold text-on-background">
                      Đang vận chuyển
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      26/10, 10:00
                    </p>
                  </div>
                </div>

                {/* Received */}
                <div className="timeline-item relative flex items-start gap-4">
                  <div className="timeline-connector"></div>
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary-fixed-dim flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      check
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-label-sm font-label-sm font-bold text-on-background">
                      Đã nhận hàng
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      27/10, 15:20
                    </p>
                  </div>
                </div>

                {/* Inspecting (Current) */}
                <div className="timeline-item relative flex items-start gap-4">
                  <div className="timeline-connector bg-surface-variant"></div>
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest shadow-sm shadow-[0_0_15px_rgba(214,51,108,0.4)]">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      search
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-label-sm font-label-sm font-bold text-primary">
                      Đang kiểm tra
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      Dự kiến hoàn thành trong 24h
                    </p>
                  </div>
                </div>

                {/* Completed */}
                <div className="timeline-item relative flex items-start gap-4 opacity-50">
                  <div className="timeline-connector"></div>
                  <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest shadow-sm">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      done_all
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="text-label-sm font-label-sm font-bold text-on-surface-variant">
                      Hoàn tất
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product List */}
              <div className="bg-surface rounded-lg p-6 border border-outline-variant/30">
                <h3 className="text-label-sm font-label-sm font-bold text-on-background uppercase tracking-wider mb-4">
                  Sản phẩm hoàn trả
                </h3>
                <div className="flex items-center gap-4 py-4 border-b border-outline-variant/30 last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded bg-surface-container flex items-center justify-center overflow-hidden shrink-0 border border-outline-variant/50">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjfy3HF7wi0oq_caFQz1DhORPAY59WJVxmutiSDLiMFOrfBhC6y0vm-HPfXtCtssueAXbhAFO-mQBQZO-6RuiO7sDH-uOmQ292LpAPGMsFT0SLRaFlhY7t8OsLIWkgPgynnK98CoCPDz0gLQj_Wk03Fs8hY9Xg6ZSPKTMiDlhC3wT8gAuvYnVPbUoBNJqXecfbHnchNAncYdNZW4n_hfeE1N0QhSN9uhckizs58_tokPNlLmSyYKun"
                      alt="Product"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-body-md font-body-md font-bold text-on-background">
                      PinkPhone Pro Max 256GB
                    </h4>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Màu: Rose Gold | SKU: PP-PM256-RG
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-0.5 text-xs rounded border border-outline-variant text-on-surface-variant bg-transparent">
                        Lỗi màn hình
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-md font-body-md font-bold text-on-background">
                      x1
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Info (Bento Style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/30 hover:border-primary-fixed-dim transition-colors shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 0" }}
                      >
                        account_balance_wallet
                      </span>
                    </div>
                    <h3 className="text-label-sm font-label-sm font-bold text-on-background">
                      Thông tin hoàn tiền
                    </h3>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">
                        Mã hoàn tiền
                      </span>
                      <span className="text-sm font-medium text-on-background">
                        #RF-99887
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">
                        Số tiền
                      </span>
                      <span className="text-body-md font-body-md font-bold text-primary">
                        24,990,000 đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">
                        Phương thức
                      </span>
                      <span className="text-sm font-medium text-on-background">
                        Chuyển khoản ngân hàng
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30">
                      <span className="text-sm text-on-surface-variant">
                        Trạng thái
                      </span>
                      <span className="text-sm font-bold text-outline">
                        CHỜ XỬ LÝ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/30 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 0" }}
                        >
                          support_agent
                        </span>
                      </div>
                      <h3 className="text-label-sm font-label-sm font-bold text-on-background">
                        Cần hỗ trợ?
                      </h3>
                    </div>
                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                      Nếu bạn có thắc mắc về quá trình kiểm tra, vui lòng liên
                      hệ bộ phận chăm sóc khách hàng của chúng tôi.
                    </p>
                  </div>
                  <button className="mt-4 w-full bg-surface border border-outline-variant text-on-background font-label-sm py-2 px-4 rounded-lg hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      chat
                    </span>{" "}
                    Chat ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
