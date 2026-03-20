"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const testPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://churn-retention-engine.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: "cust_123",
          mrr: 45.0,
          usage_frequency: 2,
          support_tickets: 4,
          last_login_days_ago: 20,
          plan_tier: "pro"
        })
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error(error);
      alert("Ensure Python backend is running on port 8000!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Retention Dashboard</h1>
            <p className="text-gray-500 mt-1">AI SaaS Churn Prediction & Retention Engine</p>
          </div>
          <button 
            onClick={testPrediction}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test ML Prediction"}
          </button>
        </header>

        {prediction && (
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl mb-6">
            <h3 className="text-indigo-900 font-semibold mb-2">Live Backend Prediction Response</h3>
            <pre className="text-sm text-indigo-800 bg-white p-3 rounded border border-indigo-100 overflow-auto">
              {JSON.stringify(prediction, null, 2)}
            </pre>
          </div>
        )}

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Revenue at Risk (30 Days)</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">$24,500</p>
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span>↑ 12% from last week</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total MRR</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">$145,200</p>
            <p className="text-sm text-green-500 mt-1 flex items-center">
              <span>↑ 4% from last week</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">18</p>
            <p className="text-sm text-gray-500 mt-1">Currently running A/B tests</p>
          </div>
        </div>

        {/* At-Risk Customers Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">High-Risk Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">MRR</th>
                  <th className="px-6 py-4 font-medium">Churn Probability</th>
                  <th className="px-6 py-4 font-medium">Primary Reason</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {[
                  { name: "Acme Corp", mrr: "$2,400", prob: "89%", reason: "Declining usage, 5+ open tickets", status: "founder_email" },
                  { name: "Globex Inc", mrr: "$850", prob: "76%", reason: "No logins in 21 days", status: "discount_offer" },
                  { name: "Initech", mrr: "$4,100", prob: "72%", reason: "Billing failure imminent", status: "success_call" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-gray-600">{row.mrr}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {row.prob}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{row.reason}</td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded bg-indigo-50">
                        View Campaign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}