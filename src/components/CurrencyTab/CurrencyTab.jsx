import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Select,
    Table,
    Button,
    Spin,
    Card,
    Row,
    Col,
    Typography,
} from 'antd';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    BarChart,
} from 'recharts';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

import {
    fetchCurrencyList,
    fetchCurrencyRates,
    fetchCurrencyHistory,
    setBaseCurrency,
} from '../../redux/slices/currencySlice';

const { Option } = Select;
const { Title } = Typography;

// валюта, которую показываем всегда
const SHORT_LIST = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD', 'PLN'];

const CurrencyTab = () => {
    const dispatch = useDispatch();
    const {
        currencies,
        rates,
        baseCurrency,
        loading,
        history,
        period,
    } = useSelector(state => state.currency);

    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        dispatch(fetchCurrencyList());
    }, [dispatch]);

    useEffect(() => {
        if (baseCurrency) {
            dispatch(fetchCurrencyRates(baseCurrency));
            dispatch(fetchCurrencyHistory({ base: baseCurrency, period }));
        }
    }, [baseCurrency, period, dispatch]);

    const handleBaseChange = val => dispatch(setBaseCurrency(val));
    const handleRefresh = () => dispatch(fetchCurrencyRates(baseCurrency));
    const handlePeriod = val => dispatch(fetchCurrencyHistory({ base: baseCurrency, period: val }));

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

    return (
        <Spin spinning={loading}>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col>
                    <Select
                        value={baseCurrency}
                        onChange={handleBaseChange}
                        style={{ width: 120 }}
                        loading={loading}
                        placeholder="Базовая валюта"
                    >
                        {currencies.map(c => (
                            <Option key={c} value={c}>{c}</Option>
                        ))}
                    </Select>
                </Col>

                <Col>
                    <Button onClick={handleRefresh}>Обновить</Button>
                </Col>

                <Col>
                    <Select
                        value={period}
                        onChange={handlePeriod}
                        style={{ width: 160 }}
                    >
                        <Option value="1">1 день</Option>
                        <Option value="3">3 дня</Option>
                        <Option value="7">Неделя</Option>
                        <Option value="30">Месяц</Option>
                    </Select>
                </Col>
            </Row>

            <Card title={`Курсы относительно ${baseCurrency || ''}`} style={{ marginBottom: 24 }}>
                <Table
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    rowKey="currency"
                    size="small"
                />

                {!showAll && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setShowAll(true)}
                        style={{ marginTop: 16 }}
                        block
                    >
                        Показать все валюты
                    </Button>
                )}
                {showAll && (
                    <Button
                        type="dashed"
                        icon={<MinusOutlined />}
                        onClick={() => setShowAll(false)}
                        style={{ marginTop: 16 }}
                        block
                    >
                        Свернуть
                    </Button>
                )}
            </Card>

            <Card title="Курс валют" style={{ marginBottom: 24 }}>
                <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                        <BarChart data={tableData}>
                            <XAxis dataKey="currency" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="rate" fill="#1890ff" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card title="История курса" style={{ marginBottom: 24 }}>
                <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                        <LineChart data={history}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#1890ff"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

        </Spin>
    );
};

export default CurrencyTab;
