-- Care Union Foundation — Seed Data (run after schema.sql)
INSERT INTO admins (email,password_hash,name) VALUES
('careunion.info@gmail.com',crypt('CareUnion@2025',gen_salt('bf',12)),'Care Union Admin');

INSERT INTO campaigns (id,title,slug,category,short_desc,description,image_url,goal_amount,raised_amount,beneficiaries,location,is_featured,sort_order) VALUES
('11111111-0000-0000-0000-000000000001','Feed the Hungry — Daily Meal Drive','feed-the-hungry-daily-meal-drive','hunger','Providing nutritious daily meals to families living in poverty across urban slums and rural villages.','Every day, millions of families in India go to bed hungry. Our Daily Meal Drive ensures that underprivileged families receive hot, nutritious meals delivered directly to their doorstep. With your support, we distribute food packets, fresh meal plates, biryani, grocery kits, and more. 100% of your donation reaches the beneficiaries — we publish monthly impact reports with photos and data.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',500000,312400,1200,'Delhi, Mumbai, Pune',TRUE,1),
('22222222-0000-0000-0000-000000000002','Birthday Blessings — Celebrate with Purpose','birthday-blessings-celebrate-with-purpose','birthday','Turn your celebration into an act of compassion. Feed children, host birthday parties, and spread joy on your special day.','What better way to celebrate your birthday than by spreading happiness to children who have very little? Our Birthday Blessings campaign lets you donate food packets, arrange birthday cakes, host mini celebrations, or fund a grand birthday party for underprivileged children. We organise the event, document everything, and send you photos and videos of the smiles your generosity created.','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',200000,87500,450,'Pan India',TRUE,2),
('33333333-0000-0000-0000-000000000003','Paws & Compassion — Animal Welfare Drive','paws-and-compassion-animal-welfare','animals','Feeding and sheltering stray dogs, cows, and animals who have no one to care for them.','Thousands of stray animals on India streets struggle to find food and shelter every day. Our Paws & Compassion campaign provides dog food, cow feed, custom dog houses, and paw feeding stations across the city. We partner with local animal lovers and volunteers to ensure regular feeding rounds.','https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',150000,43200,320,'Mumbai, Pune, Delhi',TRUE,3),
('44444444-0000-0000-0000-000000000004','Green India — Plant a Tree Drive','green-india-plant-a-tree-drive','nature','Every tree planted today is a gift to the next generation. Join us in making India greener, one tree at a time.','Climate change is real, and trees are our most powerful weapon against it. Our Green India campaign plants trees in barren areas, school premises, public parks, and communities across India. Every Rs.100 you donate plants one tree, which we track with GPS coordinates and share photos with you after planting.','https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',100000,28900,289,'Pan India',FALSE,4),
('55555555-0000-0000-0000-000000000005','Women Health — Hygiene Kit Drive','womens-health-hygiene-kit-drive','medicine','Providing essential women hygiene kits to underprivileged women and girls who lack access to basic sanitary products.','In India, millions of women and girls lack access to basic menstrual hygiene products. Our Women Health campaign distributes comprehensive hygiene kits to women in slums, villages, and shelter homes. We conduct awareness sessions alongside every distribution drive.','https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',80000,31500,126,'Delhi, Mumbai, Jaipur',FALSE,5);

