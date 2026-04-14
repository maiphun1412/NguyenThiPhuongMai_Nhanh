export type GuideAiItem = {
  id: string;
  title: string;
  type: "root" | "sale_child";
  transcript: string;
};

const ROOT_GUIDES: GuideAiItem[] = [
  {
    id: "demo-dieu-hanh",
    title: "DEMO - QUY TRÌNH ĐIỀU HÀNH",
    type: "root",
    transcript: `
Quy trình điều hành tour bắt đầu sau khi sale chốt đơn và chuyển đơn sang bộ phận điều hành.

Bộ phận điều hành sẽ:
- Cập nhật số lượng khách và phân công nhân viên điều hành
- Xem thông tin tour và chương trình chi tiết

Tiếp theo là nhập danh sách đoàn, có thể:
- Nhập trực tiếp
- Import từ Excel
- Gửi link cho khách tự nhập

Sau đó tiến hành điều hành các dịch vụ trong tour như khách sạn, xe, nhà hàng, vé tham quan.
Có thể chỉnh sửa nhà cung cấp, loại dịch vụ hoặc giá.

Khi hoàn tất, dịch vụ được chuyển sang bước đặt dịch vụ:
- Gửi link hoặc email cho nhà cung cấp xác nhận
- Theo dõi trạng thái: chưa đặt, chờ phản hồi, đã xác nhận

Khi nhà cung cấp xác nhận, dịch vụ chuyển sang bước dự chi:
- Tạo phiếu chi trực tiếp
- Đưa vào công nợ
- Hoặc tạm ứng cho hướng dẫn viên

Hệ thống hỗ trợ tự động tạo phiếu chi, quản lý ghi chú nội bộ và ghi chú cho nhà cung cấp.

Sau khi tour kết thúc:
- Tổng hợp toàn bộ thu chi
- Thực hiện quyết toán tour
- Tính toán lợi nhuận cuối cùng
    `.trim(),
  },
  {
    id: "demo-sale",
    title: "DEMO - QUY TRÌNH SALE",
    type: "root",
    transcript: `
Quy trình bán tour bắt đầu từ bộ phận kinh doanh (sale).

Hệ thống có 2 loại tài khoản:
- Admin: xem báo cáo tổng, doanh thu, công nợ toàn công ty
- Nhân viên: theo dõi doanh thu, KPI, đơn hàng và tiến trình riêng

Trong phần kinh doanh, hệ thống quản lý khách theo từng trạng thái:
- Mới → Liên hệ → Báo giá → Tạo đơn → Điều hành → Thành công / Thất bại

Sale tiếp nhận khách, xem chi tiết thông tin, lịch sử liên hệ và có thể:
- Gửi email, SMS, gọi điện trực tiếp
- Ghi chú, theo dõi hoạt động nội bộ

Khi khách có nhu cầu, sale tạo báo giá:
- Báo giá tour riêng theo yêu cầu
- Báo giá tour mở bán
- Hoặc báo giá từ tour có sẵn trong hệ thống

Khi chọn tour:
- Hệ thống tự lấy thông tin lịch trình, giá, dịch vụ
- Sale chỉ cần chọn ngày khởi hành và số khách
- Có thể chỉnh giá bán, thêm phí phát sinh, giảm giá, thuế

Sau khi hoàn tất báo giá:
- Có thể gửi link cho khách xác nhận
- Khách xem chi tiết tour, giá, chính sách và chọn thanh toán

Khi khách xác nhận:
- Báo giá tự động chuyển thành đơn hàng
- Hệ thống ghi nhận số tiền khách đã thanh toán
- Tự động tạo phiếu thu

Kế toán xác nhận thanh toán:
- Nhập số tiền thực nhận nếu khác
- Hệ thống tự tính số tiền còn lại

Hệ thống hỗ trợ:
- Xuất PDF báo giá hoặc đơn hàng
- Tạo mã QR thanh toán
- Tự động đồng bộ giao dịch ngân hàng nếu tích hợp

Sau khi hoàn tất:
- Sale theo dõi trạng thái đơn hàng
- Chuyển sang bộ phận điều hành tour
    `.trim(),
  },
];

