-- Care Union Foundation — Database Schema
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL, name TEXT, phone TEXT, pan_number TEXT,
  city TEXT, state TEXT, pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), email TEXT NOT NULL,
  token TEXT NOT NULL, is_admin BOOLEAN DEFAULT FALSE, used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_otp_email ON otp_tokens(email);

CREATE TYPE campaign_category AS ENUM ('hunger','birthday','animals','nature','medicine');

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
  category campaign_category NOT NULL, short_desc TEXT NOT NULL, description TEXT NOT NULL,
  image_url TEXT NOT NULL, gallery_images TEXT[] DEFAULT '{}',
  goal_amount NUMERIC(12,2) DEFAULT 0, raised_amount NUMERIC(12,2) DEFAULT 0,
  beneficiaries INTEGER DEFAULT 0, location TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT TRUE, is_featured BOOLEAN DEFAULT FALSE, sort_order INTEGER DEFAULT 0,
  meta_title TEXT, meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER campaigns_upd BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS donation_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL, description TEXT, price NUMERIC(10,2) NOT NULL,
  min_qty INTEGER DEFAULT 1, max_qty INTEGER DEFAULT 999, icon TEXT DEFAULT '🎁',
  is_active BOOLEAN DEFAULT TRUE, sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER donation_options_upd BEFORE UPDATE ON donation_options FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TYPE order_status AS ENUM ('pending','paid','failed','refunded');
CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1001;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL, donor_email TEXT NOT NULL, donor_phone TEXT, donor_pan TEXT,
  donor_address TEXT, donor_city TEXT, donor_state TEXT, donor_pincode TEXT,
  total_amount NUMERIC(12,2) NOT NULL, status order_status DEFAULT 'pending',
  razorpay_order_id TEXT, razorpay_payment_id TEXT, razorpay_signature TEXT,
  receipt_number TEXT UNIQUE, notes TEXT, is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER orders_upd BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION generate_receipt_number() RETURNS TRIGGER AS $$
BEGIN
  NEW.receipt_number = 'CU-' || TO_CHAR(NOW(),'YYYYMMDD') || '-' || LPAD(NEXTVAL('receipt_seq')::TEXT,4,'0');
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER orders_receipt BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_receipt_number();

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  donation_option_id UUID REFERENCES donation_options(id) ON DELETE SET NULL,
  campaign_title TEXT NOT NULL, option_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL, quantity INTEGER NOT NULL, subtotal NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_campaign_raised() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status='paid' AND OLD.status!='paid' THEN
    UPDATE campaigns c SET raised_amount=raised_amount+oi.subtotal
    FROM order_items oi WHERE oi.order_id=NEW.id AND oi.campaign_id=c.id;
  END IF; RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER update_raised_on_payment AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_campaign_raised();

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT NOT NULL, description TEXT,
  image_url TEXT NOT NULL, category TEXT DEFAULT 'general', drive_name TEXT, location TEXT, drive_date DATE,
  sort_order INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER gallery_upd BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), question TEXT NOT NULL, answer TEXT NOT NULL,
  category TEXT DEFAULT 'general', sort_order INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER faqs_upd BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT NOT NULL, email TEXT NOT NULL,
  phone TEXT, subject TEXT NOT NULL, message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE, replied_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT NOT NULL, subtitle TEXT,
  image_url TEXT NOT NULL, cta_text TEXT DEFAULT 'Donate Now', cta_link TEXT DEFAULT '/campaigns',
  sort_order INTEGER DEFAULT 0, is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER banners_upd BEFORE UPDATE ON homepage_banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS transparency_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT NOT NULL,
  month INTEGER CHECK (month BETWEEN 1 AND 12), year INTEGER NOT NULL,
  total_raised NUMERIC(12,2) DEFAULT 0, total_spent NUMERIC(12,2) DEFAULT 0,
  beneficiaries INTEGER DEFAULT 0, drives_conducted INTEGER DEFAULT 0,
  summary TEXT, report_url TEXT, is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER transparency_upd BEFORE UPDATE ON transparency_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS fund_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES transparency_reports(id) ON DELETE CASCADE,
  category TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL, percentage NUMERIC(5,2) NOT NULL, color TEXT DEFAULT '#1B3A6B'
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT NOT NULL, location TEXT, role TEXT,
  text TEXT NOT NULL, avatar_url TEXT, rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT TRUE, sort_order INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donor_wall (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL, cause TEXT, city TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION add_to_donor_wall() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status='paid' AND OLD.status!='paid' THEN
    INSERT INTO donor_wall(order_id,name,amount,city,is_anonymous)
    VALUES(NEW.id,CASE WHEN NEW.is_anonymous THEN 'Anonymous' ELSE NEW.donor_name END,NEW.total_amount,NEW.donor_city,NEW.is_anonymous);
  END IF; RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER auto_donor_wall AFTER UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION add_to_donor_wall();

CREATE TABLE IF NOT EXISTS site_stats (
  key TEXT PRIMARY KEY, value TEXT NOT NULL, label TEXT, updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_wall ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "campaigns_public" ON campaigns FOR SELECT USING (is_active=TRUE);
CREATE POLICY "donation_options_public" ON donation_options FOR SELECT USING (is_active=TRUE);
CREATE POLICY "gallery_public" ON gallery FOR SELECT USING (is_active=TRUE);
CREATE POLICY "faqs_public" ON faqs FOR SELECT USING (is_active=TRUE);
CREATE POLICY "banners_public" ON homepage_banners FOR SELECT USING (is_active=TRUE);
CREATE POLICY "transparency_public" ON transparency_reports FOR SELECT USING (is_published=TRUE);
CREATE POLICY "fund_allocations_public" ON fund_allocations FOR SELECT USING (TRUE);
CREATE POLICY "testimonials_public" ON testimonials FOR SELECT USING (is_active=TRUE);
CREATE POLICY "donor_wall_public" ON donor_wall FOR SELECT USING (TRUE);
CREATE POLICY "stats_public" ON site_stats FOR SELECT USING (TRUE);
CREATE POLICY "contact_insert" ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "otp_insert" ON otp_tokens FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "otp_select" ON otp_tokens FOR SELECT USING (TRUE);
CREATE POLICY "otp_update" ON otp_tokens FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "otp_delete" ON otp_tokens FOR DELETE USING (TRUE);
