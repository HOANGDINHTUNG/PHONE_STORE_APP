# Phone Store Backend — Project Constitution

## 1. Phạm vi áp dụng

Áp dụng các quy tắc trong tài liệu này cho toàn bộ backend của dự án
Phone Store, bao gồm:

- Khởi tạo và cấu hình dự án.
- Thiết kế kiến trúc.
- Database và migration.
- REST API.
- Authentication và Authorization.
- Catalog và tồn kho.
- Giỏ hàng và checkout.
- Đơn hàng, thanh toán và giao hàng.
- Validation và xử lý lỗi.
- Testing và kiểm soát chất lượng.
- Logging, monitoring và audit.
- Docker, CI/CD và triển khai.

Các quy tắc trong tài liệu này là nguyên tắc nền tảng. Không được bỏ qua
chỉ để hoàn thành tác vụ nhanh hơn.

---

## 2. Mục tiêu hệ thống

Xây dựng một backend bán điện thoại:

- Đúng nghiệp vụ.
- Bảo mật.
- Dễ kiểm thử.
- Dễ bảo trì.
- Có khả năng mở rộng.
- Có tài liệu rõ ràng.
- Không phụ thuộc vào một frontend cụ thể.
- Phục vụ đồng thời ReactJS và React Native.
- Có thể triển khai trong môi trường thực tế.

Ưu tiên tính đúng đắn, toàn vẹn dữ liệu và khả năng bảo trì hơn việc
tạo ra nhiều code trong thời gian ngắn.

---

## 3. Kiến trúc nền tảng

Sử dụng kiến trúc Modular Monolith với Spring Boot.

Tổ chức source code theo module nghiệp vụ, ví dụ:

- auth
- user
- catalog
- inventory
- cart
- order
- payment
- shipping
- promotion
- review
- notification
- administration

Bên trong mỗi module có thể chia thành:

- controller
- dto
- entity
- repository
- service
- mapper
- validation
- specification
- enumeration

Không chuyển sang Microservices nếu chưa có yêu cầu rõ ràng, dữ liệu đo lường
hoặc quyết định kiến trúc được phê duyệt.

---

## 4. Công nghệ nền tảng

Backend sử dụng:

- Java 21.
- Spring Boot.
- Gradle và Gradle Wrapper.
- Spring Web.
- Spring Data JPA.
- Spring Security.
- Bean Validation.
- MySQL.
- Flyway Database Migration.
- JWT Authentication.
- OpenAPI.
- JUnit.
- Mockito.
- Testcontainers khi cần kiểm thử với database thật.
- Docker và Docker Compose.

Phiên bản thư viện phải được khai báo và khóa trong `build.gradle`.

Không ghi cứng phiên bản thư viện trong Rule này vì phiên bản thực tế
phải được lấy từ source code của dự án.

Không thêm dependency mới nếu:

- Chưa xác định rõ mục đích.
- Chức năng tương tự đã tồn tại.
- Dependency không được bảo trì.
- Dependency tạo ra rủi ro bảo mật không cần thiết.
- Có thể giải quyết rõ ràng bằng thư viện hiện tại.

---

## 5. Thứ tự nguồn sự thật

Khi phân tích dự án, sử dụng các nguồn theo chức năng sau:

### Yêu cầu mong muốn

- Yêu cầu hiện tại của người dùng.
- Tài liệu yêu cầu đã được phê duyệt.
- Business Rules.
- Architecture Decision Records.

### Trạng thái database hiện tại

- Flyway migrations.
- Database schema thực tế.
- Entity và Repository.

### Hợp đồng API hiện tại

- OpenAPI specification.
- API documentation.
- Controller và DTO.
- API integration tests.

### Hành vi hệ thống hiện tại

- Source code.
- Configuration.
- Automated tests.
- Kết quả chạy ứng dụng.

### Phương pháp thực hiện

- Rules.
- Skills.
- Workflows.
- Reference documents.

Nếu các nguồn mâu thuẫn:

1. Không tự ý che giấu mâu thuẫn.
2. Xác định nguồn nào mô tả hiện trạng.
3. Xác định nguồn nào mô tả mong muốn.
4. Phân tích phạm vi ảnh hưởng.
5. Đề xuất cách đồng bộ.
6. Yêu cầu xác nhận nếu quyết định có thể thay đổi nghiệp vụ.

Không được xem nội dung AI tạo ra là sự thật nếu chưa đối chiếu với source code,
migration, tài liệu hoặc kết quả kiểm thử.

