import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { 
  ExcelImportResultDto, 
  ProductImportRowDto, 
  RelationMappingsDto, 
  RelationMappingDto,
  ExcelRowErrorDto 
} from './excel.dto';
import { Products } from '../../../entities/Products';
import { Categories } from '../../../entities/Categories';
import { Brands } from '../../../entities/Brands';
import { Manufacturers } from '../../../entities/Manufacturers';
import { Materials } from '../../../entities/Materials';
import { ManufacturingMethods } from '../../../entities/ManufacturingMethods';
import { Colors } from '../../../entities/Colors';
import { Sizes } from '../../../entities/Sizes';
import { ProductTypes } from '../../../entities/ProductTypes';
import { PackagingTypes } from '../../../entities/PackagingTypes';
import { ProductAttributes } from '../../../entities/ProductAttributes';
import { ProductDynamicAttributes } from '../../../entities/ProductDynamicAttributes';
import { CreateProductDto } from '../../../dto/product.dto';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Brands)
    private brandsRepository: Repository<Brands>,
    @InjectRepository(Manufacturers)
    private manufacturersRepository: Repository<Manufacturers>,
    @InjectRepository(Materials)
    private materialsRepository: Repository<Materials>,
    @InjectRepository(ManufacturingMethods)
    private manufacturingMethodsRepository: Repository<ManufacturingMethods>,
    @InjectRepository(Colors)
    private colorsRepository: Repository<Colors>,
    @InjectRepository(Sizes)
    private sizesRepository: Repository<Sizes>,
    @InjectRepository(ProductTypes)
    private productTypesRepository: Repository<ProductTypes>,
    @InjectRepository(PackagingTypes)
    private packagingTypesRepository: Repository<PackagingTypes>,
    @InjectRepository(ProductAttributes)
    private productAttributesRepository: Repository<ProductAttributes>,
    @InjectRepository(ProductDynamicAttributes)
    private productDynamicAttributesRepository: Repository<ProductDynamicAttributes>,
  ) {}

  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Product Import Template');

    // Define column headers
    const headers = [
      'Name*', 'Code*', 'SKU', 'Category*', 'Brand', 'Manufacturer', 
      'Material', 'Manufacturing Method', 'Color', 'Size', 
      'Product Type', 'Packaging Type', 'Base Price', 'Image URL', 
      'Description', 'Is Active'
    ];

    // Get all active product attributes for dynamic columns
    const productAttributes = await this.productAttributesRepository.find({
      where: { isActive: true, deletedAt: null },
      order: { name: 'ASC' }
    });

    // Add dynamic attribute columns
    productAttributes.forEach(attr => {
      headers.push(`${attr.name} (${attr.dataType})`);
    });

    // Add header row
    worksheet.addRow(headers);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Add sample data row
    const sampleData = [
      'Sample Product Name', 'PROD001', 'SKU001', 'Electronics', 'Samsung', 
      'Foxconn', 'Plastic', 'Injection Molding', 'Black', 'Medium', 
      'Consumer Electronics', 'Retail Box', '100.00', 'https://example.com/image.jpg', 
      'Sample product description', 'TRUE'
    ];

    // Add sample dynamic attribute values
    productAttributes.forEach(attr => {
      sampleData.push(attr.dataType === 'NUMBER' ? '10' : 'Sample Value');
    });

    worksheet.addRow(sampleData);

    // Auto-fit columns
    worksheet.columns.forEach((column, index) => {
      const header = headers[index];
      column.width = Math.max(header.length + 2, 15);
    });

    // Create master data sheets
    await this.addMasterDataSheets(workbook);

    // Convert to buffer
    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  private async addMasterDataSheets(workbook: ExcelJS.Workbook): Promise<void> {
    // Add Categories sheet
    const categoriesSheet = workbook.addWorksheet('Categories');
    const categories = await this.categoriesRepository.find({ 
      where: { isActive: true, deletedAt: null },
      order: { name: 'ASC' }
    });
    categoriesSheet.addRow(['Category Name', 'Category Code']);
    categories.forEach(cat => categoriesSheet.addRow([cat.name, cat.code]));

    // Add Brands sheet
    const brandsSheet = workbook.addWorksheet('Brands');
    const brands = await this.brandsRepository.find({ 
      where: { isActive: true, deletedAt: null },
      order: { name: 'ASC' }
    });
    brandsSheet.addRow(['Brand Name', 'Brand Code']);
    brands.forEach(brand => brandsSheet.addRow([brand.name, brand.code]));

    // Add other master data sheets
    await this.addGenericMasterDataSheet(workbook, 'Manufacturers', this.manufacturersRepository);
    await this.addGenericMasterDataSheet(workbook, 'Materials', this.materialsRepository);
    await this.addGenericMasterDataSheet(workbook, 'Manufacturing Methods', this.manufacturingMethodsRepository);
    await this.addGenericMasterDataSheet(workbook, 'Colors', this.colorsRepository);
    await this.addGenericMasterDataSheet(workbook, 'Sizes', this.sizesRepository);
    await this.addGenericMasterDataSheet(workbook, 'Product Types', this.productTypesRepository);
    await this.addGenericMasterDataSheet(workbook, 'Packaging Types', this.packagingTypesRepository);
  }

  private async addGenericMasterDataSheet(
    workbook: ExcelJS.Workbook, 
    sheetName: string, 
    repository: Repository<any>
  ): Promise<void> {
    const sheet = workbook.addWorksheet(sheetName);
    const data = await repository.find({ 
      where: { isActive: true, deletedAt: null },
      order: { name: 'ASC' }
    });
    sheet.addRow([`${sheetName} Name`, `${sheetName} Code`]);
    data.forEach(item => sheet.addRow([item.name, item.code]));
  }

  async parseExcelFile(buffer: Buffer): Promise<ProductImportRowDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    
    const worksheet = workbook.getWorksheet(1); // First worksheet
    if (!worksheet) {
      throw new Error('No worksheet found in Excel file');
    }

    const products: ProductImportRowDto[] = [];
    const headers: string[] = [];

    // Get headers from first row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = cell.value?.toString() || '';
    });

    // Get product attributes for dynamic columns
    const productAttributes = await this.productAttributesRepository.find({
      where: { isActive: true, deletedAt: null }
    });

    // Process data rows (skip header row)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const product: ProductImportRowDto = {
        name: '',
        code: '',
        categoryName: '',
        dynamicAttributes: {}
      };

      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber];
        const value = cell.value?.toString() || '';

        if (!header || !value) return;

        // Map standard fields
        switch (header.toLowerCase().replace('*', '')) {
          case 'name':
            product.name = value;
            break;
          case 'code':
            product.code = value;
            break;
          case 'sku':
            product.sku = value;
            break;
          case 'category':
            product.categoryName = value;
            break;
          case 'brand':
            product.brandName = value;
            break;
          case 'manufacturer':
            product.manufacturerName = value;
            break;
          case 'material':
            product.materialName = value;
            break;
          case 'manufacturing method':
            product.manufacturingMethodName = value;
            break;
          case 'color':
            product.colorName = value;
            break;
          case 'size':
            product.sizeName = value;
            break;
          case 'product type':
            product.productTypeName = value;
            break;
          case 'packaging type':
            product.packagingTypeName = value;
            break;
          case 'base price':
            product.basePrice = parseFloat(value) || 0;
            break;
          case 'image url':
            product.imageUrl = value;
            break;
          case 'description':
            product.description = value;
            break;
          case 'is active':
            product.isActive = value.toLowerCase() === 'true';
            break;
          default:
            // Check if it's a dynamic attribute
            const attributeMatch = header.match(/^(.+)\s+\((.+)\)$/);
            if (attributeMatch) {
              const [, attributeName, dataType] = attributeMatch;
              const attribute = productAttributes.find(attr => 
                attr.name.toLowerCase() === attributeName.toLowerCase()
              );
              if (attribute) {
                product.dynamicAttributes![attribute.name] = 
                  attribute.dataType === 'NUMBER' ? parseFloat(value) || 0 : value;
              }
            }
        }
      });

      if (product.name && product.code) {
        products.push(product);
      }
    });

    return products;
  }

  async importProducts(products: ProductImportRowDto[]): Promise<ExcelImportResultDto> {
    const result: ExcelImportResultDto = {
      totalRows: products.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
      createdProductIds: []
    };

    // Get or create relation mappings
    const relationMappings = await this.getOrCreateRelationMappings(products);

    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const rowNumber = i + 2; // Excel row number (1-based, +1 for header)

      try {
        const createProductDto = await this.mapToCreateProductDto(product, relationMappings);
        
        // Validate product code uniqueness
        const existingProduct = await this.productsRepository.findOne({
          where: { code: createProductDto.code }
        });
        
        if (existingProduct) {
          result.errors.push({
            row: rowNumber,
            field: 'code',
            message: 'Product code already exists',
            value: createProductDto.code
          });
          result.errorCount++;
          continue;
        }

        // Create product
        const newProduct = this.productsRepository.create(createProductDto);
        const savedProduct = await this.productsRepository.save(newProduct);

        // Create dynamic attributes
        if (product.dynamicAttributes) {
          await this.createDynamicAttributes(savedProduct.id, product.dynamicAttributes);
        }

        result.createdProductIds.push(savedProduct.id);
        result.successCount++;

      } catch (error) {
        result.errors.push({
          row: rowNumber,
          field: 'general',
          message: error.message || 'Unknown error occurred',
          value: product.name
        });
        result.errorCount++;
      }
    }

    return result;
  }

  private async getOrCreateRelationMappings(products: ProductImportRowDto[]): Promise<RelationMappingsDto> {
    const mappings: RelationMappingsDto = {
      categories: [],
      brands: [],
      manufacturers: [],
      materials: [],
      manufacturingMethods: [],
      colors: [],
      sizes: [],
      productTypes: [],
      packagingTypes: [],
      productAttributes: []
    };

    // Get unique names for each relation type
    const uniqueCategories = [...new Set(products.map(p => p.categoryName).filter(Boolean))];
    const uniqueBrands = [...new Set(products.map(p => p.brandName).filter(Boolean))];
    const uniqueManufacturers = [...new Set(products.map(p => p.manufacturerName).filter(Boolean))];
    const uniqueMaterials = [...new Set(products.map(p => p.materialName).filter(Boolean))];
    const uniqueManufacturingMethods = [...new Set(products.map(p => p.manufacturingMethodName).filter(Boolean))];
    const uniqueColors = [...new Set(products.map(p => p.colorName).filter(Boolean))];
    const uniqueSizes = [...new Set(products.map(p => p.sizeName).filter(Boolean))];
    const uniqueProductTypes = [...new Set(products.map(p => p.productTypeName).filter(Boolean))];
    const uniquePackagingTypes = [...new Set(products.map(p => p.packagingTypeName).filter(Boolean))];

    // Map or create categories
    mappings.categories = await this.getOrCreateMasterDataMappings(
      uniqueCategories, this.categoriesRepository
    );

    // Map or create brands
    mappings.brands = await this.getOrCreateMasterDataMappings(
      uniqueBrands, this.brandsRepository
    );

    // Map or create other master data
    mappings.manufacturers = await this.getOrCreateMasterDataMappings(
      uniqueManufacturers, this.manufacturersRepository
    );
    mappings.materials = await this.getOrCreateMasterDataMappings(
      uniqueMaterials, this.materialsRepository
    );
    mappings.manufacturingMethods = await this.getOrCreateMasterDataMappings(
      uniqueManufacturingMethods, this.manufacturingMethodsRepository
    );
    mappings.colors = await this.getOrCreateMasterDataMappings(
      uniqueColors, this.colorsRepository
    );
    mappings.sizes = await this.getOrCreateMasterDataMappings(
      uniqueSizes, this.sizesRepository
    );
    mappings.productTypes = await this.getOrCreateMasterDataMappings(
      uniqueProductTypes, this.productTypesRepository
    );
    mappings.packagingTypes = await this.getOrCreateMasterDataMappings(
      uniquePackagingTypes, this.packagingTypesRepository
    );

    // Get product attributes
    const productAttributes = await this.productAttributesRepository.find({
      where: { isActive: true, deletedAt: null }
    });
    mappings.productAttributes = productAttributes.map(attr => ({
      name: attr.name,
      id: attr.id,
      isNew: false
    }));

    return mappings;
  }

  private async getOrCreateMasterDataMappings(
    names: string[], 
    repository: Repository<any>
  ): Promise<RelationMappingDto[]> {
    const mappings: RelationMappingDto[] = [];

    for (const name of names) {
      // Try to find existing record
      let record = await repository.findOne({
        where: { name: name }
      });

      if (!record) {
        // Create new record
        const code = this.generateCodeFromName(name);
        record = repository.create({
          name: name,
          code: code,
          isActive: true
        });
        record = await repository.save(record);
        mappings.push({ name, id: record.id, isNew: true });
      } else {
        mappings.push({ name, id: record.id, isNew: false });
      }
    }

    return mappings;
  }

  private generateCodeFromName(name: string): string {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 50);
  }

  private async mapToCreateProductDto(
    product: ProductImportRowDto, 
    mappings: RelationMappingsDto
  ): Promise<CreateProductDto> {
    const categoryMapping = mappings.categories.find(c => c.name === product.categoryName);
    if (!categoryMapping) {
      throw new Error(`Category not found: ${product.categoryName}`);
    }

    const createProductDto: CreateProductDto = {
      name: product.name,
      code: product.code,
      sku: product.sku,
      categoryId: categoryMapping.id,
      basePrice: product.basePrice || 0,
      imageUrl: product.imageUrl,
      description: product.description,
      isActive: product.isActive ?? true,
      dynamicAttributes: []
    };

    // Map optional relations
    if (product.brandName) {
      const brandMapping = mappings.brands.find(b => b.name === product.brandName);
      if (brandMapping) createProductDto.brandId = brandMapping.id;
    }

    if (product.manufacturerName) {
      const manufacturerMapping = mappings.manufacturers.find(m => m.name === product.manufacturerName);
      if (manufacturerMapping) createProductDto.manufacturerId = manufacturerMapping.id;
    }

    if (product.materialName) {
      const materialMapping = mappings.materials.find(m => m.name === product.materialName);
      if (materialMapping) createProductDto.materialId = materialMapping.id;
    }

    if (product.manufacturingMethodName) {
      const methodMapping = mappings.manufacturingMethods.find(m => m.name === product.manufacturingMethodName);
      if (methodMapping) createProductDto.manufacturingMethodId = methodMapping.id;
    }

    if (product.colorName) {
      const colorMapping = mappings.colors.find(c => c.name === product.colorName);
      if (colorMapping) createProductDto.colorId = colorMapping.id;
    }

    if (product.sizeName) {
      const sizeMapping = mappings.sizes.find(s => s.name === product.sizeName);
      if (sizeMapping) createProductDto.sizeId = sizeMapping.id;
    }

    if (product.productTypeName) {
      const typeMapping = mappings.productTypes.find(t => t.name === product.productTypeName);
      if (typeMapping) createProductDto.productTypeId = typeMapping.id;
    }

    if (product.packagingTypeName) {
      const packagingMapping = mappings.packagingTypes.find(p => p.name === product.packagingTypeName);
      if (packagingMapping) createProductDto.packagingTypeId = packagingMapping.id;
    }

    return createProductDto;
  }

  private async createDynamicAttributes(productId: number, dynamicAttributes: Record<string, string | number>): Promise<void> {
    for (const [attributeName, value] of Object.entries(dynamicAttributes)) {
      const attribute = await this.productAttributesRepository.findOne({
        where: { name: attributeName, isActive: true, deletedAt: null }
      });

      if (attribute) {
        const dynamicAttribute = this.productDynamicAttributesRepository.create({
          productId: productId,
          attributeId: attribute.id,
          textValue: attribute.dataType === 'TEXT' ? value.toString() : null,
          numberValue: attribute.dataType === 'NUMBER' ? value.toString() : null
        });

        await this.productDynamicAttributesRepository.save(dynamicAttribute);
      }
    }
  }
}