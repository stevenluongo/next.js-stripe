import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
    try {
        const invoice = await stripe.invoices.finalizeInvoice(
            req.body
        );
        res.json({finalized_invoice: invoice});
    } catch (err) {
        res.status(500).json({error: {msg: err.raw.message, type: err.type}})
    }
}

export default handler;