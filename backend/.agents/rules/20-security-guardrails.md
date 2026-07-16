# Phone Store Backend — Security Guardrails

## 1. Phạm vi áp dụng

Áp dụng tài liệu này cho toàn bộ chức năng có liên quan đến:

- Authentication.
- Authorization.
- JWT access token.
- Refresh token.
- Đăng nhập và đăng xuất.
- Đăng ký tài khoản.
- Quên và đổi mật khẩu.
- Email verification.
- Quản lý phiên đăng nhập.
- Role và permission.
- Quyền sở hữu tài nguyên.
- CORS và CSRF.
- File upload.
- Payment callback.
- External integration.
- Secret và key.
- Logging bảo mật.
- Rate limiting.
- Security testing.
- Cấu hình production.

Tài liệu này mở rộng:

- `00-project-constitution.md`.
- `10-java-spring-standards.md`.

Nếu có xung đột:

1. Tuân thủ `00-project-constitution.md`.
2. Chọn phương án an toàn hơn.
3. Không tự ý giảm mức bảo vệ.
4. Báo cáo rõ xung đột và ảnh hưởng.
5. Yêu cầu xác nhận nếu thay đổi ảnh hưởng kiến trúc xác thực hoặc dữ liệu người dùng.

---

## 2. Nguyên tắc bảo mật nền tảng

Mọi chức năng phải tuân thủ:

- Secure by Default.
- Deny by Default.
- Least Privilege.
- Defense in Depth.
- Never Trust Client Input.
- Validate Every Request.
- Fail Securely.
- Minimize Attack Surface.
- Separate Duties.
- Minimize Sensitive Data.
- Log Security-Relevant Events.
- Do Not Rely on Security Through Obscurity.

Không xem bảo mật là bước được bổ sung sau khi code hoàn thành.

Bảo mật phải được xem xét từ:

```text
Yêu cầu
→ Thiết kế
→ Database
→ API
→ Code
→ Testing
→ Deployment
→ Monitoring
```

Frontend không phải ranh giới bảo mật.

Việc ẩn nút, trang hoặc menu trên ReactJS và React Native không thay thế
authorization tại backend.

---

## 3. Trust boundaries

Phải xem mọi dữ liệu bên ngoài backend là không đáng tin cậy, bao gồm:

- Request từ ReactJS.
- Request từ React Native.
- Header.
- Cookie.
- JWT.
- Query parameter.
- Path variable.
- Multipart file.
- Payment callback.
- Webhook.
- Email link.
- URL do người dùng cung cấp.
- Dữ liệu từ dịch vụ vận chuyển.
- Dữ liệu từ cloud storage.
- Dữ liệu từ admin interface.
- Dữ liệu từ internal service nếu chưa xác thực.

Không tin tưởng request chỉ vì nó đến từ:

- Frontend của dự án.
- Mobile app chính thức.
- Internal network.
- Admin dashboard.
- Một địa chỉ IP đã biết.

Mỗi request phải được:

1. Xác thực nếu không phải public endpoint.
2. Kiểm tra quyền.
3. Kiểm tra quyền sở hữu nếu có tài nguyên cụ thể.
4. Validation dữ liệu.
5. Kiểm tra trạng thái nghiệp vụ.
6. Ghi audit nếu là thao tác nhạy cảm.

---

## 4. Spring Security configuration

Sử dụng cấu hình Spring Security dựa trên `SecurityFilterChain`.

Không sử dụng cấu hình bảo mật cũ đã bị loại bỏ hoặc deprecated.

Security configuration phải thể hiện rõ:

- Public endpoint.
- Authenticated endpoint.
- Role hoặc permission requirement.
- Session policy.
- CSRF policy.
- CORS policy.
- AuthenticationEntryPoint.
- AccessDeniedHandler.
- JWT hoặc Bearer Token processing.
- Logout behavior nếu có.
- Security headers.

Mặc định:

```text
Endpoint không được khai báo public
→ Phải yêu cầu authentication
```

Không sử dụng:

```text
anyRequest().permitAll()
```

làm cấu hình mặc định.

Ưu tiên:

```text
Public allowlist rõ ràng
→ Các rule phân quyền cụ thể
→ anyRequest().authenticated()
```

Không dùng `web.ignoring()` cho API chỉ để bỏ qua Spring Security.

Nếu endpoint cần public, ưu tiên `permitAll()` để request vẫn đi qua các lớp
bảo vệ liên quan của Spring Security.

Chỉ sử dụng `web.ignoring()` cho tài nguyên thực sự không cần đi qua security
filter chain và phải có lý do rõ ràng.

---

## 5. Session policy

Nếu API sử dụng Bearer access token và không sử dụng server-side login session:

- Sử dụng `SessionCreationPolicy.STATELESS`.
- Không lưu Authentication vào HTTP Session.
- Không dựa vào JSESSIONID để xác thực.
- Không bật form login nếu không sử dụng.
- Không bật HTTP Basic nếu không có yêu cầu rõ ràng.

Không kết hợp stateful session và stateless JWT một cách vô tình.

Nếu hệ thống sử dụng cookie cho refresh token, cookie đó không có nghĩa backend
được phép bỏ qua CSRF.

Phải phân biệt:

- HTTP Session.
- Access token.
- Refresh token.
- Device session.
- Authentication cookie.

---

## 6. Authentication architecture

Ưu tiên sử dụng cơ chế có sẵn của Spring Security thay vì tự triển khai toàn bộ
quá trình xác thực.

Đối với username và password:

- Sử dụng `AuthenticationManager`.
- Sử dụng `AuthenticationProvider`.
- Sử dụng `PasswordEncoder`.
- Sử dụng `UserDetailsService` hoặc authentication service tương đương.
- Kiểm tra trạng thái tài khoản.
- Xóa credential nhạy cảm khỏi Authentication khi không còn cần.

Đối với JWT access token:

- Ưu tiên Spring Security OAuth2 Resource Server và `JwtDecoder`.
- Sử dụng thư viện JWT đã được kiểm chứng.
- Không tự viết thuật toán ký hoặc giải mã JWT.
- Không chỉ Base64 decode token rồi xem dữ liệu là hợp lệ.

Chỉ tạo custom JWT filter khi cơ chế chuẩn không đáp ứng được yêu cầu.

Nếu sử dụng custom filter:

- Kế thừa `OncePerRequestFilter`.
- Đặt filter đúng vị trí trong SecurityFilterChain.
- Chỉ xác thực sau khi token đã được kiểm tra đầy đủ.
- Không tạo Authentication cho token không hợp lệ.
- Không nuốt exception token.
- Không log token.
- Không chặn public endpoint chỉ vì request không có token.
- Nếu request có token nhưng token sai, phải xử lý nhất quán.
- Không tự tách Bearer token bằng logic dễ lỗi khi có resolver chuẩn.

Custom authentication filter phải chạy trước bước authorization.

Nếu kiến trúc cũ yêu cầu filter trước `UsernamePasswordAuthenticationFilter`,
phải kiểm tra lại vị trí dựa trên phiên bản Spring Security đang sử dụng.

---

## 7. Public endpoint

Mọi public endpoint phải được khai báo rõ ràng.

Ví dụ có thể public:

