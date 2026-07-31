import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("mở popover dành cho khách chưa đăng nhập", () => {
    render(
      <MemoryRouter>
        <SiteHeader search="" onSearch={() => undefined} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mở tài khoản" }));

    expect(screen.getByRole("dialog", { name: "Tài khoản chưa đăng nhập" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Đăng nhập/ })).toHaveAttribute("href", "/dang-nhap");
    expect(screen.getByRole("link", { name: /Đăng ký tài khoản/ })).toHaveAttribute("href", "/dang-ky");
  });
});
