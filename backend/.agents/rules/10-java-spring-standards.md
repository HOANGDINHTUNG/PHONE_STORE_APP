# Phone Store Backend — Java and Spring Standards

## 1. Phạm vi áp dụng

Áp dụng tài liệu này cho toàn bộ source code Java và Spring Boot của dự án,
bao gồm:

- Application bootstrap.
- Configuration.
- Controller.
- DTO.
- Validation.
- Mapper.
- Service.
- Repository.
- JPA Entity.
- Transaction.
- Exception handling.
- Logging.
- Module communication.
- Dependency management.
- Code quality.
- Khả năng kiểm thử.

Tài liệu này mở rộng `00-project-constitution.md`.

Nếu có xung đột:

1. Tuân thủ `00-project-constitution.md`.
2. Xác định nguyên nhân xung đột.
3. Không tự ý bỏ qua Rule.
4. Báo cáo và đề xuất cách đồng bộ.

---

## 2. Mức độ bắt buộc

Các từ khóa trong tài liệu được hiểu như sau:

- `PHẢI`: Quy tắc bắt buộc.
- `KHÔNG ĐƯỢC`: Hành vi bị cấm.
- `NÊN`: Lựa chọn mặc định, chỉ thay đổi khi có lý do rõ ràng.
- `CÓ THỂ`: Lựa chọn tùy theo ngữ cảnh.

Mọi ngoại lệ đối với quy tắc `PHẢI` hoặc `KHÔNG ĐƯỢC` phải:

1. Có lý do kỹ thuật cụ thể.
2. Có phạm vi ảnh hưởng rõ ràng.
3. Có test bảo vệ.
4. Được ghi lại trong Architecture Decision Record nếu ảnh hưởng lớn.

---

## 3. Java baseline

Dự án sử dụng Java 21.

PHẢI:

- Sử dụng Java Toolchain để khóa phiên bản Java.
- Biên dịch source code bằng UTF-8.
- Sử dụng API chuẩn của Java trước khi thêm thư viện bên ngoài.
- Ưu tiên kiểu dữ liệu bất biến.
- Sử dụng generic type đầy đủ.
- Xử lý compiler warning hợp lý.
- Sử dụng try-with-resources cho tài nguyên cần đóng.
- Chỉ sử dụng tính năng Java đã ổn định.

KHÔNG ĐƯỢC:

- Bật preview feature nếu chưa có quyết định kiến trúc.
- Sử dụng raw type.
- Sử dụng wildcard import.
- Để mutable static state dùng chung.
- Dùng reflection nếu có giải pháp rõ ràng hơn.
- Dùng `System.out.println()` hoặc `System.err.println()` để log ứng dụng.
- Bỏ qua compiler warning bằng `@SuppressWarnings` mà không có lý do.

Mỗi file Java thông thường chỉ nên chứa một public top-level class.

---

## 4. Cấu trúc package

Package gốc phải sử dụng reverse domain name và chứa application class ở
cấp cao nhất, ví dụ:

```text
com.phonestore
├── PhoneStoreApplication.java
├── config
├── common
├── security
├── integration
└── modules
```

`PhoneStoreApplication` phải nằm trên các package cần được Spring scan.

Không sử dụng default package.

Các module nghiệp vụ được đặt trong:

```text
com.phonestore.modules
```

Ví dụ:

```text
modules/
├── auth/
├── user/
├── catalog/
├── inventory/
├── cart/
├── order/
├── payment/
├── shipping/
├── promotion/
├── review/
└── administration/
```

Bên trong mỗi module có thể tổ chức:

```text
module-name/
├── controller/
├── dto/
│   ├── request/
│   └── response/
├── entity/
├── enumeration/
├── mapper/
├── repository/
├── service/
├── specification/
└── validation/
```

Không tạo package chỉ để chứa một file nếu package đó không thể hiện
ranh giới hoặc trách nhiệm rõ ràng.

---

## 5. Ranh giới module

Mỗi module phải sở hữu:

- Entity của mình.
- Repository của mình.
- Business Rules của mình.
- Application Service của mình.
- DTO thuộc API của mình.

Một module KHÔNG ĐƯỢC:

- Gọi trực tiếp Repository của module khác.
- Chỉnh sửa trực tiếp Entity thuộc module khác.
- Phụ thuộc vào implementation nội bộ của module khác.
- Tạo circular dependency với module khác.

Khi một module cần sử dụng chức năng của module khác, sử dụng một trong:

1. Public application service hoặc facade.
2. Interface contract.
3. ID hoặc immutable DTO.
4. Domain event hoặc application event.
5. Integration event nếu giao tiếp bất đồng bộ.

Không truyền JPA Entity qua ranh giới module nếu có thể truyền ID hoặc DTO
bất biến.

Ví dụ:

- Order không trực tiếp cập nhật Inventory entity.
- Order gọi Inventory service để giữ hoặc trừ tồn kho.
- Payment không trực tiếp thay đổi Order repository.
- Payment thông báo kết quả thông qua Order application service hoặc event.

