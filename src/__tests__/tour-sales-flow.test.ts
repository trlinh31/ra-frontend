/**
 * Unit tests – Full Tour Sales Flow
 *
 * Covers the end-to-end lifecycle:
 *   Quotation (draft → sent → approved)
 *   → ConfirmedTour (draft → pending_approval → confirmed → in_operation → completed)
 *   → CustomerPayment (create → record installments)
 *   → Operations (checklist + logs)
 *   → Edge-cases & guard conditions
 *
 * Run:  npm test
 */

import { beforeEach, describe, expect, it } from "vitest";

import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import { customerPaymentMockStore } from "@/modules/accounting/customerPayment/data/customer-payment.mock-store";
import { operationLogMockStore } from "@/modules/operations/data/operation-log.mock-store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Tạo một quotation đã được approved và trả về ID của nó.
 * Omit: id, code, costTotal, currentVersion, versions, createdAt — không truyền vào create().
 */
function createApprovedQuotation(suffix = "") {
  const q = quotationMockStore.create({
    customerName: `Test Customer${suffix}`,
    customerPhone: "0900000001",
    numberOfPeople: 10,
    itinerary: [],
    sellingPrice: {},
    status: "draft",
    createdBy: "Seller Test",
    note: "",
  });
  quotationMockStore.send(q.id, { VND: 50_000_000 }, "Điều khoản test");
  quotationMockStore.approve(q.id);
  return q.id;
}

// ---------------------------------------------------------------------------
// 1. BÁO GIÁ – Quotation lifecycle
// ---------------------------------------------------------------------------

