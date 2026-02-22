// 'use client';
// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { addPayment } from '@/src/redux/slice/awol/paymentSlice';
// import { RootState } from '@/src/redux/store';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// export default function NewPayment() {
//   const router = useRouter();
//   const [sale, setSale] = useState('');
//   const [amount, setAmount] = useState('');

//   const dispatch = useAppDispatch();
//   const user = useSelector((state: RootState) => state.user);
          
//   useEffect(() => {
//       if (!user?.token) return;  
//   }, [user, dispatch]);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
    
//     if (user?.token) {
//           dispatch(addPayment({ token: user.token, data: { sale: Number(sale), amount_paid: amount }}));
//     }
//     router.push('/customers');
//   }

//   return (
//     <form onSubmit={submit} className="p-6 space-y-3 max-w-xl">
//       <h1 className="text-xl font-semibold">Record Payment</h1>
//       <input className="border w-full px-3 py-2" placeholder="Contract ID" value={sale} onChange={e=>setSale(e.target.value)} />
//       <input className="border w-full px-3 py-2" placeholder="Amount Paid" value={amount} onChange={e=>setAmount(e.target.value)} />
//       <button className="border px-4 py-2">Save</button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { addPayment } from "@/src/redux/slice/awol/paymentSlice";

export default function NewPayment() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [sale, setSale] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!user?.token) {
      setError("You are not logged in");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await dispatch(
        addPayment({
          token: user.token,
          data: {
            sale: Number(sale),
            amount_paid: Number(amount),
          },
        })
      ).unwrap();   // 🔥 VERY IMPORTANT

      router.push("/awol/customers");

    } catch (err: any) {
      setError(err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-3 max-w-xl">
      <h1 className="text-xl font-semibold">Record Payment</h1>

      {error && <div className="text-red-500">{error}</div>}

      <input
        className="border w-full px-3 py-2"
        placeholder="Contract ID"
        value={sale}
        onChange={(e) => setSale(e.target.value)}
        required
      />

      <input
        className="border w-full px-3 py-2"
        placeholder="Amount Paid"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <button disabled={loading} className="border px-4 py-2">
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