Package `common` chỉ chứa thành phần thực sự không thuộc riêng module nào, như:

- API response nền tảng.
- Base exception.
- Pagination model.
- Auditing infrastructure.
- Generic validation.
- Utility thuần túy.

Không dùng `common` làm nơi chứa code chưa biết đặt ở đâu.

---

## 6. Quy tắc đặt tên

### Package

- Viết thường hoàn toàn.
- Không dùng dấu gạch dưới.
- Không dùng từ viết tắt khó hiểu.
- Tên package phải thể hiện nghiệp vụ hoặc trách nhiệm.

### Class

Sử dụng PascalCase và hậu tố rõ ràng:

- `ProductController`
- `ProductService`
- `ProductRepository`
- `ProductMapper`
- `CreateProductRequest`
- `ProductDetailResponse`
- `ProductNotFoundException`
- `ProductSpecification`

### Method

Sử dụng động từ thể hiện hành vi:

- `createProduct`
- `updateProduct`
- `findProductById`
- `reserveStock`
- `cancelOrder`
- `calculateTotal`
- `validateTransition`

Quy ước:

- `find...`: kết quả có thể không tồn tại.
- `get...`: kỳ vọng dữ liệu phải tồn tại hoặc sẽ ném exception.
- `exists...`: trả về boolean.
- `create...`: tạo mới.
- `update...`: cập nhật.
- `delete...`: xóa.
- `activate...`: kích hoạt.
- `deactivate...`: vô hiệu hóa.
- `validate...`: kiểm tra và có thể ném exception.
- `calculate...`: tính toán và trả kết quả.
- `is`, `has`, `can`, `should`: dùng cho boolean.

Không sử dụng tên chung chung như:

- `process`
- `handle`
- `execute`
- `doSomething`
- `data`
- `object`
- `manager`
- `helper`

Chỉ sử dụng những tên này khi ngữ cảnh đã làm rõ trách nhiệm.

### Biến

- Dùng tên có ý nghĩa.
- ID phải thể hiện đối tượng: `productId`, `orderId`, `userId`.
- Không dùng `id1`, `data2`, `temp`, `obj`.
- Collection sử dụng tên số nhiều.
- Boolean sử dụng tên thể hiện điều kiện.

---

## 7. Dependency Injection

PHẢI sử dụng constructor injection cho dependency bắt buộc.

Dependency phải được khai báo `final` nếu không cần thay đổi sau khi khởi tạo.

Ví dụ đúng:

```java
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
}
```

KHÔNG ĐƯỢC sử dụng field injection:

```java
@Autowired
private ProductRepository productRepository;
```

Không sử dụng setter injection cho dependency bắt buộc.

Setter injection chỉ có thể được sử dụng cho dependency tùy chọn và phải có
lý do rõ ràng.

Không gọi ApplicationContext để lấy Bean theo kiểu Service Locator.

Không lưu Spring Bean trong static field.

Nếu có nhiều Bean cùng kiểu:

- Sử dụng interface rõ ràng.
- Sử dụng `@Qualifier` có tên mang ý nghĩa nghiệp vụ.
- Hoặc sử dụng `@Primary` khi có implementation mặc định thực sự.

Không giải quyết circular dependency bằng cách:

- Bật `spring.main.allow-circular-references`.
- Lạm dụng `@Lazy`.
- Tự lấy Bean từ ApplicationContext.

Phải sửa lại ranh giới trách nhiệm hoặc thiết kế module.

---

## 8. Interface và implementation

Bắt buộc mọi Service đều phải sử dụng mô hình interface và class `Impl`.

1. Interface định nghĩa tất cả các thao tác nghiệp vụ công khai (`public contract`).
2. Class triển khai nằm trong sub-package `impl` và kết thúc bằng hậu tố `Impl`.

Mô hình này giúp cho:

- Tách biệt rõ ràng hợp đồng (contract) và logic thực thi (implementation).
- Tạo điều kiện thuận lợi cho việc viết Unit Test bằng mock.
- Dễ dàng thay thế implementation khi cần bảo trì hoặc nâng cấp thuật toán.

Ví dụ:

```text
ProductService (Interface)
impl/
└── ProductServiceImpl (Class)
```

---

## 9. Spring stereotype

Sử dụng annotation đúng ngữ nghĩa:

- `@RestController`: REST API.
- `@Controller`: MVC controller trả view.
- `@Service`: nghiệp vụ hoặc application service.
- `@Repository`: persistence adapter hoặc custom repository implementation.
- `@Component`: Bean không thuộc nhóm trên.
- `@Configuration`: cấu hình Bean.
- `@ConfigurationProperties`: nhóm cấu hình có kiểu dữ liệu.

Không sử dụng `@Component` thay thế tất cả stereotype khác.

Không đánh dấu một class là Spring Bean nếu class đó có thể là Java object
thuần túy và được tạo rõ ràng bởi một Bean khác.

Ưu tiên giữ domain logic độc lập với Spring khi có thể.

---

## 10. Configuration

Cấu hình phải được externalize khỏi source code.

