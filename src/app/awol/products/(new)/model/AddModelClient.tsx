"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchProducts, addProductModel, Product } from "@/src/redux/slice/awol/productSlice";
import { useRouter } from "next/navigation";

export default function AddModelClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { token } = useSelector((state: RootState) => state.user);
  const { products } = useSelector((state: RootState) => state.product);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [modelName, setModelName] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [installmentPrice, setInstallmentPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [installmentAllowed, setInstallmentAllowed] = useState(true);
  const [months, setMonths] = useState("");
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // close outside
  useEffect(() => {
    function handleClick(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // load products
  useEffect(() => {
    if (token) {
      dispatch(fetchProducts({ token, page: 1 }));
    }
  }, [token]);

  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedProduct) {
      setError("Select a product");
      return;
    }

    try {
      await dispatch(
        addProductModel({
          token,
          data: {
            product: selectedProduct.id,
            model_name: modelName,
            cash_price: cashPrice,
            installment_price: installmentPrice,
            down_payment: downPayment,
            installment_months: Number(months),
            installment_allowed: installmentAllowed,
          },
        })
      ).unwrap();

      router.push(`/awol/products/single/${selectedProduct.id}`);
    } catch (err) {
      setError("Failed to create model");
    }
  }

  return (
    <form onSubmit={submit} className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Add Product Model</h1>

      {error && <div className="text-red-500">{error}</div>}

      {/* PRODUCT SELECTOR */}
      <div className="relative" ref={dropdownRef}>
        <label className="block mb-1 font-medium">Product</label>

        <input
          className="border w-full px-3 py-2"
          placeholder="Search product..."
          value={selectedProduct ? selectedProduct.name : search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSelectedProduct(null);
            setSearch(e.target.value);
          }}
        />

        {open && (
          <div className="absolute z-50 w-full bg-white border max-h-60 overflow-y-auto shadow-lg">
            {filteredProducts.map((p: any) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-blue-50"
              >
                {p.name}
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="p-2 text-gray-400 text-center">
                No products found
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODEL NAME */}
      <input
        className="border w-full px-3 py-2"
        placeholder="Model Name (e.g 128GB, 6GB RAM)"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        required
      />

      {/* CASH PRICE */}
      <input
        className="border w-full px-3 py-2"
        placeholder="Cash Price"
        type="number"
        value={cashPrice}
        onChange={(e) => setCashPrice(e.target.value)}
        required
      />

      {/* INSTALLMENT PRICE */}
      <input
        className="border w-full px-3 py-2"
        placeholder="Installment Price"
        type="number"
        value={installmentPrice}
        onChange={(e) => setInstallmentPrice(e.target.value)}
        required
      />

      {/* DOWN PAYMENT */}
      <input
        className="border w-full px-3 py-2"
        placeholder="Down Payment"
        type="number"
        value={downPayment}
        onChange={(e) => setDownPayment(e.target.value)}
        required
      />

      {/* MONTHS */}
      <input
        className="border w-full px-3 py-2"
        placeholder="Installment Months"
        type="number"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        required
      />

      {/* INSTALLMENT ALLOWED */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="installmentAllowed"
          checked={installmentAllowed}
          onChange={(e) => setInstallmentAllowed(e.target.checked)}
        />
        <label htmlFor="installmentAllowed" className="ml-2">
          Installment Allowed
        </label>
      </div>

      <button className="bg-black text-white px-4 py-2">
        Save Model
      </button>
    </form>
  );
}
