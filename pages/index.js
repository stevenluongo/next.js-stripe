import { useState } from "react"
import Particles from "react-tsparticles";
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ContactlessIcon from '@mui/icons-material/Contactless';
import { Fade } from 'react-reveal';
import { CSSTransition } from 'react-transition-group';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#535353',
  },

  
  '& .MuiFormLabel-root': {
    fontSize: '14px',
    color: "#bdbdbd"
  },
  '& .MuiInputLabel-shrink': {
    color: '#bdbdbd',
    fontSize: '16px'
  },

  '& .MuiInputBase-input': {
    color: '#bdbdbd',
    fontSize: '14px',
    padding: '1rem'
  },
  '& .MuiOutlinedInput-root': {
    marginBottom: '1.25rem',
    '& fieldset': {
      border: '2px solid #424242',
    },
    '&:hover fieldset': {
      borderColor: '#2b2b2b',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#df304b',
    },
  },
});

export const options = {
  fpsLimit: 60,
  particles: {
    color: {
      value: "#ffffff",
    },
    move: {
      direction: "none",
      enable: true,
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      value: 25,
    },
    opacity: {
      value: 0.25,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 2,
    },
  },
}

const default_billing_details = {
  first_name: "john",
  last_name: "doe",
  email_address: "johndoe@gmail.com",
  address_line_1: "1234 example road",
  country: "United States",
  state: "Florida",
  city: "Boca Raton",
  zipcode: ""
}


export default function Index () {
  const [step, setStep] = useState(0);
  const [billing_details, setBillingDetails] = useState(default_billing_details);
  const [delivery_preference, setDeliveryPreference] = useState({pickup: false, shipping: false});
  const [message, setMessage] = useState(null);
  const [shipping_address_preference, setShippingAddressPreference] = useState(true);

  const handleInformationSubmit = async(e) => {
    setMessage(null);
    e.preventDefault();
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
}

  const handleChange = (e) => {
    const mutated_state = {
        ...billing_details,
        [e.target.name]: e.target.value,
    }
    setBillingDetails(mutated_state);
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
            <span onClick={() => setStep(0)}>
              <p style={{color: step === 0 ? 'var(--primary-text-accent)' : '#bfbcc4'}}>Step 01</p>
              <h1 style={{color: step === 0 ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === 0 ? '1.8em' : '1.2em'}}>Personal Details</h1>
            </span>
          </div>
          <hr style={{height: (step === 1 || step === 2) && '70px'}}/>
          <div 
            className="a_c_s_bubble a_c_s_bubble_outline" 
            style={{backgroundColor: step === 1 ? 'var(--primary-text-accent)' : 'transparent'}}
          >
            <span onClick={() => setStep(1)}>
              <p style={{color: step === 1 ? 'var(--primary-text-accent)' : '#bfbcc4'}}>Step 02</p>
              <h1 style={{color: step === 1 ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === 1 ? '1.8em' : '1.2em'}}>Shipping</h1>
            </span>
          </div>
          <hr style={{height:(step === 0 || step === 2) && '70px'}}/>
          <div 
            className="a_c_s_bubble a_c_s_bubble_outline" 
            style={{backgroundColor: step === 2 ? 'var(--primary-text-accent)' : 'transparent'}}
          >
            <span onClick={() => setStep(2)}>
              <p style={{color: step === 2 ? 'var(--primary-text-accent)' : '#bfbcc4'}}>Step 03</p>
              <h1 style={{color: step === 2 ? 'var(--primary-text-color)' : '#bfbcc4', fontSize: step === 2 ? '1.8em' : '1.2em'}}>Payment</h1>
            </span>
          </div>
        </div>
        <div className="a_c_display">
          <div className="a_c_d_body" style={{marginTop: step === 0 ? 64 : step === 1 ? 150 : 230}}>
            <CSSTransition delay={500} in={step === 0} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
              <p>Details</p>
            </CSSTransition>
            <CSSTransition delay={500} in={step === 1} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
              <p>Shipping</p>
            </CSSTransition>
            <CSSTransition delay={500} in={step === 2} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
              <p>Payment</p>
            </CSSTransition>
          </div>
          <div className="a_c_d_summary" >
            <p>summary</p>
            <button onClick={() => setStep(step - 1)}>Previous</button>
            <button onClick={() => setStep(step + 1)}>Next</button>
          </div>
        </div>
      </section>
    </div>
  )
}

{/* <CssTextField label="First Name" id="custom-css-outlined-input" value={billing_details.first_name} onChange={handleChange} name="first_name" /> */}
