import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This app only stores shop-level WhatsApp button configuration and
  // session data — no customer-specific personal data — so there is
  // nothing to return here.

  return new Response();
};
