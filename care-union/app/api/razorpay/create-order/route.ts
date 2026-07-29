import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createAdminClient } from '@/lib/supabase-server'
import type { CreateOrderRequest } from '@/types'

const razorpay = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderRequest = await req.json()
    const { items, donor, notes, is_anonymous } = body
    if (!items?.length || !donor?.name || !donor?.email) return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 })
    const totalAmount = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
    if (totalAmount < 1) return NextResponse.json({ success: false, message: 'Invalid total amount.' }, { status: 400 })

    const supabase = createAdminClient()
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      donor_name: donor.name, donor_email: donor.email, donor_phone: donor.phone, donor_pan: donor.pan,
      donor_address: donor.address, donor_city: donor.city, donor_state: donor.state, donor_pincode: donor.pincode,
      total_amount: totalAmount, status: 'pending', notes, is_anonymous: is_anonymous || false,
    }).select().single()
    if (orderError || !order) throw orderError

    await supabase.from('order_items').insert(items.map(i => ({
      order_id: order.id, campaign_id: i.campaign_id, donation_option_id: i.donation_option_id,
      campaign_title: i.campaign_title, option_name: i.option_name, unit_price: i.unit_price, quantity: i.quantity, subtotal: i.unit_price * i.quantity,
    })))

    const rzpOrder = await razorpay.orders.create({ amount: Math.round(totalAmount * 100), currency: 'INR', receipt: order.id, notes: { order_id: order.id, donor_email: donor.email } })
    await supabase.from('orders').update({ razorpay_order_id: rzpOrder.id }).eq('id', order.id)

    return NextResponse.json({ success: true, razorpay_order_id: rzpOrder.id, order_id: order.id, amount: Math.round(totalAmount * 100), currency: 'INR', key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID })
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ success: false, message: 'Failed to create order.' }, { status: 500 })
  }
}
