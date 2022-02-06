import Stripe from "stripe";
import nextConnect from "next-connect";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = nextConnect();

handler.get(async(req, res) => {
    res.json({msg: "get"})
});

handler.post(async(req, res) => {
    //create new customer
    try {
        const customer = await stripe.customers.create(req.body);
        res.status(201).json({id: customer.id});
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