Sử dụng:

```text
application.yml
application-local.yml
application-test.yml
application-prod.yml
```

Quy tắc:

- `application.yml` chứa cấu hình chung.
- Profile file chỉ chứa phần khác biệt.
- Secret được lấy từ biến môi trường hoặc secret manager.
- Không commit giá trị bí mật.
- Production phải fail fast khi thiếu cấu hình bắt buộc.
- Không sử dụng giá trị mặc định không an toàn cho secret.

Sử dụng `@ConfigurationProperties` cho nhóm cấu hình:

```text
app.jwt.*
app.storage.*
app.payment.*
app.inventory.*
app.cors.*
```

Ưu tiên immutable configuration properties.

Sử dụng validation cho configuration quan trọng.

Không rải nhiều `@Value` cho cùng một nhóm cấu hình.

`@Value` chỉ nên dùng cho giá trị nhỏ, độc lập và không tạo thành một
configuration object có cấu trúc.

Không đặt business logic trong configuration class.

Không đặt `@Profile` tràn lan trong code nghiệp vụ. Ưu tiên thay đổi adapter hoặc
Bean configuration theo môi trường.

---

## 11. Controller

Controller chỉ chịu trách nhiệm:

1. Nhận HTTP request.
2. Trích xuất path, query, header và body.
3. Kích hoạt validation.
4. Lấy thông tin người dùng đã xác thực.
5. Gọi application service.
6. Chuyển kết quả thành HTTP response.

Controller KHÔNG ĐƯỢC:

- Gọi trực tiếp Repository.
- Truy cập EntityManager.
- Tự tính giá đơn hàng.
- Tự cập nhật tồn kho.
- Chứa transaction nghiệp vụ.
- Chứa logic chuyển trạng thái.
- Chứa nhiều nhánh điều kiện nghiệp vụ.
- Bắt `Exception` chung.
- Trả trực tiếp Entity.
- Tự tạo response lỗi không thống nhất.

Controller phải mỏng và dễ đọc.

Đối với OpenAPI/Swagger:

- **BẮT BUỘC Contract-First**: Nguồn sự thật duy nhất nằm tại `docs/api/openapi.yaml`.
- KHÔNG sử dụng annotation sinh mã tự động.
- BẮT BUỘC cấu hình `springdoc.api-docs.enabled=false` để tắt engine dò quét tự động của Springdoc, chỉ sử dụng tính năng UI để serve file tĩnh.
- Không đưa Swagger annotation vào Entity, domain, Service, Repository, DTO hoặc Controller.

Sử dụng:

- `@PathVariable` cho định danh nằm trong đường dẫn.
- `@RequestParam` cho tìm kiếm, lọc, sắp xếp và phân trang.
- `@RequestBody` cho JSON request.
- `@RequestPart` cho multipart request.
- `@Valid` cho request object.
- Constraint trực tiếp cho primitive parameter khi cần method validation.

Không nhận `userId` từ request cho chức năng “của tôi” nếu có thể lấy danh tính
từ Security Context.

Ví dụ:

```text
GET /api/v1/me/orders
```

phải lấy người dùng hiện tại từ thông tin xác thực, không tin tưởng `userId`
do client gửi lên.

---

## 12. DTO

Entity và API contract phải được tách biệt.

Sử dụng DTO riêng cho từng mục đích:

```text
CreateProductRequest
UpdateProductRequest
ProductSummaryResponse
ProductDetailResponse
```

Không sử dụng một DTO duy nhất cho:

- Create.
- Update.
- Response.
- Internal communication.

DTO chỉ chứa dữ liệu cần thiết cho use case.

Request DTO không được cho client tự gửi các trường nhạy cảm như:

- Created time.
- Updated time.
- Audit user.
- Quyền hệ thống.
- Giá trị thanh toán đã xác nhận.
- Trạng thái quản trị không được phép.
- Tổng tiền do backend tính.
- Owner ID có thể lấy từ Security Context.

Có thể sử dụng Java record cho:

- Request DTO bất biến.
- Response DTO bất biến.
- Value object không phải JPA Entity.
- Internal query result.

Không sử dụng record làm JPA Entity thông thường.

Không trả graph đối tượng hai chiều qua DTO.

Không để DTO phụ thuộc trực tiếp vào JPA lazy proxy.

---

## 13. Validation

Validation được chia thành hai tầng.

### Structural validation

Đặt trên Request DTO:

- `@NotNull`
- `@NotBlank`
- `@Size`
- `@Min`
- `@Max`
- `@Positive`
- `@PositiveOrZero`
- `@Email`
- `@Pattern`
- Custom Bean Validation constraint

Structural validation kiểm tra hình dạng và giới hạn cơ bản của dữ liệu.

### Business validation

Đặt trong Service, domain service hoặc validator chuyên biệt:

- SKU đã tồn tại.
- Trạng thái đơn hàng có thể chuyển đổi.
- Coupon còn hiệu lực.
- Sản phẩm còn bán.
- Tồn kho đủ.
- Người dùng sở hữu đơn hàng.
- Thanh toán đã được xử lý.
- Người dùng có đủ điều kiện đánh giá.

