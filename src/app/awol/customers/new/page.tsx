// 'use client';

// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { createContract } from '@/src/redux/slice/awol/contractSlice';
// import { RootState } from '@/src/redux/store';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useSelector } from 'react-redux';

// export default function NewContract() {
// const router = useRouter();
// const dispatch = useAppDispatch();
// const user = useSelector((state: RootState) => state.user);

// const [customer, setCustomer] = useState('');
// const [productModel, setProductModel] = useState('');
// const [totalPrice, setTotalPrice] = useState('');
// const [downPayment, setDownPayment] = useState('');

// async function submit(e: React.FormEvent) {
// e.preventDefault();
// if (!user?.token) return;

 
// await dispatch(createContract({
//   token: user.token,
//   data: {
//     customer: Number(customer),
//     product_model: Number(productModel),
//     total_price: Number(totalPrice),
//     down_payment_paid: Number(downPayment),
//   }
// }));

// router.push(`/awol/customers/${customer}`);
 

// }

// return ( 
// <form onSubmit={submit} className="p-6 space-y-3 max-w-xl"> <h1 className="text-xl font-semibold">Create Contract</h1>

 
//   <input className="border w-full px-3 py-2" placeholder="Customer ID" value={customer} onChange={e=>setCustomer(e.target.value)} />
//   <input className="border w-full px-3 py-2" placeholder="Product Model ID" value={productModel} onChange={e=>setProductModel(e.target.value)} />
//   <input className="border w-full px-3 py-2" placeholder="Total Price" value={totalPrice} onChange={e=>setTotalPrice(e.target.value)} />
//   <input className="border w-full px-3 py-2" placeholder="Down Payment" value={downPayment} onChange={e=>setDownPayment(e.target.value)} />

//   <button className="border px-4 py-2">Save</button>
// </form>
 

// );
// }

"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { addCustomer } from "@/src/redux/slice/awol/customerSlice";
import { fetchProducts, fetchProductDetails } from "@/src/redux/slice/awol/productSlice";
import { createContract } from "@/src/redux/slice/awol/contractSlice";
import { useRouter } from "next/navigation";

export default function NewContract() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const { products, models } = useSelector((state: RootState) => state.product);

  // CUSTOMER
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // PRODUCT
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // PAYMENT
  const [totalPrice, setTotalPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const [isInstallment, setIsInstallment] = useState(false);

  // LOAD PRODUCTS
  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchProducts({ token: user.token }));
  }, [user?.token]);

  // WHEN PRODUCT CHANGES → LOAD MODELS
  useEffect(() => {
    if (!selectedProduct || !user?.token) return;
    dispatch(fetchProductDetails({ token: user.token, id: selectedProduct }));
  }, [selectedProduct]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.token) return;

    try {
      // 1️⃣ CREATE CUSTOMER
      const customerRes = await dispatch(
        addCustomer({
          token: user.token,
          data: {
            full_name: name,
            phone,
            address,
          },
        })
      ).unwrap();

      const customerId = customerRes.id;

      // 2️⃣ CREATE CONTRACT
      await dispatch(
        createContract({
          token: user.token,
          data: {
            customer: customerId,
            product_model: Number(selectedModel),
            total_price: Number(totalPrice),
            down_payment_paid: Number(downPayment),
            is_installment: isInstallment
          },
        })
      ).unwrap();

      // 3️⃣ REDIRECT
      router.push(`/awol/customers/single/${customerId}`);

    } catch (err) {
      console.log(err);
      alert("Failed to create contract");
    }
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">New Contract</h1>

      {/* CUSTOMER */}
      <h2 className="font-semibold">Customer Information</h2>
      <input className="border w-full px-3 py-2" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border w-full px-3 py-2" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input className="border w-full px-3 py-2" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />

      {/* PRODUCT */}
      <h2 className="font-semibold">Product</h2>
      <select className="border w-full px-3 py-2" value={selectedProduct} onChange={e=>setSelectedProduct(e.target.value)}>
        <option value="">Select Product</option>
        {products.map((p:any)=>(
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* MODEL */}
      <select className="border w-full px-3 py-2" value={selectedModel} onChange={e=>setSelectedModel(e.target.value)}>
        <option value="">Select Model</option>
        {models.map((m:any)=>(
          <option key={m.id} value={m.id}>
            {m.model_name} - ₦{m.installment_price}
          </option>
        ))}
      </select>



      {/* PAYMENT */}
      <input className="border w-full px-3 py-2" placeholder="Total Price" value={totalPrice} onChange={e=>setTotalPrice(e.target.value)} />
      <input className="border w-full px-3 py-2" placeholder="Down Payment Paid" value={downPayment} onChange={e=>setDownPayment(e.target.value)} />
      
      {/*INSTALLMENT*/}
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={isInstallment} onChange={e=>setIsInstallment(e.target.checked)} />
        <span>Is Installment?</span>
      </label>
      
      
      <button className="border px-4 py-2">Create Contract</button>
    </form>
  );
}
