//URLS
const PROD_URL = 'https://main.d3qrhg6lsotlu6.amplifyapp.com';
const DEV_URL = 'http://localhost:3000';
export const base_url = (process.env.NODE_ENV === "development") ? DEV_URL : PROD_URL;