import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("hiển thị lỗi khi gửi form trống", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(
      screen.getByText("Vui lòng nhập email hoặc số điện thoại."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mật khẩu cần có ít nhất 6 ký tự."),
    ).toBeInTheDocument();
  });

  it("cho phép hiện và ẩn mật khẩu", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const password = screen.getByLabelText("Mật khẩu");
    expect(password).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Hiện mật khẩu" }));
    expect(password).toHaveAttribute("type", "text");
  });
});
