import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmEmailVerificationApi } from "../../api/authService";
import styles from "../Login/Login.module.css";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      const success = await confirmEmailVerificationApi(token);
      if (active) {
        setStatus(success ? "success" : "error");
      }
    };
    verify();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className={styles.loginContainer}>
      <div
        className={styles.loginCard}
        style={{
          gridTemplateColumns: "1fr",
          maxWidth: "600px",
          minHeight: "400px",
        }}
      >
        <div
          className={styles.rightCol}
          style={{ padding: "40px 24px", justifyContent: "center" }}
        >
          <div className={styles.formWrapper} style={{ textAlign: "center" }}>
            <Link
              to="/"
              className={styles.logo}
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "var(--primary-color)",
                textDecoration: "none",
              }}
            >
              Pink<span style={{ color: "var(--text-color)" }}>Phone</span>
            </Link>

            <div style={{ margin: "40px 0" }}>
              {status === "loading" && (
                <>
                  <LoadingOutlined
                    style={{ fontSize: "48px", color: "var(--primary-color)" }}
                    spin
                  />
                  <h2
                    className={styles.formTitle}
                    style={{ marginTop: "24px" }}
                  >
                    Đang xác thực...
                  </h2>
                  <p className={styles.formSubtitle}>
                    Vui lòng đợi trong giây lát
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircleFilled
                    style={{ fontSize: "52px", color: "#52c41a" }}
                  />
                  <h2
                    className={styles.formTitle}
                    style={{ marginTop: "24px" }}
                  >
                    Xác thực email thành công!
                  </h2>
                  <p className={styles.formSubtitle}>
                    Tài khoản của bạn đã được xác thực an toàn. Bây giờ bạn có
                    thể đăng nhập và trải nghiệm dịch vụ.
                  </p>
                </>
              )}

              {status === "error" && (
                <>
                  <CloseCircleFilled
                    style={{ fontSize: "52px", color: "#ff4d4f" }}
                  />
                  <h2
                    className={styles.formTitle}
                    style={{ marginTop: "24px" }}
                  >
                    Xác thực thất bại
                  </h2>
                  <p className={styles.formSubtitle}>
                    Đường dẫn xác thực không hợp lệ hoặc đã hết hạn. Vui lòng
                    yêu cầu lại đường dẫn mới.
                  </p>
                </>
              )}
            </div>

            <Link
              to="/login"
              className={styles.submitBtn}
              style={{
                display: "inline-flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Tiếp tục đến Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
