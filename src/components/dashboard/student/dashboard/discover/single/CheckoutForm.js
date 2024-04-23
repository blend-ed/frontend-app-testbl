import {
    PaymentElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckoutForm = ({ url, id }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const enroll = async (paymentIntent) => {
        fetch(`${url}/payment/success`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orgUrl: window.location.origin,
                orderId: `order_${paymentIntent.created}`,
                paymentId: paymentIntent.id
            }),
        }).then(async (r) => {
            const { msg, orderId, paymentId } = await r.json();
            console.log(msg);
            navigate(`/programs/single/overview/${id}`);
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/programs`,
            },
            redirect: "if_required",
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
                toast.error(error.message);
            }
        } else if (paymentIntent.status === "succeeded") {
            enroll(paymentIntent);
            setMessage("Payment completed successfully!");
            toast.success("Payment completed successfully!");
        } else {
            setMessage("An unexpected error occurred.");
            toast.error("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit" className={"mt-4 btn btn-primary"}>
                <span id="button-text">
                    {isLoading ? <Spinner animation="border" id="spinner" size="sm" /> : "Pay now"}
                </span>
            </button>
            {message === "Payment completed successfully!" &&
                // Redirect to the course page in 5 seconds message
                <Alert variant="success" className="mt-4">
                    You will be redirected to the program page in 5 seconds.
                </Alert>
            }
        </form>
    );
}

export default CheckoutForm;