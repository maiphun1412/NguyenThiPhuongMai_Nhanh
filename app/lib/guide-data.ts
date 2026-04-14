export type SummaryCard = {
  icon: string;
  title: string;
  desc: string;
  border: string;
  iconBg: string;
  iconColor: string;
};

export type GuideItem = {
  id: string;
  title: string;
  youtubeId: string;
  type: "root" | "sale_child";
  summaryCards: SummaryCard[];
};

const defaultCardStyle = {
  border1: "border-[#255eab]",
  bg1: "bg-[#d6e3ff]",
  color1: "text-[#255eab]",
  border2: "border-[#006492]",
  bg2: "bg-[#cae6ff]",
  color2: "text-[#006492]",
  border3: "border-[#8d4200]",
  bg3: "bg-[#ffdbc8]",
  color3: "text-[#8d4200]",
};

function createSummaryCards(
  summary: string,
  steps: string,
  notes: string
): SummaryCard[] {
  return [
    {
      icon: "article",
      title: "Tóm tắt nhanh",
      desc: summary,
      border: defaultCardStyle.border1,
      iconBg: defaultCardStyle.bg1,
      iconColor: defaultCardStyle.color1,
    },
    {
      icon: "list_alt",
      title: "Các bước thực hiện",
      desc: steps,
      border: defaultCardStyle.border2,
      iconBg: defaultCardStyle.bg2,
      iconColor: defaultCardStyle.color2,
    },
    {
      icon: "info",
      title: "Lưu ý",
      desc: notes,
      border: defaultCardStyle.border3,
      iconBg: defaultCardStyle.bg3,
      iconColor: defaultCardStyle.color3,
    },
  ];
}

