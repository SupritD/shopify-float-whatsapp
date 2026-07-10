# Contact Float Shopify App

Welcome to the Contact Float Shopify App repository! This project is a Shopify embedded application built with React Router, Vite, and Prisma. It allows merchants to add a floating contact button (like WhatsApp) to their storefront.

---

## 🛠️ Project Creation Process

This project was initialized using the official Shopify CLI for building apps.
The standard process to create a similar project is:

1. Ensure you have Node.js installed (v20+ recommended).
2. Run the Shopify App CLI command:
   ```bash
   npm init @shopify/app@latest
   ```
3. Follow the prompts to select your project name, the **React (React Router)** template, and other configuration options.

---

## 🚀 How to Run This Project (Development)

To run the project locally for development, follow these steps:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the Database:**
   This project uses Prisma for the database (SQLite by default). Ensure you run the setup to generate the client and push the schema:

   ```bash
   npm run setup
   ```

   _(This runs `prisma generate` and `prisma migrate deploy`)_

3. **Start the Development Server:**
   Start the app using the Shopify CLI. This will create a local tunnel (like Cloudflare) and prompt you to install the app on your development store:
   ```bash
   npm run dev
   ```
   Press `p` in the terminal to open the app preview in your browser.

---

## 🏗️ How to Build This Project

When you are ready to prepare the app for production, you need to build the assets.

Run the build script:

```bash
npm run build
```

This triggers the `react-router build` command, compiling your Vite/React application and server-side code into the `./build` directory.

To test the production build locally, you can run:

```bash
npm run start
```

---

## 🌍 How to Publish This App in the Shopify Store

Publishing a Shopify app involves hosting your web server and deploying your configuration/extensions to Shopify.

1. **Host Your Application:**
   Deploy your codebase (the web app) to a hosting provider that supports Node.js and your chosen database (e.g., Heroku, Render, Fly.io, Vercel, or AWS).
   - Ensure you set all the required Environment Variables (`SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES`, `SHOPIFY_APP_URL`, `DATABASE_URL`, etc.) on your hosting provider.

2. **Deploy Configuration to Shopify:**
   Once your app is hosted, you need to push your app configuration and any extensions (like theme app extensions) to the Shopify Partner Dashboard:

   ```bash
   npm run deploy
   ```

   _This command uploads your extension code and updates the app settings in Shopify._

3. **Update URLs:**
   Go to your Shopify Partner Dashboard > Apps > Your App > Configuration. Make sure your "App URL" and "Allowed redirection URL(s)" point to your production hosted domain, not the local dev tunnel.

4. **Submit for Review (Public Apps) or Install (Custom Apps):**
   - If it's a **Custom App**, generate an install link and install it on the merchant's store.
   - If it's a **Public App**, go to the Distribution tab in the Partner Dashboard, fill out the listing details, and submit it for review by the Shopify App team.

---

## 📦 Packages Used & Component Mapping

Here is a detailed breakdown of the key packages used in this project and what they do:

### Core Framework & Build Tools

- **`react-router` / `@react-router/*`**: The core framework for the application. It handles both frontend routing and backend server logic (loader/action functions). Used primarily in the `app/routes/` directory.
- **`vite`**: The build tool and development server that provides fast HMR (Hot Module Replacement) and optimized production builds.
- **`react` & `react-dom`**: The core UI library for building the components.

### Shopify Integration

- **`@shopify/polaris`**: Shopify's official design system. It is used for all the UI components in the admin dashboard (e.g., Buttons, Cards, Layouts, Forms) to ensure the app looks native to Shopify. Used extensively in `app.whatsapp.tsx` and `app._index.tsx`.
- **`@shopify/polaris-icons`**: Provides all the standard Shopify icons used across the dashboard.
- **`@shopify/app-bridge-react`**: Facilitates communication between the embedded app and the Shopify Admin iframe. Used for navigation, modals, and top bar actions within Shopify.
- **`@shopify/shopify-app-react-router`**: Specialized utilities for integrating Shopify authentication and context within the React Router lifecycle.

### Database & Session Management

- **`prisma` & `@prisma/client`**: The ORM (Object-Relational Mapper) used to interact with the database. Used to query, create, and update merchant configurations (like the WhatsApp float settings).
- **`@shopify/shopify-app-session-storage-prisma`**: Automatically handles storing and retrieving Shopify OAuth sessions and merchant access tokens in the Prisma database. Configured in `app/shopify.server.ts`.

### Specific Feature Components (e.g., WhatsApp Settings)

The application includes specialized components (`app/routes/app.whatsapp.tsx`) to manage the floating button settings. The following packages power these specific features:

- **`react-phone-number-input`**: Used in the form components to provide a robust, formatted input field specifically for the merchant's WhatsApp phone number.
- **`country-codes-list`**: Provides a programmatic list of country codes, likely used to populate dropdowns or validate the country code for the WhatsApp integration.
- **`flag-icons`**: Displays country flags next to the phone number input to improve the user experience when merchants select their country code.

---

## 🏛️ App Architecture Details

### 1. Database Configuration
The application uses Prisma to manage settings. A `WhatsAppConfig` model is defined in `prisma/schema.prisma` which stores merchant-specific settings (like phone number, colors, position, etc.) uniquely keyed by the merchant's `shop` domain (e.g. `example.myshopify.com`).

### 2. Storefront App Proxy
To securely deliver the merchant's configuration to the storefront, the app uses a **Shopify App Proxy**:
- Configured in `shopify.app.toml` under `[app_proxy]`, it maps storefront requests from `/apps/contact-float` directly to our application backend.
- The route `app/routes/api.whatsapp.ts` acts as the backend API endpoint. It extracts the `shop` domain (which Shopify securely injects into the proxy request) and returns the correct settings from the database as JSON.

### 3. Theme App Extension
The physical floating button is rendered on the live storefront using a **Theme App Extension** (`extensions/contact-float-theme`).
- **`whatsapp_float.liquid`**: An App Embed Block that merchants can toggle ON/OFF in their Theme Editor without touching any code.
- **`whatsapp-float.js`**: Fetches the configuration from the App Proxy (`/apps/contact-float`) and dynamically injects the WhatsApp icon, text, and styles directly into the DOM based on the merchant's saved settings. It also evaluates robust **Page Visibility Rules** and **Device Visibility Rules**, reading `window.location.pathname` to ensure the widget only renders exactly when and where the merchant requested (e.g., hiding on the Cart or displaying exclusively on Mobile).
- **`whatsapp-float.css`**: Provides the keyframe animations (pulse, bounce) to make the button interactive and handles media queries for device-specific visibility (e.g. `display: none` on mobile).

### 4. GraphQL Admin API
To provide a premium user experience in the configuration dashboard, the app communicates with the **Shopify GraphQL Admin API**.
- When the configuration page (`_app.whatsapp.tsx`) loads, the Loader function executes a GraphQL query to fetch all the merchant's Custom Pages (e.g., "About Us", "Contact"). 
- These pages are presented dynamically as a checklist in the Advanced Settings, allowing the merchant to easily select specific pages to show or hide the widget on without manually typing URLs.

---

_Created by suprit_
