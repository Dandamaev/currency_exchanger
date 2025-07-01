const API_URL = 'https://open.er-api.com/v6/latest';

export const setBaseCurrency = (currency) => ({
    type: 'SET_BASE_CURRENCY',
    payload: currency,
});

export const setPeriod = (period) => ({
    type: 'SET_PERIOD',
    payload: period,
});

export const fetchCurrencyList = () => async (dispatch) => {
    dispatch({ type: 'SET_LOADING' });
    const res = await fetch(`${API_URL}/USD`);
    const data = await res.json();
    const currencyCodes = Object.keys(data.rates);
    dispatch({ type: 'SET_CURRENCY_LIST', payload: currencyCodes });
};

export const fetchCurrencyRates = (base) => async (dispatch) => {
    dispatch({ type: 'SET_LOADING' });
    const res = await fetch(`${API_URL}/${base}`);
    const data = await res.json();
    dispatch({ type: 'SET_RATES', payload: data.rates });
};

export const fetchCurrencyHistory = (base, period) => async (dispatch) => {
    // exchangerate-api.com в open source не предоставляет исторические данные,
    // использую фейковые данные для демонстрации
    const today = new Date();
    const days = parseInt(period, 10);
    const historyData = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        historyData.push({
            date: date.toISOString().split('T')[0],
            rate: +(Math.random() * (120 - 60) + 60).toFixed(2),
        });
    }
    dispatch({ type: 'SET_HISTORY', payload: historyData });
};
