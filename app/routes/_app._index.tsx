import { useState, useCallback } from "react";
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
  Tabs,
  Grid,
  TextField,
  Checkbox,
  Select,
  RangeSlider,
  ChoiceList,
  Modal,
  FormLayout,
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
    { id: 'whatsapp', name: 'WhatsApp', detail: '+1 (555) 123-4567', prefilledMessage: 'Hello!', icon: '💬', active: true, type: 'whatsapp', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#25D366", textColor: "#ffffff" } },
    { id: 'messenger', name: 'Facebook Messenger', detail: 'm.me/yourbrand', icon: '💬', active: true, type: 'messenger', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#0084ff", textColor: "#ffffff" } },
    { id: 'instagram', name: 'Instagram', detail: 'Not configured', icon: '📸', active: false, type: 'instagram', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#E1306C", textColor: "#ffffff" } },
    { id: 'custom1', name: 'Custom Link', customName: 'Help Center', detail: 'https://example.com/help', icon: '🔗', active: true, type: 'custom', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#000000", textColor: "#ffffff" } },
  ]);

  const addCustomLink = () => {
    setChannels([...channels, { id: `custom${Date.now()}`, name: 'Custom Link', customName: 'New Link', detail: 'https://', icon: '🔗', active: true, type: 'custom', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#000000", textColor: "#ffffff" } }]);
  };

  const removeCustomLink = (id: string) => {
    setChannels(channels.filter(c => c.id !== id));
  };

  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  
  const updateChannelField = (id: string, field: string, value: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const editingChannel = channels.find(c => c.id === editingChannelId);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTabIndex(selectedTabIndex),
    [],
  );

  const tabs = [
    { id: 'quick-setup', content: 'Quick Setup', accessibilityLabel: 'Quick Setup', panelID: 'quick-setup-panel' },
    { id: 'appearance', content: 'Appearance', accessibilityLabel: 'Appearance', panelID: 'appearance-panel' },
    { id: 'position-size', content: 'Position & Size', accessibilityLabel: 'Position & Size', panelID: 'position-size-panel' },
    { id: 'advanced-settings', content: 'Advanced Settings', accessibilityLabel: 'Advanced Settings', panelID: 'advanced-settings-panel' },
  ];

  const updateChannelAppearance = (id: string, key: string, value: any) => {
    setChannels(channels.map(c => c.id === id ? { ...c, appearance: { ...c.appearance, [key]: value } } : c));
  };

  const [selectedAppearanceChannelId, setSelectedAppearanceChannelId] = useState('whatsapp');
  
  const selectedChannel = channels.find(c => c.id === selectedAppearanceChannelId) || channels[0];
  const appearance = selectedChannel.appearance;
  
  const [layoutStyle, setLayoutStyle] = useState("stacked");
  const [buttonSize, setButtonSize] = useState("medium");
  const [horizontalPos, setHorizontalPos] = useState("right");
  const [verticalPos, setVerticalPos] = useState("bottom");
  const [rightOffset, setRightOffset] = useState(20);
  const [bottomOffset, setBottomOffset] = useState(20);
  
  const [visibility, setVisibility] = useState("always");
  const [displayDelay, setDisplayDelay] = useState("0");
  const [pageVisibilityRule, setPageVisibilityRule] = useState("all");
  const [targetPages, setTargetPages] = useState<string[]>([]);

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
              <Card padding="0">
                <Tabs tabs={tabs} selected={selectedTabIndex} onSelect={handleTabChange} fitted />
              </Card>

              {selectedTabIndex === 0 && (
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
                          <Text as="p" fontWeight="bold">
                            {channel.type === 'custom' && channel.customName ? `Custom Link (${channel.customName})` : channel.name}
                          </Text>
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
                          <Button variant="plain" disabled={!channel.active} onClick={() => setEditingChannelId(channel.id)}>Edit</Button>
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
              </BlockStack>
              )}

              {selectedTabIndex === 1 && (
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">Appearance</Text>
                    <Text as="p" tone="subdued">Choose an icon, customize colors, and adjust the button style.</Text>

                    <Text as="h3" variant="headingSm">Select Channel</Text>
                    <Select
                      label="Channel to Customize"
                      labelHidden
                      options={channels.map(c => ({ label: c.name, value: c.id }))}
                      value={selectedAppearanceChannelId}
                      onChange={setSelectedAppearanceChannelId}
                    />

                    <Text as="h3" variant="headingSm">Icon Dimensions</Text>
                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                          label="Icon Width (px)"
                          type="number"
                          value={appearance.iconWidth}
                          onChange={(v) => updateChannelAppearance(selectedAppearanceChannelId, 'iconWidth', v)}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                          label="Icon Height (px)"
                          type="number"
                          value={appearance.iconHeight}
                          onChange={(v) => updateChannelAppearance(selectedAppearanceChannelId, 'iconHeight', v)}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                    </Grid>

                    <Text as="h3" variant="headingSm">Colors</Text>
                    <Checkbox
                      label="Transparent Background"
                      checked={appearance.transparentBg}
                      onChange={(v) => updateChannelAppearance(selectedAppearanceChannelId, 'transparentBg', v)}
                    />

                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                          label="Background Color"
                          value={appearance.bgColor}
                          onChange={(v) => updateChannelAppearance(selectedAppearanceChannelId, 'bgColor', v)}
                          autoComplete="off"
                          prefix={<div style={{ width: 20, height: 20, backgroundColor: appearance.transparentBg ? 'transparent' : appearance.bgColor, borderRadius: '100%', border: '1px solid #ccc' }} />}
                        />
                      </Grid.Cell>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                          label="Text/Icon Color"
                          value={appearance.textColor}
                          onChange={(v) => updateChannelAppearance(selectedAppearanceChannelId, 'textColor', v)}
                          autoComplete="off"
                          prefix={<div style={{ width: 20, height: 20, backgroundColor: appearance.textColor, borderRadius: '100%', border: '1px solid #ccc' }} />}
                        />
                      </Grid.Cell>
                    </Grid>
                  </BlockStack>
                </Card>
              )}

              {selectedTabIndex === 2 && (
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">Position & Size</Text>
                    <Text as="p" tone="subdued">Control where the button appears and how large it is.</Text>

                    <Select
                      label="Layout Style"
                      options={[{ label: 'Stacked Icons', value: 'stacked' }, { label: 'Expandable Menu', value: 'expandable' }]}
                      value={layoutStyle}
                      onChange={setLayoutStyle}
                      helpText="Choose how multiple channels are displayed on the website."
                    />

                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Select
                          label="Button Size"
                          options={[{ label: 'Small', value: 'small' }, { label: 'Medium', value: 'medium' }, { label: 'Large', value: 'large' }]}
                          value={buttonSize}
                          onChange={setButtonSize}
                        />
                      </Grid.Cell>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Select
                          label="Horizontal Position"
                          options={[{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }]}
                          value={horizontalPos}
                          onChange={setHorizontalPos}
                        />
                      </Grid.Cell>
                    </Grid>

                    <Select
                      label="Vertical Position"
                      options={[{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }]}
                      value={verticalPos}
                      onChange={setVerticalPos}
                    />

                    <RangeSlider
                      label="Right/Left Offset (px)"
                      value={rightOffset as number}
                      onChange={(v) => setRightOffset(v as number)}
                      output
                      min={0}
                      max={100}
                      suffix={<Text as="span" variant="bodyMd">{rightOffset}px</Text>}
                    />

                    <RangeSlider
                      label="Bottom/Top Offset (px)"
                      value={bottomOffset as number}
                      onChange={(v) => setBottomOffset(v as number)}
                      output
                      min={0}
                      max={100}
                      suffix={<Text as="span" variant="bodyMd">{bottomOffset}px</Text>}
                    />

                  </BlockStack>
                </Card>
              )}

              {selectedTabIndex === 3 && (
                <Card>
                  <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">Advanced Settings</Text>
                    <Text as="p" tone="subdued">Control display delays and page-specific visibility rules.</Text>

                    <Grid>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Select
                          label="Device Visibility"
                          options={[
                            { label: 'Always visible', value: 'always' },
                            { label: 'Desktop only', value: 'desktop_only' },
                            { label: 'Mobile only', value: 'mobile_only' }
                          ]}
                          value={visibility}
                          onChange={setVisibility}
                        />
                      </Grid.Cell>
                      <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <TextField
                          label="Display Delay (seconds)"
                          type="number"
                          value={displayDelay}
                          onChange={setDisplayDelay}
                          autoComplete="off"
                        />
                      </Grid.Cell>
                    </Grid>

                    <Select
                      label="Page Visibility Rules"
                      options={[
                        { label: 'Show on all pages', value: 'all' },
                        { label: 'Show only on specific pages', value: 'include' },
                        { label: 'Hide on specific pages', value: 'exclude' }
                      ]}
                      value={pageVisibilityRule}
                      onChange={setPageVisibilityRule}
                    />

                    {pageVisibilityRule !== 'all' && (
                      <BlockStack gap="300">
                        <Text as="h3" variant="headingSm">Select Pages</Text>
                        <Grid>
                          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <ChoiceList
                              title="Standard Pages"
                              choices={[
                                { label: 'Home Page', value: '/' },
                                { label: 'Products', value: '/products' },
                                { label: 'Collections', value: '/collections' },
                                { label: 'Cart', value: '/cart' },
                                { label: 'Blogs', value: '/blogs' },
                              ]}
                              selected={targetPages}
                              onChange={setTargetPages}
                              allowMultiple
                            />
                          </Grid.Cell>
                        </Grid>
                      </BlockStack>
                    )}
                  </BlockStack>
                </Card>
              )}

              <Box paddingBlockStart="400">
                <button
                  onClick={() => { }}
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

      {editingChannel && (
        <Modal
          open={!!editingChannelId}
          onClose={() => setEditingChannelId(null)}
          title={`Edit ${editingChannel.type === 'custom' && editingChannel.customName ? `Custom Link (${editingChannel.customName})` : editingChannel.name}`}
          primaryAction={{
            content: 'Done',
            onAction: () => setEditingChannelId(null),
          }}
        >
          <Modal.Section>
            <FormLayout>
              {editingChannel.type === 'whatsapp' && (
                <>
                  <TextField
                    label="WhatsApp Number"
                    value={editingChannel.detail}
                    onChange={(v) => {
                      const cleanNumber = v.replace(/\D/g, "");
                      updateChannelField(editingChannel.id, 'detail', cleanNumber);
                    }}
                    autoComplete="off"
                    placeholder="9812345678"
                    helpText="Select your country from the dropdown to change country code. Enter phone number without country code."
                    connectedLeft={
                      <Popover
                        active={countryPopoverActive}
                        activator={
                          <Button onClick={() => setCountryPopoverActive(!countryPopoverActive)} disclosure>
                            {/* @ts-ignore */}
                            <InlineStack gap="150" blockAlign="center">
                              <span className={`fi fi-${(editingChannel.selectedCountryIso || 'IN').toLowerCase()}`} style={{ fontSize: '18px', width: '24px', borderRadius: '2px' }}></span>
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                +{countryDataMap[editingChannel.selectedCountryIso || 'IN']?.countryCallingCode || "91"}
                              </Text>
                            </InlineStack>
                          </Button>
                        }
                        onClose={() => setCountryPopoverActive(false)}
                        autofocusTarget="none"
                      >
                        <Popover.Pane>
                          <Scrollable style={{ height: '300px' }}>
                            <ActionList
                              actionRole="menuitem"
                              items={countryData.map((country: any) => ({
                                content: `${country.countryNameEn} +${country.countryCallingCode}`,
                                // @ts-ignore
                                prefix: <span className={`fi fi-${country.countryCode.toLowerCase()}`} style={{ fontSize: '16px' }}></span>,
                                onAction: () => {
                                  updateChannelField(editingChannel.id, 'selectedCountryIso', country.countryCode);
                                  setCountryPopoverActive(false);
                                },
                              }))}
                            />
                          </Scrollable>
                        </Popover.Pane>
                      </Popover>
                    }
                  />
                  <TextField
                    label="Pre-filled Message"
                    value={editingChannel.prefilledMessage || ''}
                    onChange={(v) => updateChannelField(editingChannel.id, 'prefilledMessage', v)}
                    autoComplete="off"
                    multiline={3}
                    helpText="Message that will be pre-filled when the user opens the chat."
                  />
                </>
              )}

              {editingChannel.type === 'messenger' && (
                <TextField
                  label="Facebook Page ID or m.me link"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Example: m.me/yourbrand"
                />
              )}

              {editingChannel.type === 'instagram' && (
                <TextField
                  label="Instagram Username or ig.me link"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Example: ig.me/m/yourbrand"
                />
              )}

              {editingChannel.type === 'custom' && (
                <>
                  <TextField
                    label="Name (for your reference only)"
                    value={editingChannel.customName || ''}
                    onChange={(v) => updateChannelField(editingChannel.id, 'customName', v)}
                    autoComplete="off"
                    helpText="This will show in the dashboard configuration as Custom Link (Name)."
                  />
                  <TextField
                    label="URL"
                    value={editingChannel.detail}
                    onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                    autoComplete="off"
                    helpText="Enter the full URL, e.g., https://example.com"
                  />
                  <Select
                    label="Icon"
                    options={[
                      { label: '🔗 Link', value: '🔗' },
                      { label: '📞 Phone', value: '📞' },
                      { label: '📧 Email', value: '📧' },
                      { label: '📍 Location', value: '📍' },
                      { label: '🛍️ Shop', value: '🛍️' },
                      { label: '❓ Help', value: '❓' },
                      { label: '💬 Chat', value: '💬' }
                    ]}
                    value={editingChannel.icon || '🔗'}
                    onChange={(v) => updateChannelField(editingChannel.id, 'icon', v)}
                  />
                </>
              )}
            </FormLayout>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
