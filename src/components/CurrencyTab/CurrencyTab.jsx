import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Select,
    Table,
    Button,
    Card,
    Row,
    Col,
    Typography,
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Title as ChartTitle,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import {
    fetchCurrencyList,
    fetchCurrencyRates,
    fetchCurrencyHistory,
    setBaseCurrency,
    setVisibleAllCurrencies,
    setPeriod,
    setTargetCurrency,
} from '../../redux/slices/currency/currencySlice';

import {
    selectCurrencies,
    selectRates,
    selectBaseCurrency,
    selectLoading,
    selectHistory,
    selectPeriod,
    selectVisibleAllCurrencies,
    selectTargetCurrency,
} from '../../redux/slices/currency/selectors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    ChartTitle
);

const { Option } = Select;
const { Title } = Typography;
const SHORT_LIST = ['USD', 'EUR', 'GBP', 'CNY'];

const CurrencyTab = () => {
    const dispatch = useDispatch();

    const currencies = useSelector(selectCurrencies);
    const rates = useSelector(selectRates);
    const baseCurrency = useSelector(selectBaseCurrency);
    const loading = useSelector(selectLoading);
    const history = useSelector(selectHistory);
    const period = useSelector(selectPeriod);
    const targetCurrency = useSelector(selectTargetCurrency);
    const showAll = useSelector(selectVisibleAllCurrencies);
    useEffect(() => {
        dispatch(fetchCurrencyList());
    }, [dispatch]);

    useEffect(() => {
        if (baseCurrency) {
            dispatch(fetchCurrencyRates(baseCurrency));
            dispatch(fetchCurrencyHistory({ base: baseCurrency, target: targetCurrency, period }));
        }
    }, [baseCurrency, targetCurrency, period, dispatch]);

    const handleBaseChange = val => dispatch(setBaseCurrency(val));
    const handleTargetChange = val => dispatch(setTargetCurrency(val));
    const handleRefresh = () => dispatch(fetchCurrencyRates(baseCurrency));
    const handlePeriod = val => {
        dispatch(setPeriod(val));
        dispatch(fetchCurrencyHistory({ base: baseCurrency, target: targetCurrency, period: val }));
    };

    const tableData = Object.entries(rates || {})
        .filter(([pair]) => {
            const cur = pair.replace(baseCurrency, '');
            return showAll || SHORT_LIST.includes(cur);
        })
        .map(([pair, rate]) => ({
            key: pair,
            currency: pair.replace(baseCurrency, ''),
            rate: Number(rate).toFixed(4),
        }));

    const columns = [
        { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
        { title: 'Курс', dataIndex: 'rate', key: 'rate' },
    ];

    const barData = {
        labels: tableData.map(d => d.currency),
        datasets: [
            {
                label: `Курс к ${baseCurrency}`,
                data: tableData.map(d => d.rate),
                backgroundColor: 'rgba(24, 144, 255, 0.6)',
                borderColor: '#1890ff',
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: history.map(d => d.date),
        datasets: [
            {
                label: `${baseCurrency}/${targetCurrency}`,
                data: history.map(d => d.rate),
                fill: false,
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.4)',
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
        plugins: {
            tooltip: {
                backgroundColor: '#1f1f1f',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#1890ff',
                borderWidth: 1,
            },
            legend: { display: false },
        },
        scales: {
            x: { ticks: { color: '#595959' }, grid: { color: '#f0f0f0' } },
            y: { beginAtZero: true, ticks: { color: '#595959' }, grid: { color: '#f0f0f0' } },
        },
    };

    return (
        <>
            <Row gutter={[16, 16]} style={{ marginLeft: 16, marginBottom: 10 }}>
                <Col>
                    <Select
                        value={baseCurrency}
                        onChange={handleBaseChange}
                        style={{ width: 120 }}
                    >
                        {currencies.map(c => (
                            <Option key={c} value={c}>{c}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Button onClick={handleRefresh}>Обновить</Button>
                </Col>
            </Row>

            <Card title={<Title level={4}>Курсы валют</Title>} style={{ body: { marginBottom: 24, padding: 24, background: '#f0f2f5' } }}>
                <Table
                    loading={loading}
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    rowKey="currency"
                    size="middle"
                    bordered
                    style={{ background: '#fff', borderRadius: 8 }}
                />
                <Button
                    type="dashed"
                    icon={showAll ? <MinusOutlined /> : <PlusOutlined />}
                    onClick={() => dispatch(setVisibleAllCurrencies(!showAll))}
                    style={{ marginTop: 16 }}
                    block
                >
                    {showAll ? 'Свернуть' : 'Показать все валюты'}
                </Button>
            </Card >

            <Card title={<Title level={4}>Гистограмма курса</Title>} style={{ marginBottom: 24 }} bodyStyle={{ padding: 24 }}>
                <div style={{ width: '100%', height: 400 }}>
                    <Bar data={barData} options={chartOptions} />
                </div>
            </Card>

            <Card
                title={
                    <>
                        История {baseCurrency} к{' '}
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                option?.children?.toLowerCase().includes(input.toLowerCase())
                            }
                            value={targetCurrency}
                            onChange={handleTargetChange}
                            style={{ width: 120, marginRight: 8 }}
                        >
                            {currencies.map((currency) => (
                                <Option key={currency} value={currency}>
                                    {currency}
                                </Option>
                            ))}
                        </Select>
                        за{' '}
                        <Select value={period} onChange={handlePeriod} style={{ width: 100 }}>
                            <Option value="1">1 день</Option>
                            <Option value="3">3 дня</Option>
                            <Option value="7">неделю</Option>
                            <Option value="30">месяц</Option>
                        </Select>
                    </>
                }
                style={{
                    body: { padding: 24 }
                }}
            >
                <div style={{ width: '100%', height: 400 }}>
                    <Line data={lineData} options={chartOptions} />
                </div>
            </Card >
        </>
    );
};

export default CurrencyTab;
