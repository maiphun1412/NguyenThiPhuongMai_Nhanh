"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


type GuideItem = {
  id: string;
  title: string;
  youtubeId: string;
  type: "root" | "sale_child";
};

const guideItems: GuideItem[] = [
  {
    id: "demo-dieu-hanh",
    title: "DEMO - QUY TRÌNH ĐIỀU HÀNH",
    youtubeId: "360HJpaj5e0",
    type: "root",
  },
  {
    id: "demo-sale",
    title: "DEMO - QUY TRÌNH SALE",
    youtubeId: "4ahdmZz_PXQ",
    type: "root",
  },

  {
    id: "sale-01",
    title: "01 Đăng nhập & Trang chủ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "zoPQZ0Usce0",
    type: "sale_child",
  },
  {
    id: "sale-02",
    title: "02 Nhà cung cấp Nhà hàng + Vé tham quan - Phần mềm du lịch Nhanh Travel",
    youtubeId: "Hc1YZNr3hJ4",
    type: "sale_child",
  },
  {
    id: "sale-03",
    title: "03 Nhà cung cấp Xe - Phần mềm du lịch Nhanh Travel",
    youtubeId: "fEKR1jnZanw",
    type: "sale_child",
  },
  {
    id: "sale-04",
    title: "04 Nhà cung cấp Khách sạn - Phần mềm du lịch Nhanh Travel",
    youtubeId: "e9yMjoYW88s",
    type: "sale_child",
  },
  {
    id: "sale-04-1",
    title: "04.1 Nhà cung cấp Vé máy bay - Phần mềm du lịch Nhanh Travel",
    youtubeId: "1G2OBBSDbIs",
    type: "sale_child",
  },
  {
    id: "sale-04-2",
    title: "04.2 Nhà cung cấp - Vé tham quan CÁCH NHẬP MỚI - Phần mềm du lịch Nhanh Travel",
    youtubeId: "A03sBIB37oU",
    type: "sale_child",
  },
  {
    id: "sale-04-3",
    title: "04.3 Nhà cung cấp Visa - Phần mềm du lịch Nhanh Travel",
    youtubeId: "mxRN9Vbkw2o",
    type: "sale_child",
  },
  {
    id: "sale-05",
    title: "05.2 Tạo Sản phẩm dịch vụ TOUR - Phần mềm du lịch Nhanh Travel",
    youtubeId: "ey9WTLBG6m0",
    type: "sale_child",
  },
   
  {
    id: "sale-05-1",
    title: "05.3 Tạo Sản phẩm dịch vụ TOUR (DÀNH CHO CHIẾT TÍNH CÓ DỊCH VỤ LANDTOUR)",
    youtubeId: "oaqxOWpAVlo",
    type: "sale_child",
  },
  
  {
    id: "sale-06",
    title: "06 Tiến trình kinh doanh - Phần mềm du lịch Nhanh Travel",
    youtubeId: "H1x5H3owYxM",
    type: "sale_child",
  },
  {
    id: "sale-07",
    title: "07 Báo giá tour theo yêu cầu - Phần mềm du lịch Nhanh Travel",
    youtubeId: "nVZ681h7MW0",
    type: "sale_child",
  },
  {
    id: "sale-08",
    title: "08 Tạo báo giá theo dịch vụ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "-PEzMMzIGh0",
    type: "sale_child",
  },
  {
    id: "sale-09",
    title: "09 Điều hành tour riêng hoặc dịch vụ ghép lẻ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "UNnc9cJ2y_o",
    type: "sale_child",
  },
  {
    id: "sale-10",
    title: "10 Tour mở bán tổng quan - Phần mềm du lịch Nhanh Travel",
    youtubeId: "K8zzGyWZkoY",
    type: "sale_child",
  },
  {
    id: "sale-11",
    title: "11 Điều hành tour ghép - Phần mềm du lịch Nhanh Travel",
    youtubeId: "A_kc763Ey1I",
    type: "sale_child",
  },
  {
    id: "sale-12",
    title: "12 Công việc chung, bộ máy giao việc - Phần mềm du lịch Nhanh Travel",
    youtubeId: "5w4Qk_pmYuU",
    type: "sale_child",
  },
  {
    id: "sale-13",
    title: "13 Thư nội bộ, chat nội bộ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "xrWFEiO5ngA",
    type: "sale_child",
  },
  {
    id: "sale-14",
    title: "14 Báo cáo thống kê tổng hợp tối ưu mọi quy trình - Phần mềm du lịch Nhanh Travel",
    youtubeId: "oc04lvdlOSU",
    type: "sale_child",
  },
  {
    id: "sale-15",
    title: "15 Phân quyền nhóm và cá nhân - Phần mềm du lịch Nhanh Travel",
    youtubeId: "ns_OyfiFD9U",
    type: "sale_child",
  },
  {
    id: "sale-16",
    title: "16 Quản lý lịch trình tour riêng, tour ghép - Phần mềm du lịch Nhanh Travel",
    youtubeId: "UBmQ8Dzu7os",
    type: "sale_child",
  },
  {
    id: "sale-17",
    title: "17 Hành chính nhân sự, Chấm công, lương thưởng - Phần mềm du lịch Nhanh Travel",
    youtubeId: "TbbJn5NdVz4",
    type: "sale_child",
  },
  {
    id: "sale-18",
    title: "18 Kế toán tổng - Phần mềm du lịch Nhanh Travel",
    youtubeId: "EmX2zHd2GWg",
    type: "sale_child",
  },
  {
    id: "sale-19",
    title: "19 PHẦN KPI - Phần mềm du lịch Nhanh Travel",
    youtubeId: "Q2LX5FWJ5oU",
    type: "sale_child",
  },
  {
    id: "sale-20",
    title: "20 Quy trình ký quỹ nhà cung cấp",
    youtubeId: "CCXQ4xgHs8w",
    type: "sale_child",
  },
  {
    id: "sale-21",
    title: "21 Thao tác báo giá + đơn hàng (GIAO DIỆN MỚI)",
    youtubeId: "XKF5CfNMmBw",
    type: "sale_child",
  },
  {
    id: "sale-22",
    title: "22 Quy trình nhập kho + tạo đơn mới dịch vụ SỰ KIỆN",
    youtubeId: "reUiDcx_a6g",
    type: "sale_child",
  },
];

