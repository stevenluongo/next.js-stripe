import Stripe from "stripe";
import nextConnect from "next-connect";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const handler = nextConnect();

handler.get(async(req, res) => {
    //fetch invoice
    const invoice_id = req.url.replace("/api/stripe/invoice?id=", "");
    try {
        const invoice = await stripe.invoices.retrieve(
            invoice_id
        );
        res.json({completed_invoice: invoice})
    } catch (err) {
        res.status(500).json({error: {msg: err.raw.message, type: err.type}})
    }
});

handler.post(async(req, res) => {
    //create invoice
    try {
        const invoice = await stripe.invoices.create({
            customer: req.body,
        });
        res.json({invoice_id: invoice.id})
    } catch (err) {
        res.status(500).json({error: {msg: err.raw.message, type: err.type}})
    }
});

handler.put(async(req, res) => {
    res.json({msg: "update"})
});

handler.delete(async(req, res) => {
    res.json({msg: "delete"})
});

export default handler;