- Đăng ký.
- Đăng nhập.
- Refresh token.
- Quên mật khẩu.
- Xác nhận email.
- Xem danh sách sản phẩm đang bán.
- Xem chi tiết sản phẩm công khai.
- Xem danh mục và thương hiệu.
- Payment callback đã có cơ chế xác minh riêng.
- OpenAPI development endpoint theo môi trường.

Không tự động public toàn bộ prefix lớn như:

```text
/api/v1/**
/api/v1/auth/**
/api/v1/products/**
```

nếu bên trong có endpoint cần bảo vệ.

Public endpoint vẫn phải áp dụng:

- Validation.
- Rate limiting.
- Request size limit.
- CORS phù hợp.
- CSRF nếu sử dụng cookie authentication.
- Logging an toàn.
- Abuse prevention.

Mỗi public endpoint mới phải trả lời được:

1. Vì sao endpoint cần public?
2. Dữ liệu nào được công khai?
3. Có thể bị spam hoặc abuse không?
4. Có cần rate limit không?
5. Có làm lộ trạng thái tài khoản không?
6. Có làm lộ dữ liệu nội bộ không?

---

## 8. Đăng ký tài khoản

Request đăng ký không được cho phép client gửi:

- Role.
- Permission.
- Account status.
- Verified status.
- Created by.
- Staff position.
- Admin flag.
- Internal identifier.
- Token version.

Tài khoản đăng ký công khai chỉ được nhận role mặc định an toàn,
thông thường là `CUSTOMER`.

Không cho phép request đăng ký tự tạo:

- ADMIN.
- STAFF.
- ORDER_OPERATOR.
- INVENTORY_MANAGER.
- Role nội bộ khác.

Email và số điện thoại phải được:

- Chuẩn hóa theo quy tắc thống nhất.
- Validation.
- Kiểm tra unique ở application.
- Bảo vệ bằng unique constraint trong database.

Không kích hoạt tài khoản trước khi hoàn thành email hoặc phone verification
nếu nghiệp vụ yêu cầu xác minh.

Không trả về dữ liệu nhạy cảm sau đăng ký.

Không tự động đăng nhập nếu quy trình xác minh danh tính chưa hoàn tất.

---

## 9. Password storage

Password KHÔNG ĐƯỢC:

- Lưu plain text.
- Mã hóa bằng reversible encryption để đăng nhập.
- Hash bằng MD5.
- Hash bằng SHA-1.
- Hash trực tiếp bằng SHA-256.
- Ghi vào log.
- Trả qua API.
- Lưu trong audit log.
- Đặt trong URL.
- Đặt trong query parameter.
- Gửi lại cho người dùng qua email.

Sử dụng `PasswordEncoder` của Spring Security.

Ưu tiên thuật toán password hashing thích ứng và chống brute force:

- Argon2id cho hệ thống mới khi hạ tầng hỗ trợ phù hợp.
- bcrypt khi được cấu hình và benchmark phù hợp.
- PBKDF2 khi có yêu cầu tương thích hoặc compliance phù hợp.

Sử dụng `DelegatingPasswordEncoder` hoặc cơ chế có khả năng nhận diện thuật toán
để hỗ trợ nâng cấp password hash trong tương lai.

Work factor phải:

- Được benchmark trên môi trường gần production.
- Đủ chậm để chống brute force.
- Không quá chậm đến mức tạo lỗ hổng DoS.
- Được xem xét lại khi hạ tầng thay đổi.

Không tự xử lý salt nếu thư viện đã quản lý salt an toàn.

Không trim hoặc tự thay đổi password của người dùng trước khi hash.

Phải quy định:

- Độ dài tối thiểu.
- Độ dài tối đa an toàn.
- Cho phép passphrase dài.
- Không chấp nhận password phổ biến hoặc đã bị lộ nếu có cơ chế kiểm tra.
- Không cắt password âm thầm.

Không bắt đổi password định kỳ chỉ theo thời gian nếu không có lý do bảo mật
hoặc compliance.

Phải yêu cầu đổi password khi:

- Phát hiện password bị lộ.
- Có sự cố bảo mật.
- Password hash sử dụng thuật toán không còn an toàn.
- Tài khoản được khôi phục sau compromise.

---

## 10. Login security

Login endpoint phải:

- Sử dụng `POST`.
- Chỉ chấp nhận HTTPS trong môi trường thực tế.
- Validation request.
- Có rate limiting.
- Có logging bảo mật.
- Không trả password.
- Không trả password hash.
- Không phân biệt quá rõ tài khoản không tồn tại và password sai.

Ưu tiên thông báo chung:

```text
Email hoặc mật khẩu không chính xác.
```

Không trả:

```text
Email không tồn tại.
```

hoặc:

```text
Email đúng nhưng mật khẩu sai.
```

nếu điều đó cho phép account enumeration.

Phải kiểm tra:

- Account tồn tại.
- Password hợp lệ.
- Account đã được xác minh nếu cần.
- Account đang ACTIVE.
- Account không bị khóa.
- Account không bị cấm.
- Quyền đăng nhập chưa bị thu hồi.

Bảo vệ chống:

- Brute force.
- Credential stuffing.
- Password spraying.
- Automated login abuse.

Có thể sử dụng:

- Rate limit theo IP.
- Rate limit theo account identifier.
- Progressive delay.
- Temporary lock.
- CAPTCHA sau hành vi đáng ngờ.
- MFA.
- Device risk signal.

Không dùng permanent account lock chỉ dựa vào request từ attacker vì có thể
tạo denial of service cho người dùng hợp lệ.

---

## 11. JWT access token

Access token phải:

- Có thời hạn ngắn.
- Được ký bằng khóa an toàn.
- Có thuật toán được allowlist.
- Được kiểm tra chữ ký trước khi tin tưởng claim.
- Chỉ sử dụng qua HTTPS.
- Chỉ được gửi trong `Authorization` header theo Bearer scheme.
- Có audience cụ thể.
- Có issuer cụ thể.
- Có subject xác định người dùng hoặc principal.
- Có token type rõ ràng.
- Có thời gian phát hành và hết hạn.
- Có thể có `jti` để nhận diện token.

Phải kiểm tra tối thiểu:

- Signature.
- Allowed algorithm.
- `exp`.
- `nbf` nếu có.
- `iss`.
- `aud`.
- Token type.
- Subject.
- Cấu trúc claim.
- Trạng thái session hoặc token version khi nghiệp vụ yêu cầu.

Không tin tưởng thuật toán từ JWT header mà không đối chiếu allowlist.

Không chấp nhận:

- `alg=none`.
- Token chưa ký.
- Token ký bằng thuật toán ngoài cấu hình.
- Token sai issuer.
- Token sai audience.
- Token hết hạn.
- Token chưa có hiệu lực.
- Token bị thu hồi khi có cơ chế revocation.
- Refresh token được sử dụng như access token.

Không đặt trong access token:

- Password.
- Password hash.
- Refresh token.
- API key.
- Secret.
- Dữ liệu thanh toán.
- Địa chỉ đầy đủ.
- Thông tin cá nhân không cần thiết.
- Dữ liệu có thể thay đổi liên tục.

JWT không được xem là nơi lưu toàn bộ User object.

Claim role hoặc permission phải có schema và quy ước thống nhất.