const featureCards = [
  {
    icon: "speed",
    title: "Khởi động nhanh",
    desc: "Làm quen với giao diện và các tính năng cốt lõi chỉ trong 5 phút đầu tiên.",
    border: "border-[#255eab]",
    iconBg: "bg-[#d6e3ff]",
    iconColor: "text-[#255eab]",
  },
  {
    icon: "groups",
    title: "Quản lý đối tác",
    desc: "Hướng dẫn chi tiết cách kết nối và quản lý danh sách nhà cung cấp dịch vụ.",
    border: "border-[#006492]",
    iconBg: "bg-[#cae6ff]",
    iconColor: "text-[#006492]",
  },
  {
    icon: "history_edu",
    title: "Hợp đồng điện tử",
    desc: "Quy trình ký kết và lưu trữ tài liệu pháp lý trực tuyến an toàn tuyệt đối.",
    border: "border-[#8d4200]",
    iconBg: "bg-[#ffdbc8]",
    iconColor: "text-[#8d4200]",
  },
];

function sortByNumber(title: string) {
  const match = title.match(/^(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 999;
}

export default function HuongDanSuDungPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState("demo-dieu-hanh");
  const [showSaleChildren, setShowSaleChildren] = useState(true);
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");
  const [aiSummary, setAiSummary] = useState("");
const [aiSteps, setAiSteps] = useState<string[]>([]);
const [aiNotes, setAiNotes] = useState<string[]>([]);
const [aiLoading, setAiLoading] = useState(false);

  const activeItem = useMemo(
    () => guideItems.find((item) => item.id === activeId) ?? guideItems[0],
    [activeId]
  );
  useEffect(() => {
  let ignore = false;

  async function loadAiSummary() {
    try {
      setAiLoading(true);
      setAiSummary("");
      setAiSteps([]);
      setAiNotes([]);

      const res = await fetch("/api/guide-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guideId: activeId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Không thể tải tóm tắt AI");
      }

      if (!ignore) {
        setAiSummary(data.summary || "");
        setAiSteps(Array.isArray(data.steps) ? data.steps : []);
        setAiNotes(Array.isArray(data.notes) ? data.notes : []);
      }
    } catch (error) {
      if (!ignore) {
        setAiSummary("Chưa lấy được tóm tắt AI cho video này.");
        setAiSteps([]);
        setAiNotes([]);
      }
    } finally {
      if (!ignore) {
        setAiLoading(false);
      }
    }
  }

  loadAiSummary();

  return () => {
    ignore = true;
  };
}, [activeId]);

  const rootItems = guideItems.filter((item) => item.type === "root");
  const saleChildren = guideItems
    .filter((item) => item.type === "sale_child")
    .sort((a, b) => sortByNumber(a.title) - sortByNumber(b.title));

  return (
    <main className="min-h-screen bg-white text-[#191c21]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />

      <style jsx global>{`
        body {
          font-family: "Plus Jakarta Sans", sans-serif;
          background: #ffffff;
        }
        .font-headline {
          font-family: "Manrope", sans-serif;
        }
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }
        .material-filled {
          font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
        }
        .glass-panel {
          background: rgba(249, 249, 255, 0.74);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>

      <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[#FFFFFF] bg-white px-6 md:px-10">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/trangchu/logo.png"
              alt="Nhanh Travel"
              width={170}
              height={48}
              className="h-12 w-auto cursor-pointer object-contain"
              priority
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#1677ff] transition hover:opacity-80"
        >
          <span className="material-symbols-outlined text-[22px]">
            arrow_back
          </span>
          <span className="text-[14px] font-medium">Quay lại</span>
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="fixed left-0 top-20 hidden h-[calc(100vh-80px)] w-[360px] rounded-r-2xl bg-[#f6f8fc] py-6 shadow-[0_20px_40px_rgba(25,28,33,0.06)] md:flex md:flex-col">
          <nav className="flex flex-col overflow-y-auto px-4">
            <div className="mb-3 px-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
              Danh sách video
            </div>

            <div className="space-y-1">
              {rootItems.map((item) => {
                const isActive = item.id === activeId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveId(item.id);
                      if (item.id === "demo-sale") {
                        setShowSaleChildren(true);
                      }
                    }}
                    className={`mx-2 my-[2px] flex w-[calc(100%-16px)] items-start gap-2 rounded-lg px-3 py-2 text-left transition-all ${
                      isActive
                        ? "bg-[#1677ff] text-white shadow-sm"
                        : "text-[#44474e] hover:bg-[#eaf3ff]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined mt-[2px] text-[18px] ${
                        isActive ? "material-filled" : ""
                      }`}
                    >
                      play_circle
                    </span>
                    <span className="text-[13px] font-semibold leading-5">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-1">
              {showSaleChildren && (
                <div className="mt-2 space-y-1">
                  {saleChildren.map((item) => {
                    const isActive = item.id === activeId;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        className={`mx-2 my-[2px] flex w-[calc(100%-16px)] items-start gap-2 rounded-lg px-3 py-2 text-left transition-all ${
                          isActive
                            ? "bg-[#1677ff] text-white shadow-sm"
                            : "text-[#44474e] hover:bg-[#eaf3ff]"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined mt-[2px] text-[18px] ${
                            isActive ? "material-filled" : ""
                          }`}
                        >
                          play_circle
                        </span>
                        <span className="text-[13px] font-medium leading-5">
                          {item.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:ml-[360px] md:p-12">
          <div className="mx-auto mb-12 max-w-5xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-4">
                <span className="inline-block rounded-full bg-[#cae6ff] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#004b6f]">
                  Trung tâm hỗ trợ
                </span>

                <h3 className="font-headline whitespace-nowrap text-xl font-extrabold leading-tight tracking-tighter text-[#1457c7] sm:text-2xl md:text-3xl">
                  Hướng Dẫn Sử Dụng
                </h3>
              </div>

              <div className="flex w-fit rounded-xl bg-[#edf2f8] p-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm transition-all ${
                    activeTab === "video"
                      ? "bg-white font-semibold text-[#1457c7] shadow-sm"
                      : "font-medium text-[#6b7280] hover:text-[#1457c7]"
                  }`}
                >
                  <span className="material-symbols-outlined material-filled text-lg">
                    play_circle
                  </span>
                  Video
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("image")}
                  className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm transition-all ${
                    activeTab === "image"
                      ? "bg-white font-semibold text-[#1457c7] shadow-sm"
                      : "font-medium text-[#6b7280] hover:text-[#1457c7]"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    image
                  </span>
                  Hình Ảnh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="mt-6">
                {activeTab === "video" ? (
                  <div className="flex justify-center">
                    <div className="w-full max-w-[850px] rounded-2xl bg-[#f1f5f9] p-4 shadow">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${activeItem.youtubeId}`}
                          title={activeItem.title}
                          className="absolute inset-0 h-full w-full"
                          allowFullScreen
                        />
                      </div>

                      <div className="mt-3 px-1">
                        <h3 className="rounded-md border border-[#dbeafe] bg-white px-3 py-2 text-[15px] font-semibold text-[#1e3a8a]">
                          {activeItem.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-full max-w-[720px] rounded-2xl bg-[#f1f5f9] p-6 shadow">
                      <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-[#cbd5e1] bg-white text-[#64748b]">
                        Chưa có hình ảnh cho mục này
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
  <div className="rounded-2xl border-l-4 border-[#255eab] bg-[#f6f8fc] p-6">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d6e3ff]">
      <span className="material-symbols-outlined text-[#255eab]">
        article
      </span>
    </div>

    <h4 className="text-lg font-bold text-[#191c21]">
      Tóm tắt nhanh
    </h4>

    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#424751]">
      {aiLoading ? "AI đang tóm tắt video..." : aiSummary || "Chưa có dữ liệu"}
    </p>
  </div>

  <div className="rounded-2xl border-l-4 border-[#006492] bg-[#f6f8fc] p-6">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#cae6ff]">
      <span className="material-symbols-outlined text-[#006492]">
        list_alt
      </span>
    </div>

    <h4 className="text-lg font-bold text-[#191c21]">
      Các bước thực hiện
    </h4>

    <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#424751]">
      {aiLoading ? (
        <p>AI đang phân tích các bước...</p>
      ) : aiSteps.length > 0 ? (
        aiSteps.map((step, index) => (
          <p key={index}>{step}</p>
        ))
      ) : (
        <p>Chưa có dữ liệu</p>
      )}
    </div>
  </div>

  <div className="rounded-2xl border-l-4 border-[#8d4200] bg-[#f6f8fc] p-6">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffdbc8]">
      <span className="material-symbols-outlined text-[#8d4200]">
        info
      </span>
    </div>

    <h4 className="text-lg font-bold text-[#191c21]">
      Lưu ý
    </h4>

    <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#424751]">
      {aiLoading ? (
        <p>AI đang tổng hợp lưu ý...</p>
      ) : aiNotes.length > 0 ? (
        aiNotes.map((note, index) => (
          <p key={index}>• {note}</p>
        ))
      ) : (
        <p>Chưa có dữ liệu</p>
      )}
    </div>
  </div>
</div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}