import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase-server'
import { sendReceiptEmail } from '@/lib/email'
import type { VerifyPaymentRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: VerifyPaymentRequest = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) return NextResponse.json({ success: false, message: 'Missing payment details.' }, { status: 400 })

    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex')
    if (expectedSig !== razorpay_signature) return NextResponse.json({ success: false, message: 'Payment verification failed.' }, { status: 400 })

    const supabase = createAdminClient()
    const { data: order, error } = await supabase.from('orders').update({ status: 'paid', razorpay_payment_id, razorpay_signature }).eq('id', order_id).select('*, order_items(*)').single()
    if (error || !order) throw error || new Error('Order not found')

    try {
      await sendReceiptEmail({ donorName: order.donor_name, donorEmail: order.donor_email, receiptNumber: order.receipt_number || order_id, totalAmount: order.total_amount, items: order.order_items || [], paymentId: razorpay_payment_id })
    } catch (e) { console.error('Receipt email failed (non-fatal):', e) }

    return NextResponse.json({ success: true, receipt_number: order.receipt_number, message: 'Payment verified successfully.' })
  } catch (err) {
    console.error('Verify payment error:', err)
    return NextResponse.json({ success: false, message: 'Verification failed.' }, { status: 500 })
  }
}
