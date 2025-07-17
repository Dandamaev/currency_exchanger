import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export const setDates = createAsyncThunk(
    'dates/setDates',
    async (_, { rejectWithValue }) => {
        try {
            const datesArray = [
                // 1. добавление двух фиксированных строк
                '23.04.2025 23:50 (GMT +3)',
                '24.04.2025 00:50 (GMT +5)',
                // 2. добавление пары «одна и та же дата в разных TZ»
                '23.04.2025 23:50 (GMT +3)',
                '23.04.2025 23:50 (GMT +5)',
                // 3. цикл для остальных дат с шагом 6 ч
                '24.04.2025 00:50 (GMT +3)',
                '24.04.2025 00:50 (GMT +5)',
                '24.04.2025 06:50 (GMT +3)',
                '24.04.2025 06:50 (GMT +5)',
                '24.04.2025 12:50 (GMT +3)',
                '24.04.2025 12:50 (GMT +5)',
                '24.04.2025 18:50 (GMT +3)',
                '24.04.2025 18:50 (GMT +5)',
            ];
            return datesArray;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
)

const datesSlice = createSlice({
    name: 'dates',
    initialState: {
        datesArray: [],
        sortOrder: 'asc',
        loading: false,
    },
    reducers: {
        sortDataAsc: (state) => {
            state.datesArray.sort((a, b) => dayjs(a) - dayjs(b));
            state.sortOrder = 'asc';
        },
        sortDataDesc: (state) => {
            state.datesArray.sort((a, b) => dayjs(b) - dayjs(a));
            state.sortOrder = 'desc';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setDates.pending, (state) => {
                state.loading = true;
            })
            .addCase(setDates.fulfilled, (state, action) => {
                state.loading = false;
                state.datesArray = action.payload;
            })
            .addCase(setDates.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const { sortDataAsc, sortDataDesc } = datesSlice.actions;
export default datesSlice.reducer;