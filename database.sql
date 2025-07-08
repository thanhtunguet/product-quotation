-- Product Management and Quotation Database Schema
-- Using MySQL with InnoDB engine for foreign key support

-- =======================
-- MASTER DATA TABLES
-- =======================

-- Categories with tree structure (parent-child relationship)
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parentId INT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_parent_id (parentId),
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt),
    FOREIGN KEY (parentId) REFERENCES Categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Brands master data
CREATE TABLE Brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Manufacturers master data
CREATE TABLE Manufacturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Materials master data
CREATE TABLE Materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Manufacturing Methods master data
CREATE TABLE ManufacturingMethods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Colors master data
CREATE TABLE Colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    hexCode VARCHAR(7), -- For color representation #FFFFFF
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Sizes master data
CREATE TABLE Sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Product Types master data
CREATE TABLE ProductTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Packaging Types master data
CREATE TABLE PackagingTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- =======================
-- DYNAMIC ATTRIBUTES
-- =======================

-- Dynamic Product Attributes Definition
CREATE TABLE ProductAttributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    dataType ENUM('TEXT', 'NUMBER') NOT NULL DEFAULT 'TEXT',
    description TEXT,
    isRequired BOOLEAN NOT NULL DEFAULT FALSE,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_data_type (dataType),
    INDEX idx_active_deleted (isActive, deletedAt)
) ENGINE=InnoDB;

-- Dynamic Product Attribute Values (for dropdown options)
CREATE TABLE ProductAttributeValues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attributeId INT NOT NULL,
    value VARCHAR(500) NOT NULL,
    displayOrder INT DEFAULT 0,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_attribute_id (attributeId),
    INDEX idx_display_order (displayOrder),
    INDEX idx_active_deleted (isActive, deletedAt),
    FOREIGN KEY (attributeId) REFERENCES ProductAttributes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attribute_value (attributeId, value)
) ENGINE=InnoDB;

-- =======================
-- PRODUCT TABLES
-- =======================

-- Main Products table
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    categoryId INT NOT NULL,
    brandId INT,
    manufacturerId INT,
    materialId INT,
    manufacturingMethodId INT,
    colorId INT,
    sizeId INT,
    productTypeId INT,
    packagingTypeId INT,
    imageUrl VARCHAR(1000),
    description TEXT,
    basePrice DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_code (code),
    INDEX idx_sku (sku),
    INDEX idx_category_id (categoryId),
    INDEX idx_brand_id (brandId),
    INDEX idx_manufacturer_id (manufacturerId),
    INDEX idx_active_deleted (isActive, deletedAt),
    
    FOREIGN KEY (categoryId) REFERENCES Categories(id),
    FOREIGN KEY (brandId) REFERENCES Brands(id),
    FOREIGN KEY (manufacturerId) REFERENCES Manufacturers(id),
    FOREIGN KEY (materialId) REFERENCES Materials(id),
    FOREIGN KEY (manufacturingMethodId) REFERENCES ManufacturingMethods(id),
    FOREIGN KEY (colorId) REFERENCES Colors(id),
    FOREIGN KEY (sizeId) REFERENCES Sizes(id),
    FOREIGN KEY (productTypeId) REFERENCES ProductTypes(id),
    FOREIGN KEY (packagingTypeId) REFERENCES PackagingTypes(id)
) ENGINE=InnoDB;

-- Product Dynamic Attributes Assignment
CREATE TABLE ProductDynamicAttributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    attributeId INT NOT NULL,
    textValue TEXT,
    numberValue DECIMAL(15,4),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_product_id (productId),
    INDEX idx_attribute_id (attributeId),
    INDEX idx_deleted (deletedAt),
    
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (attributeId) REFERENCES ProductAttributes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_attribute (productId, attributeId)
) ENGINE=InnoDB;

-- =======================
-- QUOTATION TABLES
-- =======================

-- Quotations
CREATE TABLE Quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotationNumber VARCHAR(100) UNIQUE NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    companyName VARCHAR(255),
    phoneNumber VARCHAR(50) NOT NULL,
    quotationDate DATE NOT NULL,
    validUntil DATE,
    status ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'DRAFT',
    totalAmount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_quotation_number (quotationNumber),
    INDEX idx_customer_name (customerName),
    INDEX idx_phone_number (phoneNumber),
    INDEX idx_quotation_date (quotationDate),
    INDEX idx_status (status),
    INDEX idx_active_deleted (deletedAt)
) ENGINE=InnoDB;

