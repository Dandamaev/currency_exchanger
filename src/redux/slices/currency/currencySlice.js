import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCurrencyList = createAsyncThunk(
    'currency/fetchCurrencyList',
    async () => {
        const { data } = await axios.get(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
        );
        return Object.keys(data).map(c => c.toUpperCase());
    }
);

export const fetchCurrencyRates = createAsyncThunk(
    'currency/fetchCurrencyRates',
    async (baseCurrency) => {
        const { data } = await axios.get(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`
        );

        const ratesRaw = data?.[baseCurrency.toLowerCase()] || {};

        const rates = Object.fromEntries(
            Object.entries(ratesRaw).map(([k, v]) => [k.toUpperCase(), Number(v)])
        );

        return rates;
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

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const apiDate = `${yyyy}-${mm}-${dd}`;       // для запроса
            const labelDate = `${dd}.${mm}.${yyyy}`;    // для отображения

            const { data } = await axios.get(
                `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${apiDate}/v1/currencies/${base.toLowerCase()}.json`
            );

            historyData.push({
                date: labelDate,
                rate: Number(data[base.toLowerCase()][target.toLowerCase()])
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
