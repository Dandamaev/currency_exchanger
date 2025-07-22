import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDates, sortDataAsc, sortDataDesc } from '../../redux/slices/date/datesSlice';
import { selectDatesArray, selectSortOrder, selectLoading } from '../../redux/slices/date/selectos';
import { Button, Spin, List, Typography, Card, Space, Tag } from 'antd';

const { Text } = Typography;

const DatesTab = () => {
    const dispatch = useDispatch();

    const datesArray = useSelector(selectDatesArray);
    const sortOrder = useSelector(selectSortOrder);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(setDates());
    }, [dispatch]);

    const handleSortAsc = () => dispatch(sortDataAsc());
    const handleSortDesc = () => dispatch(sortDataDesc());

    const getDateType = (isoString) => {
        const inputDate = new Date(isoString);
        const now = new Date();

        const inputY = inputDate.getFullYear();
        const inputM = inputDate.getMonth();
        const inputD = inputDate.getDate();

        const nowY = now.getFullYear();
        const nowM = now.getMonth();
        const nowD = now.getDate();

        if (inputY === nowY && inputM === nowM && inputD === nowD) {
            return 'today';
        } else if (
            inputY < nowY ||
            (inputY === nowY && inputM < nowM) ||
            (inputY === nowY && inputM === nowM && inputD < nowD)
        ) {
            return 'past';
        } else {
            return 'future';
        }
    };

    const getTag = (type) => {
        switch (type) {
            case 'past':
                return <Tag color="red">Прошлая</Tag>;
            case 'today':
                return <Tag color="green">Сегодня</Tag>;
            case 'future':
                return <Tag color="blue">Будущая</Tag>;
            default:
                return null;
        }
    };

    return (
        <Card
            style={{
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#fafafa',
            }}
        >
            <Space style={{ marginBottom: 16 }}>
                <Button
                    onClick={handleSortAsc}
                    type={sortOrder === 'asc' ? 'primary' : 'default'}
                >
                    По возрастанию
                </Button>
                <Button
                    onClick={handleSortDesc}
                    type={sortOrder === 'desc' ? 'primary' : 'default'}
                >
                    По убыванию
                </Button>
            </Space>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <List
                    size="large"
                    bordered
                    dataSource={datesArray}
                    style={{ marginTop: 16 }}
                    renderItem={(item) => {
                        const type = getDateType(item.iso);
                        return (
                            <List.Item
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 8,
                                    margin: '6px 0',
                                    padding: '12px 16px',
                                }}
                            >
                                <Space size="middle">
                                    {getTag(type)}
                                    <Text>{item.display}</Text>
                                </Space>
                            </List.Item>
                        );
                    }}
                />
            )}
        </Card>
    );
};

export default DatesTab;
