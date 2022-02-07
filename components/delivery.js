import { useGlobalContext } from "../context/global-context";
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TransitionContainer from "../utils/transition-container";

export default function Delivery() {
    const {step, delivery_preference, message, setDeliveryPreference, subtotal, setVatTax, setTotal} = useGlobalContext();

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

    return (
        <TransitionContainer delay={500} in={step === 1} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
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
        </TransitionContainer>
    );
}