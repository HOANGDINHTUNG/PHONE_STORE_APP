# Environment deployment

- Cấu hình qua environment/config/secret manager, không bake secret vào image.
- Danh sách biến bắt buộc có tên, mô tả, owner, secret flag và default an toàn.
- Fail-fast khi thiếu DB/JWT/provider credential.
- Production profile không bật debug, show SQL hoặc public actuator rộng.
- CORS, issuer/audience, provider URL và timeout theo environment.
- Database credential least privilege; migration credential tách runtime nếu khả thi.
- Clock/timezone UTC và đồng bộ.
- Thay đổi config được version/audit và có rollback.
- Không tái sử dụng production secret ở staging/test.

