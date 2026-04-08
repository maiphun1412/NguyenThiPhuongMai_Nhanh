import ChatWidget from "./components/ChatWidget";
import Image from "next/image";
import { Search } from "lucide-react";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#1f2937]">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#e5e7eb] bg-white">
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

        <a href="#" className="flex items-center gap-2 text-[#1677ff]">
          <span className="h-2 w-2 rounded-full bg-[#1677ff]"></span>
          TRANG CHỦ
        </a>

        <a href="#" className="hover:text-[#1677ff]">TÍNH NĂNG</a>
        <a href="#" className="hover:text-[#1677ff]">SẢN PHẨM</a>
        <a href="#" className="hover:text-[#1677ff]">GIẢI PHÁP</a>
        <a href="#" className="hover:text-[#1677ff]">BẢNG GIÁ</a>
        <a href="#" className="hover:text-[#1677ff]">BLOG</a>
        <a href="#" className="hover:text-[#1677ff]">VỀ CHÚNG TÔI</a>

      </nav>

      {/* ICON */}
      <div className="flex items-center gap-4">

        {/* SEARCH ICON (chuẩn giống hình) */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1d5db] text-[#6b7280] hover:bg-[#f3f4f6]">
  <Search size={18} strokeWidth={2} />
</button>

        {/* MENU BUTTON */}
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

<h1 className="mb-6 whitespace-nowrap text-[38px] font-extrabold uppercase leading-[0.95] tracking-[-1px] md:text-[56px] lg:text-[64px] xl:text-[70px]">  CHỈ VỚI MỘT CHẠM
</h1>

      <p className="mb-8 max-w-[720px] text-[18px] leading-[1.45] text-white/95 lg:text-[20px]">
        Phần mềm du lịch chuyên sâu mới nhất 2025 dành cho doanh nghiệp
        du lịch Inbound, Outbound, Nội địa, Khu du lịch, Nhà xe, Khách sạn,
        Hướng dẫn viên, Vé tham quan và các sản phẩm du lịch.
      </p>

      <ul className="mb-10 space-y-4 text-[17px] text-white lg:text-[18px]">
        <li className="flex items-start gap-3">
          <span className="mt-[2px] text-[16px]">☛</span>
          <span>Tối ưu toàn bộ quy trình doanh nghiệp du lịch trên một nền tảng.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-[2px] text-[16px]">☛</span>
          <span>Support 24/7, Bảo hành toàn thời gian, Miễn phí dùng thử 15 ngày</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-[2px] text-[16px]">☛</span>
          <span>Miễn phí set up hệ thống, miễn phí đào tạo 100%</span>
        </li>
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-6 pl-24 lg:pl-36">
  <button className="min-w-[150px] rounded-full bg-[#f45b96] px-10 py-[10px] text-center text-[19px] font-extrabold uppercase tracking-[-0.2px] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#66FF66] hover:text-[#0b2a7a] hover:shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
    ĐĂNG KÝ NGAY
  </button>

  <button className="min-w-[150px] rounded-full bg-[#6f8fff] px-10 py-[10px] text-center text-[19px] font-extrabold uppercase tracking-[-0.2px] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#66FF66] hover:text-[#0b2a7a] hover:shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
    LIÊN HỆ TƯ VẤN
  </button>
</div>
    </div>

    {/* Right */}
    <div className="relative flex items-center justify-center md:justify-end">
      <Image
        src="/nhanhtravel-home.png"
        alt="Nhanh Travel dashboard"
        width={980}
        height={760}
        priority
        className="h-auto w-full max-w-[780px] object-contain xl:max-w-[860px]"
      />
    </div>
  </div>

  {/* Wave bottom */}
  <div className="absolute bottom-0 left-0 w-full">
    <svg
      viewBox="0 0 1440 180"
      className="h-[90px] w-full fill-white/65"
      preserveAspectRatio="none"
    >
    </svg>
  </div>
</section>

            {/* Features */}
<section className="relative bg-[#f7f8fc]">
  <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 lg:px-16">
    <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 lg:grid-cols-4">
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
        <div key={index} className="flex flex-col items-center">
          <div className="relative mb-5 h-[180px] w-full">
  <Image
    src={item.img}
    alt={item.title}
    fill
    className="object-contain"
  />
</div>

          <h3 className="mb-3 text-[18px] font-semibold text-[#1677ff] md:text-[20px]">
            {item.title}
          </h3>

          <p className="max-w-[320px] text-[14px] leading-6 text-[#6b7280] md:text-[15px]">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="relative bg-[#f7f8fc] py-4">
  <div className="mx-auto max-w-[1450px] px-6 pb-10 md:px-10 lg:px-16">
    <h2 className="mb-8 text-center text-[30px] font-extrabold leading-tight text-[#1457c7] md:text-[40px] lg:text-[50px]">
      Nhanh Travel - Giải pháp chuyển đổi số
      <br />
      hàng đầu cho doanh nghiệp du lịch
    </h2>

    <div className="pointer-events-none absolute left-[2%] top-1/2 z-10 hidden -translate-y-1/2 lg:block">
  <Image
    src="/trangchu/Giaiphaphangdau.png"
    alt="Giải pháp Nhanh Travel"
    width={700}
    height={820}
    className="h-auto w-[40vw] max-w-[640px] object-contain opacity-90"
  />
</div>

    {/* Card desktop */}
    <div className="hidden lg:grid lg:ml-[42%] lg:grid-cols-2 lg:gap-6">
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
          className="min-h-[360px] rounded-[28px] border border-[#d9e7ff] bg-white p-8 shadow-[0_8px_30px_rgba(20,87,199,0.08)]"
        >
          <div className="mb-6 flex justify-center">
            <Image
              src={item.icon}
              alt={item.title}
              width={70}
              height={70}
              className="h-[75px] w-[75px] object-contain"
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
          className="h-auto w-full max-w-[560px] object-contain"
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
                className="h-[70px] w-[70px] object-contain"
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
      <section className="bg-[#f7f8fc] pb-10">
        <div className="mx-auto max-w-[1300px] px-6 text-center md:px-10">
          <h2 className="mb-10 text-[30px] font-extrabold leading-tight text-[#1457c7] md:text-[40px] lg:text-[50px]">
            Lý do bạn nên chọn
            <br />
            phần mềm du lịch Nhanh Travel
          </h2>

          <button className="rounded-full bg-[#f45b96] px-12 py-4 text-[18px] font-bold text-white shadow-lg transition hover:scale-[1.02]">
            Đăng Ký Dùng Thử
          </button>
        </div>
      </section>

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
            Địa chỉ: 2A Nguyễn Sỹ Sách, Phường 15, Quận Tân Bình,
            Thành phố Hồ Chí Minh, Việt Nam
          </li>
          <li>Hotline: (+84) 90 999 1205</li>
          <li>
            Lĩnh vực kinh doanh: giải pháp phần mềm chuyển đổi số
            cho công ty du lịch và sân golf
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

        {/* ICON — KHÔNG nền tròn */}
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
              className="hover:scale-110 transition"
            />
          ))}
        </div>

        <p className="text-[15px] leading-7 text-white/90">
          Hệ thống quản trị chuyên biệt cho Công ty Du lịch lữ hành,
          chuẩn hóa toàn diện quy trình vận hành doanh nghiệp, góp phần
          xây dựng chuyển đổi số cho cộng đồng du lịch Việt Nam phát triển
          thịnh vượng.
        </p>
      </div>

    </div>
  </div>
</footer>
      <ChatWidget />
    </main>
  );
}