-- Admin RLS policies — run after schema.sql
-- Allow anon key to perform admin CRUD (middleware protects admin routes)
CREATE POLICY "admin_campaigns" ON campaigns FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_donation_options" ON donation_options FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_gallery" ON gallery FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_faqs" ON faqs FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_banners" ON homepage_banners FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_transparency" ON transparency_reports FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_fund_alloc" ON fund_allocations FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_testimonials" ON testimonials FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_stats" ON site_stats FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_contact_read" ON contact_submissions FOR SELECT USING (TRUE);
CREATE POLICY "admin_contact_update" ON contact_submissions FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "admin_contact_delete" ON contact_submissions FOR DELETE USING (TRUE);
CREATE POLICY "admin_users_read" ON users FOR SELECT USING (TRUE);
CREATE POLICY "admin_users_update" ON users FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "users_upsert" ON users FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "admins_read" ON admins FOR SELECT USING (TRUE);
