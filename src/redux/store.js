import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './slices/currency/currencySlice';
import datesReducer from './slices/date/datesSlice';

export const store = configureStore({
    reducer: {
        currency: currencyReducer,
        dates: datesReducer,
    }
});
