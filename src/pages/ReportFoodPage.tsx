import React, { useState } from 'react';
import { db, auth } from '../firebase.ts';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ReportFoodPage = () => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customQuantity, setCustomQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate contact number
    if (contact.length !== 10) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }

    // Validate quantity
    let finalQuantity = quantity;
    if (quantity === 'More than 20') {
      const qtyNumber = parseInt(customQuantity);
      if (isNaN(qtyNumber) || qtyNumber < 20 || qtyNumber > 500) {
        alert('Please enter a valid quantity between 20 and 500 meals.');
        return;
      }
      finalQuantity = `${qtyNumber} meals`;
    }

    try {
      await addDoc(collection(db, 'foodReports'), {
        title,
        quantity: finalQuantity,
        location,
        contact,
        claimed: false,
        claimedBy: '',
        submittedBy: auth.currentUser?.email || 'unknown',
        createdAt: Timestamp.now()
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Report Leftover Food</h1>

      {submitted ? (
        <p className="text-green-600 text-lg">Thank you! Your food report has been submitted.</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          
          {/* Food Type Dropdown */}
          <select
            className="w-full border px-4 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          >
            <option value="">Select Food Type</option>
            <option value="Lunch Packs">Lunch Packs</option>
            <option value="Dinner Packs">Dinner Packs</option>
            <option value="Vegetarian Meals">Vegetarian Meals</option>
            <option value="Non-Veg Meals">Non-Veg Meals</option>
            <option value="Snacks / Bakery">Snacks / Bakery</option>
            <option value="Mixed Food">Mixed Food</option>
          </select>

          {/* Quantity Dropdown */}
          <select
            className="w-full border px-4 py-2 rounded"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          >
            <option value="">Select Quantity</option>
            <option value="20-50 meals">20-50 meals</option>
            <option value="50-100 meals">50-100 meals</option>
            <option value="100-150 meals">100-150 meals</option>
            <option value="150-200 meals">150-200 meals</option>
            <option value="More than 200 meals">More than 200 meals</option>
          </select>

          {/* Custom Quantity Input (shown only if 'Other' is selected) */}
          {quantity === 'More than 200 meals' && (
            <input
              type="number"
              min={200}
              max={500}
              className="w-full border px-4 py-2 rounded"
              placeholder="Enter exact number of meals"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              required
            />
          )}

          {/* Location Dropdown */}
          <select
            className="w-full border px-4 py-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select Pickup Location</option>
            <option value="Kakkanad">Kakkanad</option>
            <option value="MG Road">MG Road</option>
            <option value="Vyttila">Vyttila</option>
            <option value="Panampilly Nagar">Panampilly Nagar</option>
            <option value="Edappally">Edappally</option>
            <option value="Other">Other</option>
          </select>

          {/* Contact Number */}
          <input
            type="tel"
            placeholder="Contact Number"
            className="w-full border px-4 py-2 rounded"
            value={contact}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d{0,10}$/.test(input)) {
                setContact(input);
              }
            }}
            maxLength={10}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Submit Report
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportFoodPage;
