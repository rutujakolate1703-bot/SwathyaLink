import { useState } from "react";
import { useApp } from "../context/AppContext";
import { mockDashboardMetrics } from "../data/mock";

function BarChart({ data, valueKey, labelKey, color, max }: { data: any[]; valueKey: string; labelKey: string; color: string; max: number }) {
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="text-xs font-mono text-stone-500">{d[valueKey]}</div>
          <div
            className={`w-full rounded-t-sm transition-all ${color}`}
            style={{ height: `${(d[valueKey] / max) * 72}px` }}
          />
          <div className="text-xs text-stone-400">{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

function GaugeBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}%</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color.replace("text-", "bg-")}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { language } = useApp();
  const isHindi = language === "hi";
  const [view, setView] = useState<"facility" | "program">("facility");
  const m = mockDashboardMetrics;

  const maxTeleconsults = Math.max(...m.monthlyTrend.map((t) => t.teleconsults));
  const maxReferrals = Math.max(...m.monthlyTrend.map((t) => t.referrals));
  const maxFollowups = Math.max(...m.monthlyTrend.map((t) => t.followups));

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-stone-900">{isHindi ? "विश्लेषण डैशबोर्ड" : "Facility & Programme Dashboard"}</h1>
          <p className="text-stone-500 text-sm mt-0.5">Real-time quality monitoring · NHM indicators · Jan 2024</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("facility")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${view === "facility" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>Facility</button>
          <button onClick={() => setView("program")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${view === "program" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>Programme</button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Avg Wait Time", value: `${m.avgWaitTime} min`, sub: "Target: < 30 min", ok: m.avgWaitTime < 30, icon: "⏱" },
          { label: "Queue Length", value: m.queueLength, sub: "Current", ok: m.queueLength < 15, icon: "👥" },
          { label: "Teleconsults Today", value: m.teleconsultVolume, sub: "Completed", ok: true, icon: "📹" },
          { label: "Referral Completion", value: `${m.referralCompletionRate}%`, sub: "Target: > 80%", ok: m.referralCompletionRate >= 80, icon: "↗" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-start justify-between mb-1">
              <span className="text-xl">{kpi.icon}</span>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${kpi.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {kpi.ok ? "On Track" : "Below Target"}
              </span>
            </div>
            <div className="text-3xl font-heading font-bold text-stone-900">{kpi.value}</div>
            <div className="text-sm font-semibold text-stone-600 mt-0.5">{kpi.label}</div>
            <div className="text-xs text-stone-400 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly trend */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h2 className="font-heading font-semibold text-stone-900 mb-4">Monthly Activity — Last 6 Months</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-stone-500 font-semibold mb-2">Teleconsults</div>
              <BarChart data={m.monthlyTrend} valueKey="teleconsults" labelKey="month" color="bg-teal-500" max={maxTeleconsults} />
            </div>
            <div>
              <div className="text-xs text-stone-500 font-semibold mb-2">Referrals</div>
              <BarChart data={m.monthlyTrend} valueKey="referrals" labelKey="month" color="bg-orange-400" max={maxReferrals} />
            </div>
          </div>
        </div>

        {/* Programme indicators */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h2 className="font-heading font-semibold text-stone-900 mb-4">Programme Indicators</h2>
          <div className="space-y-4">
            <GaugeBar value={m.followUpAdherence} label="Follow-up Adherence" color="text-teal-600" />
            <GaugeBar value={m.ancCoverage} label="ANC 4+ Coverage" color="text-pink-600" />
            <GaugeBar value={m.htnControlRate} label="HTN Control Rate" color="text-red-500" />
            <GaugeBar value={m.tbAdherence} label="TB Treatment Adherence" color="text-amber-600" />
            <GaugeBar value={100 - m.stockOutRate} label="Medicine Availability" color="text-green-600" />
            <GaugeBar value={m.referralCompletionRate} label="Referral Completion" color="text-violet-600" />
          </div>
        </div>
      </div>

      {/* Facility comparison */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h2 className="font-heading font-semibold text-stone-900">Facility Comparison — District Wardha</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Facility</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Stock-out %</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Follow-up %</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Referral Completion %</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {m.facilityComparison.map((f) => {
                const score = Math.round(((100 - f.stockOut) + f.followUp + f.referral) / 3);
                return (
                  <tr key={f.facility} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-semibold text-stone-900">{f.facility}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${f.stockOut > 20 ? "text-red-600" : f.stockOut > 10 ? "text-amber-600" : "text-green-700"}`}>
                        {f.stockOut}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-stone-100 rounded-full">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${f.followUp}%` }} />
                        </div>
                        <span className="text-xs font-mono text-stone-600">{f.followUp}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-stone-100 rounded-full">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${f.referral}%` }} />
                        </div>
                        <span className="text-xs font-mono text-stone-600">{f.referral}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${score >= 85 ? "text-green-700" : score >= 70 ? "text-amber-700" : "text-red-600"}`}>
                        {score}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h2 className="font-heading font-semibold text-stone-900">Facility Map — Wardha District</h2>
        </div>
        <div className="bg-stone-50 h-52 relative flex items-center justify-center">
          <div className="text-stone-300 text-sm">Map view (OpenStreetMap integration)</div>
          {/* Simulated facility pins */}
          {[
            { label: "Bhimpur PHC", x: 45, y: 55, color: "bg-amber-500", score: 68 },
            { label: "Wardha RH", x: 62, y: 40, color: "bg-green-500", score: 87 },
            { label: "Nagpur DH", x: 80, y: 25, color: "bg-green-600", score: 97 },
            { label: "Pulgaon SC", x: 28, y: 65, color: "bg-red-500", score: 51 },
          ].map((pin) => (
            <div key={pin.label} className="absolute group" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
              <div className={`w-4 h-4 rounded-full ${pin.color} border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform`} />
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {pin.label}: {pin.score}%
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-stone-100 flex gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" />Good (&gt;80%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" />Fair (60–80%)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" />Poor (&lt;60%)</span>
        </div>
      </div>
    </div>
  );
}