const SALE_GUIDES_PART_1: GuideAiItem[] = [
  {
    id: "sale-01",
    title: "01 Đăng nhập & Trang chủ - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Video hướng dẫn giới thiệu cách đăng nhập và tổng quan giao diện trang chủ của phần mềm Nhanh Travel.

Người dùng đăng nhập bằng email hoặc số điện thoại cùng mật khẩu được cấp.

Sau khi đăng nhập, trang chủ gồm các khu vực chính:
- Thanh menu bên trái: chứa toàn bộ chức năng của hệ thống
- Khu vực giao diện chính bên phải: hiển thị các số liệu, biểu đồ và tính năng thường dùng

Ở phần trên của trang chủ:
- Có thể tùy chỉnh các chức năng thường dùng
- Hiển thị các chỉ số nhanh về công việc, dự án, báo giá, đơn hàng, khách hàng và đề xuất
- Có nút tạo báo giá theo yêu cầu hoặc tạo báo giá dịch vụ lẻ
- Có bộ lọc ngày tháng để xem dữ liệu theo thời gian

Trang chủ cũng hiển thị các nhóm tính năng quan trọng như:
- Khách hàng
- Đại lý
- Bán hàng / Kinh doanh
- Điều hành
- Nhân viên
- Báo cáo

Ngoài ra còn có các khu vực theo dõi:
- Doanh thu và công nợ
- Biểu đồ lợi nhuận, chi phí, chiết khấu
- Lịch khởi hành tour hằng ngày
- Danh sách đơn hàng mới
- Tour bán chạy
- Tình trạng đơn hàng
- Danh sách nhà cung cấp
- Thư nội bộ, hoạt động mới, xác nhận mới

Trang chủ còn hỗ trợ quản lý khách hàng với các thông tin như:
- Danh sách khách hàng
- Dịch vụ khách đã sử dụng
- Đơn hàng đã mua
- Doanh thu từ khách hàng
- Lịch sử tương tác của nhân viên với khách

Hệ thống cũng có các biểu đồ và danh sách hỗ trợ quản trị:
- Doanh thu theo dịch vụ
- Nguồn khách hàng
- Tình trạng chăm sóc khách hàng
- Trạng thái điều hành
- Công việc chung theo phòng ban và cá nhân
- Tiến trình kinh doanh của bộ phận sale

Đây là màn hình tổng quan dành cho giám đốc, admin hoặc quản lý để theo dõi toàn bộ hoạt động vận hành của doanh nghiệp.
    `.trim(),
  },
  {
    id: "sale-02",
    title: "02 Nhà cung cấp Nhà hàng + Vé tham quan - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn cách quản lý nhà cung cấp và nhập bảng giá trong hệ thống.

Tại menu "Nhà cung cấp", người dùng có thể:
- Tìm kiếm, lọc và xem danh sách nhà cung cấp
- Xem thống kê theo loại hình dịch vụ

Để tạo nhà cung cấp mới:
- Nhấn "Thêm mới"
- Nhập thông tin: tên, điện thoại, email, chi nhánh
- Chọn quốc gia, tỉnh thành
- Chọn loại dịch vụ cung cấp (có thể chọn nhiều: xe, nhà hàng, khách sạn, vé...)
- Lưu để tạo nhà cung cấp

Trong chi tiết nhà cung cấp, có thể xem:
- Số tiền đã chi
- Công nợ
- Thuế đầu vào

Để nhập bảng giá dịch vụ:
- Vào mục "Dịch vụ / Bảng giá"
- Chọn loại dịch vụ (ví dụ: nhà hàng, vé tham quan)
- Nhấn "Tạo giá mới"

Nhập các thông tin bảng giá:
- Thời gian áp dụng
- Tên dịch vụ (menu, loại vé...)
- Đơn vị tính (người, suất...)
- Giá công bố
- Giá đại lý
- Hệ thống tự tính chiết khấu

Ngoài ra có thể:
- Nhập quy định free (ví dụ: 10 tặng 1)
- Chọn có hoặc không bao gồm thuế và mức thuế suất
- Thêm ghi chú, hình ảnh, file đính kèm

Hệ thống hỗ trợ:
- Nhân bản bảng giá để tạo nhanh nhiều menu hoặc dịch vụ
- Tự động tính giá gốc và thuế

Có thể áp dụng tương tự khi nhập giá cho:
- Nhà hàng
- Vé tham quan
- Các dịch vụ khác

Sau khi hoàn tất, bảng giá sẽ được lưu và sử dụng cho báo giá và điều hành tour.
    `.trim(),
  },
  {
    id: "sale-03",
    title: "03 Nhà cung cấp Xe - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo nhà cung cấp xe và nhập bảng giá xe theo hành trình.

Sau khi tạo nhà cung cấp xe, vào chi tiết nhà xe → mục "Dịch vụ / Bảng giá" → chọn "Xe".

Hệ thống cho phép cấu hình giá xe cố định theo từng hành trình.

Để tạo bảng giá xe:
- Nhấn "Thêm mới"
- Chọn thời gian áp dụng
- Cấu hình loại xe theo số ghế (7 chỗ, 16 chỗ, 35 chỗ, 45 chỗ...)
- Mỗi loại xe có thể quy định số lượng khách phù hợp

Hệ thống sẽ tự động:
- Gợi ý loại xe phù hợp theo số lượng khách khi đưa vào tour
- Áp dụng đúng giá đã cấu hình

Khi nhập giá xe:
- Chọn loại xe
- Chọn loại hành trình
- Chọn quốc gia, điểm đi, điểm đến
- Có thể nhập số km

Nhập thông tin giá:
- Giá bán
- Giá gốc
- Hệ thống tự tính lợi nhuận

Ngoài ra có thể:
- Chọn giá thường hoặc giá lễ
- Cấu hình bao gồm / không bao gồm
- Chọn thuế và mức thuế suất
- Thêm ghi chú

Hệ thống tự động:
- Tính giá trước thuế và tiền thuế
- Áp dụng giá net khi đưa vào tour

Có thể sử dụng chức năng "Nhân bản" để:
- Tạo nhanh nhiều hành trình
- Đổi loại xe hoặc giá mà không cần nhập lại từ đầu

Sau khi hoàn tất, bảng giá xe sẽ được dùng cho báo giá và điều hành tour.
    `.trim(),
  },
  {
    id: "sale-04",
    title: "04 Nhà cung cấp Khách sạn - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo nhà cung cấp khách sạn và nhập bảng giá phòng.

Sau khi tạo nhà cung cấp khách sạn, vào chi tiết → mục "Dịch vụ / Bảng giá" → chọn "Khách sạn".

Hệ thống cho phép quản lý:
- Danh sách khách sạn
- Thông tin cơ bản, hình ảnh, chính sách
- Danh sách loại phòng

Để tạo loại phòng:
- Nhập tên phòng
- Có thể thêm diện tích, tiện ích

Để nhập bảng giá phòng:
- Nhấn "Thêm mới"
- Chọn loại phòng
- Chọn thời gian áp dụng
- Chọn loại giá

Nhập các loại giá:
- Giá public
- Giá hợp đồng
- Giá giường phụ
- Lợi nhuận công ty

Hệ thống hỗ trợ:
- Nhập giá theo từng ngày trong tuần
- Chỉnh giá riêng cho thứ 6, thứ 7
- Tự động tính lợi nhuận

Ngoài ra có thể:
- Cấu hình bao gồm / không bao gồm
- Chọn có hoặc không bao gồm thuế và mức thuế suất
- Thêm ghi chú

Có thể sử dụng "Nhân bản" để tạo nhanh bảng giá cho phòng khác.

Hệ thống còn hỗ trợ nhập phụ phí:
- Phụ phí trẻ em
- Phụ phí ngày lễ
- Có thể áp dụng theo thời gian cụ thể

Có thể upload hợp đồng khách sạn để lưu trữ.

Sau khi hoàn tất, bảng giá sẽ được dùng cho báo giá và điều hành tour.
    `.trim(),
  },
  {
    id: "sale-04-1",
    title: "04.1 Nhà cung cấp Vé máy bay - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo dịch vụ vé máy bay và nhập bảng giá vé.

Trước khi tạo vé máy bay, cần cấu hình:
- Hãng bay
- Sân bay

Sau khi tạo xong, vào nhà cung cấp → chọn dịch vụ "Vé máy bay".

Hệ thống hỗ trợ các loại vé:
- Một chiều
- Khứ hồi
- Nhiều chặng

Khi tạo vé:
- Nhập tên vé
- Chọn hãng bay
- Chọn sân bay đi và đến
- Chọn ngày đi, ngày về

Nhập thông tin chuyến bay:
- Mã chuyến bay
- Giờ bay, giờ đến cho từng chặng

Nhập giá:
- Giá gốc
- Giá bán
- Giá trẻ em

Cấu hình thêm:
- Chọn đã bao gồm thuế hoặc chưa
- Nếu có thuế thì nhập phần trăm thuế suất

Sau khi lưu, vé máy bay sẽ được sử dụng trong báo giá và bán tour.
    `.trim(),
  },
  {
    id: "sale-04-2",
    title: "04.2 Nhà cung cấp - Vé tham quan CÁCH NHẬP MỚI - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo và nhập bảng giá vé tham quan.

Trước tiên cần tạo nhà cung cấp và chọn dịch vụ là "Vé tham quan".

Trước khi nhập giá, cần cài đặt các danh mục:
- Loại vé
- Đối tượng áp dụng
- Tên giá

Khi tạo loại vé:
- Nhập tên, mô tả
- Có thể thêm hình ảnh

Khi tạo đối tượng áp dụng:
- Gán đối tượng vào loại vé tương ứng

Khi tạo tên giá:
- Xác định độ tuổi hoặc chiều cao
- Phân biệt giá người lớn và trẻ em

Sau khi cài đặt xong, tiến hành tạo giá mới:
- Nhập thông tin tổng quan
- Có thể thêm ghi chú và hình ảnh

Tiếp theo nhập bảng giá:
- Chọn thời gian áp dụng
- Chọn loại giá
- Chọn đối tượng áp dụng

Nhập giá:
- Giá bán
- Giá gốc

Hệ thống hỗ trợ:
- Nhập giá theo ngày trong tuần
- Tùy chỉnh giá khác nhau cho cuối tuần

Ngoài ra:
- Chọn các mục bao gồm / không bao gồm
- Áp dụng thuế nếu có

Sau khi lưu, bảng giá sẽ hiển thị trong danh sách và dùng cho báo giá, bán tour.
    `.trim(),
  },
  {
    id: "sale-04-3",
    title: "04.3 Nhà cung cấp Visa - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo và nhập bảng giá dịch vụ Visa.

Sau khi tạo nhà cung cấp và chọn dịch vụ là "Visa", vào mục "Dịch vụ / Bảng giá" → chọn Visa.

Trước khi nhập giá, cần cài đặt:
- Thị trường
- Mục đích visa

Các danh mục này chỉ cần cài đặt một lần và có thể dùng chung cho nhiều nhà cung cấp.

Sau đó chọn thị trường áp dụng cho visa.

Khi tạo bảng giá visa:
- Chọn quốc gia và khu vực áp dụng
- Chọn thị trường đã cài đặt
- Chọn loại visa
- Chọn mục đích visa

Nhập thông tin giá:
- Giá gốc
- Lợi nhuận
- Giá bán

Cấu hình thêm:
- Chọn loại xử lý
- Upload file đính kèm
- Chọn có hoặc không bao gồm thuế

Sau khi lưu, bảng giá visa sẽ được sử dụng trong báo giá và bán dịch vụ.
    `.trim(),
  },
];

const SALE_GUIDES_PART_2: GuideAiItem[] = [
  {
    id: "sale-05",
    title: "05.2 Tạo Sản phẩm dịch vụ TOUR - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo sản phẩm tour và thiết lập chiết tính giá tour.

Tại menu "Sản phẩm dịch vụ" → chọn "Tour" → thêm mới tour.

Bước 1: Thông tin chung
- Nhập tên tour, loại tour
- Chọn điểm khởi hành, điểm đến
- Chọn loại tour
- Chọn loại hình
- Chọn dịch vụ đi kèm
- Nhập số khách tối thiểu và tối đa

Bước 2: Chương trình tour
- Nhập lịch trình từng ngày
- Thêm hình ảnh minh họa
- Có thể thêm nhiều ngày

Bước 3: Thông tin tour
- Giới thiệu tour
- Bao gồm / không bao gồm
- Chính sách
- Các lưu ý cho khách

Bước 4: Chiết tính tour
- Đặt tên bảng chiết tính
- Chọn thời gian áp dụng
- Chọn loại khách

Hệ thống sẽ tự lấy các dịch vụ đã chọn.

Thiết lập giá theo từng dịch vụ:
- Chọn nhà cung cấp và bảng giá
- Nhập số đêm, hành trình, số lượng
- Hệ thống tự tính thành tiền
- Có thể bật hoặc tắt thuế

Các dịch vụ áp dụng tương tự:
- Khách sạn
- Xe
- Nhà hàng
- Vé tham quan
- Vé máy bay
- Visa

Bước 5: Chi phí khác
- Chi phí chung
- Chi phí biến đổi
- Chi phí cố định

Bước 6: Thiết lập giá bán
- Nhập lợi nhuận theo số tiền hoặc phần trăm
- Thiết lập giá trẻ em

Hệ thống sẽ tự động:
- Tính giá gốc
- Tính giá bán
- Tính giá theo số lượng khách

Ngoài ra có thể:
- Sửa giá bán trực tiếp
- Áp dụng 1 mức giá cho toàn bộ số khách
- Làm tròn giá

Sau khi lưu, hệ thống tạo bảng giá tour chi tiết để dùng cho báo giá và bán tour.
    `.trim(),
  },
  {
    id: "sale-05-1",
    title: "05.3 Tạo Sản phẩm dịch vụ TOUR (DÀNH CHO CHIẾT TÍNH CÓ DỊCH VỤ LANDTOUR)",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo tour nhanh từ dịch vụ "land tour".

Chỉ áp dụng cho các chiết tính có dịch vụ "land tour".

Bước 1: Tạo giá land tour tại nhà cung cấp
- Vào nhà cung cấp → chọn dịch vụ "Land tour"
- Nhập thông tin: tên tour, thời gian, điểm đi – điểm đến
- Chọn loại tour
- Nhập giá gốc, lợi nhuận
- Nhập giá trẻ em
- Chọn thuế và lưu

Bước 2: Liên kết thành tour
- Sau khi lưu, nhấn nút "Liên kết tour"
- Hệ thống tự tạo tour trong mục "Sản phẩm dịch vụ → Tour"
- Tự động chuyển sang bước chiết tính

Bước 3: Kiểm tra thông tin tour
- Hệ thống tự lấy các thông tin chính
- Có thể chỉnh sửa điểm đến, loại hình tour, số ngày, số khách tối đa, thêm dịch vụ

Bước 4: Bổ sung nội dung
- Thêm chương trình tour
- Thêm thông tin tour, giới thiệu, bao gồm / không bao gồm, chính sách

Bước 5: Kiểm tra chiết tính
- Giá từ land tour được tự động đưa vào
- Có thể chỉnh sửa giá trực tiếp
- Không cần quay lại nhà cung cấp

Bước 6: Thiết lập lợi nhuận và hoa hồng
- Nhập lợi nhuận
- Giá trẻ em đã có sẵn hoặc chỉnh lại
- Thiết lập hoa hồng cho nhân viên hoặc đại lý

Bước 7: Lưu chiết tính
- Hệ thống tạo bảng giá tour chi tiết
- Áp dụng 1 mức giá cố định theo số khách

Sau khi hoàn tất, tour sẵn sàng để mở bán.

Lưu ý:
- Chỉ áp dụng cho tour có dịch vụ land tour
- Nếu không có land tour, phải tạo tour theo quy trình đầy đủ
    `.trim(),
  },
  {
    id: "sale-06",
    title: "06 Tiến trình kinh doanh - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này mô tả toàn bộ quy trình làm việc của nhân viên kinh doanh (sale).

1. Tiếp nhận khách hàng
- Khách từ marketing sẽ nằm ở trạng thái "Khách mới"
- Sale vào xem thông tin và nhu cầu khách
- Liên hệ để thu thập yêu cầu chi tiết

2. Tiến trình kinh doanh
Khách sẽ đi qua các trạng thái:
- Mới → Liên hệ → Báo giá → Tạo đơn → Điều hành → Thành công / Thất bại / Tư vấn lại

3. Tạo báo giá
- Chọn tour phù hợp với nhu cầu khách
- Chọn ngày khởi hành, số lượng khách
- Hệ thống tự tính giá gốc, giá bán, lợi nhuận

Có thể:
- Giảm giá
- Thêm thuế
- Nhập tiền khách đã đặt cọc
- Thiết lập chiết khấu cho HDV / cộng tác viên

4. Gửi báo giá cho khách
- Hệ thống tạo link xác nhận
- Khách xem thông tin tour, lịch trình, giá chi tiết, chính sách
- Có thể gửi link hoặc xuất PDF

5. Khách xác nhận
- Khách chọn phần trăm thanh toán và xác nhận
- Hệ thống tự chuyển báo giá thành đơn hàng

6. Xác nhận thanh toán
- Kế toán kiểm tra tiền thực nhận
- Nhập số tiền nếu khác
- Hệ thống tạo phiếu thu và tính số tiền còn lại

7. Quản lý đơn hàng
- Theo dõi tổng tiền, đã thu, còn lại, lợi nhuận
- Xem lịch sử thanh toán và phiếu thu

8. Ghi chú và phối hợp
- Ghi chú cho kế toán / điều hành
- Theo dõi yêu cầu khách

9. Theo dõi tiến trình
- Khi chốt đơn → chuyển trạng thái
- Khi điều hành → "Đang điều hành"
- Khi xong → "Thành công"

10. Xử lý khách chưa chốt
- "Tư vấn lại": chăm sóc lại khách
- "Thất bại": chọn lý do

Dữ liệu này giúp cải thiện bán hàng và đào tạo nhân sự.
    `.trim(),
  },
  {
    id: "sale-07",
    title: "07 Báo giá tour theo yêu cầu - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quy trình tạo báo giá tour riêng cho khách đoàn.

1. Tạo báo giá
- Vào "Đơn hàng" → "Báo giá theo yêu cầu"
- Hoặc tạo nhanh từ trang chủ

2. Chọn khách hàng
- Tìm khách cũ
- Hoặc tạo khách mới

3. Nhập thông tin tour
- Chọn loại tour riêng
- Nhập số ngày, tên tour
- Chọn ngày đi – ngày về
- Chọn quốc gia, số lượng khách

4. Gợi ý tour
- Có thể chọn từ các tour đã tạo sẵn
- Hoặc tạo tour mới hoàn toàn

5. Tạo chương trình tour
- Nhập lịch trình từng ngày
- Hoặc chọn từ mẫu có sẵn và chỉnh sửa

6. Tạo bảng dự toán
Thêm các dịch vụ cấu thành:
- Khách sạn
- Xe
- Nhà hàng
- Vé tham quan
- Hướng dẫn viên
- Vé máy bay

Hệ thống sẽ:
- Lấy giá net từ nhà cung cấp
- Tự động tính thành tiền

7. Thêm chi phí khác
- Chi phí biến đổi
- Chi phí cố định

8. Thiết lập giá bán
- Nhập lợi nhuận
- Hệ thống tính giá gốc, giá bán, lợi nhuận
- Có thể chỉnh tay giá bán

9. Thuế và chiết khấu
- Chọn đã bao gồm thuế hoặc thêm thuế
- Chiết khấu cho cộng tác viên / đại lý

10. Gửi báo giá
- Hệ thống tạo link xác nhận cho khách
- Khách xem lịch trình, giá chi tiết, chính sách

11. Khách xác nhận
- Chọn phần trăm thanh toán
- Upload chứng từ nếu có
- Xác nhận qua link

12. Xử lý đơn hàng
- Báo giá tự động chuyển thành đơn hàng
- Kế toán xác nhận tiền
- Hệ thống tạo phiếu thu

13. Theo dõi đơn hàng
- Tổng tiền / đã thu / còn lại
- Lợi nhuận
- Lịch sử thanh toán
- Phiếu thu, phiếu chi, dự toán

14. Hoàn tất thanh toán
- Khi khách thanh toán đủ → trạng thái "Đã thanh toán"
- Doanh thu và lợi nhuận được ghi nhận

Đây là quy trình đầy đủ từ báo giá tour riêng → đơn hàng → thanh toán.
    `.trim(),
  },
  {
    id: "sale-08",
    title: "08 Tạo báo giá theo dịch vụ - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo báo giá cho dịch vụ lẻ hoặc tour có sẵn.

1. Tạo báo giá
- Vào "Đơn hàng" → "Báo giá theo dịch vụ"
- Hoặc tạo nhanh từ trang chủ

2. Chọn khách hàng
- Tìm khách cũ
- Hoặc tạo khách mới

3. Nhập thông tin báo giá
- Nhập tên báo giá
- Chọn loại khách
- Chọn ngày bắt đầu – kết thúc
- Nhập ghi chú yêu cầu khách

4. Chọn dịch vụ cần báo giá
Có thể chọn nhiều dịch vụ:
- Khách sạn
- Xe
- Có thể thêm dịch vụ khác

5. Nhập chi tiết dịch vụ

Khách sạn:
- Chọn quốc gia, thành phố
- Chọn loại khách sạn
- Chọn ngày check-in / check-out
- Chọn loại phòng, số lượng phòng
- Hệ thống tự lấy giá và tính thành tiền

Xe:
- Chọn quốc gia, thành phố
- Chọn nhà xe, loại xe
- Nhập thời gian thuê
- Nhập hành trình
- Hệ thống tính giá gốc, giá bán và lợi nhuận

6. Tổng hợp chi phí
- Hiển thị tổng giá gốc, tổng thanh toán, lợi nhuận
- Có thể thêm phụ phí, giường phụ, phát sinh

7. Thiết lập giá
- Thuế
- Giảm giá
- Nhập tiền khách đã đặt cọc
- Chiết khấu cho cộng tác viên / nhân viên

8. Gửi báo giá
- Hệ thống tạo link xác nhận
- Có thể gửi link hoặc xuất PDF

9. Khách xác nhận
- Xác nhận và thanh toán
- Upload chứng từ nếu có

10. Xử lý đơn hàng
- Báo giá tự động chuyển thành đơn hàng
- Kế toán xác nhận tiền
- Hệ thống lưu lịch sử thanh toán và phiếu thu

Đây là quy trình báo giá nhanh cho dịch vụ lẻ hoặc tour có sẵn.
    `.trim(),
  },
  {
    id: "sale-09",
    title: "09 Điều hành tour riêng hoặc dịch vụ ghép lẻ - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này mô tả quy trình điều hành tour riêng từ khi nhận đơn đến quyết toán.

1. Nhận đơn từ sale
- Sale chuyển đơn sang điều hành
- Điều hành nhận thông báo và vào xử lý
- Kiểm tra thông tin: số khách, ngày đi, nhân sự phụ trách

2. Nhập danh sách đoàn
Có 3 cách:
- Nhập thủ công
- Import file Excel
- Gửi link cho khách tự nhập

Có thể:
- Xếp phòng, xếp xe
- Upload giấy tờ khách
- Xuất danh sách cho hướng dẫn viên

3. Điều hành dịch vụ
- Hệ thống tự tách các dịch vụ từ chiết tính tour
- Có thể chỉnh sửa nhà cung cấp và giá thực tế

4. Đặt dịch vụ với nhà cung cấp
- Gửi yêu cầu qua link hoặc email
- Nhà cung cấp xác nhận trực tiếp trên hệ thống
- Trạng thái: chưa gửi, chờ phản hồi, đã xác nhận

5. Dự chi
- Tổng hợp toàn bộ chi phí
- Theo dõi thời gian cần thanh toán

6. Thanh toán nhà cung cấp
Có 2 cách:
- Trả ngay → tạo phiếu chi
- Trả sau → đưa vào công nợ

Phiếu chi:
- Gửi kế toán duyệt
- Sau khi duyệt → chuyển sang thực chi

7. Thực chi
- Lưu toàn bộ chi phí đã thanh toán
- Cập nhật số tiền còn lại

8. Cần thu
- Theo dõi khách đã thanh toán bao nhiêu
- Kiểm tra công nợ khách hàng

9. Tạm ứng cho hướng dẫn viên
- Tạo phiếu bàn giao
- Tạo phiếu tạm ứng tiền

Hướng dẫn viên:
- Nhập chi phí thực tế
- Upload hóa đơn
- Hệ thống tính chênh lệch

10. Quyết toán tour
- Tổng hợp tổng thu, tổng chi, thuế, lợi nhuận
- Kiểm tra phiếu thu, phiếu chi, tạm ứng
- Có thể xuất file, in báo cáo

Đây là quy trình đầy đủ từ điều hành đến quyết toán tour.
    `.trim(),
  },
];

const SALE_GUIDES_PART_3: GuideAiItem[] = [
  {
    id: "sale-10",
    title: "10 Tour mở bán tổng quan - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quy trình tạo tour mở bán để gom khách lẻ.

1. Điều kiện
- Phải có tour đã tạo sẵn

2. Tạo tour mở bán
- Vào "Tour mở bán"
- Chọn tour cần mở bán

Hệ thống tự lấy:
- Loại tour
- Số ngày
- Số khách tối thiểu / tối đa

Có thể chỉnh:
- Số khách mở bán

3. Thiết lập thời gian
- Chọn khoảng thời gian mở bán
- Chọn kiểu khởi hành:
  + Hàng ngày
  + Hàng tuần
- Chọn giờ khởi hành

4. Chọn chiết tính
- Quy định giá bán và hoa hồng
- Có thể chỉnh hoa hồng theo phần trăm hoặc tiền

5. Thêm chuyến bay (nếu có)
- Nhập ngày bay, giờ bay, hãng bay, mã chuyến

6. Mở bán
- Lưu → hệ thống tạo danh sách tour mở bán

7. Theo dõi trạng thái
- Số khách đã bán
- Giữ chỗ
- Chờ xác nhận
- Đang chờ

8. Giữ chỗ
- Có thể giữ chỗ không giới hạn
- Nhưng tạo đơn hàng bị giới hạn theo số khách mở bán
- Có thời gian giữ chỗ, hết hạn sẽ tự huỷ

9. Đơn phát sinh
- Khi tour đủ khách vẫn có thể tạo thêm đơn
- Hệ thống đánh dấu đơn phát sinh

10. Xem chi tiết
- Danh sách đơn hàng
- Danh sách giữ chỗ
- Tổng thu / chi / lợi nhuận dự toán
- Lợi nhuận thực tế
- Điểm hoà vốn

11. Chuyển điều hành
- Điều hành từ màn hình tour mở bán
- Sau đó xử lý giống tour riêng

Đây là quy trình đầy đủ từ mở bán → bán khách → điều hành.
    `.trim(),
  },
  {
    id: "sale-11",
    title: "11 Điều hành tour ghép - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quy trình tạo và quản lý tour mở bán để gom khách lẻ.

1. Điều kiện
- Phải có tour đã tạo sẵn

2. Chuẩn bị trước khi mở bán
- Dùng bộ lọc để tìm tour theo ngày khởi hành, trạng thái, loại tour, điểm đến, chi nhánh
- Cài đặt hạng giữ chỗ

3. Tạo tour mở bán
- Nhấn "Tour mở bán"
- Chọn tour cần mở

Hệ thống tự lấy:
- Loại tour
- Số ngày
- Số khách tối thiểu / tối đa

Có thể chỉnh:
- Số khách mở bán
- Loại khách

4. Thiết lập lịch khởi hành
- Chọn khoảng thời gian mở bán
- Chọn kiểu khởi hành hàng ngày hoặc hàng tuần
- Hệ thống tự sinh danh sách ngày khởi hành
- Chọn giờ khởi hành

5. Thiết lập giá và hoa hồng
- Chọn chiết tính tour
- Hệ thống tự lấy giá bán và hoa hồng
- Có thể chỉnh hoa hồng theo phần trăm hoặc số tiền

6. Thêm chuyến bay
- Nhập ngày bay, giờ bay / giờ đến, hãng bay, mã chuyến
- Có thể áp dụng cho 1 tour hoặc toàn bộ lịch mở bán

7. Mở bán
- Lưu → hệ thống tạo danh sách tour mở bán

8. Quản lý trạng thái khách
- Giữ chỗ
- Chờ xác nhận
- Đang chờ
- Đã bán

9. Quy tắc số lượng khách
- Giữ chỗ không giới hạn
- Đơn hàng bị giới hạn theo số khách mở bán
- Có thể tạo đơn phát sinh khi đủ khách

10. Chi tiết tour mở bán
- Danh sách đơn hàng
- Danh sách giữ chỗ
- Tổng thu / chi / lợi nhuận dự toán
- Tổng thu / chi / lợi nhuận thực tế
- Điểm hoà vốn

11. Quản lý đơn hàng
- Tạo đơn giữ chỗ
- Tạo đơn hàng chính thức
- Hệ thống tự gán thời hạn giữ chỗ
- Hết hạn sẽ tự chuyển trạng thái quá hạn

12. Chuyển điều hành
- Thực hiện trong chi tiết tour mở bán
- Sau đó điều hành giống tour riêng

Đây là quy trình đầy đủ từ mở bán → giữ chỗ → bán → điều hành.
    `.trim(),
  },
  {
    id: "sale-12",
    title: "12 Công việc chung, bộ máy giao việc - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quản lý công việc chung trong hệ thống.

Mục "Công việc chung" dùng để:
- Giao việc cho phòng ban và nhân sự
- Theo dõi tiến độ và thời gian thực hiện
- Kiểm soát hiệu suất làm việc

1. Tạo công việc lớn
- Nhấn "Thêm công việc"
- Nhập tên công việc, nhóm công việc, thời gian, phòng ban phụ trách, mô tả, nhân sự phụ trách, người theo dõi, ngân sách, file đính kèm
- Hệ thống gửi thông báo cho nhân sự liên quan

2. Tạo công việc con
- Tạo các đầu việc nhỏ trong chi tiết công việc
- Mỗi công việc con có deadline, độ ưu tiên, người phụ trách
- Có thể tạo nhiều cấp

3. Theo dõi tiến độ
- Nhân viên hoàn thành sẽ tick "Hoàn tất"
- Hệ thống tự tính phần trăm tiến độ
- Hiển thị lịch sử hoạt động

4. Quản lý công việc
- Xem theo danh sách hoặc dạng cột
- Có tài liệu đính kèm và thảo luận nội bộ

5. Báo cáo công việc
- Tổng số công việc
- Số phòng ban, nhân sự tham gia
- Tiến độ và trạng thái công việc
- Ngân sách
- Tỷ lệ hoàn thành đúng hạn
- Tỷ lệ quá hạn
- Nhân viên hoàn thành tốt
- Nhân viên trễ deadline
- Biểu đồ theo dõi tiến độ theo ngày
- Báo cáo chi tiết từng công việc

Giúp quản lý kiểm soát tiến độ và hiệu suất nhân sự trong công ty.
    `.trim(),
  },
  {
    id: "sale-13",
    title: "13 Thư nội bộ, chat nội bộ - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn sử dụng thư nội bộ để gửi thông báo trong công ty.

Mục "Thư nội bộ" dùng để:
- Gửi quy định, chính sách
- Thông báo nội bộ
- Giao thông tin đến phòng ban hoặc cá nhân

1. Tạo thư nội bộ
- Nhấn "Thêm mới"
- Nhập tiêu đề, nội dung chi tiết, file đính kèm

2. Chọn người nhận
- Toàn bộ công ty
- Theo phòng ban
- Theo từng cá nhân

Sau khi gửi:
- Nhân viên nhận thông báo trên hệ thống
- Có thể click để xem nội dung

3. Quản lý thông báo
- Đánh dấu quan trọng
- Ghim lên đầu danh sách

4. Xác nhận đã đọc
- Nhân viên cần phản hồi “đã đọc”
- Hệ thống hiển thị ai đã đọc, ai chưa đọc

5. Theo dõi chi tiết
- Xem danh sách người nhận
- Kiểm soát việc tiếp nhận thông tin

Giúp quản lý truyền đạt thông tin và kiểm soát việc đọc thông báo trong nội bộ.
    `.trim(),
  },
  {
    id: "sale-14",
    title: "14 Báo cáo thống kê tổng hợp tối ưu mọi quy trình - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn xem và phân tích báo cáo trong hệ thống.

Có 2 cách truy cập:
- Từ menu "Kế toán → Báo cáo"
- Hoặc từ trang chủ

Hệ thống gồm 5 loại báo cáo chính:

1. Báo cáo bán hàng
- Lọc theo thời gian, phòng ban, nhân viên
- Hiển thị doanh thu, thực thu, công nợ còn lại, số đơn hàng, khách hàng
- Phân tích lợi nhuận, doanh thu theo dịch vụ, phương thức thanh toán, nhóm khách hàng
- Thống kê top nhân viên, đại lý, cộng tác viên, tỷ lệ tăng trưởng

2. Báo cáo công nợ
- Công nợ phải thu
- Công nợ phải trả
- Tổng nợ, đã thu / đã trả, còn lại
- Nợ quá hạn
- Có thể tạo phiếu thu / thanh toán trực tiếp

3. Báo cáo thu chi
- Tồn quỹ đầu kỳ, cuối kỳ
- Tổng thu, tổng chi
- Thu/chi theo năm, tháng, ngày
- Biểu đồ dòng tiền
- Phân loại nguồn thu và loại chi
- Xem và in phiếu thu chi

4. Báo cáo khách hàng
- Khách mới, khách thân thiết, khách đã hủy
- Số đơn hàng, giá trị đơn hàng
- Nguồn khách và hiệu quả kênh

5. Báo cáo hoa hồng
- Theo dõi hoa hồng nhân viên
- Số đơn hàng, doanh thu, lợi nhuận mang về
- Hoa hồng đạt được và chi trả
- Có thể xem chi tiết từng đơn

Giúp quản lý theo dõi doanh thu, chi phí, công nợ và hiệu quả kinh doanh.
    `.trim(),
  },
  {
    id: "sale-15",
    title: "15 Phân quyền nhóm và cá nhân - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn phân quyền người dùng trong hệ thống.

Quản trị viên có nhiệm vụ:
- Phân quyền cho nhóm người dùng
- Phân quyền riêng cho từng cá nhân nếu cần

1. Truy cập phân quyền
- Vào avatar góc phải → chọn "Phân quyền"

2. Cấu trúc phân quyền
- Cột dọc: nhóm chức năng
- Cột ngang: nhóm người dùng

3. Phân quyền theo nhóm
- Tích chọn quyền cho từng nhóm:
  + Xem
  + Thêm mới
  + Chỉnh sửa
  + Xóa

Có thể:
- Chọn tất cả
- Bỏ từng quyền

Ví dụ:
- Nhóm điều hành: xem + sửa khách hàng nhưng không được xóa
- Nhóm kế toán: chỉ xem và thêm, không sửa/xóa

4. Tìm nhanh chức năng
- Có ô tìm kiếm để lọc theo module

5. Lưu phân quyền
- Sau khi thiết lập → bấm "Lưu"

6. Phân quyền riêng cho cá nhân
- Vào: Hành chính nhân sự → chọn nhân viên
- Mở "Phân quyền riêng"
- Có thể gán thêm quyền đặc biệt
- Override quyền của nhóm

Giúp kiểm soát truy cập và đảm bảo bảo mật hệ thống.
    `.trim(),
  },
  {
    id: "sale-16",
    title: "16 Quản lý lịch trình tour riêng, tour ghép - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn theo dõi lịch trình tour của khách hàng.

Sau khi tạo đơn hàng, có thể xem lịch trình tại:
- Điều hành → Lịch trình tour riêng
- Điều hành → Lịch trình tour ghép

1. Tìm kiếm và lọc
- Tìm theo tên đơn hàng, tên khách hàng, tên tour
- Lọc theo ngày khởi hành, dịch vụ sử dụng

2. Hiển thị lịch trình
Có 2 dạng:
- Dạng danh sách
- Dạng lịch

Có thể xem:
- Theo ngày
- Theo tuần
- Theo tháng

3. Xem chi tiết lịch trình
Khi click vào 1 tour sẽ thấy:
- Thông tin đơn hàng
- Lịch trình theo từng ngày

Ví dụ:
- Ngày 1: khách sạn, xe, hướng dẫn viên
- Ngày 2: khách sạn, xe
- Ngày 3: nhà hàng, vé tham quan

4. Theo dõi dịch vụ
Mỗi dịch vụ hiển thị:
- Nhà cung cấp
- Thông tin liên hệ
- Địa chỉ
- Chi tiết dịch vụ
- Trạng thái: đã đặt / chưa đặt

5. Tour ghép
- Giao diện tương tự tour riêng
- Hiển thị thông tin tour, ngày khởi hành, dịch vụ từng ngày
- Có thể mở rộng / thu gọn từng ngày

Giúp điều hành theo dõi toàn bộ lịch trình và dịch vụ của khách hàng.
    `.trim(),
  },
];

