import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../../../app/App";

describe("Account routes", () => {
  it("hiển thị lịch sử mua hàng chỉ gồm điện thoại", () => {
    render(
      <MemoryRouter initialEntries={["/tai-khoan/lich-su-mua-hang"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Lịch sử mua hàng", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Xiaomi 14 Ultra")).toBeInTheDocument();
    expect(screen.queryByText(/Apple Watch/i)).not.toBeInTheDocument();
  });

  it("hiển thị hộp thoại xác nhận đăng xuất", () => {
    render(
      <MemoryRouter initialEntries={["/tai-khoan/dang-xuat"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("dialog", { name: "Xác nhận đăng xuất" })).toBeInTheDocument();
  });

  it("dùng sidebar đầy đủ trên trang tổng quan", () => {
    render(
      <MemoryRouter initialEntries={["/tai-khoan"]}>
        <App />
      </MemoryRouter>,
    );

    const sidebar = screen.getByRole("navigation", { name: "Khu vực tài khoản" });
    expect(sidebar).toHaveTextContent("Đánh giá của tôi");
    expect(sidebar).toHaveTextContent("Đổi trả & hoàn tiền");
    expect(sidebar).toHaveTextContent("Thông báo");
    expect(sidebar).toHaveTextContent("Liên kết tài khoản");
  });
});
