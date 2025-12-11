const rawBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

const config = {
  apiBaseUrl: normalizedBaseUrl,
  polygonApiKey: process.env.REACT_APP_POLYGON_API_KEY || 'DnGGuI3gDXto9JPBvAVKuu8tHr15fWqG',
};

export default config;