---

## 6. Chế độ thực hiện tác vụ

Trước khi làm việc, xác định yêu cầu thuộc chế độ nào:

- `ANALYZE`: Phân tích, không chỉnh sửa file.
- `DESIGN`: Thiết kế giải pháp, không tự động triển khai.
- `IMPLEMENT`: Tạo hoặc chỉnh sửa source code.
- `REFACTOR`: Cải thiện code nhưng không thay đổi nghiệp vụ.
- `DEBUG`: Xác định nguyên nhân lỗi.
- `FIX`: Sửa lỗi đã xác định.
- `TEST`: Tạo hoặc chạy kiểm thử.
- `REVIEW`: Review code, không tự động sửa.
- `DOCUMENT`: Tạo hoặc cập nhật tài liệu.
- `DEPLOY`: Chuẩn bị hoặc thực hiện triển khai.

Không tự chuyển từ `ANALYZE`, `DESIGN`, `DEBUG` hoặc `REVIEW`
sang chỉnh sửa source code nếu người dùng chưa yêu cầu.

Khi người dùng yêu cầu xây dựng hoặc sửa chức năng, được phép thực hiện
những thay đổi cần thiết trong phạm vi chức năng đó.

---

## 7. Quy tắc lập kế hoạch

Phải lập kế hoạch trước khi:

- Thay đổi nhiều module.
- Thay đổi database schema.
- Thay đổi Authentication hoặc Authorization.
- Thay đổi hợp đồng API công khai.
- Thay đổi trạng thái đơn hàng hoặc thanh toán.
- Thay đổi cách quản lý tồn kho.
- Thêm dịch vụ tích hợp bên ngoài.
- Thay đổi Docker hoặc cấu hình triển khai.
- Thực hiện thay đổi có nguy cơ mất dữ liệu.

Kế hoạch phải nêu:

1. Mục tiêu.
2. Hiện trạng liên quan.
3. Thành phần bị ảnh hưởng.
4. Thứ tự thực hiện.
5. Rủi ro.
6. Cách kiểm thử.
7. Cách rollback nếu cần.

Không bắt đầu thay đổi có tính phá vỡ nếu chưa xác định được cách migration
và khả năng tương thích.

---

## 8. Quy tắc kiến trúc bắt buộc

Luồng xử lý chuẩn:

Controller → Request DTO → Service → Repository → Database

Luồng trả kết quả:

Database → Entity → Mapper → Response DTO → Controller

Bắt buộc:

- Controller chỉ xử lý HTTP và điều phối request.
- Service chịu trách nhiệm xử lý nghiệp vụ.
- Repository chỉ chịu trách nhiệm truy cập dữ liệu.
- Entity không được trả trực tiếp ra API.
- Request DTO chịu trách nhiệm validation đầu vào.
- Response DTO chỉ chứa dữ liệu client cần.
- Mapper chịu trách nhiệm chuyển đổi Entity và DTO.
- Exception được xử lý tập trung.
- Module chỉ phụ thuộc vào module khác thông qua hợp đồng rõ ràng.
- Không tạo circular dependency giữa các module.
- Không đặt code nghiệp vụ riêng của một module vào `common`.

Thư mục `common` chỉ chứa thành phần thật sự dùng chung và không phụ thuộc
vào nghiệp vụ cụ thể.

---

## 9. Bất biến nghiệp vụ thương mại điện tử

Các nguyên tắc sau không được vi phạm:

### Sản phẩm

- `Product` đại diện cho một mẫu điện thoại.
- `ProductVariant` đại diện cho một phiên bản bán cụ thể.
- Màu sắc, RAM, bộ nhớ và SKU thuộc về biến thể.
- SKU phải duy nhất.
- Giá bán được quản lý theo biến thể.
- Tồn kho được quản lý theo biến thể.
- Sản phẩm ngừng kinh doanh không được bán mới.

### Tiền tệ

- Java phải sử dụng `BigDecimal`.
- Database phải sử dụng `DECIMAL`.
- Không sử dụng `float` hoặc `double` cho tiền.
- Client không được tự quyết định giá.
- Backend phải tính subtotal, discount, shipping fee và total.
- Quy tắc làm tròn phải nhất quán.

### Giỏ hàng

