// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { fetchProducts, addProductModel, Product } from "@/src/redux/slice/awol/productSlice";
// import { useRouter } from "next/navigation";

// export default function AddModelClient() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { token } = useSelector((state: RootState) => state.user);
//   const { products } = useSelector((state: RootState) => state.product);

//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);

//   const [modelName, setModelName] = useState("");
//   const [cashPrice, setCashPrice] = useState("");
//   const [installmentPrice, setInstallmentPrice] = useState("");
//   const [downPayment, setDownPayment] = useState("");
//   const [installmentAllowed, setInstallmentAllowed] = useState(true);
//   const [months, setMonths] = useState("");
//   const [error, setError] = useState("");

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // close outside
//   useEffect(() => {
//     function handleClick(e: any) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   // load products
//   useEffect(() => {
//     if (token) {
//       dispatch(fetchProducts({ token, page: 1 }));
//     }
//   }, [token]);

//   const filteredProducts = products.filter((p: Product) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!selectedProduct) {
//       setError("Select a product");
//       return;
//     }

//     try {
//       await dispatch(
//         addProductModel({
//           token,
//           data: {
//             product: selectedProduct.id,
//             model_name: modelName,
//             cash_price: cashPrice,
//             installment_price: installmentPrice,
//             down_payment: downPayment,
//             installment_months: Number(months),
//             installment_allowed: installmentAllowed,
//           },
//         })
//       ).unwrap();

//       router.push(`/awol/products/single/${selectedProduct.id}`);
//     } catch (err) {
//       setError("Failed to create model");
//     }
//   }

//   return (
//     <form onSubmit={submit} className="p-6 max-w-xl space-y-4">
//       <h1 className="text-2xl font-semibold">Add Product Model</h1>

//       {error && <div className="text-red-500">{error}</div>}

//       {/* PRODUCT SELECTOR */}
//       <div className="relative" ref={dropdownRef}>
//         <label className="block mb-1 font-medium">Product</label>

//         <input
//           className="border w-full px-3 py-2"
//           placeholder="Search product..."
//           value={selectedProduct ? selectedProduct.name : search}
//           onFocus={() => setOpen(true)}
//           onChange={(e) => {
//             setSelectedProduct(null);
//             setSearch(e.target.value);
//           }}
//         />

//         {open && (
//           <div className="absolute z-50 w-full bg-white border max-h-60 overflow-y-auto shadow-lg">
//             {filteredProducts.map((p: any) => (
//               <div
//                 key={p.id}
//                 onClick={() => {
//                   setSelectedProduct(p);
//                   setOpen(false);
//                 }}
//                 className="p-2 cursor-pointer hover:bg-blue-50"
//               >
//                 {p.name}
//               </div>
//             ))}

//             {filteredProducts.length === 0 && (
//               <div className="p-2 text-gray-400 text-center">
//                 No products found
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* MODEL NAME */}
//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Model Name (e.g 128GB, 6GB RAM)"
//         value={modelName}
//         onChange={(e) => setModelName(e.target.value)}
//         required
//       />

//       {/* CASH PRICE */}
//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Cash Price"
//         type="number"
//         value={cashPrice}
//         onChange={(e) => setCashPrice(e.target.value)}
//         required
//       />

//       {/* INSTALLMENT PRICE */}
//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Installment Price"
//         type="number"
//         value={installmentPrice}
//         onChange={(e) => setInstallmentPrice(e.target.value)}
//         required
//       />

//       {/* DOWN PAYMENT */}
//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Down Payment"
//         type="number"
//         value={downPayment}
//         onChange={(e) => setDownPayment(e.target.value)}
//         required
//       />

//       {/* MONTHS */}
//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Installment Months"
//         type="number"
//         value={months}
//         onChange={(e) => setMonths(e.target.value)}
//         required
//       />

//       {/* INSTALLMENT ALLOWED */}
//       <div className="flex items-center">
//         <input
//           type="checkbox"
//           id="installmentAllowed"
//           checked={installmentAllowed}
//           onChange={(e) => setInstallmentAllowed(e.target.checked)}
//         />
//         <label htmlFor="installmentAllowed" className="ml-2">
//           Installment Allowed
//         </label>
//       </div>

//       <button className="bg-black text-white px-4 py-2">
//         Save Model
//       </button>
//     </form>
//   );
// }
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import {
  fetchProducts,
  addProductModel,
  Product,
} from "@/src/redux/slice/awol/productSlice";
import { useRouter } from "next/navigation";