Không gọi Repository trực tiếp từ Bean Validation annotation validator nếu việc
đó tạo truy vấn ẩn hoặc phụ thuộc nghiệp vụ khó kiểm soát.

Nếu cần kiểm tra dữ liệu database, ưu tiên thực hiện rõ ràng trong Service.

Không xem validation ở frontend là đủ.

---

## 14. Mapper

Mapper chỉ chịu trách nhiệm chuyển đổi dữ liệu.

Mapper KHÔNG ĐƯỢC:

- Gọi Repository.
- Gọi API bên ngoài.
- Tạo transaction.
- Kiểm tra quyền.
- Xử lý business workflow.
- Tự truy vấn dữ liệu bị thiếu.
- Làm phát sinh side effect.

Có thể sử dụng:

- Manual mapper.
- MapStruct.
- Constructor hoặc static factory cho mapping đơn giản.

Toàn bộ dự án phải sử dụng chiến lược nhất quán.

Không thêm thư viện mapper chỉ để thay thế vài dòng code rõ ràng.

Không sử dụng reflection mapper cho luồng nghiệp vụ quan trọng nếu làm mất
type safety hoặc che giấu field mapping.

Mapping cập nhật phải whitelist trường được phép thay đổi.

Không copy toàn bộ request sang Entity một cách mù quáng.

---

## 15. Service và business logic

Service method nên đại diện cho một use case rõ ràng:

- `createProduct`
- `reserveStock`
- `checkoutCart`
- `confirmPayment`
- `cancelOrder`

Service chịu trách nhiệm:

- Điều phối nghiệp vụ.
- Kiểm tra business rules.
- Quản lý transaction boundary.
- Gọi Repository.
- Gọi module contract.
- Tạo domain event.
- Chuyển đổi exception hạ tầng khi cần.

Service KHÔNG ĐƯỢC phụ thuộc vào:

- `HttpServletRequest`.
- `HttpServletResponse`.
- HTTP status code.
- Controller DTO nếu DTO đó chỉ dành riêng cho HTTP và làm rò rỉ web concern.
- Chi tiết giao diện ReactJS hoặc React Native.

Không đặt toàn bộ logic vào một Service khổng lồ.

Khi Service có quá nhiều trách nhiệm, tách theo use case hoặc capability:

```text
ProductCommandService
ProductQueryService
ProductPricingService
InventoryReservationService
OrderCancellationService
```

Không tách chỉ để giảm số dòng. Việc tách phải phản ánh trách nhiệm nghiệp vụ.

Business rule phức tạp nên được đặt trong:

- Domain object.
- Domain service.
- Policy.
- Validator.
- State transition component.

Không sử dụng Controller để thay thế domain layer.

---

## 16. Repository

Repository chỉ chịu trách nhiệm persistence.

Sử dụng Spring Data Repository phù hợp với nhu cầu.

Quy tắc:

- Dùng `Optional<T>` cho kết quả đơn có thể không tồn tại.
- Dùng `List<T>` khi số lượng có giới hạn rõ ràng.
- Dùng `Page<T>` khi cần tổng số phần tử.
- Dùng `Slice<T>` khi chỉ cần biết còn trang tiếp theo hay không.
- Dùng projection cho read model chỉ cần một số trường.
- Dùng specification hoặc custom repository cho truy vấn động phức tạp.
- Dùng `exists...` khi chỉ cần kiểm tra tồn tại.
- Không tải toàn Entity nếu chỉ cần một giá trị đơn giản.

KHÔNG ĐƯỢC:

- Gọi `findAll()` không giới hạn với bảng có thể tăng lớn.
- Đặt business workflow trong Repository.
- Trả `null` thay cho collection rỗng.
- Tạo derived query có tên quá dài và khó hiểu.
- Dùng native query nếu JPQL, projection hoặc custom repository giải quyết rõ ràng.
- Dùng EAGER để che giấu vấn đề N+1.
- Gọi Repository từ Controller.

Query phức tạp phải:

- Có tên thể hiện mục đích.
- Có test.
- Được kiểm tra index.
- Được kiểm tra số lượng query khi cần.
- Có pagination nếu kết quả có thể lớn.

`@Modifying` query phải xác định transaction và ảnh hưởng persistence context.

Không sử dụng bulk update nếu không hiểu việc Entity đang được quản lý có thể
bị lỗi thời so với database.

---

## 17. JPA Entity

JPA Entity phải tuân thủ:

- Là class không final.
- Có public hoặc protected no-argument constructor.
- Persistent field không final.
- Field nên có access modifier `private`.
- Không trả trực tiếp qua REST API.
- Không chứa Jackson API contract annotation nếu không thật sự cần.
- Không phụ thuộc Controller hoặc HTTP.
- Không sử dụng Lombok `@Data`.

Entity nên bảo vệ invariant thông qua method có ý nghĩa:

```text
order.cancel(...)
order.confirmPayment(...)
inventory.reserve(...)
product.deactivate(...)
```

