//URLS
const PROD_URL = 'https://main.d141e7lnm9p16q.amplifyapp.com';
const DEV_URL = 'http://localhost:3000';
export const base_url = (process.env.NODE_ENV === "development") ? DEV_URL : PROD_URL;