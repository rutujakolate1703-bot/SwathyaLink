import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockMedicineStock } from "../data/mock";

export default function MedicinePage() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [stock, setStock] = useState(mockMedicineStock);
  const [filter, setFilter] = useState<string>("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  const filtered = filter === "all" ? stock : stock.filter((m) => m.status === filter);
  const outCount = stock.filter((m) => m.status === "out").length;
  const lowCount = stock.filter((m) => m.status === "low").length;

  const handleUpdate = (id: string) => {
    setStock((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      const newStatus = editQty === 0 ? "out" : editQty < m.reorderLevel ? "low" : "in_stock";
      return { ...m, quantity: editQty, status: newStatus };
    }));
    setEditId(null);
  };

  const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    in_stock: { label: "In Stock", color: "text-green-700", bg: "bg-green-100", dot: "bg-green-500" },
    low: { label: "Low Stock", color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
    out: { label: "Out of Stock", color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "दवा स्टॉक" : "Medicine Availability"}</h1>
        <p className="text-stone-500 text-sm mt-0.5">Bhimpur PHC · Essential medicines inventory · NHM list</p>
      </div>

      {/* Alert banner */}
      {(outCount > 0 || lowCount > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-semibold text-red-800">
              {outCount} medicine{outCount !== 1 ? "s" : ""} out of stock · {lowCount} running low
            </div>
            <div className="text-sm text-red-600 mt-0.5">
              Iron + Folic Acid and Amoxicillin stock-outs affect ANC and infection management. Order immediately.
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "in_stock", val: stock.filter((m) => m.status === "in_stock").length },
          { key: "low", val: lowCount },
          { key: "out", val: outCount },
        ].map(({ key, val }) => {
          const cfg = statusConfig[key];
          return (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? "all" : key)}
              className={`rounded-xl p-4 text-center border-2 transition-colors ${filter === key ? "border-current " + cfg.bg : "border-stone-200 bg-white hover:border-stone-300"}`}
            >
              <div className={`text-3xl font-heading font-bold ${cfg.color}`}>{val}</div>
              <div className={`text-xs font-semibold ${cfg.color} mt-0.5`}>{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Stock table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-stone-900">Inventory List</h2>
          <button className="text-xs border border-teal-600 text-teal-700 px-3 py-1 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
            📋 Export to CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Medicine</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Qty</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Unit</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Reorder Level</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((med) => {
                const cfg = statusConfig[med.status];
                const pct = Math.min(100, (med.quantity / (med.reorderLevel * 3)) * 100);
                return (
                  <tr key={med.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-stone-900">💊 {med.medicineName}</div>
                      <div className="w-24 h-1.5 bg-stone-100 rounded-full mt-1.5">
                        <div
                          className={`h-full rounded-full ${med.status === "out" ? "bg-red-500" : med.status === "low" ? "bg-amber-400" : "bg-green-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editId === med.id ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(Number(e.target.value))}
                          className="w-20 border border-teal-500 rounded px-2 py-1 text-sm font-mono focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className={`font-mono font-semibold ${med.status === "out" ? "text-red-600" : med.status === "low" ? "text-amber-700" : "text-stone-900"}`}>
                          {med.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{med.unit}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{med.reorderLevel}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editId === med.id ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => handleUpdate(med.id)} className="text-xs bg-teal-600 text-white px-2 py-1 rounded-lg hover:bg-teal-700 transition-colors">Save</button>
                          <button onClick={() => setEditId(null)} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-lg hover:bg-stone-200 transition-colors">×</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditId(med.id); setEditQty(med.quantity); }}
                          className="text-xs text-teal-700 font-semibold hover:underline"
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock-out impact */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <h3 className="font-heading font-semibold text-stone-900 mb-3">Stock-Out Programme Impact</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { medicine: "Iron + Folic Acid", impact: "ANC programme — 6 pregnant women affected", color: "border-pink-300 bg-pink-50" },
            { medicine: "Amoxicillin 500mg", impact: "Infection management — unable to treat bacterial infections", color: "border-red-300 bg-red-50" },
            { medicine: "Atenolol 50mg", impact: "HTN control — 4 patients without medication", color: "border-amber-300 bg-amber-50" },
          ].map((item) => (
            <div key={item.medicine} className={`rounded-xl p-3 border ${item.color}`}>
              <div className="text-sm font-semibold text-stone-900">{item.medicine}</div>
              <div className="text-xs text-stone-500 mt-1">{item.impact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
