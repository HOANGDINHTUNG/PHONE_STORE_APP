import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Select, Table, Tooltip, message } from "antd";
import { CheckCircle2, Eye, Package, RotateCcw, Search, Star, XCircle } from "lucide-react";
import { afterSalesService } from "./afterSalesService";
import { ReviewItem, ReviewStatus } from "./afterSalesTypes";

function ProductThumbnail({ src, name }: { src?: string; name: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const canShowImage = Boolean(src) && !imageFailed;

  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#f0d9e1] bg-[#fff7f9]">
      {canShowImage ? (
        <img src={src} alt={name} className="h-full w-full object-contain p-1" onError={() => setImageFailed(true)} />
      ) : (
        <Package size={22} className="text-[#c2185b]" aria-label="Chưa có ảnh sản phẩm" />
      )}
    </div>
  );
}

function Stars({ rating, withValue = false }: { rating: number; withValue?: boolean }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
      ))}
      {withValue && <span className="ml-1 text-xs font-bold text-slate-600">{rating}/5</span>}
    </div>
  );
}

const statusMeta: Record<ReviewStatus, { label: string; className: string }> = {
  PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Đã duyệt", className: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Đã từ chối", className: "bg-red-100 text-red-600" },
};

export function ReviewModerationTab() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [rejectingReview, setRejectingReview] = useState<ReviewItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    try {
      setReviews(await afterSalesService.fetchReviewsFromBackend());
    } catch {
      message.error("Không tải được đánh giá. Hãy kiểm tra kết nối backend và quyền quản trị.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadReviews(); }, []);

  const filteredReviews = useMemo(() => {
    const q = searchText.trim().toLocaleLowerCase("vi-VN");
    return reviews.filter((review) => {
      const matchStatus = statusFilter === "ALL" || review.status === statusFilter;
      const matchRating = ratingFilter === "ALL" || review.rating === Number(ratingFilter);
      const searchTarget = [review.productName, review.variantName, review.sku, review.customerName, review.customerEmail, review.title, review.comment]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("vi-VN");
      return matchStatus && matchRating && (!q || searchTarget.includes(q));
    });
  }, [reviews, ratingFilter, searchText, statusFilter]);

  const totals = useMemo(() => ({
    pending: reviews.filter((r) => r.status === "PENDING").length,
    approved: reviews.filter((r) => r.status === "APPROVED").length,
    rejected: reviews.filter((r) => r.status === "REJECTED").length,
  }), [reviews]);

  const handleApprove = async (review: ReviewItem) => {
    try {
      await afterSalesService.approveReview(review.id);
      message.success(`Đã duyệt đánh giá của ${review.customerName}.`);
      setSelectedReview(null);
      await loadReviews();
    } catch {
      message.error("Không thể duyệt đánh giá. Vui lòng thử lại.");
    }
  };

  const handleReject = async () => {
    if (!rejectingReview || !rejectReason.trim()) {
      message.warning("Hãy nhập lý do từ chối để khách hàng biết cần điều chỉnh nội dung nào.");
      return;
    }
    try {
      await afterSalesService.rejectReview(rejectingReview.id, rejectReason.trim());
      message.success("Đã từ chối đánh giá và lưu lý do phản hồi.");
      setRejectingReview(null);
      setRejectReason("");
      setSelectedReview(null);
      await loadReviews();
    } catch {
      message.error("Không thể từ chối đánh giá. Vui lòng thử lại.");
    }
  };

  const openReject = (review: ReviewItem) => {
    setSelectedReview(null);
    setRejectingReview(review);
    setRejectReason("");
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 330,
      render: (_: unknown, review: ReviewItem) => (
        <button type="button" onClick={() => setSelectedReview(review)} className="flex w-full items-center gap-3 text-left">
          <ProductThumbnail src={review.image} name={review.productName} />
          <span className="min-w-0">
            <span className="block truncate font-extrabold text-slate-900" title={review.productName}>{review.productName}</span>
            {review.variantName && <span className="block truncate text-xs text-slate-500" title={review.variantName}>{review.variantName}</span>}
            <span className="mt-1 inline-block max-w-full truncate rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600" title={review.sku}>SKU: {review.sku}</span>
          </span>
        </button>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 210,
      render: (_: unknown, review: ReviewItem) => (
        <div className="min-w-0">
          <div className="truncate font-bold text-slate-900" title={review.customerName}>{review.customerName}</div>
          <div className="truncate text-xs text-slate-500" title={review.customerEmail}>{review.customerEmail}</div>
        </div>
      ),
    },
    { title: "Đánh giá", key: "rating", width: 125, render: (_: unknown, review: ReviewItem) => <Stars rating={review.rating} withValue /> },
    {
      title: "Nội dung",
      key: "comment",
      render: (_: unknown, review: ReviewItem) => (
        <button type="button" className="block max-w-full text-left" onClick={() => setSelectedReview(review)}>
          {review.title && <span className="block truncate font-bold text-slate-800">{review.title}</span>}
          <span className="mt-0.5 line-clamp-2 text-sm leading-5 text-slate-600">{review.comment || "Khách hàng không để lại nội dung."}</span>
          <span className="mt-1 inline-block text-xs font-bold text-[#c2185b]">Xem đầy đủ</span>
        </button>
      ),
    },
    { title: "Ngày gửi", dataIndex: "createdAt", key: "createdAt", width: 145, render: (value: string) => <span className="text-xs leading-5 text-slate-500">{value}</span> },
    {
      title: "Trạng thái",
      key: "status",
      width: 155,
      render: (_: unknown, review: ReviewItem) => (
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusMeta[review.status].className}`}>{statusMeta[review.status].label}</span>
          {review.status === "REJECTED" && review.rejectionReason && <p className="mt-1 line-clamp-2 text-[11px] text-red-500" title={review.rejectionReason}>Lý do: {review.rejectionReason}</p>}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: unknown, review: ReviewItem) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Xem chi tiết"><Button type="text" shape="circle" icon={<Eye size={17} />} onClick={() => setSelectedReview(review)} /></Tooltip>
          {review.status === "PENDING" && <>
            <Popconfirm title="Duyệt đánh giá này?" description="Đánh giá sẽ được hiển thị công khai trên sản phẩm." okText="Duyệt" cancelText="Hủy" onConfirm={() => void handleApprove(review)}>
              <Tooltip title="Duyệt đánh giá"><Button type="text" shape="circle" className="!text-emerald-600" icon={<CheckCircle2 size={18} />} /></Tooltip>
            </Popconfirm>
            <Tooltip title="Từ chối đánh giá"><Button type="text" shape="circle" danger icon={<XCircle size={18} />} onClick={() => openReject(review)} /></Tooltip>
          </>}
        </div>
      ),
    },
  ];

  const clearFilters = () => { setSearchText(""); setRatingFilter("ALL"); setStatusFilter("PENDING"); };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["Chờ kiểm duyệt", totals.pending, "bg-amber-50 text-amber-700"],
          ["Đã duyệt", totals.approved, "bg-emerald-50 text-emerald-700"],
          ["Đã từ chối", totals.rejected, "bg-red-50 text-red-600"],
        ].map(([label, count, classes]) => <div key={String(label)} className={`rounded-2xl border border-[#eed2db] p-4 ${classes}`}><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-2xl font-black">{count}</p></div>)}
      </section>

      <section className="rounded-2xl border border-[#eed2db] bg-white p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input value={searchText} onChange={(event) => setSearchText(event.target.value)} allowClear size="large" className="w-full sm:w-[360px]" placeholder="Tìm tên, SKU, khách hàng, nội dung..." prefix={<Search size={16} className="mr-1 text-slate-400" />} />
          <Select value={ratingFilter} onChange={setRatingFilter} size="large" className="w-40" options={[{ label: "Tất cả số sao", value: "ALL" }, ...[5, 4, 3, 2, 1].map((value) => ({ label: `${value} sao`, value: String(value) }))]} />
          <Select value={statusFilter} onChange={setStatusFilter} size="large" className="w-44" options={[{ label: "Chờ duyệt", value: "PENDING" }, { label: "Đã duyệt", value: "APPROVED" }, { label: "Đã từ chối", value: "REJECTED" }, { label: "Tất cả trạng thái", value: "ALL" }]} />
          <Button size="large" icon={<RotateCcw size={16} />} onClick={clearFilters} className="sm:ml-auto">Xóa bộ lọc</Button>
          <Tooltip title="Tải lại danh sách"><Button size="large" icon={<RotateCcw size={16} />} onClick={() => void loadReviews()} /></Tooltip>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table dataSource={filteredReviews} columns={columns} rowKey="id" loading={loading} scroll={{ x: 1200 }} locale={{ emptyText: "Không có đánh giá phù hợp" }} pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total, range) => <span className="text-sm text-slate-500">Hiển thị <b>{range[0]}-{range[1]}</b> trên <b>{total}</b> đánh giá</span> }} />
      </section>

      <Modal open={Boolean(selectedReview)} onCancel={() => setSelectedReview(null)} footer={null} title="Chi tiết đánh giá" width={720}>
        {selectedReview && <div className="space-y-5 pt-2">
          <div className="flex items-center gap-4 rounded-xl bg-[#fff7f9] p-4"><ProductThumbnail src={selectedReview.image} name={selectedReview.productName} /><div className="min-w-0"><p className="truncate text-lg font-black text-slate-900">{selectedReview.productName}</p>{selectedReview.variantName && <p className="text-sm text-slate-600">{selectedReview.variantName}</p>}<p className="mt-1 font-mono text-xs text-slate-500">SKU: {selectedReview.sku}</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Khách hàng</p><p className="mt-1 font-bold">{selectedReview.customerName}</p><p className="text-sm text-slate-500">{selectedReview.customerEmail}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Đánh giá</p><div className="mt-1"><Stars rating={selectedReview.rating} withValue /></div><p className="mt-2 text-sm text-slate-500">Gửi lúc {selectedReview.createdAt}</p></div></div>
          <div className="rounded-xl border border-slate-100 p-4">{selectedReview.title && <p className="font-extrabold text-slate-900">{selectedReview.title}</p>}<p className="mt-2 whitespace-pre-wrap leading-6 text-slate-700">{selectedReview.comment || "Khách hàng không để lại nội dung."}</p></div>
          {selectedReview.status === "REJECTED" && selectedReview.rejectionReason && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700"><b>Lý do từ chối:</b> {selectedReview.rejectionReason}</div>}
          {selectedReview.status === "PENDING" && <div className="flex justify-end gap-2"><Button danger icon={<XCircle size={16} />} onClick={() => openReject(selectedReview)}>Từ chối</Button><Popconfirm title="Duyệt đánh giá này?" description="Đánh giá sẽ được hiển thị công khai." okText="Duyệt" cancelText="Hủy" onConfirm={() => void handleApprove(selectedReview)}><Button type="primary" icon={<CheckCircle2 size={16} />}>Duyệt đánh giá</Button></Popconfirm></div>}
        </div>}
      </Modal>

      <Modal open={Boolean(rejectingReview)} onCancel={() => setRejectingReview(null)} title="Từ chối đánh giá" okText="Xác nhận từ chối" cancelText="Hủy" okButtonProps={{ danger: true }} onOk={() => void handleReject()}>
        <p className="mb-3 text-slate-600">Lý do này sẽ được lưu lại để nhân viên và khách hàng hiểu quyết định kiểm duyệt.</p>
        <Input.TextArea value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} rows={4} maxLength={255} showCount placeholder="Ví dụ: Nội dung chứa ngôn từ không phù hợp hoặc không liên quan sản phẩm." />
      </Modal>
    </div>
  );
}
