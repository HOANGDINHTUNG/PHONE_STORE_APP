# Unit testing

- Đặt tên theo `given_when_then` hoặc ngôn ngữ hành vi nhất quán.
- Mỗi test một hành vi/invariant chính.
- Dùng builder/fixture rõ; tránh magic value.
- Mock port ngoài aggregate, không mock value object/domain entity.
- Kiểm tra output/state/domain event và interaction chỉ khi interaction là contract.
- Dùng clock/ID generator inject được cho thời gian và định danh.
- Test boundary: 0, 1, max, expired, duplicate, invalid transition, rounding.
- Không dùng sleep, random không seed hoặc thời gian hệ thống trực tiếp.

