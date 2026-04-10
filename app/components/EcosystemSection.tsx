"use client";

import { useState } from "react";
import Image from "next/image";

const ecosystemTabs = [
  {
    key: "management",
    label: "HỆ THỐNG QUẢN LÝ",
    image: "/trangchu/he-sinh-thai.png",
    imageAlt: "Hệ thống quản lý Nhanh Travel",
    items: [
      "Quản lý khách hàng, báo giá, đơn hàng, lịch sử thanh toán",
      "Quản lý Nhà cung cấp theo từng loại dịch vụ",
      "Quản lý công nợ nhà cung cấp",
      "Bảng giá sản phẩm – dịch vụ: tour, khách sạn, nhà hàng, xe, hướng dẫn viên, landtour,...",
      "Điều hành tour riêng, tour ghép",
      "Lịch khởi hành tour, lịch trình xe, tài xế, hướng dẫn viên",
      "Quản lý Nhân sự, chấm công, lương thưởng",
      "Thiết lập và quản lý KPI theo doanh số, lợi nhuận,...",
      "Quản lý Hợp đồng khách hàng, nhà cung cấp",
      "Quản lý chi tiết thu chi nội bộ, công nợ, thuế đầu vào, thuế đầu ra",
      "Thống kê doanh thu bán hàng theo từng thời điểm, dịch vụ, nhân sự",
    ],
  },
  {
    key: "admin",
    label: "ỨNG DỤNG ADMIN",
    image: "/trangchu/ung-dung-admin.png",
    imageAlt: "Ứng dụng admin Nhanh Travel",
    items: [
      "Chủ doanh nghiệp và các cấp quản lý thuận tiện trong việc điều phối nhân sự",
      "Theo dõi được tiến độ làm việc của nhân viên",
      "Dễ dàng nắm được tình hình hoạt động công ty ở bất cứ đâu",
      "Quản lý tổng thể về nhân sự, chấm công, lương thưởng",
      "Dữ liệu khách hàng, đơn hàng được cập nhật hàng ngày",
      "Nhận thông báo ngay khi có đề xuất của nhân viên cấp dưới gửi đến",
      "Báo cáo thống kê số liệu được cập nhật liên tục với giao diện trực quan",
    ],
  },
  {
    key: "staff",
    label: "ỨNG DỤNG NHÂN VIÊN",
    image: "/trangchu/ung-dung-nhan-vien.png",
    imageAlt: "Ứng dụng nhân viên Nhanh Travel",
    items: [
      "Tính năng Check in – Check out trên thiết bị di động",
      "Nhân viên được cập nhật lương thưởng, hoa hồng của mình liên tục",
      "Quản lý thông tin khách hàng, đơn hàng, bảng giá sản phẩm – dịch vụ",
      "Điều hành tour riêng/tour ghép, nhanh chóng liên hệ với các Nhà cung cấp khi cần thiết ở bất cứ nơi đâu",
      "Giúp nhân viên có thể hỗ trợ khách hàng nhanh chóng qua điện thoại",
      "Gửi đề xuất cho cấp trên khi cần thiết",
      "Thống kê doanh thu bán hàng, KPI theo từng thời điểm, dịch vụ, nhân sự",
    ],
  },
  {
    key: "customer",
    label: "ỨNG DỤNG KHÁCH HÀNG",
    image: "/trangchu/ung-dung-khach-hang.png",
    imageAlt: "Ứng dụng khách hàng Nhanh Travel",
    items: [
      "Ứng dụng được thiết kế theo thương hiệu riêng từ màu sắc, logo, thông tin,... xây dựng thương hiệu riêng theo yêu cầu của từng công ty du lịch",
      "Kết nối trực tiếp với khách du lịch của mình mà không phụ thuộc vào đơn vị khác",
      "Khách hàng đặt dịch vụ trực tiếp trên app và nhận được đơn hàng, lịch trình ngay lập tức",
      "Thông báo lịch trình đến từng khách hàng trước ngày khởi hành tour",
      "Tiếp nhận các đánh giá của khách hàng từ dịch vụ, tài xế, hướng dẫn viên,... từ đó nâng cao chất lượng dịch vụ kịp thời",
      "Khách hàng nhận thông báo về chương trình ưu đãi, tích điểm, quà tặng một cách nhanh chóng",
      "Chăm sóc khách hàng tiết kiệm chi phí, thậm chí có thể đưa về marketing 0 đồng, không mất chi phí",
      "Hành trình trải nghiệm khách hàng tối ưu, khâu quản lý và chăm sóc tiết kiệm thời gian",
    ],
  },
  {
    key: "crm",
    label: "HỆ THỐNG CRM",
    image: "/trangchu/he-thong-crm.png",
    imageAlt: "Hệ thống CRM Nhanh Travel",
    items: [
      "Quản lý Khách hàng: thông tin liên hệ, ngày sinh nhật, lịch sử giao dịch, cấp bậc, tích điểm,...",
      "Cập nhật thông tin khách hàng từ các trang mạng xã hội, website, bài viết liên kết",
      "Phân tích dữ liệu khách hàng theo nhu cầu để tư vấn",
      "Phân loại khách hàng mua hàng và khách hàng tiềm năng để dễ dàng chăm sóc",
      "Kết nối Zalo OA, Zalo ZNS",
      "Kết nối call center, lưu trữ và thông báo cuộc gọi",
      "Nhắc hẹn chăm sóc tặng quà khách hàng khi đến ngày sinh nhật hoặc kỷ niệm thành lập",
      "Tương tác chat box với khách hàng trực tuyến",
      "Lên chương trình khuyến mãi, bài viết đăng lên các trang mạng xã hội",
    ],
  },
];

export default function EcosystemSection() {
  const [activeTab, setActiveTab] = useState("management");

  const activeData =
    ecosystemTabs.find((tab) => tab.key === activeTab) || ecosystemTabs[0];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="text-center">
          <h2 className="mb-8 text-center text-[30px] font-extrabold leading-[1.15] tracking-[-0.5px] text-[#1457c7] md:text-[42px] lg:text-[52px]">
            Hệ Sinh Thái Nhanh Travel
          </h2>

          <p className="mt-4 text-[18px] text-[#6b7280] md:text-[20px]">
            Phần mềm du lịch được tin dùng bởi các công ty du lịch nội địa,
            inbound, outbound
          </p>

          <div className="mx-auto mt-6 h-[4px] w-[180px] rounded-full bg-[#f45b96]" />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:gap-6">
          {ecosystemTabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl px-6 py-4 text-[15px] font-extrabold transition md:text-[18px] ${
                  isActive
                    ? "bg-[#f45b96] text-white shadow-md"
                    : "text-[#1457c7] hover:text-[#f45b96]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex justify-center">
            <Image
              src={activeData.image}
              alt={activeData.imageAlt}
              width={620}
              height={520}
              className="h-auto w-full max-w-[620px] object-contain"
            />
          </div>

          <div>
            <ul className="space-y-4 text-[18px] leading-8 text-[#4b5563] md:text-[20px]">
              {activeData.items.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="mt-[10px] h-3 w-3 shrink-0 rounded-full bg-[#f45b96]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}