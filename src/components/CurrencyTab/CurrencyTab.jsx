import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Table, Button, DatePicker, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
    fetchCurrencyList,
    fetchCurrencyRates,
    fetchCurrencyHistory,
    setBaseCurrency,
    setPeriod
} from '../../redux/actions.js';

const { Option } = Select;
const { RangePicker } = DatePicker;

const CurrencyTab = () => {
    const dispatch = useDispatch();
    const { currencies, rates, baseCurrency, loading, history, period } = useSelector(state => state);

    useEffect(() => {
        dispatch(fetchCurrencyList());
    }, [dispatch]);

    useEffect(() => {
        if (baseCurrency) {
            dispatch(fetchCurrencyRates(baseCurrency));
        }
    }, [baseCurrency, dispatch]);

    const handleCurrencyChange = value => {
        dispatch(setBaseCurrency(value));
    };

    const handleRefresh = () => {
        dispatch(fetchCurrencyRates(baseCurrency));
    };

    const handlePeriodChange = key => {
        dispatch(setPeriod(key));
        dispatch(fetchCurrencyHistory(baseCurrency, key));
    };

    const columns = [
        {
            title: 'Валюта',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Номинал',
            dataIndex: 'rate',
            key: 'rate',
        },
    ];

    const dataSource = Object.entries(rates).map(([pair, rate]) => ({
        key: pair,
        currency: pair.replace(baseCurrency, ''),
        rate: parseFloat(rate).toFixed(2),
    }));

    return (
        <div style={{ padding: 20 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                    <Select
                        loading={loading}
                        value={baseCurrency}
                        onChange={handleCurrencyChange}
                        style={{ width: 120 }}
                    >
                        {currencies.map(c => (
                            <Option key={c} value={c}>{c}</Option>
                        ))}
                    </Select>
                    <Button onClick={handleRefresh}>Обновить</Button>
                </Space>

                <Table dataSource={dataSource} columns={columns} pagination={false} rowKey="currency" />

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataSource}>
                        <XAxis dataKey="currency" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#1890ff" />
                    </BarChart>
                </ResponsiveContainer>

                <Select value={period} onChange={handlePeriodChange} style={{ width: 200 }}>
                    <Option value="1">За день</Option>
                    <Option value="3">За 3 дня</Option>
                    <Option value="7">За неделю</Option>
                    <Option value="30">За месяц</Option>
                </Select>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={history}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#6b8f71" />
                    </BarChart>
                </ResponsiveContainer>
            </Space>
        </div>
    );
};

export default CurrencyTab;
