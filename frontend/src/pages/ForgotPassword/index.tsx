import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { requestPasswordResetApi } from "../../api/authService";
import styles from "../Login/Login.module.css";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    const success = await requestPasswordResetApi(values.email);
    setLoading(false);

    if (success) {
      message.success(
        "Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.",
      );
      navigate("/login");
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
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
              <h2 className={styles.overlayTitle}>Quên Mật Khẩu</h2>
              <p className={styles.overlayDesc}>
                Nhập email đã đăng ký của bạn để chúng tôi giúp bạn lấy lại mật
                khẩu một cách an toàn.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.formWrapper}>
            <Link
              to="/login"
              className="text-gray-500 hover:text-[#E91E63] font-medium flex items-center gap-1 mb-8"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeftOutlined /> Quay lại đăng nhập
            </Link>

            <h2 className={styles.formTitle}>Khôi phục mật khẩu</h2>
            <p className={styles.formSubtitle}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn
              đổi mật khẩu.
            </p>

            <Form
              name="forgot_password_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className={styles.form}
            >
              <Form.Item
                label="Địa chỉ Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập Email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  placeholder="name@example.com"
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
                  Gửi Yêu Cầu
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
