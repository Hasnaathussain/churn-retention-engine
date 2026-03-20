"use client";

import { useState, useEffect, useRef } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from "recharts";
import { 
  Mail, Tag, PhoneCall, X, Sparkles, BrainCircuit,
  TrendingDown, TrendingUp, ArrowRight, DollarSign, Users, Activity, PlayCircle, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./synapse.css";

// --- Mock Data ---
const revenueData = [
  { name: "Jan", mrr: 118000, churned: 5200 },
  { name: "Feb", mrr: 128000, churned: 6100 },
  { name: "Mar", mrr: 135000, churned: 5800 },
  { name: "Apr", mrr: 140000, churned: 3200 },
  { name: "May", mrr: 148000, churned: 2100 },
  { name: "Jun", mrr: 156000, churned: 1600 },
];

const riskDistribution = [
  { name: "High Risk", value: 23, color: "#e87070" },
  { name: "Medium Risk", value: 34, color: "#f0b040" },
  { name: "Low Risk", value: 43, color: "#4acc80" },
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Background Star Animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let stars: any[] = [];
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const n = Math.floor(W * H / 4200);
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.8,
          r: Math.random() * 1.2 + 0.2,
          alpha: Math.random() * 0.65 + 0.1,
          sp: Math.random() * 0.003 + 0.001,
          ph: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * 0.001 * s.sp * 1000 + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 255, ${a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const response = await fetch("https://churn-retention-engine.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: "demo_user_live",
          mrr: 499.0,
          usage_frequency: 3,
          support_tickets: 5,
          last_login_days_ago: 18,
          plan_tier: "enterprise"
        })
      });
      const data = await response.json();
      setTimeout(() => {
        setPrediction(data);
        setLoading(false);
        document.getElementById('live-intelligence')?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    } catch (error) {
      alert("Backend error. Check console.");
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("https://churn-retention-engine.onrender.com/create-checkout-session", {
        method: "POST"
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert("Monetization gateway error. Check API keys.");
    }
  };

  return (
    <div className="synapse-body min-h-screen relative overflow-x-hidden">
      <canvas ref={canvasRef} className="star-canvas" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-md bg-[#080d1a]/60 border-b border-[#d4902a]/10">
        <div className="nav-brand-font text-[22px] flex items-center gap-3 text-[#f0e8d8]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="rgba(212,144,42,0.6)" strokeWidth="1"/>
            <path d="M6 11 Q11 4 16 11 Q11 18 6 11Z" fill="rgba(212,144,42,0.3)" stroke="rgba(212,144,42,0.7)" strokeWidth="0.8"/>
            <circle cx="11" cy="11" r="2.5" fill="#f0b040"/>
          </svg>
          Synapse<sup className="text-[10px] text-[#d4902a] ml-1">®</sup>
          <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#d4902a] border border-[#d4902a]/30 rounded-full px-2.5 py-0.5 ml-2">Enterprise</span>
        </div>
        <ul className="hidden lg:flex gap-9 text-[13px] tracking-[0.05em] text-[#6b7fa0]">
          <li className="hover:text-[#e8c57a] cursor-pointer transition-colors">Overview</li>
          <li className="hover:text-[#e8c57a] cursor-pointer transition-colors">Intelligence</li>
          <li className="hover:text-[#e8c57a] cursor-pointer transition-colors">Campaigns</li>
          <li className="hover:text-[#e8c57a] cursor-pointer transition-colors">Settings</li>
        </ul>
        <button onClick={handlePredict} className="text-[13px] text-[#f0b040] border border-[#d4902a]/40 rounded-full px-5 py-2 hover:bg-[#d4902a]/10 transition-all flex items-center gap-2">
           <Activity size={14} className={loading ? "animate-spin" : ""} />
           {loading ? "Analyzing..." : "Run Live AI Prediction"}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-[11px] tracking-[0.2em] uppercase text-[#d4902a] mb-7"
        >
          AI-Powered Churn Prediction & Retention
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="hero-title-font text-[52px] md:text-[88px] font-light leading-[1.05] text-[#f0e8d8] max-w-[900px] mb-7"
        >
          Where <em className="italic text-[#e8c57a]">revenue</em> survives<br />through the signals.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="text-[15px] text-[#8899bb] max-w-[520px] leading-[1.8] mb-12"
        >
          We built an autonomous intelligence engine for SaaS teams. It watches your customers so you don't have to — and acts before they leave.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex gap-4"
        >
          <button onClick={handleCheckout} className="btn-synapse-primary px-9 py-3.5 rounded-full text-[14px] font-normal tracking-[0.05em] shadow-lg">Begin Intelligence</button>
          <button className="btn-synapse-ghost px-9 py-3.5 rounded-full text-[14px] font-normal tracking-[0.05em]">View Documentation</button>
        </motion.div>
      </section>

      {/* How it Works Card */}
      <section className="relative z-10 max-w-[900px] mx-auto px-6 mb-20">
        <div className="glass-card rounded-[16px] p-10 md:p-11">
          <h2 className="hero-title-font text-[28px] text-[#f0e8d8] mb-4">How the Machine Thinks</h2>
          <p className="text-[14px] leading-[1.85] text-[#8899bb] mb-8 max-w-[680px]">
            This platform acts as an autonomous Customer Success Manager. It connects directly to your <strong>Stripe</strong> and <strong>Mixpanel</strong> data. 
            When it detects a high churn risk pattern, it leverages <strong>GPT-4o</strong> to generate and deploy personalized retention campaigns — before the user even clicks "Cancel."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { icon: "∿", title: "Monitor", desc: "Ingests live usage and billing events, building behavioral fingerprints.", color: "#f0b040" },
               { icon: "△", title: "Predict", desc: "ML models flag at-risk accounts up to 30 days before churn.", color: "#e06060" },
               { icon: "◇", title: "Retain", desc: "Auto-triggers AI emails, discount offers, and success calls.", color: "#4acc80" }
             ].map((step, i) => (
               <div key={i} className="bg-[#162035]/80 border border-[#6b7fa0]/15 rounded-[10px] p-5 hover:border-[#d4902a]/25 transition-colors">
                 <div className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium mb-3 border" style={{ backgroundColor: `${step.color}20`, color: step.color, borderColor: `${step.color}50` }}>{step.icon}</div>
                 <h3 className="hero-title-font text-[17px] text-[#f0e8d8] mb-1.5">{step.title}</h3>
                 <p className="text-[12.5px] text-[#6b7fa0] leading-[1.6]">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="live-intelligence" className="relative z-10 max-w-[1200px] mx-auto px-6 pb-[120px]">
        <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-[#d4902a] mb-12">
          Live Intelligence Dashboard
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d4902a]/20 to-transparent"></div>
        </div>

        {prediction && (
           <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 mb-8 border-[#d4902a]/30">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="flex-1">
                    <h3 className="text-[#d4902a] text-xs tracking-widest uppercase mb-2">Live Analysis Complete</h3>
                    <h2 className="hero-title-font text-3xl text-[#f0e8d8] mb-4">Target: {prediction.customer_id}</h2>
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-sm text-[#8899bb]">
                       Our GPT-4o agent recommends: <span className="text-[#e8c57a] font-medium">Automatic Discount Retention Campaign</span>
                    </div>
                 </div>
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                       <circle cx="50%" cy="50%" r="42%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                       <motion.circle 
                          initial={{ pathLength: 0 }} animate={{ pathLength: prediction.churn_probability }} transition={{ duration: 1.5 }}
                          cx="50%" cy="50%" r="42%" fill="none" stroke={prediction.is_at_risk ? "#e87070" : "#4acc80"} strokeWidth="4" strokeLinecap="round"
                       />
                    </svg>
                    <div className="text-center">
                       <div className={`text-4xl font-light hero-title-font ${prediction.is_at_risk ? "text-[#e87070]" : "text-[#4acc80]"}`}>{(prediction.churn_probability * 100).toFixed(0)}%</div>
                       <div className="text-[10px] uppercase tracking-tighter text-[#6b7fa0]">Churn Risk</div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {[
             { label: "Total Monthly Revenue", val: "$156,000", color: "#6ee09a", icon: <TrendingUp size={16}/>, sub: "↑ 8.4% from last month" },
             { label: "Revenue at Risk (30d)", val: "$24,500", color: "#e87070", icon: <AlertTriangle size={16}/>, sub: "Requires immediate action" },
             { label: "Active Retentions", val: "142", color: "#f0e8d8", sub: "Customers saved this year" },
             { label: "AI Campaigns Running", val: "18", color: "#f0b040", sub: "A/B testing 3 variations" }
           ].map((kpi, i) => (
             <div key={i} className="kpi-card-glass rounded-[12px] p-6 hover:translate-y-[-3px] hover:border-[#d4902a]/20 transition-all">
                <div className="text-[11px] tracking-[0.1em] uppercase text-[#6b7fa0] mb-3.5">{kpi.label}</div>
                <div className="hero-title-font text-[40px] font-light leading-none mb-2.5" style={{ color: kpi.color }}>{kpi.val}</div>
                <div className="text-[12px] text-[#6b7fa0] flex items-center gap-1.5">
                   {kpi.icon && <span style={{ color: kpi.color }}>{kpi.icon}</span>}
                   {kpi.sub}
                </div>
             </div>
           ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
           <div className="lg:col-span-2 kpi-card-glass rounded-[12px] p-7">
              <h3 className="hero-title-font text-xl text-[#f0e8d8] mb-1.5">Revenue & Churn Velocity</h3>
              <p className="text-[12px] text-[#6b7fa0] mb-5">Monthly recurring revenue against churn pressure</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5b8fe8" stopOpacity={0.1}/><stop offset="95%" stopColor="#5b8fe8" stopOpacity={0}/></linearGradient>
                        <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e87070" stopOpacity={0.1}/><stop offset="95%" stopColor="#e87070" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7fa0" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis stroke="#6b7fa0" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#0d1526', borderColor: '#d4902a30', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="mrr" stroke="#5b8fe8" fillOpacity={1} fill="url(#colorMrr)" strokeWidth={2} />
                      <Area type="monotone" dataKey="churned" stroke="#e87070" fillOpacity={1} fill="url(#colorChurn)" strokeWidth={2} />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
           <div className="kpi-card-glass rounded-[12px] p-7 flex flex-col">
              <h3 className="hero-title-font text-xl text-[#f0e8d8] mb-1.5">Portfolio Risk</h3>
              <p className="text-[12px] text-[#6b7fa0] mb-5">Real-time breakdown by risk tier</p>
              <div className="flex-1 min-h-[180px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={riskDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                       <RechartsTooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                 {riskDistribution.map((tier, i) => (
                   <div key={i} className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-2.5 text-[#8899bb]"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />{tier.name}</div>
                      <div className="text-[#f0e8d8]">{tier.value}%</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Pricing / Monetization Section */}
        <div className="my-20 text-center">
           <h2 className="hero-title-font text-[44px] text-[#f0e8d8] mb-4">Secure your revenue today.</h2>
           <p className="text-[#6b7fa0] text-sm mb-10">Choose the enterprise plan to unlock full automated retention campaigns.</p>
           <div className="max-w-[400px] mx-auto glass-card p-10 rounded-2xl border-[#d4902a]/40 shadow-2xl">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#d4902a] mb-6">Annual Membership</div>
              <div className="hero-title-font text-6xl text-[#f0e8d8] mb-2">$499<span className="text-xl text-[#6b7fa0]">/mo</span></div>
              <p className="text-xs text-[#6b7fa0] mb-8">Billed annually. Full AI model access included.</p>
              <button onClick={handleCheckout} className="btn-synapse-primary w-full py-4 rounded-full text-sm font-medium tracking-widest uppercase">Subscribe Now</button>
           </div>
        </div>

        {/* Data Feed */}
        <div className="feed-card rounded-[12px]">
           <div className="flex justify-between items-start mb-7">
              <div>
                <h2 className="hero-title-font text-2xl text-[#f0e8d8]">Live Intelligence Feed</h2>
                <p className="text-[12px] text-[#6b7fa0]">Accounts prioritized by algorithmic churn probability</p>
              </div>
              <button className="view-all">View All →</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr>
                       <th>Customer & Plan</th>
                       <th>MRR Impact</th>
                       <th>Risk Score</th>
                       <th>Primary AI Diagnosis</th>
                       <th>Last Active</th>
                       <th>Auto-Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#6b7fa0]/10 text-sm">
                    {mockCustomers.map((row, i) => (
                      <tr key={i} className="group hover:bg-[#d4902a]/[0.04] transition-colors cursor-pointer" onClick={() => setSelectedCampaign(row)}>
                         <td className="py-4">
                            <span className="cname">{row.name}</span>
                            <span className="cplan">{row.plan}</span>
                         </td>
                         <td className="py-4 font-display text-[16px] text-[#e8c57a]">${row.mrr.toLocaleString()}</td>
                         <td className="py-4">
                            <div className="risk-wrap">
                               <div className="risk-bg"><div className="risk-fill" style={{ width: `${row.prob}%`, background: row.prob > 70 ? "linear-gradient(to right, #e87070, #c44040)" : "#4acc80" }}></div></div>
                               <span className="risk-pct" style={{ color: row.prob > 70 ? "#e87070" : "#4acc80" }}>{row.prob}%</span>
                            </div>
                         </td>
                         <td className="py-4 text-[#8899bb] text-[12.5px]">{row.reason}</td>
                         <td className="py-4 text-[#6b7fa0] text-[12px]">{row.active}</td>
                         <td className="py-4">
                            {row.status !== "none" ? (
                              <span className={`pill ${row.status.includes('email') ? 'email' : row.status.includes('disc') ? 'disc' : 'call'}`}>
                                {row.status === 'founder_email' ? "✉ Founder Email" : row.status === 'discount_offer' ? "◇ 20% Discount" : "☏ Success Call"}
                              </span>
                            ) : <span className="pill stable">Stable</span>}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="footer-div mt-20">
           <p>"In the silence between signals — there is intelligence."</p>
        </div>
      </section>

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#080d1a]/80 backdrop-blur-sm" onClick={() => setSelectedCampaign(null)}>
             <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0d1526] border border-[#d4902a]/20 rounded-2xl p-8 max-w-xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="hero-title-font text-2xl text-[#f0e8d8]">AI Intelligence Memo</h3>
                      <p className="text-xs text-[#6b7fa0] mt-1 tracking-widest uppercase">Strategy for {selectedCampaign.name}</p>
                   </div>
                   <button onClick={() => setSelectedCampaign(null)} className="text-[#6b7fa0] hover:text-white"><X size={20} /></button>
                </div>
                <div className="bg-black/40 rounded-xl p-5 border border-white/5 font-mono text-[13px] text-[#8899bb] mb-6">
                   <div className="border-b border-white/10 pb-3 mb-4">
                      <span className="text-gray-600">Subject:</span> Quick question about your workspace{'\n'}
                      <span className="text-gray-600">Tone:</span> Empathic & Professional
                   </div>
                   Hi there,{'\n\n'}
                   I'm the founder of Synapse. I was reviewing some metrics and noticed your team's engagement with our premium features has dropped.{'\n\n'}
                   I want to ensure you're getting full ROI from your ${selectedCampaign.mrr} plan. 
                   {selectedCampaign.status === 'discount_offer' ? " I've applied a 20% discount to your next cycle." : " Are you free Tuesday for a quick success call?"}{'\n\n'}
                   Best,{'\n'}Synapse Team
                </div>
                <div className="flex justify-end gap-3">
                   <button onClick={() => setSelectedCampaign(null)} className="btn-synapse-ghost px-6 py-2 rounded-full text-xs">Dismiss</button>
                   <button onClick={() => {alert("Campaign Deployed."); setSelectedCampaign(null)}} className="btn-synapse-primary px-6 py-2 rounded-full text-xs font-semibold">Deploy Intelligence</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}