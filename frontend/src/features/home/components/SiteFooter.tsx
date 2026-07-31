import { Share2, ThumbsUp } from "lucide-react";

const introductionLinks = [
  "Về PinkPhone",
  "Tuyển dụng",
  "Tin công nghệ",
  "Liên hệ",
];

const policyLinks = [
  "Chính sách bảo hành",
  "Chính sách đổi trả",
  "Chính sách vận chuyển",
  "Thanh toán bảo mật",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-footer">
      <div className="mx-auto max-w-7xl px-5 pb-7 pt-14 sm:px-6 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.95fr_1fr_1fr] lg:gap-14">
          <section aria-labelledby="footer-brand">
            <h2
              id="footer-brand"
              className="text-xl font-extrabold tracking-[-0.04em] text-primary"
            >
              PinkPhone
            </h2>
            <p className="mt-4 max-w-[17rem] text-sm leading-6 text-muted">
              Hệ thống bán lẻ điện thoại di động hàng đầu với dịch vụ tận tâm và
              sản phẩm chính hãng.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#share"
                className="grid size-9 place-items-center rounded-full bg-white text-foreground shadow-sm transition hover:-translate-y-0.5 hover:text-primary"
                aria-label="Chia sẻ PinkPhone"
              >
                <Share2 size={16} />
              </a>
              <a
                href="#like"
                className="grid size-9 place-items-center rounded-full bg-white text-foreground shadow-sm transition hover:-translate-y-0.5 hover:text-primary"
                aria-label="Yêu thích PinkPhone"
              >
                <ThumbsUp size={16} />
              </a>
            </div>
          </section>

          <FooterLinkGroup title="Giới thiệu" links={introductionLinks} />
          <FooterLinkGroup title="Chính sách" links={policyLinks} />

          <section aria-labelledby="footer-support">
            <h2 id="footer-support" className="text-sm font-extrabold text-foreground">
              Hỗ trợ khách hàng
            </h2>
            <div className="mt-5 grid gap-1">
              <p className="text-sm text-muted">Hotline mua hàng:</p>
              <a
                href="tel:18006601"
                className="w-fit text-xl font-extrabold tracking-wide text-primary hover:text-primary-strong"
              >
                1800 6601
              </a>
            </div>
            <div className="mt-3 grid gap-1">
              <p className="text-sm text-muted">Góp ý, khiếu nại:</p>
              <a
                href="tel:18006602"
                className="w-fit text-xl font-extrabold tracking-wide text-primary hover:text-primary-strong"
              >
                1800 6602
              </a>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © 2026 PinkPhone. All rights reserved.
          </p>
          <div className="flex items-center gap-3" aria-label="Phương thức thanh toán">
            <span className="grid h-7 min-w-12 place-items-center rounded-md bg-neutral-soft px-2 text-[9px] font-extrabold text-muted">
              VISA
            </span>
            <span className="grid h-7 min-w-12 place-items-center rounded-md bg-neutral-soft px-2 text-[9px] font-extrabold text-muted">
              CARD
            </span>
            <span className="grid h-7 min-w-12 place-items-center rounded-md bg-neutral-soft px-2 text-[9px] font-extrabold text-muted">
              COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterLinkGroupProps = {
  title: string;
  links: string[];
};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-extrabold text-foreground">{title}</h2>
      <ul className="mt-5 grid gap-3 text-sm text-muted">
        {links.map((link) => (
          <li key={link}>
            <a href={`#${link}`} className="transition hover:text-primary">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
