import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { loader } from "../app/routes/api.whatsapp";
import prisma from "../app/db.server";

const TEST_SHOP = "vitest-test-shop.myshopify.com";

describe("API Proxy Endpoint Integration Test", () => {
  beforeAll(async () => {
    // Setup test data in the local SQLite database
    await prisma.widgetConfig.upsert({
      where: { shop: TEST_SHOP },
      create: {
        shop: TEST_SHOP,
        layoutStyle: "expandable",
        horizontalPos: "right",
        verticalPos: "bottom",
        channels: JSON.stringify([{ type: "whatsapp", value: "123", active: true }]),
        targetPages: JSON.stringify(["/products"]),
        pageVisibilityRule: "hide_on",
        displayDelay: "5"
      },
      update: {
        channels: JSON.stringify([{ type: "whatsapp", value: "123", active: true }]),
      }
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.widgetConfig.deleteMany({
      where: { shop: TEST_SHOP }
    });
  });

  it("should return 400 when shop is missing", async () => {
    const request = new Request("http://localhost/api/whatsapp");
    const response = await loader({ request });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Missing shop parameter");
  });

  it("should return the correctly parsed widget configuration for a valid shop", async () => {
    const request = new Request(`http://localhost/api/whatsapp?shop=${TEST_SHOP}`);
    const response = await loader({ request });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Core settings
    expect(data.shop).toBe(TEST_SHOP);
    expect(data.horizontalPos).toBe("right");
    expect(data.layoutStyle).toBe("expandable");
    
    // Verify JSON parsing worked correctly for channels string
    expect(Array.isArray(data.channels)).toBe(true);
    expect(data.channels[0].type).toBe("whatsapp");
    expect(data.channels[0].active).toBe(true);

    // Advanced settings
    expect(data.pageVisibilityRule).toBe("hide_on");
    expect(data.displayDelay).toBe("5");
  });
});