- Một biến thể chỉ xuất hiện một lần trong cùng một giỏ hàng.
- Số lượng phải lớn hơn không.
- Không cho phép số lượng vượt quá tồn kho khả dụng.
- Guest cart phải có cơ chế nhận diện an toàn.
- Việc gộp Guest cart và Customer cart phải xử lý sản phẩm trùng.

### Đơn hàng

- Order item phải lưu snapshot của sản phẩm tại thời điểm mua.
- Snapshot tối thiểu gồm tên sản phẩm, SKU, giá và thuộc tính biến thể.
- Thay đổi sản phẩm sau này không được làm thay đổi đơn hàng cũ.
- Trạng thái đơn hàng chỉ được chuyển theo state machine hợp lệ.
- Không được cập nhật trạng thái tùy ý.
- Không xóa cứng đơn hàng và order item đã phát sinh giao dịch.

### Thanh toán

- Trạng thái thanh toán và trạng thái đơn hàng phải được quản lý riêng.
- Không đánh dấu thanh toán thành công dựa trên dữ liệu từ frontend.
- Payment callback phải được xác minh.
- Payment callback phải có cơ chế idempotency.
- Một callback lặp lại không được trừ tiền hoặc cập nhật đơn hàng lần thứ hai.

### Tồn kho

- Tồn kho không được âm.
- Thao tác giữ hàng, trừ kho và hoàn kho phải chạy trong transaction.
- Phải xử lý trường hợp nhiều người cùng mua một sản phẩm.
- Hủy đơn phải hoàn kho hoặc giải phóng lượng hàng đã giữ theo đúng nghiệp vụ.

---

## 10. Người dùng và phân quyền

Hệ thống có các nhóm người dùng cơ bản:

- `GUEST`
- `CUSTOMER`
- `STAFF`
- `ADMIN`

`GUEST` không phải tài khoản hoặc role được lưu trong database.

Hệ thống phải cho phép mở rộng thêm role nghiệp vụ trong tương lai,
ví dụ:

- ORDER_OPERATOR
- INVENTORY_MANAGER
- CUSTOMER_SUPPORT
- CONTENT_MANAGER

Không hard-code nghiệp vụ theo giả định hệ thống mãi mãi chỉ có
CUSTOMER, STAFF và ADMIN.

Bắt buộc kiểm tra quyền ở backend.

Việc ẩn nút hoặc trang trên frontend không được xem là cơ chế phân quyền.

Ngoài role, phải kiểm tra quyền sở hữu khi người dùng truy cập:

- Hồ sơ cá nhân.
- Địa chỉ.
- Giỏ hàng.
- Wishlist.
- Đơn hàng.
- Thanh toán.
- Đánh giá.
- File riêng tư.

---

## 11. Bảo mật nền tảng

Bắt buộc:

- Không hard-code mật khẩu, JWT secret hoặc API key.
- Không commit file `.env`.
- Cung cấp `.env.example` không chứa giá trị bí mật.
- Không ghi password, token hoặc secret vào log.
- Mật khẩu phải được băm bằng PasswordEncoder phù hợp.
- Access token phải có thời hạn ngắn.
- Refresh token phải có khả năng rotation và revoke.
- Đăng xuất phải vô hiệu hóa refresh token liên quan.
- Phân biệt chính xác HTTP 401 và 403.
- Kiểm tra trạng thái tài khoản trước khi xác thực.
- Kiểm tra loại file, dung lượng và nội dung upload.
- Không tin tưởng dữ liệu giá hoặc quyền do frontend gửi lên.
- Không để lộ stack trace nội bộ trong API response production.

Áp dụng nguyên tắc quyền tối thiểu cần thiết.

---

## 12. Database và tính toàn vẹn dữ liệu

Flyway migration là nguồn sự thật của database schema.

Bắt buộc:

- Mọi thay đổi schema phải có migration mới.
- Không sửa migration đã được áp dụng ở môi trường dùng chung.
- Không sử dụng `ddl-auto=update` trong production.
- Ưu tiên `ddl-auto=validate` khi sử dụng Flyway.
- Khai báo primary key, foreign key và unique constraint ở database.
- Tạo index dựa trên truy vấn thực tế.
- Không tạo index trùng lặp.
- Sử dụng kiểu dữ liệu phù hợp.
- Lưu thời gian theo chuẩn thống nhất.
- Không xóa cứng dữ liệu có liên quan đến giao dịch.
- Dữ liệu cần truy vết phải có audit hoặc status history.

Không chỉ dựa vào validation của Java để bảo vệ tính toàn vẹn dữ liệu.

