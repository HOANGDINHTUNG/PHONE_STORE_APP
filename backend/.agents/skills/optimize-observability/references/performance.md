# Performance

1. Xác định SLO/use case và workload đại diện.
2. Đo p50/p95/p99, throughput, error và resource.
3. Profile để tìm bottleneck thật.
4. Tối ưu một biến có giả thuyết.
5. Chạy lại cùng workload và so sánh.
6. Kiểm tra correctness/security regression.

Ưu tiên sửa N+1, query/index, payload/phân trang, pool/timeout và network call trước micro-optimization Java. Không tăng pool vô hạn. Load test dùng dữ liệu giả, môi trường cô lập và giới hạn an toàn. Ghi kết quả, cấu hình, dataset, commit/version và điều kiện đo.

