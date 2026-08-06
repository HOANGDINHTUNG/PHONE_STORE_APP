export interface AvailableVoucher {
  id: string;
  code: string;
  name: string;
  type: "PERCENT" | "FIXED";
  discountValue: number;
  maximumDiscountAmount?: number;
  minimumOrderValue?: number;
  description: string;
  hasUsed?: boolean;
}

export const USER_VOUCHERS_LIST: AvailableVoucher[] = [
  {
    id: "v1",
    code: "NEWBIE",
    name: "Voucher Chào Mới",
    type: "FIXED",
    discountValue: 100000,
    minimumOrderValue: 500000,
    description: "Giảm 100K cho đơn hàng từ 500K. Nhập mã tại bước thanh toán.",
  },
  {
    id: "v2",
    code: "FLASHSALE20",
    name: "Flash Sale Giảm 20%",
    type: "PERCENT",
    discountValue: 20,
    maximumDiscountAmount: 500000,
    minimumOrderValue: 2000000,
    description: "Giảm 20% tối đa 500K cho các sản phẩm công nghệ.",
  },
  {
    id: "v3",
    code: "SAMSUNGFAN",
    name: "Voucher 300k Samsung",
    type: "FIXED",
    discountValue: 300000,
    minimumOrderValue: 5000000,
    description:
      "Tặng thêm 300k cho khách hàng mua điện thoại Samsung dòng Galaxy S và Z.",
  },
  {
    id: "v4",
    code: "PINKVOUCHER",
    name: "Pink Phone Member",
    type: "FIXED",
    discountValue: 1000000,
    minimumOrderValue: 25000000,
    description: "Giảm ngay 1 triệu đồng cho khách hàng thành viên VVIP.",
  },
];
