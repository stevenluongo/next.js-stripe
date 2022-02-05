//URLS
const PROD_URL = 'https://checkout.d357ssoqg6gnyt.amplifyapp.com';
const DEV_URL = 'http://localhost:3000';
export const base_url = (process.env.NODE_ENV === "development") ? DEV_URL : PROD_URL;