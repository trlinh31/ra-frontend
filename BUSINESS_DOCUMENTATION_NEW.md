# TÀI LIỆU NGHIỆP VỤ HỆ THỐNG RA TRAVEL

> **Phiên bản:** 1.3  
> **Ngày tạo:** 21/04/2026  
> **Cập nhật lần cuối:** 22/04/2026  
> **Trạng thái:** Draft (UI đang phát triển, chưa tích hợp backend thực)

**Lịch sử thay đổi:**

| Phiên bản | Ngày       | Người cập nhật | Nội dung thay đổi                                                                   |
| --------- | ---------- | -------------- | ----------------------------------------------------------------------------------- |
| 1.2       | 21/04/2026 | —              | Phiên bản gốc                                                                       |
| 1.3       | 22/04/2026 | —              | Bổ sung quy trình Báo giá; cập nhật vòng đời ConfirmedTour; thêm quy trình Hủy tour |

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Các chức năng chính](#2-các-chức-năng-chính)
3. [Quy trình nghiệp vụ](#3-quy-trình-nghiệp-vụ)
4. [Vai trò trong hệ thống](#4-vai-trò-trong-hệ-thống)
5. [Các thực thể dữ liệu chính](#5-các-thực-thể-dữ-liệu-chính)
6. [API](#6-api)
7. [Quy tắc nghiệp vụ](#7-quy-tắc-nghiệp-vụ)
8. [Xử lý lỗi & ngoại lệ](#8-xử-lý-lỗi--ngoại-lệ)
9. [Ghi chú & giả định](#9-ghi-chú--giả-định)

---

## 1. Tổng quan hệ thống

### 1.1 Mục đích hệ thống

**RA Travel** là hệ thống quản lý nghiệp vụ dành cho công ty du lịch, hỗ trợ toàn bộ quy trình xây dựng và quản lý tour du lịch — từ dữ liệu nền (nhà cung cấp, khách sạn, nhà hàng, chuyến bay...) đến việc tổng hợp thành các tour hoàn chỉnh kèm tính toán chi phí tự động.

### 1.2 Bài toán giải quyết

- Quản lý tập trung dữ liệu các nhà cung cấp dịch vụ du lịch (khách sạn, nhà hàng, vận chuyển, visa, chuyến bay, phí tham quan...)
- Xây dựng lịch trình tour theo từng ngày, ghép nối các dịch vụ có sẵn
- Tính toán tự động chi phí tour theo số lượng người tham gia, đa tiền tệ
- Quản lý bảng giá phức tạp theo giai đoạn thời gian, ngày trong tuần và loại phòng/hạng vé
- Tạo và gửi báo giá tour cho khách hàng, theo dõi vòng đàm phán đến khi chốt

### 1.3 Đối tượng người dùng

Nhân viên nội bộ của công ty du lịch, bao gồm: quản trị viên, quản lý, kế toán và nhân viên kinh doanh.

---

## 2. Các chức năng chính

### 2.1 Dashboard – Tổng quan hệ thống

- Màn hình tổng quan sau khi đăng nhập
- _(Nội dung chi tiết chưa được triển khai đầy đủ — xem mục Ghi chú)_

### 2.2 Quản lý Master Data (Dữ liệu nền)

| STT | Chức năng             | Mô tả                                                 |
| --- | --------------------- | ----------------------------------------------------- |
| 1   | **Nhà cung cấp**      | Quản lý danh sách các nhà cung cấp dịch vụ du lịch    |
| 2   | **Hướng dẫn viên**    | Quản lý hướng dẫn viên du lịch kèm chi phí theo ngày  |
| 3   | **Nhà hàng**          | Quản lý nhà hàng với gói combo và bảng giá theo mùa   |
| 4   | **Khách sạn**         | Quản lý khách sạn với loại phòng và bảng giá phức tạp |
| 5   | **Vận chuyển**        | Quản lý lịch trình vận chuyển theo sức chứa xe        |
| 6   | **Nhóm Tour**         | Quản lý tour nhóm sẵn có từ nhà cung cấp              |
| 7   | **Visa + Fast Track** | Quản lý dịch vụ visa và đón/tiễn sân bay              |
| 8   | **Phí vào cổng**      | Quản lý vé tham quan theo loại đối tượng              |
| 9   | **Chuyến bay**        | Quản lý chuyến bay theo hạng vé và bảng giá           |

Mỗi chức năng Master Data đều hỗ trợ:

- **Xem danh sách** với bộ lọc (tên, quốc gia, thành phố...)
- **Thêm mới** bản ghi
- **Chỉnh sửa** thông tin
- **Xóa** với xác nhận (không thể hoàn tác)
- **Bật/tắt trạng thái hoạt động** (`isActive`)
- **Quản lý dịch vụ thêm** (Add-on Services): mỗi entity có thể có danh sách dịch vụ bổ sung đính kèm (xem mục 5.16)

### 2.3 Quản lý Tour

| STT | Chức năng           | Mô tả                                                                           |
| --- | ------------------- | ------------------------------------------------------------------------------- |
| 1   | **Ngày hành trình** | Tạo/quản lý từng ngày trong lịch trình, gắn nhiều dịch vụ vào mỗi ngày          |
| 2   | **Tour du lịch**    | Tổng hợp các ngày hành trình thành tour hoàn chỉnh, tính chi phí theo đầu người |

Khi thêm dịch vụ vào Ngày hành trình hoặc Tour, người dùng có **3 cách** để thêm dịch vụ:

| Cách | Tên                        | Mô tả                                                                                    |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------- |
| 1    | **Dịch vụ từ Master Data** | Chọn từ danh sách có sẵn (khách sạn, chuyến bay, nhà hàng...) kèm bảng giá đã định nghĩa |
| 2    | **Dịch vụ thêm (Add-on)**  | Chọn dịch vụ bổ sung đã được định nghĩa sẵn trong một entity Master Data cụ thể          |
| 3    | **Dịch vụ tự do (Custom)** | Nhập tự do tên dịch vụ, giá và tiền tệ — không cần liên kết với Master Data              |

### 2.4 Quản lý Tour Bán – Phòng Sales

| STT | Chức năng        | Mô tả                                                                                    |
| --- | ---------------- | ---------------------------------------------------------------------------------------- |
| 1   | **Báo giá**      | Tạo và gửi báo giá tour cho khách hàng; quản lý vòng đàm phán đến khi khách chấp thuận   |
| 2   | **Confirm Tour** | Tạo tour thực tế từ báo giá đã được chấp thuận, tùy chỉnh theo yêu cầu đoàn khách cụ thể |

### 2.5 Quản lý Vận hành – Phòng Operations

| STT | Chức năng       | Mô tả                                                                      |
| --- | --------------- | -------------------------------------------------------------------------- |
| 1   | **Assign Tour** | Giao tour đã confirm cho Operator phụ trách thực hiện                      |
| 2   | **Follow Tour** | Theo dõi tiến độ từng dịch vụ, cập nhật trạng thái và sửa chi tiết thực tế |

### 2.6 Quản lý Thanh toán – Phòng Kế toán

| STT | Chức năng              | Mô tả                                                              |
| --- | ---------------------- | ------------------------------------------------------------------ |
| 1   | **Thu của khách hàng** | Theo dõi các đợt thu tiền từ khách theo kế hoạch hợp đồng          |
| 2   | **Chi cho Vendor**     | Theo dõi và ghi nhận các khoản thanh toán cho nhà cung cấp dịch vụ |

---

## 3. Quy trình nghiệp vụ

### 3.1 Quy trình tạo mới Master Data (áp dụng chung)

```
Bước 1: Người dùng nhấn [+ Thêm mới] tại trang danh sách
Bước 2: Hệ thống hiển thị form nhập liệu
Bước 3: Người dùng điền thông tin (các trường bắt buộc được đánh dấu *)
Bước 4: Hệ thống validate dữ liệu realtime (Zod schema)
   - Nếu lỗi  → hiển thị thông báo lỗi ngay dưới field
   - Nếu hợp lệ → cho phép submit
Bước 5: Người dùng nhấn [Lưu]
Bước 6: Hệ thống lưu dữ liệu → điều hướng về trang danh sách
```

### 3.2 Quy trình cập nhật Master Data

```
Bước 1: Tại danh sách, nhấn icon [Chỉnh sửa] trên dòng cần sửa
Bước 2: Hệ thống load form với dữ liệu hiện tại
Bước 3: Người dùng chỉnh sửa thông tin
Bước 4: Validate → Lưu → Quay về danh sách
```

### 3.3 Quy trình xóa dữ liệu

```
Bước 1: Nhấn icon [Xóa] tại dòng cần xóa
Bước 2: Hệ thống hiển thị hộp thoại xác nhận:
        "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác."
   - Người dùng nhấn [Hủy]       → đóng hộp thoại, không thực hiện
   - Người dùng nhấn [Xác nhận]  → tiếp tục
Bước 3: Hệ thống xóa dữ liệu (không thể hoàn tác)
Bước 4: Cập nhật lại danh sách
```

### 3.4 Quy trình xây dựng Bảng giá

Bảng giá được cấu trúc theo **3 cấp lồng nhau**, áp dụng cho: Khách sạn, Nhà hàng, Chuyến bay, Phí vào cổng, Nhóm Tour.

```
Giai đoạn giá (Pricing Period)
  └── Khoảng ngày (Date Range: từ ngày → đến ngày)
        └── Nhóm ngày (Day Group: nhóm ngày trong tuần)
              └── Giá theo loại phòng / hạng vé / loại đối tượng / gói combo
```

**Ví dụ thực tế — Bảng giá Khách sạn:**

```
Giai đoạn "Q1/2026" | Tiền tệ: VND
  └── Khoảng ngày: 01/01/2026 → 31/03/2026
        ├── Nhóm "T2-T6" (Thứ 2 → Thứ 6) → Phòng đơn: 700.000 ₫
        └── Nhóm "T7-CN" (Thứ 7 + Chủ nhật) → Phòng đơn: 850.000 ₫
```

### 3.5 Quy trình tạo Ngày hành trình (Day)

```
Bước 1: Tạo mới ngày hành trình với thông tin cơ bản:
        - Mã ngày, Tiêu đề, Quốc gia, Thành phố, Mô tả
Bước 2: Thêm các dịch vụ vào ngày (có thể thêm nhiều dịch vụ)
        Người dùng chọn 1 trong 3 cách:
        ┌──────────────────────────────────────────────────────────────┐
        │ Cách 1 – Dịch vụ Master Data (có bảng giá)                  │
        │   Khách sạn │ Vận chuyển │ Visa │ Phí vào cổng             │
        │   Chuyến bay │ Hướng dẫn viên │ Nhà hàng                   │
        ├──────────────────────────────────────────────────────────────┤
        │ Cách 2 – Dịch vụ thêm (Add-on) từ Master Data              │
        │   Chọn entity (VD: Khách sạn X) → chọn add-on đã định nghĩa │
        │   Hệ thống tự điền tên và giá từ Master Data               │
        ├──────────────────────────────────────────────────────────────┤
        │ Cách 3 – Dịch vụ tự do (Custom)                            │
        │   Nhập tên dịch vụ, đơn giá, tiền tệ, ghi chú tùy ý        │
        └──────────────────────────────────────────────────────────────┘
Bước 3: Lưu ngày hành trình
```

### 3.6 Quy trình tạo Tour (Tour mẫu)

```
Bước 1: Nhập thông tin cơ bản tour:
        - Mã tour, Tên tour, Số lượng người, Mô tả, Nội dung (rich text)

Bước 2: Xây dựng lịch trình (Itinerary) bằng cách thêm từng mục:
        - Loại "Ngày hành trình":
          → Chọn từ danh sách ngày đã tạo sẵn
          → Có thể bổ sung / chỉnh sửa dịch vụ trong ngày đó
        - Loại "Nhóm Tour":
          → Chọn tour nhóm từ nhà cung cấp
          → Chọn giai đoạn giá và nhóm ngày

Bước 3: Hệ thống tự động tính chi phí:
        - Tổng chi phí  = Tổng đơn giá tất cả dịch vụ trong lịch trình
        - Giá mỗi người = Tổng chi phí ÷ Số lượng người (làm tròn)
        - Hiển thị riêng theo từng tiền tệ

Bước 4: Lưu tour
```

---

### 3.7 Quy trình Báo giá (Phòng Sales) ✨ _Mới_

> **Actor:** Seller  
> **Tiền điều kiện (Pre-condition):** Đã có tour mẫu hoặc Seller tự xây dựng lịch trình tạm  
> **Hậu điều kiện (Post-condition):** Khách hàng chấp thuận → chuyển sang quy trình Confirm Tour (3.8)

**Tổng quan luồng Báo giá:**

```
Seller tạo Báo giá ──► Gửi cho khách ──► Khách phản hồi
                                               │
                          ┌────────────────────┤
                          ▼                    ▼
                   Chấp thuận           Yêu cầu chỉnh sửa
                          │                    │
                          │            Seller cập nhật
                          │            → Gửi lại (vòng mới)
                          ▼
                   Confirm Tour (3.8)
```

**Luồng xử lý chi tiết:**

```
Bước 1: Seller nhấn [+ Tạo báo giá] tại trang Báo giá
Bước 2: Nhập thông tin khách hàng / đoàn:
        - Tên khách hàng / tên đoàn (bắt buộc)
        - Email / số điện thoại liên hệ
        - Số lượng khách dự kiến
        - Ngày khởi hành dự kiến
        - Ghi chú yêu cầu đặc biệt (ăn chay, hỗ trợ đặc biệt...)
Bước 3: Chọn tour mẫu làm cơ sở:
        - Chọn từ danh sách tour mẫu có sẵn
          → Hệ thống sao chép lịch trình và chi phí về báo giá
        - Hoặc bỏ qua → xây lịch trình trực tiếp trong báo giá
Bước 4: Tùy chỉnh lịch trình và dịch vụ cho phù hợp yêu cầu khách:
        - Thêm / bớt / thay thế dịch vụ
        - Hệ thống tự tính lại tổng chi phí và giá/người sau mỗi thay đổi
Bước 5: Nhập giá bán đề xuất cho khách:
        - Giá bán (selling price) — có thể khác giá cost
        - Ghi chú điều khoản: chính sách hủy, hạn đặt cọc, bao gồm / không bao gồm
Bước 6: Seller nhấn [Lưu nháp] hoặc [Gửi báo giá]
        - [Lưu nháp]    → trạng thái "draft" — chưa gửi cho khách
        - [Gửi báo giá] → trạng thái "sent"  — ghi nhận ngày gửi và phiên bản
Bước 7: Theo dõi phản hồi từ khách:
        a. Khách chấp thuận báo giá:
           → Seller nhấn [Đánh dấu Đã chấp thuận]
           → Trạng thái chuyển sang "approved"
           → Hệ thống cho phép [Tạo Confirm Tour từ báo giá này]
        b. Khách yêu cầu chỉnh sửa:
           → Seller cập nhật lịch trình / giá → nhấn [Gửi lại]
           → Hệ thống lưu lịch sử phiên bản báo giá (v1, v2, v3...)
           → Trạng thái quay về "sent" với số phiên bản tăng lên
        c. Khách không phản hồi / từ chối:
           → Seller đánh dấu "expired" hoặc "rejected"
           → Báo giá đóng lại, không thể tạo Confirm Tour
```

**Vòng đời trạng thái Quotation:**

```
draft ──► sent ──► approved ──► [Confirm Tour]
           │
           ├──► sent (v2, v3...) [sau mỗi lần gửi lại]
           │
           ├──► rejected  [khách từ chối]
           └──► expired   [hết hạn / không phản hồi]
```

**Lịch sử phiên bản báo giá:**

- Mỗi lần Seller nhấn [Gửi báo giá] / [Gửi lại], hệ thống tạo một **snapshot** lịch trình và giá tại thời điểm đó
- Seller và Sale Manager có thể xem lại toàn bộ lịch sử các phiên bản đã gửi
- Phiên bản mới nhất là phiên bản hiện hành

---

### 3.8 Quy trình Confirm Tour (Phòng Sales)

> **Actor:** Seller, Sale Manager  
> **Tiền điều kiện:** Có Quotation ở trạng thái `approved` **hoặc** Seller có quyền confirm trực tiếp không qua báo giá  
> **Hậu điều kiện:** ConfirmedTour ở trạng thái `confirmed` → sẵn sàng để Assign vận hành

**Tổng quan luồng liên phòng ban:**

```
[Sales] Tạo Báo giá ──► Khách chấp thuận ──► Confirm Tour ──► Assign sang Vận hành
                                                                       │
                                        [Ops] Follow Tour ◄────────────┘
                                        Cập nhật dịch vụ thực tế
                                               │
                            [Kế toán] Follow thanh toán
                            ├── Thu của khách
                            └── Chi cho vendor
```

**Luồng xử lý chi tiết:**

```
Bước 1: Seller tạo Confirm Tour:
        a. Từ Quotation đã approved:
           → Nhấn [Tạo Confirm Tour] trên trang chi tiết báo giá
           → Hệ thống tạo bản sao lịch trình từ snapshot báo giá đã approved
        b. Tạo trực tiếp (không qua Quotation):
           → Chọn tour mẫu từ danh sách tour có sẵn
           → Hệ thống tạo bản sao (clone) từ tour mẫu
Bước 2: Seller xác nhận / bổ sung thông tin đoàn khách:
        - Tên đoàn / tên khách hàng
        - Số lượng khách thực tế
        - Ngày khởi hành chính thức
        - Ghi chú yêu cầu đặc biệt
        - Liên kết Quotation (nếu có)
Bước 3: Seller tùy chỉnh lịch trình lần cuối nếu cần:
        - Thêm / bớt / đổi dịch vụ trong từng ngày
        - Thay đổi loại phòng, hạng vé, gói combo...
        - Hệ thống tự tính lại chi phí sau mỗi thay đổi
Bước 4: Seller nhấn [Submit Confirm Tour]
        - Nếu có Sale Manager → trạng thái chuyển sang "pending_approval"
        - Nếu không cần duyệt  → chuyển thẳng sang "confirmed"
Bước 5 (nếu có Sale Manager duyệt):
        - Sale Manager xem xét lịch trình, chi phí, thông tin đoàn
        - Sale Manager Approve → tour sang "confirmed"
        - Sale Manager Reject  → Seller nhận thông báo, chỉnh sửa và submit lại
```

**Vòng đời trạng thái ConfirmedTour** _(cập nhật)_:

```
draft ──► pending_approval ──► confirmed ──► in_operation ──► completed
               │
               ├──► rejected ──► (Seller chỉnh sửa) ──► pending_approval
               │
               └──► [Bất kỳ trạng thái nào trước in_operation]
                         │
                         ▼
                     cancelled  (xem 3.12)
```

**Trạng thái ConfirmedTour:**

| Trạng thái         | Ý nghĩa                                        | Có thể chỉnh sửa | Có thể hủy  |
| ------------------ | ---------------------------------------------- | :--------------: | :---------: |
| `draft`            | Bản nháp, chưa submit                          |        ✅        |     ✅      |
| `pending_approval` | Chờ Sale Manager duyệt                         |        ❌        |     ✅      |
| `confirmed`        | Đã xác nhận, chờ assign vận hành               |   ✅ (hạn chế)   |     ✅      |
| `in_operation`     | Đang thực hiện (đã assign Operator)            |        ❌        | ⚠️ Đặc biệt |
| `completed`        | Hoàn thành                                     |        ❌        |     ❌      |
| `rejected`         | Bị từ chối bởi Sale Manager, cần chỉnh sửa lại |        ✅        |     ✅      |
| `cancelled`        | Đã hủy (xem quy trình 3.12)                    |        ❌        |      —      |

---

### 3.9 Quy trình Assign Tour cho Vận hành

```
Bước 1: Tour đạt trạng thái "confirmed"
Bước 2: Operation Manager vào danh sách tour chờ assign
Bước 3: Chọn tour → chọn Operator phụ trách
        - Có thể assign 1 Operator chính + Operator hỗ trợ
        - Nhập ghi chú nội bộ và deadline chuẩn bị
Bước 4: Nhấn [Assign] → tour chuyển trạng thái "in_operation"
Bước 5: Operator nhận thông báo được assign tour
```

### 3.10 Quy trình Follow Tour & Sửa Detail (Phòng Vận hành)

```
Bước 1: Operator xem danh sách tour được assign cho mình
Bước 2: Vào chi tiết tour → xem từng ngày hành trình
Bước 3: Với mỗi dịch vụ, Operator có thể:
        a. Cập nhật trạng thái thực tế:
           pending → booked → confirmed → completed
                                  └──────► issue (vấn đề phát sinh)
        b. Sửa thông tin thực tế (nếu khác kế hoạch):
           - Đổi khách sạn / loại phòng
           - Đổi xe / sức chứa
           - Đổi chuyến bay / hạng vé
           - Cập nhật giá thực tế
        c. Ghi chú vấn đề phát sinh
Bước 4: Mỗi thay đổi được ghi log đầy đủ (ai, lúc nào, thay đổi gì)
        Giá gốc (kế hoạch ban đầu) được giữ nguyên, không bị xóa
Bước 5: Khi tất cả dịch vụ hoàn thành → Operator đánh dấu "Hoàn thành"
Bước 6: Operation Manager review và đóng tour
```

### 3.11 Quy trình Follow Thanh toán (Phòng Kế toán)

**3.11A – Thu tiền từ khách hàng:**

```
Bước 1: Tour confirm → Kế toán tạo "Phiếu thu" cho tour đó
Bước 2: Nhập kế hoạch thu theo từng đợt:
        - Đợt 1: Đặt cọc (VD: 30% tổng giá trị)
        - Đợt 2: Thanh toán lần 2 (VD: trước khởi hành 30 ngày)
        - Đợt 3: Thanh toán còn lại (VD: trước khởi hành 7 ngày)
Bước 3: Theo dõi từng đợt → khi nhận tiền:
        - Đánh dấu "Đã thu"
        - Nhập số tiền thực nhận, ngày nhận, hình thức thanh toán
Bước 4: Hệ thống tổng hợp: Tổng đã thu / Tổng phải thu / Còn lại
```

**3.11B – Chi tiền cho Vendor:**

```
Bước 1: Từ ServiceExecutionLog (do Vận hành cập nhật), Kế toán xem
        danh sách dịch vụ đã ở trạng thái "confirmed" hoặc "completed"
Bước 2: Tạo "Phiếu chi" cho từng dịch vụ:
        - Vendor (khách sạn / hãng bay / nhà hàng...)
        - Số tiền = giá thực tế từ log vận hành
        - Hạn thanh toán với vendor
Bước 3: Theo dõi trạng thái:
        pending → partial → paid
                └────────────────► overdue (quá hạn)
Bước 4: Khi thanh toán → ghi nhận: số tiền, ngày trả, đính kèm chứng từ
Bước 5: Accountant Manager xem tổng công nợ toàn tour / toàn tháng
```

---

### 3.12 Quy trình Hủy Tour & Hoàn tiền ✨ _Mới_

> **Actor:** Seller (khởi tạo), Sale Manager (duyệt nếu cần), Kế toán (xử lý hoàn tiền)  
> **Tiền điều kiện:** ConfirmedTour đang ở trạng thái `draft`, `pending_approval`, `confirmed`, hoặc `in_operation` (đặc biệt)  
> **Hậu điều kiện:** ConfirmedTour chuyển sang trạng thái `cancelled`; phiếu hoàn tiền được tạo nếu cần

**Tổng quan luồng Hủy Tour:**

```
Seller / Sale Manager yêu cầu hủy
           │
           ▼
   Chọn lý do hủy ──► Hệ thống kiểm tra trạng thái hiện tại
           │
           ├── draft / pending_approval / confirmed
           │         │
           │         ▼
           │   Hủy ngay → cancelled
           │   (không cần duyệt thêm)
           │         │
           │         ▼
           │   Kế toán tính toán hoàn tiền (nếu đã thu)
           │
           └── in_operation (đặc biệt)
                     │
                     ▼
             Yêu cầu duyệt từ Sale Manager + Operation Manager
                     │
               ┌─────┴──────┐
               ▼            ▼
           Duyệt       Từ chối hủy
               │
               ▼
           cancelled
               │
               ▼
      Kế toán xử lý hoàn tiền + phí hủy
      Vận hành thông báo hủy đến Vendor
```

**Luồng xử lý chi tiết:**

```
Bước 1: Seller hoặc Sale Manager nhấn [Yêu cầu Hủy Tour] trong trang chi tiết tour
Bước 2: Hệ thống yêu cầu nhập:
        - Lý do hủy (bắt buộc):
          · Khách hủy chủ động
          · Không đủ số lượng khách tối thiểu
          · Sự cố bất khả kháng (thiên tai, dịch bệnh...)
          · Lý do nội bộ công ty
          · Khác
        - Ngày hủy hiệu lực (mặc định: hôm nay)
        - Ghi chú bổ sung
Bước 3: Hệ thống kiểm tra trạng thái tour:
        a. Nếu trạng thái là draft / pending_approval / confirmed:
           → Hủy ngay lập tức, không cần duyệt thêm
           → Tour chuyển sang "cancelled"
        b. Nếu trạng thái là in_operation:
           → Bắt buộc có xác nhận từ Sale Manager VÀ Operation Manager
           → Tạo yêu cầu hủy đặc biệt, gửi thông báo đến hai manager
           → Chờ cả hai duyệt → tour mới chuyển sang "cancelled"
           → Nếu một trong hai từ chối → tour tiếp tục in_operation
Bước 4: Sau khi tour cancelled:
        a. Kế toán vào tab "Hoàn tiền" của tour:
           - Xem lại số tiền đã thu từ khách
           - Tính phí hủy theo chính sách (nếu có)
           - Nhập số tiền thực hoàn
           - Nhập ngày hoàn, hình thức hoàn (chuyển khoản / tiền mặt)
           - Tạo Phiếu Hoàn tiền
        b. Vận hành (nếu tour đang in_operation):
           - Thông báo hủy đến từng Vendor liên quan
           - Cập nhật trạng thái từng dịch vụ thành "cancelled"
           - Ghi nhận phí hủy phát sinh từ Vendor
Bước 5: Hệ thống ghi log đầy đủ:
        - Ai yêu cầu hủy, lúc nào
        - Ai duyệt (nếu cần duyệt)
        - Lý do hủy
        - Số tiền hoàn và phí hủy
```

**Chính sách phí hủy (tham khảo — công ty tự định nghĩa):**

| Thời điểm hủy trước ngày khởi hành | Phí hủy đề xuất       |
| ---------------------------------- | --------------------- |
| > 30 ngày                          | Miễn phí / hoàn cọc   |
| 15 – 30 ngày                       | 30% tổng giá trị tour |
| 7 – 14 ngày                        | 50% tổng giá trị tour |
| < 7 ngày                           | 70–100% tổng giá trị  |

> **Lưu ý:** Bảng phí hủy chỉ mang tính tham khảo. Giá trị thực tế do Kế toán nhập tay dựa trên hợp đồng với từng khách.

**Ràng buộc:**

- Tour ở trạng thái `completed` **không thể hủy**
- Tour đã cancelled **không thể khôi phục** — nếu muốn tiếp tục cần tạo ConfirmedTour mới
- Phiếu hoàn tiền **không thể xóa** sau khi đã tạo, chỉ được cập nhật trạng thái

---

### 3.13 Quy trình quản lý Dịch vụ thêm (Add-on) trong Master Data

**Mô tả:**  
Mỗi entity trong Master Data (Khách sạn, Nhà hàng, Vận chuyển, Chuyến bay, Hướng dẫn viên, Visa, Phí vào cổng, Nhóm Tour) đều có thể được đính kèm danh sách các dịch vụ bổ sung (add-on). Các dịch vụ này được dùng để tái sử dụng khi xây dựng lịch trình tour.

**Ví dụ thực tế:**

```
Khách sạn "Ánh Dương":
  ├── [Add-on] Giường phụ          → 200.000 ₫ / đêm
  ├── [Add-on] Bữa sáng buffet     → 150.000 ₫ / người
  └── [Add-on] Đưa đón sân bay     → 300.000 ₫ / lượt

Nhà hàng "Hải Sản Biển Đông":
  ├── [Add-on] Phòng riêng VIP      → 500.000 ₫ / bữa
  └── [Add-on] Nước uống thêm      →  50.000 ₫ / người

Hướng dẫn viên "Nguyễn Văn A":
  └── [Add-on] Phiên dịch tiếng Nhật → 500.000 ₫ / ngày
```

**Luồng quản lý add-on trong Master Data:**

```
Bước 1: Vào trang chi tiết / chỉnh sửa của một entity Master Data
Bước 2: Tìm mục "Dịch vụ thêm (Add-on)"
Bước 3: Nhấn [+ Thêm dịch vụ]
Bước 4: Nhập thông tin:
        - Tên dịch vụ (bắt buộc)
        - Đơn giá (bắt buộc, ≥ 0)
        - Tiền tệ (bắt buộc)
        - Đơn vị tính: /người, /phòng, /đêm, /lượt, /ngày, /tour... (tùy chọn)
        - Mô tả chi tiết (tùy chọn)
Bước 5: Lưu → add-on xuất hiện trong danh sách
Bước 6: Có thể chỉnh sửa / xóa từng add-on
```

**Luồng sử dụng add-on khi xây dựng lịch trình:**

```
Bước 1: Trong form Ngày hành trình hoặc Tour, chọn [+ Thêm dịch vụ]
Bước 2: Chọn "Dịch vụ thêm (Add-on)"
Bước 3: Chọn loại entity nguồn (Khách sạn / Nhà hàng / ...)
Bước 4: Chọn entity cụ thể (VD: Khách sạn Ánh Dương)
Bước 5: Hệ thống hiển thị danh sách add-on của entity đó
Bước 6: Chọn add-on muốn thêm
        → Tên và giá được điền tự động từ Master Data
        → Người dùng có thể ghi đè giá nếu cần
Bước 7: Lưu
```

**Luồng thêm Dịch vụ tự do (Custom) không từ Master Data:**

```
Bước 1: Trong form Ngày hành trình hoặc Tour, chọn [+ Thêm dịch vụ]
Bước 2: Chọn "Dịch vụ tự do (Custom)"
Bước 3: Nhập trực tiếp:
        - Tên dịch vụ
        - Đơn giá
        - Tiền tệ
        - Ghi chú (tùy chọn)
Bước 4: Lưu → dịch vụ được thêm vào lịch trình
        (Không được lưu vào Master Data, chỉ tồn tại trong tour/ngày đó)
```

---

## 4. Vai trò trong hệ thống

**Phân chia theo phòng ban:**

| Role                 | Team     | Tên hiển thị          | Quyền                                                                                       |
| -------------------- | -------- | --------------------- | ------------------------------------------------------------------------------------------- |
| `ADMIN`              | —        | Quản trị viên         | Xem toàn bộ mọi team, mọi chức năng, không hạn chế                                          |
| `SALE_MANAGER`       | Sales    | Trưởng phòng Sales    | Xem/duyệt toàn bộ tour của team Sales; approve/reject confirm tour; duyệt hủy tour đặc biệt |
| `SELLER`             | Sales    | Nhân viên kinh doanh  | Tạo báo giá, confirm tour, custom lịch trình, yêu cầu hủy tour                              |
| `OPERATION_MANAGER`  | Vận hành | Trưởng phòng Vận hành | Assign tour cho Operator; duyệt hủy tour đặc biệt; xem toàn bộ tour đang vận hành           |
| `OPERATOR`           | Vận hành | Nhân viên Vận hành    | Follow và cập nhật các tour được assign; sửa detail dịch vụ thực tế                         |
| `ACCOUNTANT_MANAGER` | Kế toán  | Trưởng phòng Kế toán  | Xem tổng công nợ toàn hệ thống; duyệt các phiếu thanh toán                                  |
| `ACCOUNTANT`         | Kế toán  | Kế toán viên          | Nhập/cập nhật trạng thái thu/chi; tạo phiếu hoàn tiền                                       |

**Quy tắc xem dữ liệu theo role:**

- **ADMIN:** Xem toàn bộ, không hạn chế
- **Manager (bất kỳ team):** Xem toàn bộ dữ liệu của team mình
- **Staff (SELLER / OPERATOR / ACCOUNTANT):** Chỉ xem dữ liệu được giao / liên quan đến mình

> **Lưu ý:** Phân quyền chi tiết chưa được triển khai trong source code hiện tại. Bảng trên là thiết kế nghiệp vụ đề xuất.

---

## 5. Các thực thể dữ liệu chính

### 5.1 Supplier – Nhà cung cấp

| Field      | Kiểu    | Ý nghĩa                                       |
| ---------- | ------- | --------------------------------------------- |
| `id`       | string  | Mã định danh duy nhất                         |
| `code`     | string  | Mã nhà cung cấp (tự nhập)                     |
| `name`     | string  | Tên nhà cung cấp                              |
| `phone`    | string  | Số điện thoại liên hệ                         |
| `email`    | string  | Địa chỉ email                                 |
| `taxCode`  | string  | Mã số thuế                                    |
| `country`  | string  | Quốc gia                                      |
| `city`     | string  | Thành phố                                     |
| `address`  | string  | Địa chỉ cụ thể                                |
| `isActive` | boolean | Trạng thái hoạt động (đang hợp tác hay không) |

### 5.2 Hotel – Khách sạn

| Field                          | Kiểu            | Ý nghĩa                                              |
| ------------------------------ | --------------- | ---------------------------------------------------- |
| `id`                           | string          | Mã định danh duy nhất                                |
| `code`                         | string          | Mã khách sạn                                         |
| `name`                         | string          | Tên khách sạn                                        |
| `rate`                         | string          | Hạng sao (1–5 sao)                                   |
| `country` / `city` / `address` | string          | Địa chỉ                                              |
| `supplier`                     | string          | Nhà cung cấp liên kết                                |
| `roomTypes`                    | RoomType[]      | Danh sách loại phòng (tên, sức chứa tối đa, ghi chú) |
| `pricingPeriods`               | PricingPeriod[] | Bảng giá theo giai đoạn (cấu trúc 3 cấp)             |
| `note`                         | string          | Ghi chú bổ sung                                      |
| `isActive`                     | boolean         | Trạng thái hoạt động                                 |

**RoomType – Loại phòng:**

| Field       | Ý nghĩa                                             |
| ----------- | --------------------------------------------------- |
| `name`      | Tên loại phòng (Phòng đơn, Phòng đôi, Phòng VIP...) |
| `maxGuests` | Số khách tối đa (≥ 1)                               |
| `note`      | Ghi chú (diện tích, tiện nghi...)                   |

### 5.3 Transportation – Vận chuyển

| Field                  | Kiểu                   | Ý nghĩa                         |
| ---------------------- | ---------------------- | ------------------------------- |
| `code` / `name`        | string                 | Mã và tên lịch trình vận chuyển |
| `country` / `city`     | string                 | Địa điểm hoạt động              |
| `supplier`             | string                 | Nhà cung cấp                    |
| `km`                   | number                 | Quãng đường (km)                |
| `vehicleCapacityPrice` | VehicleCapacityPrice[] | Bảng giá theo sức chứa xe       |
| `notes`                | string                 | Ghi chú                         |
| `isActive`             | boolean                | Trạng thái hoạt động            |

**VehicleCapacityPrice – Giá theo sức chứa:**

| Field      | Ý nghĩa              |
| ---------- | -------------------- |
| `capacity` | Sức chứa xe (số chỗ) |
| `currency` | Tiền tệ              |
| `price`    | Giá thuê             |

### 5.4 TourGuide – Hướng dẫn viên

| Field                          | Kiểu    | Ý nghĩa              |
| ------------------------------ | ------- | -------------------- |
| `code` / `name`                | string  | Mã và họ tên         |
| `phone` / `email`              | string  | Liên hệ              |
| `nationalId`                   | string  | Số CMND/CCCD         |
| `country` / `city` / `address` | string  | Địa chỉ              |
| `pricePerDay`                  | number  | Giá thuê theo ngày   |
| `isActive`                     | boolean | Trạng thái hoạt động |

### 5.5 Restaurant – Nhà hàng

| Field                          | Kiểu            | Ý nghĩa                                       |
| ------------------------------ | --------------- | --------------------------------------------- |
| `code` / `name`                | string          | Mã và tên nhà hàng                            |
| `phone` / `email`              | string          | Liên hệ                                       |
| `country` / `city` / `address` | string          | Địa chỉ                                       |
| `capacity`                     | number          | Sức chứa (số khách tối đa)                    |
| `comboPackages`                | ComboPackage[]  | Danh sách gói combo                           |
| `pricingPeriods`               | PricingPeriod[] | Bảng giá theo giai đoạn, ngày tuần, gói combo |
| `isActive`                     | boolean         | Trạng thái hoạt động                          |

**ComboPackage – Gói combo:**

| Field       | Ý nghĩa                 |
| ----------- | ----------------------- |
| `name`      | Tên gói combo           |
| `maxGuests` | Số khách tối đa của gói |

### 5.6 Flight – Chuyến bay

| Field                      | Kiểu              | Ý nghĩa                                     |
| -------------------------- | ----------------- | ------------------------------------------- |
| `airline`                  | string            | Hãng hàng không                             |
| `origin` / `destination`   | string            | Mã sân bay đi / đến                         |
| `fromCountry` / `fromCity` | string            | Quốc gia và thành phố xuất phát             |
| `toCountry` / `toCity`     | string            | Quốc gia và thành phố đến                   |
| `flightTime`               | string            | Thời gian bay                               |
| `provider`                 | string            | Nhà cung cấp / đại lý bán vé                |
| `seatClasses`              | FlightSeatClass[] | Các hạng vé (tên, ghi chú)                  |
| `pricingPeriods`           | PricingPeriod[]   | Bảng giá theo giai đoạn, ngày tuần, hạng vé |
| `isActive`                 | boolean           | Trạng thái hoạt động                        |

### 5.7 VisaService – Dịch vụ Visa + Fast Track

| Field              | Kiểu      | Ý nghĩa                  |
| ------------------ | --------- | ------------------------ |
| `provider`         | string    | Tên nhà cung cấp dịch vụ |
| `country` / `city` | string    | Địa điểm                 |
| `services`         | Service[] | Danh sách dịch vụ con    |

**Service – Dịch vụ con:**

| Field            | Ý nghĩa                                     |
| ---------------- | ------------------------------------------- |
| `group`          | Nhóm dịch vụ: "Đón", "Tiễn", "Dịch vụ thêm" |
| `serviceName`    | Tên dịch vụ cụ thể                          |
| `price`          | Giá dịch vụ                                 |
| `priceUnit`      | Đơn vị tiền tệ                              |
| `pickupLocation` | Địa điểm đón/tiễn                           |
| `description`    | Mô tả chi tiết                              |

### 5.8 EntranceFee – Phí vào cổng

| Field              | Kiểu            | Ý nghĩa                                                 |
| ------------------ | --------------- | ------------------------------------------------------- |
| `code`             | string          | Mã dịch vụ                                              |
| `serviceName`      | string          | Tên điểm tham quan / dịch vụ                            |
| `country` / `city` | string          | Địa điểm                                                |
| `ticketTypes`      | TicketType[]    | Loại vé theo đối tượng (người lớn, trẻ em, học sinh...) |
| `pricingPeriods`   | PricingPeriod[] | Bảng giá theo giai đoạn, ngày tuần, loại vé             |
| `notes`            | string          | Ghi chú                                                 |
| `isActive`         | boolean         | Trạng thái hoạt động                                    |

### 5.9 GroupTour – Nhóm Tour

| Field               | Kiểu            | Ý nghĩa                                 |
| ------------------- | --------------- | --------------------------------------- |
| `code` / `tourName` | string          | Mã và tên tour nhóm                     |
| `country` / `city`  | string          | Địa điểm                                |
| `supplier`          | string          | Nhà cung cấp tour nhóm                  |
| `content`           | string          | Nội dung/mô tả tour (rich text)         |
| `notes`             | string          | Ghi chú                                 |
| `pricingPeriods`    | PricingPeriod[] | Bảng giá theo giai đoạn, theo ngày tuần |
| `isActive`          | boolean         | Trạng thái hoạt động                    |

### 5.10 Day – Ngày hành trình

| Field              | Kiểu         | Ý nghĩa                      |
| ------------------ | ------------ | ---------------------------- |
| `id`               | string       | Mã định danh duy nhất        |
| `code`             | string       | Mã ngày hành trình           |
| `title`            | string       | Tên/tiêu đề ngày             |
| `country` / `city` | string       | Địa điểm                     |
| `description`      | string       | Mô tả hoạt động trong ngày   |
| `services`         | DayService[] | Danh sách dịch vụ trong ngày |

**DayService – Dịch vụ trong ngày:**

| Field               | Kiểu    | Ý nghĩa                                                                                    |
| ------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `serviceType`       | enum    | Loại dịch vụ (xem bảng bên dưới)                                                           |
| `name`              | string  | Tên dịch vụ hiển thị                                                                       |
| `unitPrice`         | number  | Đơn giá                                                                                    |
| `currency`          | string  | Tiền tệ                                                                                    |
| `hotelDetail`       | object? | Chi tiết khách sạn (hotelId, pricingPeriodId, dayGroupId, roomTypeId)                      |
| `transportDetail`   | object? | Chi tiết vận chuyển (transportId, capacity)                                                |
| `visaDetail`        | object? | Chi tiết visa (providerId, serviceName)                                                    |
| `entranceFeeDetail` | object? | Chi tiết phí vào cổng (entranceFeeId, pricingPeriodId, ticketTypeIndex, dayGroupId, count) |
| `flightDetail`      | object? | Chi tiết chuyến bay (flightId, pricingPeriodId, seatClassId, dayGroupId)                   |
| `tourGuideDetail`   | object? | Chi tiết hướng dẫn viên (tourGuideId)                                                      |
| `restaurantDetail`  | object? | Chi tiết nhà hàng (restaurantId, pricingPeriodIndex, comboPackageIndex, dayGroupKey)       |
| `addonDetail`       | object? | Chi tiết dịch vụ thêm (entityType, entityId, addonId)                                      |
| `customDetail`      | object? | Chi tiết dịch vụ tự do (description)                                                       |

**Các loại ServiceType:**

| Giá trị        | Tên hiển thị   | Nguồn dữ liệu                                      |
| -------------- | -------------- | -------------------------------------------------- |
| `hotel`        | Khách sạn      | Master Data (có bảng giá)                          |
| `transport`    | Vận chuyển     | Master Data (có bảng giá)                          |
| `visa`         | Visa           | Master Data (có bảng giá)                          |
| `entrance_fee` | Phí vào cổng   | Master Data (có bảng giá)                          |
| `flight`       | Chuyến bay     | Master Data (có bảng giá)                          |
| `tour_guide`   | Hướng dẫn viên | Master Data (có bảng giá)                          |
| `restaurant`   | Nhà hàng       | Master Data (có bảng giá)                          |
| `addon`        | Dịch vụ thêm   | Add-on định nghĩa sẵn trong một entity Master Data |
| `custom`       | Dịch vụ tự do  | Nhập tay tại chỗ, không liên kết Master Data       |

### 5.11 Tour – Tour du lịch (Tour mẫu)

| Field            | Kiểu                | Ý nghĩa                                       |
| ---------------- | ------------------- | --------------------------------------------- |
| `id`             | string              | Mã định danh duy nhất                         |
| `code`           | string              | Mã tour                                       |
| `name`           | string              | Tên tour                                      |
| `description`    | string              | Mô tả ngắn                                    |
| `content`        | string              | Nội dung chi tiết (rich text, WYSIWYG editor) |
| `numberOfPeople` | number              | Số lượng người tham gia (≥ 1)                 |
| `itinerary`      | TourItineraryItem[] | Lịch trình — mảng các mục                     |

**TourItineraryItem – Mục lịch trình:**

| Loại            | `kind`         | Ý nghĩa                                                |
| --------------- | -------------- | ------------------------------------------------------ |
| Ngày hành trình | `"day"`        | Sử dụng dữ liệu từ entity Day, có thể bổ sung dịch vụ  |
| Nhóm Tour       | `"group_tour"` | Mua tour nhóm từ nhà cung cấp, chọn giá theo giai đoạn |

### 5.12 ConfirmedTour – Tour đã bán _(cập nhật)_

| Field                | Kiểu                     | Ý nghĩa                                       |
| -------------------- | ------------------------ | --------------------------------------------- |
| `id`                 | string                   | Mã định danh duy nhất                         |
| `quotationId`        | string?                  | Tham chiếu Quotation gốc (nếu tạo từ báo giá) |
| `tourTemplateId`     | string?                  | Tham chiếu tour mẫu gốc (nếu tạo trực tiếp)   |
| `code`               | string                   | Mã tour đã bán (tự sinh)                      |
| `customerName`       | string                   | Tên khách hàng / tên đoàn                     |
| `numberOfPeople`     | number                   | Số khách thực tế                              |
| `departureDate`      | string                   | Ngày khởi hành                                |
| `itinerary`          | TourItineraryItem[]      | Lịch trình đã custom (bản sao độc lập)        |
| `totalCost`          | Record\<string, number\> | Tổng chi phí theo từng tiền tệ                |
| `status`             | enum                     | Trạng thái (xem bảng bên dưới)                |
| `note`               | string                   | Ghi chú yêu cầu đặc biệt                      |
| `createdBy`          | string                   | Seller tạo                                    |
| `approvedBy`         | string?                  | Sale Manager duyệt                            |
| `assignedTo`         | string?                  | Operator được giao                            |
| `assignedAt`         | string?                  | Thời điểm assign                              |
| `operationNote`      | string?                  | Ghi chú của Operation Manager                 |
| `cancelledBy`        | string?                  | Người yêu cầu hủy                             |
| `cancelledAt`        | string?                  | Thời điểm hủy                                 |
| `cancellationReason` | string?                  | Lý do hủy                                     |

**Trạng thái ConfirmedTour:**

| Giá trị            | Ý nghĩa                                          |
| ------------------ | ------------------------------------------------ |
| `draft`            | Bản nháp, chưa submit                            |
| `pending_approval` | Chờ Sale Manager duyệt                           |
| `confirmed`        | Đã xác nhận, chờ assign vận hành                 |
| `in_operation`     | Đang thực hiện (đã assign Operator)              |
| `completed`        | Hoàn thành                                       |
| `rejected`         | Bị Sale Manager từ chối, cần chỉnh sửa lại       |
| `cancelled`        | Đã hủy (xem quy trình 3.12); không thể khôi phục |

### 5.13 ServiceExecutionLog – Log vận hành dịch vụ

| Field             | Kiểu    | Ý nghĩa                                                                  |
| ----------------- | ------- | ------------------------------------------------------------------------ |
| `id`              | string  | Mã log                                                                   |
| `confirmedTourId` | string  | Tour đang thực hiện                                                      |
| `dayIndex`        | number  | Ngày thứ mấy trong lịch trình                                            |
| `serviceId`       | string  | Dịch vụ trong ngày                                                       |
| `status`          | enum    | `pending` / `booked` / `confirmed` / `completed` / `issue` / `cancelled` |
| `plannedPrice`    | number  | Giá kế hoạch ban đầu (không bao giờ bị thay đổi)                         |
| `actualPrice`     | number? | Giá thực tế (do Operator cập nhật)                                       |
| `actualCurrency`  | string  | Tiền tệ thực tế                                                          |
| `note`            | string  | Ghi chú / mô tả vấn đề phát sinh                                         |
| `updatedBy`       | string  | Người cập nhật                                                           |
| `updatedAt`       | string  | Thời điểm cập nhật                                                       |

### 5.14 CustomerPayment – Phiếu thu khách hàng

| Field             | Kiểu                 | Ý nghĩa               |
| ----------------- | -------------------- | --------------------- |
| `id`              | string               | Mã phiếu thu          |
| `confirmedTourId` | string               | Tour liên quan        |
| `totalAmount`     | number               | Tổng giá trị hợp đồng |
| `currency`        | string               | Tiền tệ               |
| `installments`    | PaymentInstallment[] | Danh sách các đợt thu |

**PaymentInstallment – Đợt thanh toán:**

| Field            | Kiểu    | Ý nghĩa                                    |
| ---------------- | ------- | ------------------------------------------ |
| `label`          | string  | Tên đợt (VD: "Đặt cọc 30%")                |
| `dueDate`        | string  | Hạn thanh toán                             |
| `expectedAmount` | number  | Số tiền dự kiến                            |
| `actualAmount`   | number? | Số tiền thực nhận                          |
| `paidAt`         | string? | Ngày thực nhận                             |
| `paymentMethod`  | string? | Hình thức (chuyển khoản / tiền mặt...)     |
| `status`         | enum    | `pending` / `partial` / `paid` / `overdue` |
| `note`           | string  | Ghi chú                                    |

### 5.15 VendorPayment – Phiếu chi cho Vendor

| Field             | Kiểu    | Ý nghĩa                                      |
| ----------------- | ------- | -------------------------------------------- |
| `id`              | string  | Mã phiếu chi                                 |
| `confirmedTourId` | string  | Tour liên quan                               |
| `serviceLogId`    | string  | Tham chiếu ServiceExecutionLog               |
| `vendorName`      | string  | Tên vendor                                   |
| `vendorType`      | string  | Loại vendor (hotel / flight / restaurant...) |
| `expectedAmount`  | number  | Số tiền phải trả theo kế hoạch               |
| `actualAmount`    | number? | Số tiền thực trả                             |
| `currency`        | string  | Tiền tệ                                      |
| `dueDate`         | string  | Hạn thanh toán cho vendor                    |
| `paidAt`          | string? | Ngày thực trả                                |
| `paymentMethod`   | string? | Hình thức thanh toán                         |
| `status`          | enum    | `pending` / `partial` / `paid` / `overdue`   |
| `note`            | string  | Ghi chú                                      |

### 5.16 AddonService – Dịch vụ thêm trong Master Data

| Field         | Kiểu    | Ý nghĩa                                                                                                          |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`          | string  | Mã định danh duy nhất                                                                                            |
| `entityType`  | string  | Loại entity chủ sở hữu (hotel / restaurant / transport / flight / tour_guide / visa / entrance_fee / group_tour) |
| `entityId`    | string  | ID của entity chủ sở hữu                                                                                         |
| `name`        | string  | Tên dịch vụ (bắt buộc)                                                                                           |
| `price`       | number  | Đơn giá (≥ 0)                                                                                                    |
| `currency`    | string  | Tiền tệ                                                                                                          |
| `unit`        | string? | Đơn vị tính: `/người`, `/phòng`, `/đêm`, `/lượt`, `/ngày`, `/tour`...                                            |
| `description` | string  | Mô tả chi tiết                                                                                                   |
| `isActive`    | boolean | Trạng thái — chỉ hiện add-on đang active trong dropdown chọn                                                     |

### 5.17 Quotation – Báo giá ✨ _Mới_

| Field              | Kiểu                    | Ý nghĩa                                            |
| ------------------ | ----------------------- | -------------------------------------------------- |
| `id`               | string                  | Mã định danh duy nhất                              |
| `code`             | string                  | Mã báo giá (tự sinh, VD: `BG-2026-0042`)           |
| `tourTemplateId`   | string?                 | Tour mẫu làm cơ sở (nếu có)                        |
| `customerName`     | string                  | Tên khách hàng / tên đoàn (bắt buộc)               |
| `customerEmail`    | string?                 | Email liên hệ                                      |
| `customerPhone`    | string?                 | Số điện thoại liên hệ                              |
| `numberOfPeople`   | number                  | Số lượng khách dự kiến                             |
| `departureDateEst` | string?                 | Ngày khởi hành dự kiến                             |
| `itinerary`        | TourItineraryItem[]     | Lịch trình báo giá (bản sao, độc lập với tour mẫu) |
| `costTotal`        | Record\<string,number\> | Tổng chi phí (cost) theo từng tiền tệ              |
| `sellingPrice`     | Record\<string,number\> | Giá bán đề xuất cho khách theo từng tiền tệ        |
| `terms`            | string?                 | Điều khoản: bao gồm, không bao gồm, chính sách hủy |
| `status`           | enum                    | Trạng thái (xem bảng bên dưới)                     |
| `currentVersion`   | number                  | Số phiên bản hiện tại (bắt đầu từ 1)               |
| `versions`         | QuotationVersion[]      | Lịch sử các phiên bản đã gửi                       |
| `createdBy`        | string                  | Seller tạo                                         |
| `sentAt`           | string?                 | Thời điểm gửi gần nhất                             |
| `approvedAt`       | string?                 | Thời điểm khách chấp thuận                         |
| `note`             | string?                 | Ghi chú nội bộ                                     |

**Trạng thái Quotation:**

| Giá trị    | Ý nghĩa                                             |
| ---------- | --------------------------------------------------- |
| `draft`    | Bản nháp, chưa gửi cho khách                        |
| `sent`     | Đã gửi cho khách, đang chờ phản hồi                 |
| `approved` | Khách chấp thuận — có thể tạo ConfirmedTour từ đây  |
| `rejected` | Khách từ chối                                       |
| `expired`  | Hết hạn / không có phản hồi, Seller đã đóng báo giá |

**QuotationVersion – Lịch sử phiên bản:**

| Field          | Kiểu                    | Ý nghĩa                                              |
| -------------- | ----------------------- | ---------------------------------------------------- |
| `version`      | number                  | Số thứ tự phiên bản (1, 2, 3...)                     |
| `sentAt`       | string                  | Thời điểm gửi phiên bản này                          |
| `itinerary`    | TourItineraryItem[]     | Snapshot lịch trình tại thời điểm gửi                |
| `costTotal`    | Record\<string,number\> | Snapshot chi phí tại thời điểm gửi                   |
| `sellingPrice` | Record\<string,number\> | Snapshot giá bán tại thời điểm gửi                   |
| `note`         | string?                 | Ghi chú cho phiên bản này (thay đổi gì so với trước) |

### 5.18 CancellationRecord – Phiếu Hủy Tour ✨ _Mới_

| Field             | Kiểu    | Ý nghĩa                                   |
| ----------------- | ------- | ----------------------------------------- |
| `id`              | string  | Mã định danh duy nhất                     |
| `confirmedTourId` | string  | Tour bị hủy                               |
| `reason`          | string  | Lý do hủy                                 |
| `requestedBy`     | string  | Người yêu cầu hủy (Seller / Sale Manager) |
| `requestedAt`     | string  | Thời điểm yêu cầu                         |
| `approvedBy`      | string? | Người duyệt hủy (nếu cần duyệt đặc biệt)  |
| `approvedAt`      | string? | Thời điểm duyệt                           |
| `effectiveDate`   | string  | Ngày hủy có hiệu lực                      |
| `refundAmount`    | number? | Số tiền hoàn cho khách                    |
| `cancellationFee` | number? | Phí hủy áp dụng                           |
| `currency`        | string? | Tiền tệ của khoản hoàn / phí hủy          |
| `refundMethod`    | string? | Hình thức hoàn tiền                       |
| `refundAt`        | string? | Ngày hoàn tiền thực tế                    |
| `note`            | string? | Ghi chú                                   |

---

## 6. API

### 6.1 API thực tế đang sử dụng

| Endpoint                         | Method | Input                 | Output                            | Mục đích                              |
| -------------------------------- | ------ | --------------------- | --------------------------------- | ------------------------------------- |
| `{COUNTRY_URL}/countries`        | GET    | —                     | `{ error, msg, data: Country[] }` | Lấy danh sách quốc gia cho dropdown   |
| `{COUNTRY_URL}/countries/cities` | POST   | `{ country: string }` | `{ error, msg, data: string[] }`  | Lấy danh sách thành phố theo quốc gia |

**Cấu trúc Country:**

```json
{
  "iso2": "VN",
  "iso3": "VNM",
  "country": "Vietnam",
  "cities": ["Hanoi", "Ho Chi Minh City", "..."]
}
```

### 6.2 Cấu hình HTTP Client

- **Base URL:** biến môi trường `VITE_API_BASE_URL`
- **Country URL:** biến môi trường `VITE_API_COUNTRY_URL`
- **Timeout:** 10 giây
- **Content-Type:** `application/json`
- **Authentication:** Bearer Token JWT (đã chuẩn bị, chưa kích hoạt)

> **Quan trọng:** Toàn bộ các module nghiệp vụ (hotel, supplier, tour, day...) hiện đang dùng **mock store lưu trong RAM**. Backend API cho các module này chưa được tích hợp vào front-end.

---

## 7. Quy tắc nghiệp vụ

### 7.1 Quy tắc Bảng giá (áp dụng chung)

- Mỗi giai đoạn giá bắt buộc phải có **ít nhất 1 khoảng ngày**
- Mỗi khoảng ngày bắt buộc phải có **ít nhất 1 nhóm ngày**
- Mỗi nhóm ngày phải chọn **ít nhất 1 ngày trong tuần**
- Giá không được là số âm (≥ 0)
- Hỗ trợ đa tiền tệ: VND, USD, EUR, JPY, GBP, AUD, CAD, CHF, CNY, KRW, SGD, THB, INR, HKD, MYR, IDR, PHP, NZD, RUB, BRL

### 7.2 Quy tắc Tour

- Tour phải có **ít nhất 1 mục lịch trình**
- Số lượng người tham gia tối thiểu là **1 người**
- Chi phí mỗi người = Tổng chi phí ÷ Số người (làm tròn đến số nguyên)
- Chi phí được tính và hiển thị **riêng theo từng loại tiền tệ**
- Khi lịch trình chưa có dịch vụ nào, phần tóm tắt chi phí **không hiển thị**

### 7.3 Quy tắc Khách sạn

- Phải có **ít nhất 1 loại phòng**
- Số khách tối đa mỗi phòng phải ≥ 1
- Hạng sao từ **1 đến 5**
- **Nhà cung cấp là bắt buộc**

### 7.4 Quy tắc chọn dịch vụ trong Ngày hành trình

| Loại dịch vụ   | Thông tin bắt buộc chọn                                                      |
| -------------- | ---------------------------------------------------------------------------- |
| Khách sạn      | Khách sạn → Giai đoạn giá → Nhóm ngày → Hạng phòng                           |
| Vận chuyển     | Lịch trình → Sức chứa xe                                                     |
| Visa           | Nhà cung cấp → Tên dịch vụ                                                   |
| Phí vào cổng   | Điểm tham quan → Giai đoạn giá → Loại đối tượng → Nhóm ngày → Số lượng (≥ 1) |
| Chuyến bay     | Chuyến bay → Giai đoạn giá → Hạng vé → Nhóm ngày                             |
| Hướng dẫn viên | Hướng dẫn viên                                                               |
| Nhà hàng       | Nhà hàng → Giai đoạn giá → Gói combo → Nhóm ngày                             |

### 7.5 Quy tắc Visa + Fast Track

- Mỗi nhà cung cấp phải có **ít nhất 1 dịch vụ**
- Nhóm dịch vụ gồm 3 loại: **Đón**, **Tiễn**, **Dịch vụ thêm**

### 7.6 Quy tắc trạng thái Active

- Tất cả entity Master Data đều có trạng thái `isActive`
- Có thể toggle bật/tắt **trực tiếp từ danh sách** (không cần vào form chỉnh sửa)

### 7.7 Quy tắc Confirm Tour

- Chỉ **SELLER** và **SALE_MANAGER** mới có thể tạo và submit Confirm Tour
- Khi có Sale Manager trong hệ thống, tour phải qua bước **duyệt** trước khi được confirm
- Không thể chỉnh sửa ConfirmedTour khi đã ở trạng thái `in_operation` trở đi
- ConfirmedTour là **bản sao độc lập** — thay đổi tour mẫu gốc không ảnh hưởng đến tour đã confirm
- Không thể xóa ConfirmedTour khi đã sang trạng thái `in_operation` trở đi

### 7.8 Quy tắc Báo giá ✨ _Mới_

- Chỉ **SELLER** mới có thể tạo và gửi báo giá; **SALE_MANAGER** có thể xem toàn bộ báo giá của team
- Một Quotation có thể được gửi **nhiều phiên bản** — mỗi lần gửi lại tạo một snapshot lịch sử
- Chỉ Quotation ở trạng thái `approved` mới được phép **tạo ConfirmedTour**
- Một Quotation chỉ tạo được **một ConfirmedTour duy nhất** — sau khi tạo, Quotation không thể tạo thêm
- Giá bán (selling price) trong Quotation **không phải giá cost** — Seller tự nhập và chịu trách nhiệm
- Quotation ở trạng thái `sent`, `approved`, `rejected`, `expired` **không được xóa** — chỉ được cập nhật trạng thái

### 7.9 Quy tắc Hủy Tour ✨ _Mới_

- Tour ở trạng thái `completed` **không thể hủy** trong bất kỳ trường hợp nào
- Tour ở trạng thái `in_operation` chỉ được hủy khi có **đồng thời** Sale Manager VÀ Operation Manager duyệt
- Sau khi hủy (`cancelled`), tour **không thể khôi phục** — nếu cần tiếp tục phải tạo mới
- Phiếu hoàn tiền (CancellationRecord) **không thể xóa** sau khi tạo
- Hủy tour không tự động hủy các phiếu thanh toán đã có — Kế toán phải xử lý thủ công

### 7.10 Quy tắc Thanh toán

- **ACCOUNTANT_MANAGER** xem tổng công nợ toàn hệ thống; **ACCOUNTANT** chỉ nhập/cập nhật dữ liệu
- Phiếu chi chỉ được tạo khi dịch vụ đã được Vận hành xác nhận (`confirmed` / `completed`)
- Không được xóa phiếu thanh toán đã ghi nhận — chỉ được cập nhật trạng thái
- Một tour có thể có nhiều đợt thu khác nhau theo thỏa thuận hợp đồng

### 7.11 Quy tắc Dịch vụ thêm (Add-on) và Dịch vụ tự do (Custom)

**Add-on:**

- Add-on thuộc về một entity Master Data cụ thể — không dùng chung giữa các entity khác nhau
- Khi add-on được chọn vào lịch trình, giá được **sao chép tại thời điểm chọn** (snapshot) — thay đổi giá add-on sau đó không ảnh hưởng đến tour đã tạo
- Người dùng **có thể ghi đè giá** khi thêm add-on vào lịch trình (giá gốc từ Master Data vẫn được lưu để tham chiếu)
- Xóa add-on trong Master Data không xóa dịch vụ đã được thêm vào lịch trình

**Custom (Dịch vụ tự do):**

- Dịch vụ custom **không được lưu vào Master Data** — chỉ tồn tại trong lịch trình cụ thể đó
- Tên, giá, tiền tệ đều do người dùng nhập tay tự do
- Không có ràng buộc validate ngoài: tên bắt buộc, giá ≥ 0
- Được tính vào tổng chi phí tour như các dịch vụ khác
- Nếu muốn tái sử dụng nhiều lần → nên tạo add-on trong Master Data thay vì dùng custom

---

## 8. Xử lý lỗi & ngoại lệ

### 8.1 Lỗi validation form

- Sử dụng **Zod schema** + **React Hook Form**
- Lỗi hiển thị ngay dưới field khi rời khỏi trường hoặc nhấn submit
- Thông báo lỗi bằng **tiếng Việt**
- Submit bị **chặn** nếu form còn lỗi

### 8.2 Không tìm thấy dữ liệu (404)

- Khi truy cập trang chỉnh sửa với ID không tồn tại (VD: `/hotel/999/edit`)
- Hệ thống hiển thị: _"Không tìm thấy [tên entity]"_
- Kèm nút **[← Quay lại danh sách]**

### 8.3 Xác nhận trước khi xóa

- Mọi thao tác xóa yêu cầu xác nhận qua **hộp thoại**
- Nếu người dùng hủy → dữ liệu không bị xóa

### 8.4 Lỗi phân quyền (403)

- Người dùng truy cập route không có quyền → điều hướng đến trang `/forbidden`

### 8.5 Chưa đăng nhập (401)

- Không có token hợp lệ → điều hướng về `/auth/login`
- Lưu lại URL gốc (`state.from`) để điều hướng lại sau khi đăng nhập thành công

### 8.6 Lỗi API Country

- Nếu API quốc gia/thành phố thất bại → dropdown trống
- Xử lý tự động bởi **React Query** với cơ chế retry mặc định

### 8.7 Yêu cầu hủy tour bị từ chối ✨ _Mới_

- Khi tour đang `in_operation` và một trong hai manager từ chối hủy:
  - Hệ thống hủy yêu cầu hủy, tour tiếp tục trạng thái `in_operation`
  - Seller và người yêu cầu nhận thông báo kèm lý do từ chối

---

## 9. Ghi chú & giả định

| STT | Mục                             | Ghi chú                                                                                                                                    |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Mock Store**                  | Toàn bộ dữ liệu nghiệp vụ lưu trong RAM. Khi **refresh trang, dữ liệu bị mất**. Đây là giai đoạn phát triển UI trước khi tích hợp backend. |
| 2   | **Authentication**              | Hệ thống xác thực đang được mock cứng với role ADMIN toàn quyền. Cấu trúc JWT đã được chuẩn bị nhưng chưa kích hoạt.                       |
| 3   | **Dashboard**                   | Màn hình Dashboard chưa có nội dung cụ thể. Giả định sẽ hiển thị thống kê tổng quan (số tour, doanh thu, v.v.)                             |
| 4   | **Phân quyền chi tiết**         | Chỉ có enum Role (ADMIN/MANAGER/ACCOUNTANT/SELLER), chưa có code kiểm soát quyền theo từng trang/chức năng.                                |
| 5   | **Visa `code` field**           | Field `code` trong entity Visa đang bị comment out — có thể đang tạm bỏ trong giai đoạn thiết kế.                                          |
| 6   | **Flight `code`/`airlineCode`** | Tương tự, các field `code` và `airlineCode` của Flight bị comment out.                                                                     |
| 7   | **Xuất báo giá**                | Nghiệp vụ "xuất báo giá tour" (PDF / email) chưa có trong source code hiện tại — cần bổ sung khi tích hợp backend.                         |
| 8   | **Backend API**                 | HTTP client (Axios) đã cấu hình với `VITE_API_BASE_URL` — backend đã được thiết kế nhưng chưa tích hợp vào frontend.                       |
| 9   | **Ngôn ngữ giao diện**          | Toàn bộ UI bằng tiếng Việt; tiền tệ hỗ trợ đa quốc gia nhưng ưu tiên VND.                                                                  |
| 10  | **Country API**                 | Dữ liệu quốc gia/thành phố lấy từ **API bên thứ ba** (external service), cấu hình qua `VITE_API_COUNTRY_URL`.                              |
| 11  | **Quotation → Email**           | Luồng gửi báo giá qua email cho khách chưa được định nghĩa trong UI hiện tại. Tạm thời Seller tự xuất/gửi ngoài hệ thống.                  |
| 12  | **Chính sách phí hủy**          | Bảng phí hủy trong mục 3.12 chỉ mang tính tham khảo. Giá trị thực do Kế toán nhập tay theo từng hợp đồng.                                  |

---

_Tài liệu này được tổng hợp và cập nhật từ phân tích source code frontend + thiết kế nghiệp vụ. Mọi thay đổi nghiệp vụ cần được cập nhật đồng bộ._
