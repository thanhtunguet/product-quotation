-- 100 Sample Products Seed Data
-- This file assumes the reference data from database.sql is already loaded.

INSERT INTO Products (name, code, sku, categoryId, brandId, manufacturerId, materialId, manufacturingMethodId, colorId, sizeId, productTypeId, packagingTypeId, imageUrl, description, basePrice, isActive, createdBy, updatedBy) VALUES
('Apple MacBook Pro 14', 'PROD_001', 'SKU001', 6, 1, 1, 1, 2, 6, 3, 1, 1, NULL, 'Apple MacBook Pro 14-inch, M1 Pro, 16GB RAM, 512GB SSD', 1999.00, TRUE, 'seed', 'seed'),
('Dell XPS 13', 'PROD_002', 'SKU002', 6, 2, 2, 1, 2, 5, 3, 1, 2, NULL, 'Dell XPS 13, Intel i7, 16GB RAM, 1TB SSD', 1499.00, TRUE, 'seed', 'seed'),
('Sony Bravia 55" 4K TV', 'PROD_003', 'SKU003', 1, 0, 3, 7, 4, 1, 0, 1, 3, NULL, 'Sony Bravia 55-inch 4K Ultra HD Smart TV', 899.00, TRUE, 'seed', 'seed'),
('Samsung Galaxy S22', 'PROD_004', 'SKU004', 13, 0, 4, 3, 1, 2, 0, 1, 4, NULL, 'Samsung Galaxy S22, 128GB, Phantom Black', 799.00, TRUE, 'seed', 'seed'),
('Nike Men\'s Running Shoes', 'PROD_005', 'SKU005', 20, 3, 0, 6, 6, 4, 6, 6, 5, NULL, 'Nike Men\'s Air Zoom Pegasus 38', 120.00, TRUE, 'seed', 'seed'),
('Adidas Women\'s Sports Shoes', 'PROD_006', 'SKU006', 21, 4, 0, 6, 6, 2, 5, 6, 5, NULL, 'Adidas Women\'s Ultraboost 22', 140.00, TRUE, 'seed', 'seed'),
('Apple iPad Air', 'PROD_007', 'SKU007', 14, 1, 1, 3, 1, 5, 3, 1, 2, NULL, 'Apple iPad Air 10.9-inch, 64GB, Wi-Fi', 599.00, TRUE, 'seed', 'seed'),
('HP Pavilion Desktop', 'PROD_008', 'SKU008', 7, 8, 5, 2, 2, 4, 4, 1, 1, NULL, 'HP Pavilion Desktop, Intel i5, 8GB RAM, 512GB SSD', 699.00, TRUE, 'seed', 'seed'),
('Lenovo ThinkPad X1', 'PROD_009', 'SKU009', 6, 10, 2, 1, 2, 6, 3, 1, 2, NULL, 'Lenovo ThinkPad X1 Carbon Gen 9', 1699.00, TRUE, 'seed', 'seed'),
('Microsoft Surface Pro 8', 'PROD_010', 'SKU010', 14, 7, 1, 1, 2, 5, 3, 1, 2, NULL, 'Microsoft Surface Pro 8, 13-inch, 256GB SSD', 1099.00, TRUE, 'seed', 'seed'),
('Nike Men\'s T-Shirt', 'PROD_011', 'SKU011', 4, 3, 0, 4, 5, 1, 2, 3, 3, NULL, 'Nike Men\'s Dri-FIT T-Shirt, Large', 35.00, TRUE, 'seed', 'seed'),
('Adidas Women\'s Hoodie', 'PROD_012', 'SKU012', 5, 4, 0, 5, 5, 2, 2, 3, 3, NULL, 'Adidas Women\'s Essentials Hoodie', 55.00, TRUE, 'seed', 'seed'),
('Apple AirPods Pro', 'PROD_013', 'SKU013', 15, 1, 1, 3, 1, 1, 0, 1, 4, NULL, 'Apple AirPods Pro (2nd Gen)', 249.00, TRUE, 'seed', 'seed');