Hạn chế public setter cho field quan trọng.

Không cho phép sửa trực tiếp:

- ID.
- Audit timestamps.
- Order total.
- Payment status.
- Stock quantity.
- Owner.
- Created by.

Relationship:

- Mặc định ưu tiên `LAZY`.
- Chỉ tạo bidirectional relationship khi cần điều hướng từ cả hai phía.
- Xác định owning side rõ ràng.
- Không dùng `CascadeType.ALL` theo thói quen.
- Chỉ cascade lifecycle thực sự thuộc cùng aggregate.
- Không sử dụng `orphanRemoval` nếu chưa hiểu hậu quả xóa dữ liệu.
- Không đưa relationship collection vào `toString`.

Equality:

- Không dùng Lombok tự động tạo `equals` và `hashCode` cho Entity.
- Không đưa mutable field hoặc relationship vào `equals` và `hashCode`.
- Nếu cần equality, sử dụng immutable natural key hoặc chiến lược an toàn
  cho generated ID đã được thống nhất.
- Phải kiểm thử hành vi Entity trong `Set`, `Map` và trước/sau khi persist
  nếu có override equality.

Entity có xung đột đồng thời nên cân nhắc `@Version`.

Không thêm `@Version` một cách máy móc; áp dụng cho dữ liệu cần optimistic
locking như tồn kho, coupon hoặc tài nguyên được cập nhật đồng thời.

---

## 18. Lombok

Lombok có thể được sử dụng có kiểm soát.

Được phép khi phù hợp:

- `@Getter`
- `@Setter` có chọn lọc
- `@RequiredArgsConstructor`
- `@Builder` cho DTO hoặc test data
- `@Slf4j`

KHÔNG sử dụng trên JPA Entity:

- `@Data`
- `@Value`
- `@EqualsAndHashCode` tự động bao gồm toàn bộ field
- `@ToString` tự động bao gồm relationship
- `@Builder` công khai nếu cho phép tạo Entity ở trạng thái không hợp lệ

Không để Lombok che giấu lifecycle và invariant của Entity.

Khi constructor hoặc factory method thể hiện nghiệp vụ tốt hơn, ưu tiên
constructor hoặc factory method rõ ràng.

---

## 19. Transaction

Transaction boundary thông thường được đặt tại Service use case.

Quy tắc:

- Use case ghi dữ liệu sử dụng `@Transactional`.
- Use case chỉ đọc có thể sử dụng `@Transactional(readOnly = true)`.
- Transaction phải ngắn nhất có thể.
- Không thực hiện remote network call dài bên trong transaction nếu có thể tránh.
- Không đặt transaction ở Controller.
- Không lạm dụng `REQUIRES_NEW`.
- Không tự ý thay đổi isolation level.
- Không bắt exception rồi tiếp tục transaction ở trạng thái không xác định.

Phải hiểu Spring transaction hoạt động thông qua proxy.

Lời gọi nội bộ trong cùng một class có thể không đi qua proxy:

```text
this.transactionalMethod()
```

Không dựa vào self-invocation để kích hoạt:

- `@Transactional`
- `@Async`
- `@Cacheable`
- AOP advice

Ưu tiên tách method sang Bean có trách nhiệm phù hợp.

Spring mặc định rollback với unchecked exception.

Nếu sử dụng checked exception và cần rollback, phải cấu hình rõ:

```java
@Transactional(rollbackFor = SomeCheckedException.class)
```

Không bắt exception chỉ để log rồi ném lại ở mọi tầng.

Side effect bên ngoài như email hoặc notification nên được thực hiện sau khi
transaction chính commit thành công.

Với sự kiện quan trọng cần độ tin cậy cao, cân nhắc Outbox Pattern thay vì
gọi trực tiếp bên ngoài trong transaction.

---

## 20. Null và Optional

Không trả `null` cho collection.

Trả về:

- `List.of()`
- `Set.of()`
- Collection rỗng phù hợp

`Optional` chủ yếu được sử dụng làm return type khi kết quả có thể không tồn tại.

Không sử dụng `Optional`:

- Là field của JPA Entity.
- Là field DTO thông thường.
- Là method parameter.
- Là giá trị có thể tự nó bằng `null`.
- Chỉ để gọi `.get()` ngay sau đó.

Ưu tiên:

- `orElseThrow`
- `map`
- `flatMap`
- `ifPresent`
- `or`

Không lạm dụng Optional trong business logic nếu một exception nghiệp vụ
thể hiện ý nghĩa rõ ràng hơn.

---

## 21. Collection và Stream

Ưu tiên collection bất biến khi dữ liệu không cần thay đổi.

Không trả collection nội bộ có thể bị caller chỉnh sửa nếu điều đó phá vỡ
invariant.

Có thể sử dụng Stream khi:

- Thể hiện pipeline biến đổi rõ ràng.
- Không có side effect.
- Không làm code khó debug.
- Không che giấu truy vấn database.

Không sử dụng Stream chỉ để viết code ngắn hơn.

