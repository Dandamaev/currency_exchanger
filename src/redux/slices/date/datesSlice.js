import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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

            // Добавим сегодняшнюю дату с GMT+5 и временем 12:00
            const now = new Date();
            const gmtPlus5OffsetMs = 5 * 60 * 60 * 1000;

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            const localDate = new Date(`${year}-${month}-${day}T12:00:00.000+05:00`);
            const isoDate = new Date(localDate.getTime() - gmtPlus5OffsetMs).toISOString();

            const todayDate = {
                date: isoDate,
                display: `${day}.${month}.${year} 12:00 (GMT+5)`,
            };

            rawDates.push(todayDate);

            // Случайные будущие даты (3 штуки), от 1 до 10 дней вперёд
            for (let i = 0; i < 3; i++) {
                const daysToAdd = Math.floor(Math.random() * 10) + 1;
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + daysToAdd);
                futureDate.setHours(15, 0, 0, 0); // фиксированное время 15:00

                const futureUtc = new Date(futureDate.getTime() - (3 * 60 * 60 * 1000)); // GMT+3 в UTC
                const iso = futureUtc.toISOString();

                const fYear = futureDate.getFullYear();
                const fMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
                const fDay = String(futureDate.getDate()).padStart(2, '0');

                const display = `${fDay}.${fMonth}.${fYear} 15:00 (GMT+3)`;

                rawDates.push({ date: iso, display });
            }

            const result = rawDates.map(d => ({
                iso: d.date,
                display: d.display,
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
            state.datesArray.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());
            state.sortOrder = 'asc';
        },
        sortDataDesc: (state) => {
            state.datesArray.sort((a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime());
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
