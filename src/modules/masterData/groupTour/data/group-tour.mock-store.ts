import type { GroupTour } from "../types/group-tour.type";

let _tours: GroupTour[] = [
  {
    id: "1",
    code: "GT001",
    tourName: "Tour Hà Nội - Hạ Long 3N2Đ",
    country: "Vietnam",
    city: "Hanoi",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    content: `<h1>Lịch trình Tour Hà Nội - Hạ Long 3 ngày 2 đêm</h1>
<h2>Ngày 1: Hà Nội - Vịnh Hạ Long</h2>
<ul>
  <li><strong>07:00</strong> - Xe đón khách tại điểm tập kết Hà Nội, khởi hành đi Hạ Long.</li>
  <li><strong>11:30</strong> - Nhận phòng khách sạn, nghỉ ngơi.</li>
  <li><strong>14:00</strong> - Tham quan hang Sửng Sốt, leo núi Bài Thơ.</li>
  <li><strong>18:00</strong> - Thưởng thức hải sản tươi tại nhà hàng ven biển.</li>
  <li><strong>20:00</strong> - Tự do khám phá phố đêm Hạ Long.</li>
</ul>
<h2>Ngày 2: Vịnh Hạ Long - Du thuyền</h2>
<ul>
  <li><strong>06:00</strong> - Ăn sáng, lên du thuyền khám phá vịnh.</li>
  <li><strong>08:30</strong> - Chèo kayak qua hang Luồn, tham quan làng chài nổi.</li>
  <li><strong>12:00</strong> - Ăn trưa trên du thuyền với thực đơn hải sản.</li>
  <li><strong>14:00</strong> - Tắm biển tại bãi Ti Tốp, chụp ảnh toàn vịnh.</li>
  <li><strong>17:00</strong> - Trở về bờ, nhận phòng, nghỉ ngơi.</li>
  <li><strong>19:00</strong> - Ăn tối tại nhà hàng Cung Đình Hạ Long.</li>
</ul>
<h2>Ngày 3: Hạ Long - Hà Nội</h2>
<ul>
  <li><strong>07:00</strong> - Ăn sáng, trả phòng khách sạn.</li>
  <li><strong>08:30</strong> - Tham quan Bảo tàng Quảng Ninh.</li>
  <li><strong>10:00</strong> - Mua sắm đặc sản: chả mực, mực khô, ngọc trai.</li>
  <li><strong>11:30</strong> - Lên xe trở về Hà Nội.</li>
  <li><strong>16:00</strong> - Về đến Hà Nội, kết thúc chương trình.</li>
</ul>`,
    pricingPeriods: [
      {
        id: "gt1-p1",
        label: "Mùa thường",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-06-30",
            dayGroups: [
              { id: "gt1-dg1", label: "T2 - T6", days: [1, 2, 3, 4, 5], price: 4500000 },
              { id: "gt1-dg2", label: "Cuối tuần", days: [6, 0], price: 5500000 },
            ],
          },
        ],
      },
      {
        id: "gt1-p2",
        label: "Mùa cao điểm",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-07-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "gt1-dg3", label: "T2 - T6", days: [1, 2, 3, 4, 5], price: 5800000 },
              { id: "gt1-dg4", label: "Cuối tuần", days: [6, 0], price: 7000000 },
            ],
          },
        ],
      },
    ],
    notes: "Bao gồm xe đưa đón, khách sạn 3 sao, ăn sáng và 2 bữa chính mỗi ngày.",
    isActive: true,
  },
  {
    id: "2",
    code: "GT002",
    tourName: "Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ",
    country: "Vietnam",
    city: "Da Nang",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    content: `<h1>Lịch trình Tour Đà Nẵng - Hội An - Bà Nà Hills 4 ngày 3 đêm</h1>
<h2>Ngày 1: Đến Đà Nẵng</h2>
<ul>
  <li><strong>09:00</strong> - Đón khách tại sân bay Đà Nẵng.</li>
  <li><strong>10:30</strong> - Nhận phòng khách sạn ven biển Mỹ Khê.</li>
  <li><strong>14:00</strong> - Tham quan Bảo tàng Chăm, cầu Rồng.</li>
  <li><strong>17:30</strong> - Ngắm hoàng hôn tại bãi biển Mỹ Khê.</li>
  <li><strong>19:00</strong> - Ăn tối, thưởng thức đặc sản Đà Nẵng: mì Quảng, bánh tráng cuốn thịt heo.</li>
</ul>
<h2>Ngày 2: Bà Nà Hills</h2>
<ul>
  <li><strong>07:30</strong> - Ăn sáng, di chuyển đến Bà Nà Hills.</li>
  <li><strong>08:30</strong> - Lên cáp treo (kỷ lục thế giới), khám phá làng Pháp cổ kính.</li>
  <li><strong>10:00</strong> - Chụp ảnh tại Cầu Vàng nổi tiếng.</li>
  <li><strong>12:00</strong> - Ăn trưa buffet tại nhà hàng trên đỉnh núi.</li>
  <li><strong>14:00</strong> - Vui chơi tại Fantasy Park, khu trò chơi trong nhà.</li>
  <li><strong>17:00</strong> - Xuống núi, về khách sạn nghỉ ngơi.</li>
</ul>
<h2>Ngày 3: Hội An Cổ Trấn</h2>
<ul>
  <li><strong>08:00</strong> - Di chuyển đến Hội An (30 phút).</li>
  <li><strong>09:00</strong> - Tham quan phố cổ: Chùa Cầu, Hội quán Phúc Kiến, nhà cổ Tấn Ký.</li>
  <li><strong>11:30</strong> - Học làm đèn lồng truyền thống và nấu ăn Hội An.</li>
  <li><strong>13:00</strong> - Ăn trưa với cao lầu, cơm gà Hội An, bánh mì Phượng.</li>
  <li><strong>15:00</strong> - Thả đèn lồng trên sông Hoài.</li>
  <li><strong>17:30</strong> - Trở về Đà Nẵng.</li>
</ul>
<h2>Ngày 4: Ngũ Hành Sơn - Về</h2>
<ul>
  <li><strong>08:00</strong> - Tham quan Ngũ Hành Sơn, động Huyền Không.</li>
  <li><strong>10:30</strong> - Mua sắm đồ đá mỹ nghệ.</li>
  <li><strong>12:00</strong> - Ăn trưa, trả phòng.</li>
  <li><strong>14:00</strong> - Tiễn khách tại sân bay Đà Nẵng, kết thúc hành trình.</li>
</ul>`,
    pricingPeriods: [
      {
        id: "gt2-p1",
        label: "Mùa thường",
        currency: "VND",
        dateRanges: [
          {
            from: "2026-01-01",
            to: "2026-12-31",
            dayGroups: [
              { id: "gt2-dg1", label: "T2 - T5", days: [1, 2, 3, 4], price: 6800000 },
              { id: "gt2-dg2", label: "T6 - CN", days: [5, 6, 0], price: 8500000 },
            ],
          },
        ],
      },
    ],
    notes: "Bao gồm vé máy bay khứ hồi từ Hà Nội, cáp treo Bà Nà Hills, khách sạn 4 sao.",
    isActive: true,
  },
  {
    id: "3",
    code: "GT003",
    tourName: "Tour Phú Quốc 3N2Đ",
    country: "Vietnam",
    city: "Phu Quoc",
    supplier: "Công ty Du Lịch Sao Việt",
    content: `<h1>Lịch trình Tour Phú Quốc 3 ngày 2 đêm</h1>
<h2>Ngày 1: Khám phá miền Bắc đảo</h2>
<ul>
  <li><strong>09:00</strong> - Đón khách tại sân bay Phú Quốc, nhận phòng resort.</li>
  <li><strong>14:00</strong> - Tham quan Vườn Quốc gia Phú Quốc, thác Tranh.</li>
  <li><strong>16:00</strong> - Thăm làng nuôi cá bố lão, xem trình diễn đánh cá truyền thống.</li>
  <li><strong>19:00</strong> - Ăn tối tại chợ đêm Phú Quốc: gỏi cá trích, nhum biển, bào ngư.</li>
</ul>
<h2>Ngày 2: Tour 4 đảo</h2>
<ul>
  <li><strong>07:30</strong> - Ăn sáng, lên tàu ra 4 đảo.</li>
  <li><strong>09:00</strong> - Lặn ngắm san hô tại hòn Móng Tay.</li>
  <li><strong>11:00</strong> - Câu cá, tắm biển tại hòn Gầm Ghì.</li>
  <li><strong>12:30</strong> - Ăn trưa hải sản trên tàu hoặc đảo nổi.</li>
  <li><strong>14:00</strong> - Tham quan hòn Thơm, cáp treo vượt biển dài nhất thế giới.</li>
  <li><strong>17:00</strong> - Trở về, nghỉ ngơi tại resort.</li>
  <li><strong>20:00</strong> - Tiệc BBQ hải sản trên bãi biển.</li>
</ul>
<h2>Ngày 3: Miền Nam đảo - Về</h2>
<ul>
  <li><strong>08:00</strong> - Tham quan nhà thùng nước mắm Phú Quốc.</li>
  <li><strong>09:30</strong> - Thăm trại nuôi ngọc trai, mua sắm trang sức.</li>
  <li><strong>11:00</strong> - Tắm biển Bãi Sao - top 10 bãi biển đẹp nhất châu Á.</li>
  <li><strong>13:00</strong> - Ăn trưa, trả phòng.</li>
  <li><strong>15:00</strong> - Ra sân bay, kết thúc chương trình.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm vé tàu 4 đảo, lặn ngắm san hô, BBQ hải sản, resort 4 sao.",
    isActive: true,
  },
  {
    id: "4",
    code: "GT004",
    tourName: "Tour Sapa - Fansipan 3N2Đ",
    country: "Vietnam",
    city: "Lao Cai",
    supplier: "Công ty Du Lịch Sao Việt",
    content: `<h1>Lịch trình Tour Sapa - Fansipan 3 ngày 2 đêm</h1>
<h2>Ngày 1: Hà Nội - Sapa</h2>
<ul>
  <li><strong>21:00</strong> - Xuất phát từ Hà Nội bằng tàu hỏa giường nằm đi Lào Cai.</li>
</ul>
<h2>Ngày 2: Sapa - Bản Cát Cát - Fansipan</h2>
<ul>
  <li><strong>06:00</strong> - Đến ga Lào Cai, xe đón lên Sapa, ăn sáng và nhận phòng.</li>
  <li><strong>08:30</strong> - Tham quan bản Cát Cát của người H'Mông đen.</li>
  <li><strong>10:00</strong> - Chinh phục đỉnh Fansipan bằng cáp treo, chụp ảnh tại "nóc nhà Đông Dương" (3.143m).</li>
  <li><strong>13:00</strong> - Ăn trưa với đặc sản Sapa: thịt lợn cắp nách, cá hồi, rau rừng.</li>
  <li><strong>15:00</strong> - Dạo phố Sapa, mua sắm thổ cẩm, đồ lưu niệm.</li>
  <li><strong>19:00</strong> - Ăn tối, giao lưu văn nghệ với bà con dân tộc.</li>
</ul>
<h2>Ngày 3: Bản Lao Chải - Y Tý - Về Hà Nội</h2>
<ul>
  <li><strong>07:00</strong> - Ăn sáng, trekking bản Lao Chải - Tả Van, ngắm ruộng bậc thang mùa lúa chín.</li>
  <li><strong>11:00</strong> - Tham quan thửa ruộng bậc thang Y Tý hùng vĩ.</li>
  <li><strong>13:00</strong> - Ăn trưa, mua đặc sản về làm quà.</li>
  <li><strong>15:00</strong> - Xuống ga Lào Cai, lên tàu trở về Hà Nội.</li>
  <li><strong>21:00</strong> - Đến Hà Nội, kết thúc hành trình.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm tàu hỏa khứ hồi, vé cáp treo Fansipan, khách sạn 3 sao, hướng dẫn viên địa phương.",
    isActive: true,
  },
  {
    id: "5",
    code: "GT005",
    tourName: "Tour Bangkok - Pattaya 5N4Đ",
    country: "Thailand",
    city: "Bangkok",
    supplier: "Công ty TNHH Thiết Bị Du Lịch Ánh Dương",
    content: `<h1>Lịch trình Tour Bangkok - Pattaya 5 ngày 4 đêm</h1>
<h2>Ngày 1: Hà Nội - Bangkok</h2>
<ul>
  <li><strong>06:00</strong> - Tập kết tại sân bay Nội Bài, làm thủ tục.</li>
  <li><strong>08:00</strong> - Bay đến Bangkok (thời gian bay ~1h45).</li>
  <li><strong>11:00</strong> - Nhận phòng khách sạn, ăn trưa.</li>
  <li><strong>14:00</strong> - Tham quan Cung điện Hoàng gia, Chùa Wat Phra Kaew (Chùa Ngọc).</li>
  <li><strong>17:00</strong> - Dạo thuyền trên kênh Chao Phraya, thăm Chùa Bình Minh Wat Arun.</li>
  <li><strong>19:30</strong> - Ăn tối tại nhà hàng nổi trên sông.</li>
</ul>
<h2>Ngày 2: Bangkok City Tour</h2>
<ul>
  <li><strong>08:00</strong> - Ăn sáng, tham quan Chùa Wat Pho - nơi lưu giữ tượng Phật nằm lớn nhất.</li>
  <li><strong>10:00</strong> - Mua sắm tại chợ nổi Damnoen Saduak.</li>
  <li><strong>13:00</strong> - Ăn trưa, tham quan Cầu sông Kwai lịch sử.</li>
  <li><strong>15:30</strong> - Mua sắm tại Chatuchak Weekend Market.</li>
  <li><strong>19:00</strong> - Show ca múa nhạc Thái tại nhà hàng Calypso.</li>
</ul>
<h2>Ngày 3: Bangkok - Pattaya</h2>
<ul>
  <li><strong>08:30</strong> - Di chuyển đến Pattaya (2 giờ).</li>
  <li><strong>11:00</strong> - Tham quan trại cá sấu, biểu diễn xiếc voi.</li>
  <li><strong>14:00</strong> - Tắm biển, tham gia môn thể thao nước: parasailing, jet ski.</li>
  <li><strong>19:00</strong> - Xem show Tiffany - chương trình ca múa nổi tiếng thế giới.</li>
</ul>
<h2>Ngày 4: Đảo san hô Coral Island</h2>
<ul>
  <li><strong>08:00</strong> - Lên tàu cao tốc ra đảo Coral, lặn ngắm san hô.</li>
  <li><strong>12:00</strong> - Ăn trưa hải sản tươi trên đảo.</li>
  <li><strong>14:00</strong> - Tắm biển, chơi dù bay, đi canô.</li>
  <li><strong>17:00</strong> - Trở về Pattaya, mua sắm phố Walking Street.</li>
</ul>
<h2>Ngày 5: Pattaya - Bangkok - Hà Nội</h2>
<ul>
  <li><strong>07:00</strong> - Ăn sáng, trả phòng, di chuyển ra sân bay Bangkok.</li>
  <li><strong>14:00</strong> - Bay về Hà Nội, kết thúc hành trình.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm vé máy bay, khách sạn 4 sao, visa Thái Lan, vé tham quan các điểm, show Tiffany.",
    isActive: true,
  },
  {
    id: "6",
    code: "GT006",
    tourName: "Tour Singapore - Malaysia 6N5Đ",
    country: "Singapore",
    city: "Singapore",
    supplier: "Công ty Du Lịch Quốc Tế Thái Bình Dương",
    content: `<h1>Lịch trình Tour Singapore - Malaysia 6 ngày 5 đêm</h1>
<h2>Ngày 1: Hà Nội - Singapore</h2>
<ul>
  <li><strong>07:00</strong> - Bay từ Hà Nội đến Singapore.</li>
  <li><strong>13:00</strong> - Nhận phòng, ăn trưa tại khu ẩm thực Lau Pa Sat.</li>
  <li><strong>15:00</strong> - Tham quan Gardens by the Bay - rừng cây siêu to khổng lồ.</li>
  <li><strong>20:00</strong> - Chiêm ngưỡng show ánh sáng Garden Rhapsody.</li>
</ul>
<h2>Ngày 2: Singapore City Tour</h2>
<ul>
  <li><strong>09:00</strong> - Tham quan Merlion Park, Esplanade, Marina Bay Sands.</li>
  <li><strong>11:00</strong> - Khám phá khu Little India, Chinatown đa văn hóa.</li>
  <li><strong>14:00</strong> - Mua sắm tại Orchard Road.</li>
  <li><strong>16:00</strong> - Thăm đảo Sentosa, Universal Studios Singapore.</li>
  <li><strong>20:00</strong> - Wings of Time - show laser và pháo hoa ngoài trời.</li>
</ul>
<h2>Ngày 3: Singapore - Kuala Lumpur</h2>
<ul>
  <li><strong>08:00</strong> - Di chuyển đến Kuala Lumpur bằng xe coach (5 giờ).</li>
  <li><strong>14:00</strong> - Nhận phòng, tham quan Tháp Đôi Petronas.</li>
  <li><strong>16:00</strong> - Thăm KL Tower, ngắm toàn cảnh thành phố.</li>
  <li><strong>19:00</strong> - Ăn tối tại phố ẩm thực Jalan Alor.</li>
</ul>
<h2>Ngày 4: Kuala Lumpur - Genting Highland</h2>
<ul>
  <li><strong>09:00</strong> - Lên cáp treo lên Genting Highlands (1.800m).</li>
  <li><strong>10:00</strong> - Tham quan casino, công viên giải trí Skytropolis.</li>
  <li><strong>15:00</strong> - Trở xuống KL, mua sắm tại Pavilion Mall.</li>
</ul>
<h2>Ngày 5: Malacca - Thành phố cổ</h2>
<ul>
  <li><strong>08:00</strong> - Di chuyển đến Malacca (2 giờ).</li>
  <li><strong>10:00</strong> - Tham quan Stadthuys, pháo đài A Famosa, Chùa Cheng Hoon Teng.</li>
  <li><strong>13:00</strong> - Ăn trưa đặc sản Malacca: cơm Hainanese, laksa đỏ.</li>
  <li><strong>15:00</strong> - Đi thuyền sông Malacca, thăm Jonker Street.</li>
  <li><strong>18:00</strong> - Trở về KL.</li>
</ul>
<h2>Ngày 6: Kuala Lumpur - Hà Nội</h2>
<ul>
  <li><strong>09:00</strong> - Mua sắm tự do, ăn sáng.</li>
  <li><strong>12:00</strong> - Ra sân bay KLIA, bay về Hà Nội.</li>
  <li><strong>18:00</strong> - Về đến Hà Nội, kết thúc hành trình.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm vé máy bay, visa Malaysia, khách sạn 4 sao, xe coach Singapore-KL, vé Universal Studios.",
    isActive: true,
  },
  {
    id: "7",
    code: "GT007",
    tourName: "Tour Nhật Bản Tokyo - Osaka - Kyoto 7N6Đ",
    country: "Japan",
    city: "Tokyo",
    supplier: "Công ty Du Lịch Quốc Tế Thái Bình Dương",
    content: `<h1>Lịch trình Tour Nhật Bản 7 ngày 6 đêm</h1>
<h2>Ngày 1: Hà Nội - Tokyo</h2>
<ul>
  <li><strong>09:00</strong> - Bay từ Hà Nội đến Tokyo Narita (~6 giờ).</li>
  <li><strong>17:00</strong> - Nhận phòng, dạo phố Akihabara - thiên đường đồ điện tử và anime.</li>
</ul>
<h2>Ngày 2: Tokyo City Tour</h2>
<ul>
  <li><strong>08:00</strong> - Tham quan đền Sensoji (Asakusa), chợ Nakamise.</li>
  <li><strong>10:30</strong> - Shibuya Crossing - giao lộ đông đúc nhất thế giới.</li>
  <li><strong>13:00</strong> - Ăn trưa ramen truyền thống.</li>
  <li><strong>14:30</strong> - Harajuku - thời trang đường phố Nhật Bản.</li>
  <li><strong>16:00</strong> - Shinjuku - mua sắm và ẩm thực đêm.</li>
</ul>
<h2>Ngày 3: Tokyo - Núi Phú Sĩ</h2>
<ul>
  <li><strong>07:30</strong> - Xe đưa đến hồ Kawaguchiko (2 giờ), ngắm Phú Sĩ phản chiếu.</li>
  <li><strong>10:00</strong> - Lên ga thứ 5 núi Phú Sĩ (2.300m), chụp ảnh, mua sắm.</li>
  <li><strong>13:00</strong> - Ăn trưa, trải nghiệm mặc kimono truyền thống.</li>
  <li><strong>15:00</strong> - Onsen tắm suối nước nóng với view Phú Sĩ.</li>
</ul>
<h2>Ngày 4: Tokyo - Osaka (Shinkansen)</h2>
<ul>
  <li><strong>08:00</strong> - Di chuyển ga Tokyo, lên tàu Shinkansen siêu tốc đến Osaka.</li>
  <li><strong>10:30</strong> - Nhận phòng, tham quan Dotonbori - phố ẩm thực nổi tiếng.</li>
  <li><strong>14:00</strong> - Osaka Castle - lâu đài biểu tượng Nhật Bản.</li>
  <li><strong>19:00</strong> - Ăn tối: takoyaki, okonomiyaki, kushikatsu.</li>
</ul>
<h2>Ngày 5: Kyoto - Cố đô nghìn năm</h2>
<ul>
  <li><strong>08:00</strong> - Đến Kyoto (30 phút), tham quan Chùa Vàng Kinkakuji.</li>
  <li><strong>10:00</strong> - Rừng trúc Arashiyama, đền Tenryuji.</li>
  <li><strong>13:00</strong> - Ăn trưa kaiseki - ẩm thực truyền thống Kyoto.</li>
  <li><strong>15:00</strong> - Fushimi Inari - hàng nghìn cổng torii đỏ.</li>
  <li><strong>17:00</strong> - Phố cổ Gion - nơi geisha dạo bước.</li>
</ul>
<h2>Ngày 6: Nara - Osaka</h2>
<ul>
  <li><strong>08:30</strong> - Tham quan Nara: cho hươu ăn, đền Todaiji (Đại Phật).</li>
  <li><strong>13:00</strong> - Trở về Osaka, mua sắm tại Shinsaibashi, Den Den Town.</li>
  <li><strong>19:00</strong> - Tiệc chia tay tại nhà hàng Nhật.</li>
</ul>
<h2>Ngày 7: Osaka - Hà Nội</h2>
<ul>
  <li><strong>09:00</strong> - Trả phòng, ra sân bay Kansai.</li>
  <li><strong>12:00</strong> - Bay về Hà Nội, kết thúc hành trình đáng nhớ.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm vé máy bay, vé Shinkansen, khách sạn 4 sao, onsen, bữa ăn theo lịch trình, hướng dẫn viên tiếng Việt.",
    isActive: true,
  },
  {
    id: "8",
    code: "GT008",
    tourName: "Tour Hồ Chí Minh - Mũi Né 3N2Đ",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    supplier: "Công ty Du Lịch Sao Việt",
    content: `<h1>Lịch trình Tour HCM - Mũi Né 3 ngày 2 đêm</h1>
<h2>Ngày 1: HCM - Mũi Né</h2>
<ul>
  <li><strong>06:00</strong> - Xe đón tại HCM, khởi hành đi Mũi Né.</li>
  <li><strong>10:00</strong> - Đến Mũi Né, nhận phòng resort.</li>
  <li><strong>11:00</strong> - Tham quan Tháp Chàm Pôhanagar (tháp Chàm ngàn năm tuổi).</li>
  <li><strong>13:00</strong> - Ăn trưa hải sản Mũi Né.</li>
  <li><strong>15:00</strong> - Tắm biển, trải nghiệm lướt ván diều (kite surf) tại bãi biển Mũi Né.</li>
  <li><strong>19:00</strong> - Ăn tối với bánh căn, mực nướng, gỏi cá mai.</li>
</ul>
<h2>Ngày 2: Đồi cát - Suối Tiên</h2>
<ul>
  <li><strong>05:00</strong> - Wake-up tour: xe jeep leo đồi cát đỏ, đồi cát trắng ngắm bình minh.</li>
  <li><strong>08:00</strong> - Ăn sáng, trải nghiệm trượt cát bằng ván nhựa.</li>
  <li><strong>10:00</strong> - Suối Tiên - dòng suối đỏ kỳ lạ giữa lòng đồi cát trắng.</li>
  <li><strong>13:00</strong> - Ăn trưa, nghỉ ngơi tại resort.</li>
  <li><strong>15:00</strong> - Thuê xe máy, tự do khám phá làng chài, mua hải sản khô.</li>
  <li><strong>20:00</strong> - BBQ hải sản tại bãi biển, ngắm sao đêm.</li>
</ul>
<h2>Ngày 3: Mũi Né - HCM</h2>
<ul>
  <li><strong>07:30</strong> - Ăn sáng, tham quan làng chài truyền thống, cảng cá sầm uất.</li>
  <li><strong>10:00</strong> - Mua đặc sản: mắm, khô mực, hải sản.</li>
  <li><strong>11:00</strong> - Trả phòng, lên xe trở về HCM.</li>
  <li><strong>16:00</strong> - Về đến HCM, kết thúc tour.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm xe đưa đón, resort 3 sao ven biển, BBQ hải sản, tour jeep đồi cát.",
    isActive: true,
  },
  {
    id: "9",
    code: "GT009",
    tourName: "Tour Paris - Rome - Barcelona 10N9Đ",
    country: "France",
    city: "Paris",
    supplier: "Công ty Du Lịch Quốc Tế Thái Bình Dương",
    content: `<h1>Lịch trình Tour Châu Âu 3 quốc gia 10 ngày 9 đêm</h1>
<h2>Ngày 1-2: Paris - Kinh đô Ánh Sáng</h2>
<ul>
  <li>Bay từ Hà Nội đến Paris, nhận phòng khách sạn trung tâm.</li>
  <li>Tham quan <strong>Tháp Eiffel</strong>, lên đỉnh ngắm Paris từ trên cao.</li>
  <li>Bảo tàng Louvre - chiêm ngưỡng nàng Mona Lisa và tượng thần Vệ nữ.</li>
  <li>Đại lộ Champs-Élysées, Khải Hoàn Môn.</li>
  <li>Nhà thờ Đức Bà Paris, khu phố cổ Marais.</li>
  <li>Mua sắm tại Galeries Lafayette, Chanel, Louis Vuitton.</li>
</ul>
<h2>Ngày 3-4: Rome - Thành Roma Vĩnh Cửu</h2>
<ul>
  <li>Bay đến Rome, tham quan <strong>Đấu trường La Mã Colosseum</strong>.</li>
  <li>Khải Hoàn Môn Titus, Quảng trường La Mã Forum Romanum.</li>
  <li>Vatican City: Đền thờ Thánh Peter, Nhà nguyện Sistine (tranh vẽ của Michelangelo).</li>
  <li>Đài phun nước Trevi - ném xu cầu may.</li>
  <li>Quảng trường Tây Ban Nha, phố mua sắm Via Condotti.</li>
  <li>Thưởng thức pasta, pizza trứ danh, gelato kem Ý.</li>
</ul>
<h2>Ngày 5-6: Florence - Tuscany</h2>
<ul>
  <li>Bảo tàng Uffizi - tranh của Botticelli, Michelangelo.</li>
  <li>Cầu Vecchio - cây cầu vàng bạc đá quý.</li>
  <li>Tham quan vùng nông thôn Tuscany, thăm vườn nho sản xuất rượu Chianti.</li>
  <li>Trải nghiệm lớp học làm pasta, tiramisu với đầu bếp người Ý.</li>
</ul>
<h2>Ngày 7-9: Barcelona - Thành phố nghệ thuật</h2>
<ul>
  <li>Bay đến Barcelona, tham quan <strong>Sagrada Família</strong> của Gaudí.</li>
  <li>Công viên Güell - kiến trúc kỳ diệu giữa thiên nhiên.</li>
  <li>Phố đi bộ La Rambla, chợ La Boqueria đầy màu sắc.</li>
  <li>Bãi biển Barceloneta, thưởng thức paella hải sản.</li>
  <li>Khu phố Gothic, tham quan Cung điện Hoàng gia.</li>
  <li>Show Flamenco - điệu nhảy truyền thống đam mê của người Tây Ban Nha.</li>
</ul>
<h2>Ngày 10: Barcelona - Hà Nội</h2>
<ul>
  <li>Mua sắm đặc sản: socola, rượu vang, túi da, nước hoa.</li>
  <li>Ra sân bay bay về Hà Nội, kết thúc hành trình châu Âu đáng nhớ.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm vé máy bay, visa Schengen, khách sạn 4 sao, xe coach liên tỉnh, hướng dẫn viên tiếng Việt xuyên suốt.",
    isActive: true,
  },
  {
    id: "10",
    code: "GT010",
    tourName: "Tour Nha Trang - Đà Lạt 5N4Đ",
    country: "Vietnam",
    city: "Nha Trang",
    supplier: "Công ty Du Lịch Sao Việt",
    content: `<h1>Lịch trình Tour Nha Trang - Đà Lạt 5 ngày 4 đêm</h1>
<h2>Ngày 1: Đến Nha Trang</h2>
<ul>
  <li><strong>09:00</strong> - Đón khách sân bay Cam Ranh, nhận phòng khách sạn biển.</li>
  <li><strong>14:00</strong> - Tham quan Tháp Bà Ponagar (di tích Chăm nghìn năm).</li>
  <li><strong>16:00</strong> - Tắm biển Nha Trang, thư giãn.</li>
  <li><strong>19:00</strong> - Khám phá phố ẩm thực đêm: bánh căn, nem nướng Nha Trang.</li>
</ul>
<h2>Ngày 2: Tour 4 đảo Nha Trang</h2>
<ul>
  <li><strong>08:00</strong> - Tàu ra 4 đảo: Hòn Mun, Hòn Tằm, Hòn Miễu, Hòn Một.</li>
  <li><strong>09:30</strong> - Lặn biển ngắm san hô Hòn Mun (khu bảo tồn biển).</li>
  <li><strong>12:00</strong> - Ăn trưa nổi trên thúng chai + party nhảy xuống biển.</li>
  <li><strong>14:00</strong> - Tắm bùn khoáng chất Hòn Tằm.</li>
  <li><strong>17:00</strong> - Về bờ, nghỉ ngơi.</li>
</ul>
<h2>Ngày 3: Nha Trang - Đà Lạt</h2>
<ul>
  <li><strong>08:00</strong> - Di chuyển lên Đà Lạt (3.5 giờ qua đèo Khánh Lê hùng vĩ).</li>
  <li><strong>12:00</strong> - Nhận phòng, ăn trưa.</li>
  <li><strong>14:00</strong> - Tham quan Thung lũng Tình Yêu, hồ Than Thở.</li>
  <li><strong>16:00</strong> - Chèo thuyền kayak hồ Tuyền Lâm.</li>
  <li><strong>19:00</strong> - Dạo chợ Đêm Đà Lạt, thưởng thức bánh tráng nướng, sữa đậu nành.</li>
</ul>
<h2>Ngày 4: Đà Lạt - Thành phố ngàn hoa</h2>
<ul>
  <li><strong>08:00</strong> - Tham quan vườn dâu tây, hái và thưởng thức tại chỗ.</li>
  <li><strong>10:00</strong> - Nhà thờ Con Gà, Ga Đà Lạt (di sản kiến trúc Pháp).</li>
  <li><strong>13:00</strong> - Ăn trưa với đặc sản: lẩu bò, bánh mì xíu phá lấu.</li>
  <li><strong>15:00</strong> - Vườn hoa Đà Lạt, Langbiang - nóc nhà Nam Tây Nguyên.</li>
  <li><strong>19:00</strong> - Ăn tối tại nhà hàng view toàn thành phố.</li>
</ul>
<h2>Ngày 5: Đà Lạt - Về</h2>
<ul>
  <li><strong>08:00</strong> - Tham quan làng cà phê, thưởng thức cà phê Đà Lạt chính hiệu.</li>
  <li><strong>10:00</strong> - Mua đặc sản: atisô, mứt hoa quả, cà phê, rượu vang Đà Lạt.</li>
  <li><strong>12:00</strong> - Ra sân bay Liên Khương, kết thúc tour.</li>
</ul>`,
    pricingPeriods: [],
    notes: "Bao gồm vé máy bay, lặn biển Hòn Mun, tắm bùn, khách sạn 3-4 sao, 2 bữa chính mỗi ngày.",
    isActive: true,
  },
];

export const groupTourMockStore = {
  getAll: (): GroupTour[] => [..._tours],
  getById: (id: string) => _tours.find((t) => t.id === id),
  create: (data: Omit<GroupTour, "id">): GroupTour => {
    const tour: GroupTour = { ...data, id: String(Date.now()) };
    _tours = [..._tours, tour];
    return tour;
  },
  update: (id: string, data: Omit<GroupTour, "id">): GroupTour => {
    const tour: GroupTour = { ...data, id };
    _tours = _tours.map((t) => (t.id === id ? tour : t));
    return tour;
  },
  delete: (id: string): void => {
    _tours = _tours.filter((t) => t.id !== id);
  },
};