Không thực hiện side effect trong `map`, `filter` hoặc `peek`.

Không sử dụng parallel stream trong luồng request nếu chưa đo lường và chưa
kiểm soát thread pool.

Không chuyển toàn bộ dữ liệu database thành Stream Java để lọc nếu database
có thể thực hiện truy vấn hiệu quả hơn.

---

## 22. Tiền tệ và BigDecimal

Mọi giá trị tiền tệ phải sử dụng `BigDecimal`.

PHẢI:

- Xác định scale và rounding mode.
- Sử dụng `compareTo` khi so sánh giá trị số.
- Sử dụng constant cho tỷ lệ dùng chung.
- Kiểm tra giá trị âm hoặc vượt giới hạn.
- Tính toán tiền ở backend.

NÊN tạo từ:

```java
new BigDecimal("19.99")
```

hoặc:

```java
BigDecimal.valueOf(19.99)
```

Không tạo trực tiếp từ floating-point constructor:

```java
new BigDecimal(19.99)
```

Không dùng `equals` nếu mục tiêu là so sánh giá trị số và không quan tâm scale.

Ví dụ:

```java
price.compareTo(BigDecimal.ZERO) > 0
```

Quy tắc chi tiết về tiền, giảm giá và tổng đơn hàng được đặt trong Skill nghiệp vụ.

---

## 23. Date và time

Sử dụng Java Time API.

Lựa chọn kiểu dữ liệu theo ý nghĩa:

- `Instant`: thời điểm tuyệt đối, audit và persistence timestamp.
- `OffsetDateTime`: thời điểm cần giữ offset.
- `LocalDate`: ngày không có thời gian, ví dụ ngày sinh.
- `LocalTime`: thời gian trong ngày.
- `Duration`: khoảng thời gian.
- `ZoneId`: múi giờ nghiệp vụ.

Không sử dụng `LocalDateTime` cho thời điểm tuyệt đối nếu thiếu múi giờ có thể
gây hiểu nhầm.

Lưu timestamp hệ thống theo UTC.

Chuyển đổi múi giờ ở biên API hoặc presentation khi cần.

Không gọi trực tiếp thời gian hệ thống trong business logic khó kiểm thử:

```java
Instant.now()
LocalDate.now()
```

Ưu tiên inject `Clock`:

```java
Instant.now(clock)
LocalDate.now(clock)
```

Không dùng `java.util.Date` hoặc `Calendar` cho code mới nếu Java Time API
đáp ứng được yêu cầu.

---

## 24. Exception handling

Sử dụng exception có ý nghĩa:

```text
ProductNotFoundException
InsufficientStockException
InvalidOrderTransitionException
PaymentAlreadyProcessedException
ResourceOwnershipException
```

Không sử dụng một `RuntimeException` chung cho mọi lỗi.

Không dùng exception để điều khiển luồng bình thường.

Không:

- Bắt exception rồi bỏ qua.
- Trả `null` khi có lỗi.
- Log cùng một exception ở nhiều tầng.
- Trả stack trace cho client.
- Trả nội dung exception database trực tiếp qua API.
- Chuyển mọi lỗi thành HTTP 500.

Sử dụng `@RestControllerAdvice` để xử lý lỗi tập trung.

Global exception handler phải xử lý phù hợp:

- Validation request.
- Method parameter validation.
- Resource not found.
- Duplicate/conflict.
- Authentication.
- Authorization.
- Business rule violation.
- External service failure.
- Unexpected system failure.

Chi tiết error response được quy định trong `40-api-standards.md`.

---

## 25. Logging

Sử dụng SLF4J thông qua logging framework của Spring Boot.

Không sử dụng:

```java
System.out.println(...)
System.err.println(...)
exception.printStackTrace()
```

Sử dụng parameterized logging:

```java
log.info("Created order orderId={} customerId={}", orderId, customerId);
```

Không nối String không cần thiết:

```java
log.info("Created order " + orderId);
```

Quy tắc log level:

- `TRACE`: thông tin cực chi tiết để chẩn đoán.
- `DEBUG`: thông tin kỹ thuật phục vụ phát triển.
- `INFO`: sự kiện nghiệp vụ hoặc lifecycle quan trọng.
- `WARN`: tình huống bất thường nhưng hệ thống còn xử lý được.
- `ERROR`: lỗi khiến operation thất bại hoặc cần can thiệp.

Không log:

- Password.
- Access token.
- Refresh token.
- API secret.
- Authorization header.
- Thông tin thanh toán nhạy cảm.
- Toàn bộ request body chứa dữ liệu riêng tư.

Không vừa log exception vừa ném tiếp ở nhiều tầng.

Ưu tiên log exception tại boundary có đủ ngữ cảnh để xử lý.

Log nghiệp vụ nên có identifier liên quan:

- requestId
- traceId
- userId
- orderId
- paymentId
- productId

Không log toàn bộ Entity bằng `toString`.

---

## 26. Async, scheduler và thread

Không tạo thread thủ công bằng:

```java
new Thread(...)
```