describe("Báo giá (Quotation)", () => {
  it("tạo báo giá mới ở trạng thái draft", () => {
    const q = quotationMockStore.create({
      customerName: "Công ty ABC",
      customerPhone: "0901111111",
      numberOfPeople: 20,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller A",
      note: "Test note",
    });

    expect(q.id).toBeTruthy();
    expect(q.code).toMatch(/^BG-2026-/);
    expect(q.status).toBe("draft");
    expect(q.currentVersion).toBe(0);
    expect(q.versions).toHaveLength(0);
    expect(q.createdAt).toBeTruthy();
  });

  it("gửi báo giá – trạng thái chuyển sang sent, version tăng lên 1", () => {
    const q = quotationMockStore.create({
      customerName: "Gia đình anh B",
      customerPhone: "0902222222",
      numberOfPeople: 5,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller B",
      note: "",
    });

    quotationMockStore.send(q.id, { VND: 25_000_000 }, "Bao gồm ăn uống và vé");

    const updated = quotationMockStore.getById(q.id)!;
    expect(updated.status).toBe("sent");
    expect(updated.currentVersion).toBe(1);
    expect(updated.versions).toHaveLength(1);
    expect(updated.versions[0].sellingPrice).toEqual({ VND: 25_000_000 });
    expect(updated.sentAt).toBeTruthy();
    expect(updated.sellingPrice).toEqual({ VND: 25_000_000 });
    expect(updated.terms).toBe("Bao gồm ăn uống và vé");
  });

  it("gửi lại lần 2 – version tăng lên 2", () => {
    const q = quotationMockStore.create({
      customerName: "Nhóm du lịch C",
      customerPhone: "0903333333",
      numberOfPeople: 8,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller A",
      note: "",
    });

    quotationMockStore.send(q.id, { VND: 40_000_000 }, undefined, "Giá lần 1");
    quotationMockStore.send(q.id, { VND: 38_000_000 }, undefined, "Điều chỉnh giá");

    const updated = quotationMockStore.getById(q.id)!;
    expect(updated.currentVersion).toBe(2);
    expect(updated.versions).toHaveLength(2);
    expect(updated.sellingPrice).toEqual({ VND: 38_000_000 });
  });

  it("phê duyệt báo giá – trạng thái chuyển sang approved", () => {
    const qId = createApprovedQuotation("_approve_test");
    const q = quotationMockStore.getById(qId)!;

    expect(q.status).toBe("approved");
    expect(q.approvedAt).toBeTruthy();
  });

  it("từ chối báo giá – trạng thái chuyển sang rejected", () => {
    const q = quotationMockStore.create({
      customerName: "Công ty D",
      customerPhone: "0904444444",
      numberOfPeople: 12,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller B",
      note: "",
    });
    quotationMockStore.send(q.id, { VND: 60_000_000 });
    quotationMockStore.close(q.id, "rejected");

    const updated = quotationMockStore.getById(q.id)!;
    expect(updated.status).toBe("rejected");
  });

  it("đánh dấu báo giá hết hạn", () => {
    const q = quotationMockStore.create({
      customerName: "Công ty E",
      customerPhone: "0905555555",
      numberOfPeople: 6,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller A",
      note: "",
    });
    quotationMockStore.send(q.id, { VND: 30_000_000 });
    quotationMockStore.close(q.id, "expired");

    const updated = quotationMockStore.getById(q.id)!;
    expect(updated.status).toBe("expired");
  });

  it("cập nhật thông tin báo giá (số người, ghi chú)", () => {
    const q = quotationMockStore.create({
      customerName: "Công ty F",
      customerPhone: "0906666666",
      numberOfPeople: 10,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller A",
      note: "Ghi chú cũ",
    });

    quotationMockStore.update(q.id, { numberOfPeople: 15, note: "Ghi chú mới" });

    const updated = quotationMockStore.getById(q.id)!;
    expect(updated.numberOfPeople).toBe(15);
    expect(updated.note).toBe("Ghi chú mới");
  });

  it("getAll trả về toàn bộ danh sách", () => {
    const all = quotationMockStore.getAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it("getById trả về undefined với ID không tồn tại", () => {
    const result = quotationMockStore.getById("non-existent-id");
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 2. TOUR ĐÃ CHỐT – ConfirmedTour lifecycle
// ---------------------------------------------------------------------------

describe("Tour đã chốt (ConfirmedTour)", () => {
  it("tạo ConfirmedTour từ Quotation đã duyệt – trạng thái draft", () => {
    const qId = createApprovedQuotation("_ct_create");

    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Công ty TNHH Test",
      numberOfPeople: 10,
      departureDate: "2026-12-01",
      note: "Ghi chú tour",
      createdBy: "Seller Test",
    });

    expect(ct).not.toBeNull();
    expect(ct!.status).toBe("draft");
    expect(ct!.code).toMatch(/^CT-2026-/);
    expect(ct!.quotationId).toBe(qId);
    expect(ct!.createdAt).toBeTruthy();
  });

  it("quotation được liên kết ngược lại sau khi tạo ConfirmedTour", () => {
    const qId = createApprovedQuotation("_link_back");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Test Link",
      numberOfPeople: 8,
      departureDate: "2026-11-15",
      note: "",
      createdBy: "Seller Test",
    });

    const q = quotationMockStore.getById(qId)!;
    expect(q.confirmedTourId).toBe(ct!.id);
  });

  it("không thể tạo ConfirmedTour từ quotation chưa approved", () => {
    const q = quotationMockStore.create({
      customerName: "Khách Draft",
      customerPhone: "0907777777",
      numberOfPeople: 5,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller A",
      note: "",
    });

    const result = confirmedTourMockStore.createFromQuotation(q.id, {
      customerName: "Khách Draft",
      numberOfPeople: 5,
      departureDate: "2026-10-01",
      note: "",
      createdBy: "Seller A",
    });

    expect(result).toBeNull();
  });

  it("không thể tạo ConfirmedTour từ quotation đã có confirmedTourId", () => {
    const qId = createApprovedQuotation("_duplicate_ct");

    // Lần 1 – thành công
    confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Test Dup",
      numberOfPeople: 5,
      departureDate: "2026-10-10",
      note: "",
      createdBy: "Seller Test",
    });

    // Lần 2 – phải trả về null
    const second = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Test Dup",
      numberOfPeople: 5,
      departureDate: "2026-10-10",
      note: "",
      createdBy: "Seller Test",
    });

    expect(second).toBeNull();
  });

  it("gửi phê duyệt: draft → pending_approval", () => {
    const qId = createApprovedQuotation("_submit_approval");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Approval",
      numberOfPeople: 10,
      departureDate: "2026-12-10",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");

    const updated = confirmedTourMockStore.getById(ct.id)!;
    expect(updated.status).toBe("pending_approval");
  });

  it("phê duyệt tour: pending_approval → confirmed", () => {
    const qId = createApprovedQuotation("_approve_ct");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Confirm",
      numberOfPeople: 12,
      departureDate: "2026-12-15",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed", { approvedBy: "u2" });

    const updated = confirmedTourMockStore.getById(ct.id)!;
    expect(updated.status).toBe("confirmed");
    expect(updated.approvedBy).toBe("u2");
  });

  it("từ chối tour: pending_approval → rejected, có thể gửi lại → draft", () => {
    const qId = createApprovedQuotation("_reject_resubmit");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Reject",
      numberOfPeople: 7,
      departureDate: "2026-11-20",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "rejected");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("rejected");

    // Chỉnh sửa lại → draft
    confirmedTourMockStore.updateStatus(ct.id, "draft");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("draft");
  });

  it("bắt đầu vận hành: confirmed → in_operation (assign operator)", () => {
    const qId = createApprovedQuotation("_start_ops");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Ops",
      numberOfPeople: 20,
      departureDate: "2026-12-20",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed");
    confirmedTourMockStore.assign(ct.id, "u6", "Giao cho operator Nguyễn");

    const updated = confirmedTourMockStore.getById(ct.id)!;
    expect(updated.status).toBe("in_operation");
    expect(updated.assignedTo).toBe("u6");
    expect(updated.assignedAt).toBeTruthy();
  });

  it("hoàn thành tour: in_operation → completed", () => {
    const qId = createApprovedQuotation("_complete");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Complete",
      numberOfPeople: 15,
      departureDate: "2026-11-01",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed");
    confirmedTourMockStore.assign(ct.id, "u5", "");
    confirmedTourMockStore.updateStatus(ct.id, "completed");

    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("completed");
  });

  it("hủy tour ở trạng thái draft – thành công", () => {
    const qId = createApprovedQuotation("_cancel_draft");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Cancel Draft",
      numberOfPeople: 5,
      departureDate: "2026-10-15",
      note: "",
      createdBy: "Seller Test",
    })!;

    const result = confirmedTourMockStore.cancel(ct.id, "Khách đổi ý", "Seller Test");
    expect(result.success).toBe(true);
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("cancelled");
  });

  it("không thể hủy tour đã hoàn thành", () => {
    const qId = createApprovedQuotation("_no_cancel_completed");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách No Cancel",
      numberOfPeople: 5,
      departureDate: "2026-10-20",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed");
    confirmedTourMockStore.updateStatus(ct.id, "in_operation");
    confirmedTourMockStore.updateStatus(ct.id, "completed");

    const result = confirmedTourMockStore.cancel(ct.id, "Thử hủy sau hoàn thành", "Admin");
    expect(result.success).toBe(false);
    expect(result.message).toContain("hoàn thành");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("completed");
  });

  it("hủy tour đang vận hành không có force – thất bại", () => {
    const qId = createApprovedQuotation("_cancel_ops_no_force");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Cancel Ops",
      numberOfPeople: 10,
      departureDate: "2026-10-25",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed");
    confirmedTourMockStore.assign(ct.id, "u6", "");

    const result = confirmedTourMockStore.cancel(ct.id, "Khẩn cấp", "Sale Manager");
    expect(result.success).toBe(false);
    expect(result.message).toContain("vận hành");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("in_operation");
  });

  it("hủy tour đang vận hành CÓ force=true – thành công", () => {
    const qId = createApprovedQuotation("_cancel_ops_force");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Force Cancel",
      numberOfPeople: 10,
      departureDate: "2026-10-28",
      note: "",
      createdBy: "Seller Test",
    })!;

    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed");
    confirmedTourMockStore.assign(ct.id, "u6", "");

    const result = confirmedTourMockStore.cancel(ct.id, "Thiên tai", "Sale Manager", true);
    expect(result.success).toBe(true);

    const updated = confirmedTourMockStore.getById(ct.id)!;
    expect(updated.status).toBe("cancelled");
    expect(updated.cancellationReason).toBe("Thiên tai");
    expect(updated.cancelledBy).toBe("Sale Manager");
    expect(updated.cancelledAt).toBeTruthy();
  });

  it("tạo ConfirmedTour trực tiếp (không qua quotation)", () => {
    const ct = confirmedTourMockStore.create({
      customerName: "Khách Direct",
      numberOfPeople: 6,
      departureDate: "2026-09-10",
      itinerary: [],
      status: "draft",
      note: "Tạo trực tiếp",
      createdBy: "Seller Test",
    });

    expect(ct.id).toBeTruthy();
    expect(ct.code).toMatch(/^CT-2026-/);
    expect(ct.quotationId).toBeUndefined();
    expect(ct.status).toBe("draft");
  });
});

