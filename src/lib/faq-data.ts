export type FaqItem = {
  question: string;
  answer: string;
  parentQuestion?: string;
  isParent?: boolean;
};

export type FaqGroup = {
  title: string;
  parentQuestion: string;
  parentAnswer: string;
  items: FaqItem[];
};

export const welcomeMessage = `Dạ, em chào anh/chị ạ
Em là trợ lý Nhanh Travel – hỗ trợ anh/chị tìm hiểu nhanh về phần mềm quản lý du lịch toàn diện.
Anh/chị đang quan tâm về tính năng, giá hay muốn xem Demo ạ?`;

export const faqGroups: FaqGroup[] = [
  {
    title: "Giới thiệu chung",
    parentQuestion: "Nhanh Travel là gì và giúp được gì?",
    parentAnswer: `Dạ, Nhanh Travel là hệ thống quản lý du lịch toàn diện, giúp doanh nghiệp vận hành trên một nền tảng duy nhất.
Hệ thống hỗ trợ từ sale, điều hành tour, khách hàng, CRM, cho tới kế toán và báo cáo.
Điểm mạnh là giúp doanh nghiệp tinh gọn vận hành, giảm sai sót và dễ mở rộng lâu dài ạ.`,
    items: [
      {
        question: "Phần mềm là gì?",
        answer: `Dạ, Nhanh Travel là hệ thống giúp anh/chị quản lý toàn bộ hoạt động công ty du lịch trên một nền tảng duy nhất.
Từ sale, điều hành tour, khách hàng, CRM, cho tới kế toán và báo cáo đều được tự động hoá.
Thực tế nhiều bên trước đây dùng nhiều file và nhiều phần mềm rời rạc nên rất khó kiểm soát.
Nhanh Travel là một hệ thống giúp vận hành tinh gọn 90%  và giảm sai sót rất nhiều ạ.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "CRM là gì?",
        answer: `Dạ, CRM là hệ thống giúp anh/chị quản lý toàn bộ khách hàng và lịch sử làm việc với khách.
Ví dụ: khách đã đi tour nào, ai chăm sóc, đã báo giá chưa… tất cả đều lưu lại.
Nhiều bên trước đây bị mất khách cũ vì không theo dõi được, nhưng khi dùng CRM thì chăm khách rất dễ và tăng doanh thu quay lại khá rõ ạ.`,
      },
      {
        question: "Hệ thống có tích hợp CRM?",
        answer: `Hệ thống đã tích hợp sẵn CRM, giúp doanh nghiệp quản lý toàn bộ thông tin khách hàng một cách tập trung và xuyên suốt.
Có thể theo dõi đầy đủ lịch sử giao dịch, lịch sử tương tác của từng khách, đồng thời hỗ trợ phân loại khách hàng và tự động chăm sóc qua nhiều kênh như email, SMS, Zalo.
Nhờ đó doanh nghiệp không bị thất thoát data, chăm sóc khách tốt hơn và tăng tỷ lệ khách quay lại rõ rệt.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Công ty nhỏ có cần không?",
        answer: `Dạ, thực tế công ty nhỏ lại càng nên dùng ạ.
Vì giai đoạn này dễ bị thất thoát khách, sai sót booking và khó kiểm soát công nợ nhất.
Khi có hệ thống hỗ trợ từ đầu thì mình làm nhẹ hơn rất nhiều và sau này mở rộng thêm 100 nhân sự cũng dễ ạ.`,
      },
      {
        question: "Có dùng được trên điện thoại?",
        answer: `Dạ, bên em có App cho cả Admin và nhân sự ạ.
Anh/chị có thể theo dõi tình hình kinh doanh, tour, khách hàng, dòng tiền, đơn hàng, lịch trình… ngay trên điện thoại, không cần lúc nào cũng phải ngồi máy tính.
Rất tiện cho việc quản lý từ xa ạ.`,
      },
      {
        question: "Hệ thống có tích hợp AI không?",
        answer: `Dạ có anh/chị ạ! Hệ thống bên em đã tích hợp AI thông minh đóng vai trò như một trợ lý ảo 24/7 để hỗ trợ anh/chị tối đa trong nhập liệu ạ`,
      },
      {
        question: "So sánh với phần mềm khác",
        answer: `Dạ, điểm khác biệt của Nhanh Travel là gom toàn bộ vận hành về một hệ thống duy nhất giúp TỰ ĐỘNG HOÁ toàn diện.
• AI nhập liệu → set up rất nhanh
• Có App quản lý + App đại lý → bán hàng mọi lúc
• Kết nối đa kênh: OTA, Facebook, Zalo, Email
• Quản lý full từ sale – điều hành – CRM – kế toán – KPI -HCNS - Giao việc - chấm công và hệ thống báo cáo trực quan
- Anh/chị có thêm kênh bán B2B và B2C 
- Có thể kết nối với nhiều đơn vị liên minh
- Kho Nhà cung cấp rộng lớn thoải mái lựa chọn để mang về hệ thống riêng của mình mà kg cần nhập liệu 
Nhiều bên đang dùng phần mềm khác vẫn phải dùng thêm nhiều phần mềm và các file nên khá rời rạc.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Có gói cho SME (doanh nghiệp nhỏ) không?",
        answer: `Dạ có anh/chị nhé.
Bên em có gói phù hợp cho doanh nghiệp nhỏ để bắt đầu dễ dàng.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
    ],
  },

  {
    title: "Gói và giá",
    parentQuestion: "Gói và giá như thế nào?",
    parentAnswer: `Dạ, Nhanh Travel hiện có nhiều gói phù hợp theo quy mô doanh nghiệp, từ nhỏ đến lớn.
Chi phí đã bao gồm bảo trì và cập nhật hệ thống, đồng thời có thể nâng cấp theo nhu cầu thực tế.
Nếu anh/chị chia sẻ mô hình hiện tại, bên em có thể tư vấn gói phù hợp nhất để tránh dùng dư tính năng ạ.`,
    items: [
      {
        question: "Hỏi chi tiết về các gói",
        answer: `Dạ, bên em hiện có 3 gói chính:
• 1.200.000/tháng: phù hợp doanh nghiệp nhỏ – quản lý tour cơ bản
• 2.700.000/tháng: Có CRM + App + nhiều tính năng nâng cao HCNS, KPI, Giao việc...
• 4.000.000/tháng: full toàn bộ hệ thống từ sale, điều hành, kế toán, marketing, HCNS, KPI, chấm công, giao việc...
Tuỳ mô hình bên mình, em có thể tư vấn nhanh gói phù hợp với mình nhất ạ. anh/chị cho em xin số điện thoại để tiện hỗ trợ nhé`,
      },
      {
        question: "Hỏi về gói starter - tiêu chuẩn",
        answer: `Dạ, gói Starter phù hợp với doanh nghiệp nhỏ 5 user ạ
Hệ thống đã có đầy đủ các chức năng cơ bản như quản lý khách hàng, đơn hàng, nhà cung cấp và điều hành tour.
Gói này cũng vô cùng tin gọn so với việc mình làm thủ công hoặc dùng nhiều phần mềm rời rạc ạ. gói Tiêu chuẩn cũng khá đầy đủ nếu cần tính năng chuyên sâu về quản trị anh chị có thể nâng cấp nhé
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Hỏi về gói business - nâng cao",
        answer: `Dạ, gói business - nâng cao sẽ phù hợp với doanh nghiệp vừa và nhỏ khoản 15-20 user ạ.
Ngoài các chức năng cơ bản, hệ thống có thêm CRM, App và nhiều công cụ hỗ trợ bán hàng – giúp quản lý khách tốt hơn và tăng doanh thu.
Thực tế nhiều bên khi bắt đầu bắt đầu chuyển đổi số thường chuyển lên gói này để vận hành đồng bộ hơn.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Hỏi về gói enterprise - chuyên nghiệp",
        answer: `Dạ, gói cao cấp là full toàn bộ hệ thống ạ.
Anh/chị có thể quản lý xuyên suốt từ Sale – điều hành – CRM – kế toán – KPI - giao việc, HCNS, chấm công, lương thưởng đồng bộ toàn diện trên một nền tảng duy nhất, không cần dùng thêm phần mềm nào khác đâu ạ.
Gói này phù hợp với doanh nghiệp muốn vận hành bài bản và tối ưu toàn bộ hệ thống lâu dài. Tiết kiệm thời gian và chi phí, đặc biệt không phụ thuộc vào con người quá nhiều ạ.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Hỏi về gói customize, trọn đời",
        answer: `Dạ, gói này dành cho anh/chị có nhu cầu tiết kiệm chi phí và làm thêm tính năng theo yêu cầu, Bên em có thể customize theo mong muốn của mình ạ. 
Gói này thì đặc biệt anh chị sẽ có một giải pháp xác xao với công ty mình 99,99% luôn ạ về lâu dài thì khá tiết kiệm anh chị quan tâm để lại SĐT bên em sẽ hỗ trợ tư vấn ngay ạ.`,
      },
      {
        question: "Giá thuê bao (subscription) hàng tháng đã bao gồm phí bảo trì chưa?",
        answer: `Dạ, phí hàng tháng đã bao gồm bảo trì và cập nhật hệ thống rồi ạ.`,
      },
      {
        question: "Thêm phí khi nâng cấp?",
        answer: `Dạ, khi nâng cấp lên gói cao hơn thì sẽ áp dụng số tiền dư còn lại lên cho gói mới ạ.
Bên em sẽ tư vấn để mình chọn gói phù hợp nhé `,
      },
      {
        question: "Có phát sinh chi phí gì thêm không?",
        answer: `Dạ, chi phí đã bao gồm , không phát sinh thêm bất kỳ chi phí nào khác ạ.
Chỉ khi mình nâng cấp thêm tính năng hoặc gói cao hơn thì mới có thay đổi chi phí.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Nếu dùng lâu có tăng giá không?",
        answer: `Dạ, bên em có chính sách ổn định giá theo gói đã đăng ký ạ.
Khi có thay đổi thì cũng sẽ thông báo trước để anh/chị chủ động.`,
      },
      {
        question: "Có phải trả thêm phí setup không?",
        answer: `Dạ, bên em hỗ trợ setup không thu phí để anh/chị có thể sử dụng nhanh ạ.
`,
      },
      {
        question: "Có chính sách hoàn tiền không?",
        answer: `Dạ, bên em có demo để anh/chị trải nghiệm trước khi quyết định ạ.
Nên mình có thể dùng thử và đánh giá phù hợp rồi mới triển khai chính thức.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Giá hơi cao",
        answer: `Dạ, Mức giá của Nhanh Travel đi kèm với giá trị tự động hoá và tối ưu toàn bộ vận hành doanh nghiệp trong một hệ thống.
Hệ thống giúp giảm công việc cho nhân sự, rút ngắn thời gian xử lý, tiếp cận khách hàng nhanh hơn và kiểm soát chi phí hiệu quả hơn.
Nhờ đó doanh nghiệp tiết kiệm thời gian, giảm chi phí vận hành và tăng doanh thu rõ rệt ạ
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Sao giá cao hơn phần mềm khác?",
        answer: `Dạ, đúng là giá bên em có thể cao hơn một số phần mềm đơn lẻ ạ.
Nhưng Nhanh Travel là hệ thống all-in-one, gom toàn bộ từ sale – điều hành – CRM – kế toán....tất cả trên một nền tảng duy nhất.
Nhiều bên dùng phần mềm rẻ hơn nhưng vẫn phải dùng thêm nhiều phần mềm và file thủ công nên tổng chi phí và công sức thực tế lại cao hơn ạ.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
    ],
  },

  {
    title: "Tour, bán hàng và tài chính",
    parentQuestion: "Hệ thống quản lý tour và bán hàng được gì?",
    parentAnswer: `Dạ, hệ thống hỗ trợ quản lý tour, điều hành, báo giá, thanh toán, công nợ và báo cáo trên cùng một nền tảng.
Doanh nghiệp có thể giảm phụ thuộc Excel, xử lý nhanh hơn và kiểm soát tốt hơn toàn bộ quy trình bán hàng - vận hành.
Điểm mạnh là dữ liệu được liên thông nên hạn chế sai sót và tiết kiệm nhiều thời gian ạ.`,
    items: [
      {
        question: "Hệ thống tour có lịch trình không",
        answer: `Dạ có anh/chị nhé.
Hệ thống cho phép tạo và quản lý lịch trình tour rất chi tiết, dễ chỉnh sửa và biết các tour chuẩn bị khởi hành để gửi cho HDV và tài xế ạ`,
      },
      {
        question: "Hệ thống điều hành có thay thế hoàn toàn Excel không",
        answer: `Dạ, hệ thống có thể thay thế gần như toàn bộ Excel trong vận hành ạ.
Từ sale, điều hành tour, công nợ, báo cáo… tất cả đều xử lý trên một nền tảng duy nhất nên giảm sai sót rất nhiều.`,
      },
      {
        question: "Có kết nối được nhiều cổng thanh toán không",
        answer: `Dạ, hệ thống hỗ trợ kết nối nhiều cổng thanh toán khác nhau ạ.
Giúp khách có thể thanh toán nhanh và tiện hơn.`,
      },
      {
        question: "Phần mềm có API để kết nối trực tiếp với website hiện tại không",
        answer: `Dạ, hệ thống có API để kết nối với website hiện tại của anh/chị ạ.
Bên em có thể hỗ trợ tích hợp để đồng bộ dữ liệu booking và khách hàng.`,
      },
      {
        question: "Có chỉnh giá linh hoạt không?",
        answer: `Dạ có anh/chị nhé.
Hệ thống cho phép điều chỉnh giá theo số lượng khách hoặc từng thời điểm theo giá linh hoạt.`,
      },
      {
        question: "Có thanh toán nhiều lần không?",
        answer: `Dạ có thể hỗ trợ chia nhiều lần thanh toán ạ.`,
      },
      {
        question: "Hệ thống có hỗ trợ chiết tính giá tour hay lập bảng dự toán chi phí không?",
        answer: `Dạ có ạ! Hệ thống bên em tích hợp đầy đủ sản phẩm để mình làm chiết tính tự động cực kỳ chi tiết. phần mềm sẽ tính ra giá vốn cho mỗi khách và lợi nhuận mong muốn. Giúp anh/chị báo giá nhanh chóng cho khách mà không bao giờ lo tính nhầm đâu ạ.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Có quản lý công nợ không?",
        answer: `Dạ có ạ.
Có thể theo dõi công nợ khách và nhà cung cấp rất chi tiết.`,
      },
      {
        question: "Có báo cáo không?",
        answer: `Dạ, hệ thống có báo cáo vô cùng chi tiết, chỉ cần 10 phút anh chị có thể kiểm soát toàn bộ hoạt động.
Giúp anh/chị nắm tình hình kinh doanh nhanh.`,
      },
      {
        question: "Thống kê",
        answer: `Dạ có. Hệ thống hỗ trợ thống kê và báo cáo dữ liệu chi tiết giúp doanh nghiệp theo dõi tình hình kinh doanh và vận hành một cách trực quan.
anh/chị chỉ cần vào 5 báo cáo mỗi ngày 10 phút là nắm hết toàn bộ hoạt động của công ty ạ`,
      },
    ],
  },

  {
    title: "CRM và chăm sóc khách hàng",
    parentQuestion: "CRM và chăm sóc khách hàng ra sao?",
    parentAnswer: `Dạ, Nhanh Travel hỗ trợ doanh nghiệp quản lý tập trung toàn bộ dữ liệu khách hàng và lịch sử làm việc.
Hệ thống giúp theo dõi nguồn khách, hành vi, lịch sử mua tour và tự động chăm sóc qua nhiều kênh.
Nhờ vậy doanh nghiệp giảm thất thoát data và tăng tỷ lệ khách quay lại rõ rệt ạ.`,
    items: [
      {
        question: "Có theo dõi sinh nhật của khách không",
        answer: `Dạ có anh/chị nhé.
Hệ thống lưu thông tin khách và có thể theo dõi ngày sinh nhật.`,
      },
      {
        question: "Có theo dõi khách hàng đến từ nguồn nào không",
        answer: `Dạ, hệ thống có thể ghi nhận khách đến từ nguồn nào ạ.
Giúp anh/chị biết kênh nào đang hiệu quả để tối ưu marketing.`,
      },
      {
        question: "Hệ thống có phân hạng khách hạng không",
        answer: `Dạ có anh/chị nhé.
Hệ thống cho phép phân loại khách theo nhóm để chăm sóc phù hợp hơn.`,
      },
      {
        question: "Có lưu lịch sử khách không?",
        answer: `Dạ, toàn bộ lịch sử làm việc với khách đều được lưu lại ạ.
Giúp mình chăm lại khách rất dễ, không bị mất data như trước.`,
      },
      {
        question: "Có gửi SMS/Zalo/Email không?",
        answer: `Dạ có anh/chị nhé.
Hệ thống hỗ trợ gửi hàng loạt hoặc tự động theo kịch bản.`,
      },
      {
        question: "Hệ thống có form đánh giá của khách hàng không ?",
        answer: `Dạ có ạ, hệ thống có link gửi khách đánh giá sau tour, feedback sẽ tự động đẩy về CSKH để xử lý và chăm sóc lại khách ạ.`,
      },
      {
        question: "Có ghi nhận lại hoạt động không",
        answer: `Dạ, hệ thống có lưu lại toàn bộ lịch sử thao tác của nhân sự ạ.
Giúp anh/chị dễ kiểm soát và truy lại khi cần.`,
      },
    ],
  },

  {
    title: "Quản trị vận hành và nhân sự",
    parentQuestion: "Quản trị vận hành và nhân sự được hỗ trợ gì?",
    parentAnswer: `Dạ, ngoài nghiệp vụ du lịch, hệ thống còn hỗ trợ doanh nghiệp quản trị phân quyền, KPI, chấm công và theo dõi hiệu suất nhân sự.
Mỗi bộ phận có thể làm việc trong đúng phạm vi được cấp quyền, đồng thời dữ liệu vẫn đồng bộ trên toàn hệ thống.
Điều này giúp doanh nghiệp vận hành bài bản và bớt phụ thuộc vào quản lý thủ công ạ.`,
    items: [
      {
        question: "Có phân quyền người dùng không?",
        answer: `Dạ, hệ thống phân quyền theo từng vị trí rất rõ ràng ạ.
Mỗi nhân sự chỉ thấy và thao tác trong phạm vi được cấp quyền.`,
      },
      {
        question: "Hệ thống có đảm bảo bảo mật dữ liệu không?",
        answer: `Dạ, hệ thống bên em có phân quyền theo từng nhân sự nên dữ liệu được kiểm soát rất chặt chẽ ạ.
tài khoản bên em giao là quyền cao nhất anh chị có thể kiểm soát được toàn bộ 
Ngoài ra, Nhanh Travel cam kết không sử dụng dữ liệu khách hàng cho bất kỳ mục đích nào khác trong hợp đồng chi tiết ạ.
Anh/chị có thể yên tâm sử dụng lâu dài.`,
      },
      {
        question: "Quản lý KPI",
        answer: `Dạ có anh/chị nhé.
Hệ thống có thể theo dõi KPI và hiệu suất làm việc của từng phòng ban và nhân sự.`,
      },
      {
        question: "Hệ thống có chức năng chấm công/thời gian làm việc không",
        answer: `Dạ, hệ thống có hỗ trợ chấm công và quản lý thời gian làm việc ạ.`,
      },
      {
        question: "Có dùng chung hệ thống ở chi nhánh khác được không",
        answer: `Dạ, hệ thống hỗ trợ dùng chung cho nhiều chi nhánh ạ.
Anh/chị có thể quản lý tập trung nhưng vẫn phân quyền riêng từng chi nhánh.`,
      },
      {
        question: "Nhân sự không rành công nghệ dùng được không?",
        answer: `Dạ dùng được anh/chị nhé.
Giao diện khá đơn giản và bên em có hướng dẫn chi tiết.`,
      },
      {
        question: "Nhân viên có được đào tạo không?",
        answer: `Dạ có anh/chị nhé.
Bên em sẽ hướng dẫn và hỗ trợ để nhân sự sử dụng được hệ thống một cách dễ dàng.`,
      },
      {
        question: "Có mất nhiều thời gian để làm quen không?",
        answer: `Dạ, hệ thống được thiết kế khá dễ dùng nên thường chỉ mất 1–2 ngày là anh/chị có thể làm quen cơ bản ạ.
Bên em cũng có hướng dẫn và hỗ trợ trong quá trình sử dụng nên mình không cần lo nhé.`,
      },
    ],
  },

  {
    title: "Kỹ thuật, dữ liệu và bảo mật",
    parentQuestion: "Kỹ thuật, dữ liệu và bảo mật thế nào?",
    parentAnswer: `Dạ, hệ thống chạy trên cloud, dữ liệu được kiểm soát chặt chẽ và hỗ trợ sao lưu an toàn.
Doanh nghiệp có thể truy cập ở nhiều nơi, dễ mở rộng nhưng vẫn giữ được tính ổn định khi nhiều người cùng dùng.
Ngoài ra còn hỗ trợ xuất dữ liệu, chuyển đổi dữ liệu và đồng hành kỹ thuật khi cần ạ.`,
    items: [
      {
        question: "Phần mềm chạy trên Cloud hay cài vào máy chủ riêng (on-premise)",
        answer: `Dạ, bên em sử dụng cloud nên anh/chị có thể dùng ở bất kỳ đâu, chỉ cần có internet là truy cập được ạ.
Không cần đầu tư server riêng nên tiết kiệm chi phí và dễ vận hành hơn.`,
      },
      {
        question: "Hệ thống có bị gián đoạn khi nhiều người dùng cùng lúc không?",
        answer: `Dạ, hệ thống được thiết kế để nhiều người dùng cùng lúc mà vẫn hoạt động ổn định.
Thực tế bên em có nhiều doanh nghiệp sử dụng đồng thời mà vẫn xử lý mượt ạ. `,
      },
      {
        question: "Có bị mất dữ liệu không?",
        answer: `Dạ, dữ liệu được lưu trên hệ thống cloud và có backup liên tục nên rất an toàn ạ.
Ngoài ra còn có phân quyền rõ ràng để tránh bị xoá nhầm hoặc truy cập sai.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Hỗ trợ chuyển đổi dữ liệu",
        answer: `Hệ thống bên em có hỗ trợ chuyển đổi dữ liệu từ Excel hoặc phần mềm cũ sang hệ thống mới.
Quá trình này được thực hiện nhanh và chính xác, giúp doanh nghiệp không cần nhập lại từ đầu và đảm bảo dữ liệu được giữ nguyên khi chuyển đổi.`,
      },
      {
        question: "Không dùng nữa thì có thể ngừng dịch vụ không?",
        answer: `Dạ, Nếu doanh nghiệp không sử dụng nữa, có thể chủ động dừng dịch vụ bất kỳ lúc nào.
Trước khi dừng, hệ thống vẫn hỗ trợ xuất toàn bộ dữ liệu để lưu trữ hoặc chuyển đổi, đảm bảo không bị mất dữ liệu.`,
      },
      {
        question: "Tốc độ của hệ thống",
        answer: `Dạ, Hệ thống bên em được tối ưu để chạy nhanh và ổn định, kể cả khi dữ liệu lớn hoặc nhiều người cùng sử dụng.
Thực tế nhiều bên dùng Excel hoặc phần mềm cũ thường bị chậm khi thao tác cùng lúc, nhưng hệ thống cloud bên em xử lý mượt hơn, gần như realtime nên mình yên tâm khi vận hành.`,
      },
      {
        question: "Xuất dữ liệu",
        answer: `Hệ thống bên em cho phép xuất dữ liệu ra file để phục vụ lưu trữ, báo cáo hoặc sử dụng cho mục đích khác.
Dữ liệu có thể xuất linh hoạt theo từng nghiệp vụ, đảm bảo đầy đủ và dễ sử dụng khi cần đối soát.`,
      },
      {
        question: "Thuế VAT",
        answer: `Dạ, hệ thống có hỗ trợ quản lý liên quan tới thuế và báo cáo ạ.
Bên em có thể hướng dẫn chi tiết theo khi sử dụng ạ`,
      },
      {
        question: "Tài liệu hướng dẫn",
        answer: `Hệ thống bên em có đầy đủ tài liệu và hướng dẫn chi tiết để anh/chị dễ dàng sử dụng.
Ngoài ra còn có video hướng dẫn và đội ngũ hỗ trợ trong quá trình vận hành, giúp nhân sự làm quen nhanh và sử dụng hiệu quả.`,
      },
      {
        question: "Lộ trình phát triển sản phẩm",
        answer: `Dạ, hệ thống được cập nhật và phát triển liên tục ạ.
Bên em luôn bổ sung thêm tính năng mới theo nhu cầu thực tế của doanh nghiệp.`,
      },
    ],
  },

  {
    title: "Triển khai, hỗ trợ và mở rộng",
    parentQuestion: "Triển khai, hỗ trợ và mở rộng ra sao?",
    parentAnswer: `Dạ, Nhanh Travel hỗ trợ doanh nghiệp từ lúc setup, chuyển đổi dữ liệu cho tới khi vận hành ổn định.
Đội ngũ đồng hành trong suốt quá trình sử dụng, hỗ trợ xử lý nhanh khi phát sinh vấn đề.
Hệ thống cũng được thiết kế để mở rộng theo quy mô và có thể tích hợp thêm theo nhu cầu thực tế ạ.`,
    items: [
      {
        question: "Triển khai bao lâu?",
        answer: `Dạ, thông thường bên em có thể setup và sử dụng trong vòng 1 buổi ạ.
Đội ngũ sẽ hỗ trợ mình từ lúc tạo dữ liệu cho tới khi vận hành ổn định luôn.`,
      },
      {
        question: "Qui trình triển khai",
        answer: `Dạ, bên em sẽ hỗ trợ từ khâu setup dữ liệu đến khi vận hành ổn định ạ.
Thông thường chỉ khoảng 1 buổi là có thể bắt đầu sử dụng.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Việc hỗ trợ vận hành",
        answer: `Dạ, bên em luôn có đội ngũ hỗ trợ xuyên suốt trong quá trình sử dụng ạ.
Khi có vấn đề có thể xử lý rất nhanh.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Nếu lỗi thì sao?",
        answer: `Dạ, bên em sẽ hỗ trợ xử lý nhanh khi có sự cố ạ.
Đảm bảo không ảnh hưởng lâu tới vận hành của mình.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Có case thực tế không?",
        answer: `Dạ có anh/chị nhé.
Nhiều bên sau khi sử dụng đã giảm được sai sót trong vận hành và quản lý khách hàng tốt hơn, đặc biệt là giữ được khách cũ.
Em có thể chia sẻ demo thực tế để anh/chị thấy rõ cách hệ thống đang vận hành ạ..`,
      },
      {
        question: "Có công ty nào giống tôi đã dùng chưa?",
        answer: `Dạ có anh/chị nhé.
Hiện tại bên em đang triển khai cho nhiều doanh nghiệp du lịch với quy mô khác nhau, từ nhỏ đến lớn.
Nếu anh/chị chia sẻ thêm mô hình bên mình, em có thể tư vấn case gần giống để mình dễ hình dung hơn ạ.`,
      },
      {
        question: "Nếu công ty tôi đang vận hành rồi thì chuyển qua có bị gián đoạn không?",
        answer: `Dạ, bên em sẽ hỗ trợ chuyển đổi dữ liệu và triển khai theo từng bước ạ.
Nên việc chuyển sang hệ thống mới sẽ không ảnh hưởng tới hoạt động hiện tại của mình.`,
      },
      {
        question: "Nếu công ty tôi tăng gấp 2–3 lần thì hệ thống có đáp ứng được không?",
        answer: `Dạ, hệ thống được thiết kế để mở rộng theo quy mô ạ.
Khi công ty phát triển thì vẫn sử dụng được tốt, rất thuận tiện lâu dài.`,
      },
      {
        question: "Có thể tích hợp thêm tính năng riêng không?",
        answer: `Dạ, hệ thống có thể tích hợp thêm hoặc mở rộng theo nhu cầu thực tế ạ.
Bên em sẽ tư vấn để phù hợp với mô hình của anh/chị. 
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Ưu đãi",
        answer: `Dạ, hiện bên em có chương trình tặng 02 tháng khi sử dụng và trải nghiệm demo miễn phí 01 tháng ạ.
Anh/chị có thể yêu cầu Demo trực tiếp và dùng thử trước khi quyết định.
Anh/chị để lại SĐT, bên em hỗ trợ nhanh 1–1 để mình nắm rõ và tiết kiệm thời gian hơn ạ`,
      },
      {
        question: "Có HOTLINE / NGƯỜI THẬT ?",
        answer: `Hệ thống có hỗ trợ hotline và đội ngũ tư vấn trực tiếp.
Anh/chị có thể liên hệ nhanh qua số 0909 991 205 để được hỗ trợ ngay khi cần.
Hoặc có thể để lại số điện thoại, đội ngũ Nhanh Travel sẽ chủ động liên hệ và tư vấn chi tiết.
`,
      },
      {
        question: "Liên hệ khẩn cấp",
        answer: `Dạ, bên em có team kỹ thuật hỗ trợ 24/7 và nhân sự chăm sóc khách hàng đồng hành trong suốt quá trình sử dụng.
hotline 0909991205 ạ`,
      },

      
    ],
  },
];

export const faqData: FaqItem[] = faqGroups.reduce<FaqItem[]>(
  (acc, group) => {
    acc.push({
      question: group.parentQuestion,
      answer: group.parentAnswer,
      isParent: true,
      parentQuestion: group.parentQuestion,
    });

    group.items.forEach((item) => {
      acc.push({
        ...item,
        parentQuestion: group.parentQuestion,
      });
    });

    return acc;
  },
  []
);

export const FAQ_COUNT = faqData.length;