import Image from "next/image";

const leftItems = [
  {
    key: "special",
    icon: "/trangchu/icon-special.png",
    title: "Tính năng chuyên biệt, đầy đủ",
    desc: "Chuẩn hóa quy trình vận hành cho công ty du lịch lữ hành, tăng hiệu suất làm việc lên đến 200%",
  },
  {
    key: "innovation",
    icon: "/trangchu/why-icon-2.png",
    title: "Không ngừng đổi mới",
    desc: "Liên tục nâng cấp và phát triển những tính năng mới cho khách hàng",
  },
  {
    key: "ecosystem",
    icon: "/trangchu/why-icon-4.png",
    title: "Nền tảng, hệ sinh thái đa dạng",
    desc: "Bao gồm: Hệ thống quản trị phiên bản Web, App Admin dành cho nhà quản trị, App Nhân viên, App Khách hàng",
  },
];

const rightItems = [
  {
    key: "cloud",
    icon: "/trangchu/icon-cloud.png",
    title: "Lưu trữ đám mây",
    desc: "Nền tảng công nghệ Cloud giúp chủ doanh nghiệp, cấp quản lý và nhân sự có thể nắm bắt được tình hình công việc dù ở bất cứ đâu",
  },
  {
    key: "ui",
    icon: "/trangchu/icon-ui.png",
    title: "Giao diện dễ sử dụng",
    desc: "Thân thiện với người dùng, được thiết kế linh hoạt phù hợp với các phòng ban trong công ty",
  },
  {
    key: "sync",
    icon: "/trangchu/icon-sync.png",
    title: "Đồng bộ hóa tất cả thiết bị",
    desc: "Tự động đồng bộ trên mọi thiết bị: laptop, máy tính bảng, điện thoại di động giúp người dùng dễ dàng truy cập online mọi lúc mọi nơi",
  },
];

function AdvantageItem({
  item,
}: {
  item: {
    key: string;
    icon: string;
    title: string;
    desc: string;
  };
}) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex h-[78px] w-[78px] shrink-0 items-start justify-center pt-[2px]">
        <Image
          src={item.icon}
          alt={item.title}
          width={60}
          height={60}
          style={{ width: "60px", height: "auto" }}
          className={`object-contain ${
            item.key === "sync"
              ? "scale-[1.08]"
              : item.key === "cloud"
              ? "scale-[1.03]"
              : ""
          }`}
        />
      </div>

      <div className="max-w-[360px]">
        <h3 className="text-[18px] font-bold leading-[1.35] text-[#1f5fd1] md:text-[20px]">
          {item.title}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.7] text-[#353f52] md:text-[16px]">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export default function AdvantagesSection() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        <div className="text-center">
          <h2 className="text-[28px] font-extrabold leading-tight text-[#1f5fd1] md:text-[40px]">
            Ưu điểm của Nhanh Travel
          </h2>

          <div className="mx-auto mt-4 h-[3px] w-[330px] max-w-full rounded-full bg-[#f45b96]" />

          <a
            href="https://demo.nhanhtravel.com/RegisterDemo/register_demo_form"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#2f5edb] px-12 py-4 text-[16px] font-bold text-white shadow-[0_12px_28px_rgba(47,94,219,0.22)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#264fc2]"
          >
            🎁 Đăng ký nhận quà ngay
          </a>
        </div>

        <div className="mt-14 hidden items-center gap-10 lg:grid lg:grid-cols-[1fr_360px_1fr] xl:gap-14">
          <div className="space-y-10">
            {leftItems.map((item) => (
              <AdvantageItem key={item.key} item={item} />
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/trangchu/mobile.png"
              alt="App Nhanh Travel"
              width={320}
              height={700}
              priority
              style={{ width: "320px", height: "auto" }}
              className="object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.16)]"
            />
          </div>

          <div className="space-y-10">
            {rightItems.map((item) => (
              <AdvantageItem key={item.key} item={item} />
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:hidden">
          <div className="flex justify-center">
            <Image
              src="/trangchu/mobile.png"
              alt="App Nhanh Travel"
              width={280}
              height={620}
              priority
              style={{ width: "280px", height: "auto" }}
              className="object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.14)]"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[...leftItems, ...rightItems].map((item) => (
              <AdvantageItem key={item.key} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}