import React from 'react';
import { Quotation, QuotationItem } from '../../services/api-client';
import moment from 'moment';
import './QuotationPDF.css';

interface QuotationPDFProps {
  quotation: Quotation;
  onRef?: (ref: HTMLDivElement | null) => void;
}

const QuotationPDF: React.FC<QuotationPDFProps> = ({ quotation, onRef }) => {
  const calculateSubtotal = () => {
    return quotation.quotationItems.reduce(
      (total, item) => total + (item.quantity * item.unitPrice), 
      0
    );
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.1; // 10% tax
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div ref={onRef} className="quotation-pdf">
      {/* Header */}
      <div className="pdf-header">
        <div className="company-info">
          <div className="company-logo">
            <div className="logo-placeholder">
              <span className="logo-text">COMPANY</span>
              <span className="logo-subtext">LOGO</span>
            </div>
          </div>
          <div className="company-details">
            <h1 className="company-name">Your Company Name</h1>
            <div className="company-address">
              <p>123 Business Street</p>
              <p>Business City, State 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@yourcompany.com</p>
              <p>Website: www.yourcompany.com</p>
            </div>
          </div>
        </div>
        <div className="quotation-info">
          <h2 className="document-title">QUOTATION</h2>
          <div className="quotation-details">
            <div className="detail-row">
              <span className="label">Quotation #:</span>
              <span className="value">{quotation.quotationNumber}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date:</span>
              <span className="value">{moment(quotation.quotationDate).format('MMM DD, YYYY')}</span>
            </div>
            {quotation.validUntil && (
              <div className="detail-row">
                <span className="label">Valid Until:</span>
                <span className="value">{moment(quotation.validUntil).format('MMM DD, YYYY')}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className={`value status-${quotation.status.toLowerCase()}`}>
                {quotation.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-section">
        <h3 className="section-title">Bill To:</h3>
        <div className="customer-info">
          <div className="customer-name">{quotation.customerName}</div>
          {quotation.companyName && (
            <div className="customer-company">{quotation.companyName}</div>
          )}
          <div className="customer-phone">Phone: {quotation.phoneNumber}</div>
        </div>
      </div>

      {/* Items Table */}
      <div className="items-section">
        <table className="items-table">
          <thead>
            <tr>
              <th className="item-col">Item</th>
              <th className="desc-col">Description</th>
              <th className="qty-col">Qty</th>
              <th className="price-col">Unit Price</th>
              <th className="total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation.quotationItems.map((item: QuotationItem, index: number) => {
              const itemTotal = item.quantity * item.unitPrice;
              return (
                <tr key={index} className="item-row">
                  <td className="item-col">
                    <div className="product-name">{item.product?.name || `Product ID: ${item.productId}`}</div>
                    <div className="product-code">{item.product?.code}</div>
                  </td>
                  <td className="desc-col">
                    <div className="product-description">
                      {item.product?.description || ''}
                    </div>
                    {item.notes && (
                      <div className="item-notes">{item.notes}</div>
                    )}
                  </td>
                  <td className="qty-col">{item.quantity}</td>
                  <td className="price-col">{formatCurrency(item.unitPrice)}</td>
                  <td className="total-col">{formatCurrency(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="totals-section">
        <div className="totals-container">
          <div className="total-row subtotal-row">
            <span className="total-label">Subtotal:</span>
            <span className="total-value">{formatCurrency(subtotal)}</span>
          </div>
          <div className="total-row tax-row">
            <span className="total-label">Tax (10%):</span>
            <span className="total-value">{formatCurrency(tax)}</span>
          </div>
          <div className="total-row grand-total-row">
            <span className="total-label">Total Amount:</span>
            <span className="total-value">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {quotation.notes && (
        <div className="notes-section">
          <h3 className="section-title">Notes:</h3>
          <div className="notes-content">{quotation.notes}</div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div className="terms-section">
        <h3 className="section-title">Terms & Conditions:</h3>
        <div className="terms-content">
          <p>• This quotation is valid for {quotation.validUntil ? moment(quotation.validUntil).diff(moment(quotation.quotationDate), 'days') : '30'} days from the date of issue.</p>
          <p>• Prices are in USD and exclude shipping costs unless otherwise specified.</p>
          <p>• Payment terms: 50% advance, 50% on delivery.</p>
          <p>• Delivery time will be confirmed upon order confirmation.</p>
          <p>• This quotation is subject to our standard terms and conditions.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pdf-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>Thank you for your business!</p>
            <p>For any questions, please contact us at the above information.</p>
          </div>
          <div className="footer-right">
            <div className="signature-section">
              <div className="signature-line"></div>
              <div className="signature-label">Authorized Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPDF;