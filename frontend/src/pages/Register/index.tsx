import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Row, Col, message } from "antd";
import {
  MobileOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useStore } from "../../context/StoreContext";
import styles from "./Register.module.css";

const Register = () => {
  const { registerUser } = useStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const passwordValue = Form.useWatch("password", form);

  const getPasswordStrength = (pass?: string) => {
    if (!pass) return { text: "Chưa nhập", color: "#999", progress: 0 };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score < 3)
      return {
        text: "Yếu (Cần thêm ký tự, số)",
        color: "#ff4d4f",
        progress: 33,
      };
    if (score < 5)
      return { text: "Trung bình", color: "#faad14", progress: 66 };
    return { text: "Mạnh", color: "#52c41a", progress: 100 };
  };

  const strength = getPasswordStrength(passwordValue);

  const onFinish = async (values: any) => {
    try {
      const success = await registerUser(values);
      if (success) {
        message.success("Đăng ký tài khoản thành công!");
        navigate("/");
      } else {
        message.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error: any) {
      const data = error.response?.data;
      const detail = data?.detail || "";

      // Handle structural validation fieldErrors mapped by GlobalExceptionHandler
      if (data?.errorCode === "VALIDATION_FAILED" && data?.fieldErrors) {
        const fieldErrors = Object.keys(data.fieldErrors).map((key) => ({
          name: key,
          errors: [data.fieldErrors[key]],
        }));
        form.setFields(fieldErrors);
      } else if (detail.includes("Email and Phone")) {
        form.setFields([
          { name: "email", errors: ["Email này đã được sử dụng!"] },
          { name: "phone", errors: ["Số điện thoại này đã được sử dụng!"] },
        ]);
      } else if (
        detail.includes("Email is already registered") ||
        detail.includes("Email")
      ) {
        form.setFields([
          { name: "email", errors: ["Email này đã được sử dụng!"] },
        ]);
      } else if (
        detail.includes("Phone is already registered") ||
        detail.includes("Phone")
      ) {
        form.setFields([
          { name: "phone", errors: ["Số điện thoại này đã được sử dụng!"] },
        ]);
      } else {
        message.error(
          detail || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",
        );
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        {/* Left Column - Magenta Background & Info Cards */}
        <div className={styles.leftCol}>
          <div className={styles.leftContent}>
            <div className={styles.phoneIconWrapper}>
              <MobileOutlined className={styles.phoneIcon} />
            </div>
            <h2 className={styles.leftTitle}>Chào mừng đến với PinkPhone</h2>
            <p className={styles.leftSubtitle}>
              Khám phá những mẫu smartphone mới nhất với ưu đãi độc quyền dành
              riêng cho thành viên.
            </p>

            <div className={styles.infoBadges}>
              <div className={styles.badgeCard}>
                <CarOutlined className={styles.badgeIcon} />
                <div>
                  <h4 className={styles.badgeTitle}>Giao hàng miễn phí</h4>
                  <p className={styles.badgeDesc}>Cho đơn hàng từ 5 triệu</p>
                </div>
              </div>
              <div className={styles.badgeCard}>
                <SafetyCertificateOutlined className={styles.badgeIcon} />
                <div>
                  <h4 className={styles.badgeTitle}>Bảo hành 12 tháng</h4>
                  <p className={styles.badgeDesc}>Chính hãng 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Register Form */}
        <div className={styles.rightCol}>
          <div className={styles.formWrapper}>
            <Link to="/" className={styles.logo}>
              Pink<span>Phone</span>
            </Link>
            <h2 className={styles.formTitle}>Tạo tài khoản</h2>
            <p className={styles.formSubtitle}>
              Đăng ký tài khoản để quản lý đơn hàng, lưu sản phẩm yêu thích và
              nhận ưu đãi.
            </p>

            <Form
              form={form}
              name="register_form"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className={styles.form}
              validateTrigger={["onChange", "onBlur"]}
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                  { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
                  {
                    max: 150,
                    message: "Họ và tên không được vượt quá 150 ký tự!",
                  },
                ]}
              >
                <Input placeholder="Nguyễn Văn A" className={styles.input} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12} style={{ paddingRight: "8px" }}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: "Số điện thoại không hợp lệ (10-11 số)!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="0901 234 567"
                      className={styles.input}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} style={{ paddingLeft: "8px" }}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập Email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input
                      placeholder="example@gmail.com"
                      className={styles.input}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className={styles.input}
                  autoComplete="new-password"
                />
              </Form.Item>
              <div
                className={styles.passwordStrength}
                style={{
                  marginBottom: "16px",
                  marginTop: "-12px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span>
                    Độ bảo mật:{" "}
                    <strong style={{ color: strength.color }}>
                      {strength.text}
                    </strong>
                  </span>
                </div>
                <div
                  style={{
                    height: "4px",
                    background: "#f0f0f0",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${strength.progress}%`,
                      height: "100%",
                      background: strength.color,
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              </div>

              <Form.Item
                label="Xác nhận mật khẩu"
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
                        new Error("Mật khẩu xác nhận không khớp!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className={styles.input}
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Bạn phải đồng ý với điều khoản!"),
                          ),
                  },
                ]}
              >
                <Checkbox className={styles.checkbox}>
                  Tôi đồng ý với{" "}
                  <span className={styles.pinkText}>Điều khoản sử dụng</span> và{" "}
                  <span className={styles.pinkText}>Chính sách bảo mật</span>
                </Checkbox>
              </Form.Item>

              <Form.Item name="newsletter" valuePropName="checked">
                <Checkbox className={styles.checkbox}>
                  Tôi muốn nhận thông tin ưu đãi
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className={styles.submitBtn}
                >
                  Tạo tài khoản
                </Button>
              </Form.Item>

              <div className={styles.footerLink}>
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
