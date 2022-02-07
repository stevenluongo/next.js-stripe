import React, { useContext, useState } from "react";
import { default_billing_details } from "../lib/data";

const GlobalContext = React.createContext();

export function useGlobalContext() {
    return useContext(GlobalContext);
}

export function GlobalContextProvider({children}) {
    const [step, setStep] = useState(0);
    const [message, setMessage] = useState(null);
    const [billing_details, setBillingDetails] = useState(default_billing_details);
    const [delivery_preference, setDeliveryPreference] = useState({pickup: false, usps: false, fedex: false});
    const [vatTax, setVatTax] = useState(4.07);
    const [total, setTotal] = useState(67.99 + 4.07)

    const subtotal = 67.99

    const value = {
        step,
        setStep,
        message,
        setMessage,
        billing_details,
        setBillingDetails,
        delivery_preference,
        setDeliveryPreference,
        subtotal,
        vatTax,
        setVatTax,
        total,
        setTotal
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}