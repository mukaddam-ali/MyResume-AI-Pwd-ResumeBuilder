import React, { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
    onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUserTier } = useResumeStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/`,
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message ?? "An unexpected error occurred.");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setMessage("Payment succeeded!");
            setUserTier("pro");
            onSuccess();
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement id="payment-element" />
            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : "Pay $20.00"}
                </span>
            </Button>
            {message && <div id="payment-message" className="text-red-500 text-sm">{message}</div>}
        </form>
    );
}