Nếu role hoặc permission thay đổi:

- Có cơ chế token version.
- Hoặc revoke device session.
- Hoặc buộc cấp lại token.
- Hoặc chấp nhận thời gian trễ tối đa bằng lifetime rất ngắn của access token.

Không để quyền cũ tồn tại lâu sau khi người dùng bị hạ quyền hoặc cấm.

---

## 12. JWT signing key

JWT signing key phải:

- Được tạo bằng nguồn ngẫu nhiên mật mã an toàn.
- Có độ mạnh phù hợp với thuật toán.
- Không phải chuỗi dễ đoán.
- Không được hard-code.
- Không được commit.
- Không đặt giá trị production trong `.env.example`.
- Được quản lý bằng environment secret hoặc secret manager.
- Có kế hoạch rotation.
- Có phân quyền truy cập tối thiểu.

Không sử dụng:

```text
secret
my-secret
phone-store-secret
123456
```

làm JWT key.

Phải lựa chọn rõ:

- Symmetric signing như HMAC.
- Hoặc asymmetric signing như RSA/ECDSA.

Nếu dùng HMAC:

- Bên ký và bên xác minh đều giữ cùng secret.
- Secret phải đủ mạnh.
- Chỉ service cần thiết được phép truy cập secret.

Nếu dùng asymmetric key:

- Private key chỉ được dùng để ký.
- Public key được dùng để xác minh.
- Private key không được phân phối tới resource không cần ký token.

Nên hỗ trợ `kid` hoặc cơ chế nhận diện key khi có key rotation.

Không dùng cùng một secret cho:

- JWT signing.
- Data encryption.
- Payment webhook.
- Email token.
- API integration khác.

---

## 13. Refresh token

Refresh token là credential nhạy cảm và phải được bảo vệ tương đương phiên
đăng nhập dài hạn.

Ưu tiên sử dụng refresh token ngẫu nhiên, opaque và có entropy cao.

Refresh token phải:

- Được tạo bằng `SecureRandom` hoặc cơ chế mật mã tương đương.
- Có thời hạn dài hơn access token nhưng vẫn hữu hạn.
- Được lưu dưới dạng hash trong database.
- Được liên kết với user.
- Được liên kết với device session hoặc token family.
- Có trạng thái revoked.
- Có thời điểm hết hạn.
- Có thời điểm sử dụng gần nhất.
- Có thông tin token thay thế khi rotation.
- Có audit metadata an toàn.

Không lưu raw refresh token trong database nếu có thể lưu hash để đối chiếu.

Mỗi lần refresh thành công:

1. Xác minh refresh token.
2. Kiểm tra hash.
3. Kiểm tra expiry.
4. Kiểm tra revoked.
5. Kiểm tra account status.
6. Kiểm tra token family.
7. Thu hồi refresh token cũ.
8. Sinh access token mới.
9. Sinh refresh token mới.
10. Lưu rotation trong cùng transaction phù hợp.
11. Trả token mới.
12. Không cho token cũ tiếp tục sử dụng.

Phải áp dụng refresh token rotation.

Nếu một refresh token đã được rotation lại xuất hiện:

- Xem đây là dấu hiệu token có thể bị đánh cắp.
- Revoke toàn bộ token family liên quan.
- Ghi security audit event.
- Có thể yêu cầu người dùng đăng nhập lại.
- Có thể thông báo người dùng nếu mức độ rủi ro phù hợp.

Refresh endpoint phải:

- Sử dụng `POST`.
- Có rate limiting.
- Không nhận token qua URL.
- Không trả lỗi làm lộ thông tin session không cần thiết.
- Chống concurrent refresh tạo nhiều token hợp lệ ngoài ý muốn.

Không sử dụng access token đã hết hạn làm refresh token.

---

## 14. Token storage trên ReactJS

Không lưu authentication token dài hạn trong:

- `localStorage`.
- `sessionStorage`.
- IndexedDB không có lớp bảo vệ phù hợp.
- JavaScript global variable tồn tại lâu hơn cần thiết.
- URL.
- Browser history.

Phương án ưu tiên cho web:

- Access token có lifetime ngắn và được giữ trong memory.
- Refresh token nằm trong cookie có `HttpOnly`.
- Cookie có `Secure`.
- Cookie có `SameSite` phù hợp.
- Cookie có `Path` hẹp nhất có thể.
- Cookie có thời hạn phù hợp.
- Có CSRF protection nếu cookie được gửi tự động.

Nếu sử dụng Backend for Frontend, ưu tiên session/cookie được quản lý bởi BFF
thay vì để browser JavaScript trực tiếp quản lý token dài hạn.

Không để JavaScript đọc refresh token nếu không có lý do kiến trúc đặc biệt.

Nếu ứng dụng web khác origin với backend và dùng cookie:

- Phải cấu hình CORS chính xác.
- Phải bật credentials có kiểm soát.
- Phải sử dụng `SameSite=None; Secure` khi thực sự cần cross-site.
- Phải có CSRF token hoặc cơ chế tương đương.
- Không sử dụng wildcard origin.

---

## 15. Token storage trên React Native

React Native phải lưu token nhạy cảm trong secure storage của hệ điều hành,
ví dụ:

- iOS Keychain.
- Android Keystore.
- Thư viện secure storage sử dụng các cơ chế trên.

Không lưu refresh token trong:

- AsyncStorage.
- Plain text file.
- Redux persisted state không mã hóa.
- Log.
- Crash report.
- URL.
- Clipboard.

Mobile app không được chứa backend secret cố định và xem nó là bí mật.

Mọi secret nhúng trong mobile app phải được xem là có thể bị trích xuất.

Backend không được tin tưởng request chỉ vì có custom mobile header hoặc API key
được nhúng trong ứng dụng.

---

## 16. Logout và session revocation

Logout hiện tại phải:

- Xác định refresh token hoặc device session hiện tại.
- Revoke refresh token.
- Revoke token family hoặc session liên quan theo nghiệp vụ.
- Xóa cookie nếu sử dụng cookie.
- Ghi audit event.
- Không trả raw token trong response.

Logout all devices phải:

- Revoke toàn bộ device session của user.
- Tăng token version nếu sử dụng token version.
- Vô hiệu hóa refresh token hiện có.
- Yêu cầu đăng nhập lại trên các thiết bị.

Access token đã phát hành có thể:

- Hết hiệu lực tự nhiên do lifetime ngắn.
- Hoặc bị denylist bằng `jti` đến khi hết hạn nếu cần logout tức thời.
- Hoặc bị vô hiệu qua token version/session version.

Không tạo denylist vô thời hạn.

Denylist entry chỉ cần tồn tại đến thời điểm access token hết hạn.

Khi tài khoản bị:

- BANNED.
- DISABLED.
- DELETED.
- Compromised.
- Hạ quyền nghiêm trọng.

phải xem xét revoke toàn bộ session và refresh token.

---

## 17. Password change

Đổi mật khẩu khi đang đăng nhập phải:

- Yêu cầu mật khẩu hiện tại.
- Xác minh danh tính.
- Validation mật khẩu mới.
- Không cho mật khẩu mới giống mật khẩu hiện tại nếu policy yêu cầu.
- Hash bằng PasswordEncoder.
- Ghi audit event.
- Không log password.
- Revoke các session khác nếu policy yêu cầu.
- Thông báo người dùng về thay đổi quan trọng.

