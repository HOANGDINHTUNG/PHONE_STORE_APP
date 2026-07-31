import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { useStore } from "../../context/StoreContext";
import styles from "./Login.module.css";

const Login = () => {
  const { login } = useStore();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const { emailOrPhone, password } = values;
    const success = login(emailOrPhone, password);
    if (success) {
      message.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      message.error("Sai thông tin đăng nhập.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Left Column - Image & Overlay */}
        <div className={styles.leftCol}>
          <div className={styles.overlay}>
            <div className={styles.leftTop}>
              <Link to="/" className={styles.leftLogo}>
                Pink<span>Phone</span>
              </Link>
            </div>
            <div className={styles.leftBottom}>
              <h2 className={styles.overlayTitle}>PinkPhone</h2>
              <p className={styles.overlayDesc}>
                Precision in every pixel. Experience the future of mobile
                technology with our signature pink collection.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Ant Design Form */}
        <div className={styles.rightCol}>
          <div className={styles.formWrapper}>
            <h2 className={styles.formTitle}>Đăng nhập tài khoản</h2>
            <p className={styles.formSubtitle}>
              Đăng nhập để theo dõi đơn hàng và mua sắm thuận tiện hơn.
            </p>

            <Form
              name="login_form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              requiredMark={false}
              className={styles.form}
            >
              <Form.Item
                label="Email hoặc Số điện thoại"
                name="emailOrPhone"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Email hoặc Số điện thoại!",
                  },
                ]}
              >
                <Input
                  placeholder="name@example.com"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className={styles.input}
                />
              </Form.Item>

              <div className={styles.formActions}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className={styles.checkbox}>
                    Ghi nhớ đăng nhập
                  </Checkbox>
                </Form.Item>
                <a href="#forgot" className={styles.forgotLink}>
                  Quên mật khẩu?
                </a>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className={styles.submitBtn}
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className={styles.divider}>
                <span>HOẶC TIẾP TỤC VỚI</span>
              </div>

              <div className={styles.socialGrid}>
                <Button
                  className={styles.socialBtn}
                  icon={<GoogleOutlined className={styles.googleIcon} />}
                >
                  Tiếp tục với Google
                </Button>
                <Button
                  className={styles.socialBtn}
                  icon={<FacebookOutlined className={styles.facebookIcon} />}
                >
                  Tiếp tục với Facebook
                </Button>
              </div>

              <div className={styles.footerLink}>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
