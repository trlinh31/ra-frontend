import type { VisaService } from "@/modules/masterData/visaFastTrack/types/visa-fast-track.type";

let _items: VisaService[] = [
  {
    id: "i1",
    provider: "SB Tân Sơn Nhất",
    country: "Vietnam",
    city: "Phu Nhuan",
    // code: "FT01",
    services: [
      {
        group: "Đón",
        serviceName: "Đón FT",
        price: 20,
        priceUnit: "USD",
        description: "Đón khách ở visa on arrival line ưu tiên dành cho các công ty đăn ký đón",
        pickupLocation: "Visa on arrival",
      },
      {
        group: "Đón",
        serviceName: "ĐÓN VIP B",
        price: 100,
        priceUnit: "USD",
        description: "Đón khách ở visa on arrival nhập cảnh ưu tiên qua bục, Hộ chiếu trả sau bục nhập cảnh",
        pickupLocation: "Visa on arrival",
      },
      {
        group: "Tiễn",
        serviceName: "Tiễn fastrack",
        price: 100,
        priceUnit: "USD",
        description: "Qua Immigration nhanh sau khi check in hàng không xong",
        pickupLocation: "Đón khách quầy E-F",
      },
      {
        group: "Tiễn",
        serviceName: "Tiễn fastrack + SOI CHIẾU",
        price: 100,
        priceUnit: "USD",
        description: "Qua Immigration + soi chiếu nhanh sau khi check in hàng không xong",
        pickupLocation: "Đón khách quầy E-F",
      },
      {
        group: "Tiễn",
        serviceName: "TIỄN VIP B",
        price: 100,
        priceUnit: "USD",
        description: "Qua Immigration VIP B khi check in hàng không xong",
        pickupLocation: "Đón khách quầy E-F",
      },
      {
        group: "Tiễn",
        serviceName: "TIỄN VIP B + SOI CHIẾU",
        price: 100,
        priceUnit: "USD",
        description: "Qua Immigration + Soi chiếu VIP B khi check in hàng không xong, HC trả sau bục nhập cảnh",
        pickupLocation: "Đón khách quầy E-F",
      },
      {
        group: "Dịch vụ thêm",
        serviceName: "Đón ống lồng ",
        price: 100,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },
       {
        group: "Dịch vụ thêm",
        serviceName: "Lấy hành lý",
        price: 100,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },
       {
        group: "Dịch vụ thêm",
        serviceName: "Hành lý + đưa ra ngoài",
        price: 100,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },
      {
        group: "Dịch vụ thêm",
        serviceName: "Tiễn đón sảnh",
        price: 100,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      }
    ],
  },
   {
    id: "nb",
    provider: "SB Nội Bài",
    country: "Vietnam",
    city: "Hà Nội",
    services: [
      // ĐÓN
      {
        group: "Đón",
        serviceName: "Đón FT",
        price: 20,
        priceUnit: "USD",
        description: "Đón khách ở visa on arrival line ưu tiên dành cho các công ty đăng ký đón",
        pickupLocation: "Visa on arrival",
      },
      {
        group: "Đón",
        serviceName: "ĐÓN VIP B",
        price: 100,
        priceUnit: "USD",
        description: "Đón khách ở visa on arrival nhập cảnh ưu tiên qua bục, Hộ chiếu trả sau bục nhập cảnh",
        pickupLocation: "Visa on arrival",
      },

      // TIỄN
      {
        group: "Tiễn",
        serviceName: "Tiễn fasttrack",
        price: 50,
        priceUnit: "USD",
        description: "Qua Immigration nhanh sau khi check in hàng không xong",
        pickupLocation: "Check-in counter",
      },
      {
        group: "Tiễn",
        serviceName: "Tiễn fasttrack + SOI CHIẾU",
        price: 80,
        priceUnit: "USD",
        description: "Qua Immigration + soi chiếu nhanh sau khi check in hàng không xong",
        pickupLocation: "Check-in counter",
      },

      // DỊCH VỤ THÊM
      {
        group: "Dịch vụ thêm",
        serviceName: "Lấy hành lý",
        price: 30,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },
      {
        group: "Dịch vụ thêm",
        serviceName: "Hành lý + đưa ra ngoài",
        price: 50,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },

      // COMBO TIỄN
      {
        group: "Tiễn",
        serviceName: "Tiễn check in nhanh + qua im nhanh + soi chiếu nhanh",
        price: 120,
        priceUnit: "USD",
        description: "TIỄN MÀ MUỐN TẤT CẢ HÃNG HÀNG KHÔNG CHECK IN Nhanh",
        pickupLocation: "Check-in counter",
      },
    ],
  },

  {
    id: "dn",
    provider: "SB Đà Nẵng",
    country: "Vietnam",
    city: "Đà Nẵng",
    services: [
      // ĐÓN
      {
        group: "Đón",
        serviceName: "Đón FT",
        price: 20,
        priceUnit: "USD",
        description: "Đón khách ở visa on arrival line ưu tiên dành cho các công ty đăng ký đón",
        pickupLocation: "Visa on arrival",
      },
      {
        group: "Đón",
        serviceName: "ĐÓN VIP B",
        price: 100,
        priceUnit: "USD",
        description: "Đón khách ở visa on arrival nhập cảnh ưu tiên qua bục, Hộ chiếu trả sau bục nhập cảnh",
        pickupLocation: "Visa on arrival",
      },

      // TIỄN
      {
        group: "Tiễn",
        serviceName: "Tiễn fasttrack",
        price: 50,
        priceUnit: "USD",
        description: "Qua Immigration nhanh sau khi check in hàng không xong",
        pickupLocation: "Check-in",
      },
      {
        group: "Tiễn",
        serviceName: "Tiễn fasttrack + SOI CHIẾU",
        price: 80,
        priceUnit: "USD",
        description: "Qua Immigration + soi chiếu nhanh sau khi check in hàng không xong",
        pickupLocation: "Check-in",
      },

      // DỊCH VỤ THÊM
      {
        group: "Dịch vụ thêm",
        serviceName: "Lấy hành lý",
        price: 30,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },
      {
        group: "Dịch vụ thêm",
        serviceName: "Hành lý + đưa ra ngoài",
        price: 50,
        priceUnit: "USD",
        description: "",
        pickupLocation: "",
      },

      // COMBO
      {
        group: "Tiễn",
        serviceName: "Tiễn check in nhanh + qua im nhanh + soi chiếu nhanh",
        price: 120,
        priceUnit: "USD",
        description: "TIỄN MÀ MUỐN TẤT CẢ HÃNG HÀNG KHÔNG CHECK IN Nhanh",
        pickupLocation: "Check-in",
      },
    ],
  }
];

export const visaFastTrackMockStore = {
  getAll: (): VisaService[] => [..._items],
  getItemById: (id: string) => _items.find((i) => i.id === id),
  create: (data: Omit<VisaService, "id">): VisaService => {
    const item: VisaService = { ...data, id: `i${Date.now()}` };
    _items = [..._items, item];
    return item;
  },
  update: (id: string, data: Omit<VisaService, "id">): VisaService => {
    const item: VisaService = { ...data, id };
    _items = _items.map((x) => (x.id === id ? item : x));
    return item;
  },
  delete: (id: string): void => {
    _items = _items.filter((i) => i.id !== id);
  },
};
