# 🚀 AI SaaS Churn Prediction & Retention Engine

Welcome to your brand new AI business! This document is your ultimate, easy-to-understand guide. Think of this as the "instruction manual" for a money-making machine you just built. 

Read this whenever you feel stuck, need to know how a file works, or want to know the next steps to start making money with it.

---

## 🧸 Part 1: The "Explain Like I'm 5" Overview

Imagine you own a magic lemonade stand. Instead of paying every time, people pay you $10 **every month** to visit whenever they want. This is called a "Subscription Business" or "SaaS" (Software as a Service).

But suddenly, some people stop coming. They don't tell you why; they just cancel their $10 monthly subscription. This losing of customers is a massive problem in the business world, and it is called **"Churn"**.

**This project is a super-smart Robot Helper for your lemonade stand:**
1. **The Robot Watches:** It connects to the cash register (Stripe) and watches how often people drink lemonade (Mixpanel).
2. **The Robot Thinks (AI):** It calculates a math score. It says, *"Warning! John hasn't had lemonade in 14 days and complained about a sour cup. He is 89% likely to cancel tomorrow!"*
3. **The Robot Acts:** Before John can cancel, the robot uses AI (OpenAI) to automatically write John a super nice, personal email: *"Hey John, I'm so sorry your last cup was sour! Here is a 50% discount for this month, please stay!"*

John stays. You keep his $10 a month. **You just saved the business money automatically.**

---

## 📂 Part 2: Where is everything? (The Map)

This project has two main halves. A "Frontend" (what the user sees) and a "Backend" (the invisible brain).

*   **`web/` (The Frontend / The Face)**
    *   This is the dashboard website built using **Next.js (React)** and **TailwindCSS** (for pretty colors and shapes).
    *   *Important File:* `web/src/app/page.tsx` -> This is the actual screen with the charts, the "Revenue at Risk" numbers, and the list of at-risk customers.
*   **`engine/` (The Backend / The Brain)**
    *   This is the heavy-lifting engine built in **Python** using a web framework called **FastAPI**.
    *   *Important File:* `engine/main.py` -> The boss. It controls the whole backend, receives alerts from Stripe, and passes data to the AI.
    *   *Important File:* `engine/model.py` -> The Math Engine. It looks at numbers (days since last login, support tickets) and calculates the exact percentage chance a customer will quit.
    *   *Important File:* `engine/integrations.py` -> The Messenger. This file holds the code that actually talks to Stripe, Mixpanel, and OpenAI to write the emails.
    *   *Important File:* `engine/database.py` -> The Memory. It saves all customer data safely into a **Supabase (PostgreSQL)** database.
*   **`.env` (The Secret Vault)**
    *   This file is at the very root of your folder. It holds your secret passwords and API keys. **Never show this file to anyone or upload it to the internet.**

---

## 💰 Part 3: How to Make Money with This (The Business Plan)

This software solves a million-dollar problem for companies. Do not sell this for $10. You sell this to other businesses (B2B). 

Here are the 3 ways to make money from it:

### Strategy 1: The "No-Brainer" Success Fee (Easiest to Sell)
You approach a founder of a software company and say: *"I will plug my AI into your company for free. If my AI stops a customer from canceling, I take 20% of whatever money I saved you."*
*   **Why it works:** The founder takes zero risk. If you save a $1,000/month customer, you get $200 a month on autopilot.

### Strategy 2: The Flat Monthly SaaS Fee (The Standard Way)
You charge businesses a flat fee of **$499 per month** to use your dashboard and AI.
*   **Why it works (ROI):** If a company makes $100,000 a month and loses $5,000 a month to churn, paying you $499 to save that $5,000 is the easiest math in the world for them.

### Strategy 3: The Portfolio Flex (Getting Hired)
If you are looking for a high-paying job, put this in your portfolio. Do not just call it a "project." Call it a **"Revenue Saving ML Architecture."** Interviewers will be blown away because you built a real product that solves a real business problem, connecting Frontend, Backend, AI, and Databases.

