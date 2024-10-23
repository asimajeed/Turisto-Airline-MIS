import { useState } from 'react';
import './PurchasePage.css';

const PurchasePage = () => {
  const [passengerName, setPassengerName] = useState('');
  const [seatSelection, setSeatSelection] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  const handlePurchase = (e:any) => {
    e.preventDefault();
    console.log(`Processing payment for ${passengerName} with seat ${seatSelection}`);
  };

  return (
    <div className="purchase-container">
      <h1>Purchase Tickets</h1>
      <form onSubmit={handlePurchase}>
        <label>Passenger Name: </label>
        <input 
          type="text" 
          value={passengerName} 
          onChange={(e:any) => setPassengerName(e.target.value)} 
          required 
        />
        <label>Seat Selection: </label>
        <input 
          type="text" 
          value={seatSelection} 
          onChange={(e:any) => setSeatSelection(e.target.value)} 
          required 
        />
        <label>Payment Details: </label>
        <input 
          type="text" 
          value={paymentDetails} 
          onChange={(e:any) => setPaymentDetails(e.target.value)} 
          placeholder="Card Number"
          required 
        />
        <button type="submit">Complete Purchase</button>
      </form>
    </div>
  );
};

export default PurchasePage;
