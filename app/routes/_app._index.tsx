import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import * as fs from "fs";
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
import { ExternalIcon, ChatIcon } from "@shopify/polaris-icons";

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

  return {
    isAppEmbedEnabled,
    shop: session.shop,
    apiKey: process.env.SHOPIFY_API_KEY || ""
  };
};

export default function Index() {
  const { isAppEmbedEnabled, shop, apiKey } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [channels, setChannels] = useState([
    { id: 'whatsapp', name: 'WhatsApp', detail: '+1 (555) 123-4567', icon: '💬', active: true, type: 'whatsapp' },
    { id: 'messenger', name: 'Facebook Messenger', detail: 'm.me/yourbrand', icon: '💬', active: true, type: 'messenger' },
    { id: 'instagram', name: 'Instagram', detail: 'Not configured', icon: '📸', active: false, type: 'instagram' },
    { id: 'custom1', name: 'Custom Link', detail: 'Help Center', icon: '🔗', active: true, type: 'custom' },
  ]);

  const addCustomLink = () => {
    setChannels([...channels, { id: `custom${Date.now()}`, name: 'Custom Link', detail: 'New Link', icon: '🔗', active: true, type: 'custom' }]);
  };

  const removeCustomLink = (id: string) => {
    setChannels(channels.filter(c => c.id !== id));
  };

  return (
    <Page>
      <BlockStack gap="500">
        {/* Top Banner */}
        {!isAppEmbedEnabled && (
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Enable WhatsApp Button in Theme
                </Text>
                <Text as="p" variant="bodyMd">
                  To make the WhatsApp button visible on your store, enable the app embed in your theme settings.
                </Text>
                <Box paddingBlockStart="200">
                  <Button url={`https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${apiKey}/whatsapp_float`} target="_blank" icon={ExternalIcon}>
                    Enable in Theme Editor
                  </Button>
                </Box>
              </BlockStack>
            </InlineStack>
          </Card>
        )}

        <Layout>
          {/* Left Column */}
          <Layout.Section>
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingLg">Welcome</Text>
                    <InlineStack gap="200">
                      <Badge tone="success">Active</Badge>
                      {/* <Badge tone="info">Free Plan</Badge> */}
                    </InlineStack>
                  </InlineStack>

                  <Text as="p" variant="bodyMd" tone="subdued">
                    Your WhatsApp button is live on your store.
                  </Text>

                  <Box paddingBlockStart="400">
                    <BlockStack gap="300">
                      <InlineStack blockAlign="center" gap="300">
                        <Box padding="200" background="bg-surface-secondary" borderRadius="100">
                          <ChatIcon width="20" />
                        </Box>
                        <BlockStack>
                          <Text as="p" variant="bodyMd" fontWeight="semibold">WhatsApp Number</Text>
                          <Text as="p" variant="bodySm" tone="success">Configured</Text>
                        </BlockStack>
                      </InlineStack>

                      <Divider />

                      <InlineStack blockAlign="center" gap="300">
                        <Box padding="200" background="bg-surface-secondary" borderRadius="100">
                          <Text as="span">🎨</Text>
                        </Box>
                        <BlockStack>
                          <Text as="p" variant="bodyMd" fontWeight="semibold">Appearance & Colors</Text>
                          <Text as="p" variant="bodySm" tone="success">Configured</Text>
                        </BlockStack>
                      </InlineStack>

                      <Divider />

                      <InlineStack blockAlign="center" gap="300">
                        <Box padding="200" background="bg-surface-secondary" borderRadius="100">
                          <Text as="span">📱</Text>
                        </Box>
                        <BlockStack>
                          <Text as="p" variant="bodyMd" fontWeight="semibold">Device Visibility</Text>
                          <Text as="p" variant="bodySm" tone="success">Configured</Text>
                        </BlockStack>
                      </InlineStack>
                    </BlockStack>
                  </Box>

                  <InlineStack gap="300">
                    <Button variant="primary" onClick={() => navigate('/whatsapp')}>
                      Configure Button
                    </Button>
                    {/* <Button>Upgrade Plan</Button> */}
                  </InlineStack>
                </BlockStack>
              </Card>

              <InlineStack gap="400" wrap={false}>
                <Card>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">Quick Setup</Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Add your WhatsApp number, customize appearance, and position your button — all in one place.
                    </Text>
                    <InlineStack>
                      <Button variant="plain" onClick={() => navigate('/whatsapp')}>Configure now</Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">Need Help?</Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Having trouble with setup or configuration? Our support team is ready to help.
                    </Text>
                    <InlineStack>
                      <Button variant="plain" url="mailto:info@infinityplus1.in">Email support</Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
              </InlineStack>

              {/* New Contact Channels UI */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">Contact Channels</Text>
                  <Text as="p" tone="subdued">Manage the communication channels available in your widget. Drag to reorder.</Text>
                  
                  <div style={{ border: '1px solid var(--p-color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                    {channels.map((channel, index) => (
                      <div key={channel.id} style={{ 
                        display: 'flex', alignItems: 'center', padding: '16px', 
                        borderBottom: index < channels.length - 1 ? '1px solid var(--p-color-border)' : 'none',
                        backgroundColor: 'white' 
                      }}>
                        <div style={{ marginRight: '16px', fontSize: '24px', opacity: 0.8 }}>
                          {channel.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text as="p" fontWeight="bold">{channel.name}</Text>
                          <Text as="p" tone="subdued">{channel.detail}</Text>
                        </div>
                        <div style={{ marginRight: '16px', alignSelf: 'center', display: 'flex', alignItems: 'center' }}>
                          <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                            <input
                              type="checkbox"
                              checked={channel.active}
                              onChange={(e) => {
                                const newChannels = [...channels];
                                newChannels[index].active = e.target.checked;
                                setChannels(newChannels);
                              }}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: channel.active ? '#008060' : '#ccc',
                              transition: '.4s', borderRadius: '34px'
                            }}>
                              <span style={{
                                position: 'absolute', content: '""', height: '16px', width: '16px',
                                left: channel.active ? '20px' : '4px', bottom: '4px',
                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                              }} />
                            </span>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Button variant="plain" disabled={!channel.active}>Edit</Button>
                          {channel.type === 'custom' && (
                            <Button variant="plain" tone="critical" onClick={() => removeCustomLink(channel.id)}>Remove</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="primary" onClick={addCustomLink} fullWidth>
                    + Add New Channel
                  </Button>
                </BlockStack>
              </Card>
              
              <Box paddingBlockStart="400">
                <button 
                  onClick={() => {}} 
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  Save Configuration
                </button>
              </Box>

            </BlockStack>
          </Layout.Section>

          {/* Right Column */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Preview</Text>

                <Box background="bg-surface-secondary" padding="800" borderRadius="200" minHeight="395px" position="relative" overflowX="hidden" overflowY="hidden">
                  {/* Mock Website Content */}
                  <BlockStack gap="200">
                    <Box background="bg-surface-tertiary" minHeight="12px" width="60%" borderRadius="100" />
                    <Box background="bg-surface-tertiary" minHeight="12px" width="80%" borderRadius="100" />
                    <Box background="bg-surface-tertiary" minHeight="12px" width="50%" borderRadius="100" />
                  </BlockStack>

                  {/* Floating Button Preview */}
                  <Box position="absolute" insetBlockEnd="400" insetInlineEnd="400">
                    <div style={{ backgroundColor: '#25D366', padding: '12px 16px', borderRadius: '50px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                      <div style={{ width: '24px', height: '24px', fill: '#ffffff' }}>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Chat with us</span>
                    </div>
                  </Box>
                </Box>

                <InlineStack align="center">
                  <Button variant="plain" onClick={() => navigate('/whatsapp')}>Customize this button</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