---

## 13. Transaction và xử lý đồng thời

Sử dụng transaction cho các nghiệp vụ nhiều bước, bao gồm:

- Checkout.
- Tạo đơn hàng.
- Trừ hoặc hoàn tồn kho.
- Áp dụng coupon.
- Cập nhật thanh toán.
- Hủy đơn hàng.
- Hoàn tiền.
- Gộp giỏ hàng.

Không thực hiện network call kéo dài trong database transaction nếu có thể tránh.

Với nghiệp vụ tồn kho và thanh toán:

- Phải xác định transaction boundary.
- Phải xử lý retry hoặc duplicate request khi cần.
- Phải xem xét optimistic hoặc pessimistic locking.
- Phải có cơ chế idempotency cho thao tác nhạy cảm.

---

## 14. An toàn khi thay đổi source code

Trước khi chỉnh sửa:

1. Đọc file liên quan.
2. Kiểm tra cấu trúc module.
3. Tìm nơi đang sử dụng thành phần cần sửa.
4. Kiểm tra thay đổi hiện có của người dùng.
5. Xác định ảnh hưởng đến API, database và test.

Trong khi chỉnh sửa:

- Chỉ thay đổi trong phạm vi cần thiết.
- Không ghi đè thay đổi không liên quan.
- Không xóa code chỉ vì chưa hiểu mục đích.
- Không đổi tên hàng loạt nếu không cần thiết.
- Không thêm abstraction khi chỉ có một trường hợp sử dụng.
- Không tạo interface, factory hoặc pattern không mang lại lợi ích rõ ràng.
- Không dùng lệnh Git có khả năng phá hủy thay đổi.
- Không xóa dữ liệu hoặc migration khi chưa được phép.

Sau khi chỉnh sửa:

- Kiểm tra diff.
- Kiểm tra import thừa.
- Kiểm tra compile.
- Chạy test liên quan.
- Kiểm tra phân quyền.
- Kiểm tra database migration nếu có.
- Cập nhật tài liệu khi hợp đồng thay đổi.

---

## 15. Testing và xác minh

Không được tuyên bố chức năng hoàn thành chỉ vì source code đã được tạo.

Tùy theo phạm vi, phải thực hiện:

- Unit test cho business logic.
- Repository test cho truy vấn.
- Controller test cho HTTP contract.
- Security test cho authentication và authorization.
- Integration test cho luồng nhiều thành phần.
- Test rollback cho transaction quan trọng.
- Test concurrent request cho tồn kho khi cần.
- Test idempotency cho payment callback.
- Test migration với database tương thích.

Sử dụng Gradle Wrapper của dự án để build và test.

Nếu không thể chạy test:

1. Nêu rõ test chưa được chạy.
2. Nêu nguyên nhân.
3. Không báo kết quả là đã xác minh.
4. Cung cấp lệnh kiểm tra phù hợp.

Không che giấu test thất bại.

---

## 16. Definition of Done

Một chức năng chỉ được xem là hoàn thành khi:

- Nghiệp vụ đã được xác định.
- Kiến trúc phù hợp.
- Database migration đã được xử lý nếu cần.
- Request và Response DTO đầy đủ.
- Validation đầy đủ.
- Exception handling đầy đủ.
- Authentication và Authorization đầy đủ.
- Transaction được xác định đúng.
- Có kiểm tra dữ liệu đồng thời nếu cần.
- Unit test quan trọng đã có.
- Integration test quan trọng đã có.
- Build thành công.
- Test liên quan thành công.
- Không làm lộ secret.
- Không phá vỡ API ngoài ý muốn.
- Tài liệu liên quan đã được cập nhật.
- Các giới hạn chưa xác minh đã được nêu rõ.

---

## 17. Cách báo cáo kết quả

Sau mỗi tác vụ, báo cáo ngắn gọn:

1. Kết quả đã thực hiện.
2. File hoặc module đã thay đổi.
3. Quyết định kỹ thuật quan trọng.
4. Cách đã kiểm tra.
5. Test đã chạy và kết quả.
6. Rủi ro hoặc vấn đề còn lại.
7. Bước tiếp theo nếu có.

Phân biệt rõ:

- Hiện trạng đã kiểm tra.
- Thay đổi đã thực hiện.
- Đề xuất chưa triển khai.
- Giả định chưa được xác minh.

Không bịa kết quả build, test hoặc triển khai.