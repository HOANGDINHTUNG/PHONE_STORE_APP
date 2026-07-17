# Release checklist

- [ ] Scope/release notes và owner rõ.
- [ ] Full quality gate pass trên revision phát hành.
- [ ] Không có secret hoặc lỗ hổng vượt policy.
- [ ] Migration review, backup, lock estimate và compatibility pass.
- [ ] OpenAPI/event compatibility được xác nhận.
- [ ] Production không public Swagger UI, runtime docs hoặc external spec path ngoài policy.
- [ ] Image immutable, non-root, scan pass.
- [ ] Environment config/secret đã sẵn sàng.
- [ ] Dashboard, alert và runbook cập nhật.
- [ ] Smoke test định nghĩa trước.
- [ ] Rollout/rollback decision maker và cửa sổ theo dõi rõ.
- [ ] Thực hiện smoke test sau deploy.
- [ ] Ghi release evidence và sự cố nếu có.
