import { useState } from "react";

export default function App() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dataType, setDataType] = useState("Charges");
  const [accountingFormat, setAccountingFormat] = useState("summary");

  const previewData = [
    { date: "2024-01-15", gross: "1,250.00", fee: "36.25", net: "1,213.75", currency: "USD", reference: "ch_1MqFv..." },
    { date: "2024-01-16", gross: "2,840.50", fee: "82.37", net: "2,758.13", currency: "USD", reference: "ch_1MqGw..." },
    { date: "2024-01-17", gross: "945.00", fee: "27.41", net: "917.59", currency: "USD", reference: "ch_1MqHx..." },
    { date: "2024-01-18", gross: "3,120.75", fee: "90.50", net: "3,030.25", currency: "USD", reference: "ch_1MqIy..." },
    { date: "2024-01-19", gross: "1,680.00", fee: "48.72", net: "1,631.28", currency: "USD", reference: "ch_1MqJz..." },
  ];

  function downloadCsv() {
    const header = "Date,Gross,Fee,Net,Currency,Reference";

    const rows = previewData.map((r) =>
      [
        r.date,
        String(r.gross).replace(/,/g, ""),
        r.fee,
        String(r.net).replace(/,/g, ""),
        r.currency,
        r.reference,
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "stripe-charges-2024-01.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl">
        <h1 className="mb-8">Stripe CSV Export</h1>
        
        <div className="space-y-6 mb-8">
          {/* Date Range Inputs */}
          <div className="space-y-4">
            <div>
              <label htmlFor="date-from" className="block mb-2">
                From
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-black px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="block mb-2">
                To
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-black px-3 py-2"
              />
            </div>
          </div>

          {/* Data Type Dropdown */}
          <div>
            <label htmlFor="data-type" className="block mb-2">
              Data type
            </label>
            <select
              id="data-type"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full border border-black px-3 py-2 bg-white"
            >
              <option value="Charges">Charges</option>
              <option value="Payouts">Payouts</option>
              <option value="Fees">Fees</option>
              <option value="Refunds">Refunds</option>
            </select>
          </div>

          {/* Accounting Format Radio Buttons */}
          <div>
            <label className="block mb-2">Accounting format</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="format-summary"
                  name="accounting-format"
                  value="summary"
                  checked={accountingFormat === "summary"}
                  onChange={(e) => setAccountingFormat(e.target.value)}
                />
                <label htmlFor="format-summary">Summary (daily totals)</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="format-line"
                  name="accounting-format"
                  value="line"
                  checked={accountingFormat === "line"}
                  onChange={(e) => setAccountingFormat(e.target.value)}
                />
                <label htmlFor="format-line">Line-by-line (every transaction)</label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Table */}
        <div className="mb-4">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-white">
                <th className="border border-black px-4 py-2 text-left">Date</th>
                <th className="border border-black px-4 py-2 text-left">Gross</th>
                <th className="border border-black px-4 py-2 text-left">Fee</th>
                <th className="border border-black px-4 py-2 text-left">Net</th>
                <th className="border border-black px-4 py-2 text-left">Currency</th>
                <th className="border border-black px-4 py-2 text-left">Reference</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index} className="text-gray-400">
                  <td className="border border-black px-4 py-2">{row.date}</td>
                  <td className="border border-black px-4 py-2">{row.gross}</td>
                  <td className="border border-black px-4 py-2">{row.fee}</td>
                  <td className="border border-black px-4 py-2">{row.net}</td>
                  <td className="border border-black px-4 py-2">{row.currency}</td>
                  <td className="border border-black px-4 py-2">{row.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-6 text-gray-600"><p className="mb-6 text-gray-600">
          Preview only. Export requires payment.</p>

      

        <button
          onClick={downloadCsv}
          className="border border-black px-6 py-2 bg-white hover:bg-gray-100 mb-2"
        >
          <button
  onClick={() => {
    if (!hasPaid) {
      alert("Export requires payment.");
      return;
    }
    downloadCsv();
  }}
  className="border border-black px-6 py-2 bg-white 
hover:bg-gray-100 mb-2"
>
  Export CSV
        </button>

        <p className="text-gray-600">
          $5/month. Cancel anytime. No Stripe data stored.
        </p>
      </div>
    </div>
  );
}