const SALE_GUIDES_PART_4: GuideAiItem[] = [
  {
    id: "sale-17",
    title: "17 Hành chính nhân sự, Chấm công, lương thưởng - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn nghiệp vụ hành chính nhân sự, chấm công và lương thưởng trong hệ thống.

Nội dung chính gồm:
- Quản lý thông tin nhân sự
- Theo dõi chấm công
- Tính lương, thưởng và các khoản liên quan
- Hỗ trợ đánh giá hiệu suất làm việc

Người quản lý có thể:
- Xem danh sách nhân viên
- Theo dõi thời gian làm việc
- Kiểm tra tình trạng công
- Tổng hợp dữ liệu phục vụ tính lương

Hệ thống hỗ trợ đồng bộ dữ liệu chấm công và kết nối với các nghiệp vụ khác như KPI, phân quyền và báo cáo.
    `.trim(),
  },
  {
    id: "sale-18",
    title: "18 Kế toán tổng - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này mô tả quy trình làm việc của kế toán trong hệ thống.

1. Xác nhận thanh toán đơn hàng
- Khi sale tạo đơn và khách xác nhận → kế toán nhận thông báo
- Kế toán click vào đơn hàng, nhấn "Xác nhận thanh toán", nhập mật khẩu
- Nhập số tiền thực nhận
- Hệ thống tạo phiếu thu và cập nhật trạng thái thanh toán

2. Quyết toán tour
- Vào điều hành → chọn tour → "Quyết toán"
- Kế toán có thể xem tổng thu / tổng chi
- Thu thêm tiền từ khách nếu chưa đủ
- Chi tiền cho nhà cung cấp:
  + Chi ngay
  + Hoặc đưa vào công nợ
- Xem phiếu tạm ứng

3. Tổng quan kế toán
- Xem toàn bộ đơn hàng: trạng thái, doanh thu, lợi nhuận
- Có thể xác nhận thanh toán hoặc gửi lại link thanh toán cho khách

4. Phiếu thu – chi
- Xem tất cả phiếu thu / chi
- Tạo phiếu mới: đơn vị, số tiền, nội dung, tài khoản ngân hàng
- Phiếu chi cần xét duyệt
- Sau khi duyệt → ghi nhận tiền ra
- Có lịch sử xét duyệt, trạng thái đồng ý / từ chối

5. Công nợ

a. Công nợ phải thu
- Kiểm tra đơn chưa thanh toán
- Tạo phiếu thu
- Sau khi thu → cập nhật đã hoàn tất

b. Công nợ phải trả
- Kiểm tra khoản cần trả
- Tạo phiếu chi
- Sau khi duyệt → cập nhật đã thanh toán

Giúp quản lý dòng tiền, công nợ và thanh toán toàn bộ hệ thống.
    `.trim(),
  },
  {
    id: "sale-19",
    title: "19 PHẦN KPI - Phần mềm du lịch Nhanh Travel",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quản lý KPI và hiệu suất nhân viên trong hệ thống.

1. Tổng quan KPI
- Hiển thị KPI theo năm, quý, tháng, tuần
- So sánh mục tiêu đề ra với doanh thu thực tế
- Giúp đánh giá đạt KPI hay chưa

2. KPI theo phòng ban và nhân viên
- Thống kê KPI theo từng phòng ban
- KPI chi tiết từng nhân viên
- Phân loại nhân viên vượt KPI, đạt KPI, không đạt

3. Chi tiết KPI
- Xem mục tiêu cụ thể
- So sánh doanh thu thực tế và phần trăm hoàn thành
- Xem chi tiết từng nhân viên

4. Cài đặt KPI
- Thiết lập chỉ tiêu theo phòng ban hoặc theo từng nhân viên

5. Gắn KPI với lương và thưởng
- Cấu hình mức lương, hoa hồng khi đạt / không đạt / vượt KPI

6. Tính lương
- Hệ thống dựa trên KPI đạt được, doanh thu thực tế và chấm công
- Tự động tính lương, hoa hồng, thưởng / phạt

Giúp đánh giá hiệu suất và tính lương minh bạch cho nhân viên.
    `.trim(),
  },
  {
    id: "sale-20",
    title: "20 Quy trình ký quỹ nhà cung cấp",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quy trình ký quỹ với nhà cung cấp.

1. Tạo ký quỹ
- Vào "Nhà cung cấp"
- Chọn nhà cung cấp cần ký quỹ
- Vào tab "Ký quỹ"
- Nhấn "Thêm ký quỹ"
- Nhập số tiền ký quỹ, nội dung, phương thức thanh toán
- Lưu lại

Hệ thống sẽ:
- Tự động tạo phiếu chi
- Kế toán vào duyệt phiếu chi

2. Sử dụng tiền ký quỹ
- Khi điều hành đặt dịch vụ
- Chọn phương thức thanh toán = "Tiền ký quỹ"
- Gửi yêu cầu đặt dịch vụ cho nhà cung cấp

3. Xử lý thanh toán
- Nếu nhà cung cấp xác nhận:
  + Hệ thống trừ tiền từ quỹ
  + Chuyển trạng thái sang "Đã chi"
- Nếu chưa xác nhận:
  + Trạng thái = "Đợi thanh toán"

4. Theo dõi quỹ
Trong chi tiết nhà cung cấp:
- Xem tiền đã nạp
- Xem tiền đã chi
- Hệ thống tính số dư còn lại

Giúp doanh nghiệp trả trước cho nhà cung cấp và quản lý số dư ký quỹ.
    `.trim(),
  },
  {
    id: "sale-21",
    title: "21 Thao tác báo giá + đơn hàng (GIAO DIỆN MỚI)",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn tạo đơn hàng trong hệ thống.

1. Tạo đơn hàng
- Vào "Đơn hàng" → "Tạo đơn hàng mới"

2. Thông tin khách hàng
- Chọn loại đơn thường hoặc đơn đại lý
- Chọn khách có sẵn hoặc tạo mới

3. Thông tin đơn hàng
- Nhập tên đơn hàng
- Nhập thời gian bắt đầu / kết thúc
- Nhập ghi chú hiển thị cho khách
- Phân công nhân viên phụ trách, nhân viên điều hành nếu có quyền

4. Chọn dịch vụ
- Thêm tour, khách sạn, xe, nhà hàng, vé...
- Với tour:
  + Chọn tour từ kho
  + Chọn ngày khởi hành
  + Nhập số lượng khách
  + Hệ thống tự tính giá
- Với dịch vụ lẻ:
  + Chọn từ nhà cung cấp
  + Nhập ngày, số lượng
  + Tự động tính giá theo thời gian
- Có thể thêm phụ thu, chi phí phát sinh

5. Tính toán tự động
Hệ thống tự:
- Tính tổng tiền
- Tính thuế
- Tính giảm giá
- Tính lợi nhuận trước / sau chiết khấu
- Tính hoa hồng sale

6. Thanh toán
- Chọn phương thức thanh toán
- Nếu khách đã cọc:
  + Nhập số tiền
  + Hệ thống tự tạo phiếu thu

7. Xuất đơn hàng
- Copy link gửi khách
- Xuất PDF / in
- Link gồm thông tin khách, dịch vụ, lịch trình, giá chi tiết, chính sách

8. Khách xác nhận
- Chọn phương thức thanh toán
- Chọn phần trăm thanh toán

9. Xử lý thanh toán
- Nếu dùng QR thì tự động xác nhận
- Nếu không thì kế toán xác nhận thủ công
- Có thể nhập số tiền thực nhận để hệ thống tự điều chỉnh

Hoàn tất đơn hàng và ghi nhận doanh thu.

Áp dụng cho:
- Tour trọn gói
- Dịch vụ lẻ
    `.trim(),
  },
  {
    id: "sale-22",
    title: "22 Quy trình nhập kho + tạo đơn mới dịch vụ SỰ KIỆN",
    type: "sale_child",
    transcript: `
Phần này hướng dẫn quản lý dịch vụ và gói sự kiện trong hệ thống.

1. Tạo nhà cung cấp sự kiện
- Vào "Nhà cung cấp" → "Tạo mới"
- Chọn dịch vụ: Sự kiện
- Nhập thông tin nhà cung cấp

2. Quản lý kho sự kiện
- Vào tab "Kho sự kiện"
- Thiết lập danh mục, thương hiệu, sản phẩm
- Hệ thống quản lý tồn kho thiết bị

3. Tạo bản giá sự kiện
- Vào "Dịch vụ bản giá" → "Sự kiện"
- Nhấn "Tạo giá mới"
- Nhập tên thiết bị, thời gian áp dụng, khu vực hoạt động, loại thuê / bán
- Hệ thống tự lấy giá gốc từ kho và tính giá bán
- Có thể cài giá đại lý riêng

4. Tạo gói sự kiện
- Vào "Sản phẩm dịch vụ" → "Sự kiện"
- Tạo gói mới
- Nhập tên sự kiện, quy mô, loại hình, thời gian, nhân sự phụ trách, mô tả, hình ảnh

5. Xây dựng chương trình sự kiện
- Thêm nội dung theo ngày
- Ví dụ: ngày 1 team building, ngày 2 gala dinner

6. Lập ngân sách
- Thêm các dịch vụ vào gói
- Chọn danh mục, nhà cung cấp, nhập số lượng
- Hệ thống lấy giá gốc và tính tổng chi phí
- Có 2 cách tính lợi nhuận:
  + Theo từng dịch vụ
  + Theo tổng gói

7. Tạo đơn hàng sự kiện
- Vào "Đơn hàng" → chọn dịch vụ "Sự kiện"
- Chọn gói sự kiện
- Hệ thống tự load dịch vụ, giá, chương trình
- Nhập số lượng khách, thời gian
- Có thể thêm / sửa dịch vụ, thêm chi phí phát sinh

8. Gửi khách hàng
- Xuất link hoặc PDF
- Khách xem nội dung sự kiện, hình ảnh, dịch vụ, giá
- Khách xác nhận

9. Quản lý kho tổng
- Vào "Kế toán → Quản lý kho"
- Hiển thị tổng nhập / xuất / tồn theo từng nhà cung cấp

Đây là module quản lý sự kiện từ kho → giá → gói → đơn hàng.
    `.trim(),
  },
];

export const guideAiData: GuideAiItem[] = [
  ...ROOT_GUIDES,
  ...SALE_GUIDES_PART_1,
  ...SALE_GUIDES_PART_2,
  ...SALE_GUIDES_PART_3,
  ...SALE_GUIDES_PART_4,
];

export function getGuideAiTranscriptById(id: string) {
  return guideAiData.find((item) => item.id === id) ?? null;
}