Nếu cần bất đồng bộ:

- Sử dụng executor được cấu hình.
- Đặt tên thread.
- Giới hạn queue.
- Xác định rejection policy.
- Xử lý exception.
- Xác định context cần truyền.

Không sử dụng `@Async` nếu chưa xác định:

- Executor nào được dùng.
- Dữ liệu transaction đã commit chưa.
- Security context có cần truyền không.
- Lỗi được quan sát như thế nào.
- Tác vụ có cần retry không.

Không giả định transaction hiện tại được truyền sang async thread.

Scheduled job phải:

- Có idempotency khi phù hợp.
- Không chạy chồng chéo ngoài ý muốn.
- Xem xét distributed lock nếu triển khai nhiều instance.
- Có log và metric.
- Xử lý retry có giới hạn.
- Không nuốt exception.

---

## 27. External integration

Tích hợp bên ngoài phải được đặt sau interface hoặc adapter rõ ràng.

Ví dụ:

```text
PaymentGateway
StorageService
EmailSender
ShippingProvider
```

Code nghiệp vụ không phụ thuộc trực tiếp vào SDK cụ thể của nhà cung cấp.

Adapter phải chịu trách nhiệm:

- Chuyển đổi request.
- Chuyển đổi response.
- Xử lý timeout.
- Xử lý lỗi giao tiếp.
- Che giấu chi tiết SDK.
- Ghi metric và log phù hợp.

Phải cấu hình:

- Connection timeout.
- Read timeout.
- Retry có giới hạn.
- Backoff khi cần.
- Circuit breaker khi rủi ro phù hợp.

Không retry mù quáng thao tác không idempotent.

Không mock SDK rải rác trong business test; mock interface của dự án.

---

## 28. Gradle và dependency

Sử dụng Gradle Wrapper:

```text
gradlew
gradlew.bat
gradle/wrapper/
```

Build và test phải chạy thông qua Wrapper.

PHẢI:

- Khóa Java Toolchain.
- Sử dụng repository đáng tin cậy.
- Sử dụng dependency scope phù hợp.
- Tận dụng dependency management của Spring Boot.
- Cố định plugin version cần thiết.
- Kiểm tra dependency conflict.
- Loại bỏ dependency không sử dụng.

KHÔNG ĐƯỢC:

- Sử dụng dynamic version như `1.+`.
- Sử dụng version `latest.release`.
- Sử dụng `SNAPSHOT` trong release ổn định.
- Ghi credentials vào `build.gradle`.
- Khai báo version riêng cho dependency đã được Spring Boot quản lý nếu không
  có lý do tương thích cụ thể.
- Thêm nhiều starter có chức năng trùng lặp.

Với dự án nhiều module, nên sử dụng version catalog hoặc cơ chế tập trung version.

Cân nhắc dependency locking và dependency verification để tăng khả năng
tái tạo build và bảo vệ dependency supply chain.

Mọi dependency mới phải nêu:

1. Mục đích.
2. Phần source code sử dụng.
3. Vì sao thư viện hiện tại không đáp ứng.
4. Rủi ro bảo trì.
5. Rủi ro bảo mật.
6. Ảnh hưởng kích thước và thời gian build.

---

## 29. Khả năng kiểm thử

Code phải được thiết kế để kiểm thử, không chỉ viết test sau khi hoàn thành.

PHẢI:

- Inject dependency.
- Inject `Clock` cho logic phụ thuộc thời gian.
- Bọc external SDK bằng interface.
- Tránh static mutable state.
- Tránh constructor có I/O hoặc business processing.
- Tách business logic khỏi Controller.
- Tách query khỏi side effect khi cần.
- Đảm bảo kết quả xác định với cùng một input.

Không che giấu dependency bằng:

- Static method gọi network.
- Service locator.
- Global singleton mutable.
- Truy cập environment trực tiếp trong business class.
- Gọi thời gian hệ thống trực tiếp ở nhiều nơi.

Chi tiết loại test và quality gate được quy định trong
`50-testing-requirements.md`.

---

## 30. Code clarity

Code phải ưu tiên khả năng đọc và bảo trì.

NÊN:

- Dùng guard clause để giảm nesting.
- Tách method khi nó có trách nhiệm độc lập.
- Giữ method ở mức trừu tượng nhất quán.
- Dùng tên thể hiện ý định.
- Dùng comment để giải thích “tại sao”.
- Dùng constant hoặc configuration cho giá trị có ý nghĩa nghiệp vụ.
- Dùng immutable object khi có thể.
- Dùng early return khi làm logic rõ hơn.

KHÔNG:

- Viết comment lặp lại chính xác điều code đang làm.
- Để code chết hoặc code bị comment.
- Để TODO không có lý do hoặc task liên quan.
- Dùng magic number cho quy tắc nghiệp vụ.
- Tạo method có nhiều boolean parameter khó hiểu.
- Tạo class God Object.
- Tạo utility class chứa nghiệp vụ.
- Tạo abstraction chỉ vì dự đoán có thể dùng trong tương lai.
- Tối ưu hiệu năng khi chưa có bằng chứng.

