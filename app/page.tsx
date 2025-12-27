"use client";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */
type PurchaseItem = {
  name: string;
  metal: "Gold" | "Silver";
  purityType: "18k" | "22k" | "24k" | "custom";
  purityValue: string;
  weight: number;
  rate: number;
  makingPercent: number;
};

type ExchangeItem = {
  description: string;
  metal: "Gold" | "Silver";
  purity: string;
  weight: number;
  rate: number;
};

export default function JewelleryBill() {
  /* ================= COMPANY ================= */
  const COMPANY = {
    name: "R P Gupta Hall Mark Shop & Bartan Bhandar",
    address: "Nagina Shah Market, Station road Mashrak,Saran,841417",
    phone: "9931864811",
    gstin: "07ABCDE1234F",
  };

  /* ================= SERIAL INVOICE ================= */
  const [invoiceNo, setInvoiceNo] = useState("000001");

  useEffect(() => {
  const current = localStorage.getItem("invoice_no") || "000001";
  setInvoiceNo(current);
}, []);


  const dateTime = new Date().toLocaleString();

  /* ================= CUSTOMER ================= */
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  /* ================= GST ================= */
  const [gstEnabled, setGstEnabled] = useState(true);

  /* ================= NEW PURCHASE ================= */
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      name: "",
      metal: "Gold",
      purityType: "22k",
      purityValue: "22k",
      weight: 0,
      rate: 0,
      makingPercent: 8,
    },
  ]);

  /* ================= OLD EXCHANGE ================= */
  const [exchangeItems, setExchangeItems] = useState<ExchangeItem[]>([]);

  /* ================= PAYMENT ================= */
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueDateTime, setDueDateTime] = useState("");

  /* ================= HELPERS ================= */
  const addItem = () =>
    setItems([
      ...items,
      {
        name: "",
        metal: "Gold",
        purityType: "22k",
        purityValue: "22k",
        weight: 0,
        rate: 0,
        makingPercent: 8,
      },
    ]);

  const deleteItem = (i: number) =>
    setItems(items.filter((_, index) => index !== i));

  const updateItem = (i: number, key: keyof PurchaseItem, value: any) => {
    const copy = [...items];
    // @ts-ignore
    copy[i][key] = value;
    if (key === "purityType" && value !== "custom") {
      copy[i].purityValue = value;
    }
    setItems(copy);
  };

  const addExchange = () =>
    setExchangeItems([
      ...exchangeItems,
      { description: "", metal: "Gold", purity: "", weight: 0, rate: 0 },
    ]);

  const deleteExchange = (i: number) =>
    setExchangeItems(exchangeItems.filter((_, index) => index !== i));

  const updateExchange = (
    i: number,
    key: keyof ExchangeItem,
    value: any
  ) => {
    const copy = [...exchangeItems];
    // @ts-ignore
    copy[i][key] = value;
    setExchangeItems(copy);
  };

  /* ================= CALCULATIONS ================= */
  const purchaseTotal = items.reduce((s, i) => {
    const value = i.weight * i.rate;
    const making = (value * i.makingPercent) / 100;
    return s + value + making;
  }, 0);

  const gstAmount = gstEnabled ? purchaseTotal * 0.03 : 0;
  const purchaseFinal = purchaseTotal + gstAmount;

  const exchangeTotal = exchangeItems.reduce(
    (s, e) => s + e.weight * e.rate,
    0
  );

  const finalPayable = purchaseFinal - exchangeTotal;
  const dueAmount = Math.max(finalPayable - paidAmount, 0);

 const createNewBill = () => {
  const current = localStorage.getItem("invoice_no") || "000001";
  const next = String(Number(current) + 1).padStart(6, "0");
  localStorage.setItem("invoice_no", next);
  window.location.reload();
};


  /* ================= UI ================= */
  return (
    <div className="bg-gray-200 min-h-screen p-4">
      <div className="
  mx-auto bg-white border-2 border-black p-3 text-black
  w-full max-w-[794px]
  text-[14px] sm:text-[16px]
">


        {/* COMPANY */}
        <div className="flex border-b-2 border-black">
          
          <div className="w-2/3 bg-yellow-200 p-2">
            <p className="font-bold">{COMPANY.name}</p>
            <p>{COMPANY.address}</p>
            <p>Phone: {COMPANY.phone}</p>
            {gstEnabled && <p>GSTIN: {COMPANY.gstin}</p>}
          </div>
        </div>

        {/* TITLE */}
        <div className="flex border-b-2 border-black">
          <div className="w-1/2 bg-blue-600 text-white flex justify-between items-center py-2 font-bold text-lg">
            Jewellery Bill
          </div>
          <div className="w-1/2 p-2 text-right font-medium">
            <p><b>Invoice No:</b> {invoiceNo}</p>
            <p><b>Date:</b> {dateTime}</p>
            <label className="inline-flex gap-1 items-center justify-end mt-1 font-semibold print:hidden">
              <input
                type="checkbox"
                checked={gstEnabled}
                onChange={() => setGstEnabled(!gstEnabled)}
              />
              GST (3%)
            </label>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="border-b-2 border-black p-2">
          <p className="font-bold">Bill To</p>
          <input className="border w-full mb-1 px-1" placeholder="Customer Name" />
          <input className="border w-full mb-1 px-1" placeholder="Phone" />
          <input className="border w-full px-1" placeholder="Address" />
        </div>

        {/* ================= NEW PURCHASE ================= */}
        <p className="font-bold bg-yellow-200 mt-2 p-1">New Purchase</p>

        <table className="w-full border border-black">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border p-1">Sr</th>
              <th className="border p-1">Item</th>
              <th className="border p-1">Metal</th>
              <th className="border p-1">Purity</th>
              <th className="border p-1">Wt</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Mk%</th>
              <th className="border p-1">Total</th>
              <th className="border p-1 print:hidden">❌</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const value = item.weight * item.rate;
              const making = (value * item.makingPercent) / 100;
              return (
                <tr key={i} className="text-center">
                  <td className="border p-1">{i + 1}</td>
                  <td className="border p-1">
                    <input className="border w-full px-1"
                      onChange={(e) => updateItem(i, "name", e.target.value)} />
                  </td>
                  <td className="border p-1">
                    <select className="border"
                      onChange={(e) => updateItem(i, "metal", e.target.value)}>
                      <option>Gold</option>
                      <option>Silver</option>
                    </select>
                  </td>
                  <td className="border p-1">
                    <select className="border w-14"
                      onChange={(e) => updateItem(i, "purityType", e.target.value)}>
                      <option value="18k">18k</option>
                      <option value="22k">22k</option>
                      <option value="24k">24k</option>
                      <option value="custom">Custom</option>
                    </select>
                    {item.purityType === "custom" && (
                      <input className="border w-12 ml-1 px-1"
                        onChange={(e) =>
                          updateItem(i, "purityValue", e.target.value)
                        } />
                    )}
                  </td>
                  <td className="border p-1">
                    <input type="number" className="border w-14"
                      onChange={(e) => updateItem(i, "weight", +e.target.value)} />
                  </td>
                  <td className="border p-1">
                    <input type="number" className="border w-20"
                      onChange={(e) => updateItem(i, "rate", +e.target.value)} />
                  </td>
                  <td className="border p-1">
                    <select className="border w-14"
                      onChange={(e) =>
                        updateItem(i, "makingPercent", +e.target.value)}>
                      {Array.from({ length: 28 }, (_, k) => 8 + k).map(p =>
                        <option key={p} value={p}>{p}%</option>
                      )}
                    </select>
                  </td>
                  <td className="border p-1 font-bold">
                    ₹{(value + making).toFixed(2)}
                  </td>
                  <td className="border p-1 print:hidden">
                    <button onClick={() => deleteItem(i)} className="text-red-600">
                      X
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="bg-green-600 text-white px-3 py-1 mt-1 print:hidden">
          + Add Item
        </button>

        {/* ================= TOTAL ================= */}
        <div className="mt-3 border-2 border-black p-2 bg-gray-100">
          <div className="flex justify-between">
            <span>New Purchase Total</span>
            <span>₹{purchaseTotal.toFixed(2)}</span>
          </div>
          {gstEnabled && (
            <div className="flex justify-between">
              <span>GST (3%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t mt-1 pt-1">
            <span>New Purchase Final</span>
            <span>₹{purchaseFinal.toFixed(2)}</span>
          </div>
        </div>

        {/* ================= OLD EXCHANGE ================= */}
        <p className="font-bold bg-yellow-200 mt-3 p-1">
          Old Gold / Silver Exchange
        </p>

        <table className="w-full border border-black">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border p-1">Sr</th>
              <th className="border p-1">Description</th>
              <th className="border p-1">Metal</th>
              <th className="border p-1">Purity</th>
              <th className="border p-1">Weight</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
              <th className="border p-1 print:hidden">❌</th>
            </tr>
          </thead>
          <tbody>
            {exchangeItems.map((ex, i) => (
              <tr key={i} className="text-center">
                <td className="border p-1">{i + 1}</td>
                <td className="border p-1">
                  <input className="border w-full px-1"
                    placeholder="Old chain / ring"
                    onChange={(e) =>
                      updateExchange(i, "description", e.target.value)
                    } />
                </td>
                <td className="border p-1">
                  <select className="border"
                    onChange={(e) => updateExchange(i, "metal", e.target.value)}>
                    <option>Gold</option>
                    <option>Silver</option>
                  </select>
                </td>
                <td className="border p-1">
                  <input className="border w-14 px-1"
                    placeholder="Purity"
                    onChange={(e) =>
                      updateExchange(i, "purity", e.target.value)
                    } />
                </td>
                <td className="border p-1">
                  <input type="number" className="border w-14"
                    onChange={(e) =>
                      updateExchange(i, "weight", +e.target.value)
                    } />
                </td>
                <td className="border p-1">
                  <input type="number" className="border w-20"
                    onChange={(e) =>
                      updateExchange(i, "rate", +e.target.value)
                    } />
                </td>
                <td className="border p-1 font-bold">
                  ₹{(ex.weight * ex.rate).toFixed(2)}
                </td>
                <td className="border p-1 print:hidden">
                  <button
                    onClick={() => deleteExchange(i)}
                    className="text-red-600">
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addExchange}
          className="bg-orange-600 text-white px-3 py-1 mt-1 print:hidden">
          + Add Exchange
        </button>

        {/* ================= FINAL ================= */}
        <div className="mt-3 border-2 border-black p-2 bg-yellow-100">
          <div className="flex justify-between text-lg font-extrabold">
            <span>Final Payable Amount</span>
            <span>₹{finalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* ================= PAYMENT ================= */}
        <div className="mt-2 border border-black p-2">
          <div className="flex justify-between">
            <span>Paid Amount</span>
            <input
              type="number"
              className="border px-1 w-32 text-right print:hidden"
              onChange={(e) => setPaidAmount(+e.target.value)}
            />
            <span className="hidden print:block">₹{paidAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold mt-1">
            <span>Due Amount</span>
            <span>₹{dueAmount.toFixed(2)}</span>
          </div>

          {dueAmount > 0 && (
            <div className="flex justify-between mt-1">
              <span>Due Date / Time</span>
              <input
                type="datetime-local"
                className="border px-1 print:hidden"
                onChange={(e) => setDueDateTime(e.target.value)}
              />
              <span className="hidden print:block">{dueDateTime}</span>
            </div>
          )}
        </div>

        {/* SIGN + ACTIONS */}
        <div className="flex justify-between mt-6">
          <span>Customer Signature</span>
          <span>Authorised Signature</span>
        </div>

        <div className="flex justify-center gap-4 mt-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-1">
            Print Bill
          </button>
          <button
            onClick={createNewBill}
            className="bg-gray-600 text-white px-6 py-1">
            Create New Bill
          </button>
        </div>

      </div>
    </div>
  );
}
