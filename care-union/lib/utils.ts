import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:0}).format(amount)
}

export function progressPercent(raised:number,goal:number):number {
  if(!goal) return 0
  return Math.min(Math.round((raised/goal)*100),100)
}

export function slugify(str:string):string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
}

export function generateOTP():string { return Math.floor(100000+Math.random()*900000).toString() }

export function maskEmail(email:string):string {
  const [user,domain]=email.split('@')
  const masked=user.slice(0,2)+'*'.repeat(Math.max(user.length-4,2))+user.slice(-2)
  return `${masked}@${domain}`
}

export function truncate(str:string,length:number):string {
  if(str.length<=length) return str
  return str.slice(0,length).trim()+'…'
}

export function timeAgo(dateStr:string):string {
  const diff=Date.now()-new Date(dateStr).getTime()
  const mins=Math.floor(diff/60000)
  if(mins<1) return 'Just now'
  if(mins<60) return `${mins}m ago`
  const hrs=Math.floor(mins/60)
  if(hrs<24) return `${hrs}h ago`
  const days=Math.floor(hrs/24)
  if(days<7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
}

export function getInitials(name:string):string { return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }

export const AVATAR_COLORS=['#1B3A6B','#2E7D32','#7B3535','#C8960C','#1c4d7a','#3a5c1a','#5a1a5a','#1a4a4a']
export function avatarColor(name:string):string { return AVATAR_COLORS[name.charCodeAt(0)%AVATAR_COLORS.length] }

export function razorpayOptions(p:{
  key:string;amount:number;currency:string;orderId:string;name:string;description:string
  prefillName:string;prefillEmail:string;prefillPhone:string
  onSuccess:(r:{razorpay_payment_id:string;razorpay_order_id:string;razorpay_signature:string})=>void
  onFailure:(e:unknown)=>void
}) {
  return {
    key:p.key,amount:p.amount,currency:p.currency,
    name:'Care Union Foundation',description:p.description,image:'/logo.png',
    order_id:p.orderId,
    prefill:{name:p.prefillName,email:p.prefillEmail,contact:p.prefillPhone},
    theme:{color:'#1B3A6B'},
    handler:p.onSuccess,
    modal:{ondismiss:p.onFailure},
  }
}