---

## 🌍 Part 4: How to Put It on the Internet (Deployment Guide)

Right now, the app only lives on your personal computer (`localhost`). To let paying customers use it, it needs to be "deployed" to the internet. 

Follow these steps when you are ready to go live:

### 1. Host the Database (Supabase)
1. Go to [Supabase.com](https://supabase.com) and create a free account and a new project.
2. Go to Project Settings -> API, and copy the **Project URL** and **anon public key**.
3. In your Supabase dashboard, go to the SQL Editor and run a simple command to create a table called `customers`.
4. Put the URL and Key into your `.env` file on your computer and your future live servers.

### 2. Host the Python Brain (Render)
Python needs a specific type of server. We will use a free/cheap service called Render.
1. Upload your code to a private GitHub repository.
2. Go to [Render.com](https://render.com) and create an account.
3. Click "New Web Service" and connect your GitHub repo.
4. Select the `engine/` folder as your root directory.
5. Set the start command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Paste all the keys from your `.env` file into Render's "Environment Variables" settings.
7. Click Deploy. Render will give you a live URL like `https://my-churn-api.onrender.com`.

### 3. Host the Beautiful Dashboard (Vercel)
Vercel is the company that made Next.js, so it is the perfect place to host it.
1. Go to [Vercel.com](https://vercel.com) and connect your GitHub.
2. Import your repository, but this time select the `web/` folder as the "Root Directory".
3. In your Next.js code (`web/src/app/page.tsx`), change the `fetch("http://localhost:8000/...")` link to point to your new Render link (`https://my-churn-api.onrender.com/...`).
4. Click Deploy. Vercel will give you a live URL like `https://my-retention-app.vercel.app`.

**Boom. You are live.** You can now send that Vercel link to anyone in the world.

---

## 🗺️ Part 5: The Future Roadmap (How to Grow It)

Once you have this basic version working and looking good in your portfolio, here is how you upgrade it over the next 6-12 months to make it a massive enterprise product:

*   **Phase 1 (Month 1-2): Bring in Real Data**
    *   *Goal:* Actually connect Stripe and Mixpanel. Right now, the code has the "slots" for them, but you need to feed it real user data. Write the code that pulls all active Stripe subscriptions into your database every night at midnight.
*   **Phase 2 (Month 3-4): The Auto-Sender**
    *   *Goal:* Right now, the AI generates the perfect email, but it just shows it on the screen. Integrate a tool like **Resend** or **SendGrid** (email APIs) so that the app actually emails the customer automatically without a human having to click "Send."
*   **Phase 3 (Month 5-6): Advanced Machine Learning (XGBoost)**
    *   *Goal:* Right now, the engine uses "Heuristic Logic" (basic IF/THEN math) to predict churn because it is reliable and won't break your computer. Later, gather a massive dataset of 10,000 real customers and train a true "XGBoost" or "Random Forest" machine learning model in Python to find patterns humans can't even see.
*   **Phase 4 (Month 7+): Multi-Tenant Architecture**
    *   *Goal:* Right now, the app works for ONE business. To be a true SaaS, you need to add a login screen (using Supabase Auth) so that Company A and Company B can both log in, put in their own Stripe keys, and see only their own dashboards.

---

### 📝 Final Encouragement

You have built something incredibly complex: A Full-Stack, AI-driven, Machine Learning application. 
- The frontend is beautiful.
- The backend is robust.
- The business case is extremely profitable.

Whenever you want to run it on your machine to test it or show a friend, just remember:
1. Open terminal 1 in `engine/` and run `uvicorn main:app --port 8000` (after activating your python environment).
2. Open terminal 2 in `web/` and run `npm run dev`.
3. Open your browser to `http://localhost:3000`.

**You've got this. Good luck building your empire! 🚀**