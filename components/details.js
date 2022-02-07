import { useGlobalContext } from "../context/global-context";
import { CssTextField } from "../components/inputs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TransitionContainer from "../utils/transition-container";

export default function PersonalDetails() {
    const {step, billing_details, setBillingDetails, message} = useGlobalContext();
    const handleChange = (e) => {
        const mutated_state = {
            ...billing_details,
            [e.target.name]: e.target.value,
        }
        setBillingDetails(mutated_state);
      }
    return (
        <TransitionContainer delay={500} in={step === 0} classNames="a_c_d_b_transition_2" timeout={1000} unmountOnExit>
            <form className="a_c_d_b_details">
                <span style={{marginBottom: '1rem'}} className="a_c_d_b_details_double">
                <CssTextField label="First Name" id="custom-css-outlined-input" value={billing_details.first_name} onChange={handleChange} name="first_name" />
                <CssTextField label="Last Name" id="custom-css-outlined-input" value={billing_details.last_name} onChange={handleChange} name="last_name" />
                </span>
                <CssTextField sx={{mb: '1rem'}} label="Email Address" id="custom-css-outlined-input" value={billing_details.email_address} onChange={handleChange} name="email_address" />
                <CssTextField sx={{mb: '1rem'}} label="Address Line 1" id="custom-css-outlined-input" value={billing_details.address_line_1} onChange={handleChange} name="address_line_1" />
                <FormControl sx={{mb: '1rem', borderColor: 'orange'}}>
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
                <FormControl sx={{borderColor: 'orange'}}>
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
        </TransitionContainer>
    );
}