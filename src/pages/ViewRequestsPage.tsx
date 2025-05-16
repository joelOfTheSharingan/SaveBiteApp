import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase.ts';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

type FoodReport = {
  id: string;
  title: string;
  quantity: string;
  location: string;
  contact: string;
  claimed?: boolean;
  claimedBy?: string;
};

const ViewRequestsPage = () => {
  const [unclaimed, setUnclaimed] = useState<FoodReport[]>([]);
  const [claimedByMe, setClaimedByMe] = useState<FoodReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'foodReports'));
        const allItems = querySnapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as FoodReport)
        );

        const userEmail = auth.currentUser?.email;
        const unclaimedItems = allItems.filter(item => !item.claimed);
        const myClaims = allItems.filter(item => item.claimedBy === userEmail);

        setUnclaimed(unclaimedItems);
        setClaimedByMe(myClaims);
      } catch (error) {
        console.error('Error fetching food reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleClaim = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'foodReports', id);
      await updateDoc(docRef, {
        claimed: true,
        claimedBy: user.email
      });

      const claimedItem = unclaimed.find(r => r.id === id);
      if (claimedItem) {
        setClaimedByMe(prev => [...prev, { ...claimedItem, claimed: true, claimedBy: user.email }]);
        setUnclaimed(prev => prev.filter(r => r.id !== id));
      }

      alert('Success, food claimed!');
    } catch (error) {
      console.error('Error claiming food report:', error);
      alert('Failed to claim. Please try again.');
    }
  };

  const handleUnclaim = async (id: string) => {
    try {
      const docRef = doc(db, 'foodReports', id);
      await updateDoc(docRef, {
        claimed: false,
        claimedBy: ''
      });

      const unclaimedItem = claimedByMe.find(r => r.id === id);
      if (unclaimedItem) {
        setUnclaimed(prev => [...prev, { ...unclaimedItem, claimed: false, claimedBy: '' }]);
        setClaimedByMe(prev => prev.filter(r => r.id !== id));
      }

      alert('Claim cancelled successfully.');
    } catch (error) {
      console.error('Error unclaiming food report:', error);
      alert('Failed to unclaim. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Available Food Reports</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading food reports...</p>
      ) : (
        <>
          {/* 🔓 Unclaimed Reports */}
          {unclaimed.length === 0 ? (
            <p className="text-center text-gray-600 mb-10">No available food reports right now.</p>
          ) : (
            <div className="grid gap-4 max-w-2xl mx-auto mb-10">
              {unclaimed.map((request) => (
                <div key={request.id} className="border rounded p-4 shadow">
                  <h2 className="text-xl font-semibold text-gray-800">{request.title}</h2>
                  <p className="text-gray-600">Quantity: {request.quantity}</p>
                  <p className="text-gray-600">Location: {request.location}</p>
                  <p className="text-gray-600">Contact: {request.contact}</p>
                  <button
                    onClick={() => handleClaim(request.id)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Claim
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ✅ My Claimed Reports */}
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">My Claimed Reports</h2>
          {claimedByMe.length === 0 ? (
            <p className="text-center text-gray-500">You haven’t claimed any food yet.</p>
          ) : (
            <div className="grid gap-4 max-w-2xl mx-auto">
              {claimedByMe.map((request) => (
                <div key={request.id} className="border border-green-600 rounded p-4 shadow bg-green-50">
                  <h2 className="text-lg font-semibold text-green-800">{request.title}</h2>
                  <p className="text-green-700">Quantity: {request.quantity}</p>
                  <p className="text-green-700">Location: {request.location}</p>
                  <p className="text-green-700">Contact: {request.contact}</p>
                  <p className="text-sm text-green-600 mt-2 italic">Claimed by you</p>

                  <button
                    onClick={() => handleUnclaim(request.id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Cancel Claim
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewRequestsPage;
