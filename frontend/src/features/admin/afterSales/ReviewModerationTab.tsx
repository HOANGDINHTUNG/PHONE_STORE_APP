import React, { useMemo, useState } from "react";
import { Button, Input, Select, Table, message } from "antd";
import { CheckCircle2, Filter, MoreVertical, Search, Star, XCircle } from "lucide-react";
import { afterSalesService } from "./afterSalesService";
import { ReviewItem, ReviewStatus } from "./afterSalesTypes";

export function ReviewModerationTab() {
  const [reloadKey, setReloadKey] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const reviews = useMemo(() => {
    let list = afterSalesService.getReviews();

    if (statusFilter !== "ALL") {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (ratingFilter !== "ALL") {
      const starNum = parseInt(ratingFilter, 10);
      list = list.filter((r) => r.rating === starNum);
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerEmail.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
      );
    }

    return list;
  }, [statusFilter, ratingFilter, searchText, reloadKey]);

  const handleApprove = (id: string) => {
    afterSalesService.approveReview(id);
    message.success("Đã duyệt đánh giá thành công.");
    setReloadKey((prev) => prev + 1);
  };

  const handleConfirmReject = (id: string) => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối đánh giá.");
      return;
    }
    afterSalesService.rejectReview(id, rejectReason);
    message.info("Đã từ chối đánh giá.");
    setRejectingId(null);
    setRejectReason("");
    setReloadKey((prev) => prev + 1);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  const renderStatusBadge = (record: ReviewItem) => {
    switch (record.status) {
      case "APPROVED":
        return (
          <div>
            <span className="inline-block rounded-full bg-[#168a51] px-3 py-1 text-xs font-black text-white">
              APPROVED
            </span>
            {record.moderatedBy && (
              <div className="mt-1 text-[11px] font-medium text-slate-400">
                Đã duyệt bởi: {record.moderatedBy}
              </div>
            )}
          </div>
        );
      case "REJECTED":
        return (
          <div>
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
              REJECTED
            </span>
            {record.rejectionReason && (
              <div className="mt-1 text-[11px] text-red-500">
                Lý do: {record.rejectionReason}
              </div>
            )}
          </div>
        );
      default:
        return (
          <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-700">
            PENDING
          </span>
        );
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      width: 220,
      render: (_: any, record: ReviewItem) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src={record.image}
              alt={record.productName}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <div className="font-extrabold text-slate-900">{record.productName}</div>
            <div className="text-xs text-slate-400">SKU: {record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 180,
      render: (_: any, record: ReviewItem) => (
        <div>
          <div className="font-bold text-slate-900">{record.customerName}</div>
          <div className="text-xs text-slate-400">{record.customerEmail}</div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      render: (val: number) => renderStars(val),
    },
    {
      title: "Nội dung",
      key: "comment",
      render: (_: any, record: ReviewItem) => (
        <div className="space-y-2">
          <div className="text-sm text-slate-700 leading-relaxed">{record.comment}</div>
          {rejectingId === record.id && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Input
                placeholder="Nhập lý do từ chối (bắt buộc)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                size="small"
                className="w-64 border-red-300 focus:border-red-500"
              />
              <button
                onClick={() => handleConfirmReject(record.id)}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Xác nhận Từ chối
              </button>
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
                className="text-xs text-slate-400 hover:underline"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (text: string) => <span className="text-xs text-slate-500">{text}</span>,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 150,
      render: (_: any, record: ReviewItem) => renderStatusBadge(record),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 110,
      render: (_: any, record: ReviewItem) => (
        <div className="flex items-center gap-2">
          {record.status === "PENDING" && (
            <>
              <button
                onClick={() => handleApprove(record.id)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                title="Duyệt đánh giá"
              >
                <CheckCircle2 size={17} />
              </button>
              <button
                onClick={() => setRejectingId(record.id)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                title="Từ chối đánh giá"
              >
                <XCircle size={17} />
              </button>
            </>
          )}
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <MoreVertical size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Bar matching Image 1 */}
      <section className="rounded-2xl border border-[#eed2db] bg-white p-4 shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Tìm theo ID, Khách hàng hoặc Sản phẩm..."
            prefix={<Search size={16} className="mr-1 text-slate-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-72"
            size="large"
            allowClear
          />

          <Select
            value={ratingFilter}
            onChange={(val) => setRatingFilter(val)}
            size="large"
            className="w-44"
            options={[
              { label: "Tất cả Đánh giá", value: "ALL" },
              { label: "5 Sao", value: "5" },
              { label: "4 Sao", value: "4" },
              { label: "3 Sao", value: "3" },
              { label: "2 Sao", value: "2" },
              { label: "1 Sao", value: "1" },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="large"
            className="w-48"
            options={[
              { label: "Trạng thái: PENDING", value: "PENDING" },
              { label: "Trạng thái: APPROVED", value: "APPROVED" },
              { label: "Trạng thái: REJECTED", value: "REJECTED" },
              { label: "Tất cả trạng thái", value: "ALL" },
            ]}
          />

          <Button
            size="large"
            icon={<Filter size={16} />}
            className="ml-auto rounded-xl border-[#efd3dc] font-bold text-slate-700 hover:border-[#c2185b] hover:text-[#c2185b]"
          >
            Bộ lọc nâng cao
          </Button>
        </div>
      </section>

      {/* Review Table Section */}
      <section className="overflow-hidden rounded-2xl border border-[#eed2db] bg-white shadow-[0_3px_10px_rgba(79,20,45,0.02)]">
        <Table
          dataSource={reviews}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total, range) => (
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <b className="text-slate-800">{range[0]}-{range[1]}</b> trên <b className="text-slate-800">{total}</b> đánh giá
              </span>
            ),
          }}
        />
      </section>
    </div>
  );
}
