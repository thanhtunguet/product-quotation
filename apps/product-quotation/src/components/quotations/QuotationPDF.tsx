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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'DRAFT': 'Nháp',
      'SENT': 'Đã gửi',
      'ACCEPTED': 'Đã chấp nhận',
      'REJECTED': 'Đã từ chối',
      'EXPIRED': 'Hết hạn',
    };
    return statusMap[status.toUpperCase()] || status;
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
            <h1 className="company-name">CÔNG TY TNHH ABC</h1>
            <div className="company-address">
              <p>123 Đường Nguyễn Văn Cừ, Quận 1</p>
              <p>Thành phố Hồ Chí Minh, Việt Nam</p>
              <p>Điện thoại: (028) 123-4567</p>
              <p>Email: info@abc.com.vn</p>
              <p>Website: www.abc.com.vn</p>
            </div>
          </div>
        </div>
        <div className="quotation-info">
          <h2 className="document-title">BÁO GIÁ SẢN PHẨM</h2>
          <div className="quotation-details">
            <div className="detail-row">
              <span className="label">Số báo giá:</span>
              <span className="value">{quotation.quotationNumber}</span>
            </div>
            <div className="detail-row">
              <span className="label">Ngày:</span>
              <span className="value">{moment(quotation.quotationDate).format('DD/MM/YYYY')}</span>
            </div>
            {quotation.validUntil && (
              <div className="detail-row">
                <span className="label">Có hiệu lực đến:</span>
                <span className="value">{moment(quotation.validUntil).format('DD/MM/YYYY')}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Trạng thái:</span>
              <span className={`value status-${quotation.status.toLowerCase()}`}>
                {getStatusText(quotation.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-section">
        <h3 className="section-title">Thông tin khách hàng:</h3>
        <div className="customer-info">
          <div className="customer-name">{quotation.customerName}</div>
          {quotation.companyName && (
            <div className="customer-company">{quotation.companyName}</div>
          )}
          <div className="customer-phone">Điện thoại: {quotation.phoneNumber}</div>
        </div>
      </div>

      {/* Items Table */}
      <div className="items-section">
        <table className="items-table">
          <thead>
            <tr>
              <th className="item-col">Sản phẩm</th>
              <th className="desc-col">Mô tả</th>
              <th className="qty-col">SL</th>
              <th className="price-col">Đơn giá</th>
              <th className="total-col">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {quotation.quotationItems.map((item: QuotationItem, index: number) => {
              const itemTotal = item.quantity * item.unitPrice;
              return (
                <tr key={index} className="item-row">
                  <td className="item-col">
                    <div className="product-name">{item.product?.name || `Mã sản phẩm: ${item.productId}`}</div>
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
            <span className="total-label">Tạm tính:</span>
            <span className="total-value">{formatCurrency(subtotal)}</span>
          </div>
          <div className="total-row tax-row">
            <span className="total-label">Thuế VAT (10%):</span>
            <span className="total-value">{formatCurrency(tax)}</span>
          </div>
          <div className="total-row grand-total-row">
            <span className="total-label">Tổng cộng:</span>
            <span className="total-value">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {quotation.notes && (
        <div className="notes-section">
          <h3 className="section-title">Ghi chú:</h3>
          <div className="notes-content">{quotation.notes}</div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div className="terms-section">
        <h3 className="section-title">Điều khoản & Điều kiện:</h3>
        <div className="terms-content">
          <p>• Báo giá này có hiệu lực trong vòng {quotation.validUntil ? moment(quotation.validUntil).diff(moment(quotation.quotationDate), 'days') : '30'} ngày kể từ ngày phát hành.</p>
          <p>• Giá đã bao gồm thuế VAT 10%, chưa bao gồm phí vận chuyển (nếu có).</p>
          <p>• Điều kiện thanh toán: 50% tạm ứng, 50% khi giao hàng.</p>
          <p>• Thời gian giao hàng sẽ được xác nhận khi đặt hàng.</p>
          <p>• Báo giá này tuân theo các điều khoản và điều kiện tiêu chuẩn của chúng tôi.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="pdf-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>Cảm ơn quý khách đã quan tâm đến sản phẩm của chúng tôi!</p>
            <p>Mọi thắc mắc xin vui lòng liên hệ theo thông tin trên.</p>
          </div>
          <div className="footer-right">
            <div className="signature-section">
              <div className="signature-line"></div>
              <div className="signature-label">Chữ ký người có thẩm quyền</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPDF;