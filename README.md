# 💬 Contact Float - WhatsApp Button for Shopify

Contact Float is a modern, lightweight Shopify App that allows merchants to easily add a floating WhatsApp chat button to their storefront. It is built using the latest Shopify technologies including Shopify CLI, React Router, Polaris, Prisma, and Theme App Extensions.

## 🚀 Features
* **Customizable Floating Button:** Merchants can adjust colors, position, sizes, and animations directly from the Shopify Admin.
* **Theme App Extension:** Injects cleanly into any Online Store 2.0 theme without editing Liquid files.
* **App Proxy API:** Securely fetches merchant configurations on the storefront without exposing API keys.
* **Modern Dashboard:** Built using Shopify's Polaris design system for a native admin feel.

## 📚 Documentation
We have created extensive, plain-English documentation for this project. Please refer to the following guides:

* [**COMPLETE_GUIDE.md**](./COMPLETE_GUIDE.md): Start here! This explains exactly how the app was built, how data flows from the dashboard to the storefront, and how to deploy the app to production.
* [**PROJECT_DETAILS.md**](./PROJECT_DETAILS.md): A detailed log of our development process, design decisions, database schemas, and routing architecture.

## 🛠️ Tech Stack
* **Framework**: React (React Router)
* **UI Library**: Shopify Polaris
* **Database**: SQLite (Development) via Prisma ORM
* **Extensions**: Shopify Theme App Extension (App Embed Block)

## 💻 Local Development
To run this project locally, ensure you have the Shopify CLI installed.

1. Install dependencies:
   ```shell
   npm install
   ```
2. Push the Prisma schema to your local database:
   ```shell
   npx prisma db push
   ```
3. Start the local development server:
   ```shell
   npm run dev
   ```

*Created by suprit*
