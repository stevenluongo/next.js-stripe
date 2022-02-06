import { useState, useRef } from "react"
import ContactlessIcon from '@mui/icons-material/Contactless';
import { CSSTransition } from 'react-transition-group';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { VisualizeButton, CssTextField } from "../lib/components";
import { default_billing_details } from "../lib/data";
import Checkout from "../components/checkout";
import { checkoutStorage } from "../lib/stripe";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Index () {
  const [step, setStep] = useState(0);
  const [billing_details, setBillingDetails] = useState(default_billing_details);
  const [delivery_preference, setDeliveryPreference] = useState({pickup: false, usps: false, fedex: false});
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vatTax, setVatTax] = useState(4.07);
  const [total, setTotal] = useState(67.99 + 4.07)
  const childCompRef = useRef()

  const subtotal = 67.99

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

  const handleCheckboxChange = (target) => {
    const mutated_state = {
      fedex: false,
      usps: false,
      pickup :false,
      [target] : !delivery_preference[target]
    }
    if(target === "fedex") {
      const updatedSubtotal = subtotal + 4.99;
      const newVax = (updatedSubtotal * 0.06);
      setVatTax(newVax.toFixed(2));
      setTotal((newVax + updatedSubtotal).toFixed(2))
    } 
    else if(target === 'usps') {
      const updatedSubtotal = subtotal + 11.50;
      const newVax = (updatedSubtotal * 0.06);
      setVatTax(newVax.toFixed(2));
      setTotal((newVax + updatedSubtotal).toFixed(2))
    }
    else if(target === "pickup") {
      setVatTax(4.07);
      setTotal(67.99 + 4.07)
    }
    setDeliveryPreference(mutated_state);
  }

  const handleChange = (e) => {
    const mutated_state = {
        ...billing_details,
        [e.target.name]: e.target.value,
    }
    setBillingDetails(mutated_state);
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
          <div 
            className="a_c_s_bubble a_c_s_bubble_outline" 
            style={{backgroundColor: step === 0 ? 'var(--primary-text-accent)' : 'transparent'}}
          >
            <span onClick={() => !isProcessing && setStep(0)}>
              <p style={{color: step === 0 ? 'var(--primary-text-accent)' : '#bfbcc4'}}>Step 01</p>
              <h1 style={{color: step === 0 ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === 0 ? '1.8em' : '1.2em'}}>Personal Details</h1>
            </span>
          </div>
          <hr style={{height: (step === 1 || step === 2) && '70px'}}/>
          <div 
            className="a_c_s_bubble a_c_s_bubble_outline" 
            style={{backgroundColor: step === 1 ? 'var(--primary-text-accent)' : 'transparent'}}
          >
            <span onClick={() => !isProcessing && setStep(1)}>
              <p style={{color: step === 1 ? 'var(--primary-text-accent)' : '#bfbcc4'}}>Step 02</p>
              <h1 style={{color: step === 1 ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === 1 ? '1.8em' : '1.2em'}}>Delivery</h1>
            </span>
          </div>
          <hr style={{height:(step === 0 || step === 2) && '70px'}}/>
          <div 
            className="a_c_s_bubble a_c_s_bubble_outline" 
            style={{backgroundColor: step === 2 ? 'var(--primary-text-accent)' : 'transparent'}}
          >
            <span onClick={() => !isProcessing && setStep(2)}>
              <p style={{color: step === 2 ? 'var(--primary-text-accent)' : '#bfbcc4'}}>Step 03</p>
              <h1 style={{color: step === 2 ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === 2 ? '1.8em' : '1.2em'}}>Payment</h1>
            </span>
          </div>
        </div>
        <div className="a_c_display">
          <div className="a_c_d_body" style={{marginTop: step === 0 ? 64 : step === 1 ? 150 : 230}}>
            <CSSTransition delay={500} in={step === 0} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
              <form className="a_c_d_b_details">
                <span className="a_c_d_b_details_double">
                  <CssTextField label="First Name" id="custom-css-outlined-input" value={billing_details.first_name} onChange={handleChange} name="first_name" />
                  <CssTextField label="Last Name" id="custom-css-outlined-input" value={billing_details.last_name} onChange={handleChange} name="last_name" />
                </span>
                  <CssTextField label="Email Address" id="custom-css-outlined-input" value={billing_details.email_address} onChange={handleChange} name="email_address" />
                  <CssTextField label="Address Line 1" id="custom-css-outlined-input" value={billing_details.address_line_1} onChange={handleChange} name="address_line_1" />
                  <FormControl sx={{mb: 3, borderColor: 'orange'}}>
                    <InputLabel style={{color: "#bdbdbd"}} id="demo-simple-select-helper-label">Country</InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={billing_details.country.value}
                      label="Country"
                      style={{color: 'var(--primary-text-color)'}}
                      className="a_c_d_b_d_select"
                    >
                      <MenuItem value={10}>United States</MenuItem>
                    </Select>
                  </FormControl>
                <span className="a_c_d_b_details_triple">
                <FormControl sx={{mb: 3, borderColor: 'orange'}}>
                    <InputLabel style={{color: "#bdbdbd"}} id="demo-simple-select-helper-label">State</InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={billing_details.state.value}
                      label="State"
                      style={{color: 'var(--primary-text-color)'}}
                      className="a_c_d_b_d_select"
                    >
                      <MenuItem value={10}>Florida</MenuItem>
                    </Select>
                  </FormControl>
                  <CssTextField label="City" id="custom-css-outlined-input" value={billing_details.city} onChange={handleChange} name="city" />
                  <CssTextField label="Zip" id="custom-css-outlined-input" value={billing_details.zipcode} onChange={handleChange} name="zipcode" />
                  {message && <p style={{width: '300px'}}>{message.msgBody}</p>}
                </span>
              </form>
            </CSSTransition>
            <CSSTransition delay={500} in={step === 1} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
              <div className="a_c_d_b_delivery">
                <div className="a_c_d_b_d_item" style={{borderColor: delivery_preference.fedex && 'var(--primary-text-accent)', backgroundColor:delivery_preference.fedex && '#f6f3ff' }}  onClick={() => handleCheckboxChange('fedex')}>
                  <div className="a_c_d_b_d_item_body">
                    <Checkbox checked={delivery_preference.fedex} icon={<CheckCircleOutlineIcon />} checkedIcon={<CheckCircleIcon />} />
                    <span style={{marginLeft: '0.5rem', width: '90%'}}>
                      <h3>FedEx International</h3>
                      <p>Shipment will arrive in about 3-5 days shipping</p>
                    </span>
                  </div>
                  <p>$4.99</p>
                </div>
                <div className="a_c_d_b_d_item" style={{borderColor: delivery_preference.usps && 'var(--primary-text-accent)', backgroundColor:delivery_preference.usps && '#f6f3ff' }} onClick={() => handleCheckboxChange('usps')}>
                  <div className="a_c_d_b_d_item_body">
                    <Checkbox checked={delivery_preference.usps} icon={<CheckCircleOutlineIcon />} checkedIcon={<CheckCircleIcon />} />
                    <span style={{marginLeft: '0.5rem', width: '90%'}}>
                      <h3>USPS</h3>
                      <p>Shipment will arrive in about 1-2 days shipping</p>
                    </span>
                  </div>
                  <p>$11.50</p>
                </div>
                <div className="a_c_d_b_d_item" style={{borderColor: delivery_preference.pickup && 'var(--primary-text-accent)', backgroundColor:delivery_preference.pickup && '#f6f3ff' }} onClick={() => handleCheckboxChange('pickup')}>
                  <div className="a_c_d_b_d_item_body">
                    <Checkbox checked={delivery_preference.pickup} icon={<CheckCircleOutlineIcon />} checkedIcon={<CheckCircleIcon />} />
                    <span style={{marginLeft: '0.5rem', width: '90%'}}>
                      <h3>Pickup</h3>
                      <p>Pickup your order at our main location. Orders usually process after 24 hours.</p>
                    </span>
                  </div>
                  <p>FREE</p>
                </div>
                {message && <p>{message.msgBody}</p>}
              </div>
            </CSSTransition>
            <CSSTransition delay={500} in={step === 2} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
              <Elements stripe={stripePromise}>
                  <Checkout ref={childCompRef}/>
              </Elements>
            </CSSTransition>
          </div>
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
              <VisualizeButton
                className='a_c_d_summary_item_button'
                onClick={handleStepUpdate}
                loading={isProcessing}
                variant="contained"
                startIcon={step === 2 && <AttachMoneyIcon/>}
            >
              {step === 2 ? 'Pay' : 'Next'}
            </VisualizeButton>
              <div className="a_c_d_summary_item_promo">Have a promo code?</div>
            </div>
          </div>
        </div>
      </section>
      <div className='a_s_b_credits'>
        <p>Made with 💜 by <a target="_blank" rel="noreferrer" href="https://github.com/binolt">steven</a></p>
      </div>
    </div>
  )
}