Không đặt giới hạn số dòng máy móc cho class hoặc method.

Đánh giá dựa trên:

- Số trách nhiệm.
- Độ phức tạp.
- Khả năng đặt tên.
- Khả năng kiểm thử.
- Mức độ kết nối với thành phần khác.

---

## 31. API và backward compatibility

Không thay đổi API công khai một cách âm thầm.

Thay đổi có thể phá vỡ client gồm:

- Đổi URL.
- Đổi HTTP method.
- Đổi tên field.
- Xóa field.
- Đổi kiểu dữ liệu.
- Đổi ý nghĩa status.
- Đổi cấu trúc error response.
- Thay đổi quy tắc pagination.

Trước thay đổi phá vỡ:

1. Xác định client bị ảnh hưởng.
2. Cập nhật API contract.
3. Xác định chiến lược versioning hoặc migration.
4. Cập nhật ReactJS và React Native nếu thuộc phạm vi.
5. Cập nhật test.
6. Ghi lại quyết định.

Chi tiết REST API được quy định trong `40-api-standards.md`.

---

## 32. Quy trình tạo chức năng Java/Spring

Khi triển khai một chức năng mới:

1. Đọc yêu cầu nghiệp vụ.
2. Xác định module sở hữu chức năng.
3. Xác định quyền truy cập.
4. Kiểm tra database hiện tại.
5. Xác định transaction boundary.
6. Thiết kế Request DTO.
7. Thiết kế Response DTO.
8. Thiết kế Service use case.
9. Thiết kế Repository query.
10. Thiết kế Entity thay đổi nếu cần.
11. Viết validation.
12. Viết mapping.
13. Viết Controller.
14. Viết exception handling.
15. Viết test.
16. Kiểm tra build.
17. Kiểm tra API contract.
18. Kiểm tra thay đổi không liên quan.
19. Cập nhật tài liệu.

Không bắt đầu từ Controller rồi tự suy luận ngược nghiệp vụ trong khi code.

---

## 33. Checklist review Java/Spring

Trước khi xem code hoàn thành, kiểm tra:

### Kiến trúc

- [ ] Code nằm đúng module.
- [ ] Không có circular dependency.
- [ ] Không gọi Repository của module khác.
- [ ] `common` không chứa nghiệp vụ riêng.
- [ ] Application class nằm ở root package.

### Dependency Injection

- [ ] Sử dụng constructor injection.
- [ ] Dependency bắt buộc là final.
- [ ] Không có field injection.
- [ ] Không có Service Locator.
- [ ] Không bật circular reference.

### Controller và DTO

- [ ] Controller không chứa business logic.
- [ ] Controller không gọi Repository.
- [ ] Không trả Entity.
- [ ] Request và Response DTO được tách.
- [ ] Validation được áp dụng.
- [ ] Không tin tưởng userId hoặc giá từ client.

### Service và Transaction

- [ ] Service method thể hiện use case.
- [ ] Transaction boundary đúng.
- [ ] Không phụ thuộc HTTP.
- [ ] Không remote call dài trong transaction.
- [ ] Không dựa vào self-invocation.
- [ ] Checked exception rollback được xử lý nếu cần.

### Repository và JPA

- [ ] Không có truy vấn không giới hạn.
- [ ] Query phức tạp có test.
- [ ] Relationship không bị EAGER tùy tiện.
- [ ] Cascade được xác định rõ.
- [ ] Entity có protected/public no-arg constructor.
- [ ] Không sử dụng `@Data` cho Entity.
- [ ] Không trả Entity qua API.
- [ ] Equality không chứa mutable relationship.

### Java

- [ ] Dùng BigDecimal cho tiền.
- [ ] Dùng Java Time API.
- [ ] Logic thời gian có thể inject Clock.
- [ ] Optional chỉ được dùng phù hợp.
- [ ] Không trả null collection.
- [ ] Không có mutable static state.
- [ ] Không có wildcard import.
- [ ] Không dùng preview feature ngoài ý muốn.

### Logging và lỗi

- [ ] Không sử dụng `System.out`.
- [ ] Không log secret hoặc token.
- [ ] Exception có ý nghĩa.
- [ ] Không catch rồi bỏ qua.
- [ ] Không log cùng exception ở nhiều tầng.
- [ ] API không lộ stack trace.

### Build và chất lượng

- [ ] Gradle Wrapper hoạt động.
- [ ] Không có dynamic dependency version.
- [ ] Không có dependency dư thừa.
- [ ] Source code compile.
- [ ] Test liên quan thành công.
- [ ] Không tuyên bố thành công nếu chưa xác minh.

---

## 34. Cách báo cáo ngoại lệ

Nếu cần vi phạm một Rule trong tài liệu này, phải báo cáo:

```text
Rule:
Lý do:
Phạm vi ảnh hưởng:
Phương án thay thế đã xem xét:
Rủi ro:
Test bảo vệ:
Kế hoạch hoàn tác:
```

Không được âm thầm bỏ qua Rule.
