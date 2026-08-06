import dayjs from 'dayjs';
import { formatCurrency } from '../utils/constants';

/**
 * Builds printable rent invoice HTML with hostel name and payment details.
 */
const buildInvoiceHtml = (payment, options = { autoPrint: false }) => {
  if (!payment) return null;

  const tenantName = payment.tenant?.user
    ? `${payment.tenant.user.first_name || ''} ${payment.tenant.user.last_name || ''}`.trim()
    : '—';
  const tenantPhone = payment.tenant?.user?.phone || payment.tenant?.phone || '—';
  const tenantEmail = payment.tenant?.user?.email || '—';
  const hostelName = payment.hostel?.name || 'Vita Stay Hostel';
  const hostelAddress = [payment.hostel?.address, payment.hostel?.city, payment.hostel?.state, payment.hostel?.pincode]
    .filter(Boolean)
    .join(', ') || '—';
  const hostelPhone = payment.hostel?.contact_phone || payment.hostel?.phone || '—';
  const hostelEmail = payment.hostel?.contact_email || payment.hostel?.email || '';
  const roomNumber = payment.room?.room_number || '—';
  const total = parseFloat(payment.total_amount || 0);
  const paid = parseFloat(payment.paid_amount || 0);
  const balance = Math.max(0, total - paid);
  const status = (payment.status || 'pending').replace(/_/g, ' ');
  const invoiceNo = payment.invoice_number || payment.receipt_number || `INV-${payment.id}`;
  const monthLabel = payment.month_year || '—';
  const dueDate = payment.due_date ? dayjs(payment.due_date).format('DD MMM YYYY') : '—';
  const paidDate = payment.paid_date ? dayjs(payment.paid_date).format('DD MMM YYYY') : '—';
  const method = payment.payment_method
    ? payment.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : '—';
  const printedAt = dayjs().format('DD MMM YYYY, HH:mm');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Rent Invoice - ${hostelName} - ${monthLabel}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      color: #1C2B3A;
      margin: 0;
      padding: 32px;
      background: #fff;
    }
    .invoice {
      max-width: 720px;
      margin: 0 auto;
      border: 1px solid #d0d7de;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #002D62 0%, #008F7A 100%);
      color: #fff;
      padding: 28px 32px;
    }
    .header h1 {
      margin: 0 0 6px;
      font-size: 26px;
      letter-spacing: 0.02em;
    }
    .header .sub {
      opacity: 0.9;
      font-size: 13px;
      line-height: 1.5;
    }
    .badge {
      display: inline-block;
      margin-top: 14px;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.18);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .body { padding: 28px 32px; }
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
    }
    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7c8f;
      margin-bottom: 4px;
    }
    .value { font-size: 15px; font-weight: 600; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 24px;
    }
    th, td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid #e8eef3;
      font-size: 14px;
    }
    th {
      background: #f4f8fb;
      color: #4a5d73;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td.amount, th.amount { text-align: right; }
    .totals {
      margin-left: auto;
      width: 280px;
    }
    .totals .row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .totals .row.grand {
      border-top: 2px solid #002D62;
      margin-top: 6px;
      padding-top: 12px;
      font-size: 16px;
      font-weight: 700;
      color: #002D62;
    }
    .footer {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px dashed #d0d7de;
      font-size: 12px;
      color: #6b7c8f;
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .actions {
      max-width: 720px;
      margin: 0 auto 16px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .actions button {
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .print-btn { background: #002D62; color: #fff; }
    .close-btn { background: #e8eef3; color: #1C2B3A; }
    @media print {
      body { padding: 0; }
      .actions { display: none !important; }
      .invoice { border: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="actions">
    <button class="close-btn" onclick="window.close()">Close</button>
    <button class="print-btn" onclick="window.print()">Print Invoice</button>
  </div>
  <div class="invoice">
    <div class="header">
      <h1>${hostelName}</h1>
      <div class="sub">${hostelAddress}<br/>Phone: ${hostelPhone}${hostelEmail ? ` · ${hostelEmail}` : ''}</div>
      <div class="badge">Rent Invoice</div>
    </div>
    <div class="body">
      <div class="meta">
        <div>
          <div class="label">Invoice No</div>
          <div class="value">${invoiceNo}</div>
        </div>
        <div>
          <div class="label">Billing Month</div>
          <div class="value">${monthLabel}</div>
        </div>
        <div>
          <div class="label">Tenant</div>
          <div class="value">${tenantName}</div>
          <div class="sub" style="font-size:12px;color:#6b7c8f;margin-top:4px">${tenantPhone} · ${tenantEmail}</div>
        </div>
        <div>
          <div class="label">Room</div>
          <div class="value">${roomNumber}</div>
        </div>
        <div>
          <div class="label">Due Date</div>
          <div class="value">${dueDate}</div>
        </div>
        <div>
          <div class="label">Status</div>
          <div class="value" style="text-transform:capitalize">${status}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monthly Rent (${monthLabel})</td>
            <td class="amount">${formatCurrency(payment.amount ?? total)}</td>
          </tr>
          ${parseFloat(payment.penalty_amount || 0) > 0 ? `
          <tr>
            <td>Penalty</td>
            <td class="amount">${formatCurrency(payment.penalty_amount)}</td>
          </tr>` : ''}
          ${parseFloat(payment.discount_amount || 0) > 0 ? `
          <tr>
            <td>Discount</td>
            <td class="amount">- ${formatCurrency(payment.discount_amount)}</td>
          </tr>` : ''}
        </tbody>
      </table>

      <div class="totals">
        <div class="row"><span>Total</span><span>${formatCurrency(total)}</span></div>
        <div class="row"><span>Paid</span><span>${formatCurrency(paid)}</span></div>
        <div class="row"><span>Balance Due</span><span>${formatCurrency(balance)}</span></div>
        <div class="row grand"><span>Amount</span><span>${formatCurrency(total)}</span></div>
      </div>

      <div class="meta" style="margin-top:28px;margin-bottom:0">
        <div>
          <div class="label">Payment Method</div>
          <div class="value">${method}</div>
        </div>
        <div>
          <div class="label">Paid Date</div>
          <div class="value">${paidDate}</div>
        </div>
        ${payment.payment_reference ? `
        <div>
          <div class="label">Reference</div>
          <div class="value">${payment.payment_reference}</div>
        </div>` : ''}
      </div>

      <div class="footer">
        <div>Generated by Vita Stay Hostel Management</div>
        <div>Printed on ${printedAt}</div>
      </div>
    </div>
  </div>
  <script>
    ${options.autoPrint ? `
    window.onload = function () {
      setTimeout(function () { window.print(); }, 300);
    };
    ` : ''}
  </script>
</body>
</html>`;

  return { html, hostelName, monthLabel, invoiceNo };
};

/**
 * Opens a printable rent invoice window with hostel name and payment details.
 */
export const printRentInvoice = (payment) => {
  const built = buildInvoiceHtml(payment, { autoPrint: true });
  if (!built) return;
  const printWindow = window.open('', '_blank', 'width=860,height=1000');
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(built.html);
  printWindow.document.close();
};

/** Open invoice in a new window for viewing (no auto-print). */
export const viewRentInvoice = (payment) => {
  const built = buildInvoiceHtml(payment, { autoPrint: false });
  if (!built) return;
  const viewWindow = window.open('', '_blank', 'width=860,height=1000');
  if (!viewWindow) return;
  viewWindow.document.open();
  viewWindow.document.write(built.html);
  viewWindow.document.close();
};

/** Download invoice as an HTML file (can be opened/printed/saved as PDF). */
export const downloadRentInvoice = (payment) => {
  const built = buildInvoiceHtml(payment, { autoPrint: false });
  if (!built) return;
  const blob = new Blob([built.html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeHostel = built.hostelName.replace(/[^\w\-]+/g, '_');
  const safeMonth = built.monthLabel.replace(/[^\w\-]+/g, '_');
  link.href = url;
  link.download = `Rent_Invoice_${safeHostel}_${safeMonth}_${built.invoiceNo}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default printRentInvoice;
