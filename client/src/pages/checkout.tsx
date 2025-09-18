import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your withdrawal has been processed successfully!",
        });
        setLocation("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center" data-testid="text-checkout-title">
          Complete Your Withdrawal
        </CardTitle>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">₹{(amount / 100).toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Amount to be withdrawn</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <PaymentElement data-testid="payment-element" />
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Withdrawal Amount:</span>
              <span>₹{(amount / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing Fee:</span>
              <span>₹0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total:</span>
              <span>₹{(amount / 100).toLocaleString()}</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!stripe || !elements || isLoading}
            data-testid="button-submit-payment"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Withdrawal"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Get payment details from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const withdrawalAmount = urlParams.get('amount');
    
    // Get amount from URL params or localStorage
    const paymentAmount = withdrawalAmount ? parseInt(withdrawalAmount) : 
      parseInt(localStorage.getItem('withdrawalAmount') || '2450');
    
    setAmount(paymentAmount);

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/earnings/pay", { amount: paymentAmount });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Payment setup failed:', error);
        toast({
          title: "Payment Setup Failed",
          description: "Unable to setup payment. Please try again.",
          variant: "destructive",
        });
        setLocation("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [toast, setLocation]);

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
              <p className="text-muted-foreground">Setting up your payment...</p>
              <p className="text-sm text-muted-foreground">Amount: ₹{(amount / 100).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/dashboard")}
            className="flex items-center"
            data-testid="button-back-to-dashboard"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Payment processing is currently unavailable. Please try again later.
          </p>
          <Button onClick={() => setLocation("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/dashboard")}
          className="flex items-center"
          data-testid="button-back-to-dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={amount} />
      </Elements>

      <div className="mt-6 text-center text-sm text-muted-foreground max-w-md">
        <p>Your payment is secured by Stripe. Funds will be transferred to your bank account within 2-3 business days.</p>
      </div>
    </div>
  );
}
