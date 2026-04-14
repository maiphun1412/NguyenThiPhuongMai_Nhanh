import AdvantagesSection from "./components/AdvantagesSection";
import Image from "next/image";
import { Search } from "lucide-react";
import EcosystemSection from "./components/EcosystemSection";


export default function HomePage() {
  return (
   <main className="min-h-screen bg-white text-[#1f2937]">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#FFFFFF] bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] items-center px-10 py-4">
          {/* LOGO */}
          <div className="flex items-center">
            <img
              src="/trangchu/logo.png"
              alt="Nhanh Travel"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-8">
            {/* MENU */}
            <nav className="hidden items-center gap-8 text-[15px] font-medium text-[#6b7280] md:flex">
  <a
    href="#"
    className="flex items-center gap-2 rounded-md px-2 py-1 text-[#1677ff] transition-all duration-200 hover:scale-105 hover:bg-[#f0f6ff]"
  >
    <span className="h-2 w-2 rounded-full bg-[#1677ff]"></span>
    TRANG CHỦ
  </a>

  {["TÍNH NĂNG", "SẢN PHẨM", "GIẢI PHÁP", "BẢNG GIÁ", "BLOG", "VỀ CHÚNG TÔI"].map(
    (item) => (
      <a
        key={item}
        href="#"
        className="group relative rounded-md px-2 py-1 transition-all duration-200 hover:scale-105 hover:bg-[#f0f6ff] hover:text-[#1677ff]"
      >
        {item}

        {/* underline animation */}
        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1677ff] transition-all duration-300 group-hover:w-full"></span>
      </a>
    )
  )}
</nav>

            {/* ICON */}
            <div className="flex items-center gap-4">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1d5db] text-[#6b7280] hover:bg-[#f3f4f6]">
                <Search size={18} strokeWidth={2} />
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0066FF] text-white">
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0f43b9] via-[#1552d6] to-[#2563ff] text-white">
        <div className="mx-auto grid min-h-[560px] w-full max-w-[1600px] grid-cols-1 items-center gap-8 px-10 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-16 lg:px-24 xl:px-28">
          {/* Left */}
          <div className="z-10 max-w-[860px]">
            <p className="mb-5 text-[22px] font-semibold text-white/95 lg:text-[26px]">
              Nền tảng quản trị du lịch toàn diện
            </p>

            <h1 className="mb-6 whitespace-nowrap text-[38px] font-extrabold uppercase leading-[0.95] tracking-[-1px] md:text-[56px] lg:text-[64px] xl:text-[70px]">
              CHỈ VỚI MỘT CHẠM
            </h1>

            <p className="mb-8 max-w-[720px] text-[18px] leading-[1.45] text-white/95 lg:text-[20px]">
              Phần mềm du lịch chuyên sâu mới nhất 2025 dành cho doanh nghiệp
              du lịch Inbound, Outbound, Nội địa, Khu du lịch, Nhà xe, Khách
              sạn, Hướng dẫn viên, Vé tham quan và các sản phẩm du lịch.
            </p>

            <ul className="mb-10 space-y-4 text-[17px] text-white lg:text-[18px]">
              <li className="flex items-start gap-3">
                <span className="mt-[2px] text-[16px]">☛</span>
                <span>
                  Tối ưu toàn bộ quy trình doanh nghiệp du lịch trên một nền
                  tảng.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[2px] text-[16px]">☛</span>
                <span>
                  Support 24/7, Bảo hành toàn thời gian, Miễn phí dùng thử 15
                  ngày
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-[2px] text-[16px]">☛</span>
                <span>Miễn phí set up hệ thống, miễn phí đào tạo 100%</span>
              </li>
            </ul>

            <div className="mt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
  href="https://demo.nhanhtravel.com/RegisterDemo/register_demo_form"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="min-w-[150px] rounded-full bg-[#f45b96] px-10 py-[10px] text-center text-[19px] font-extrabold uppercase tracking-[-0.2px] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#66FF66] hover:text-[#0b2a7a] hover:shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
    ĐĂNG KÝ NGAY
  </button>
</a>

              <button className="min-w-[150px] rounded-full bg-[#6f8fff] px-10 py-[10px] text-center text-[19px] font-extrabold uppercase tracking-[-0.2px] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#66FF66] hover:text-[#0b2a7a] hover:shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
                LIÊN HỆ TƯ VẤN
              </button>
            </div>
          </div>

          {/* Right */}
<div className="relative flex items-center justify-center md:justify-end">
  <div className="group overflow-hidden rounded-[20px]">
    <Image
      src="/nhanhtravel-home.png"
      alt="Nhanh Travel dashboard"
      width={980}
      height={760}
      priority
      className="h-auto w-full max-w-[780px] object-contain 
      group-hover:animate-[pulseZoom_1.2s_ease-in-out_infinite] 
      xl:max-w-[860px]"
    />
  </div>
</div>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 180"
            className="h-[90px] w-full fill-white/65"
            preserveAspectRatio="none"
          ></svg>
        </div>
      </section>

      {/* Features */}
<section className="relative bg-white">
  <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 lg:px-16">
    <div className="grid grid-cols-1 items-stretch gap-10 text-center md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          img: "/trangchu/feature-1.png",
          title: "Giao diện dễ sử dụng",
          desc: 'Giao diện thân thiện, đẹp mắt. Các tính năng được thiết kế linh hoạt dành cho những khách hàng "khó tính" nhất',
        },
        {
          img: "/trangchu/feature-2.png",
          title: "Nền tảng công nghệ Cloud",
          desc: "Truy cập bằng công nghệ Cloud nhanh chóng và miễn phí dung lượng. Cam kết bảo mật dữ liệu tuyệt đối an toàn",
        },
        {
          img: "/trangchu/feature-3.png",
          title: "Đồng bộ hóa tất cả thiết bị",
          desc: "Tự động đồng bộ hệ thống trên mọi thiết bị Laptop, Tablet, Mobile giúp khách hàng dễ dàng truy cập Online mọi lúc, mọi nơi",
        },
        {
          img: "/trangchu/feature-4.png",
          title: "Không ngừng đổi mới",
          desc: "Liên tục cập nhật và hoàn thiện các tính năng mới dựa trên nhu cầu của khách hàng",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="group flex h-full cursor-pointer flex-col items-center"
        >
          <div className="flex h-full w-full flex-col rounded-2xl p-4 transition-all duration-300 group-hover:bg-[#B0E2FF]/35">
            <div className="relative mb-5 h-[180px] w-full overflow-hidden">
              <Image
  src={item.img}
  alt={item.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
  className="object-contain transition-transform duration-300 group-hover:scale-105"
/>
            </div>

            <h3 className="mb-3 text-[18px] font-semibold text-[#1677ff] md:text-[20px]"> 
              {item.title} 
              </h3>

            <p className="flex-1 max-w-[320px] text-[14px] leading-6 text-[#6b7280] md:text-[15px]"> 
              {item.desc} 
              </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Giải pháp chuyển đổi số */}
<section className="relative bg-white  py-4">
  <div className="mx-auto max-w-[1450px] px-6 pb-10 md:px-10 lg:px-16">
    <h2 className="mx-auto mb-8 max-w-[1100px] text-center text-[27px] font-extrabold leading-tight text-[#1457c7] md:text-[40px] lg:text-[50px]">
  Nhanh Travel - Giải pháp chuyển đổi số hàng đầu cho doanh nghiệp du lịch
</h2>

    {/* Ảnh bên trái desktop */}
    <div className="group absolute left-[3%] top-1/2 z-10 hidden -translate-y-1/2 lg:block xl:left-[4%]">
      <Image
  src="/trangchu/Giaiphaphangdau.png"
  alt="Giải pháp Nhanh Travel"
  width={620}
  height={760}
  style={{ width: "32vw", height: "auto" }}
  className="min-w-[320px] max-w-[560px] object-contain opacity-90 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-2"
/>
    </div>

    {/* Card desktop */}
    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:pl-[38%] xl:pl-[40%]">
      {[
        {
          icon: "/trangchu/icon1.png",
          title: "Hệ thống quản lý Web",
          desc: "Phiên bản Web hoàn hảo, đầy đủ tính năng, hệ thống vận hành liên phòng ban giúp doanh nghiệp chuyển đổi số toàn diện",
        },
        {
          icon: "/trangchu/icon2.png",
          title: "App Admin",
          desc: "Dành cho CEO – Nhà quản lý nắm toàn bộ hệ thống vận hành của doanh nghiệp chỉ vài cú chạm",
        },
        {
          icon: "/trangchu/icon3.png",
          title: "App Nhân viên",
          desc: "Dành cho nhân sự, quản lý chi tiết công việc, đơn hàng, lương, thưởng, chấm công, nghỉ phép, lộ trình thăng tiến, nhiệm vụ, quy định và các yêu cầu đề xuất",
        },
        {
          icon: "/trangchu/icon4.png",
          title: "App Khách hàng",
          desc: "Dành riêng cho khách hàng của mỗi doanh nghiệp du lịch. Tích hợp đầy đủ tính năng: booking, lịch trình, ví điện tử, tích điểm, nhắn tin và thông báo",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="min-h-[360px] rounded-[28px] border border-[#d9e7ff] bg-white p-8 shadow-[0_8px_30px_rgba(20,87,199,0.08)] transition-all duration-300 hover:border-[#1677ff] hover:shadow-[0_12px_40px_rgba(22,119,255,0.25)]"
        >
          <div className="mb-6 flex justify-center">
            <Image
  src={item.icon}
  alt={item.title}
  width={75}
  height={75}
  className="object-contain"
/>
          </div>

          <h3 className="mb-5 text-center text-[22px] font-bold text-[#1457c7] xl:text-[24px]">
            {item.title}
          </h3>

          <p className="text-center text-[15px] leading-8 text-[#6b7280] xl:text-[16px] xl:leading-9">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

    {/* Mobile + tablet */}
    <div className="lg:hidden">
      <div className="mb-10 flex justify-center">
        <Image
  src="/trangchu/Giaiphaphangdau.png"
  alt="Giải pháp Nhanh Travel"
  width={560}
  height={700}
  style={{ width: "100%", height: "auto" }}
  className="max-w-[560px] object-contain"
/>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            icon: "/trangchu/icon1.png",
            title: "Hệ thống quản lý Web",
            desc: "Phiên bản Web hoàn hảo, đầy đủ tính năng, hệ thống vận hành liên phòng ban giúp doanh nghiệp chuyển đổi số toàn diện",
          },
          {
            icon: "/trangchu/icon2.png",
            title: "App Admin",
            desc: "Dành cho CEO – Nhà quản lý nắm toàn bộ hệ thống vận hành của doanh nghiệp chỉ vài cú chạm",
          },
          {
            icon: "/trangchu/icon3.png",
            title: "App Nhân viên",
            desc: "Dành cho nhân sự, quản lý chi tiết công việc, đơn hàng, lương, thưởng, chấm công, nghỉ phép, lộ trình thăng tiến, nhiệm vụ, quy định và các yêu cầu đề xuất",
          },
          {
            icon: "/trangchu/icon4.png",
            title: "App Khách hàng",
            desc: "Dành riêng cho khách hàng của mỗi doanh nghiệp du lịch. Tích hợp đầy đủ tính năng: booking, lịch trình, ví điện tử, tích điểm, nhắn tin và thông báo",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="rounded-[28px] border border-[#d9e7ff] bg-white p-8 shadow-[0_8px_30px_rgba(20,87,199,0.08)]"
          >
            <div className="mb-6 flex justify-center">
              <Image
  src={item.icon}
  alt={item.title}
  width={70}
  height={70}
  className="object-contain"
/>
            </div>

            <h3 className="mb-5 text-center text-[22px] font-bold text-[#1457c7]">
              {item.title}
            </h3>

            <p className="text-center text-[15px] leading-8 text-[#6b7280]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

{/* Why choose */}
<section className="relative bg-white">
  <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-16">
    {/* Title + Button */}
    <div className="text-center">
      <h2 className="text-[27px] font-extrabold leading-[1.12] tracking-[-0.6px] text-[#1457c7] md:text-[46px] lg:text-[64px]">
        Lý do bạn nên chọn
        <br />
        phần mềm du lịch Nhanh Travel
      </h2>

      <a
  href="https://demo.nhanhtravel.com/RegisterDemo/register_demo_form"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-8 inline-flex items-center justify-center rounded-full bg-[#f45b96] px-10 py-4 text-[16px] font-extrabold text-white shadow-[0_12px_28px_rgba(244,91,150,0.28)] transition hover:scale-[1.02]"
>
  Đăng Ký Dùng Thử
</a>
    </div>

    {/* Content */}
    <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_520px_1fr] xl:grid-cols-[1fr_560px_1fr]">
      {/* LEFT */}
      <div className="space-y-12 lg:pr-2">
        {[
          {
            icon: "/trangchu/why-icon-1.png",
            title: "Tính năng chuyên biệt",
            desc: "Chuẩn hóa quy trình vận hành cho công ty du lịch lữ hành, tăng hiệu suất làm việc lên đến 200%",
          },
          {
            icon: "/trangchu/why-icon-2.png",
            title: "Cập nhật tính năng mới",
            desc: "Liên tục nâng cấp và phát triển những tính năng mới",
          },
          {
            icon: "/trangchu/why-icon-3.png",
            title: "Chi phí hợp lý",
            desc: "Chỉ với 40,000đ/ngày, bạn đã có ngay hệ thống vận hành để chuyển đổi số",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-start lg:justify-end lg:text-right"
          >
            <div className="order-2 max-w-[320px] lg:order-1">
              <h3 className="mb-2 text-[20px] font-extrabold text-[#1457c7]">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-[#7b8494]">
                {item.desc}
              </p>
            </div>

            <div className="order-1 shrink-0 lg:order-2">
              <Image
  src={item.icon}
  alt={item.title}
  width={56}
  height={56}
  className="object-contain"
/>
            </div>
          </div>
        ))}
      </div>

      {/* CENTER */}
<div className="flex justify-center">
  <Image
  src="/trangchu/why-center.png"
  alt="Lý do chọn Nhanh Travel"
  width={560}
  height={700}
  className="w-full max-w-[560px] object-contain transition-transform duration-300 ease-out hover:-translate-y-4"
  style={{ height: "auto" }}
/>
</div>

      {/* RIGHT */}
      <div className="space-y-12 lg:pl-2">
        {[
          {
            icon: "/trangchu/why-icon-4.png",
            title: "Hệ sinh thái đa dạng",
            desc: "Cung cấp nền tảng đa dạng: Hệ thống quản trị, App Quản trị, App Nhân viên",
          },
          {
            icon: "/trangchu/why-icon-5.png",
            title: "Triển khai nhanh",
            desc: "Có thể đưa hệ thống vào vận hành ngay",
          },
          {
            icon: "/trangchu/why-icon-6.png",
            title: "Hỗ trợ tức thì",
            desc: "Đội ngũ CSKH 24/7 luôn sẵn sàng hỗ trợ",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 text-center lg:flex-row lg:text-left"
          >
            <div className="shrink-0">
              <Image
  src={item.icon}
  alt={item.title}
  width={56}
  height={56}
  className="object-contain"
/>
            </div>

            <div className="max-w-[330px]">
              <h3 className="mb-2 text-[20px] font-extrabold text-[#1457c7]">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[1.7] text-[#7b8494]">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <EcosystemSection />
        <AdvantagesSection />
      {/* Big app showcase */}
      <section className="bg-[#1143a7] pt-5">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
          <div className="flex justify-center">
            <Image
              src="/trangchu/footer.png"
              alt="Ứng dụng Nhanh Travel"
              width={1500}
              height={760}
              className="h-auto w-full max-w-[1500px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1143a7] text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* COL 1 */}
            <div>
              <img
                src="/trangchu/logo1.png"
                alt="Nhanh Travel"
                className="mb-6 h-14 w-auto"
              />

              <ul className="space-y-4 text-[15px] leading-7 text-white/90">
                <li className="font-semibold">
                  Công ty CP Đầu tư phát triển Vigo
                </li>
                <li>
                  Địa chỉ: 2A Nguyễn Sỹ Sách, Phường 15, Quận Tân Bình, Thành
                  phố Hồ Chí Minh, Việt Nam
                </li>
                <li>Hotline: (+84) 90 999 1205</li>
                <li>
                  Lĩnh vực kinh doanh: giải pháp phần mềm chuyển đổi số cho công
                  ty du lịch và sân golf
                </li>
              </ul>
            </div>

            {/* COL 2 */}
            <div>
              <h3 className="mb-6 text-[16px] font-bold uppercase tracking-wide">
                Công ty
              </h3>

              <ul className="space-y-3 text-[15px] text-white/90">
                <li>Về chúng tôi</li>
                <li>Tính năng</li>
                <li>Bảng giá</li>
                <li>Khách hàng</li>
                <li>Blog</li>
                <li>Trải nghiệm ngay</li>
              </ul>
            </div>

            {/* COL 3 */}
            <div>
              <h3 className="mb-6 text-[16px] font-bold uppercase tracking-wide">
                Tính năng
              </h3>

              <ul className="space-y-3 text-[15px] text-white/90">
                <li>Quản lý sản phẩm</li>
                <li>Quản lý đơn hàng</li>
                <li>Điều hành tour</li>
                <li>Kế toán</li>
                <li>Hệ thống CRM</li>
                <li>Hệ thống quản lý công việc</li>
              </ul>
            </div>

            {/* COL 4 */}
            <div>
              <h3 className="mb-4 text-[16px] font-bold uppercase tracking-wide">
                Tải ứng dụng tại đây
              </h3>

              <div className="mb-8 flex gap-4">
                <Image
                  src="/trangchu/app-store.png"
                  alt="App Store"
                  width={140}
                  height={45}
                />
                <Image
                  src="/trangchu/google-play.png"
                  alt="Google Play"
                  width={150}
                  height={45}
                />
              </div>

              <h3 className="mb-4 text-[16px] font-bold uppercase tracking-wide">
                Kết nối với chúng tôi
              </h3>

              <div className="mb-6 flex items-center gap-4">
                {[
                  "/trangchu/iconfb.png",
                  "/trangchu/iconytb.png",
                  "/trangchu/icontiktok.png",
                  "/trangchu/icon_twitter.png",
                  "/trangchu/icon_mess.png",
                  "/trangchu/iconzalo.png",
                  "/trangchu/icon_in.png",
                ].map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="transition hover:scale-110"
                  />
                ))}
              </div>

              <p className="text-[15px] leading-7 text-white/90">
                Hệ thống quản trị chuyên biệt cho Công ty Du lịch lữ hành, chuẩn
                hóa toàn diện quy trình vận hành doanh nghiệp, góp phần xây dựng
                chuyển đổi số cho cộng đồng du lịch Việt Nam phát triển thịnh
                vượng.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}