Đối với thao tác nhạy cảm, có thể yêu cầu recent authentication.

Không chỉ dựa vào access token được phát hành từ rất lâu để đổi mật khẩu.

Sau khi đổi mật khẩu:

- Có thể giữ session hiện tại theo policy.
- Nên revoke các session còn lại.
- Phải vô hiệu reset token cũ.
- Phải xử lý token version nếu có.

---

## 18. Forgot password và reset password

Forgot password endpoint phải:

- Sử dụng response chung dù email tồn tại hay không.
- Có rate limiting theo IP và account identifier.
- Không gửi quá nhiều email.
- Không làm lộ tài khoản tồn tại.
- Ghi audit event nhưng không log token.

Response nên có dạng:

```text
Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi.
```

Reset token phải:

- Được tạo bằng nguồn ngẫu nhiên mật mã an toàn.
- Có entropy cao.
- Có thời hạn ngắn.
- Chỉ sử dụng một lần.
- Được lưu dưới dạng hash.
- Gắn với user và mục đích cụ thể.
- Bị vô hiệu sau khi sử dụng.
- Bị vô hiệu sau khi hết hạn.
- Bị vô hiệu khi password đã thay đổi.
- Không đặt raw token trong log.

Reset link phải:

- Sử dụng HTTPS.
- Không chứa dữ liệu nhạy cảm ngoài token.
- Không được tạo dựa vào Host header không tin cậy.
- Sử dụng frontend URL đã cấu hình allowlist.
- Không chuyển tiếp token tới bên thứ ba qua referrer.

Không sử dụng security question để khôi phục mật khẩu.

Sau khi reset thành công:

- Revoke session theo policy.
- Revoke refresh token cũ.
- Ghi audit.
- Thông báo người dùng.
- Không tự động đăng nhập nếu policy không cho phép.

---

## 19. Email verification và thay đổi email

Verification token phải:

- Ngẫu nhiên.
- Có thời hạn.
- Sử dụng một lần.
- Lưu dưới dạng hash.
- Không ghi log.
- Gắn với user và mục đích verification.

Không xem email chưa xác minh là danh tính đã được xác nhận.

Thay đổi email là thao tác thay đổi danh tính và phải:

- Yêu cầu recent authentication.
- Có thể yêu cầu password hoặc MFA.
- Gửi thông báo tới email cũ.
- Xác minh email mới.
- Không cập nhật hoàn tất trước khi xác minh nếu policy yêu cầu.
- Revoke verification token cũ.
- Ghi audit event.

Không cho phép attacker thay email chỉ với một access token bị đánh cắp mà không
có bước xác thực tăng cường phù hợp.

---

## 20. Authorization model

Authorization phải kết hợp:

- RBAC: Role-Based Access Control.
- Permission-Based Access Control.
- Ownership hoặc Relationship-Based Access Control.
- Business state validation.

Role cơ bản:

- CUSTOMER.
- STAFF.
- ADMIN.

Role mở rộng có thể gồm:

- ORDER_OPERATOR.
- INVENTORY_MANAGER.
- CUSTOMER_SUPPORT.
- CONTENT_MANAGER.
- FINANCE_OPERATOR.

Không hard-code hệ thống chỉ có ba role nếu database hỗ trợ mở rộng.

Permission nên thể hiện hành động cụ thể:

```text
PRODUCT_READ
PRODUCT_CREATE
PRODUCT_UPDATE
PRODUCT_DELETE
INVENTORY_READ
INVENTORY_ADJUST
ORDER_READ_ALL
ORDER_UPDATE_STATUS
PAYMENT_READ
PAYMENT_REFUND
USER_MANAGE
ROLE_MANAGE
REVIEW_MODERATE
```

Không sử dụng role quá rộng nếu permission chi tiết phù hợp hơn.

Role hoặc permission phải được kiểm tra ở backend.

Mọi endpoint không public phải có quyết định authorization rõ ràng.

Không cấp quyền chỉ dựa trên việc người dùng biết ID của tài nguyên.

---

## 21. Deny by default

Authorization phải từ chối mặc định.

Nếu không có rule phù hợp:

```text
DENY
```

Không suy luận:

```text
Không thấy rule cấm
→ Cho phép
```

Phải suy luận:

```text
Không thấy rule cho phép
→ Từ chối
```

Public endpoint phải được allowlist rõ ràng.

Admin endpoint phải yêu cầu permission hoặc role phù hợp.

Không để endpoint mới vô tình public do matcher quá rộng.

Khi thêm endpoint mới, phải kiểm tra:

- Unauthenticated request.
- Authenticated nhưng sai role.
- Đúng role nhưng không sở hữu tài nguyên.
- Đúng role nhưng trạng thái nghiệp vụ không cho phép.
- Tài khoản bị vô hiệu.

---

## 22. Method Security

Phải bật method-level authorization khi sử dụng annotation bảo vệ Service.

Ưu tiên bảo vệ tại Service boundary bằng:

- `@PreAuthorize`.
- Custom authorization component.
- Custom permission evaluator khi cần.
- Custom meta-annotation cho rule lặp lại.

Không chỉ bảo vệ Controller.

Service method có thể được gọi từ:

- Controller khác.
- Scheduler.
- Event listener.
- Internal workflow.
- Test.
- Future integration.

Vì vậy, nghiệp vụ nhạy cảm phải có authorization hoặc được gọi qua một
application boundary đã được bảo vệ.

Không đặt biểu thức SpEL quá phức tạp trực tiếp trong annotation.

Nếu authorization expression dài hoặc lặp lại, chuyển sang:

- Security service.
- Authorization policy.
- Custom annotation.
- Permission evaluator.

Phải kiểm tra method security bằng automated test.

---

## 23. Ownership và chống IDOR

Mọi tài nguyên thuộc người dùng phải kiểm tra ownership.

Ví dụ:

- Address.
- Cart.
- Wishlist.
- Order.
- Payment.
- Review.
- Uploaded file.
- Notification.

Không được:

1. Nhận `orderId`.
2. Tìm Order theo ID.
3. Trả Order cho người dùng.

mà không kiểm tra người dùng có quyền truy cập Order đó.

Ưu tiên query theo cả ID và owner:

```text
findByIdAndCustomerId(orderId, customerId)
```

thay vì:

```text
findById(orderId)
→ kiểm tra owner sau
```

khi cách query kết hợp giúp giảm rủi ro và rõ mục đích hơn.

Endpoint “của tôi” phải lấy user identity từ Security Context.

Không tin `customerId` từ request.

Staff hoặc Admin truy cập dữ liệu người khác phải có permission rõ ràng và
được audit nếu dữ liệu nhạy cảm.

Không xem UUID hoặc ID khó đoán là biện pháp authorization.

---

## 24. Privilege management

Không cho phép người dùng tự:

- Gán role.
- Thêm permission.
- Thay đổi account status.
- Tạo staff profile.
- Kích hoạt quyền admin.
- Phê duyệt chính mình.
- Nâng quyền qua mass assignment.

Thay đổi role hoặc permission phải:

