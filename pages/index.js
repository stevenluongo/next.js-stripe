import { useState, useRef } from "react"
import ContactlessIcon from '@mui/icons-material/Contactless';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { LoadingBtn } from "../components/inputs";
import Payment from "../components/payment";
import { checkoutStorage } from "../lib/stripe";
import { useGlobalContext } from "../context/global-context";
import Stepper from "../components/stepper";
import PersonalDetails from "../components/details";
import Delivery from "../components/delivery";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Index () {
  const [isProcessing, setIsProcessing] = useState(false);
  const childCompRef = useRef()

  const {step, setStep, setMessage, billing_details, delivery_preference, total, vatTax} = useGlobalContext();

  const handleInformationSubmit = async() => {
    setMessage(null);
    //few things we need to do here
    const {first_name, last_name, email_address, address_line_1, country, state, city, zipcode} = billing_details;

    //ensure all required inputs are filled
    if(!first_name || !last_name || !email_address || !address_line_1 || !country || !state || !city || !zipcode) {
        //display errors
        setMessage({msgBody: "Please fill in the required fields.", msgError: true});
        return;
    }

    //sync data in local storage
    await checkoutStorage.setItem("billing_details", billing_details);
    //move user to next step in checkout process
    setStep(1)
  }
  const handleDeliverySubmit = async() => {
    if(!delivery_preference.fedex && !delivery_preference.usps && !delivery_preference.pickup) {
      setMessage({msgBody: "Please pick an option", msgError: true});
      return;
    }

    await checkoutStorage.setItem("delivery_preference", delivery_preference);
    setStep(2);
  }

  const handleStepUpdate = () => {
    setIsProcessing(true)
    setTimeout(() => {
      if(step === 0) {
        handleInformationSubmit();
        setIsProcessing(false);
        return;
      }
      if(step === 1) {
        handleDeliverySubmit();
        setIsProcessing(false);
        return;
      }
      if(step === 2) {
        childCompRef.current.showAlert();
        setIsProcessing(false)
        return;
      }
      setIsProcessing(false)
      setStep(step + 1)
    }, 650);
  }

  return (
    <div className="a_wrap">
      <nav className="a_nav">
        <span>
          <ContactlessIcon/>
          <h3>Stripe Checkout</h3>
        </span>
      </nav>
      <section className="a_content">
        <div className="a_c_stepper">
          <Stepper step={step} target={0} label='Personal Details'>
            <PersonalDetails/>
          </Stepper>
          <hr style={{height: step === 0 && '442px'}}/>
          <Stepper step={step} target={1} label='Delivery'>
            <Delivery/>
          </Stepper>
          <hr style={{height: step === 1 && '419px'}}/>
          <Stepper step={step} target={2} label='Payment'>
            <Elements stripe={stripePromise}>
              <Payment/>
            </Elements>
          </Stepper>
        </div>
        <div className="a_c_display">
          <p></p>
          <div className="a_c_d_summary">
            <div className="a_c_d_summary_item" style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
              <h1>Summary</h1>
              <hr/>
              <span className="a_c_d_summary_item_span">
                <p>Pro (Lifetime)</p>
                <p>$67.99</p>
              </span>
            </div>
            <div className="a_c_d_summary_item" style={{borderRadius: 0}}>
              <span style={{marginBottom: '2rem'}} className="a_c_d_summary_item_span">
                <p>Shipping</p>
                <p>{delivery_preference.fedex ? '$4.99' : delivery_preference.usps ? '$11.50' : delivery_preference.pickup ? 'FREE' : "TBD"}</p>
              </span>
              <span className="a_c_d_summary_item_span">
                <p>Taxes</p>
                <p>${vatTax}</p>
              </span>
            </div>
            <div className="a_c_d_summary_item" style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}>
              <span style={{marginBottom: '1.5rem'}} className="a_c_d_summary_item_span">
                <h3>Total</h3>
                <h3>${total}</h3>
              </span>
              <LoadingBtn
                className='a_c_d_summary_item_button'
                onClick={handleStepUpdate}
                loading={isProcessing}
                variant="contained"
                startIcon={step === 2 && <AttachMoneyIcon/>}
            >
              {step === 2 ? 'Pay' : 'Next'}
            </LoadingBtn>
              <div className="a_c_d_summary_item_promo">Have a promo code?</div>
            </div>
          </div>
        </div>
      </section>
      <div className='a_s_b_credits'>
        <p>Made with 💜 by <a target="_blank" rel="noreferrer" href="https://github.com/binolt">steven</a></p>
        <button onClick={() => setStep(step + 1)}>Next</button>
      </div>
    </div>
  )
}
