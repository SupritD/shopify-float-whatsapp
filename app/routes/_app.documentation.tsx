import { Page, Layout, Card, BlockStack, Text, List, Divider, Box, Badge } from "@shopify/polaris";
import { useNavigate } from "react-router";

export default function Documentation() {
  const navigate = useNavigate();
  return (
    <Page
      title="WhatsApp Button Documentation"
      backAction={{ content: "Home", onAction: () => navigate("/") }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">

            {/* Overview */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Overview</Text>
                <Text as="p" variant="bodyMd">
                  Welcome! This documentation will help you set up and customize the WhatsApp floating button for your Shopify store.
                  Our app provides an easy way to let your customers reach out to you directly via WhatsApp.
                </Text>
              </BlockStack>
            </Card>

            {/* Getting Started */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Setting Up the WhatsApp Button</Text>
                <Text as="p" variant="bodyMd">Follow these steps to set up the WhatsApp floating button on your Shopify store.</Text>

                <Box paddingBlockStart="200">
                  <Text as="h3" variant="headingMd">Step 1: Configure the app settings</Text>
                  <List type="number">
                    <List.Item>Go to the <b>WhatsApp Button</b> settings page from the sidebar.</List.Item>
                    <List.Item>Add your WhatsApp number with the correct country code.</List.Item>
                    <List.Item>Choose your preferred button style, colors, position, and visibility settings.</List.Item>
                    <List.Item>Click <b>Save Configuration</b>.</List.Item>
                  </List>
                </Box>

                <Box paddingBlockStart="200">
                  <Text as="h3" variant="headingMd">Step 2: Enable the app embed</Text>
                  <List type="number">
                    <List.Item>Go to <b>Online Store → Themes</b> in your Shopify Admin.</List.Item>
                    <List.Item>Click <b>Customize</b> on your active theme.</List.Item>
                    <List.Item>In the left-hand panel, click the <b>App Embeds</b> icon (the overlapping squares).</List.Item>
                    <List.Item>Find the <b>WhatsApp Button</b> toggle and turn it <b>ON</b>.</List.Item>
                    <List.Item>Click <b>Save</b> in the top right corner.</List.Item>
                  </List>
                </Box>

                <Box paddingBlockStart="200">
                  <Text as="h3" variant="headingMd">Step 3: Test the floating button</Text>
                  <List type="number">
                    <List.Item>Visit your live storefront.</List.Item>
                    <List.Item>The floating WhatsApp button should now appear as configured.</List.Item>
                    <List.Item>Click it to confirm it opens a chat using your configured number.</List.Item>
                  </List>
                </Box>
              </BlockStack>
            </Card>

            {/* Configuration Options */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Configuration Options</Text>
                <Text as="p" variant="bodyMd">This document explains all the configuration options available for your WhatsApp floating button.</Text>

                <Divider />

                <Text as="h3" variant="headingMd">Basic Settings</Text>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">WhatsApp Number <Badge tone="critical">Required</Badge></Text>
                  <Text as="p" variant="bodyMd">Your WhatsApp phone number including the country code. We provide a country dropdown for easy selection.</Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Pre-filled Message</Text>
                  <Text as="p" variant="bodyMd">A default message that will appear in the user's text input field when they open the chat. Example: "Hello! I'm interested in your products."</Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Display Style</Text>
                  <Text as="p" variant="bodyMd">How the button should be displayed on your store.</Text>
                  <List>
                    <List.Item><b>Icon Only:</b> Shows only the WhatsApp icon.</List.Item>
                    <List.Item><b>Icon with Text:</b> Shows the icon with a customizable text message.</List.Item>
                  </List>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Custom Link</Text>
                  <Text as="p" variant="bodyMd">Instead of opening WhatsApp, you can redirect users to a custom URL (e.g., a specific contact page).</Text>
                </BlockStack>

                <Divider />

                <Text as="h3" variant="headingMd">Appearance</Text>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Colors</Text>
                  <List>
                    <List.Item><b>Background Color:</b> The main color of the button (Default: #25D366).</List.Item>
                    <List.Item><b>Text/Icon Color:</b> The color of the icon and text inside the button.</List.Item>
                    <List.Item><b>Transparent Background:</b> Removes the background color completely.</List.Item>
                  </List>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Button Size</Text>
                  <List>
                    <List.Item><b>Small:</b> Compact size, great for minimal designs.</List.Item>
                    <List.Item><b>Medium:</b> Default size, recommended for most cases.</List.Item>
                    <List.Item><b>Large:</b> Larger size, more noticeable.</List.Item>
                  </List>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Animation</Text>
                  <List>
                    <List.Item><b>None:</b> Static button.</List.Item>
                    <List.Item><b>Pulse:</b> Button gently grows and shrinks to catch attention.</List.Item>
                    <List.Item><b>Bounce:</b> Button bounces up and down.</List.Item>
                  </List>
                </BlockStack>

                <Divider />

                <Text as="h3" variant="headingMd">Position & Visibility</Text>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Position Horizontal / Vertical</Text>
                  <Text as="p" variant="bodyMd">Choose which corner of the screen the button anchors to (e.g., Bottom Right, Bottom Left).</Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Offsets</Text>
                  <Text as="p" variant="bodyMd">Adjust the exact distance in pixels from the edge of the screen. Default is 20px.</Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h4" variant="headingSm">Display Delay</Text>
                  <Text as="p" variant="bodyMd">The time delay (in seconds) before the button appears after the page loads. Default is 0.</Text>
                </BlockStack>

              </BlockStack>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Troubleshooting</Text>
                <Text as="p" variant="bodyMd">If you're having issues with your WhatsApp floating button, check out these common problems and solutions.</Text>

                <Box paddingBlockStart="200">
                  <Text as="h3" variant="headingMd">Button Not Appearing</Text>
                  <List>
                    <List.Item><b>Check Theme Embed:</b> Make sure you enabled the App Embed in your Theme Editor (Step 2 above).</List.Item>
                    <List.Item><b>Check Configuration:</b> Ensure you've entered a valid number and clicked "Save Configuration".</List.Item>
                    <List.Item><b>Check Display Delay:</b> If you set a high delay, the button is waiting to appear.</List.Item>
                    <List.Item><b>Clear Cache:</b> Sometimes your browser might be showing an old cached version of your store.</List.Item>
                  </List>
                </Box>

                <Box paddingBlockStart="200">
                  <Text as="h3" variant="headingMd">WhatsApp Not Opening</Text>
                  <List>
                    <List.Item><b>Check Number Format:</b> Ensure your number is correct and has the right country code selected.</List.Item>
                    <List.Item><b>Desktop vs Mobile:</b> On desktop, it requires WhatsApp Web (and being logged in). On mobile, it will open the app directly.</List.Item>
                  </List>
                </Box>
              </BlockStack>
            </Card>

            {/* FAQ */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Frequently Asked Questions</Text>

                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">Does the button slow down my store?</Text>
                  <Text as="p" variant="bodyMd">No, the WhatsApp button is extremely lightweight. It loads asynchronously and doesn't impact your store's core performance metrics.</Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">Is a business WhatsApp account required?</Text>
                  <Text as="p" variant="bodyMd">No, you can use any WhatsApp number. However, we recommend a WhatsApp Business account for professional interactions and business features.</Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">Does it work with all Shopify themes?</Text>
                  <Text as="p" variant="bodyMd">Yes! Because it uses Shopify's modern App Embed Blocks, it works seamlessly on all vintage and Online Store 2.0 themes.</Text>
                </BlockStack>
              </BlockStack>
            </Card>

          </BlockStack>
        </Layout.Section>
      </Layout>
      <Box paddingBlockEnd="1200" />
    </Page>
  );
}
