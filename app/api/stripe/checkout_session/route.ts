import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        // Mock flow if no API key is present
        if (!stripeKey) {
            console.warn("Stripe API key missing, using mock success flow.");
            return NextResponse.json({ url: `${req.nextUrl.origin}/editor?success=true` });
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: "2025-12-15.clover" as any,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "LoneStar Resume PDF Download",
                            description: "High-quality, ATS-optimized PDF export.",
                            images: ["https://ui.shadcn.com/placeholder.svg"],
                        },
                        unit_amount: 900, // $9.00
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.nextUrl.origin}/editor?success=true`,
            cancel_url: `${req.nextUrl.origin}/editor?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
