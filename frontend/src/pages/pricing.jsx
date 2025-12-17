
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { useRazorpay } from "react-razorpay";
import axios from "axios";

const PopularPlanType = {
    No: 0,
    Yes: 1,
};

const pricingList = [
    {
        title: "Free",
        popular: PopularPlanType.No,
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: "The free plan is perfect for getting started with our service.",
        buttonText: "Get Started",
        benefits: ["20 pages per month", "30 minutes of reading per month", "10 pdf summarization per month", "Ad supported"],
        href: "/sign-up",
    },
    {
        title: "Pro",
        popular: PopularPlanType.Yes,
        monthlyPrice: 15,
        yearlyPrice: 144, // $12/mo billed yearly
        description: "The Pro plan is perfect for learners and professionals.",
        buttonText: "Get Started",
        benefits: ["1000 pages per month", "No ads", "100 pdf summarization per month"],
        href: "/sign-up",
    },
    {
        title: "Enterprise",
        popular: PopularPlanType.No,
        monthlyPrice: 40,
        yearlyPrice: 384, // $32/mo billed yearly
        description: "The Enterprise plan is perfect for large organizations.",
        buttonText: "Get Started",
        benefits: ["10000 pages per month", "No ads", "1000 pdf summarization per month"],
        href: "/sign-up",
    },
];

export const Pricing = () => {
    const { isSignedIn, user } = useUser();
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState("monthly");
    const { error, isLoading, Razorpay } = useRazorpay();

    const handleCheckout = async (plan, price) => {
        if (!isSignedIn) {
            navigate("/sign-up");
            return;
        }

        // Define Plan IDs (Replace with Real Razorpay Plan IDs)
        // Format: { PlanName: { monthly: "plan_id", yearly: "plan_id" } }
        const PLAN_IDS = {
            "Pro": { monthly: "plan_TEST_MONTHLY_PRO", yearly: "plan_TEST_YEARLY_PRO" },
            "Enterprise": { monthly: "plan_TEST_MONTHLY_ENT", yearly: "plan_TEST_YEARLY_ENT" }
        };

        const selectedPlanId = PLAN_IDS[plan]?.[billingCycle];

        if (!selectedPlanId) {
            toast.error("Plan not configured yet.");
            return;
        }

        const toastId = toast.loading("Initializing Subscription...");

        try {
            // 1. Create Subscription on Backend
            const response = await axios.post("http://localhost:8000/subscription/create", {
                plan_id: selectedPlanId
            });

            if (!response.data.success) {
                throw new Error(response.data.error || "Failed to create subscription");
            }

            const { subscription_id, key_id } = response.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: key_id,
                amount: price * 100, // Amount in paise (optional for subscription but good for display)
                currency: "USD", // Change to INR if using Indian Razorpay account
                name: "AI PDF Reader",
                description: `${plan} Plan (${billingCycle})`,
                subscription_id: subscription_id,
                handler: async (response) => {
                    // 3. Verify Payment on Backend
                    toast.loading("Verifying payment...", { id: toastId });

                    try {
                        const verifyResponse = await axios.post("http://localhost:8000/subscription/verify", {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_name: plan,
                            user_id: user.id
                        });

                        if (verifyResponse.data.success) {
                            toast.success(`Subscribed to ${plan} Successfully!`, { id: toastId });
                            navigate("/dashboard");
                        } else {
                            throw new Error("Signature verification failed");
                        }
                    } catch (verifyError) {
                        console.error(verifyError);
                        toast.error("Payment verification failed", { id: toastId });
                    }
                },
                prefill: {
                    name: user.fullName,
                    email: user.primaryEmailAddress?.emailAddress,
                },
                theme: {
                    color: "#667EEA",
                },
            };

            const rzp1 = new Razorpay(options);
            rzp1.on("payment.failed", function (response) {
                toast.error(response.error.description, { id: toastId });
            });

            rzp1.open();
            toast.dismiss(toastId);

        } catch (error) {
            console.error(error);
            toast.error("Subscription failed. keys might be missing.", { id: toastId });
        }
    };

    return (
        <section id="pricing" className="container py-24 sm:py-32 relative">
            <Toaster position="top-center" />
            <h2 className="text-3xl md:text-4xl font-bold text-center">
                Get
                <span className="bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text">
                    {" "}
                    Unlimited{" "}
                </span>
                Reading
            </h2>
            <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                Choose the plan that fits your needs
            </h3>

            <div className="flex justify-center mb-10">
                <span className="mr-3 font-medium">Monthly</span>
                <button
                    type="button"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 cursor-pointer transition-colors focus:outline-none"
                    onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                    aria-label="Toggle billing cycle"
                >
                    <span
                        className={`${billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
                <span className="ml-3 font-medium">Yearly <span className="text-sm text-green-400 font-normal">(Save ~20%)</span></span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pricingList.map((pricing) => {
                    const price = billingCycle === "monthly" ? pricing.monthlyPrice : pricing.yearlyPrice;
                    const billingText = billingCycle === "monthly" ? "/month" : "/year";

                    return (
                        <Card
                            key={pricing.title}
                            className={
                                pricing.popular === PopularPlanType.Yes
                                    ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                                    : ""
                            }
                        >
                            <CardHeader>
                                <CardTitle className="flex item-center justify-between">
                                    {pricing.title}
                                    {pricing.popular === PopularPlanType.Yes ? (
                                        <Badge variant="secondary" className="text-sm text-primary">
                                            Most Popular
                                        </Badge>
                                    ) : null}
                                </CardTitle>
                                <div>
                                    <span className="text-3xl font-bold">${price}</span>
                                    <span className="text-muted-foreground">{billingText}</span>
                                </div>
                                <CardDescription>{pricing.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isSignedIn ? (
                                    <Button
                                        className={`w-full ${buttonVariants()}`}
                                        onClick={() => handleCheckout(pricing.title, price)}
                                    >
                                        {price === 0 ? "Current Plan" : "Subscribe"}
                                    </Button>
                                ) : (
                                    <Link to={pricing.href} className={`w-full ${buttonVariants()}`}>
                                        {pricing.buttonText}
                                    </Link>
                                )}
                            </CardContent>
                            <hr className="w-4/5 m-auto mb-4" />
                            <CardFooter className="flex">
                                <div className="space-y-4">
                                    {pricing.benefits.map((benefit) => (
                                        <span key={benefit} className="flex items-center">
                                            <Check className="text-primary mr-2" />
                                            <h3>{benefit}</h3>
                                        </span>
                                    ))}
                                </div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </section>
    );
};