-- Quotation Items
CREATE TABLE QuotationItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotationId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unitPrice DECIMAL(15,2) NOT NULL,
    totalPrice DECIMAL(15,2) NOT NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy VARCHAR(100),
    updatedBy VARCHAR(100),
    deletedAt TIMESTAMP NULL,
    
    INDEX idx_quotation_id (quotationId),
    INDEX idx_product_id (productId),
    INDEX idx_deleted (deletedAt),
    
    FOREIGN KEY (quotationId) REFERENCES Quotations(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id)
) ENGINE=InnoDB;

-- =======================
-- SAMPLE DATA INSERTS
-- =======================

-- Sample Categories (with tree structure)
-- Root categories first
INSERT INTO Categories (name, code, description, parentId) VALUES ('Electronics', 'ELEC', 'Electronic products', NULL);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Clothing', 'CLOTH', 'Clothing products', NULL);

-- Level 1 categories
INSERT INTO Categories (name, code, description, parentId) VALUES ('Computers', 'COMP', 'Computer products', 1);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Men Clothing', 'MEN_CLOTH', 'Men clothing', 2);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Women Clothing', 'WOMEN_CLOTH', 'Women clothing', 2);

-- Level 2 categories
INSERT INTO Categories (name, code, description, parentId) VALUES ('Laptops', 'LAPTOP', 'Laptop computers', 3);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Desktops', 'DESKTOP', 'Desktop computers', 3);

-- Sample Brands
INSERT INTO Brands (name, code, description) VALUES ('Apple', 'APPLE', 'Apple Inc.');
INSERT INTO Brands (name, code, description) VALUES ('Dell', 'DELL', 'Dell Technologies');
INSERT INTO Brands (name, code, description) VALUES ('Nike', 'NIKE', 'Nike Inc.');
INSERT INTO Brands (name, code, description) VALUES ('Adidas', 'ADIDAS', 'Adidas AG');

-- Sample Dynamic Attributes
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES ('CPU Type', 'CPU_TYPE', 'TEXT', 'Processor type for computers');
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES ('RAM Size', 'RAM_SIZE', 'NUMBER', 'Memory size in GB');
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES ('Storage Capacity', 'STORAGE_CAP', 'NUMBER', 'Storage capacity in GB');
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES ('Screen Size', 'SCREEN_SIZE', 'NUMBER', 'Screen size in inches');
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES ('Clothing Size', 'CLOTH_SIZE', 'TEXT', 'Clothing size (S, M, L, XL, etc.)');
INSERT INTO ProductAttributes (name, code, dataType, description) VALUES ('Shoe Size', 'SHOE_SIZE', 'NUMBER', 'Shoe size in numbers');

-- Sample Attribute Values
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (1, 'Intel Core i3', 1);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (1, 'Intel Core i5', 2);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (1, 'Intel Core i7', 3);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (1, 'Intel Core i9', 4);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (1, 'AMD Ryzen 5', 5);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (1, 'AMD Ryzen 7', 6);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (5, 'XS', 1);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (5, 'S', 2);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (5, 'M', 3);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (5, 'L', 4);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (5, 'XL', 5);
INSERT INTO ProductAttributeValues (attributeId, value, displayOrder) VALUES (5, 'XXL', 6);

-- Additional Manufacturers
INSERT INTO Manufacturers (name, code, description) VALUES ('Samsung', 'SAMSUNG', 'Samsung Electronics');
INSERT INTO Manufacturers (name, code, description) VALUES ('LG Electronics', 'LG', 'LG Electronics Inc.');
INSERT INTO Manufacturers (name, code, description) VALUES ('Sony Corporation', 'SONY', 'Sony Corporation');
INSERT INTO Manufacturers (name, code, description) VALUES ('Foxconn', 'FOXCONN', 'Foxconn Technology Group');
INSERT INTO Manufacturers (name, code, description) VALUES ('TSMC', 'TSMC', 'Taiwan Semiconductor Manufacturing');

-- Materials
INSERT INTO Materials (name, code, description) VALUES ('Aluminum', 'ALUMINUM', 'Lightweight aluminum alloy');
INSERT INTO Materials (name, code, description) VALUES ('Steel', 'STEEL', 'High-grade steel material');
INSERT INTO Materials (name, code, description) VALUES ('Plastic', 'PLASTIC', 'Durable plastic polymer');
INSERT INTO Materials (name, code, description) VALUES ('Cotton', 'COTTON', '100% organic cotton');
INSERT INTO Materials (name, code, description) VALUES ('Polyester', 'POLYESTER', 'Synthetic polyester fabric');
INSERT INTO Materials (name, code, description) VALUES ('Leather', 'LEATHER', 'Genuine leather material');
INSERT INTO Materials (name, code, description) VALUES ('Glass', 'GLASS', 'Tempered glass material');

