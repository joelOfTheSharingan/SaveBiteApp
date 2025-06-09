import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EventManager'); // ✅ New state
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save the role to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Create a Save Bite Account
        </h1>

        <form onSubmit={handleSignUp} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ✅ Role Dropdown */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="EventManager">Event Manager</option>
            <option value="NGO">NGO</option>
          </select>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/SaveBiteApp/login" className="text-green-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
