import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './reducer';

export const store = configureStore({
    reducer: currencyReducer,
});
