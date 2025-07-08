import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      className="w-30"
      suffixIcon={<GlobalOutlined />}
    >
      <Option value="vi">Tiếng Việt</Option>
      <Option value="en">English</Option>
    </Select>
  );
};

export default LanguageSwitcher;
