import { restClient } from '@polygon.io/client-js';
const rest = restClient("API_KEY");

const getPreviousBusinessDay = () => {
    const date = new Date();
    const day = date.getDay();
    if (day === 0) { // Sunday
        date.setDate(date.getDate() - 2); // Get Friday's date
    } else if (day === 6) { // Saturday
        date.setDate(date.getDate() - 1); // Get Friday's date
    } else {
        date.setDate(date.getDate() - 1); // Get yesterday's date
    }
    return date.toISOString().split("T")[0];
};

// https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
rest.stocks.aggregatesGroupedDaily(getPreviousBusinessDay()).then((data) => {
    console.log(data);
}).catch(e => {
    console.error('An error happened:', e);
});