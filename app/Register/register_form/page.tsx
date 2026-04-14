"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type DemoFormData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  companySize: string;
  note: string;
  agreed: boolean;
};

const initialForm: DemoFormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  companySize: "",
  note: "",
  agreed: true,
};

export default function RegisterDemoPage() {
  const [form, setForm] = useState<DemoFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    const cleanedPhone = form.phone.replace(/\D/g, "");
    return (
      form.fullName.trim() !== "" &&
      form.email.trim() !== "" &&
      cleanedPhone.length >= 9 &&
      cleanedPhone.length <= 12 &&
      form.company.trim() !== "" &&
      form.service.trim() !== "" &&
      form.companySize.trim() !== "" &&
      form.agreed
    );
  }, [form]);

const handleSubmit = async () => {
  if (!canSubmit || submitting) return;

  setSubmitting(true);
  setMessage("");

  try {
    const res = await fetch("/api/register-demo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: form.fullName,
        email: form.email,
        telephone: form.phone,
        company: form.company,
        services: form.service ? [form.service] : [],
        website: "",
        address: "",
        company_size: form.companySize,
        note: form.note,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || data?.message || "Gửi đăng ký thất bại");
    }

    setMessage("Đăng ký thành công. Đội ngũ sẽ liên hệ với bạn sớm.");
    setForm(initialForm);
  } catch (error) {
    console.error(error);
    setMessage("Có lỗi xảy ra, vui lòng thử lại.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-[#f3f6fb] px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto grid max-w-[1280px] overflow-hidden rounded-[18px] border border-[#dfe7f2] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.07)] lg:grid-cols-[1fr_0.95fr]">
        <div className="p-5 md:p-6 lg:p-7">
          <h1 className="mb-7 text-center text-[24px] font-extrabold text-[#111827] md:text-[28px]">
            Đăng ký sử dụng Demo
          </h1>

          <div className="space-y-4">
            <Field label="Họ và tên" required>
              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="demo-input"
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="demo-input"
              />
            </Field>

            <Field label="Số điện thoại/Zalo" required>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 12),
                  })
                }
                className="demo-input"
                placeholder="Nhập từ 9 đến 12 số"
              />
            </Field>

            <Field label="Công ty" required>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="demo-input"
              />
            </Field>

            <Field label="Dịch vụ" required hint="Có thể chọn nhiều">
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="demo-input"
              >
                <option value=""></option>
                <option value="tour">Tour</option>
                <option value="san_golf">Sân golf</option>
                <option value="khach-san">Khách sạn</option>
                <option value="nha-xe">Nhà xe</option>
                <option value="nha_hang">Nhà hàng</option>
                <option value="ve_tham_quan">Vé tham quan</option>
                <option value="visa">Visa</option>
                <option value="spa">Spa</option>
                <option value="thuyen_tham_quan">Thuyền tham quan</option>
                <option value="du_thuyen">Du thuyền</option>
                <option value="tau_cano">Tàu - Cano</option>
                <option value="event">Event</option>
                <option value="san_bay">Sân bay</option>
                <option value="dich_vu_khac">Dịch vụ khác</option>
                <option value="sim">Sim</option>
              </select>
            </Field>

            <Field label="Quy mô công ty" required>
              <select
                value={form.companySize}
                onChange={(e) =>
                  setForm({ ...form, companySize: e.target.value })
                }
                className="demo-input"
              >
                <option value=""></option>
                <option value="5-10">5 - 10 NV</option>
                <option value="15-25">15 - 25 NV</option>
                <option value="duoi_50">Dưới 50 NV</option>
                <option value="tren_50">Trên 50 NV</option>
              </select>
            </Field>

            <Field label="Lời nhắc">
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="demo-input"
              />
            </Field>

            <label className="flex items-start gap-2 text-[13px] text-[#4b5563]">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) =>
                  setForm({ ...form, agreed: e.target.checked })
                }
                className="mt-1 h-4 w-4 accent-[#2388ff]"
              />
              <span>Cam kết bảo mật thông tin của khách hàng.</span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`h-[46px] w-full rounded-[12px] text-[16px] font-semibold text-white transition ${
                canSubmit && !submitting
                  ? "bg-[#2388ff] hover:opacity-95"
                  : "cursor-not-allowed bg-[#9ec5ff]"
              }`}
            >
              {submitting ? "Đang gửi..." : "Đăng ký demo"}
            </button>

            {message && (
              <p className="text-center text-[14px] text-[#2563eb]">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="p-3">
          <div className="relative flex h-full min-h-[640px] flex-col overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#3da3fb_0%,#127fe5_100%)] px-5 pb-4 pt-5 text-white md:px-6 md:pb-5 md:pt-6">
            <div className="mx-auto w-full max-w-[620px] px-4 md:px-6">
              <h2 className="text-center text-[20px] font-extrabold leading-[1.45] md:text-[24px]">
                Giải pháp chuyển đổi số toàn diện
                <br />
                cho doanh nghiệp du lịch
                <br />
                CHỈ VỚI MỘT CHẠM
              </h2>

              <p className="mt-4 text-center text-[14px] font-semibold leading-[1.7] md:text-[15px]">
                Hệ thống quản trị hợp nhất toàn bộ hoạt động: quản lý khách
                hàng, đơn hàng, điều hành tour, kinh doanh, CSKH, giao việc,
                marketing, sự kiện, landtour, nhà hàng, khách sạn, hướng dẫn
                viên, du thuyền...
              </p>

              <p className="mt-4 text-center text-[14px] font-extrabold leading-[1.7] md:text-[15px]">
                👉 Tất cả được tự động hoá - đồng bộ - vận hành trên một nền
                tảng duy nhất
              </p>

              <p className="mt-4 text-left text-[14px] font-semibold leading-[1.7] md:text-[15px]">
                Mục tiêu của Nhanh Travel là giúp chủ doanh nghiệp du lịch tinh
                gọn bộ máy, kiểm soát toàn diện để tập trung phát triển kinh
                doanh và nâng cao giá trị doanh nghiệp.
              </p>

              <div className="mt-5 space-y-2.5 text-[15px] font-bold leading-[1.55] md:text-[16px]">
                {[
                  "Tinh gọn bộ máy",
                  "Tự động hoá quy trình",
                  "Ra quyết định nhanh & chính xác hơn",
                  "Báo giá & tạo đơn chỉ trong vài phút",
                  "Kiểm soát doanh nghiệp mọi lúc, mọi nơi",
                  "Tăng doanh thu - giảm chi phí - nâng tầm vận hành",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="mt-[1px] w-[18px] shrink-0 text-center">
                      👉
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 h-px w-full bg-white/25" />

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
                <div className="space-y-4">
                  <ContactItem
                    icon="⌂"
                    title="ĐỊA CHỈ"
                    value="2A Nguyễn Sỹ Sách, Phường Tân Sơn, Tphcm"
                  />
                  <ContactItem
                    icon="✆"
                    title="HOTLINE"
                    value="090 999 1205"
                    valueClassName="text-[18px] font-extrabold"
                  />
                  <ContactItem
                    icon="✉"
                    title="EMAIL"
                    value="nhanhtravel@gmail.com"
                  />
                </div>

                <div className="relative flex min-h-[170px] items-end justify-end">
                  <div className="relative h-[170px] w-full max-w-[200px]">
                    <Image
                      src="/trangchu/hero-devices.png"
                      alt="Nhanh Travel preview"
                      fill
                      className="object-contain object-bottom"
                      sizes="200px"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[15px] font-bold text-[#111827]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint ? (
          <span className="text-[12px] italic text-[#9ca3af]">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ContactItem({
  icon,
  title,
  value,
  valueClassName = "",
}: {
  icon: string;
  title: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-white/16 text-[18px] font-bold text-white">
        {icon}
      </div>

      <div>
        <div className="text-[14px] font-extrabold uppercase leading-none text-white/90">
          {title}
        </div>
        <div
          className={`mt-1 text-[14px] font-semibold text-white ${valueClassName}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}