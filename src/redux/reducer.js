const initialState = {
    currencies: [],
    rates: {},
    baseCurrency: 'RUB',
    loading: false,
    history: [],
    period: '7',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true };

        case 'SET_CURRENCY_LIST':
            return { ...state, currencies: action.payload, loading: false };

        case 'SET_BASE_CURRENCY':
            return { ...state, baseCurrency: action.payload };

        case 'SET_RATES':
            return { ...state, rates: action.payload, loading: false };

        case 'SET_PERIOD':
            return { ...state, period: action.payload };

        case 'SET_HISTORY':
            return { ...state, history: action.payload };

        default:
            return state;
    }
};

export default reducer;
