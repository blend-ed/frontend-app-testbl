import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

export default function ProgramDiscoverStripe() {
    const { getIdTokenClaims } = useAuth0();
    const { id } = useParams();
    const [clientSecret, setClientSecret] = useState("");
    const [stripePromise, setStripePromise] = useState(null);

    let url = process.env.REACT_APP_STRIPE_URL;

    useEffect(() => {
        const fetchData = async () => {
            const token = await getIdTokenClaims();
            fetch(`${url}/payment/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: window.location.origin }),
            }).then(async (r) => {
                const { publishableKey } = await r.json();
                setStripePromise(loadStripe(publishableKey));
            });

            // Create PaymentIntent as soon as the page loads
            fetch(`${url}/payment/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accesstoken: token["__raw"],
                },
                body: JSON.stringify({ program_id: id, orgUrl: window.location.origin }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setClientSecret(data.clientSecret);
                });
        };

        fetchData();
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm url={url} id={id} />
                </Elements>
            )}
        </div>
    );
}