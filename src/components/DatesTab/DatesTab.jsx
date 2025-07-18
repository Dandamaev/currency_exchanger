import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDates, sortDataAsc, sortDataDesc } from '../../redux/slices/date/datesSlice';
import { selectDatesArray, selectSortOrder, selectLoading } from '../../redux/slices/date/selectos';
import { Button, Spin, List, Typography } from 'antd';

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

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <Button onClick={handleSortAsc} type={sortOrder === 'asc' ? 'primary' : 'default'} style={{ marginRight: 8 }}>
                    По возрастанию
                </Button>
                <Button onClick={handleSortDesc} type={sortOrder === 'desc' ? 'primary' : 'default'}>
                    По убыванию
                </Button>
            </div>

            {loading ? (
                <Spin size="large" />
            ) : (
                <List
                    bordered
                    dataSource={datesArray}
                    renderItem={(item) => (
                        <List.Item>
                            <Text>{item.display}</Text>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default DatesTab;
