import { Tabs } from 'antd';
import CurrencyTab from './CurrencyTab/CurrencyTab';
import DatesTab from './DatesTab/DatesTab';

const TabsContainer = () => {
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

export default TabsContainer;
