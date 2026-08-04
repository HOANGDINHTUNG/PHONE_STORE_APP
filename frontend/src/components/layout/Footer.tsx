import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall } from "lucide-react";
import { FacebookFilled, YoutubeFilled } from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant">
      <div className="max-w-[1200px] mx-auto px-lg py-xl">
        <div className="flex flex-col md:flex-row justify-between gap-xl mb-xl">
          <div className="max-w-[320px]">
            <div className="text-body-lg font-body-lg font-bold text-primary mb-md">
              PinkPhone
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
              Hệ thống bán lẻ điện thoại cao cấp với phong cách trẻ trung và
              dịch vụ chuyên nghiệp hàng đầu Việt Nam.
            </p>
            <div className="flex gap-md">
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary-fixed transition-colors"
                href="#"
              >
                <FacebookFilled style={{ fontSize: "20px" }} />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary-fixed transition-colors"
                href="#"
              >
                <YoutubeFilled style={{ fontSize: "20px" }} />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary-fixed transition-colors"
                href="tel:18006601"
              >
                <PhoneCall size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-xl w-full md:w-auto flex-1 md:ml-12">
            <div className="flex flex-col gap-sm">
              <h4 className="text-label-sm font-label-sm text-on-surface uppercase mb-xs font-bold">
                Về PinkPhone
              </h4>
              <Link
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors block"
                to="#"
              >
                Tin công nghệ
              </Link>
              <Link
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors block"
                to="#"
              >
                Tuyển dụng
              </Link>
              <Link
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors block"
                to="#"
              >
                Điều khoản sử dụng
              </Link>
            </div>
            <div className="flex flex-col gap-sm">
              <h4 className="text-label-sm font-label-sm text-on-surface uppercase mb-xs font-bold">
                Hỗ trợ khách hàng
              </h4>
              <Link
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors block"
                to="#"
              >
                Chính sách bảo hành
              </Link>
              <Link
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors block"
                to="#"
              >
                Chính sách đổi trả
              </Link>
              <Link
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors block"
                to="#"
              >
                Giao hàng & Thanh toán
              </Link>
            </div>
            <div className="flex flex-col gap-sm col-span-2 sm:col-span-1">
              <h4 className="text-label-sm font-label-sm text-on-surface uppercase mb-xs font-bold">
                Đăng ký nhận tin
              </h4>
              <p className="text-label-sm text-on-surface-variant mb-2">
                Nhận thông tin khuyến mãi sớm nhất.
              </p>
              <div className="flex w-full max-w-sm">
                <input
                  className="bg-surface-container-low border border-outline-variant border-r-0 rounded-l-lg p-2 text-label-sm w-full focus:ring-1 focus:ring-primary focus:outline-none focus:border-primary transition-all"
                  placeholder="Email của bạn"
                  type="email"
                />
                <button className="bg-primary text-white px-md text-label-sm rounded-r-lg hover:bg-secondary transition-colors font-semibold whitespace-nowrap">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="text-label-sm font-label-sm text-on-surface-variant">
            © 2026 PinkPhone. All rights reserved.
          </p>
          <div className="flex gap-md grayscale opacity-50 items-center">
            <span className="font-bold text-xs uppercase text-on-surface-variant">
              Visa
            </span>
            <span className="font-bold text-xs uppercase text-on-surface-variant">
              Mastercard
            </span>
            <span className="font-bold text-xs uppercase text-on-surface-variant">
              JCB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
