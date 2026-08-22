/**
 * Printable GST Invoice & Booking Receipt Generator
 */

export function generateInvoiceHtml(booking) {
  const baseAmount = Math.round(booking.amount / 1.05);
  const gstAmount = booking.amount - baseAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${booking.bookingRef}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 30px; margin: 0; }
        .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 900; color: #0d9488; letter-spacing: -0.5px; }
        .badge { display: inline-block; background: #ecfdf5; color: #065f46; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: bold; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .table th { background: #f8fafc; text-align: left; padding: 10px; border-bottom: 1px solid #cbd5e1; font-size: 12px; }
        .table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .total-box { margin-left: auto; width: 280px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .grand-total { border-top: 2px solid #0f172a; padding-top: 10px; font-size: 16px; font-weight: 900; color: #0d9488; }
        .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="brand">🌍 GlobeTrotter</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">GlobeTrotter Travel Technologies Pvt. Ltd.</div>
            <div style="font-size: 11px; color: #94a3b8;">GSTIN: 08AAAAA0000A1Z5 | Gandhinagar, Gujarat</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">PAID & CONFIRMED</div>
            <div style="font-size: 16px; font-weight: bold; margin-top: 8px;">TAX INVOICE</div>
            <div style="font-size: 11px; color: #64748b;">Ref: ${booking.bookingRef}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Billed To:</div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 4px;">${booking.travelerName || 'Aarav Sharma'}</div>
            <div style="font-size: 12px; color: #64748b;">${booking.travelerEmail || 'traveler@globetrotter.in'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Payment Details:</div>
            <div style="font-size: 12px; margin-top: 4px;">Method: <strong>${booking.paymentMethod || 'UPI (Instant)'}</strong></div>
            <div style="font-size: 11px; color: #64748b;">Txn ID: ${booking.transactionId || 'txn_demo8912'}</div>
            <div style="font-size: 11px; color: #64748b;">Date: ${new Date(booking.bookedAt || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description / Service</th>
              <th>Category</th>
              <th style="text-align: right;">Amount (${booking.currency || 'INR'})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${booking.itemName || 'Multi-City Itinerary Reservation'}</strong><br /><span style="font-size: 11px; color: #64748b;">Includes all confirmed stops, activities, entry permits and transit passes.</span></td>
              <td>Travel & Tourism</td>
              <td style="text-align: right;">${booking.currency || '₹'} ${baseAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Base Amount:</span><span>${booking.currency || '₹'} ${baseAmount.toLocaleString()}</span></div>
          <div class="total-row"><span>CGST (2.5%):</span><span>${booking.currency || '₹'} ${cgst.toLocaleString()}</span></div>
          <div class="total-row"><span>SGST (2.5%):</span><span>${booking.currency || '₹'} ${sgst.toLocaleString()}</span></div>
          <div class="total-row grand-total"><span>Total Paid:</span><span>${booking.currency || '₹'} ${booking.amount.toLocaleString()}</span></div>
        </div>

        <div class="footer">
          Thank you for choosing GlobeTrotter! Have a wonderful journey. For support, reach out to support@globetrotter.in
        </div>
      </div>
    </body>
    </html>
  `;
}

export function downloadInvoice(booking) {
  const htmlContent = generateInvoiceHtml(booking);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
