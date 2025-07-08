// Excel Exporter Service for Quotations
import * as ExcelJS from 'exceljs';
import { Quotation, QuotationItem } from '../services/api-client';
import moment from 'moment';

export interface ExcelExportOptions {
  filename?: string;
  includeFormulas?: boolean;
  vietnameseLabels?: boolean;
}

export class ExcelExporter {
  private static readonly DEFAULT_OPTIONS: Required<ExcelExportOptions> = {
    filename: 'quotation.xlsx',
    includeFormulas: true,
    vietnameseLabels: true,
  };

  /**
   * Export a single quotation to Excel with formulas
   */
  static async exportQuotation(
    quotation: Quotation,
    options: ExcelExportOptions = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Product Quotation System';
    workbook.lastModifiedBy = 'Product Quotation System';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet(config.vietnameseLabels ? 'Báo Giá' : 'Quotation');
    
    // Set up the worksheet
    this.setupQuotationWorksheet(worksheet, quotation, config);
    
    // Generate and download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const filename = config.filename || `quotation-${quotation.quotationNumber}.xlsx`;
    this.downloadFile(buffer, filename);
  }

  /**
   * Export multiple quotations to Excel (each quotation on separate sheet)
   */
  static async exportMultipleQuotations(
    quotations: Quotation[],
    options: ExcelExportOptions = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    const workbook = new ExcelJS.Workbook();
    
    workbook.creator = 'Product Quotation System';
    workbook.created = new Date();

    for (const quotation of quotations) {
      const worksheetName = `${quotation.quotationNumber}`.substring(0, 31); // Excel limit
      const worksheet = workbook.addWorksheet(worksheetName);
      this.setupQuotationWorksheet(worksheet, quotation, config);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = config.filename || `quotations-${moment().format('YYYY-MM-DD')}.xlsx`;
    this.downloadFile(buffer, filename);
  }

  /**
   * Export quotations summary (all quotations in one sheet)
   */
  static async exportQuotationsSummary(
    quotations: Quotation[],
    options: ExcelExportOptions = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    const workbook = new ExcelJS.Workbook();
    
    workbook.creator = 'Product Quotation System';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(config.vietnameseLabels ? 'Tổng Hợp Báo Giá' : 'Quotations Summary');
    
    this.setupSummaryWorksheet(worksheet, quotations, config);

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = config.filename || `quotations-summary-${moment().format('YYYY-MM-DD')}.xlsx`;
    this.downloadFile(buffer, filename);
  }

  private static setupQuotationWorksheet(
    worksheet: ExcelJS.Worksheet,
    quotation: Quotation,
    config: Required<ExcelExportOptions>
  ): void {
    const labels = this.getLabels(config.vietnameseLabels);
    
    // Set column widths
    worksheet.columns = [
      { width: 5 },   // A: Row numbers
      { width: 25 },  // B: Product names
      { width: 35 },  // C: Descriptions
      { width: 10 },  // D: Quantity
      { width: 15 },  // E: Unit Price
      { width: 15 },  // F: Total Price
      { width: 25 },  // G: Notes
    ];

    let currentRow = 1;

    // Header Section
    this.addHeaderSection(worksheet, quotation, labels, currentRow);
    currentRow += 12;

    // Items Table Header
    const tableStartRow = currentRow;
    this.addItemsTableHeader(worksheet, labels, currentRow);
    currentRow += 2;

    // Items Data with Formulas
    const itemsStartRow = currentRow;
    for (let i = 0; i < quotation.quotationItems.length; i++) {
      const item = quotation.quotationItems[i];
      this.addItemRow(worksheet, item, currentRow, i + 1, config);
      currentRow++;
    }

    // Add empty rows for user to add more items
    for (let i = 0; i < 5; i++) {
      this.addEmptyItemRow(worksheet, currentRow, quotation.quotationItems.length + i + 1, config);
      currentRow++;
    }

    const itemsEndRow = currentRow - 1;

    // Totals Section with Formulas
    currentRow += 2;
    this.addTotalsSection(worksheet, labels, currentRow, itemsStartRow, itemsEndRow, config);

    // Terms and Conditions
    currentRow += 8;
    this.addTermsSection(worksheet, labels, currentRow);

    // Apply styling
    this.applyWorksheetStyling(worksheet, tableStartRow, itemsEndRow);
  }

  private static addHeaderSection(
    worksheet: ExcelJS.Worksheet,
    quotation: Quotation,
    labels: any,
    startRow: number
  ): void {
    // Company Header
    const companyHeaderCell = worksheet.getCell(`B${startRow}`);
    companyHeaderCell.value = 'CÔNG TY TNHH ABC';
    companyHeaderCell.font = { bold: true, size: 16, color: { argb: '1a365d' } };
    
    // Company Details
    worksheet.getCell(`B${startRow + 1}`).value = '123 Đường Nguyễn Văn Cừ, Quận 1';
    worksheet.getCell(`B${startRow + 2}`).value = 'Thành phố Hồ Chí Minh, Việt Nam';
    worksheet.getCell(`B${startRow + 3}`).value = 'Điện thoại: (028) 123-4567';
    worksheet.getCell(`B${startRow + 4}`).value = 'Email: info@abc.com.vn';

    // Document Title
    const titleCell = worksheet.getCell(`E${startRow}`);
    titleCell.value = labels.documentTitle;
    titleCell.font = { bold: true, size: 20, color: { argb: '1a365d' } };
    titleCell.alignment = { horizontal: 'center' };

    // Quotation Details
    worksheet.getCell(`E${startRow + 2}`).value = `${labels.quotationNumber}: ${quotation.quotationNumber}`;
    worksheet.getCell(`E${startRow + 3}`).value = `${labels.date}: ${moment(quotation.quotationDate).format('DD/MM/YYYY')}`;
    if (quotation.validUntil) {
      worksheet.getCell(`E${startRow + 4}`).value = `${labels.validUntil}: ${moment(quotation.validUntil).format('DD/MM/YYYY')}`;
    }
    worksheet.getCell(`E${startRow + 5}`).value = `${labels.status}: ${this.getStatusText(quotation.status)}`;

    // Customer Information
    worksheet.getCell(`B${startRow + 7}`).value = labels.customerInfo;
    worksheet.getCell(`B${startRow + 7}`).font = { bold: true, size: 14 };
    
    worksheet.getCell(`B${startRow + 8}`).value = `${labels.customerName}: ${quotation.customerName}`;
    if (quotation.companyName) {
      worksheet.getCell(`B${startRow + 9}`).value = `${labels.companyName}: ${quotation.companyName}`;
    }
    worksheet.getCell(`B${startRow + 10}`).value = `${labels.phoneNumber}: ${quotation.phoneNumber}`;
  }

  private static addItemsTableHeader(
    worksheet: ExcelJS.Worksheet,
    labels: any,
    startRow: number
  ): void {
    const headers = [
      labels.no,
      labels.productName,
      labels.description,
      labels.quantity,
      labels.unitPrice,
      labels.totalPrice,
      labels.notes,
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(startRow, index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4299e1' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }

  private static addItemRow(
    worksheet: ExcelJS.Worksheet,
    item: QuotationItem,
    row: number,
    index: number,
    config: Required<ExcelExportOptions>
  ): void {
    // Row number
    worksheet.getCell(row, 1).value = index;
    
    // Product name
    worksheet.getCell(row, 2).value = item.product?.name || `Product ID: ${item.productId}`;
    
    // Description
    const description = [
      item.product?.description,
      item.product?.code ? `Mã: ${item.product.code}` : null,
      item.notes,
    ].filter(Boolean).join('\n');
    worksheet.getCell(row, 3).value = description;
    
    // Quantity (editable)
    worksheet.getCell(row, 4).value = item.quantity;
    worksheet.getCell(row, 4).numFmt = '#,##0';
    
    // Unit Price (editable)
    const unitPriceCell = worksheet.getCell(row, 5);
    unitPriceCell.value = item.unitPrice;
    unitPriceCell.numFmt = '#,##0" VND"';
    
    // Total Price (formula)
    const totalPriceCell = worksheet.getCell(row, 6);
    if (config.includeFormulas) {
      totalPriceCell.value = { formula: `D${row}*E${row}` };
    } else {
      totalPriceCell.value = item.quantity * item.unitPrice;
    }
    totalPriceCell.numFmt = '#,##0" VND"';
    
    // Notes
    worksheet.getCell(row, 7).value = item.notes || '';

    // Apply borders to all cells
    for (let col = 1; col <= 7; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'top', wrapText: true };
    }

    // Center align numeric columns
    worksheet.getCell(row, 1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(row, 4).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(row, 5).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(row, 6).alignment = { horizontal: 'right', vertical: 'middle' };
  }

  private static addEmptyItemRow(
    worksheet: ExcelJS.Worksheet,
    row: number,
    index: number,
    config: Required<ExcelExportOptions>
  ): void {
    // Row number
    worksheet.getCell(row, 1).value = index;
    
    // Leave other cells empty but add formulas where needed
    if (config.includeFormulas) {
      const totalPriceCell = worksheet.getCell(row, 6);
      totalPriceCell.value = { formula: `IF(AND(D${row}<>"",E${row}<>""),D${row}*E${row},"")` };
      totalPriceCell.numFmt = '#,##0" VND"';
    }

    // Apply borders and formatting
    for (let col = 1; col <= 7; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { vertical: 'top', wrapText: true };
    }

    // Format numeric columns
    worksheet.getCell(row, 4).numFmt = '#,##0';
    worksheet.getCell(row, 5).numFmt = '#,##0" VND"';
    
    // Center align
    worksheet.getCell(row, 1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(row, 4).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(row, 5).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(row, 6).alignment = { horizontal: 'right', vertical: 'middle' };
  }

  private static addTotalsSection(
    worksheet: ExcelJS.Worksheet,
    labels: any,
    startRow: number,
    itemsStartRow: number,
    itemsEndRow: number,
    config: Required<ExcelExportOptions>
  ): void {
    // Subtotal
    worksheet.getCell(startRow, 5).value = labels.subtotal;
    worksheet.getCell(startRow, 5).font = { bold: true };
    worksheet.getCell(startRow, 5).alignment = { horizontal: 'right' };
    
    const subtotalCell = worksheet.getCell(startRow, 6);
    if (config.includeFormulas) {
      subtotalCell.value = { formula: `SUM(F${itemsStartRow}:F${itemsEndRow})` };
    } else {
      // Calculate from existing items only
      subtotalCell.value = 0; // Will be calculated by formula
    }
    subtotalCell.numFmt = '#,##0" VND"';
    subtotalCell.font = { bold: true };
    subtotalCell.alignment = { horizontal: 'right' };

    // Tax (VAT 10%)
    worksheet.getCell(startRow + 1, 5).value = labels.tax;
    worksheet.getCell(startRow + 1, 5).font = { bold: true };
    worksheet.getCell(startRow + 1, 5).alignment = { horizontal: 'right' };
    
    const taxCell = worksheet.getCell(startRow + 1, 6);
    if (config.includeFormulas) {
      taxCell.value = { formula: `F${startRow}*0.1` };
    } else {
      taxCell.value = 0;
    }
    taxCell.numFmt = '#,##0" VND"';
    taxCell.font = { bold: true };
    taxCell.alignment = { horizontal: 'right' };

    // Total
    worksheet.getCell(startRow + 2, 5).value = labels.total;
    worksheet.getCell(startRow + 2, 5).font = { bold: true, size: 14 };
    worksheet.getCell(startRow + 2, 5).alignment = { horizontal: 'right' };
    
    const totalCell = worksheet.getCell(startRow + 2, 6);
    if (config.includeFormulas) {
      totalCell.value = { formula: `F${startRow}+F${startRow + 1}` };
    } else {
      totalCell.value = 0;
    }
    totalCell.numFmt = '#,##0" VND"';
    totalCell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    totalCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4299e1' },
    };
    totalCell.alignment = { horizontal: 'right' };

    // Apply borders to totals section
    for (let row = startRow; row <= startRow + 2; row++) {
      for (let col = 5; col <= 6; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    }
  }

  private static addTermsSection(
    worksheet: ExcelJS.Worksheet,
    labels: any,
    startRow: number
  ): void {
    worksheet.getCell(startRow, 2).value = labels.termsAndConditions;
    worksheet.getCell(startRow, 2).font = { bold: true, size: 14 };

    const terms = [
      '• Báo giá này có hiệu lực trong vòng 30 ngày kể từ ngày phát hành.',
      '• Giá đã bao gồm thuế VAT 10%, chưa bao gồm phí vận chuyển (nếu có).',
      '• Điều kiện thanh toán: 50% tạm ứng, 50% khi giao hàng.',
      '• Thời gian giao hàng sẽ được xác nhận khi đặt hàng.',
      '• Báo giá này tuân theo các điều khoản và điều kiện tiêu chuẩn của chúng tôi.',
    ];

    terms.forEach((term, index) => {
      worksheet.getCell(startRow + 1 + index, 2).value = term;
      worksheet.mergeCells(startRow + 1 + index, 2, startRow + 1 + index, 6);
    });
  }

  private static setupSummaryWorksheet(
    worksheet: ExcelJS.Worksheet,
    quotations: Quotation[],
    config: Required<ExcelExportOptions>
  ): void {
    const labels = this.getLabels(config.vietnameseLabels);
    
    // Set column widths
    worksheet.columns = [
      { width: 15 },  // A: Quotation Number
      { width: 12 },  // B: Date
      { width: 20 },  // C: Customer Name
      { width: 20 },  // D: Company Name
      { width: 15 },  // E: Phone Number
      { width: 12 },  // F: Valid Until
      { width: 12 },  // G: Status
      { width: 10 },  // H: Items Count
      { width: 15 },  // I: Total Amount
    ];

    // Header
    const headers = [
      labels.quotationNumber,
      labels.date,
      labels.customerName,
      labels.companyName,
      labels.phoneNumber,
      labels.validUntil,
      labels.status,
      labels.itemsCount,
      labels.totalAmount,
    ];

    headers.forEach((header, index) => {
      const cell = worksheet.getCell(1, index + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4299e1' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data rows
    quotations.forEach((quotation, index) => {
      const row = index + 2;
      
      worksheet.getCell(row, 1).value = quotation.quotationNumber;
      worksheet.getCell(row, 2).value = moment(quotation.quotationDate).format('DD/MM/YYYY');
      worksheet.getCell(row, 3).value = quotation.customerName;
      worksheet.getCell(row, 4).value = quotation.companyName || '';
      worksheet.getCell(row, 5).value = quotation.phoneNumber;
      worksheet.getCell(row, 6).value = quotation.validUntil ? moment(quotation.validUntil).format('DD/MM/YYYY') : '';
      worksheet.getCell(row, 7).value = this.getStatusText(quotation.status);
      worksheet.getCell(row, 8).value = quotation.quotationItems.length;
      worksheet.getCell(row, 9).value = quotation.totalAmount;
      worksheet.getCell(row, 9).numFmt = '#,##0" VND"';

      // Apply borders
      for (let col = 1; col <= 9; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle' };
      }

      // Right align numeric columns
      worksheet.getCell(row, 8).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(row, 9).alignment = { horizontal: 'right', vertical: 'middle' };
    });

    // Add total row
    const totalRow = quotations.length + 3;
    worksheet.getCell(totalRow, 8).value = 'TỔNG CỘNG:';
    worksheet.getCell(totalRow, 8).font = { bold: true };
    worksheet.getCell(totalRow, 8).alignment = { horizontal: 'right', vertical: 'middle' };

    const totalCell = worksheet.getCell(totalRow, 9);
    if (config.includeFormulas) {
      totalCell.value = { formula: `SUM(I2:I${quotations.length + 1})` };
    } else {
      totalCell.value = quotations.reduce((sum, q) => sum + q.totalAmount, 0);
    }
    totalCell.numFmt = '#,##0" VND"';
    totalCell.font = { bold: true };
    totalCell.alignment = { horizontal: 'right', vertical: 'middle' };
    totalCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4299e1' },
    };
  }

  private static applyWorksheetStyling(
    worksheet: ExcelJS.Worksheet,
    tableStartRow: number,
    itemsEndRow: number
  ): void {
    // Auto-fit row heights
    for (let row = 1; row <= itemsEndRow + 10; row++) {
      const worksheetRow = worksheet.getRow(row);
      worksheetRow.height = worksheetRow.height || 20;
    }

    // Freeze panes (freeze header row)
    worksheet.views = [{ state: 'frozen', ySplit: tableStartRow }];
  }

  private static getLabels(vietnamese: boolean) {
    if (vietnamese) {
      return {
        documentTitle: 'BÁO GIÁ SẢN PHẨM',
        quotationNumber: 'Số báo giá',
        date: 'Ngày',
        validUntil: 'Có hiệu lực đến',
        status: 'Trạng thái',
        customerInfo: 'Thông tin khách hàng',
        customerName: 'Tên khách hàng',
        companyName: 'Tên công ty',
        phoneNumber: 'Điện thoại',
        no: 'STT',
        productName: 'Sản phẩm',
        description: 'Mô tả',
        quantity: 'SL',
        unitPrice: 'Đơn giá',
        totalPrice: 'Thành tiền',
        notes: 'Ghi chú',
        subtotal: 'Tạm tính:',
        tax: 'Thuế VAT (10%):',
        total: 'Tổng cộng:',
        termsAndConditions: 'Điều khoản & Điều kiện',
        itemsCount: 'Số lượng SP',
        totalAmount: 'Tổng tiền',
      };
    } else {
      return {
        documentTitle: 'PRODUCT QUOTATION',
        quotationNumber: 'Quotation #',
        date: 'Date',
        validUntil: 'Valid Until',
        status: 'Status',
        customerInfo: 'Customer Information',
        customerName: 'Customer Name',
        companyName: 'Company Name',
        phoneNumber: 'Phone Number',
        no: 'No.',
        productName: 'Product',
        description: 'Description',
        quantity: 'Qty',
        unitPrice: 'Unit Price',
        totalPrice: 'Total Price',
        notes: 'Notes',
        subtotal: 'Subtotal:',
        tax: 'Tax (10%):',
        total: 'Total:',
        termsAndConditions: 'Terms & Conditions',
        itemsCount: 'Items Count',
        totalAmount: 'Total Amount',
      };
    }
  }

  private static getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'Nháp',
      'SENT': 'Đã gửi',
      'ACCEPTED': 'Đã chấp nhận',
      'REJECTED': 'Đã từ chối',
      'EXPIRED': 'Hết hạn',
    };
    return statusMap[status.toUpperCase()] || status;
  }

  private static downloadFile(buffer: ArrayBuffer, filename: string): void {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default ExcelExporter;