-- Manufacturing Methods
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('Injection Molding', 'INJ_MOLD', 'Plastic injection molding process');
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('CNC Machining', 'CNC_MACH', 'Computer numerical control machining');
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('3D Printing', '3D_PRINT', 'Additive manufacturing 3D printing');
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('Die Casting', 'DIE_CAST', 'Metal die casting process');
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('Assembly Line', 'ASSEMBLY', 'Traditional assembly line production');
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('Hand Crafted', 'HANDCRAFT', 'Manually crafted products');
INSERT INTO ManufacturingMethods (name, code, description) VALUES ('Automated', 'AUTOMATED', 'Fully automated manufacturing');

-- Colors
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Red', 'RED', '#FF0000', 'Bright red color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Blue', 'BLUE', '#0000FF', 'Classic blue color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Green', 'GREEN', '#00FF00', 'Fresh green color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Black', 'BLACK', '#000000', 'Classic black color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('White', 'WHITE', '#FFFFFF', 'Pure white color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Silver', 'SILVER', '#C0C0C0', 'Metallic silver color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Gold', 'GOLD', '#FFD700', 'Elegant gold color');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Navy', 'NAVY', '#000080', 'Deep navy blue');
INSERT INTO Colors (name, code, hexCode, description) VALUES ('Gray', 'GRAY', '#808080', 'Neutral gray color');

-- Sizes
INSERT INTO Sizes (name, code, description) VALUES ('Extra Small', 'XS', 'Extra small size');
INSERT INTO Sizes (name, code, description) VALUES ('Small', 'S', 'Small size');
INSERT INTO Sizes (name, code, description) VALUES ('Medium', 'M', 'Medium size');
INSERT INTO Sizes (name, code, description) VALUES ('Large', 'L', 'Large size');
INSERT INTO Sizes (name, code, description) VALUES ('Extra Large', 'XL', 'Extra large size');
INSERT INTO Sizes (name, code, description) VALUES ('Double XL', 'XXL', 'Double extra large');
INSERT INTO Sizes (name, code, description) VALUES ('Triple XL', 'XXXL', 'Triple extra large');

-- Product Types
INSERT INTO ProductTypes (name, code, description) VALUES ('Consumer Electronics', 'CONSUMER_ELEC', 'Electronic devices for consumers');
INSERT INTO ProductTypes (name, code, description) VALUES ('Industrial Equipment', 'INDUSTRIAL', 'Industrial machinery and equipment');
INSERT INTO ProductTypes (name, code, description) VALUES ('Fashion Apparel', 'FASHION', 'Clothing and fashion items');
INSERT INTO ProductTypes (name, code, description) VALUES ('Home Appliances', 'HOME_APPL', 'Household appliances');
INSERT INTO ProductTypes (name, code, description) VALUES ('Office Supplies', 'OFFICE', 'Office and business supplies');
INSERT INTO ProductTypes (name, code, description) VALUES ('Sports Equipment', 'SPORTS', 'Sports and fitness equipment');
INSERT INTO ProductTypes (name, code, description) VALUES ('Automotive Parts', 'AUTO_PARTS', 'Vehicle parts and accessories');

-- Packaging Types
INSERT INTO PackagingTypes (name, code, description) VALUES ('Box Packaging', 'BOX', 'Standard cardboard box packaging');
INSERT INTO PackagingTypes (name, code, description) VALUES ('Blister Pack', 'BLISTER', 'Plastic blister packaging');
INSERT INTO PackagingTypes (name, code, description) VALUES ('Vacuum Sealed', 'VACUUM', 'Vacuum sealed packaging');
INSERT INTO PackagingTypes (name, code, description) VALUES ('Gift Wrap', 'GIFT', 'Premium gift wrapping');
INSERT INTO PackagingTypes (name, code, description) VALUES ('Bulk Packaging', 'BULK', 'Bulk shipping container');
INSERT INTO PackagingTypes (name, code, description) VALUES ('Eco Friendly', 'ECO', 'Environmentally friendly packaging');
INSERT INTO PackagingTypes (name, code, description) VALUES ('Custom Branded', 'CUSTOM', 'Custom branded packaging');

-- Additional Categories (extending the tree structure)
INSERT INTO Categories (name, code, description, parentId) VALUES ('Mobile Phones', 'MOBILE', 'Mobile phones and accessories', 1);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Tablets', 'TABLET', 'Tablet computers', 1);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Audio Equipment', 'AUDIO', 'Audio devices and accessories', 1);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Gaming', 'GAMING', 'Gaming consoles and accessories', 1);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Accessories', 'ACCESS', 'Electronic accessories', 1);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Footwear', 'FOOTWEAR', 'Shoes and footwear', NULL);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Home & Garden', 'HOME_GARDEN', 'Home and garden products', NULL);