- Yêu cầu permission quản lý quyền.
- Kiểm tra actor không tự nâng quyền ngoài phạm vi.
- Ghi audit trước và sau thay đổi.
- Lưu actor.
- Lưu target user.
- Lưu role hoặc permission cũ.
- Lưu role hoặc permission mới.
- Revoke hoặc refresh session khi cần.
- Ngăn xóa hoặc hạ quyền quản trị viên cuối cùng nếu hệ thống yêu cầu.

Thao tác đặc biệt nguy hiểm có thể yêu cầu:

- MFA.
- Recent authentication.
- Dual approval.
- Reason bắt buộc.
- Notification.

---

## 25. HTTP 401 và 403

Sử dụng đúng ý nghĩa:

### HTTP 401 Unauthorized

Dùng khi:

- Chưa đăng nhập.
- Không có token.
- Token không hợp lệ.
- Token hết hạn.
- Token sai issuer hoặc audience.
- Authentication không thể thiết lập.

### HTTP 403 Forbidden

Dùng khi:

- Đã xác thực.
- Nhưng không có role hoặc permission.
- Không sở hữu tài nguyên.
- Không được phép thực hiện hành động.

Không trả HTTP 500 cho lỗi authentication hoặc authorization thông thường.

Sử dụng:

- `AuthenticationEntryPoint` cho lỗi 401.
- `AccessDeniedHandler` cho lỗi 403.

Response lỗi phải thống nhất với API error contract.

Không trả chi tiết giúp attacker biết chính xác phần nào của token validation
đã thất bại nếu điều đó không cần thiết.

---

## 26. CORS

CORS không phải cơ chế authentication.

CORS chỉ kiểm soát browser có được phép đọc response cross-origin hay không.

Phải khai báo allowlist origin theo môi trường.

Ví dụ:

```text
Local:
http://localhost:5173

Production:
https://shop.example.com
https://admin.example.com
```

Không dùng:

```text
allowedOrigins = "*"
allowCredentials = true
```

Cấu hình phải xác định:

- Allowed origins.
- Allowed methods.
- Allowed headers.
- Exposed headers nếu cần.
- Allow credentials.
- Preflight cache duration.

Chỉ cho phép method cần thiết:

- GET.
- POST.
- PUT nếu sử dụng.
- PATCH.
- DELETE.
- OPTIONS.

Không cho phép toàn bộ header nếu không cần.

CORS phải được xử lý trước bước authentication phù hợp để preflight request
không bị từ chối sai.

Không phản chiếu Origin bất kỳ từ request thành Access-Control-Allow-Origin.

Không coi Postman hoặc mobile app không bị CORS là bằng chứng API đã an toàn.

---

## 27. CSRF

Không tự động vô hiệu CSRF chỉ vì API sử dụng Spring Boot.

Quyết định CSRF phải dựa trên cách credential được gửi.

### Trường hợp Bearer token trong Authorization header

Có thể vô hiệu CSRF nếu:

- Backend hoàn toàn stateless.
- Browser không tự động gửi access token.
- Access token chỉ được gửi chủ động trong Authorization header.
- Không có cookie authentication cho endpoint thay đổi dữ liệu.
- Quyết định được ghi rõ.

### Trường hợp cookie authentication hoặc refresh cookie

Phải bật hoặc triển khai CSRF protection nếu browser tự động gửi credential.

Phải bảo vệ các method thay đổi dữ liệu:

- POST.
- PUT.
- PATCH.
- DELETE.

Có thể sử dụng:

- Synchronizer token.
- Cookie-based CSRF token phù hợp.
- Custom header chứa CSRF token.
- SameSite cookie như lớp phòng vệ bổ sung.

Không xem SameSite là lớp bảo vệ duy nhất trong mọi kiến trúc.

Login, logout, refresh và thao tác thay đổi tài khoản phải được xem xét CSRF
nếu sử dụng cookie.

Security test phải kiểm tra:

- Thiếu CSRF token.
- CSRF token hợp lệ.
- CSRF token không hợp lệ.
- Cross-origin request.

---

## 28. Security headers

Không vô hiệu toàn bộ security header mặc định của Spring Security nếu không
có lý do rõ ràng.

Phải xem xét:

- Strict-Transport-Security.
- X-Content-Type-Options.
- X-Frame-Options hoặc CSP `frame-ancestors`.
- Content-Security-Policy.
- Referrer-Policy.
- Permissions-Policy.
- Cache-Control cho response nhạy cảm.

API authentication response phải tránh bị cache bởi shared cache.

Trang admin không được phép nhúng trong iframe nếu không có yêu cầu cụ thể.

Nếu frontend được phục vụ riêng, CSP có thể được cấu hình tại frontend hosting
hoặc reverse proxy, nhưng trách nhiệm phải được xác định rõ.

Không để lộ thông tin server và framework không cần thiết qua header.

---

## 29. HTTPS và transport security

Production API chỉ được phục vụ qua HTTPS.

Không gửi qua HTTP:

- Password.
- Access token.
- Refresh token.
- Verification token.
- Reset token.
- Payment data.
- Dữ liệu cá nhân.

Nếu TLS termination nằm tại reverse proxy hoặc load balancer:

- Phải cấu hình trusted proxy.
- Phải xử lý forwarded header an toàn.
- Không tin mọi `X-Forwarded-*` header từ internet.
- Chỉ tin header do proxy tin cậy tạo ra.

Cookie nhạy cảm phải có `Secure`.

HSTS chỉ được bật khi HTTPS đã được cấu hình đúng và domain sẵn sàng.

Không tắt certificate validation trong integration client.

---

## 30. Input validation và injection prevention

Mọi input từ client phải được validation.

Phải bảo vệ chống:

- SQL Injection.
- JPQL Injection.
- Command Injection.
- Path Traversal.
- Header Injection.
- Log Injection.
- SSRF.
- XSS qua nội dung lưu trữ.
- Unsafe deserialization.
- Regex Denial of Service.
- Oversized JSON.
- Deeply nested JSON.

Không nối input trực tiếp vào query:

```text
"SELECT ... WHERE email = '" + email + "'"
```

Sử dụng:

- Spring Data parameter binding.
- Named parameter.
- Prepared statement.
- Criteria API.
- Specification có allowlist.

Field sort phải dùng allowlist.

Không cho client truyền tùy ý tên field database hoặc JPQL expression.

Không truyền input người dùng vào:

- Shell command.
- ProcessBuilder.
- File path.
- Class loader.
- SpEL expression.
- Template expression.

Nếu bắt buộc phải sử dụng, phải có allowlist nghiêm ngặt và review bảo mật.

Không bật polymorphic deserialization toàn cục cho JSON không tin cậy.

Không sử dụng Java native deserialization cho dữ liệu từ client.

Review comment và nội dung người dùng nên được xem là plain text hoặc phải được
sanitize theo policy trước khi render dưới dạng HTML.

---

## 31. Mass assignment

Không map toàn bộ request vào Entity một cách tự động nếu request có thể chứa
field không được phép sửa.

Phải whitelist field cập nhật.

Ví dụ UpdateUserRequest không được cho phép cập nhật:

- Role.
- Permission.
- Status.
- Password hash.
- Verified.
- Failed login count.
- Created at.
- Updated by.
- Token version.

