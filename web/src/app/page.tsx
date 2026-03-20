"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from "recharts";
import { 
  Activity, Users, DollarSign, AlertTriangle, ShieldCheck, 
  Mail, Tag, PhoneCall, PlayCircle, X, Sparkles, BrainCircuit,
  TrendingDown, TrendingUp, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data for Charts & Tables ---
const revenueData = [
  { name: "Jan", mrr: 120000, churned: 4000 },
  { name: "Feb", mrr: 125000, churned: 3500 },
  { name: "Mar", mrr: 132000, churned: 5200 },
  { name: "Apr", mrr: 141000, churned: 2100 },
  { name: "May", mrr: 145200, churned: 1800 },
  { name: "Jun", mrr: 156000, churned: 1500 },
];

const riskDistribution = [
  { name: "Low Risk", value: 75, color: "#10B981" },
  { name: "Medium Risk", value: 15, color: "#F59E0B" },
  { name: "High Risk", value: 10, color: "#EF4444" },
];

const mockCustomers = [
  { id: "CUST-001", name: "Acme Corp", plan: "Enterprise", mrr: 2400, prob: 89, reason: "Declining usage, 5+ open tickets", status: "founder_email", active: "2 days ago" },
  { id: "CUST-002", name: "Globex Inc", plan: "Pro", mrr: 850, prob: 76, reason: "No logins in 21 days", status: "discount_offer", active: "21 days ago" },
  { id: "CUST-003", name: "Initech", plan: "Enterprise", mrr: 4100, prob: 72, reason: "Billing failure imminent", status: "success_call", active: "1 day ago" },
  { id: "CUST-004", name: "Soylent Corp", plan: "Pro", mrr: 600, prob: 65, reason: "Feature drop-off (reporting)", status: "automated_email", active: "14 days ago" },
  { id: "CUST-005", name: "Umbrella Corp", plan: "Basic", mrr: 150, prob: 58, reason: "Low overall engagement", status: "discount_offer", active: "30 days ago" },
  { id: "CUST-006", name: "Stark Ind.", plan: "Enterprise", mrr: 8500, prob: 12, reason: "Healthy", status: "none", active: "2 hours ago" },
  { id: "CUST-007", name: "Wayne Ent.", plan: "Enterprise", mrr: 12000, prob: 5, reason: "Highly Engaged", status: "none", active: "1 hour ago" },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(true);

  const testPrediction = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      // Calling the live Render backend
      const response = await fetch("https://churn-retention-engine.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: "cust_live_demo",
          mrr: 45.0,
          usage_frequency: 2,
          support_tickets: 4,
          last_login_days_ago: 20,
          plan_tier: "pro"
        })
      });
      const data = await response.json();
      
      // Simulate network delay for UI effect
      setTimeout(() => {
        setPrediction(data);
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend. Ensure it is running.");
      setLoading(false);
    }
  };

  const getActionBadge = (status: string) => {
    switch (status) {
      case "founder_email": return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"><Mail size={12}/> Founder Email</span>;
      case "discount_offer": return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30"><Tag size={12}/> 20% Discount</span>;
      case "success_call": return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"><PhoneCall size={12}/> Success Call</span>;
      case "automated_email": return <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30"><Mail size={12}/> Auto Email</span>;
      default: return <span className="text-gray-500 text-xs">Monitoring</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Navigation / Header */}
        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Synapse <span className="text-sm font-normal px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Enterprise</span>
              </h1>
              <p className="text-sm text-gray-400">AI-Powered Churn Prediction & Retention</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Hasnaathussain/churn-retention-engine" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
            <button 
              onClick={testPrediction}
              disabled={loading}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Sparkles size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Analyzing Live Data..." : "Run Live AI Prediction"}
            </button>
          </div>
        </nav>

        {/* Explainer / Intro Section */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden", marginTop: 0, marginBottom: 0 }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-white/10 backdrop-blur-xl shadow-2xl"
            >
              <button onClick={() => setShowIntro(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-white mb-3">How this Machine Works 🧠</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  This platform acts as an autonomous Customer Success Manager. It connects directly to your <strong>Stripe</strong> (billing) and <strong>Mixpanel</strong> (usage) data. 
                  A predictive Machine Learning engine analyzes user behavior 24/7. When it detects a pattern indicating high churn risk (e.g., dropping usage + open support tickets), 
                  it leverages <strong>GPT-4o</strong> to instantly generate and deploy highly personalized retention campaigns before the user even clicks "Cancel".
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                    <Activity className="text-indigo-400 w-6 h-6 mt-1" />
                    <div><h4 className="font-semibold text-gray-200">1. Monitor</h4><p className="text-xs text-gray-400">Ingests live usage and billing events.</p></div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                    <AlertTriangle className="text-amber-400 w-6 h-6 mt-1" />
                    <div><h4 className="font-semibold text-gray-200">2. Predict</h4><p className="text-xs text-gray-400">ML models flag at-risk accounts 30 days out.</p></div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start gap-3">
                    <ShieldCheck className="text-green-400 w-6 h-6 mt-1" />
                    <div><h4 className="font-semibold text-gray-200">3. Retain</h4><p className="text-xs text-gray-400">Auto-triggers AI emails & discount offers.</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Prediction Results */}
        <AnimatePresence>
          {prediction && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    <h3 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Live AI Assessment Complete</h3>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Customer: {prediction.customer_id}</h2>
                  <p className="text-gray-400 mb-6">Based on their recent activity drop-off and support ticket volume, our engine has calculated their immediate risk profile.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                      <p className="text-sm text-gray-400 mb-1">Recommended Action</p>
                      <p className="font-semibold text-indigo-300">Generate GPT-4o Email</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                      <p className="text-sm text-gray-400 mb-1">Target</p>
                      <p className="font-semibold text-gray-200">Re-engage with premium features</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto bg-black/40 p-8 rounded-full border border-white/10 flex flex-col items-center justify-center aspect-square md:h-64 relative">
                   <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                     <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                     <motion.circle 
                       initial={{ strokeDasharray: "0 1000" }}
                       animate={{ strokeDasharray: `${prediction.churn_probability * 100}, 100` }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       cx="50%" cy="50%" r="45%" fill="none" 
                       stroke={prediction.is_at_risk ? "#EF4444" : "#10B981"} 
                       strokeWidth="8" strokeLinecap="round" 
                       pathLength="100"
                     />
                   </svg>
                   <div className="text-center z-10">
                     <span className={`text-5xl font-bold ${prediction.is_at_risk ? "text-red-400" : "text-green-400"}`}>
                       {(prediction.churn_probability * 100).toFixed(1)}%
                     </span>
                     <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Churn Risk</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Monthly Revenue</p>
                <h3 className="text-3xl font-bold text-white mt-1">$156,000</h3>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><DollarSign size={20} /></div>
            </div>
            <p className="text-sm text-green-400 mt-4 flex items-center gap-1"><TrendingUp size={16}/> +8.4% from last month</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-red-500/20 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-400/80">Revenue at Risk (30d)</p>
                <h3 className="text-3xl font-bold text-red-400 mt-1">$24,500</h3>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><TrendingDown size={20} /></div>
            </div>
            <p className="text-sm text-red-400 mt-4 flex items-center gap-1"><AlertTriangle size={16}/> Requires immediate action</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Retentions</p>
                <h3 className="text-3xl font-bold text-white mt-1">142</h3>
              </div>
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Users size={20} /></div>
            </div>
            <p className="text-sm text-gray-400 mt-4">Customers saved this year</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">AI Campaigns Running</p>
                <h3 className="text-3xl font-bold text-white mt-1">18</h3>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><PlayCircle size={20} /></div>
            </div>
            <p className="text-sm text-gray-400 mt-4">A/B Testing 3 variations</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue & Churn Velocity</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area yAxisId="left" type="monotone" dataKey="mrr" name="Total MRR" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                  <Area yAxisId="right" type="monotone" dataKey="churned" name="Churned MRR" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorChurn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2">Portfolio Risk Distribution</h3>
            <p className="text-sm text-gray-400 mb-6">Real-time breakdown of your customer base.</p>
            <div className="flex-1 flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Advanced Data Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
            <div>
              <h2 className="text-xl font-bold text-white">Live Intelligence Feed</h2>
              <p className="text-sm text-gray-400 mt-1">Accounts prioritized by algorithmic churn probability.</p>
            </div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
              View All <ArrowRight size={16}/>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Customer & Plan</th>
                  <th className="px-6 py-4 font-medium">MRR Impact</th>
                  <th className="px-6 py-4 font-medium">Risk Score</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Primary AI Diagnosis</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Last Active</th>
                  <th className="px-6 py-4 font-medium">Auto-Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {mockCustomers.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-200">{row.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{row.plan}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">${row.mrr.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${row.prob > 70 ? 'bg-red-500' : row.prob > 40 ? 'bg-amber-500' : 'bg-green-500'}`} 
                            style={{ width: `${row.prob}%` }}
                          />
                        </div>
                        <span className={`font-semibold ${row.prob > 70 ? 'text-red-400' : row.prob > 40 ? 'text-amber-400' : 'text-green-400'}`}>
                          {row.prob}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{row.reason}</td>
                    <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">{row.active}</td>
                    <td className="px-6 py-4">
                      {row.status !== "none" ? (
                        <button 
                          onClick={() => setSelectedCampaign(row)}
                          className="flex items-center gap-2 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                        >
                          {getActionBadge(row.status)}
                        </button>
                      ) : (
                        <span className="text-gray-600 italic text-xs">Stable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal for Viewing Campaigns */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCampaign(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><BrainCircuit size={20} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Generated Campaign</h3>
                    <p className="text-xs text-gray-400">Target: {selectedCampaign.name} | Strategy: {selectedCampaign.status.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-black/30 rounded-xl p-4 border border-white/5 font-mono text-sm text-gray-300">
                  <div className="mb-2 border-b border-white/10 pb-2">
                    <span className="text-gray-500">To:</span> ceo@{selectedCampaign.name.toLowerCase().replace(' ', '')}.com<br/>
                    <span className="text-gray-500">Subject:</span> Quick question about your workspace
                  </div>
                  <div className="whitespace-pre-wrap mt-4 text-gray-300">
                    Hi there,{'\n\n'}
                    I'm the founder of Synapse. I was reviewing some metrics today and noticed that your team's engagement with our premium features has dropped off over the last few weeks.{'\n\n'}
                    I know how busy things can get, but I want to make sure you're getting the full ROI from your ${selectedCampaign.mrr.toLocaleString()}/mo plan. 
                    {selectedCampaign.status === 'discount_offer' ? " As a token of goodwill, I've applied a 20% discount to your next billing cycle." : " Do you have 5 minutes next Tuesday for a quick success call so I can personally help optimize your workflow?"}{'\n\n'}
                    Best,{'\n'}
                    Founder, Synapse
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setSelectedCampaign(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white">Cancel</button>
                  <button className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                    <Mail size={16} /> Deploy Campaign
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}