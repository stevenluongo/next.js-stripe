import CheckoutService from "../services/checkout-service";
import localforage from "localforage";

export const checkoutStorage = localforage.createInstance({
    name: "checkout"
});

export const createStripeCustomer = async() => {
    //fetch billing_details from local storage
    const local_billing_details = await checkoutStorage.getItem("billing_details");
    const { first_name, last_name, email_address, address_line_1, city, state, country, zipcode } = local_billing_details;

    //format data for stripe
    const payload = {
        name: first_name + ' ' + last_name,
        email: email_address,
        address: {
            line1: address_line_1,
            city: city,
            state: state.value,
            country: country.value,
            postal_code: zipcode
        }
    }

    //create new customer
    const { id, error } = await CheckoutService.createCustomer(payload);

    //error handling
    if(error) throw new Error(error.msg, error.type);

    return id;
}

export const calculateShipping = async(customer_id) => {
    //fetch delivery_preference from local storage
    const local_delivery_preference = await checkoutStorage.getItem("delivery_preference");

    //append shipping item to customer if applicable
    if(local_delivery_preference.fedex) {
        //format data for stripe
        const payload = {customer: customer_id, price: 'price_1JnsbPCABtvExHfR594lIIEZ', quantity: 1};
        //create invoice item
        const { error } = await CheckoutService.createInvoiceItem(payload);
        //handle errors
        if(error) throw new Error(error.msg, error.type);
    }
}

export const createStripeInvoice = async(customer_id) => {
    //create invoice on customer
    const { invoice_id, error } = await CheckoutService.createInvoice(customer_id);
    //handle errors
    if(error) throw new Error(error.msg, error.type)
    return invoice_id;
}

export const finalizeStripeInvoice = async(invoice_id) => {
    //finalize invoice
    const {finalized_invoice, error} = await CheckoutService.finalizeInvoice(invoice_id);
    //handle errors
    if(error) throw new Error(error.msg, error.type)
    return finalized_invoice;
}

export const appendInvoiceItems = async(customerId) => {
    //loops through the cart and creates invoice items for each product on the newly created user
    await CheckoutService.createInvoiceItem({customer: customerId, price: 'price_1KQ17iCABtvExHfR9acerUzk', quantity: 1})

    return;
}

export const fetchPaymentIntent = async(payment_intent_id) => {
    //fetch payment intent
    const { error, payment_intent } = await CheckoutService.retrievePaymentIntent(payment_intent_id);
    //handle errors
    if(error) throw new Error(error.msg, error.type)
    return payment_intent;
}

function Error(message, type) {
    this.message = message;
    this.type = type;
}