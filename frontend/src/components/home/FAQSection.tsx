import React from 'react';
import { Collapse } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from './FAQSection.module.css';

const { Panel } = Collapse;

const FAQSection = () => {
  const faqData = [
    {
      key: '1',
      question: 'Chính sách bảo hành tại PinkPhone như thế nào?',
      answer: 'Tất cả sản phẩm điện thoại bán ra tại PinkPhone đều được bảo hành chính hãng 12 tháng tại các trung tâm bảo hành ủy quyền. Ngoài ra, chúng tôi hỗ trợ lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nếu phát sinh lỗi phần cứng từ nhà sản xuất.'
    },
    {
      key: '2',
      question: 'Tôi có thể mua trả góp 0% bằng cách nào?',
      answer: 'PinkPhone hỗ trợ trả góp 0% qua thẻ tín dụng của hơn 20 ngân hàng liên kết, hoặc thông qua các công ty tài chính đối tác (Home Credit, FE Credit) với thủ tục đơn giản, duyệt hồ sơ nhanh chóng chỉ trong 15 phút.'
    },
    {
      key: '3',
      question: 'Cửa hàng có hỗ trợ giao hàng tận nhà không?',
      answer: 'Chúng tôi hỗ trợ giao hàng nhanh miễn phí trên toàn quốc đối với các đơn hàng từ 5 triệu đồng trở lên. Đối với khu vực nội thành, khách hàng sẽ nhận được sản phẩm trong vòng 2 giờ kể từ khi xác nhận đơn hàng thành công.'
    }
  ];

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
      <div className={styles.collapseWrapper}>
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => 
            isActive ? <MinusOutlined className={styles.icon} /> : <PlusOutlined className={styles.icon} />
          }
          expandIconPosition="end"
          className={styles.faqCollapse}
        >
          {faqData.map((faq) => (
            <Panel header={faq.question} key={faq.key} className={styles.faqPanel}>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </section>
  );
};

export default FAQSection;
