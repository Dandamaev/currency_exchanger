// Список всех доступных валют, полученных с сервера
export const selectCurrencies = state => state.currency.currencies;

// Курсы валют относительно выбранной базовой валюты (ключ — код валюты, значение — курс)
export const selectRates = state => state.currency.rates;

// Код базовой валюты, относительно которой запрашиваются курсы (например, "RUB")
export const selectBaseCurrency = state => state.currency.baseCurrency;

// Флаг загрузки: true, когда выполняется любой из асинхронных запросов
export const selectLoading = state => state.currency.loading;

// Исторические данные по курсу за выбранный период
export const selectHistory = state => state.currency.history;

// Количество дней в периоде для графика истории (строка: "7", "30" и т.д.)
export const selectPeriod = state => state.currency.period;

// Отображать ли полный список валют или только избранные (для UI-переключателя)
export const selectVisibleAllCurrencies = state => state.currency.visibleAllCurrencies;

// Текст последней ошибки, если запрос к API завершился неудачно
export const selectError = state => state.currency.error;