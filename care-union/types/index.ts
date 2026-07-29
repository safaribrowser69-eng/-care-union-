export type CampaignCategory = 'hunger'|'birthday'|'animals'|'nature'|'medicine'
export type OrderStatus = 'pending'|'paid'|'failed'|'refunded'

export interface Campaign {
  id:string; title:string; slug:string; category:CampaignCategory
  short_desc:string; description:string; image_url:string; gallery_images:string[]
  goal_amount:number; raised_amount:number; beneficiaries:number; location:string
  is_active:boolean; is_featured:boolean; sort_order:number
  meta_title?:string; meta_description?:string
  created_at:string; updated_at:string
  donation_options?:DonationOption[]
}

export interface DonationOption {
  id:string; campaign_id:string; name:string; description?:string
  price:number; min_qty:number; max_qty:number; icon:string
  is_active:boolean; sort_order:number; created_at:string; updated_at:string
}

export interface User {
  id:string; email:string; name?:string; phone?:string; pan_number?:string
  city?:string; state?:string; pincode?:string; created_at:string; updated_at:string
}

export interface Admin { id:string; email:string; name:string; created_at:string }

export interface Order {
  id:string; user_id?:string; donor_name:string; donor_email:string
  donor_phone?:string; donor_pan?:string; donor_address?:string
  donor_city?:string; donor_state?:string; donor_pincode?:string
  total_amount:number; status:OrderStatus
  razorpay_order_id?:string; razorpay_payment_id?:string; razorpay_signature?:string
  receipt_number?:string; notes?:string; is_anonymous:boolean
  created_at:string; updated_at:string; items?:OrderItem[]
}

export interface OrderItem {
  id:string; order_id:string; campaign_id?:string; donation_option_id?:string
  campaign_title:string; option_name:string
  unit_price:number; quantity:number; subtotal:number; created_at:string
}

export interface Gallery {
  id:string; title:string; description?:string; image_url:string; category:string
  drive_name?:string; location?:string; drive_date?:string
  sort_order:number; is_active:boolean; created_at:string; updated_at:string
}

export interface Faq {
  id:string; question:string; answer:string; category:string
  sort_order:number; is_active:boolean; created_at:string; updated_at:string
}

export interface ContactSubmission {
  id:string; name:string; email:string; phone?:string; subject:string; message:string
  is_read:boolean; replied_at?:string; created_at:string
}

export interface HomepageBanner {
  id:string; title:string; subtitle?:string; image_url:string
  cta_text:string; cta_link:string; sort_order:number; is_active:boolean
  created_at:string; updated_at:string
}

export interface TransparencyReport {
  id:string; title:string; month?:number; year:number
  total_raised:number; total_spent:number; beneficiaries:number; drives_conducted:number
  summary?:string; report_url?:string; is_published:boolean
  created_at:string; updated_at:string; fund_allocations?:FundAllocation[]
}

export interface FundAllocation {
  id:string; report_id:string; category:string; amount:number; percentage:number; color:string
}

export interface Testimonial {
  id:string; name:string; location?:string; role?:string; text:string
  avatar_url?:string; rating:number; is_active:boolean; sort_order:number; created_at:string
}

export interface DonorWall {
  id:string; order_id?:string; name:string; amount:number; cause?:string
  city?:string; is_anonymous:boolean; created_at:string
}

export interface SiteStat { key:string; value:string; label?:string; updated_at:string }

export interface CartItem {
  id:string; campaign_id:string; campaign_slug:string; campaign_title:string
  campaign_category:CampaignCategory; campaign_image:string
  donation_option_id:string; option_name:string; option_icon:string; unit_price:number; quantity:number
  min_qty:number; subtotal:number
}

export interface CartStore {
  items:CartItem[]
  addItem:(item:Omit<CartItem,'subtotal'>)=>void
  removeItem:(id:string)=>void
  updateQty:(id:string,qty:number)=>void
  clearCart:()=>void
  total:()=>number
  count:()=>number
}

export interface UserStore {
  user:User|null; isAdmin:boolean; isLoading:boolean
  setUser:(user:User|null)=>void
  setAdmin:(val:boolean)=>void
  setLoading:(val:boolean)=>void
  logout:()=>void
}

export interface CreateOrderRequest {
  items:{campaign_id:string;donation_option_id:string;campaign_title:string;option_name:string;unit_price:number;quantity:number}[]
  donor:{name:string;email:string;phone?:string;pan?:string;address?:string;city?:string;state?:string;pincode?:string}
  notes?:string; is_anonymous?:boolean
}

export interface VerifyPaymentRequest {
  razorpay_order_id:string; razorpay_payment_id:string
  razorpay_signature:string; order_id:string
}

export const CATEGORY_META: Record<CampaignCategory,{label:string;icon:string;color:string;bg:string}> = {
  hunger:   {label:'Hunger',   icon:'🍱',color:'#1B3A6B',bg:'#e8edf5'},
  birthday: {label:'Birthday', icon:'🎂',color:'#C8960C',bg:'#fef9ed'},
  animals:  {label:'Animals',  icon:'🐾',color:'#2E7D32',bg:'#e8f5e9'},
  nature:   {label:'Nature',   icon:'🌱',color:'#1c7a1c',bg:'#edf7ee'},
  medicine: {label:'Medicine', icon:'💊',color:'#7B3535',bg:'#fdf0f0'},
}

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu and Kashmir','Ladakh','Chandigarh','Puducherry',
]
