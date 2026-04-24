export type FaqItem = {
  keywords: string[];
  question: string;
  answer: string;
};

export const faqData: FaqItem[] = [
  {
    keywords: ["dùng thử", "đăng ký dùng thử", "trial", "15 ngày"],
    question: "Làm sao để đăng ký dùng thử 15 ngày?",
    answer:
      "Bạn có thể để lại thông tin ngay trên website, đội ngũ Nhanh Travel sẽ liên hệ và hỗ trợ kích hoạt dùng thử 15 ngày."
  },
  {
    keywords: ["nhanh travel là gì", "giới thiệu", "phần mềm gì"],
    question: "Nhanh Travel là gì?",
    answer:
      "Nhanh Travel là giải pháp hỗ trợ doanh nghiệp du lịch quản lý tour, khách hàng, đơn hàng và vận hành trên một nền tảng tập trung."
  },
  {
    keywords: ["tour ghép", "tour đoàn", "quản lý tour ghép", "quản lý đoàn"],
    question: "Quản lý tour ghép/đoàn thế nào?",
    answer:
      "Hệ thống hỗ trợ quản lý cả tour riêng và tour ghép, bao gồm lịch khởi hành, số lượng khách, xe, tài xế, hướng dẫn viên, dịch vụ đi kèm và điều phối tập trung."
  },
  {
    keywords: ["app", "ứng dụng", "khách hàng có app"],
    question: "Có App cho khách hàng không?",
    answer:
      "Nhanh Travel có thể hỗ trợ trải nghiệm thuận tiện cho khách hàng tùy theo gói giải pháp và nhu cầu triển khai thực tế."
  },
  {
    keywords: ["bảng giá", "giá", "chi phí"],
    question: "Bảng giá chi tiết?",
    answer:
      "Hiện tại để nhận thông tin báo giá phù hợp, bạn vui lòng để lại thông tin để đội ngũ Nhanh Travel tư vấn theo nhu cầu doanh nghiệp."
  }
  
];