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
    async ({ base, target, period }) => {
        const days = Number(period);
        const today = new Date();
        const historyData = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();

            historyData.push({
                date: `${dd}-${mm}-${yyyy}`,
                rate: +(Math.random() * (1.5 - 0.5) + 0.5).toFixed(4),
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
        targetCurrency: 'USD',
        history: [],
        period: '7',
        error: null,
        loading: false,
        visibleAllCurrencies: false,
    },
    reducers: {
        setVisibleAllCurrencies: (state, action) => {
            state.visibleAllCurrencies = action.payload;
        },
        setPeriod: (state, action) => {
            state.period = action.payload;
        },
        setBaseCurrency: (state, action) => {
            state.baseCurrency = action.payload;
        },
        setTargetCurrency: (state, action) => {
            state.targetCurrency = action.payload;
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
    },
});

export const {
    setVisibleAllCurrencies,
    setPeriod,
    setBaseCurrency,
    setTargetCurrency,
} = currencySlice.actions;

export default currencySlice.reducer;
