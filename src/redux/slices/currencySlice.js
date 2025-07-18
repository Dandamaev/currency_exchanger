import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCurrencyList = createAsyncThunk(
    'currency/fetchCurrencyList',
    async () => {
        const { data } = await axios.get('https://open.er-api.com/v6/latest/USD');
        return Object.keys(data.rates);
    }
);

export const fetchCurrencyRates = createAsyncThunk(
    'currency/fetchCurrencyRates',
    async (baseCurrency) => {
        const { data } = await axios.get(
            `https://open.er-api.com/v6/latest/${baseCurrency}`
        );
        return data.rates;
    }
);

export const fetchCurrencyHistory = createAsyncThunk(
    'currency/fetchCurrencyHistory',
    async ({ base, period }) => {
        const days = Number(period);
        const today = new Date();
        const historyData = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            historyData.push({
                date: date.toISOString().split('T')[0],
                rate: +(Math.random() * (120 - 60) + 60).toFixed(2),
            });
        }

        return historyData;
    }
);

const currencySlice = createSlice({
    name: 'currency',
    initialState: {
        currencies: [],
        rates: {},
        baseCurrency: 'RUB',
        history: [],
        period: '7',
        error: null,
        loading: false,
        visibleAllCurrencies: false
    },
    reducers: {
        setVisibleAllCurrencies: (state, action) => {
            state.visibleAllCurrencies = action.payload
        },
        setPeriod: (state, action) => {
            state.period = action.payload
        },
        setBaseCurrency: (state, action) => {
            state.baseCurrency = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrencyList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrencyList.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = action.payload;
            })
            .addCase(fetchCurrencyList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCurrencyRates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
                state.loading = false;
                state.rates = action.payload;
            })
            .addCase(fetchCurrencyRates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCurrencyHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrencyHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchCurrencyHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setVisibleAllCurrencies, setPeriod, setBaseCurrency } = currencySlice.actions;
export default currencySlice.reducer;