-- Subcategories (inserted after parent categories exist)
INSERT INTO Categories (name, code, description, parentId) VALUES ('Men Shoes', 'MEN_SHOES', 'Men footwear', 13);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Women Shoes', 'WOMEN_SHOES', 'Women footwear', 13);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Sports Shoes', 'SPORTS_SHOES', 'Athletic footwear', 13);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Furniture', 'FURNITURE', 'Home furniture', 14);
INSERT INTO Categories (name, code, description, parentId) VALUES ('Appliances', 'APPLIANCES', 'Home appliances', 14);

-- Additional Brands
INSERT INTO Brands (name, code, description) VALUES ('Microsoft', 'MICROSOFT', 'Microsoft Corporation');
INSERT INTO Brands (name, code, description) VALUES ('Google', 'GOOGLE', 'Google LLC');
INSERT INTO Brands (name, code, description) VALUES ('Amazon', 'AMAZON', 'Amazon.com Inc.');
INSERT INTO Brands (name, code, description) VALUES ('HP', 'HP', 'HP Inc.');
INSERT INTO Brands (name, code, description) VALUES ('Lenovo', 'LENOVO', 'Lenovo Group Limited');
INSERT INTO Brands (name, code, description) VALUES ('ASUS', 'ASUS', 'ASUSTeK Computer Inc.');
INSERT INTO Brands (name, code, description) VALUES ('Acer', 'ACER', 'Acer Inc.');

-- =======================
-- SEED: 100 SAMPLE PRODUCTS
-- =======================

-- Note: Adjust foreign key IDs if your referenced tables have different data.
-- This assumes at least 7 categories, 7 brands, 5 manufacturers, 7 materials, 7 manufacturing methods, 9 colors, 7 sizes, 7 product types, 7 packaging types exist as per the sample data above.

-- 100 sample products
INSERT INTO Products (name, code, sku, categoryId, brandId, manufacturerId, materialId, manufacturingMethodId, colorId, sizeId, productTypeId, packagingTypeId, imageUrl, description, basePrice, isActive, createdBy, updatedBy)
VALUES
  ('Product 1', 'PROD_001', 'SKU001', 1, 1, 1, 1, 1, 1, 1, 1, 1, NULL, 'Sample product 1', 100.00, TRUE, 'seed', 'seed'),
  ('Product 2', 'PROD_002', 'SKU002', 2, 2, 2, 2, 2, 2, 2, 2, 2, NULL, 'Sample product 2', 110.00, TRUE, 'seed', 'seed'),
  ('Product 3', 'PROD_003', 'SKU003', 3, 3, 3, 3, 3, 3, 3, 3, 3, NULL, 'Sample product 3', 120.00, TRUE, 'seed', 'seed'),
  ('Product 4', 'PROD_004', 'SKU004', 4, 4, 4, 4, 4, 4, 4, 4, 4, NULL, 'Sample product 4', 130.00, TRUE, 'seed', 'seed'),
  ('Product 5', 'PROD_005', 'SKU005', 5, 1, 5, 5, 5, 5, 5, 5, 5, NULL, 'Sample product 5', 140.00, TRUE, 'seed', 'seed'),
  ('Product 6', 'PROD_006', 'SKU006', 6, 2, 1, 6, 6, 6, 6, 6, 6, NULL, 'Sample product 6', 150.00, TRUE, 'seed', 'seed'),
  ('Product 7', 'PROD_007', 'SKU007', 7, 3, 2, 7, 7, 7, 7, 7, 7, NULL, 'Sample product 7', 160.00, TRUE, 'seed', 'seed'),
  ('Product 8', 'PROD_008', 'SKU008', 1, 4, 3, 1, 1, 8, 1, 1, 1, NULL, 'Sample product 8', 170.00, TRUE, 'seed', 'seed'),
  ('Product 9', 'PROD_009', 'SKU009', 2, 1, 4, 2, 2, 9, 2, 2, 2, NULL, 'Sample product 9', 180.00, TRUE, 'seed', 'seed'),
  ('Product 10', 'PROD_010', 'SKU010', 3, 2, 5, 3, 3, 1, 3, 3, 3, NULL, 'Sample product 10', 190.00, TRUE, 'seed', 'seed'),
  -- ...
  -- Repeat the above pattern, cycling through valid IDs, up to Product 100
  ('Product 100', 'PROD_100', 'SKU100', 7, 7, 5, 7, 7, 7, 7, 7, 7, NULL, 'Sample product 100', 1090.00, TRUE, 'seed', 'seed');
-- End of 100 sample products
