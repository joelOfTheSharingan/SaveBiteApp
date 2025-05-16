import React, { useEffect, useState } from 'react';
import { auth } from '../firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/loginPage');
        return;
      }

      setUserEmail(user.email);

      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          console.warn("No user document found in Firestore.");
        }
      } catch (err) {
        console.error('Firestore error:', err);
        alert('There was an error fetching your role. Please try again later.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-500 text-xl">Loading dashboard...</p>;
  }

  if (!userRole) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>Error: Unable to retrieve user role. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-100">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center p-10 bg-white rounded-2xl shadow-2xl max-w-xl w-full">
        <h1 className="text-4xl font-extrabold text-green-700 mb-4">Welcome to Your Dashboard</h1>
        <p className="text-lg text-gray-700 mb-8">Logged in as: <strong>{userEmail}</strong></p>

        {userRole === 'EventManager' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/report-food')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition duration-300"
          >
            Report Leftover Food
          </motion.button>
        ) : userRole === 'NGO' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/view-requests')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg shadow-md transition duration-300"
          >
            Browse Food Requests
          </motion.button>
        ) : (
          <p className="text-red-500">Unknown role. Please contact support.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
