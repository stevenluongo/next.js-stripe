import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";
import { useState, forwardRef, useImperativeHandle } from "react"
import { fetchPaymentIntent, appendInvoiceItems, finalizeStripeInvoice, createStripeCustomer, createStripeInvoice, calculateShipping, checkoutStorage } from "../lib/stripe";

const Checkout = forwardRef((props, ref) => {
    const [payment_message, setPaymentMessage] = useState(null);
    const router = useRouter();
  
    //hooks
    const stripe = useStripe();
    const elements = useElements();
    
    useImperativeHandle(ref, () => ({
      async showAlert() {
        //fetch payment_intent_id from cookies
        let { payment_intent_id, customer_id } = parseCookies();
        if(!payment_intent_id) {
          try {
              console.log('here')
              //create a new customer on stripe
              if(!customer_id) {
                  const id = await createStripeCustomer();
                  customer_id = id;
              }
  
              //store customer_id in cookies
              setCookie(null, 'customer_id', customer_id, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/',
              });
  
              //append invoice items to customer
              await appendInvoiceItems(customer_id);
  
              //append shipping costs to user
              await calculateShipping(customer_id);
  
              //create invoice on customer
              const invoice_id = await createStripeInvoice(customer_id);
  
              //store invoice_id in cookies
              setCookie(null, 'invoice_id', invoice_id, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/',
              });
              
              //finalize invoice
              const finalized_invoice = await finalizeStripeInvoice(invoice_id);
  
              //update payment_intent_id
              payment_intent_id = finalized_invoice.payment_intent;
  
              //store payment_intent_id in cookies
              setCookie(null, 'payment_intent_id', payment_intent_id, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/',
              });
  
          } catch (err) {
              //display errors
              setPaymentMessage({msgBody: err.message, msgError: true});
              return;
          }
      }
  
      try {
          //fetch payment intent
          const payment_intent = await fetchPaymentIntent(payment_intent_id);
  
          //confirm card payment
          const { status } = await confirmCardPayment(payment_intent, elements, stripe);
  
          //on successful payment
          if(status === "succeeded") {
              //display success message
              setPaymentMessage({msgBody: "Payment Successfully processed !", msgError: false});
  
  
              //clear cookies
              destroyCookie(null, 'payment_intent_id');
              destroyCookie(null, 'customer_id');
              destroyCookie(null, 'invoice_id');
  
              // clear local storage
              checkoutStorage.removeItem('billing_details');
              checkoutStorage.removeItem('delivery_preference');
  
              //redirect to success page
              console.log("DONE");
              router.push("/success");
          }
  
          //on fail payment
      } catch (err) {
          //display errors
          setPaymentMessage({msgBody: err.message, msgError: true});
          return;
      }
      },
    }));
    
    return (
        <form style={{width: 250}}>
            <CardElement/>
            {payment_message && <p>{payment_message.msgBody}</p>}
        </form>
    )
});
  
const confirmCardPayment = async(payment_intent, elements, stripe) => {
    const {error, paymentIntent} = await stripe.confirmCardPayment(payment_intent.client_secret, {
        payment_method: {
            card: elements.getElement(CardElement)
        }
    });
    //handle errors
    if(error) throw new Error(error.message, error.type);
    return paymentIntent;
}


export default Checkout;