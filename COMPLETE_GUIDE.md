# 📘 Contact Float: Complete Project Guide

This guide explains the entire project from start to finish in plain English. You can use this document to explain how the app was built, how it works, and how to maintain it to other people (even non-developers).

---

## 1️⃣ How the App Was Created & Commands Used

We built this app using the official **Shopify CLI** (Command Line Interface), which provides the modern standard for building Shopify apps. 

Here are the commands we used to reach our current state:

1. **`npm init @shopify/app@latest`**: This command downloaded the basic Shopify template. We chose the **React (React Router)** framework.
2. **`npm run dev`**: This is the command we use every time we want to start working on the app. It creates a secure tunnel so Shopify can talk to your local computer.
3. **`npx prisma db push`**: After we told the database that we needed a table for WhatsApp settings, this command actually created that table in the local database.
4. **`npm run shopify app generate extension`**: We used this command to generate the "Theme App Extension" (the code that lives on the merchant's live website).

---

## 2️⃣ What Each File Does

Here is a breakdown of the most important files in the project:

*   **`prisma/schema.prisma`**: The blueprint of your database. It defines the tables and columns. We added a `WhatsAppConfig` model here to define exactly what settings (like phone number, colors, offset) we want to save.
*   **`prisma/dev.sqlite`**: The actual database file! Because we are in development, all saved settings live in this tiny local file.
*   **`app/routes/_app._index.tsx`**: This is the **Dashboard Page** the merchant sees inside their Shopify admin. It contains the Welcome screen and quick setup links.
*   **`app/routes/_app.whatsapp.tsx`**: This is the **Configuration Page**. It contains the form they fill out to choose their WhatsApp button settings (like phone number and colors).
*   **`app/routes/api.whatsapp.ts`**: This is our **API Endpoint**. Think of it as a waiter in a restaurant. When the live website asks "What are the WhatsApp settings for this store?", this file goes to the database, grabs the settings, and hands them back to the website.
*   **`shopify.app.toml`**: The main configuration file. This tells Shopify our app's name, its permissions, and sets up an **App Proxy** (which creates a safe bridge between the live website and our `api.whatsapp.ts` file).
*   **`extensions/contact-float-theme/blocks/whatsapp_float.liquid`**: This is the "App Embed Block". It allows the merchant to turn the floating button ON or OFF in their Theme Editor without coding.
*   **`extensions/contact-float-theme/assets/whatsapp-float.js`**: This is the script injected into the live website. It asks our API for the settings and actually draws the green floating button on the screen.

---

## 3️⃣ Packages & Tools Used

*   **`react-router`**: The core framework that runs both the frontend (the user interface) and backend (saving to the database).
*   **`@shopify/polaris`**: Shopify's official design system. It provides all the neat sliders, dropdowns, and buttons in our app dashboard so it looks identical to Shopify's own interface.
*   **`prisma`**: The "ORM" (Object-Relational Mapper). Instead of writing complex SQL queries to save data, Prisma lets us save data using simple Javascript commands like `prisma.whatsAppConfig.upsert()`.
*   **`react-phone-number-input` & `flag-icons`**: Used specifically on our settings page to provide that nice phone number field with country flags.

---

## 4️⃣ How Data Flows (In Plain English)

Here is the exact journey of a merchant's data from the moment they click "Save" to the moment the button appears on their website:

**Step 1: Saving the Form**
When the merchant fills out the form on the configuration page (`_app.whatsapp.tsx`) and clicks "Save Configuration", the app bundles all those preferences (colors, number, etc.) and sends them to the **Action function** at the top of that exact same file.

**Step 2: Storing in the Database**
The Action function takes that data and uses **Prisma** to save it securely into the `dev.sqlite` database. It attaches the settings to the merchant's unique `shop` name (like `mystore.myshopify.com`) so we know exactly who the settings belong to.

**Step 3: Recalling the Data on the Dashboard**
When the merchant reloads the dashboard page, a **Loader function** asks the database for their saved settings and fills out the form automatically so they don't have to start from scratch.

**Step 4: Displaying on the Live Website (The API)**
When a shopper visits the live website, the `whatsapp-float.js` script runs. It sends a request to Shopify asking for the settings. Shopify forwards this request securely (using the App Proxy) to our `api.whatsapp.ts` file. 
Our API grabs the settings from the database and returns them. The JavaScript then uses those settings to draw the button with the correct colors, position, and phone number!

---

## 5️⃣ How to Work on This Project on a Different Device

If you get a new computer or want to hire a developer to help you, here is how they can continue working on the project:

1.  **Use Git:** First, you must upload this folder to GitHub. 
2.  **Download:** On the new computer, download the code from GitHub (`git clone <url>`).
3.  **Install:** Open a terminal in the folder and run `npm install` to download all the packages.
4.  **Database Sync:** Run `npx prisma db push` to generate a fresh local database.
5.  **Start:** Run `npm run dev`. Shopify will ask you to log in, and it will reconnect the code to your Shopify Partner account!

---

## 6️⃣ Next Steps: How to Publish the App

Right now, your app only lives on your computer. To release it to the world:

1.  **Hosting:** You need to rent a server on the internet (using a service like Heroku, Render, Vercel, or AWS). You will upload this code to that server.
2.  **Database:** You will create a live production database (like PostgreSQL) on the internet instead of the local SQLite file.
3.  **Deploy Configuration:** Run the command `npm run deploy`. This pushes your Theme Extension code permanently to Shopify's servers.
4.  **Update URLs:** In your Shopify Partner Dashboard, you will replace your development URLs with your new live server URL (e.g., `https://contact-float-app.com`).
5.  **Submit for Review:** If you want to sell it in the Shopify App Store, you will fill out a listing page in the Partner Dashboard and submit it for Shopify's team to review!

---

## 7️⃣ How to Check Your Users' Data

**During Development:**
Open a terminal in your project folder and run:
`npx prisma studio`
This opens a web page where you can visually look at your database. Click on `WhatsAppConfig` or `Session` to see every store's URL and their saved preferences.

**After Publishing (Production):**
1.  **Installs & Revenue:** You will log into your **Shopify Partner Dashboard**, click **Apps**, and check the **Insights** tab to see exactly how many people installed or uninstalled the app.
2.  **User Settings:** To see the actual database records in production, you will use your hosting provider's database viewer.
