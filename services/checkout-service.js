import { base_url } from "../utils/url";

const CheckoutService = {
    createCustomer: async(data) => {
      const res = await fetch(`${base_url}/api/customer`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      })
      return await res.json();
    },
    retrieveCustomer: async(id) => {
      const res = await fetch(`${base_url}/api/retrieve-customer`, {
        method: "GET",
        body: JSON.stringify(id),
      })
      return await res.json();
    },
    createInvoice: async(payload) => {
      const res = await fetch(`${base_url}/api/invoice`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      })
      return await res.json();
    },
    createInvoiceItem: async(payload) => {
      const res = await fetch(`${base_url}/api/create-invoice-item`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      })
      return await res.json();
    },
    fetchInvoice: async(id) => {
      const url = new URL(`${base_url}/api/invoice`);
      const params = { id };
      url.search = new URLSearchParams(params).toString();
      const res = await fetch(url);
      return await res.json();
    },
    updateInvoice: async(id) => {
      const res = await fetch(`${base_url}/api/update-invoice`, {
        method: "PUT",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(id),
      })
      return await res.json();
    },
    updateCustomer: async(id, payload) => {
      const res = await fetch(`${base_url}/api/update-customer`, {
        method: "PUT",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify({id, payload}),
      })
      return await res.json();
    },
    finalizeInvoice: async(id) => {
      const res = await fetch(`${base_url}/api/finalize-invoice`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(id),
      })
      return await res.json();
    },
    retrievePaymentIntent: async(id) => {
      const url = new URL(`${base_url}/api/payment-intent`);
      const params = { id };
      url.search = new URLSearchParams(params).toString();
      const res = await fetch(url);
      return await res.json();
    },
};

export default CheckoutService;