INSERT INTO donation_options (campaign_id,name,description,price,min_qty,icon,sort_order) VALUES
('11111111-0000-0000-0000-000000000001','Food Packet','A nutritious food packet for one person — rice, dal, sabzi, and roti.',35,1,'🍱',1),
('11111111-0000-0000-0000-000000000001','Meal Plate','A complete hot meal plate served fresh to someone in need.',100,1,'🍽️',2),
('11111111-0000-0000-0000-000000000001','Veg Biryani','A generous serving of freshly cooked vegetable biryani.',60,1,'🍛',3),
('11111111-0000-0000-0000-000000000001','Chicken Biryani','A hearty serving of fresh chicken biryani for a family.',120,1,'🍗',4),
('11111111-0000-0000-0000-000000000001','Grocery Kit','Monthly grocery kit for a family.',700,1,'🛒',5),
('11111111-0000-0000-0000-000000000001','Milk & Banana','Nutritious milk and bananas for children.',30,1,'🥛',6),
('22222222-0000-0000-0000-000000000002','Food Packets for 20 Kids','Feed 20 underprivileged children on your special day.',35,10,'🍱',1),
('22222222-0000-0000-0000-000000000002','Birthday Cake','A beautiful birthday cake shared with children.',500,1,'🎂',2),
('22222222-0000-0000-0000-000000000002','Birthday Party','A full birthday party with cake, food and decorations for 30+ kids.',5000,1,'🎉',3),
('22222222-0000-0000-0000-000000000002','Cake + Food Packet','Birthday cake plus food packets for 10 children.',1200,1,'🎁',4),
('22222222-0000-0000-0000-000000000002','Mini Celebration','A mini celebration with snacks, cake, and gifts for 15 children.',2000,1,'🥳',5),
('22222222-0000-0000-0000-000000000002','Veg Biryani (10 servings)','10 servings of hot veg biryani for children.',60,10,'🍛',6),
('22222222-0000-0000-0000-000000000002','Chicken Biryani (10 servings)','10 servings of chicken biryani.',120,10,'🍗',7),
('22222222-0000-0000-0000-000000000002','Grand Restaurant Celebration','A grand restaurant-style birthday party for 50+ children.',15000,1,'🌟',8),
('33333333-0000-0000-0000-000000000003','Dog Food','One day of nutritious dog food for one stray dog.',30,1,'🐕',1),
('33333333-0000-0000-0000-000000000003','Cow Feed','A day worth of quality feed for one stray cow.',101,1,'🐄',2),
('33333333-0000-0000-0000-000000000003','Dog House','A sturdy, weatherproof dog house to shelter stray dogs.',1800,1,'🏠',3),
('33333333-0000-0000-0000-000000000003','Paws Feeding Station','A permanent automated feeding station for stray animals.',1500,1,'🐾',4),
('44444444-0000-0000-0000-000000000004','Plant a Tree','Plant one tree in a public area — tracked with GPS and photos sent to you.',100,1,'🌱',1),
('55555555-0000-0000-0000-000000000005','Women Hygiene Kit','Complete monthly hygiene kit for one woman.',250,1,'🧴',1);

INSERT INTO homepage_banners (title,subtitle,image_url,cta_text,cta_link,sort_order) VALUES
('Together We Transform Lives','Join thousands of donors helping underprivileged families across India through food, education, and compassion.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=90','Donate Now','/campaigns',1),
('Feed a Family for Just Rs.35','For just Rs.35, you can provide a nutritious meal to someone who has nothing to eat today.','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=90','Feed Now','/campaigns/feed-the-hungry-daily-meal-drive',2),
('Celebrate with Purpose','Turn your birthday into an act of compassion. Feed children and create memories that last forever.','https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=1600&q=90','Celebrate','/campaigns/birthday-blessings-celebrate-with-purpose',3);

INSERT INTO site_stats (key,value,label) VALUES
('meals_served','12400','Meals Served'),('families_helped','2800','Families Helped'),
('animals_fed','3200','Animals Fed'),('trees_planted','289','Trees Planted'),
('total_donors','1847','Total Donors'),('cities_reached','12','Cities Reached'),
('drives_conducted','48','Drives Conducted'),('transparency','100','% Transparent');

INSERT INTO faqs (question,answer,category,sort_order) VALUES
('What is the minimum donation amount?','The minimum donation is just Rs.30. Even small donations create real impact.','donations',1),
('Is my donation tax-exempt under 80G?','We are in the process of obtaining 80G certification. We will notify all donors once approved.','donations',2),
('How do I know my donation reaches the right people?','We publish detailed monthly transparency reports with photos, videos, and data showing exactly where every rupee was spent.','transparency',3),
('Can I donate on someone else behalf?','Absolutely! You can donate in honor of someone on their birthday, anniversary, or in memory of a loved one.','donations',4),
('What payment methods are accepted?','We accept UPI, credit/debit cards, net banking, and wallets via our secure Razorpay payment gateway.','payments',5),
('Will I receive a receipt?','Yes! You will receive a donation receipt on your email immediately after payment.','payments',6),
('How can I volunteer with Care Union?','Email us at careunion.info@gmail.com or WhatsApp us at +91 8789477448 to join our volunteer network.','volunteering',7),
('Can companies donate through CSR?','Yes! We welcome CSR partnerships. Please contact us at careunion.info@gmail.com.','corporate',8);

