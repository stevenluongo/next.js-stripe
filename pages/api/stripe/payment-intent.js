import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    try {
        const payment_intent_id = req.url.replace("/api/stripe/payment-intent?id=", "");
        const payment_intent = await stripe.paymentIntents.retrieve(
            payment_intent_id
        );
        res.json({payment_intent})
    } catch (err) {
        res.status(500).json({error: {msg: err.raw.message, type: err.type}})
    }
}

export default handler;