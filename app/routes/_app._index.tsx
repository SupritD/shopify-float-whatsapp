import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import * as fs from "fs";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  Badge,
  Box,
  Divider,
} from "@shopify/polaris";
import { ExternalIcon, ChatIcon, PaintBrushRoundIcon, MobileIcon } from "@shopify/polaris-icons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  let isAppEmbedEnabled = false;

  try {
    const response = await admin.graphql(
      `#graphql
      query {
        themes(roles: [MAIN], first: 1) {
          nodes {
            id
            files(filenames: ["config/settings_data.json"], first: 1) {
              nodes {
                body {
                  ... on OnlineStoreThemeFileBodyText {
                    content
                  }
                }
              }
            }
          }
        }
      }`
    );
    const { data } = await response.json();

    if (data?.themes?.nodes?.length > 0) {
      const mainTheme = data.themes.nodes[0];
      const files = mainTheme.files?.nodes || [];
      if (files.length > 0 && files[0].body?.content) {
        const rawJson = files[0].body.content;
        const strippedJson = rawJson.replace(/\/\*[\s\S]*?\*\//g, '').trim();
        const settingsData = JSON.parse(strippedJson);

        const blocks = settingsData?.current?.blocks || {};
        for (const key in blocks) {
          const block = blocks[key];
          if (block.type && block.type.includes('whatsapp_float')) {
            if (block.disabled !== true) {
              isAppEmbedEnabled = true;
              break;
            }
          }
        }
      }
    }
  } catch (error) {
    fs.writeFileSync('debug_error.txt', String(error));
    console.error("Error checking app embed status:", error);
  }

  const config = await prisma.widgetConfig.findUnique({
    where: { shop: session.shop }
  });

  let activeChannelsCount = 0;
  if (config && config.channels) {
    try {
      const parsed = JSON.parse(config.channels);
      activeChannelsCount = parsed.filter((c: any) => c.active).length;
    } catch (e) {}
  }

  return {
    isAppEmbedEnabled,
    shop: session.shop,
    apiKey: process.env.SHOPIFY_API_KEY || "",
    activeChannelsCount,
    hasConfig: !!config
  };
};

export default function Dashboard() {
  const { isAppEmbedEnabled, shop, apiKey, activeChannelsCount, hasConfig } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Page>
      <BlockStack gap="500">
        {!isAppEmbedEnabled && (
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">Enable Widget in Theme</Text>
                <Text as="p" tone="subdued">
                  To make the widget visible on your store, enable the app embed in your theme settings.
                </Text>
              </BlockStack>
              <Button 
                variant="primary"
                url={`https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/whatsapp_float`} 
                target="_blank" 
                icon={ExternalIcon}
              >
                Enable App Embed
              </Button>
            </InlineStack>
          </Card>
        )}

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text variant="headingLg" as="h1">Welcome</Text>
                    <Text tone="subdued" as="p">
                      {isAppEmbedEnabled 
                        ? "Your Multi-Channel widget is live on your store." 
                        : "Configure your widget before enabling it on your store."}
                    </Text>
                  </BlockStack>
                  <Badge tone={isAppEmbedEnabled ? "success" : "critical"}>
                    {isAppEmbedEnabled ? "Active" : "Inactive"}
                  </Badge>
                </InlineStack>

                <Box paddingBlockStart="200" paddingBlockEnd="200">
                  <Divider />
                </Box>

                <BlockStack gap="400">
                  <InlineStack align="start" blockAlign="center" gap="400">
                    <div style={{ padding: '8px', backgroundColor: '#f4f6f8', borderRadius: '8px' }}>
                      <ChatIcon width="24" fill="#5c5f62" />
                    </div>
                    <BlockStack gap="0">
                      <Text variant="headingSm" as="h3">Channels Configured</Text>
                      <Text tone="success" as="span">{activeChannelsCount} Active Channels</Text>
                    </BlockStack>
                  </InlineStack>
                  
                  <Divider />

                  <InlineStack align="start" blockAlign="center" gap="400">
                    <div style={{ padding: '8px', backgroundColor: '#f4f6f8', borderRadius: '8px' }}>
                      <PaintBrushRoundIcon width="24" fill="#5c5f62" />
                    </div>
                    <BlockStack gap="0">
                      <Text variant="headingSm" as="h3">Appearance & Colors</Text>
                      <Text tone={hasConfig ? "success" : "subdued"} as="span">
                        {hasConfig ? "Configured" : "Not yet configured"}
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <Divider />

                  <InlineStack align="start" blockAlign="center" gap="400">
                    <div style={{ padding: '8px', backgroundColor: '#f4f6f8', borderRadius: '8px' }}>
                      <MobileIcon width="24" fill="#5c5f62" />
                    </div>
                    <BlockStack gap="0">
                      <Text variant="headingSm" as="h3">Device Visibility</Text>
                      <Text tone={hasConfig ? "success" : "subdued"} as="span">
                        {hasConfig ? "Configured" : "Not yet configured"}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>

                <Box paddingBlockStart="400">
                  <Button variant="primary" onClick={() => navigate('/settings')} size="large">
                    Configure Widget
                  </Button>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Quick Setup</Text>
                  <Text as="p" tone="subdued">
                    Add your channels, customize appearance, and position your widget — all in one powerful editor.
                  </Text>
                  <InlineStack>
                    <Button variant="plain" onClick={() => navigate('/settings')}>Configure now</Button>
                  </InlineStack>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Need Help?</Text>
                  <Text as="p" tone="subdued">
                    Having trouble with setup or configuration? Our support team is ready to help.
                  </Text>
                  <InlineStack>
                    <Button variant="plain" url="mailto:support@infinityplus1.in" target="_blank">
                      Email support
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
