module.exports = {
  reactStrictMode: true,
  env : {
    'NEXT_PUBLIC_STRIPE_PUBLIC_KEY' : process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    'STRIPE_SECRET_KEY' : process.env.STRIPE_SECRET_KEY
  }
}
