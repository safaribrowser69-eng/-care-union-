import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase-server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
    if (secret) {
      const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
      if (expected !== signature) { console.error('Webhook: invalid signature'); return NextResponse.json({ success: false }, { status: 400 }) }
    }
    const event = JSON.parse(rawBody)
    const supabase = createAdminClient()
    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity
        const orderId: string = payment.notes?.order_id || ''
        if (orderId) {
          const { data: order } = await supabase.from('orders').select('id, status').eq('id', orderId).single()
          if (order && order.status === 'pending') await supabase.from('orders').update({ status: 'paid', razorpay_payment_id: payment.id }).eq('id', orderId)
        }
        break
      }
      case 'payment.failed': {
        const payment = event.payload.payment.entity
        const orderId: string = payment.notes?.order_id || ''
        if (orderId) await supabase.from('orders').update({ status: 'failed' }).eq('id', orderId).eq('status', 'pending')
        break
      }
      case 'refund.created': {
        const refund = event.payload.refund.entity
        if (refund.payment_id) await supabase.from('orders').update({ status: 'refunded' }).eq('razorpay_payment_id', refund.payment_id)
        break
      }
      default: console.log(`Webhook: unhandled event ${event.event}`)
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
