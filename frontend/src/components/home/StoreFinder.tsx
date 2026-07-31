import React, { useState } from "react";
import { Select, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import styles from "./StoreFinder.module.css";

const StoreFinder = () => {
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);

  const provinces = [
    { value: "hn", label: "Hà Nội" },
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "dn", label: "Đà Nẵng" },
  ];

  const districts = {
    hn: [
      { value: "hbt", label: "Hai Bà Trưng" },
      { value: "cg", label: "Cầu Giấy" },
      { value: "tx", label: "Thanh Xuân" },
    ],
    hcm: [
      { value: "q1", label: "Quận 1" },
      { value: "q3", label: "Quận 3" },
      { value: "tb", label: "Tân Bình" },
    ],
    dn: [
      { value: "hc", label: "Hải Châu" },
      { value: "tk", label: "Thanh Khê" },
    ],
  };

  const handleProvinceChange = (val: string) => {
    setProvince(val as any);
    setDistrict(null);
  };

  return (
    <section className={styles.finderSection}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>Hệ thống cửa hàng</h2>
          <p className={styles.subtitle}>
            Tìm ngay cửa hàng PinkPhone gần bạn nhất để được tư vấn và trải
            nghiệm trực tiếp sản phẩm.
          </p>
        </div>
        <div className={styles.formBlock}>
          <div className={styles.selectorGroup}>
            <div className={styles.selectWrapper}>
              <span className={styles.selectLabel}>Tỉnh/Thành phố</span>
              <Select
                placeholder="Chọn Tỉnh/Thành"
                className={styles.select}
                onChange={handleProvinceChange}
                value={province}
                options={provinces}
              />
            </div>
            <div className={styles.selectWrapper}>
              <span className={styles.selectLabel}>Quận/Huyện</span>
              <Select
                placeholder="Chọn Quận/Huyện"
                className={styles.select}
                onChange={setDistrict}
                value={district}
                disabled={!province}
                options={province ? districts[province] : []}
              />
            </div>
          </div>
          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            className={styles.findBtn}
            onClick={() =>
              console.log("Finding stores for:", province, district)
            }
          >
            Tìm cửa hàng
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StoreFinder;
