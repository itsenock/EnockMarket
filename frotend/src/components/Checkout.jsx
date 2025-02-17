import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
// import { lipaNaMpesaOnline } from '../services/mpesaService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setConfirmationMessage(''); 
  };

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'M-Pesa') {
      setConfirmationMessage(`Confirm payment of Ksh ${totalAmount.toFixed(2)} from your M-Pesa account.`);
    } else {
      alert(`Proceeding with ${paymentMethod} payment.`);
    }
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === 'M-Pesa') {
      try {
        alert('Payment request sent. Please check your phone for a pop-up and enter your M-Pesa PIN.');
      } catch (error) {
        alert('Payment failed. Please try again.');
      }
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="order-summary">
        {cartItems.map((item) => (
          <div className="checkout-item" key={item._id}>
            <img src={`http://localhost:5000/${item.images[0]}`} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Ksh {parseFloat(item.price).toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: Ksh {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
        <div className="total-amount">
          <h3>Total Amount: Ksh {totalAmount.toFixed(2)}</h3>
        </div>
      </div>
      <div className="payment-options">
        <h3>Select Payment Method</h3>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="Bank"
            checked={paymentMethod === 'Bank'}
            onChange={handlePaymentMethodChange}
          />
          Pay with Bank
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="M-Pesa"
            checked={paymentMethod === 'M-Pesa'}
            onChange={handlePaymentMethodChange}
          />
          Pay with M-Pesa
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="PayPal"
            checked={paymentMethod === 'PayPal'}
            onChange={handlePaymentMethodChange}
          />
          Pay with PayPal
        </label>
      </div>
      {paymentMethod === 'M-Pesa' && (
        <div className="mpesa-payment">
          <label>
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your M-Pesa phone number"
            />
          </label>
        </div>
      )}
      {confirmationMessage && (
        <div className="confirmation-message">
          <p>{confirmationMessage}</p>
          <button onClick={handleConfirmPayment}>Yes</button>
          <button onClick={() => setConfirmationMessage('')}>No</button>
        </div>
      )}
      <button className="checkout-btn" onClick={handleProceedToPayment}>Proceed to Payment</button>
    </div>
  );
};

export default Checkout;
