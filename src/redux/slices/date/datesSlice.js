import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export const setDates = createAsyncThunk(
    'dates/setDates',
    async (_, { rejectWithValue }) => {
        try {
            const rawDates = [
                { date: '2025-04-25T09:00:00.000Z', display: '25.04.2025 12:00 (GMT+3)' },
                { date: '2025-04-25T07:00:00.000Z', display: '25.04.2025 12:00 (GMT+5)' },
                { date: '2025-04-23T20:50:00.000Z', display: '23.04.2025 23:50 (GMT+3)' },
                { date: '2025-04-23T19:50:00.000Z', display: '24.04.2025 00:50 (GMT+5)' },
                { date: '2025-04-22T15:00:00.000Z', display: '22.04.2025 18:00 (GMT+3)' },
                { date: '2025-04-26T04:00:00.000Z', display: '26.04.2025 07:00 (GMT+3)' },
            ];

            const result = rawDates.map(d => ({
                iso: d.date,
                display: d.display
            }));

            return result;
        } catch (e) {
            return rejectWithValue(e.message);
        }
    }
);

const datesSlice = createSlice({
    name: 'dates',
    initialState: {
        datesArray: [],
        sortOrder: 'asc',
        loading: false,
    },
    reducers: {
        sortDataAsc: (state) => {
            state.datesArray.sort((a, b) => dayjs(a.iso).valueOf() - dayjs(b.iso).valueOf());
            state.sortOrder = 'asc';
        },
        sortDataDesc: (state) => {
            state.datesArray.sort((a, b) => dayjs(b.iso).valueOf() - dayjs(a.iso).valueOf());
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
            .addCase(setDates.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { sortDataAsc, sortDataDesc } = datesSlice.actions;
export default datesSlice.reducer;
