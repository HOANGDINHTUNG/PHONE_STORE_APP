import { Link } from "react-router-dom";

type BrandLogoProps = {
  inverse?: boolean;
};

export function BrandLogo({ inverse = false }: BrandLogoProps) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 font-extrabold tracking-[-0.04em] ${
        inverse ? "text-white" : "text-primary-strong"
      }`}
      aria-label="PinkPhone - Trang chủ"
    >
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm text-white shadow-sm">
        P
      </span>
      <span className="text-xl">PinkPhone</span>
    </Link>
  );
}