// ---------------------------------------------------------------------------
// 3. SERVICE CHECKLIST – Operations
// ---------------------------------------------------------------------------

describe("Service Checklist (Vận hành)", () => {
  it("initChecklist khởi tạo tất cả service về pending với itinerary rỗng", () => {
    const qId = createApprovedQuotation("_checklist_init");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Checklist",
      numberOfPeople: 10,
      departureDate: "2026-12-05",
      note: "",
      createdBy: "Seller Test",
    })!;

    // Itinerary rỗng → checklist sau init cũng rỗng (không có service nào)
    confirmedTourMockStore.initChecklist(ct.id);
    const updated = confirmedTourMockStore.getById(ct.id)!;
    expect(updated.serviceChecklist).toBeDefined();
    expect(Object.keys(updated.serviceChecklist!)).toHaveLength(0);
  });

  it("initChecklist không ghi đè nếu checklist đã tồn tại", () => {
    // ct3 trong seed đã có serviceChecklist được khởi tạo sẵn
    const ctBefore = confirmedTourMockStore.getById("ct3")!;
    const existingChecklist = { ...ctBefore.serviceChecklist };

    confirmedTourMockStore.initChecklist("ct3");

    const ctAfter = confirmedTourMockStore.getById("ct3")!;
    expect(ctAfter.serviceChecklist).toEqual(existingChecklist);
  });

  it("updateServiceStatus cập nhật trạng thái một service trong ct3", () => {
    const ct = confirmedTourMockStore.getById("ct3")!;
    const firstServiceId = Object.keys(ct.serviceChecklist!)[0];

    confirmedTourMockStore.updateServiceStatus("ct3", firstServiceId, "issue");

    const updated = confirmedTourMockStore.getById("ct3")!;
    expect(updated.serviceChecklist![firstServiceId]).toBe("issue");
  });

  it("updateServiceStatus: pending → confirmed → done (vòng đời một dịch vụ)", () => {
    // Tạo CT với itinerary rỗng, thêm service trực tiếp vào checklist qua updateServiceStatus
    const ct = confirmedTourMockStore.create({
      customerName: "Khách Service Flow",
      numberOfPeople: 5,
      departureDate: "2026-12-25",
      itinerary: [],
      status: "in_operation",
      note: "",
      createdBy: "Seller Test",
    });

    // updateServiceStatus hoạt động với bất kỳ key nào, không cần service tồn tại trong itinerary
    confirmedTourMockStore.updateServiceStatus(ct.id, "svc-001", "pending");
    expect(confirmedTourMockStore.getById(ct.id)!.serviceChecklist!["svc-001"]).toBe("pending");

    confirmedTourMockStore.updateServiceStatus(ct.id, "svc-001", "confirmed");
    expect(confirmedTourMockStore.getById(ct.id)!.serviceChecklist!["svc-001"]).toBe("confirmed");

    confirmedTourMockStore.updateServiceStatus(ct.id, "svc-001", "done");
    expect(confirmedTourMockStore.getById(ct.id)!.serviceChecklist!["svc-001"]).toBe("done");
  });

  it("updateServiceStatus: đánh dấu sự cố (issue)", () => {
    const ct = confirmedTourMockStore.create({
      customerName: "Khách Issue Test",
      numberOfPeople: 8,
      departureDate: "2026-12-26",
      itinerary: [],
      status: "in_operation",
      note: "",
      createdBy: "Seller Test",
    });

    confirmedTourMockStore.updateServiceStatus(ct.id, "svc-002", "issue");
    expect(confirmedTourMockStore.getById(ct.id)!.serviceChecklist!["svc-002"]).toBe("issue");
  });
});

