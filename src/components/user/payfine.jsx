import React, { useState } from 'react';
import axios from 'axios';

const PayFine = ({ borrowerId }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://127.0.0.1:8000/pay_fine/${borrowerId}/`, {
                name,
                address,
                credit_card_number: creditCardNumber,
            });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setMessage('');
            setError(err.response.data.error || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Pay Fine</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="creditCardNumber">Credit Card Number:</label>
                    <input
                        type="text"
                        id="creditCardNumber"
                        value={creditCardNumber}
                        onChange={(e) => setCreditCardNumber(e.target.value)}
                    />
                </div>
                <button type="submit">Pay Fine</button>
            </form>
        </div>
    );
};

export default PayFine;
