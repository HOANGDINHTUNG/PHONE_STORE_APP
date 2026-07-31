import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type BreadcrumbsProps = {
  current: string;
  parent?: string;
};

export function Breadcrumbs({ current, parent = "Điện thoại" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted">
      <Link to="/" className="hover:text-primary">Trang chủ</Link>
      <ChevronRight size={13} />
      <span>{parent}</span>
      <ChevronRight size={13} />
      <span className="font-semibold text-foreground">{current}</span>
    </nav>
  );
}
