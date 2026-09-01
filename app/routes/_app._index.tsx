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
  Popover,
  ActionList,
  Scrollable,
  DropZone,
  Thumbnail,
} from "@shopify/polaris";
import { ExternalIcon, ChatIcon } from "@shopify/polaris-icons";
import { customArray } from "country-codes-list";
import 'flag-icons/css/flag-icons.min.css';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const countryData = customArray({
  countryCode: "{countryCode}",
  countryNameEn: "{countryNameEn}",
  countryCallingCode: "{countryCallingCode}",
});

const DEFAULT_ICONS = {
  whatsapp: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>',
  messenger: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.056-3.26-5.963 3.26 6.554-6.962 3.13 3.259 5.887-3.259-6.552 6.962z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  x: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M19.38 16.03a11.16 11.16 0 01-3.66-.62c-.37-.12-.79-.03-1.07.25l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02a11.12 11.12 0 01-.63-3.68C7.62 3.2 6.78 2.37 5.75 2.37H3.34c-1.03 0-1.89.87-1.82 1.9A19.98 19.98 0 0020.15 22.8c1.03.07 1.9-.8 1.9-1.83v-2.42c0-1.02-.83-1.87-1.85-1.87h-.82z"/></svg>',
  email: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>',
  wechat: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M11.136 6.632c0-.113-.01-.225-.03-.334C10.772 3.498 8.01 1.25 4.675 1.25 2.094 1.25 0 3.167 0 5.568c0 1.295.597 2.476 1.572 3.33.153.136.2.35.127.546l-.506 1.348 1.487-.714a.75.75 0 0 1 .632-.016c.45.2.939.317 1.454.331a3.9 3.9 0 0 1-.09-.817c0-2.4 2.1-4.346 4.686-4.346a5.05 5.05 0 0 1 1.776.326ZM4.872 3.926c.433 0 .783.315.783.704 0 .388-.35.703-.783.703-.434 0-.783-.315-.783-.703 0-.389.349-.704.783-.704Zm-2.395 0c.434 0 .784.315.784.704 0 .388-.35.703-.784.703-.433 0-.783-.315-.783-.703 0-.389.35-.704.783-.704ZM16 10.354c0-1.89-1.656-3.424-3.696-3.424-2.04 0-3.695 1.534-3.695 3.424 0 1.89 1.655 3.424 3.695 3.424.436 0 .858-.073 1.254-.207l1.173.563-.399-1.064a3.15 3.15 0 0 0 1.243-2.632c0-.028 0-.056-.002-.085Zm-4.93-1.077c.333 0 .604.249.604.555 0 .307-.271.555-.605.555-.333 0-.604-.248-.604-.555 0-.306.27-.555.604-.555Zm2.468 0c.334 0 .605.249.605.555 0 .307-.271.555-.605.555-.333 0-.604-.248-.604-.555 0-.306.271-.555.604-.555Z"/></svg>'
};

const countryDataMap = countryData.reduce((acc: any, curr: any) => {
  acc[curr.countryCode] = curr;
  return acc;
}, {});

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

function SortableChannelItem({ channel, index, channels, setChannels, setEditingChannelId, removeCustomLink }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: channel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex', alignItems: 'center', padding: '16px',
    borderBottom: index < channels.length - 1 ? '1px solid var(--p-color-border)' : 'none',
    backgroundColor: 'white',
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as any,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: '16px', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/></svg>
      </div>
      <div style={{ marginRight: '16px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
        {channel.icon?.startsWith('<svg') ? (
          <div dangerouslySetInnerHTML={{ __html: channel.icon }} style={{ width: '100%', height: '100%', display: 'flex' }} />
        ) : channel.icon?.startsWith('http') || channel.icon?.startsWith('data:image') ? (
          <img src={channel.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '24px' }}>{channel.icon}</span>
        )}
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
  );
}