export default function AddModelClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { token } = useSelector((state: RootState) => state.user);
  const { products } = useSelector((state: RootState) => state.product);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [modelName, setModelName] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [installmentPrice, setInstallmentPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [months, setMonths] = useState("");
  const [installmentAllowed, setInstallmentAllowed] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown outside click
  useEffect(() => {
    function handleClick(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch products
  useEffect(() => {
    if (token) {
      dispatch(fetchProducts({ token, page: 1 }));
    }
  }, [token]);

  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const monthlyPayment = useMemo(() => {
    if (!months || Number(months) <= 0) return 0;
    return (
      (Number(installmentPrice) - Number(downPayment)) / Number(months)
    );
  }, [installmentPrice, downPayment, months]);

  function validateForm() {
    if (!selectedProduct) return "Please select a product";
    if (!modelName.trim()) return "Model name is required";
    if (Number(cashPrice) <= 0) return "Cash price must be greater than 0";
    if (installmentAllowed) {
      if (Number(installmentPrice) <= 0)
        return "Installment price must be greater than 0";
      if (Number(installmentPrice) < Number(cashPrice))
        return "Installment price cannot be less than cash price";
      if (Number(downPayment) < 0)
        return "Down payment cannot be negative";
      if (Number(downPayment) >= Number(installmentPrice))
        return "Down payment must be less than installment price";
      if (Number(months) <= 0)
        return "Installment months must be greater than 0";
    }
    return "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        addProductModel({
          token,
          data: {
            product: selectedProduct?.id,
            model_name: modelName,
            cash_price: Number(cashPrice),
            installment_price: installmentAllowed ? Number(installmentPrice) : Number(cashPrice),
            down_payment: Number(downPayment),
            installment_months: Number(months),
            installment_allowed: installmentAllowed,
          },
        })
      ).unwrap();

      router.push(`/awol/products/single/${selectedProduct?.id}`);
    } catch {
      setError("Failed to create product model");
    } finally {
      setLoading(false);
    }
  }

  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <form
        onSubmit={submit}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Add Product Model
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {/* PRODUCT SELECT */}
        <div className="relative" ref={dropdownRef}>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Product
          </label>
          <p className="text-sm text-gray-500 mb-1">
            Select the base product this model belongs to.
          </p>
          <input
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            placeholder="Search product..."
            value={selectedProduct ? selectedProduct.name : search}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setSelectedProduct(null);
              setSearch(e.target.value);
            }}
          />
          {open && (
            <div className="absolute z-50 w-full bg-white dark:bg-gray-700 border max-h-60 overflow-y-auto shadow-lg">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setOpen(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600"
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODEL NAME */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Model Name
          </label>
          <p className="text-sm text-gray-500 mb-1">
            Example: 128GB Storage, 6GB RAM, Black Edition.
          </p>
          <input
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        {/* CASH PRICE */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Cash Price
          </label>
          <p className="text-sm text-gray-500 mb-1">
            Full payment amount if customer pays outright.
          </p>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            value={cashPrice}
            onChange={(e) => setCashPrice(e.target.value)}
          />
        </div>

        {/* INSTALLMENT SECTION */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={installmentAllowed}
              onChange={(e) => setInstallmentAllowed(e.target.checked)}
            />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Enable Installment Purchase
            </span>
          </div>

          {installmentAllowed && (
            <>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Installment Price
                </label>
                <p className="text-sm text-gray-500 mb-1">
                  Total amount paid through installment.
                </p>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
                  value={installmentPrice}
                  onChange={(e) =>
                    setInstallmentPrice(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Down Payment
                </label>
                <p className="text-sm text-gray-500 mb-1">
                  Initial deposit before installment begins.
                </p>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
                  value={downPayment}
                  onChange={(e) =>
                    setDownPayment(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Installment Duration (Months)
                </label>
                <p className="text-sm text-gray-500 mb-1">
                  Number of months customer will pay.
                </p>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                />
              </div>

              {monthlyPayment > 0 && (
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Estimated Monthly Payment:
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    {currency.format(monthlyPayment)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded font-medium hover:opacity-90 transition"
        >
          {loading ? "Saving..." : "Save Model"}
        </button>
      </form>
    </div>
  );
}