INSERT INTO testimonials (name,location,role,text,rating,sort_order) VALUES
('Rahul Sharma','Delhi','Regular Donor','I donated on my birthday instead of a party. Care Union sent me photos of 50 children smiling after receiving food. It was the best birthday gift I have ever given myself.',5,1),
('Priya Mehta','Mumbai','Monthly Contributor','The transparency they maintain is incredible. Every month I get a detailed report showing exactly where my money went. I have never felt this confident about an NGO before.',5,2),
('Vikram Singh','Bangalore','Corporate Donor','We used Care Union for our company CSR initiative. They organised 3 food drives and the impact report was perfect for our annual report. Highly professional.',5,3),
('Ananya Krishnan','Chennai','Animal Welfare Supporter','I donate through the Paws & Compassion campaign every month. Knowing that stray dogs in my city are getting fed because of my contribution gives me so much peace.',5,4);

INSERT INTO gallery (title,description,image_url,category,drive_name,location,drive_date,sort_order) VALUES
('Food Distribution Drive','Distributing hot meal plates to 60+ families in a labour colony.','https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80','hunger','Daily Meal Drive','Delhi','2025-06-15',1),
('Birthday Celebration — Shelter Home','Birthday party for 40 children at a Delhi shelter home.','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80','birthday','Birthday Blessings','Delhi','2025-06-20',2),
('Stray Dog Feeding Round','Feeding stray dogs in Mumbai streets with nutritious dog food.','https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80','animals','Paws & Compassion','Mumbai','2025-06-25',3),
('Tree Plantation Drive','Planting 50 trees with school children in a public park.','https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80','nature','Green India','Pune','2025-07-01',4),
('Hygiene Kit Distribution','Distributing hygiene kits to 50 women in a Delhi slum community.','https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80','medicine','Women Health','Delhi','2025-07-05',5),
('Grocery Kit Distribution','Monthly grocery kits distributed to 30 families.','https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80','hunger','Daily Meal Drive','Mumbai','2025-07-10',6);

INSERT INTO transparency_reports (title,month,year,total_raised,total_spent,beneficiaries,drives_conducted,summary,is_published)
VALUES ('June 2025 Impact Report',6,2025,87400,81200,920,8,'In June 2025, Care Union conducted 8 drives across Delhi, Mumbai, and Pune. We served 1,200 meals, distributed 30 grocery kits, fed 200 stray animals, and hosted 2 birthday celebrations for underprivileged children.',TRUE);

INSERT INTO fund_allocations (report_id,category,amount,percentage,color)
SELECT id,'Food Distribution',52000,64.0,'#1B3A6B' FROM transparency_reports WHERE month=6 AND year=2025;
INSERT INTO fund_allocations (report_id,category,amount,percentage,color)
SELECT id,'Animal Welfare',12000,14.8,'#2E7D32' FROM transparency_reports WHERE month=6 AND year=2025;
INSERT INTO fund_allocations (report_id,category,amount,percentage,color)
SELECT id,'Women Health',8500,10.5,'#C8960C' FROM transparency_reports WHERE month=6 AND year=2025;
INSERT INTO fund_allocations (report_id,category,amount,percentage,color)
SELECT id,'Nature & Trees',4200,5.2,'#388E3C' FROM transparency_reports WHERE month=6 AND year=2025;
INSERT INTO fund_allocations (report_id,category,amount,percentage,color)
SELECT id,'Operations',4500,5.5,'#7B8FA6' FROM transparency_reports WHERE month=6 AND year=2025;
