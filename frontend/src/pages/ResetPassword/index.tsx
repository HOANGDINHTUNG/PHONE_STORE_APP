import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { confirmPasswordResetApi } from "../../api/authService";
import styles from "../Login/Login.module.css";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (!token) {
      message.error("Mã token không hợp lệ hoặc đã hết hạn.");
      return;
    }

    setLoading(true);
    const success = await confirmPasswordResetApi(token, values.password);
    setLoading(false);

    if (success) {
      message.success(
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.",
      );
      navigate("/login");
    } else {
      message.error("Có lỗi xảy ra khi đổi mật khẩu, vui lòng thử lại sau.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          <div className={styles.overlay}>
            <div className={styles.leftTop}>
              <Link to="/" className={styles.leftLogo}>
                Pink<span>Phone</span>
              </Link>
            </div>
            <div className={styles.leftBottom}>
              <h2 className={styles.overlayTitle}>Bảo Mật An Toàn</h2>
              <p className={styles.overlayDesc}>
                Chào mừng bạn quay lại. Vui lòng thiết lập một mật khẩu mới mạnh
                mẽ để bảo vệ tài khoản của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>Đặt lại mật khẩu mới</h2>
            <p className={styles.formSubtitle}>
              Mật khẩu mới của bạn phải tối thiểu 6 ký tự và khác với mật khẩu
              cũ.
            </p>

            <Form
              name="reset_password_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className={styles.form}
            >
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu phải từ 6 ký tự trở lên!" },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu nhập lại không khớp!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className={styles.submitBtn}
                >
                  Xác nhận thay đổi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
