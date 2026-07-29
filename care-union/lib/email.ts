import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  host:process.env.EMAIL_SERVER_HOST||'smtp.gmail.com',
  port:Number(process.env.EMAIL_SERVER_PORT||587),
  secure:false,
  auth:{user:process.env.EMAIL_SERVER_USER,pass:process.env.EMAIL_SERVER_PASSWORD},
})
const FROM = `"Care Union Foundation" <${process.env.EMAIL_FROM||'careunion.info@gmail.com'}>`
function shell(content:string):string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f5f7fa;margin:0;padding:32px 16px;">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(27,58,107,.1);">
<div style="background:#1B3A6B;padding:28px 36px;text-align:center;">
<h1 style="color:white;font-size:22px;font-weight:800;margin:0;">CARE <span style="color:#4ade80;">UNION</span></h1>
<p style="color:rgba(255,255,255,.55);font-size:11px;margin:5px 0 0;letter-spacing:2px;text-transform:uppercase;">Together We Transform Lives</p>
</div>
<div style="padding:36px;">${content}</div>
<div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 36px;text-align:center;">
<p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Care Union Foundation · <a href="https://careunion.in" style="color:#1B3A6B;">careunion.in</a></p>
</div></div></body></html>`
}
export async function sendOtpEmail(email:string,otp:string,isAdmin=false):Promise<void> {
  await transporter.sendMail({from:FROM,to:email,subject:`${otp} — Your Care Union Login Code`,html:shell(`
<h2 style="color:#1B3A6B;font-size:20px;font-weight:700;margin:0 0 10px;">Your Login Code</h2>
<p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">Enter this code to ${isAdmin?'access the admin panel':'log in to your donor account'}. Valid for <strong>10 minutes</strong>.</p>
<div style="background:#f0f4ff;border:2px solid #1B3A6B;border-radius:14px;padding:26px;text-align:center;margin-bottom:24px;">
<div style="font-size:40px;font-weight:900;letter-spacing:14px;color:#1B3A6B;font-family:monospace;">${otp}</div></div>
<p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0;">If you did not request this code, you can safely ignore this email.</p>`)})
}
export interface ReceiptEmailData {
  donorName:string;donorEmail:string;receiptNumber:string;totalAmount:number
  items:Array<{campaign_title:string;option_name:string;quantity:number;unit_price:number;subtotal:number}>
  paymentId:string
}
function fmt(n:number):string { return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0}).format(n) }
export async function sendReceiptEmail(data:ReceiptEmailData):Promise<void> {
  const rows=data.items.map(i=>`<tr><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;">${i.option_name}<div style="font-size:11px;color:#94a3b8;margin-top:2px;">${i.campaign_title}</div></td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;text-align:center;">${i.quantity}</td><td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1B3A6B;font-weight:600;text-align:right;">${fmt(i.subtotal)}</td></tr>`).join('')
  await transporter.sendMail({from:FROM,to:data.donorEmail,subject:`Donation Receipt ${data.receiptNumber} — Care Union Foundation`,html:shell(`
<h2 style="color:#1B3A6B;font-size:20px;font-weight:700;margin:0 0 6px;">Thank You, ${data.donorName.split(' ')[0]}! 🎉</h2>
<p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">Your donation has been confirmed. Here is your receipt.</p>
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:24px;">
<div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Receipt No.</span><span style="font-size:12px;color:#1B3A6B;font-weight:700;font-family:monospace;">${data.receiptNumber}</span></div>
<div style="display:flex;justify-content:space-between;"><span style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Payment ID</span><span style="font-size:12px;color:#475569;font-family:monospace;">${data.paymentId}</span></div>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;"><thead><tr style="background:#f0f4ff;"><th style="padding:10px 12px;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;text-align:left;">Item</th><th style="padding:10px 12px;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;text-align:center;">Qty</th><th style="padding:10px 12px;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;text-align:right;">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<div style="background:#1B3A6B;border-radius:10px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;"><span style="color:rgba(255,255,255,.7);font-size:13px;font-weight:600;">Total Donated</span><span style="color:white;font-size:20px;font-weight:800;">${fmt(data.totalAmount)}</span></div>
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;"><p style="color:#166534;font-size:13px;line-height:1.6;margin:0;">🙏 <strong>Your donation is creating real change.</strong> We will send you photos and an impact report showing exactly how your contribution was used.</p></div>
<p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:0;">Questions? Reply to this email or WhatsApp us at +91 87894 77448.</p>`)})
}
export async function sendContactAckEmail(name:string,email:string,subject:string):Promise<void> {
  await transporter.sendMail({from:FROM,to:email,subject:`We received your message — Care Union Foundation`,html:shell(`
<h2 style="color:#1B3A6B;font-size:20px;font-weight:700;margin:0 0 10px;">We Got Your Message!</h2>
<p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 16px;">Hi ${name}, thank you for reaching out about <strong style="color:#1B3A6B;">"${subject}"</strong>. We will get back to you within <strong>24 hours</strong>.</p>
<p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">For urgent matters: <a href="https://wa.me/918789477448" style="color:#1B3A6B;font-weight:600;">+91 87894 77448</a></p>
<a href="https://careunion.in/campaigns" style="display:inline-block;background:#2E7D32;color:white;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">Browse Campaigns →</a>`)})
}