export const guideItems: GuideItem[] = [
  {
    id: "demo-dieu-hanh",
    title: "DEMO - QUY TRÌNH ĐIỀU HÀNH",
    youtubeId: "360HJpaj5e0",
    type: "root",
    summaryCards: createSummaryCards(
      "Video tổng quan quy trình điều hành trong hệ thống Nhanh Travel, giúp người dùng nắm được luồng xử lý chính trước khi đi vào từng phần chi tiết.",
      "Xem tổng quan quy trình điều hành, nhận biết các bước chính, theo dõi luồng xử lý và liên kết giữa các nghiệp vụ trong hệ thống.",
      "Nên xem video này trước để hiểu bức tranh tổng thể, sau đó mới học từng video chi tiết bên dưới."
    ),
  },
  {
    id: "demo-sale",
    title: "DEMO - QUY TRÌNH SALE",
    youtubeId: "360HJpaj5e0",
    type: "root",
    summaryCards: createSummaryCards(
      "Video tổng quan quy trình sale trong phần mềm, từ tiếp nhận nhu cầu đến báo giá, xử lý đơn và theo dõi khách hàng.",
      "Nắm quy trình sale tổng quát, hiểu luồng tạo dữ liệu khách, làm báo giá, cập nhật trạng thái và phối hợp các bước tiếp theo.",
      "Nên xem video này trước khi học các mục từ 01 trở đi để hiểu mối liên kết giữa từng thao tác."
    ),
  },

  {
    id: "sale-01",
    title: "01 Đăng nhập & Trang chủ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn đăng nhập hệ thống và làm quen với giao diện trang chủ.",
      "Mở màn hình đăng nhập, nhập tài khoản, vào trang chủ và nhận biết các khu vực chức năng chính.",
      "Cần đăng nhập đúng tài khoản được cấp và kiểm tra quyền truy cập nếu giao diện khác với video."
    ),
  },
  {
    id: "sale-02",
    title: "02 Nhà cung cấp Nhà hàng + Vé tham quan - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn quản lý nhà cung cấp nhà hàng và vé tham quan trong hệ thống.",
      "Tạo mới dữ liệu nhà cung cấp, nhập thông tin dịch vụ, kiểm tra dữ liệu lưu và cập nhật khi cần.",
      "Nên nhập đầy đủ thông tin liên hệ, dịch vụ và điều kiện áp dụng để tránh thiếu dữ liệu về sau."
    ),
  },
  {
    id: "sale-03",
    title: "03 Nhà cung cấp Xe - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tạo và quản lý nhà cung cấp xe trong phần mềm.",
      "Khai báo thông tin nhà xe, loại xe, dịch vụ áp dụng và lưu dữ liệu vào hệ thống.",
      "Nên chuẩn hóa tên nhà cung cấp và thông tin phương tiện để dễ tra cứu khi báo giá và điều hành."
    ),
  },
  {
    id: "sale-04",
    title: "04 Nhà cung cấp Khách sạn - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn nhập và quản lý nhà cung cấp khách sạn.",
      "Tạo nhà cung cấp, nhập thông tin khách sạn, cấu hình dịch vụ và kiểm tra dữ liệu hiển thị.",
      "Cần kiểm tra kỹ tên khách sạn, địa chỉ, loại phòng và điều kiện dịch vụ trước khi lưu."
    ),
  },
  {
    id: "sale-04-1",
    title: "04.1 Nhà cung cấp Vé máy bay - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn quản lý nhà cung cấp vé máy bay trong hệ thống.",
      "Nhập thông tin nhà cung cấp, cấu hình loại dịch vụ vé máy bay và kiểm tra dữ liệu sau khi lưu.",
      "Nên đặt tên nhà cung cấp rõ ràng và kiểm tra đúng nhóm dịch vụ để tránh nhập sai danh mục."
    ),
  },
  {
    id: "sale-04-2",
    title: "04.2 Nhà cung cấp - Vé tham quan CÁCH NHẬP MỚI - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Video hướng dẫn cách nhập mới đối với nhà cung cấp vé tham quan.",
      "Mở form nhập mới, điền thông tin dịch vụ, kiểm tra các trường bắt buộc và lưu dữ liệu.",
      "Cần phân biệt cách nhập mới với cách nhập cũ để tránh thao tác nhầm trên hệ thống."
    ),
  },
  {
    id: "sale-04-3",
    title: "04.3 Nhà cung cấp Visa - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tạo và quản lý nhà cung cấp visa trong phần mềm.",
      "Khai báo nhà cung cấp visa, nhập thông tin dịch vụ và lưu để sử dụng trong các quy trình tiếp theo.",
      "Nên nhập rõ loại visa và phạm vi áp dụng để hỗ trợ báo giá và vận hành thuận tiện hơn."
    ),
  },
  {
    id: "sale-05",
    title: "05 Tạo Sản phẩm dịch vụ TOUR - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tạo sản phẩm dịch vụ tour trong hệ thống.",
      "Tạo sản phẩm tour, nhập thông tin cơ bản, cấu hình dịch vụ và lưu để phục vụ báo giá hoặc mở bán.",
      "Nên kiểm tra kỹ tên tour, giá trị dịch vụ và cấu hình cơ bản trước khi đưa vào sử dụng."
    ),
  },
  {
    id: "sale-05-1",
    title: "05.1 Tạo Sản phẩm dịch vụ TOUR (DÀNH CHO CHIẾT TÍNH CÓ DỊCH VỤ LANDTOUR)",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tạo sản phẩm dịch vụ tour dành cho trường hợp chiết tính có dịch vụ landtour.",
      "Khai báo sản phẩm, cấu hình landtour, nhập các thành phần dịch vụ và kiểm tra kết quả chiết tính.",
      "Cần hiểu đúng logic landtour trước khi cấu hình để tránh sai giá và sai dữ liệu dịch vụ."
    ),
  },
  {
    id: "sale-06",
    title: "06 Tiến trình kinh doanh - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Video hướng dẫn tiến trình kinh doanh từ tiếp nhận nhu cầu đến xử lý và theo dõi trạng thái khách hàng.",
      "Tiếp nhận nhu cầu, tạo dữ liệu xử lý, theo dõi trạng thái báo giá, kiểm tra tiến trình và cập nhật kết quả làm việc.",
      "Nên cập nhật trạng thái thường xuyên để tránh sót khách hoặc sai luồng xử lý kinh doanh."
    ),
  },
  {
    id: "sale-07",
    title: "07 Báo giá tour theo yêu cầu - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tạo báo giá tour theo yêu cầu cho khách hàng.",
      "Nhập thông tin khách, chọn dịch vụ phù hợp, cấu hình dữ liệu báo giá và kiểm tra trước khi gửi.",
      "Cần rà soát đầy đủ dịch vụ, số lượng và giá trước khi chốt báo giá để tránh sai sót."
    ),
  },
  {
    id: "sale-08",
    title: "08 Tạo báo giá theo dịch vụ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tạo báo giá theo từng dịch vụ trong phần mềm.",
      "Chọn dịch vụ cần báo giá, nhập thông tin liên quan, kiểm tra giá trị và lưu báo giá.",
      "Nên xác nhận đúng loại dịch vụ trước khi tạo báo giá để dữ liệu không bị lệch nhóm."
    ),
  },
  {
    id: "sale-09",
    title: "09 Điều hành tour riêng hoặc dịch vụ ghép lẻ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn điều hành tour riêng hoặc các dịch vụ ghép lẻ trong hệ thống.",
      "Mở hồ sơ điều hành, kiểm tra dịch vụ, theo dõi trạng thái thực hiện và cập nhật kết quả xử lý.",
      "Cần theo dõi sát tiến độ từng dịch vụ để tránh thiếu bước trong quá trình điều hành."
    ),
  },
  {
    id: "sale-10",
    title: "10 Tour mở bán tổng quan - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Video tổng quan về tour mở bán trong phần mềm.",
      "Xem danh sách tour mở bán, nhận biết các trạng thái chính và hiểu cách quản lý dữ liệu liên quan.",
      "Nên nắm rõ luồng mở bán trước khi thao tác với các nghiệp vụ phát sinh liên quan đến tour."
    ),
  },
  {
    id: "sale-11",
    title: "11 Điều hành tour ghép - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn điều hành tour ghép trong hệ thống.",
      "Theo dõi danh sách khách, kiểm tra dịch vụ, cập nhật trạng thái điều hành và xử lý tình huống liên quan.",
      "Cần rà soát kỹ danh sách khách ghép và thông tin dịch vụ để tránh nhầm lẫn khi vận hành."
    ),
  },
  {
    id: "sale-12",
    title: "12 Công việc chung, bộ máy giao việc - Phần mềm du lịch Nhanh Travel",
    youtubeId: "360HJpaj5e0",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn quản lý công việc chung và bộ máy giao việc trong hệ thống.",
      "Tạo công việc, giao việc, theo dõi tiến độ và kiểm tra kết quả xử lý của từng cá nhân hoặc bộ phận.",
      "Nên cập nhật rõ nội dung công việc và hạn xử lý để tránh sót việc."
    ),
  },
  {
    id: "sale-13",
    title: "13 Thư nội bộ, chat nội bộ - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn sử dụng thư nội bộ và chat nội bộ trong hệ thống.",
      "Truy cập khu vực trao đổi nội bộ, gửi nội dung, theo dõi phản hồi và quản lý thông tin trao đổi.",
      "Nên sử dụng đúng kênh nội bộ để lưu vết thông tin công việc rõ ràng."
    ),
  },
  {
    id: "sale-14",
    title: "14 Báo cáo thống kê tổng hợp tối ưu mọi quy trình - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn xem báo cáo thống kê tổng hợp trong phần mềm.",
      "Mở khu vực báo cáo, chọn tiêu chí lọc, xem số liệu tổng hợp và theo dõi hiệu quả quy trình.",
      "Cần chọn đúng mốc thời gian và phạm vi dữ liệu để báo cáo phản ánh chính xác."
    ),
  },
  {
    id: "sale-15",
    title: "15 Phân quyền nhóm và cá nhân - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn phân quyền nhóm và cá nhân trong hệ thống.",
      "Tạo nhóm quyền, gán quyền cho người dùng và kiểm tra khả năng truy cập sau khi cấu hình.",
      "Cần kiểm tra kỹ phạm vi quyền để tránh cấp thiếu hoặc cấp dư."
    ),
  },
  {
    id: "sale-16",
    title: "16 Quản lý lịch trình tour riêng, tour ghép - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn quản lý lịch trình tour riêng và tour ghép.",
      "Tạo lịch trình, cập nhật các chặng, kiểm tra thông tin tour và theo dõi dữ liệu lịch trình.",
      "Nên chuẩn hóa nội dung lịch trình để dễ dùng trong sale, điều hành và chăm sóc khách."
    ),
  },
  {
    id: "sale-17",
    title: "17 Hành chính nhân sự, Chấm công, lương thưởng - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn xử lý nghiệp vụ hành chính nhân sự, chấm công và lương thưởng.",
      "Quản lý dữ liệu nhân sự, kiểm tra chấm công, theo dõi lương thưởng và các thông tin liên quan.",
      "Cần kiểm tra đúng dữ liệu nhân sự và mốc thời gian để tránh sai lệch kết quả tổng hợp."
    ),
  },
  {
    id: "sale-18",
    title: "18 Kế toán tổng - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn tổng quan nghiệp vụ kế toán trong hệ thống.",
      "Theo dõi dữ liệu kế toán, kiểm tra thông tin phát sinh và làm việc với các khu vực liên quan.",
      "Nên đối chiếu dữ liệu trước khi chốt số liệu để tránh sai lệch báo cáo."
    ),
  },
  {
    id: "sale-19",
    title: "19 PHẦN KPI - Phần mềm du lịch Nhanh Travel",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn theo dõi KPI trong hệ thống.",
      "Mở khu vực KPI, xem chỉ số, kiểm tra kết quả theo từng cá nhân hoặc bộ phận và theo dõi hiệu suất.",
      "Cần thống nhất tiêu chí KPI trước khi đánh giá để số liệu phản ánh đúng thực tế."
    ),
  },
  {
    id: "sale-20",
    title: "20 Quy trình ký quỹ nhà cung cấp",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn quy trình ký quỹ nhà cung cấp trong hệ thống.",
      "Theo dõi thông tin ký quỹ, cập nhật dữ liệu phát sinh và kiểm tra tình trạng xử lý.",
      "Cần lưu đủ thông tin chứng từ và trạng thái để dễ kiểm soát về sau."
    ),
  },
  {
    id: "sale-21",
    title: "21 Thao tác báo giá + đơn hàng (GIAO DIỆN MỚI)",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn thao tác báo giá và đơn hàng trên giao diện mới.",
      "Tạo báo giá, theo dõi đơn hàng, kiểm tra thông tin đã nhập và xử lý trên giao diện mới.",
      "Cần làm quen bố cục giao diện mới để thao tác nhanh và tránh nhầm vị trí chức năng."
    ),
  },
  {
    id: "sale-22",
    title: "22 Quy trình nhập kho + tạo đơn mới dịch vụ SỰ KIỆN",
    youtubeId: "dQw4w9WgXcQ",
    type: "sale_child",
    summaryCards: createSummaryCards(
      "Hướng dẫn quy trình nhập kho và tạo đơn mới cho dịch vụ sự kiện.",
      "Theo dõi dữ liệu nhập kho, tạo đơn mới và kiểm tra thông tin dịch vụ liên quan.",
      "Cần nhập đúng chủng loại và thông tin dịch vụ để tránh sai lệch dữ liệu kho và đơn."
    ),
  },
];