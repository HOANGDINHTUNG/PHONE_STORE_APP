import { AccountShell } from "../components/AccountShell";
import { Info, Gavel, UserCheck, Store, Shield, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AccountTermsPage() {
  const navigate = useNavigate();

  return (
    <AccountShell title="" description="">
      <div className="-mt-2">
        <h1
          className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary mb-8 border-b-2 border-primary/20 pb-4 tracking-tight"
          style={{ fontSize: "32px", lineHeight: "40px" }}
        >
          Điều khoản sử dụng
        </h1>

        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary-container mb-4 flex items-center gap-2 font-bold">
              <Info className="text-primary-container shrink-0" size={24} />
              1. Giới thiệu
            </h2>
            <div className="text-body-md font-body-md text-on-surface-variant space-y-4 leading-relaxed">
              <p>
                Chào mừng bạn đến với PinkPhone. Bằng việc truy cập và sử dụng
                website của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi
                các điều khoản và điều kiện sử dụng dưới đây. Vui lòng đọc kỹ
                trước khi tiếp tục sử dụng dịch vụ.
              </p>
              <p>
                PinkPhone có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ
                phần nào trong Điều khoản sử dụng này vào bất cứ lúc nào. Các
                thay đổi có hiệu lực ngay khi được đăng trên trang web mà không
                cần thông báo trước.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary-container mb-4 flex items-center gap-2 font-bold">
              <Gavel className="text-primary-container shrink-0" size={24} />
              2. Quy định chung
            </h2>
            <div className="text-body-md font-body-md text-on-surface-variant space-y-4 leading-relaxed bg-surface-container-low p-6 rounded-xl border border-outline-variant/40">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Người dùng phải đủ 18 tuổi hoặc truy cập dưới sự giám sát của
                  cha mẹ/người giám hộ hợp pháp.
                </li>
                <li>
                  Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục
                  đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu
                  không được chúng tôi cho phép bằng văn bản.
                </li>
                <li>
                  Thông tin hiển thị trên website chỉ mang tính chất tham khảo.
                  Mọi quyết định mua hàng dựa trên thông tin này do người dùng
                  tự chịu trách nhiệm.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary-container mb-4 flex items-center gap-2 font-bold">
              <UserCheck
                className="text-primary-container shrink-0"
                size={24}
              />
              3. Quyền và nghĩa vụ của khách hàng
            </h2>
            <div className="text-body-md font-body-md text-on-surface-variant space-y-4 leading-relaxed">
              <p>
                Khách hàng có quyền yêu cầu hỗ trợ, bảo hành sản phẩm theo chính
                sách của PinkPhone. Khách hàng có trách nhiệm cung cấp thông tin
                chính xác khi đăng ký tài khoản và thanh toán.
              </p>
              <p>
                Bạn phải bảo mật mật khẩu và thông tin tài khoản. PinkPhone
                không chịu trách nhiệm đối với những thiệt hại hoặc mất mát phát
                sinh từ việc bạn không tuân thủ quy định bảo mật này.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary-container mb-4 flex items-center gap-2 font-bold">
              <Store className="text-primary-container shrink-0" size={24} />
              4. Quyền và trách nhiệm của PinkPhone
            </h2>
            <div className="text-body-md font-body-md text-on-surface-variant space-y-4 leading-relaxed">
              <p>
                PinkPhone cam kết cung cấp sản phẩm chính hãng và dịch vụ chất
                lượng cao. Chúng tôi có quyền từ chối hoặc hủy đơn hàng vì bất
                kỳ lý do gì vào bất kỳ lúc nào.
              </p>
              <p>
                Chúng tôi nỗ lực hiển thị hình ảnh và màu sắc sản phẩm chính xác
                nhất. Tuy nhiên, màu sắc thực tế có thể khác biệt đôi chút tùy
                thuộc vào màn hình thiết bị của bạn.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary-container mb-4 flex items-center gap-2 font-bold">
              <Shield className="text-primary-container shrink-0" size={24} />
              5. Chính sách bảo mật thông tin
            </h2>
            <div className="text-body-md font-body-md text-on-surface-variant space-y-4 leading-relaxed bg-surface-container-low p-6 rounded-xl border border-outline-variant/40">
              <p>
                PinkPhone tôn trọng và cam kết bảo vệ thông tin cá nhân của bạn.
                Dữ liệu của bạn được thu thập nhằm mục đích xử lý đơn hàng, cải
                thiện dịch vụ và cung cấp các chương trình khuyến mãi phù hợp.
              </p>
              <p>
                Chúng tôi áp dụng các biện pháp an ninh kỹ thuật tiên tiến để
                chống mất mát, phá hoại hoặc truy cập trái phép dữ liệu. Vui
                lòng tham khảo thêm tại{" "}
                <a
                  className="text-primary font-semibold hover:underline"
                  href="#"
                >
                  Chính sách Bảo mật
                </a>{" "}
                chi tiết của chúng tôi.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-headline-md font-headline-md text-primary-container mb-4 flex items-center gap-2 font-bold">
              <Scale className="text-primary-container shrink-0" size={24} />
              6. Giải quyết tranh chấp
            </h2>
            <div className="text-body-md font-body-md text-on-surface-variant space-y-4 leading-relaxed">
              <p>
                Mọi tranh chấp phát sinh từ việc sử dụng website hoặc giao dịch
                mua bán sẽ được giải quyết trước tiên thông qua thương lượng hòa
                giải. Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra
                cơ quan có thẩm quyền tại Việt Nam giải quyết theo quy định của
                pháp luật hiện hành.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-outline-variant/30 flex justify-between items-center text-sm text-on-surface-variant">
          <span className="font-medium">Cập nhật lần cuối: 15/05/2024</span>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-bold hover:bg-secondary active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </AccountShell>
  );
}