// ---------------------------------------------------------------------------
// 4. NHẬT KÝ VẬN HÀNH – Operation Logs
// ---------------------------------------------------------------------------

describe("Nhật ký vận hành (Operation Logs)", () => {
  let testTourId: string;

  beforeEach(() => {
    // Tạo một CT mới làm tour để gắn log test, tránh ảnh hưởng seed data
    const ct = confirmedTourMockStore.create({
      customerName: "Khách Log Test",
      numberOfPeople: 5,
      departureDate: "2026-11-05",
      itinerary: [],
      status: "in_operation",
      note: "",
      createdBy: "Seller Test",
    });
    testTourId = ct.id;
  });

  it("thêm nhật ký ghi chú (note)", () => {
    const log = operationLogMockStore.add({
      confirmedTourId: testTourId,
      type: "note",
      content: "Đã xác nhận khách sạn",
      createdBy: "Nguyễn Operator",
    });

    expect(log.id).toBeTruthy();
    expect(log.type).toBe("note");
    expect(log.confirmedTourId).toBe(testTourId);
    expect(log.createdAt).toBeTruthy();
  });

  it("thêm nhật ký sự cố (incident)", () => {
    const log = operationLogMockStore.add({
      confirmedTourId: testTourId,
      type: "incident",
      content: "2 khách bị say xe",
      createdBy: "Nguyễn Operator",
    });

    expect(log.type).toBe("incident");
  });

  it("thêm nhật ký thay đổi (change)", () => {
    const log = operationLogMockStore.add({
      confirmedTourId: testTourId,
      type: "change",
      content: "Đổi xe 16 chỗ sang 29 chỗ",
      createdBy: "Nguyễn Operator",
    });

    expect(log.type).toBe("change");
  });

  it("getByTourId chỉ trả về log của tour đó, không lẫn tour khác", () => {
    operationLogMockStore.add({
      confirmedTourId: testTourId,
      type: "note",
      content: "Log thuộc tour này",
      createdBy: "Operator A",
    });
    operationLogMockStore.add({
      confirmedTourId: "ct3", // tour khác từ seed
      type: "note",
      content: "Log thuộc tour khác",
      createdBy: "Operator B",
    });

    const logs = operationLogMockStore.getByTourId(testTourId);
    expect(logs.every((l) => l.confirmedTourId === testTourId)).toBe(true);
  });

  it("getByTourId trả về log theo thứ tự mới nhất trước", () => {
    operationLogMockStore.add({ confirmedTourId: testTourId, type: "note", content: "Log 1", createdBy: "Op" });
    operationLogMockStore.add({ confirmedTourId: testTourId, type: "note", content: "Log 2", createdBy: "Op" });
    operationLogMockStore.add({ confirmedTourId: testTourId, type: "note", content: "Log 3", createdBy: "Op" });

    const logs = operationLogMockStore.getByTourId(testTourId);
    expect(logs.length).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < logs.length - 1; i++) {
      expect(logs[i].createdAt >= logs[i + 1].createdAt).toBe(true);
    }
  });

  it("xóa log – log không còn trong danh sách", () => {
    const log = operationLogMockStore.add({
      confirmedTourId: testTourId,
      type: "note",
      content: "Log cần xóa",
      createdBy: "Operator A",
    });

    operationLogMockStore.delete(log.id);

    const logs = operationLogMockStore.getByTourId(testTourId);
    expect(logs.find((l) => l.id === log.id)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 5. THANH TOÁN KHÁCH HÀNG – Customer Payment
// ---------------------------------------------------------------------------

describe("Thanh toán khách hàng (Customer Payment)", () => {
  let ctId: string;
  let ctCode: string;

  beforeEach(() => {
    const qId = createApprovedQuotation("_payment_test");
    const ct = confirmedTourMockStore.createFromQuotation(qId, {
      customerName: "Khách Payment",
      numberOfPeople: 10,
      departureDate: "2026-12-01",
      note: "",
      createdBy: "Seller Test",
    })!;
    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    confirmedTourMockStore.updateStatus(ct.id, "confirmed");
    ctId = ct.id;
    ctCode = ct.code;
  });

  it("tạo phiếu thu với các đợt thanh toán", () => {
    const payment = customerPaymentMockStore.create({
      confirmedTourId: ctId,
      confirmedTourCode: ctCode,
      customerName: "Khách Payment",
      totalAmount: 50_000_000,
      currency: "VND",
      installments: [
        {
          id: "tmp-1",
          label: "Đặt cọc 30%",
          dueDate: "2026-11-01",
          expectedAmount: 15_000_000,
          status: "pending",
          note: "",
        },
        {
          id: "tmp-2",
          label: "Thanh toán còn lại",
          dueDate: "2026-11-25",
          expectedAmount: 35_000_000,
          status: "pending",
          note: "",
        },
      ],
      createdBy: "Kế toán Test",
    });

    expect(payment.id).toBeTruthy();
    expect(payment.confirmedTourId).toBe(ctId);
    expect(payment.installments).toHaveLength(2);
    expect(payment.installments[0].status).toBe("pending");
    expect(payment.createdAt).toBeTruthy();
  });

  it("ghi nhận thanh toán một đợt – trạng thái đổi sang paid", () => {
    const payment = customerPaymentMockStore.create({
      confirmedTourId: ctId,
      confirmedTourCode: ctCode,
      customerName: "Khách Payment 2",
      totalAmount: 30_000_000,
      currency: "VND",
      installments: [
        {
          id: "tmp-1",
          label: "Đặt cọc",
          dueDate: "2026-11-10",
          expectedAmount: 9_000_000,
          status: "pending",
          note: "",
        },
      ],
      createdBy: "Kế toán Test",
    });

    const installmentId = payment.installments[0].id;

    customerPaymentMockStore.recordInstallmentPayment(payment.id, installmentId, {
      actualAmount: 9_000_000,
      paidAt: "2026-11-09",
      paymentMethod: "bank_transfer",
      note: "Chuyển khoản đủ",
    });

    const updated = customerPaymentMockStore.getById(payment.id)!;
    const inst = updated.installments.find((i) => i.id === installmentId)!;
    expect(inst.status).toBe("paid");
    expect(inst.actualAmount).toBe(9_000_000);
    expect(inst.paymentMethod).toBe("bank_transfer");
    expect(inst.paidAt).toBe("2026-11-09");
  });

  it("thanh toán thiếu – trạng thái partial", () => {
    const payment = customerPaymentMockStore.create({
      confirmedTourId: ctId,
      confirmedTourCode: ctCode,
      customerName: "Khách Partial",
      totalAmount: 20_000_000,
      currency: "VND",
      installments: [
        {
          id: "tmp-1",
          label: "Đặt cọc",
          dueDate: "2026-11-20",
          expectedAmount: 6_000_000,
          status: "pending",
          note: "",
        },
      ],
      createdBy: "Kế toán Test",
    });

    const installmentId = payment.installments[0].id;

    customerPaymentMockStore.recordInstallmentPayment(payment.id, installmentId, {
      actualAmount: 3_000_000,
      paidAt: "2026-11-19",
      paymentMethod: "cash",
      note: "Chưa đủ tiền",
    });

    const updated = customerPaymentMockStore.getById(payment.id)!;
    const inst = updated.installments.find((i) => i.id === installmentId)!;
    expect(inst.status).toBe("partial");
    expect(inst.actualAmount).toBe(3_000_000);
  });

  it("getByTourId trả về phiếu thu của tour", () => {
    customerPaymentMockStore.create({
      confirmedTourId: ctId,
      confirmedTourCode: ctCode,
      customerName: "Khách TourId",
      totalAmount: 10_000_000,
      currency: "VND",
      installments: [],
      createdBy: "Kế toán Test",
    });

    const found = customerPaymentMockStore.getByTourId(ctId);
    expect(found).toBeDefined();
    expect(found!.confirmedTourId).toBe(ctId);
  });

  it("getAll trả về tất cả phiếu thu", () => {
    const all = customerPaymentMockStore.getAll();
    expect(all.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 6. LUỒNG ĐẦY ĐỦ (End-to-End)
// ---------------------------------------------------------------------------

describe("Luồng đầy đủ (End-to-End Tour Sales Flow)", () => {
  it("hoàn thành toàn bộ quy trình: draft → sent → approved → CT → confirmed → in_operation → completed + payment", () => {
    // BƯỚC 1: Sale tạo báo giá
    const q = quotationMockStore.create({
      customerName: "Tập đoàn E2E Corp",
      customerPhone: "0988000000",
      customerEmail: "e2e@corp.com",
      numberOfPeople: 25,
      itinerary: [],
      sellingPrice: {},
      status: "draft",
      createdBy: "Seller E2E",
      note: "Tour thử nghiệm end-to-end",
    });
    expect(q.status).toBe("draft");

    // BƯỚC 2: Gửi báo giá
    quotationMockStore.send(q.id, { VND: 125_000_000 }, "Bao gồm toàn bộ dịch vụ");
    expect(quotationMockStore.getById(q.id)!.status).toBe("sent");

    // BƯỚC 3: Manager duyệt báo giá
    quotationMockStore.approve(q.id);
    expect(quotationMockStore.getById(q.id)!.status).toBe("approved");

    // BƯỚC 4: Sale tạo Confirmed Tour từ báo giá
    const ct = confirmedTourMockStore.createFromQuotation(q.id, {
      customerName: "Tập đoàn E2E Corp",
      numberOfPeople: 25,
      departureDate: "2026-12-28",
      note: "Tour cuối năm",
      createdBy: "Seller E2E",
    })!;
    expect(ct).not.toBeNull();
    expect(ct.status).toBe("draft");
    expect(quotationMockStore.getById(q.id)!.confirmedTourId).toBe(ct.id);

    // BƯỚC 5: Gửi phê duyệt
    confirmedTourMockStore.updateStatus(ct.id, "pending_approval");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("pending_approval");

    // BƯỚC 6: Manager duyệt Confirmed Tour
    confirmedTourMockStore.updateStatus(ct.id, "confirmed", { approvedBy: "u2" });
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("confirmed");

    // BƯỚC 7: Kế toán tạo phiếu thu
    const payment = customerPaymentMockStore.create({
      confirmedTourId: ct.id,
      confirmedTourCode: ct.code,
      customerName: "Tập đoàn E2E Corp",
      customerPhone: "0988000000",
      totalAmount: 125_000_000,
      currency: "VND",
      installments: [
        {
          id: "tmp-e2e-1",
          label: "Đặt cọc 30%",
          dueDate: "2026-11-28",
          expectedAmount: 37_500_000,
          status: "pending",
          note: "",
        },
        {
          id: "tmp-e2e-2",
          label: "Thanh toán còn lại",
          dueDate: "2026-12-21",
          expectedAmount: 87_500_000,
          status: "pending",
          note: "",
        },
      ],
      createdBy: "Kế toán E2E",
    });
    expect(payment.installments).toHaveLength(2);

    // BƯỚC 8: Khách đặt cọc
    customerPaymentMockStore.recordInstallmentPayment(payment.id, payment.installments[0].id, {
      actualAmount: 37_500_000,
      paidAt: "2026-11-27",
      paymentMethod: "bank_transfer",
      note: "Đặt cọc đúng hạn",
    });
    expect(customerPaymentMockStore.getById(payment.id)!.installments[0].status).toBe("paid");

    // BƯỚC 9: Bắt đầu vận hành tour
    confirmedTourMockStore.assign(ct.id, "u6", "Giao cho Nguyễn Thị Mai");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("in_operation");

    // BƯỚC 10: Operator ghi nhật ký
    const log = operationLogMockStore.add({
      confirmedTourId: ct.id,
      type: "note",
      content: "Đoàn khách đã tập trung, xuất phát đúng giờ.",
      createdBy: "Nguyễn Thị Mai",
    });
    expect(operationLogMockStore.getByTourId(ct.id).some((l) => l.id === log.id)).toBe(true);

    // BƯỚC 11: Khách thanh toán nốt
    customerPaymentMockStore.recordInstallmentPayment(payment.id, payment.installments[1].id, {
      actualAmount: 87_500_000,
      paidAt: "2026-12-20",
      paymentMethod: "bank_transfer",
      note: "Thanh toán đủ trước khi đi",
    });
    expect(customerPaymentMockStore.getById(payment.id)!.installments[1].status).toBe("paid");

    // BƯỚC 12: Hoàn thành tour
    confirmedTourMockStore.updateStatus(ct.id, "completed");
    expect(confirmedTourMockStore.getById(ct.id)!.status).toBe("completed");

    // BƯỚC 13: Không thể hủy sau khi hoàn thành
    const cancelResult = confirmedTourMockStore.cancel(ct.id, "Thử hủy", "Admin");
    expect(cancelResult.success).toBe(false);
  });
});