UpdateProductRequest của staff thông thường không được tự động cho phép sửa
trường chỉ Admin được quản lý.

Không sử dụng reflection mapper để copy tất cả property từ request sang Entity
trong luồng bảo mật hoặc quản trị.

Request DTO phải được thiết kế riêng cho từng use case và từng actor khi quyền
khác nhau đáng kể.

---

## 32. File upload

Chỉ cho phép loại file thực sự cần cho nghiệp vụ.

Ví dụ:

- JPEG.
- PNG.
- WebP.

Không cho phép tùy ý:

- HTML.
- JavaScript.
- Executable.
- Script.
- JAR.
- ZIP.
- SVG chưa sanitize.
- File có macro.
- File không xác định.

Phải kiểm tra:

1. Authentication.
2. Authorization.
3. File size.
4. Filename length.
5. Extension allowlist.
6. MIME type.
7. File signature hoặc magic bytes.
8. Image dimensions nếu là ảnh.
9. Nội dung độc hại khi có cơ chế scan.
10. Storage quota.

Không tin `Content-Type` từ client.

Không sử dụng filename gốc làm storage key.

Phải:

- Sinh filename hoặc object key ngẫu nhiên.
- Lưu filename gốc chỉ như metadata đã sanitize nếu cần.
- Ngăn path traversal.
- Ngăn ghi đè file.
- Lưu ngoài webroot hoặc object storage riêng.
- Phân quyền truy cập file.
- Sử dụng Content-Disposition phù hợp khi download.
- Cấu hình Content-Type an toàn khi trả file.

Đối với ảnh:

- Nên decode và encode lại ảnh.
- Có giới hạn chiều rộng, chiều cao và số pixel.
- Loại bỏ metadata không cần thiết nếu phù hợp.
- Không xử lý ảnh bằng thư viện lỗi thời.

Không tạo URL nội bộ dựa trực tiếp vào filename người dùng.

Nếu sử dụng presigned URL:

- Thời hạn phải ngắn.
- Giới hạn object key.
- Giới hạn content type.
- Giới hạn kích thước nếu provider hỗ trợ.
- Xác minh file sau upload trước khi công khai.

---

## 33. Secret management

Secret gồm:

- Database password.
- JWT signing key.
- Payment secret.
- Cloud storage secret.
- Email credential.
- OAuth client secret.
- Encryption key.
- Webhook secret.
- CI/CD credential.

Secret KHÔNG ĐƯỢC:

- Hard-code trong Java.
- Hard-code trong YAML được commit.
- Hard-code trong Dockerfile.
- Commit trong `.env`.
- Đặt trong Git history.
- Ghi vào log.
- Trả qua API.
- Đặt trong test fixture công khai.
- Chụp trong screenshot.
- In ra terminal không cần thiết.

Phải:

- Dùng environment variable cho local và môi trường đơn giản.
- Dùng secret manager cho production khi có thể.
- Cung cấp `.env.example` không chứa secret thật.
- Giới hạn quyền đọc secret.
- Có kế hoạch rotation.
- Theo dõi thời điểm và chủ sở hữu secret.
- Thu hồi secret không còn sử dụng.
- Tách secret theo môi trường.

Production không được khởi động với secret mặc định.

Không dùng một secret chung cho local, test, staging và production.

Không sử dụng production secret trong automated test.

---

## 34. Dữ liệu cá nhân

Chỉ thu thập dữ liệu cần thiết cho nghiệp vụ.

Dữ liệu cá nhân có thể gồm:

- Họ tên.
- Email.
- Số điện thoại.
- Địa chỉ.
- Lịch sử đơn hàng.
- IP.
- Device metadata.
- Payment reference.
- Nội dung hỗ trợ khách hàng.

Phải:

- Hạn chế dữ liệu trả về.
- Chỉ trả field client cần.
- Mask dữ liệu trong log.
- Kiểm soát quyền truy cập.
- Ghi audit cho thao tác quản trị nhạy cảm.
- Xác định thời gian lưu giữ.
- Xóa hoặc ẩn danh khi phù hợp.
- Bảo vệ backup.
- Không dùng dữ liệu production tùy tiện cho development.

Không trả toàn bộ User entity.

Không để Staff xem dữ liệu ngoài phạm vi công việc.

Không log đầy đủ:

- Email nếu không cần.
- Số điện thoại.
- Địa chỉ.
- Payment reference.
- Nội dung token.

---

## 35. Payment security

Backend không được xử lý hoặc lưu thông tin thẻ nếu payment gateway đã cung cấp
hosted payment page hoặc tokenization.

Không lưu:

- Card number.
- CVV.
- Raw payment credential.
- Dữ liệu nhạy cảm không cần thiết.

Backend phải tự tạo:

- Order reference.
- Payment reference.
- Amount.
- Currency.
- Description.
- Callback metadata.

Không tin amount hoặc trạng thái thanh toán do frontend gửi lên.

Khi khởi tạo thanh toán:

1. Đọc Order từ database.
2. Kiểm tra quyền.
3. Kiểm tra trạng thái.
4. Tính amount ở backend.
5. Tạo payment transaction.
6. Gửi amount đã xác định tới gateway.
7. Lưu gateway reference.
8. Trả payment URL hoặc dữ liệu cần thiết.

---

## 36. Payment callback và webhook

Payment callback phải được xem là request không đáng tin cậy cho đến khi
xác minh hoàn tất.

Phải kiểm tra:

- Chữ ký.
- Webhook secret.
- Timestamp.
- Nonce hoặc event ID nếu có.
- Payment reference.
- Order reference.
- Amount.
- Currency.
- Payment status.
- Gateway identity.
- Event chưa được xử lý.

Phải tính chữ ký trên đúng raw body hoặc canonical payload theo tài liệu
của gateway.

So sánh chữ ký bằng phương pháp constant-time khi phù hợp.

Không chỉ dựa vào:

- IP allowlist.
- User redirect.
- Query parameter.
- Frontend báo thanh toán thành công.
- HTTP status từ trang redirect.

IP allowlist chỉ là lớp phòng vệ bổ sung.

Callback phải có idempotency.

Tạo unique constraint hoặc cơ chế tương đương trên:

- Gateway transaction ID.
- Webhook event ID.
- Idempotency key.

Callback bị gửi lại phải:

- Không trừ tiền lần hai.
- Không giao hàng lần hai.
- Không tạo Order lần hai.
- Không cộng điểm lần hai.
- Không gửi notification lặp ngoài ý muốn.
- Trả response phù hợp cho gateway mà không tái xử lý.

Cập nhật payment và order phải nằm trong transaction phù hợp.

Không chuyển Order thành PAID trước khi:

- Callback đã xác minh.
- Amount khớp.
- Currency khớp.
- Payment reference khớp.
- Trạng thái hợp lệ.

---

## 37. External integration và SSRF

Không cho backend tải URL tùy ý do client cung cấp.

Các tính năng dễ gây SSRF:

- Import ảnh từ URL.
- Avatar từ URL.
- Webhook tùy chỉnh.
- Callback URL.
- PDF generation từ URL.
- Link preview.
- Cloud metadata access.

Nếu backend phải gọi URL:

