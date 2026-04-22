import { quotationMockStore } from "@/modules/sales/quotation/data/quotation.mock-store";
import { QUOTATION_STATUS_LABEL } from "@/modules/sales/quotation/constants/quotation.constant";
import type { Quotation } from "@/modules/sales/quotation/types/quotation.type";
import type { TourItineraryItem } from "@/modules/tour/tour/types/tour.type";
import { SERVICE_TYPE_CONFIG } from "@/modules/tour/day/types/day.type";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function today() {
  return formatDate(new Date().toISOString().slice(0, 10));
}

function computeCostByDay(itinerary: TourItineraryItem[]) {
  return itinerary.map((item, idx) => {
    if (item.kind === "day") {
      const byCurrency: Record<string, number> = {};
      for (const svc of item.services) {
        if (!svc.unitPrice || !svc.currency) continue;
        byCurrency[svc.currency] = (byCurrency[svc.currency] ?? 0) + svc.unitPrice;
      }
      return { label: `Ngày ${idx + 1}: ${item.title}`, byCurrency };
    } else {
      return {
        label: `Nhóm Tour: ${item.name}`,
        byCurrency: item.unitPrice && item.currency ? { [item.currency]: item.unitPrice } : {},
      };
    }
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PrintRow({ label, value }: { label: string; value?: string }) {
  return (
    <tr>
      <td style={{ width: "38%", padding: "5px 8px", fontWeight: 600, color: "#374151", verticalAlign: "top", whiteSpace: "nowrap" }}>
        {label}
      </td>
      <td style={{ padding: "5px 8px", color: "#111827", verticalAlign: "top" }}>{value ?? "—"}</td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuotationPrintPage() {
  const { id } = useParams<{ id: string }>();
  const quotation: Quotation | undefined = id ? quotationMockStore.getById(id) : undefined;

  // Tự động mở dialog in sau khi trang load xong
  useEffect(() => {
    if (!quotation) return;
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, [quotation]);

  if (!quotation) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif", color: "#6b7280" }}>
        Không tìm thấy báo giá.
      </div>
    );
  }

  const costEntries = Object.entries(quotation.costTotal);
  const sellingEntries = Object.entries(quotation.sellingPrice);
  const dayBreakdown = computeCostByDay(quotation.itinerary);
  const hasItinerary = quotation.itinerary.length > 0;
  const versionLabel =
    quotation.currentVersion > 0
      ? `Phiên bản ${quotation.currentVersion} — Gửi ngày ${formatDate(quotation.sentAt)}`
      : "Bản nháp";

  const statusColor =
    quotation.status === "approved"
      ? "#15803d"
      : quotation.status === "sent"
      ? "#1d4ed8"
      : "#6b7280";

  return (
    <>
      {/* ── Print-only global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif;
          font-size: 13px;
          color: #111827;
          background: #f3f4f6;
        }

        .page-wrapper {
          background: white;
          max-width: 800px;
          margin: 32px auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          border-radius: 8px;
          overflow: hidden;
        }

        @media print {
          body { background: white; }
          .page-wrapper {
            margin: 0;
            box-shadow: none;
            border-radius: 0;
            max-width: 100%;
          }
          .no-print { display: none !important; }
          @page {
            size: A4;
            margin: 15mm 12mm;
          }
        }

        /* ── Typography ── */
        h1 { font-size: 22px; font-weight: 800; }
        h2 { font-size: 14px; font-weight: 700; }
        h3 { font-size: 13px; font-weight: 600; }

        /* ── Section heading ── */
        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4f46e5;
          border-bottom: 2px solid #e0e7ff;
          padding-bottom: 6px;
          margin-bottom: 14px;
        }

        /* ── Table base ── */
        table { border-collapse: collapse; width: 100%; }
        th { text-align: left; }

        /* ── Info table ── */
        .info-table td { padding: 5px 8px; }
        .info-table tr:nth-child(even) { background: #f9fafb; }

        /* ── Itinerary ── */
        .day-block { margin-bottom: 18px; page-break-inside: avoid; }
        .day-header {
          background: #f0f0ff;
          padding: 7px 12px;
          border-left: 4px solid #6366f1;
          border-radius: 0 4px 4px 0;
          font-weight: 700;
          font-size: 13px;
          color: #312e81;
          margin-bottom: 6px;
        }
        .day-location {
          font-size: 11px;
          color: #6b7280;
          margin-left: 2px;
          margin-bottom: 6px;
        }
        .day-desc {
          font-size: 12px;
          color: #374151;
          margin-bottom: 8px;
          margin-left: 4px;
          font-style: italic;
        }
        .svc-table th {
          background: #f3f4f6;
          padding: 5px 10px;
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
        }
        .svc-table td {
          padding: 5px 10px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 12px;
          vertical-align: top;
        }
        .svc-table tr:last-child td { border-bottom: none; }
        .svc-type-badge {
          display: inline-block;
          font-size: 10px;
          background: #ede9fe;
          color: #5b21b6;
          border-radius: 4px;
          padding: 1px 6px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ── Cost table ── */
        .cost-table th {
          background: #1e1b4b;
          color: white;
          padding: 8px 12px;
          font-size: 12px;
        }
        .cost-table td {
          padding: 7px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .cost-table tr:last-child td { border-bottom: none; }
        .cost-subtotal td { background: #f9fafb; font-weight: 600; }

        /* ── Selling price highlight ── */
        .selling-box {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border: 1.5px solid #6ee7b7;
          border-radius: 8px;
          padding: 14px 18px;
        }

        /* ── Terms ── */
        .terms-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 12px;
          color: #374151;
          white-space: pre-wrap;
          line-height: 1.7;
        }

        /* ── Signature ── */
        .sig-col {
          text-align: center;
          padding: 0 20px;
        }
        .sig-line {
          border-top: 1.5px solid #9ca3af;
          margin-top: 50px;
          padding-top: 6px;
          font-size: 11px;
          color: #6b7280;
        }
      `}</style>

      {/* ── Print button (only visible on screen) ── */}
      <div
        className='no-print'
        style={{ position: "fixed", top: 16, right: 16, zIndex: 100, display: "flex", gap: 8 }}>
        <button
          onClick={() => window.print()}
          style={{
            background: "#4f46e5", color: "white", border: "none",
            padding: "10px 22px", borderRadius: 8, cursor: "pointer",
            fontWeight: 700, fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}>
          🖨️ In / Xuất PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db",
            padding: "10px 18px", borderRadius: 8, cursor: "pointer",
            fontWeight: 600, fontSize: 14,
          }}>
          Đóng
        </button>
      </div>

      {/* ── Document ── */}
      <div className='page-wrapper'>

        {/* ═══ HEADER ═══ */}
        <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)", padding: "28px 36px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: "#a5b4fc", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                RA Travel
              </div>
              <h1 style={{ color: "white", fontSize: 24, lineHeight: 1.2, marginBottom: 4 }}>
                BÁO GIÁ TOUR DU LỊCH
              </h1>
              <div style={{ color: "#c7d2fe", fontSize: 12, marginTop: 6 }}>
                {versionLabel}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                background: "rgba(255,255,255,0.15)", borderRadius: 8,
                padding: "10px 18px", border: "1px solid rgba(255,255,255,0.25)"
              }}>
                <div style={{ color: "#a5b4fc", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>MÃ BÁO GIÁ</div>
                <div style={{ color: "white", fontSize: 20, fontWeight: 800, marginTop: 2 }}>{quotation.code}</div>
                <div style={{ color: "#c7d2fe", fontSize: 11, marginTop: 4 }}>Ngày lập: {today()}</div>
              </div>
              <div style={{
                marginTop: 8,
                display: "inline-block",
                background: quotation.status === "approved" ? "#bbf7d0" : quotation.status === "sent" ? "#bfdbfe" : "#e5e7eb",
                color: statusColor,
                borderRadius: 20,
                padding: "3px 14px",
                fontSize: 11,
                fontWeight: 700,
              }}>
                {QUOTATION_STATUS_LABEL[quotation.status]}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BODY ═══ */}
        <div style={{ padding: "28px 36px" }}>

          {/* ── Thông tin khách hàng + Tour ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>

            {/* Khách hàng */}
            <div>
              <div className='section-title'>Thông tin khách hàng</div>
              <table className='info-table' style={{ border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
                <tbody>
                  <PrintRow label="Tên đoàn / Khách hàng" value={quotation.customerName} />
                  <PrintRow label="Email liên hệ" value={quotation.customerEmail} />
                  <PrintRow label="Số điện thoại" value={quotation.customerPhone} />
                  <PrintRow label="Số khách dự kiến" value={`${quotation.numberOfPeople} người`} />
                  <PrintRow label="Ngày khởi hành" value={formatDate(quotation.departureDateEst)} />
                </tbody>
              </table>
            </div>

            {/* Thông tin tour */}
            <div>
              <div className='section-title'>Thông tin chuyến đi</div>
              <table className='info-table' style={{ border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
                <tbody>
                  {quotation.tourTemplateName && <PrintRow label="Tour mẫu" value={quotation.tourTemplateName} />}
                  <PrintRow label="Số lượng ngày" value={hasItinerary ? `${quotation.itinerary.filter(i => i.kind === "day").length} ngày` : "—"} />
                  <PrintRow label="Người tạo báo giá" value={quotation.createdBy} />
                  <PrintRow label="Ngày tạo" value={formatDate(quotation.createdAt)} />
                  {quotation.sentAt && <PrintRow label="Ngày gửi gần nhất" value={formatDate(quotation.sentAt)} />}
                </tbody>
              </table>

              {quotation.note && (
                <div style={{ marginTop: 12, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0369a1", marginBottom: 4 }}>📋 Ghi chú yêu cầu đặc biệt</div>
                  <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{quotation.note}</div>
                </div>
              )}
            </div>
          </div>

          {/* ── Lịch trình ── */}
          {hasItinerary && (
            <div style={{ marginBottom: 28 }}>
              <div className='section-title'>Chương trình du lịch chi tiết</div>
              {quotation.itinerary.map((item, idx) => {
                if (item.kind === "day") {
                  return (
                    <div key={idx} className='day-block'>
                      <div className='day-header'>
                        Ngày {idx + 1}: {item.title}
                      </div>
                      {(item.country || item.city) && (
                        <div className='day-location'>
                          📍 {[item.city, item.country].filter(Boolean).join(", ")}
                        </div>
                      )}
                      {item.description && (
                        <div className='day-desc'>{item.description}</div>
                      )}
                      {item.services.length > 0 ? (
                        <table className='svc-table' style={{ border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                          <thead>
                            <tr>
                              <th style={{ width: "30%" }}>Loại dịch vụ</th>
                              <th>Tên dịch vụ</th>
                              <th style={{ textAlign: "right", width: "22%" }}>Đơn giá</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.services.map((svc, si) => (
                              <tr key={si}>
                                <td>
                                  <span className='svc-type-badge'>
                                    {SERVICE_TYPE_CONFIG[svc.serviceType]?.label ?? svc.serviceType}
                                  </span>
                                </td>
                                <td>{svc.name}</td>
                                <td style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>
                                  {svc.unitPrice ? `${formatNumberVN(svc.unitPrice)} ${svc.currency}` : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", paddingLeft: 4 }}>
                          Chưa có dịch vụ trong ngày này
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // group_tour
                  return (
                    <div key={idx} className='day-block'>
                      <div className='day-header' style={{ background: "#fef3c7", borderLeftColor: "#f59e0b", color: "#78350f" }}>
                        Nhóm Tour: {item.name}
                      </div>
                      <table className='svc-table' style={{ border: "1px solid #e5e7eb", borderRadius: 4, overflow: "hidden" }}>
                        <thead>
                          <tr>
                            <th>Loại</th>
                            <th>Tên</th>
                            <th style={{ textAlign: "right" }}>Đơn giá</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className='svc-type-badge' style={{ background: "#fef3c7", color: "#92400e" }}>Nhóm Tour</span></td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: "right", fontWeight: 600 }}>
                              {item.unitPrice ? `${formatNumberVN(item.unitPrice)} ${item.currency}` : "—"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {/* ── Bảng chi phí ── */}
          {(costEntries.length > 0 || sellingEntries.length > 0) && (
            <div style={{ marginBottom: 28 }}>
              <div className='section-title'>Bảng tổng hợp chi phí</div>
              <table className='cost-table' style={{ border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
                <thead>
                  <tr>
                    <th>Hạng mục</th>
                    <th style={{ textAlign: "right" }}>Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Chi phí theo từng ngày */}
                  {dayBreakdown.map((d, i) =>
                    Object.entries(d.byCurrency).map(([cur, amt]) => (
                      <tr key={`${i}-${cur}`}>
                        <td style={{ color: "#374151" }}>{d.label}</td>
                        <td style={{ textAlign: "right", fontWeight: 500 }}>
                          {formatNumberVN(amt)} {cur}
                        </td>
                      </tr>
                    ))
                  )}
                  {/* Dòng tổng cộng */}
                  {costEntries.map(([cur, amt]) => (
                    <tr key={cur} className='cost-subtotal'>
                      <td>Tổng chi phí ({cur})</td>
                      <td style={{ textAlign: "right", fontSize: 15 }}>
                        {formatNumberVN(amt)} {cur}
                      </td>
                    </tr>
                  ))}
                  {/* Chi phí / người */}
                  {costEntries.map(([cur, amt]) => {
                    const perPerson = Math.round(amt / quotation.numberOfPeople);
                    return (
                      <tr key={`pp-${cur}`}>
                        <td style={{ color: "#6b7280", fontSize: 12 }}>
                          Giá cost / người ({quotation.numberOfPeople} khách)
                        </td>
                        <td style={{ textAlign: "right", color: "#6b7280", fontSize: 12 }}>
                          {formatNumberVN(perPerson)} {cur}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Giá bán */}
              {sellingEntries.length > 0 && (
                <div className='selling-box'>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#065f46", marginBottom: 10 }}>
                    💰 GIÁ BÁN ĐỀ XUẤT CHO KHÁCH
                  </div>
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    {sellingEntries.map(([cur, amt]) => (
                      <div key={cur}>
                        <div style={{ fontSize: 11, color: "#065f46", fontWeight: 600, marginBottom: 2 }}>Tổng đoàn</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#065f46" }}>
                          {formatNumberVN(amt)} <span style={{ fontSize: 14 }}>{cur}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#047857", marginTop: 2 }}>
                          ≈ {formatNumberVN(Math.round(amt / quotation.numberOfPeople))} {cur} / người
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Điều khoản ── */}
          {quotation.terms && (
            <div style={{ marginBottom: 28 }}>
              <div className='section-title'>Điều khoản báo giá</div>
              <div className='terms-box'>{quotation.terms}</div>
            </div>
          )}

          {/* ── Chữ ký ── */}
          <div style={{ marginBottom: 8 }}>
            <div className='section-title'>Xác nhận</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div className='sig-col'>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Đại diện Công ty</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>RA Travel</div>
                <div className='sig-line'>Họ tên & Chữ ký</div>
              </div>
              <div className='sig-col'>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Đại diện Khách hàng</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{quotation.customerName}</div>
                <div className='sig-line'>Họ tên & Chữ ký</div>
              </div>
            </div>
          </div>

        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{
          background: "#1e1b4b", color: "#a5b4fc",
          padding: "14px 36px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 11,
        }}>
          <div>RA Travel — Hệ thống quản lý nghiệp vụ du lịch</div>
          <div style={{ textAlign: "right" }}>
            <div>Mã báo giá: {quotation.code} | {versionLabel}</div>
            <div style={{ marginTop: 2, color: "#818cf8" }}>Tài liệu được tạo tự động — {today()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
