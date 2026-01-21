import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function PaymentModal() {
    const [clientSecret, setClientSecret] = useState("");
    const [open, setOpen] = useState(false);
    const { userTier } = useResumeStore();

    useEffect(() => {
        if (open && userTier === 'free') {
            fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [open, userTier]);

    const appearance = {
        theme: 'stripe' as const,
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (userTier === 'pro') {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" size="sm" className="gap-2">
                    <Star className="h-4 w-4 fill-current" />
                    Upgrade to Pro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upgrade to Pro</DialogTitle>
                    <DialogDescription>
                        Unlock premium features including advanced AI analysis and more templates.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Check className="h-3 w-3 mr-1" /> AI Resume Analysis</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Check className="h-3 w-3 mr-1" /> Premium Templates</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Check className="h-3 w-3 mr-1" /> Priority Support</Badge>
                        </div>
                    </div>

                    {clientSecret && stripePromise ? (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm onSuccess={() => setOpen(false)} />
                        </Elements>
                    ) : (
                        <div className="flex justify-center py-8 flex-col items-center gap-2">
                            {!stripePromise ? (
                                <p className="text-destructive text-sm text-center">Stripe Configuration Error: Missing Publishable Key</p>
                            ) : (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