INSERT INTO Products (name, code, sku, categoryId, brandId, manufacturerId, materialId, manufacturingMethodId, colorId, sizeId, productTypeId, packagingTypeId, imageUrl, description, basePrice, isActive, createdBy, updatedBy) VALUES
('Sony WH-1000XM4 Headphones', 'PROD_014', 'SKU014', 15, 0, 3, 7, 4, 1, 0, 1, 4, NULL, 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones', 349.00, TRUE, 'seed', 'seed'),
('Samsung QLED 65" TV', 'PROD_015', 'SKU015', 1, 0, 4, 7, 4, 1, 0, 1, 3, NULL, 'Samsung 65-inch QLED 4K Smart TV', 1299.00, TRUE, 'seed', 'seed'),
('Dell Inspiron Laptop', 'PROD_016', 'SKU016', 6, 2, 2, 1, 2, 6, 3, 1, 1, NULL, 'Dell Inspiron 15, Intel i5, 8GB RAM, 512GB SSD', 799.00, TRUE, 'seed', 'seed'),
('HP Envy x360', 'PROD_017', 'SKU017', 6, 8, 5, 2, 2, 5, 3, 1, 2, NULL, 'HP Envy x360 Convertible Laptop', 999.00, TRUE, 'seed', 'seed'),
('Lenovo Yoga Slim 7', 'PROD_018', 'SKU018', 6, 10, 2, 1, 2, 6, 3, 1, 2, NULL, 'Lenovo Yoga Slim 7, Ryzen 7, 16GB RAM', 1099.00, TRUE, 'seed', 'seed'),
('Microsoft Xbox Series X', 'PROD_019', 'SKU019', 17, 7, 1, 3, 1, 1, 0, 1, 4, NULL, 'Microsoft Xbox Series X 1TB Console', 499.00, TRUE, 'seed', 'seed'),
('Sony PlayStation 5', 'PROD_020', 'SKU020', 17, 0, 3, 7, 4, 1, 0, 1, 4, NULL, 'Sony PlayStation 5 Console, 825GB', 499.00, TRUE, 'seed', 'seed'),
('Google Nest Hub', 'PROD_021', 'SKU021', 1, 8, 0, 3, 7, 2, 0, 1, 4, NULL, 'Google Nest Hub 2nd Gen Smart Display', 99.00, TRUE, 'seed', 'seed'),
('Amazon Echo Dot', 'PROD_022', 'SKU022', 1, 9, 0, 3, 7, 4, 0, 1, 4, NULL, 'Amazon Echo Dot (4th Gen) Smart Speaker', 49.00, TRUE, 'seed', 'seed'),
('ASUS ROG Zephyrus', 'PROD_023', 'SKU023', 6, 12, 0, 1, 2, 6, 3, 1, 2, NULL, 'ASUS ROG Zephyrus G14 Gaming Laptop', 1599.00, TRUE, 'seed', 'seed'),
('Acer Aspire 5', 'PROD_024', 'SKU024', 6, 13, 0, 1, 2, 5, 3, 1, 2, NULL, 'Acer Aspire 5, Ryzen 5, 8GB RAM, 512GB SSD', 599.00, TRUE, 'seed', 'seed'),
('Apple iPhone 13', 'PROD_025', 'SKU025', 13, 1, 1, 3, 1, 1, 0, 1, 4, NULL, 'Apple iPhone 13, 128GB, Blue', 799.00, TRUE, 'seed', 'seed'),
('Samsung Galaxy Tab S8', 'PROD_026', 'SKU026', 14, 5, 4, 3, 1, 2, 0, 1, 4, NULL, 'Samsung Galaxy Tab S8, 11-inch, 128GB', 699.00, TRUE, 'seed', 'seed'),
('HP EliteBook 840', 'PROD_027', 'SKU027', 6, 8, 5, 2, 2, 6, 3, 1, 2, NULL, 'HP EliteBook 840 G8, Intel i7, 16GB RAM', 1299.00, TRUE, 'seed', 'seed');
INSERT INTO Products (name, code, sku, categoryId, brandId, manufacturerId, materialId, manufacturingMethodId, colorId, sizeId, productTypeId, packagingTypeId, imageUrl, description, basePrice, isActive, createdBy, updatedBy) VALUES
('Lenovo Legion 5', 'PROD_028', 'SKU028', 6, 10, 2, 1, 2, 5, 3, 1, 2, NULL, 'Lenovo Legion 5 Gaming Laptop, Ryzen 7', 1199.00, TRUE, 'seed', 'seed'),
('Microsoft Surface Laptop 4', 'PROD_029', 'SKU029', 6, 7, 1, 1, 2, 6, 3, 1, 2, NULL, 'Microsoft Surface Laptop 4, 15-inch', 1299.00, TRUE, 'seed', 'seed'),
('Sony Xperia 5 III', 'PROD_030', 'SKU030', 13, 0, 3, 3, 1, 1, 0, 1, 4, NULL, 'Sony Xperia 5 III, 128GB, Green', 999.00, TRUE, 'seed', 'seed'),
('Nike Women\'s Leggings', 'PROD_031', 'SKU031', 5, 3, 0, 5, 5, 2, 2, 3, 3, NULL, 'Nike Women\'s One Luxe Leggings', 60.00, TRUE, 'seed', 'seed'),
('Adidas Men\'s Shorts', 'PROD_032', 'SKU032', 4, 4, 0, 5, 5, 1, 2, 3, 3, NULL, 'Adidas Men\'s 3-Stripes Shorts', 30.00, TRUE, 'seed', 'seed'),
('Apple Watch Series 7', 'PROD_033', 'SKU033', 15, 1, 1, 3, 1, 6, 0, 1, 4, NULL, 'Apple Watch Series 7, 45mm, Silver', 399.00, TRUE, 'seed', 'seed'),
('Samsung Galaxy Watch 4', 'PROD_034', 'SKU034', 15, 5, 4, 3, 1, 5, 0, 1, 4, NULL, 'Samsung Galaxy Watch 4, 44mm, Black', 249.00, TRUE, 'seed', 'seed'),
('Sony WF-1000XM4 Earbuds', 'PROD_035', 'SKU035', 15, 0, 3, 7, 4, 1, 0, 1, 4, NULL, 'Sony WF-1000XM4 True Wireless Earbuds', 279.00, TRUE, 'seed', 'seed'),
('Amazon Kindle Paperwhite', 'PROD_036', 'SKU036', 1, 9, 0, 3, 7, 2, 0, 1, 4, NULL, 'Amazon Kindle Paperwhite 11th Gen', 139.00, TRUE, 'seed', 'seed'),
('Google Pixel 6', 'PROD_037', 'SKU037', 13, 8, 0, 3, 1, 4, 0, 1, 4, NULL, 'Google Pixel 6, 128GB, Sorta Seafoam', 599.00, TRUE, 'seed', 'seed'),
('ASUS ZenBook 14', 'PROD_038', 'SKU038', 6, 12, 0, 1, 2, 6, 3, 1, 2, NULL, 'ASUS ZenBook 14, Intel i7, 16GB RAM', 1099.00, TRUE, 'seed', 'seed'),
('Acer Swift 3', 'PROD_039', 'SKU039', 6, 13, 0, 1, 2, 5, 3, 1, 2, NULL, 'Acer Swift 3, Ryzen 5, 8GB RAM', 799.00, TRUE, 'seed', 'seed'),
('Apple Mac Mini', 'PROD_040', 'SKU040', 7, 1, 1, 1, 2, 6, 3, 1, 1, NULL, 'Apple Mac Mini, M1, 8GB RAM, 256GB SSD', 699.00, TRUE, 'seed', 'seed');