- Sử dụng allowlist domain.
- Chỉ cho phép protocol cần thiết.
- Không cho `file://`.
- Không cho `ftp://` nếu không cần.
- Resolve và kiểm tra IP.
- Chặn loopback.
- Chặn private network.
- Chặn link-local.
- Chặn cloud metadata endpoint.
- Kiểm tra redirect.
- Giới hạn số redirect.
- Đặt timeout.
- Giới hạn response size.
- Không tự động chuyển credential sang host khác.

Không sử dụng blocklist domain đơn giản làm lớp bảo vệ duy nhất.

External client phải có:

- Connect timeout.
- Read timeout.
- Request timeout.
- Response size limit.
- Retry có kiểm soát.
- Circuit breaker nếu phù hợp.
- TLS validation.

---

## 38. Rate limiting và abuse prevention

Áp dụng rate limit theo mức độ rủi ro.

Endpoint ưu tiên bảo vệ:

- Login.
- Register.
- Refresh token.
- Forgot password.
- Reset password.
- Email verification resend.
- OTP.
- Search.
- Review creation.
- Cart mutation.
- Checkout.
- Payment initialization.
- Payment callback.
- File upload.
- Admin operation.

Có thể giới hạn theo:

- IP.
- User.
- Account identifier.
- Device session.
- API key.
- Endpoint.
- Kết hợp nhiều tín hiệu.

Không tin trực tiếp `X-Forwarded-For` nếu request không đi qua proxy tin cậy.

Khi triển khai nhiều instance, rate limit cần shared state hoặc thực hiện tại
API gateway/reverse proxy phù hợp.

Khi bị giới hạn, trả:

```text
HTTP 429 Too Many Requests
```

Có thể trả `Retry-After` khi phù hợp.

Không để rate limit response làm lộ tài khoản có tồn tại hay không.

Rate limit phải tránh khóa nhầm người dùng hợp lệ vĩnh viễn.

---

## 39. Admin và Staff security

Tài khoản Admin và Staff có mức rủi ro cao hơn Customer.

Phải:

- Áp dụng least privilege.
- Gán permission theo nhiệm vụ.
- Ghi audit thao tác quan trọng.
- Có session management.
- Có rate limit.
- Có cơ chế revoke nhanh.
- Yêu cầu mật khẩu mạnh.
- Xem xét MFA.
- Xem xét recent authentication cho thao tác nhạy cảm.

Nên yêu cầu MFA cho:

- ADMIN.
- Người quản lý role.
- Người thực hiện refund.
- Người quản lý thanh toán.
- Người có quyền điều chỉnh tồn kho.
- Người truy cập dữ liệu cá nhân trên diện rộng.

Thao tác nhạy cảm gồm:

- Thay đổi role.
- Cấm hoặc mở khóa tài khoản.
- Refund.
- Điều chỉnh tồn kho.
- Xóa hoặc vô hiệu sản phẩm.
- Thay đổi giá số lượng lớn.
- Xuất dữ liệu khách hàng.
- Thay đổi security configuration.

Mỗi thao tác phải lưu:

- Actor.
- Target.
- Action.
- Timestamp.
- Request ID.
- Giá trị trước.
- Giá trị sau.
- Reason nếu nghiệp vụ yêu cầu.
- Kết quả.

Admin không được miễn mọi business validation.

---

## 40. Audit logging

Security audit phải ghi nhận tối thiểu:

- Login thành công.
- Login thất bại.
- Account bị khóa.
- Account bị cấm.
- Logout.
- Logout all devices.
- Refresh token reuse.
- Password change.
- Password reset.
- Email change.
- Role change.
- Permission change.
- Admin action.
- Refund.
- Inventory adjustment.
- Payment callback invalid.
- Signature verification failure.
- Suspicious file upload.
- Rate limit triggered.
- Security configuration change.

Audit log không được chứa:

- Password.
- Password hash.
- Raw token.
- Reset token.
- Verification token.
- Full Authorization header.
- Payment secret.
- Full sensitive payload.

Audit log phải:

- Có timestamp.
- Có actor nếu xác định được.
- Có source context an toàn.
- Có request ID hoặc trace ID.
- Có event type.
- Có result.
- Khó bị sửa hoặc xóa trái phép.
- Có retention phù hợp.
- Chỉ người có quyền mới được truy cập.

Không để người bị audit tự xóa audit log của mình.

---

## 41. Error handling bảo mật

Không trả cho client:

- Stack trace.
- SQL.
- Tên bảng.
- Tên cột nội bộ.
- File path server.
- Secret.
- Token.
- Internal hostname.
- SDK credential.
- Chi tiết verification algorithm.

Production response phải dùng thông báo an toàn.

Chi tiết lỗi nội bộ được ghi vào log phù hợp cùng request ID.

Không trả cùng một thông báo cho mọi lỗi nếu làm mất khả năng sử dụng API,
nhưng không được tiết lộ thông tin giúp attacker.

Authentication error phải đủ chung để chống enumeration.

Validation error có thể chỉ rõ field không hợp lệ nhưng không được trả dữ liệu
nhạy cảm.

Unexpected exception phải trả response chuẩn và không để lộ exception message
nội bộ.

---

## 42. Actuator, OpenAPI và development tools

Không public toàn bộ Spring Boot Actuator trong production.

Chỉ expose endpoint thực sự cần thiết.

Health endpoint public nếu cần phải giới hạn dữ liệu trả về.

Không public trong production nếu chưa bảo vệ:

- `/actuator/env`
- `/actuator/configprops`
- `/actuator/beans`
- `/actuator/heapdump`
- `/actuator/threaddump`
- `/actuator/loggers`
- `/actuator/mappings`

Không để Actuator trả secret hoặc cấu hình nhạy cảm.

OpenAPI và Swagger UI phải:

- Có policy theo môi trường.
- Có thể bật trong local và test.
- Được bảo vệ hoặc tắt trong production nếu không cần public.
- Không hiển thị secret mẫu.
- Không chứa production token.

Không bật:

- H2 Console.
- Development error page.
- Debug logging toàn hệ thống.
- DevTools remote feature.

trong production.

---

## 43. Dependency và supply chain security

Chỉ sử dụng dependency từ repository đáng tin cậy.

Không sử dụng:

- Dependency không rõ nguồn.
- Library JWT tự phát triển.
- Crypto library lỗi thời.
- Dependency bị bỏ bảo trì cho chức năng bảo mật quan trọng.
- Dynamic version.
- SNAPSHOT trong release ổn định.

Phải:

- Khóa dependency version.
- Kiểm tra vulnerability.
- Theo dõi Spring Security advisory.
- Theo dõi Spring Boot advisory.
- Theo dõi JWT library advisory.
- Cập nhật security patch phù hợp.
- Loại bỏ dependency không sử dụng.
- Kiểm tra transitive dependency.
- Bảo vệ Gradle Wrapper.
- Cân nhắc dependency verification.
- Tạo SBOM khi quy trình triển khai yêu cầu.

Không tự viết:

- Password hashing algorithm.
- Encryption algorithm.
- JWT signing algorithm.
- Random number generator.
- Constant-time comparison.

khi thư viện chuẩn và đã được kiểm chứng tồn tại.

---

## 44. Security testing

Mỗi endpoint được bảo vệ phải có test tối thiểu cho:

