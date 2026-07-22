---
title: Chính sách kiểm chứng nguồn
tags: [governance, sources, verification]
status: maintained
verified_on: 2026-07-21
---

# Chính sách kiểm chứng nguồn

## 1. Thứ bậc bằng chứng

| Cấp | Loại nguồn                                                                                                 | Cách dùng                                  |
| --- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| A   | Tiêu chuẩn chính thức: RFC, JSR/Jakarta spec, NIST, ISO; tài liệu chính thức của Java, Spring, MySQL       | Có thể làm căn cứ chuẩn nếu đúng phiên bản |
| B   | Security advisory/CVE, release note, migration guide, mã nguồn và test của dự án gốc                       | Xác minh hành vi phiên bản cụ thể          |
| C   | Sách chuyên ngành có tác giả/nhà xuất bản uy tín; bài nghiên cứu; tài liệu vendor về chính sản phẩm của họ | Giải thích sâu, phải ghi năm/edition       |
| D   | Bài viết kỹ thuật của kỹ sư có ví dụ tái hiện, benchmark công khai                                         | Nguồn bổ trợ, không tự động thành luật     |
| E   | Blog SEO, video ngắn, diễn đàn, câu trả lời AI, benchmark không có môi trường                              | Chỉ là manh mối để truy về nguồn A–C       |

“Nhiều người nói giống nhau” không đồng nghĩa đã được kiểm chứng. Một tuyên bố chỉ được gắn `verified` khi biết nó áp dụng cho phiên bản nào và có nguồn đủ mạnh hoặc test tái hiện.

## 2. Metadata bắt buộc cho ghi chú kỹ thuật

```yaml
---
title: Ten ghi chu
status: verified       # draft | unverified | verified | deprecated
verified_on: 2026-07-21
applies_to:
  java: "21"
  spring_boot: "4.1.x"
  database: "MySQL 8.4"
sources:
  - https://...
owner: Hoang Dinh Tung
review_cycle: 6-months
---
```

Nếu ghi chú chứa nhiều nhánh phiên bản, tách mục `Spring Boot 3.5.x` và `Spring Boot 4.1.x`; không dùng câu mơ hồ như “Spring Boot hiện nay”.

## 3. Quy trình đưa một kiến thức mới vào vault

1. Viết tuyên bố cần kiểm chứng dưới dạng cụ thể: hành vi, điều kiện, phiên bản.
2. Tìm tài liệu chính thức hoặc specification trước.
3. Kiểm tra release note/migration guide nếu liên quan phiên bản.
4. Nếu tài liệu chưa đủ, tạo minimal reproducible example hoặc benchmark.
5. Ghi cả trường hợp phản ví dụ và giới hạn áp dụng.
6. Phân biệt rõ: **fact**, **recommendation**, **project decision**, **hypothesis**.
7. Cập nhật `verified_on`, nguồn và changelog.

## 4. Xử lý mâu thuẫn nguồn

Ưu tiên theo thứ tự: tài liệu đúng phiên bản → specification → mã nguồn/test của phiên bản → maintainer clarification → nguồn giải thích. Khi tài liệu và runtime khác nhau, ghi nhận bug/behavior cụ thể; không tự suy diễn rằng mọi phiên bản đều giống nhau.

## 5. Tiêu chuẩn đối với benchmark

Benchmark chỉ có giá trị khi ghi đủ:

- mục tiêu và giả thuyết;
- dataset, phân bố dữ liệu và cardinality;
- schema, index, query;
- phiên bản JVM, framework, DB, OS và tài nguyên;
- warm-up, số lần chạy, concurrency;
- p50/p95/p99, throughput và error rate;
- plan `EXPLAIN ANALYZE`, CPU, memory, I/O;
- phương án đối chứng và sai số.

Không kết luận “X nhanh hơn Y” từ một lần chạy trên dữ liệu đồ chơi.

## 6. Chu kỳ rà soát

| Loại nội dung | Chu kỳ đề xuất |
|---|---|
| Version/dependency/security | Mỗi tháng và khi có release/CVE |
| Spring configuration/API | 3 tháng |
| Kiến trúc, REST, database principle | 6–12 tháng |
| ADR của dự án | Khi constraint hoặc kiến trúc thay đổi |
| Runbook vận hành | Sau mỗi incident hoặc thay đổi deployment |

## 7. Quy tắc trích dẫn cho AI Agent

Agent phải chỉ ra nguồn hoặc ghi chú đã dùng khi:

- đề xuất dependency/configuration mới;
- kết luận về security;
- thay đổi transaction/isolation/locking;
- tạo index hoặc viết query tối ưu;
- thực hiện migration phiên bản;
- khẳng định một API đã deprecated/removed.

Nếu chưa có bằng chứng, Agent phải nói “chưa xác minh” và đề xuất cách kiểm tra, không được biến suy đoán thành sự thật.

