export default function PrivacyPolicy() {
  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: 1.6,
        color: "#202223",
      }}
    >
      <h1>Privacy Policy — ContactFloat</h1>
      <p>
        <em>Last updated: {new Date().toISOString().slice(0, 10)}</em>
      </p>

      <p>
        ContactFloat (&quot;the App&quot;) adds a configurable WhatsApp chat
        button to a merchant&apos;s storefront. This policy explains what
        data the App collects, why, and how it is handled.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Shop-level configuration</strong> you enter in the App
          (WhatsApp number, pre-filled message, button colors, size,
          position, and page-visibility rules). This is store configuration,
          not personal data about your customers.
        </li>
        <li>
          <strong>Shopify session data</strong> (access tokens and related
          OAuth session information) required to authenticate API requests
          to your store, per Shopify&apos;s standard app authentication
          flow.
        </li>
        <li>
          <strong>Store page titles/handles</strong>, read via the Shopify
          Admin API only to populate the page-visibility picker in the App
          — this is not stored beyond the request needed to render that
          list.
        </li>
      </ul>

      <h2>What we do not collect</h2>
      <p>
        The App does not collect, store, or process any personal data
        about your store&apos;s customers (names, emails, order details,
        browsing behavior, etc.). The floating WhatsApp button simply
        opens a chat link in the visitor&apos;s own WhatsApp client — no
        message content passes through our servers.
      </p>

      <h2>Data retention and deletion</h2>
      <p>
        Shop configuration and session data are deleted automatically when
        the App is uninstalled, and again in response to Shopify&apos;s
        mandatory <code>shop/redact</code> webhook.
      </p>

      <h2>Mandatory GDPR compliance webhooks</h2>
      <p>
        In compliance with Shopify&apos;s requirements, the App implements
        the <code>customers/data_request</code>,{" "}
        <code>customers/redact</code>, and <code>shop/redact</code>{" "}
        webhooks. Since the App does not store customer-specific personal
        data, the customer-related webhooks acknowledge the request with no
        data to return or erase.
      </p>

      <h2>Third parties</h2>
      <p>
        The App does not sell or share any data with third parties. Data is
        stored on infrastructure operated by the App&apos;s hosting
        provider and is only accessed to operate the App&apos;s core
        functionality.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data can be sent to{" "}
        <a href="mailto:support@infinityplus1.in">support@infinityplus1.in</a>
        .
      </p>
    </div>
  );
}
