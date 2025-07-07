import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Quotation } from '../services/api-client';

export interface PDFGeneratorOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export class PDFGenerator {
  private static readonly DEFAULT_OPTIONS: Required<PDFGeneratorOptions> = {
    filename: 'quotation.pdf',
    quality: 1.0,
    format: 'a4',
    orientation: 'portrait',
  };

  /**
   * Generate PDF from HTML element
   */
  static async generateFromElement(
    element: HTMLElement,
    options: PDFGeneratorOptions = {}
  ): Promise<jsPDF> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      removeContainer: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Calculate dimensions
    const imgWidth = config.format === 'a4' ? 210 : 216; // mm
    const pageHeight = config.format === 'a4' ? 297 : 279; // mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.format,
    });

    const imgData = canvas.toDataURL('image/png', config.quality);

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf;
  }

  /**
   * Generate and download PDF for a quotation
   */
  static async generateQuotationPDF(
    element: HTMLElement,
    quotation: Quotation,
    options: PDFGeneratorOptions = {}
  ): Promise<void> {
    try {
      const filename = options.filename || `quotation-${quotation.quotationNumber}.pdf`;
      const pdf = await this.generateFromElement(element, { ...options, filename });
      
      // Download the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Generate PDF as blob for preview or further processing
   */
  static async generateQuotationBlob(
    element: HTMLElement,
    options: PDFGeneratorOptions = {}
  ): Promise<Blob> {
    try {
      const pdf = await this.generateFromElement(element, options);
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw new Error('Failed to generate PDF blob. Please try again.');
    }
  }

  /**
   * Open PDF in new window for preview
   */
  static async previewQuotationPDF(
    element: HTMLElement,
    quotation: Quotation,
    options: PDFGeneratorOptions = {}
  ): Promise<void> {
    try {
      const pdf = await this.generateFromElement(element, options);
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open in new window
      const newWindow = window.open(pdfUrl, '_blank');
      if (!newWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);
    } catch (error) {
      console.error('Error previewing PDF:', error);
      throw new Error('Failed to preview PDF. Please try again.');
    }
  }

  /**
   * Generate PDF with watermark
   */
  static async generateWithWatermark(
    element: HTMLElement,
    quotation: Quotation,
    watermarkText: string = 'DRAFT',
    options: PDFGeneratorOptions = {}
  ): Promise<jsPDF> {
    const pdf = await this.generateFromElement(element, options);
    
    // Add watermark
    const pageCount = pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Set watermark style
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(50);
      pdf.setFont(undefined, 'bold');
      
      // Calculate position for center of page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const textWidth = pdf.getTextWidth(watermarkText);
      
      // Save current transformation matrix
      pdf.saveGraphicsState();
      
      // Rotate and position watermark
      pdf.setGState(pdf.gState);
      pdf.text(
        watermarkText,
        pageWidth / 2 - textWidth / 2,
        pageHeight / 2,
        {
          angle: 45,
          align: 'center',
        }
      );
      
      // Restore transformation matrix
      pdf.restoreGraphicsState();
    }
    
    return pdf;
  }

  /**
   * Batch generate multiple quotations
   */
  static async generateBatch(
    quotations: Array<{ element: HTMLElement; quotation: Quotation }>,
    options: PDFGeneratorOptions = {}
  ): Promise<jsPDF[]> {
    const pdfs: jsPDF[] = [];
    
    for (const { element, quotation } of quotations) {
      try {
        const pdf = await this.generateFromElement(element, {
          ...options,
          filename: `quotation-${quotation.quotationNumber}.pdf`,
        });
        pdfs.push(pdf);
      } catch (error) {
        console.error(`Error generating PDF for quotation ${quotation.quotationNumber}:`, error);
        // Continue with other quotations
      }
    }
    
    return pdfs;
  }

  /**
   * Combine multiple PDFs into one
   */
  static combinePDFs(pdfs: jsPDF[], filename: string = 'combined-quotations.pdf'): jsPDF {
    if (pdfs.length === 0) {
      throw new Error('No PDFs to combine');
    }
    
    const combinedPdf = new jsPDF();
    let isFirstPdf = true;
    
    pdfs.forEach((pdf) => {
      const pageCount = pdf.getNumberOfPages();
      
      for (let i = 1; i <= pageCount; i++) {
        if (!isFirstPdf || i > 1) {
          combinedPdf.addPage();
        }
        
        // This is a simplified approach - in practice, you might need more sophisticated merging
        const pageData = pdf.internal.pages[i];
        if (pageData) {
          combinedPdf.internal.pages[combinedPdf.getCurrentPageInfo().pageNumber] = pageData;
        }
      }
      
      isFirstPdf = false;
    });
    
    return combinedPdf;
  }
}

export default PDFGenerator;