- Không có authentication.
- Token hợp lệ.
- Token hết hạn.
- Token sai chữ ký.
- Token malformed.
- Token sai issuer.
- Token sai audience.
- Token sai type.
- Đúng user nhưng sai role.
- Đúng role nhưng thiếu permission.
- Đúng role nhưng không sở hữu tài nguyên.
- Account INACTIVE.
- Account BANNED.
- Resource không tồn tại.
- Trạng thái nghiệp vụ không hợp lệ.

Authentication test phải bao gồm:

- Login thành công.
- Password sai.
- Account không tồn tại.
- Account bị khóa.
- Account chưa xác minh.
- Rate limit.
- Response không làm lộ account existence.

Refresh token test phải bao gồm:

- Refresh thành công.
- Token hết hạn.
- Token revoked.
- Token bị rotation.
- Reuse token cũ.
- Concurrent refresh.
- Account bị cấm.
- Logout current device.
- Logout all devices.

Security integration test phải kiểm tra:

- Filter chain.
- 401.
- 403.
- CORS.
- CSRF theo kiến trúc.
- Method security.
- Ownership.
- IDOR.
- Mass assignment.
- File upload.
- Payment callback signature.
- Payment callback replay.
- Secret không xuất hiện trong response.

Sử dụng `spring-security-test` và integration test phù hợp.

Không chỉ kiểm tra happy path.

Chi tiết tổ chức test nằm trong `50-testing-requirements.md`.

---

## 45. Security verification trước release

Trước mỗi release quan trọng, xác nhận:

### Authentication

- [ ] Password được hash an toàn.
- [ ] Không log password.
- [ ] Login có rate limiting.
- [ ] Account status được kiểm tra.
- [ ] Generic authentication error được áp dụng.
- [ ] MFA policy cho tài khoản đặc quyền đã được xác định.

### JWT

- [ ] Access token có thời hạn ngắn.
- [ ] Signature được kiểm tra.
- [ ] Algorithm có allowlist.
- [ ] Issuer được kiểm tra.
- [ ] Audience được kiểm tra.
- [ ] Token type được kiểm tra.
- [ ] Không có dữ liệu nhạy cảm trong claim.
- [ ] Key không hard-code.
- [ ] Có kế hoạch key rotation.

### Refresh token

- [ ] Refresh token được hash khi lưu.
- [ ] Có expiry.
- [ ] Có revocation.
- [ ] Có rotation.
- [ ] Có reuse detection.
- [ ] Có token family hoặc device session.
- [ ] Logout thực sự revoke refresh token.

### Authorization

- [ ] Deny by default.
- [ ] Public endpoint có allowlist.
- [ ] Admin endpoint được bảo vệ.
- [ ] Method security được bật nếu sử dụng.
- [ ] Ownership được kiểm tra.
- [ ] Không tin userId từ client.
- [ ] Không có mass assignment role hoặc status.
- [ ] Role change được audit.

### Browser và mobile

- [ ] Web không lưu refresh token trong localStorage.
- [ ] Cookie có HttpOnly, Secure và SameSite phù hợp.
- [ ] Mobile sử dụng secure storage.
- [ ] Không nhúng backend secret trong mobile app.
- [ ] CORS đúng origin.
- [ ] CSRF policy phù hợp cách truyền credential.

### File và integration

- [ ] File upload có allowlist.
- [ ] Có kiểm tra signature của file.
- [ ] Filename được sinh bởi hệ thống.
- [ ] File được lưu ngoài webroot hoặc object storage.
- [ ] External URL được kiểm soát SSRF.
- [ ] Payment callback kiểm tra chữ ký.
- [ ] Payment callback có idempotency.
- [ ] Amount được backend xác minh.

### Production

- [ ] HTTPS được bắt buộc.
- [ ] Secret không nằm trong source code.
- [ ] Actuator được giới hạn.
- [ ] Swagger được cấu hình theo môi trường.
- [ ] H2 Console bị tắt.
- [ ] Debug bị tắt.
- [ ] Security header được bật.
- [ ] Dependency vulnerability đã được kiểm tra.
- [ ] Security test thành công.

---

## 46. Hành vi bị cấm

KHÔNG ĐƯỢC:

- Hard-code secret.
- Lưu password plain text.
- Trả password hash qua API.
- Tin role do client gửi.
- Tin giá do frontend gửi.
- Tin payment success do frontend gửi.
- Tắt security để test rồi quên bật lại.
- Dùng `permitAll()` cho toàn bộ API.
- Tắt CSRF mà không phân tích credential flow.
- Dùng wildcard CORS với credentials.
- Lưu refresh token trong localStorage.
- Lưu mobile token trong AsyncStorage.
- Đưa token vào URL.
- Log Authorization header.
- Dùng JWT không kiểm tra signature.
- Chỉ kiểm tra token hết hạn mà bỏ qua issuer và audience.
- Dùng refresh token nhiều lần mà không rotation.
- Bỏ qua ownership.
- Chỉ kiểm tra quyền ở frontend.
- Trả Entity chứa dữ liệu nhạy cảm.
- Cho upload mọi loại file.
- Dùng filename người dùng làm storage path.
- Gọi URL tùy ý từ backend.
- Tự viết crypto.
- Tự bỏ qua certificate validation.
- Public Actuator nhạy cảm.
- Bỏ qua security test.
- Tuyên bố hệ thống an toàn khi chưa kiểm tra.

---

## 47. Báo cáo vấn đề bảo mật

Khi phát hiện vấn đề bảo mật:

1. Không công khai secret hoặc exploit detail không cần thiết.
2. Không ghi lại raw token trong báo cáo.
3. Xác định mức độ nghiêm trọng.
4. Xác định dữ liệu và actor bị ảnh hưởng.
5. Xác định khả năng khai thác.
6. Đề xuất biện pháp tạm thời.
7. Đề xuất biện pháp khắc phục lâu dài.
8. Xác định test chống tái phát.
9. Xác định kế hoạch rotation hoặc revocation.
10. Ghi lại bằng ngôn ngữ an toàn.

Phân loại:

- `CRITICAL`: Có khả năng chiếm tài khoản, thanh toán giả, lộ secret hoặc truy cập dữ liệu diện rộng.
- `HIGH`: Bypass authorization, IDOR nghiêm trọng, token reuse hoặc privilege escalation.
- `MEDIUM`: Cấu hình thiếu lớp bảo vệ, rate limit chưa đủ hoặc lộ dữ liệu có giới hạn.
- `LOW`: Hardening, header hoặc logging chưa tối ưu.
- `INFORMATIONAL`: Đề xuất tăng cường không phải vulnerability trực tiếp.

---

## 48. Cách báo cáo ngoại lệ

Nếu cần ngoại lệ đối với Security Rule, phải ghi:

```text
Security Rule:
Lý do nghiệp vụ:
Lý do kỹ thuật:
Dữ liệu bị ảnh hưởng:
Actor bị ảnh hưởng:
Threat được chấp nhận:
Biện pháp bù:
Thời hạn ngoại lệ:
Người phê duyệt:
Test bảo vệ:
Kế hoạch loại bỏ ngoại lệ:
```

Không được âm thầm giảm security control.

Ngoại lệ bảo mật phải có thời hạn và phải được xem xét lại.