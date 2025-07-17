import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './slices/currencySlice';
import datesReducer from './slices/datesSlice';

export const store = configureStore({
    reducer: {
        currency: currencyReducer,
        dates: datesReducer,
    }
});
