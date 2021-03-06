import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

const CheckoutForm = ({data}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [clientSecret, setClientSecret] = useState('');

  const {_id, price, email, displayName} = data;

  useEffect (() => {
        fetch ('https://aqueous-inlet-29591.herokuapp.com/create-payment-intent', {
            method: 'POST',
            headers: {
                'content-type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({price})
        })
        .then (res => res.json())
        .then (data => {
            if (data?.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        });

  } ,[price])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      setSuccess('');
      setProcessing(true);
    } else {
      setCardError("");
    }

    const {paymentIntent, error: intentError} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: displayName,
              email: email
            },
          },
        },
      );

      if (intentError) {
          setCardError(intentError?.message);
          setProcessing(false);
      }
      else{
          setCardError('');
          setTransactionId (paymentIntent.id);
          console.log(paymentIntent);
          setSuccess('Your Payment Is Completed!')

          const payment = {
                order: _id,
                transactionId: paymentIntent.id
          }

          fetch (`https://aqueous-inlet-29591.herokuapp.com/myorder/${_id}`, {
            method: 'PATCH',
            headers: {
                'content-type':'application/json',
                'authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(payment)
          }).then(res=>res.json())
          .then (data => {
              setProcessing(false);
              console.log(data);
          })
      }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button className="pay-button" type="submit" disabled={!stripe || !clientSecret}>
          Pay
        </button>
      </form>
      {
          cardError && <p className="text-danger">{cardError}</p> 
      }
      {
          success && <div className="text-primary">
              <p>{success}</p>
              <p>Your Transaction Id: <span>{transactionId}</span></p>
          </div> 
      }
    </>
  );
};

export default CheckoutForm;
