import { Tabs } from 'antd';
import CurrencyTab from './components/CurrencyTab/CurrencyTab';
import DatesTab from './components/DatesTab/DatesTab';

const App = () => {
  const TabKey = {
    Currency: 'currency',
    Dates: 'dates',
  }

  const items = [
    {
      key: TabKey.Currency,
      label: 'Currency exchanger',
      children: <CurrencyTab />,
    },
    {
      key: TabKey.Dates,
      label: 'Sorting dates',
      children: <DatesTab />,
    },
  ];
  return <Tabs defaultActiveKey={TabKey.Currency} type="card" items={items} />;
};

export default App;