export default function Index() {
  const { isAppEmbedEnabled, shop, apiKey } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [channels, setChannels] = useState<any[]>([
    { id: 'whatsapp', name: 'WhatsApp', detail: '9812345678', selectedCountryIso: 'IN', prefilledMessage: 'Hello!', icon: DEFAULT_ICONS.whatsapp, useDefaultIcon: true, active: true, type: 'whatsapp', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#25D366", textColor: "#ffffff" } },
    { id: 'messenger', name: 'Facebook Messenger', detail: 'm.me/yourbrand', icon: DEFAULT_ICONS.messenger, useDefaultIcon: true, active: true, type: 'messenger', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#0084ff", textColor: "#ffffff" } },
    { id: 'instagram', name: 'Instagram', detail: 'Not configured', icon: DEFAULT_ICONS.instagram, useDefaultIcon: true, active: false, type: 'instagram', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#E1306C", textColor: "#ffffff" } },
    { id: 'x', name: 'X (Twitter)', detail: 'twitter.com/yourbrand', icon: DEFAULT_ICONS.x, useDefaultIcon: true, active: false, type: 'x', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#000000", textColor: "#ffffff" } },
    { id: 'youtube', name: 'YouTube', detail: 'youtube.com/@yourbrand', icon: DEFAULT_ICONS.youtube, useDefaultIcon: true, active: false, type: 'youtube', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#FF0000", textColor: "#ffffff" } },
    { id: 'phone', name: 'Phone Call', detail: '+15551234567', icon: DEFAULT_ICONS.phone, useDefaultIcon: true, active: false, type: 'phone', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#34B7F1", textColor: "#ffffff" } },
    { id: 'email', name: 'Email Support', detail: 'support@yourbrand.com', icon: DEFAULT_ICONS.email, useDefaultIcon: true, active: false, type: 'email', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#EA4335", textColor: "#ffffff" } },
    { id: 'wechat', name: 'WeChat', detail: 'your_wechat_id', icon: DEFAULT_ICONS.wechat, useDefaultIcon: true, active: false, type: 'wechat', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#07C160", textColor: "#ffffff" } },
    { id: 'custom1', name: 'Custom Link', customName: 'Help Center', detail: 'https://example.com/help', icon: '🔗', useDefaultIcon: false, active: true, type: 'custom', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#000000", textColor: "#ffffff" } },
  ]);

  const addCustomLink = () => {
    setChannels([...channels, { id: `custom${Date.now()}`, name: 'Custom Link', customName: 'New Link', detail: 'https://', icon: '🔗', useDefaultIcon: false, active: true, type: 'custom', appearance: { iconWidth: "28", iconHeight: "28", transparentBg: false, bgColor: "#000000", textColor: "#ffffff" } }]);
  };

  const removeCustomLink = (id: string) => {
    setChannels(channels.filter(c => c.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChannels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [countryPopoverActive, setCountryPopoverActive] = useState(false);

  const updateChannelField = (id: string, field: string, value: any) => {
    setChannels(channels.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateChannel = (id: string, updates: any) => {
    setChannels(channels.map(c => c.id === id ? { ...c, ...updates } : c));
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
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);

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
                  {/* New Contact Channels UI */}
                  <Card>
                    <BlockStack gap="400">
                      <Text as="h2" variant="headingMd">Contact Channels</Text>
                      <Text as="p" tone="subdued">Manage the communication channels available in your widget. Drag to reorder.</Text>

                      <div style={{ border: '1px solid var(--p-color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                          <SortableContext items={channels} strategy={verticalListSortingStrategy}>
                            {channels.map((channel, index) => (
                              <SortableChannelItem 
                                key={channel.id}
                                channel={channel}
                                index={index}
                                channels={channels}
                                setChannels={setChannels}
                                setEditingChannelId={setEditingChannelId}
                                removeCustomLink={removeCustomLink}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      </div>

                      <Button variant="primary" onClick={addCustomLink} fullWidth>
                        + Add New Channel
                      </Button>
                    </BlockStack>
                  </Card>

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
                      options={[
                        { label: 'Stacked Icons', value: 'stacked' }, 
                        { label: 'Expandable Menu', value: 'expandable' },
                        { label: 'Drawer Menu', value: 'drawer' }
                      ]}
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
                  <div style={{
                    position: 'absolute',
                    [verticalPos]: `${bottomOffset}px`,
                    [horizontalPos]: `${rightOffset}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: horizontalPos === 'right' ? 'flex-end' : 'flex-start',
                    zIndex: 10
                  }}>
                    {layoutStyle === 'drawer' && (
                      <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        padding: '8px 0',
                        minWidth: '220px',
                        marginBottom: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        opacity: isPreviewExpanded ? 1 : 0,
                        transform: isPreviewExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                        pointerEvents: isPreviewExpanded ? 'auto' : 'none',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        transformOrigin: horizontalPos === 'right' ? 'bottom right' : 'bottom left',
                      }}>
                        {channels.filter(c => c.active).map((channel) => (
                          <div key={channel.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <div style={{
                              width: '24px', height: '24px', fill: channel.appearance?.bgColor, color: channel.appearance?.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {channel.icon?.startsWith('<svg') ? (
                                <div dangerouslySetInnerHTML={{ __html: channel.icon }} style={{ width: '100%', height: '100%', display: 'flex' }} />
                              ) : channel.icon?.startsWith('http') || channel.icon?.startsWith('data:image') ? (
                                <img src={channel.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <span style={{ fontSize: '24px' }}>{channel.icon}</span>
                              )}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                              {channel.type === 'custom' && channel.customName ? channel.customName : channel.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {(layoutStyle === 'stacked' || layoutStyle === 'expandable') && channels.filter(c => c.active).map((channel, index, arr) => {
                      const isVisible = layoutStyle === 'stacked' || isPreviewExpanded;
                      return (
                      <div key={channel.id} style={{
                        backgroundColor: channel.appearance?.bgColor || '#000',
                        color: channel.appearance?.textColor || '#fff',
                        width: buttonSize === 'small' ? '40px' : buttonSize === 'large' ? '64px' : '52px',
                        height: buttonSize === 'small' ? '40px' : buttonSize === 'large' ? '64px' : '52px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        opacity: isVisible ? (channel.appearance?.transparentBg ? 0.8 : 1) : 0,
                        pointerEvents: isVisible ? 'auto' : 'none',
                        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.5)',
                        transition: `all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${layoutStyle === 'expandable' ? (arr.length - index) * 0.05 : 0}s`,
                      }}>
                        <div style={{
                          width: `${channel.appearance?.iconWidth || 28}px`,
                          height: `${channel.appearance?.iconHeight || 28}px`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fill: 'currentColor',
                          color: 'currentColor'
                        }}>
                          {channel.icon?.startsWith('<svg') ? (
                            <div dangerouslySetInnerHTML={{ __html: channel.icon }} style={{ width: '100%', height: '100%', display: 'flex' }} />
                          ) : channel.icon?.startsWith('http') || channel.icon?.startsWith('data:image') ? (
                            <img src={channel.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ fontSize: `${channel.appearance?.iconWidth || 28}px` }}>{channel.icon}</span>
                          )}
                        </div>
                      </div>
                    )})}

                    {(layoutStyle === 'expandable' || layoutStyle === 'drawer') && (
                      <div 
                        onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                        style={{
                          backgroundColor: '#000',
                          color: '#fff',
                          width: buttonSize === 'small' ? '40px' : buttonSize === 'large' ? '64px' : '52px',
                          height: buttonSize === 'small' ? '40px' : buttonSize === 'large' ? '64px' : '52px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease',
                          transform: isPreviewExpanded ? 'rotate(135deg)' : 'rotate(0deg)'
                        }}
                      >
                        <div style={{ 
                          width: buttonSize === 'small' ? '24px' : buttonSize === 'large' ? '40px' : '32px', 
                          height: buttonSize === 'small' ? '24px' : buttonSize === 'large' ? '40px' : '32px', 
                          fill: 'none' 
                        }}>
                          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
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

              {editingChannel.type === 'x' && (
                <TextField
                  label="X (Twitter) Handle or Profile URL"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Example: twitter.com/yourbrand or x.com/yourbrand"
                />
              )}

              {editingChannel.type === 'youtube' && (
                <TextField
                  label="YouTube Channel URL"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Example: youtube.com/@yourbrand"
                />
              )}

              {editingChannel.type === 'phone' && (
                <TextField
                  label="Phone Number"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Example: +1 555 123 4567"
                />
              )}

              {editingChannel.type === 'email' && (
                <TextField
                  label="Email Address"
                  type="email"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Example: support@yourbrand.com"
                />
              )}

              {editingChannel.type === 'wechat' && (
                <TextField
                  label="WeChat ID"
                  value={editingChannel.detail}
                  onChange={(v) => updateChannelField(editingChannel.id, 'detail', v)}
                  autoComplete="off"
                  helpText="Enter your WeChat ID"
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
                </>
              )}

              <BlockStack gap="200">
                <Text as="p" variant="bodyMd" fontWeight="semibold">Custom Icon (SVG or Image)</Text>
                <DropZone
                  accept="image/*, image/svg+xml"
                  type="image"
                  onDrop={(files) => {
                    const file = files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          updateChannel(editingChannel.id, { icon: reader.result, useDefaultIcon: false });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  <DropZone.FileUpload actionTitle="Add file" actionHint="Accepts SVG or images" />
                </DropZone>
                {editingChannel.icon && (editingChannel.icon.startsWith('data:') || editingChannel.icon.startsWith('<svg') || editingChannel.icon.startsWith('http')) && (
                  <InlineStack align="start">
                    <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', padding: '4px' }}>
                      {editingChannel.icon.startsWith('<svg') ? (
                        <div dangerouslySetInnerHTML={{ __html: editingChannel.icon }} style={{ width: '100%', height: '100%', display: 'flex' }} />
                      ) : (
                        <img src={editingChannel.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                  </InlineStack>
                )}
                {editingChannel.type !== 'custom' && (
                  <Checkbox
                    label={`Use default ${editingChannel.name} icon`}
                    checked={editingChannel.useDefaultIcon}
                    onChange={(checked) => {
                      if (checked) {
                        updateChannel(editingChannel.id, { useDefaultIcon: true, icon: DEFAULT_ICONS[editingChannel.type as keyof typeof DEFAULT_ICONS] });
                      } else {
                        updateChannelField(editingChannel.id, 'useDefaultIcon', false);
                      }
                    }}
                  />
                )}
              </BlockStack>
            </FormLayout>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
