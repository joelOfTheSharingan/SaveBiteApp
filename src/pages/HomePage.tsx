import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Utensils, Users, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

import heroBg from '../assets/hero-bg.jpg';
import logo from '../assets/logo.png';

const HomePage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        {userEmail ? (
          <Link to="/dashboard" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            Log Out
          </Link>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              Log In
            </Link>
            <Link to="/signup" className="bg-white border border-green-500 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100">
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative flex items-center justify-center h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-800 opacity-70"></div>

        <div className="relative z-10 text-center text-white p-6 max-w-xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold mb-4"
          >
            🍽️ Save Bite
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-6"
          >
            Connecting Event Managers and NGOs to save leftover food and feed those in need.
          </motion.p>
          {userEmail ? (
            <Link to="/dashboard" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg shadow-lg">
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg">
                Log In
              </Link>
              <Link to="/signup" className="bg-white text-green-700 border border-green-500 px-6 py-3 rounded-lg hover:bg-green-100">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-4xl font-semibold mb-12 text-green-700">How SaveBite Works</h2>
        <div className="grid md:grid-cols-3 gap-8 px-6">
          <motion.div className="p-6 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition">
            <Utensils className="w-10 h-10 text-green-600 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">For Event Managers</h3>
            <p className="text-lg text-gray-700 mb-4">Report leftover food to reduce waste and help others.</p>
            <Link to="/report-food" className="text-green-600 hover:underline font-semibold">Report Food</Link>
          </motion.div>

          <motion.div className="p-6 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition">
            <Users className="w-10 h-10 text-green-600 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">For NGOs</h3>
            <p className="text-lg text-gray-700 mb-4">Claim reported food and distribute to those in need.</p>
            <Link to="/view-requests" className="text-green-600 hover:underline font-semibold">View Requests</Link>
          </motion.div>

          <motion.div className="p-6 bg-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition">
            <Leaf className="w-10 h-10 text-green-600 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700 mb-2">Save the Planet</h3>
            <p className="text-lg text-gray-700">Reduce food waste and support sustainability.</p>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="bg-gray-100 py-10 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">About SaveBite</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          SaveBite is a platform dedicated to reducing food waste by connecting event managers with NGOs and charities. 
          Our mission is to ensure that surplus food is redirected to those in need, promoting sustainability and 
          reducing food insecurity in our communities.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2025 SaveBite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
