# Testing strategy

| Loại           | Mục tiêu                                                | Công cụ                             |
| -------------- | ------------------------------------------------------- | ----------------------------------- |
| Unit           | Invariant, tính toán, state transition                  | JUnit 5, AssertJ, Mockito tối thiểu |
| Slice          | Controller/serialization/security hoặc repository query | `@WebMvcTest`, `@DataJpaTest`       |
| Integration    | Use case + MySQL/Flyway/transaction                     | `@SpringBootTest`, Testcontainers   |
| Contract       | REST/OpenAPI/provider adapter                           | Mock server/contract test phù hợp   |
| Architecture   | Dependency/module boundary                              | ArchUnit/Modulith test              |
| Security       | Authentication/role/ownership/abuse                     | Spring Security Test + integration  |
| Property-Based | Kiểm tra invariant với nhiều tổ hợp và vùng biên        | jqwik                               |
| Mutation       | Đánh giá unit test có phát hiện logic bị thay đổi       | PITest                              |
| Fuzz           | Tìm crash, timeout và lỗi xử lý input không tin cậy     | Jazzer                              |

Ưu tiên test nhanh nhiều ở dưới, nhưng luồng checkout/payment/inventory cần integration test thực tế.

## Thứ tự áp dụng

1. Dùng JUnit 5 và Mockito cho test nền tảng.
2. Dùng jqwik khi logic có invariant hoặc không gian đầu vào lớn.
3. Dùng PITest để đo độ mạnh của unit test ở domain/application.
4. Dùng Jazzer cho input không tin cậy và security boundary.
5. Dùng integration test để xác nhận database, transaction và provider adapter.

Không bắt buộc chạy full mutation và fuzz campaign trong mọi commit. PR phải chạy regression corpus; mutation/fuzz dài có thể chạy theo module thay đổi hoặc nightly.
