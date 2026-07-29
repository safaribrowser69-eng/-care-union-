-- Security patch — run after admin-policies.sql
-- Removes overly-permissive orders read policy; orders are read via service-role API routes only
DROP POLICY IF EXISTS "admin_orders_read" ON orders;
DROP POLICY IF EXISTS "admin_order_items_read" ON order_items;
-- Orders/items remain insertable from public but only readable server-side via service role
