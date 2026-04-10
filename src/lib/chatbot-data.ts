export type Step = "lead" | "chat";

export type Message = {
  id: number;
  role: "bot" | "user";
  text?: string;
  images?: string[];
};

export type AnswerItem = {
  text: string;
  images?: string[];
};

export type ConversationItem = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export const quickQuestions = [
  "Nhanh Travel là gì?",
  "Phù hợp với loại hình nào?",
  "Xem giao diện thực tế.",
  "Địa chỉ văn phòng ở đâu?",
  "Quản lý tour ghép/đoàn thế nào?",
  "Có App cho khách hàng không?",
  "Bảng giá chi tiết.",
  "Có tính năng kế toán/Hoa hồng không?",
  "Quản lý công nợ nhà cung cấp.",
  "CRM quản lý khách hàng.",
];

export const answerMap: Record<string, AnswerItem> = {
  "Nhanh Travel là gì?": {
    text: "Nhanh Travel là nền tảng quản trị doanh nghiệp du lịch toàn diện, giúp số hóa toàn bộ quy trình vận hành từ bán hàng, chăm sóc khách hàng, điều hành tour đến quản lý tài chính. Hệ thống tích hợp CRM, quản lý báo giá, đơn hàng, điều hành tour, nhà cung cấp, công nợ, KPI nhân sự và báo cáo kinh doanh trên cùng một nền tảng duy nhất.",
  },

  "Phù hợp với loại hình nào?": {
    text: "Phần mềm phù hợp với nhiều mô hình kinh doanh du lịch như: công ty du lịch nội địa, inbound, outbound, khu du lịch, nhà xe, khách sạn, hướng dẫn viên, đại lý vé và các đơn vị cung cấp dịch vụ du lịch. Ngoài ra hệ thống có thể tùy biến theo quy mô từ nhỏ đến lớn.",
  },

  "Xem giao diện thực tế.": {
    text: "Dưới đây là một số giao diện thực tế của hệ thống Nhanh Travel:",
    images: [
      "/chatbox/gd1.png",
      "/chatbox/gd2.png",
      "/chatbox/gd3.png",
      "/chatbox/gd4.png",
    ],
  },

  "Địa chỉ văn phòng ở đâu?": {
    text: "Văn phòng của Nhanh Travel hiện đặt tại 2A Nguyễn Sỹ Sách, Phường Tân Sơn, Thành phố Hồ Chí Minh, thuộc Công ty Cổ phần Đầu tư Phát triển Vigo. Nếu anh/chị cần hỗ trợ nhanh hoặc muốn được tư vấn trực tiếp, có thể liên hệ qua hotline (+84) 90 999 1205. Đội ngũ Nhanh Travel luôn sẵn sàng giải đáp thông tin, demo hệ thống và tư vấn giải pháp phù hợp với nhu cầu của doanh nghiệp. Anh/chị cũng có thể ghé trực tiếp văn phòng để trải nghiệm thực tế và trao đổi chi tiết hơn nhé!",
  },

  "Quản lý tour ghép/đoàn thế nào?": {
    text: "Hệ thống hỗ trợ quản lý cả tour riêng và tour ghép. Doanh nghiệp có thể quản lý lịch khởi hành, số lượng khách, xe, tài xế, hướng dẫn viên, dịch vụ đi kèm và điều phối toàn bộ quá trình vận hành tour một cách tập trung và chính xác.",
  },

  "Có App cho khách hàng không?": {
    text: "Có. Nhanh Travel có thể triển khai App khách hàng mang thương hiệu riêng của doanh nghiệp, giúp khách dễ dàng đặt tour, xem lịch trình, nhận thông báo, tích điểm, thanh toán và theo dõi toàn bộ dịch vụ ngay trên điện thoại. Việc sở hữu ứng dụng riêng không chỉ nâng cao trải nghiệm người dùng mà còn giúp doanh nghiệp xây dựng hình ảnh chuyên nghiệp và kết nối với khách hàng một cách hiệu quả hơn.",
  },

  "Bảng giá chi tiết.": {
    text: "Bảng giá của Nhanh Travel gồm nhiều gói như Starter, Business và Enterprise với mức giá và số lượng user khác nhau. Mỗi gói đều tích hợp đầy đủ các tính năng quản lý khách hàng, đơn hàng, nhà cung cấp và điều hành tour, giúp doanh nghiệp dễ dàng lựa chọn giải pháp phù hợp với nhu cầu.",
    images: ["/chatbox/banggia.png"],
  },

  "Có tính năng kế toán/Hoa hồng không?": {
    text: "Hệ thống hỗ trợ quản lý tài chính bao gồm: thu chi, công nợ, doanh thu, lợi nhuận, KPI và hoa hồng nhân sự. Doanh nghiệp có thể theo dõi hiệu quả kinh doanh theo từng tour, từng nhân viên và từng giai đoạn.",
  },

  "Quản lý công nợ nhà cung cấp.": {
    text: "Hệ thống cho phép quản lý nhà cung cấp theo từng loại dịch vụ như xe, khách sạn, nhà hàng, hướng dẫn viên... Đồng thời theo dõi công nợ chi tiết giúp doanh nghiệp kiểm soát chi phí và dòng tiền hiệu quả.",
  },

  "CRM quản lý khách hàng.": {
    text: "CRM giúp lưu trữ toàn bộ thông tin khách hàng, lịch sử giao dịch, phân loại nhóm khách, chăm sóc sau bán và theo dõi hành vi khách hàng. Ngoài ra có thể tích hợp Zalo, SMS, Email để tự động hóa marketing và chăm sóc khách hàng.",
  },
};

export const defaultBotMessage: Message = {
  id: 1,
  role: "bot",
  text: "Em chào anh chị! Anh chị quan tâm các dịch vụ nào của Nhanhtravel ạ ?",
};