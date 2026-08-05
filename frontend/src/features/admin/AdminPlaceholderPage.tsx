import { Construction } from "lucide-react";

type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-[1400px] rounded-2xl border border-[#eed2db] bg-white p-8 shadow-[0_3px_10px_rgba(79,20,45,0.03)]">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f5] text-[#d92e70]"><Construction size={24} /></span>
      <h1 className="mt-5 text-2xl font-black text-slate-950">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-8 rounded-xl border border-dashed border-[#efcad7] bg-[#fffafb] p-6 text-sm font-medium text-slate-500">Màn hình quản lý chi tiết sẽ được kết nối với API quản trị tương ứng.</div>
    </section>
  );
}
