import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Select,
  Checkbox,
  InlineStack,
  Button,
  Box,
  RangeSlider,
  Grid,
  Popover,
  ActionList,
  Scrollable,
} from "@shopify/polaris";
import { useNavigate } from "react-router";
import { customArray } from "country-codes-list";
import 'flag-icons/css/flag-icons.min.css';

const countryData = customArray({
  countryCode: "{countryCode}",
  countryNameEn: "{countryNameEn}",
  countryCallingCode: "{countryCallingCode}",
});

const countryDataMap = countryData.reduce((acc: any, curr: any) => {
  acc[curr.countryCode] = curr;
  return acc;
}, {});

export default function WhatsAppConfig() {
  const navigate = useNavigate();

  // State for all settings
  const [selectedCountryIso, setSelectedCountryIso] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [displayStyle, setDisplayStyle] = useState("icon_only");
  const [buttonText, setButtonText] = useState("Chat with us");
  const [animation, setAnimation] = useState("pulse");
  const [useCustomLink, setUseCustomLink] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [popoverActive, setPopoverActive] = useState(false);

  const [iconWidth, setIconWidth] = useState("28");
  const [iconHeight, setIconHeight] = useState("28");
  const [transparentBg, setTransparentBg] = useState(false);
  const [bgColor, setBgColor] = useState("#25D366");
  const [textColor, setTextColor] = useState("#ffffff");

  const [buttonSize, setButtonSize] = useState("medium");
  const [horizontalPos, setHorizontalPos] = useState("right");
  const [verticalPos, setVerticalPos] = useState("bottom");
  const [rightOffset, setRightOffset] = useState(20);
  const [bottomOffset, setBottomOffset] = useState(20);
  const [visibility, setVisibility] = useState("always");
  const [displayDelay, setDisplayDelay] = useState("0");

  const handleSave = () => {
    // In future: submit to action
    // shopify.toast.show("Settings saved");
    navigate("/app");
  };

  return (
    <Page
      backAction={{ content: "Home", onAction: () => navigate("/app") }}
      title="WhatsApp Chat Button"
      subtitle="Configure your floating WhatsApp button"
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* Quick Setup */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">1. Quick Setup</Text>
                <Text as="p" tone="subdued">Enter your WhatsApp number and choose how the button works.</Text>

                <Box padding="300" background="bg-surface-info" borderRadius="200">
                  <Text as="p">Set up your WhatsApp button by entering your number and configuring the appearance below.</Text>
                </Box>

                <TextField
                  label="WhatsApp Number"
                  value={phoneNumber}
                  onChange={(val) => setPhoneNumber(val.replace(/[^+\\d\\s-]/g, ''))}
                  autoComplete="off"
                  helpText="Enter your number with country code"
                  connectedLeft={
                    <Popover
                      active={popoverActive}
                      activator={
                        <Button onClick={() => setPopoverActive(!popoverActive)} disclosure>
                          <span className={`fi fi-${selectedCountryIso.toLowerCase()}`} style={{ fontSize: '18px', width: '24px' }}></span>
                        </Button>
                      }
                      onClose={() => setPopoverActive(false)}
                      autofocusTarget="none"
                    >
                      <Popover.Pane>
                        <Scrollable style={{ height: '300px' }}>
                          <ActionList
                            actionRole="menuitem"
                            items={countryData.map((country: any) => ({
                              content: `${country.countryNameEn} +${country.countryCallingCode}`,
                              prefix: <span className={`fi fi-${country.countryCode.toLowerCase()}`} style={{ fontSize: '16px' }}></span>,
                              onAction: () => {
                                setSelectedCountryIso(country.countryCode);
                                setPopoverActive(false);
                                const currentPrefix = `+${countryDataMap[selectedCountryIso]?.countryCallingCode} `;
                                let cleanPhone = phoneNumber.trimStart();
                                if (cleanPhone.startsWith(currentPrefix)) {
                                  cleanPhone = cleanPhone.substring(currentPrefix.length);
                                } else if (cleanPhone.startsWith('+')) {
                                  // Fallback: strip any leading +digits
                                  cleanPhone = cleanPhone.replace(/^\\+\\d+\\s*/, '');
                                }
                                setPhoneNumber(`+${country.countryCallingCode} ` + cleanPhone);
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
                  value={message}
                  onChange={setMessage}
                  multiline={3}
                  autoComplete="off"
                  helpText="Message that will be pre-filled in the user's chat"
                />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                      label="Display Style"
                      options={[
                        { label: 'Icon Only', value: 'icon_only' },
                        { label: 'Icon with Text', value: 'icon_text' },
                      ]}
                      value={displayStyle}
                      onChange={setDisplayStyle}
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                      label="Animation"
                      options={[
                        { label: 'None', value: 'none' },
                        { label: 'Pulse', value: 'pulse' },
                        { label: 'Bounce', value: 'bounce' },
                      ]}
                      value={animation}
                      onChange={setAnimation}
                    />
                  </Grid.Cell>
                </Grid>

                {displayStyle === 'icon_text' && (
                  <TextField
                    label="Button Text"
                    value={buttonText}
                    onChange={setButtonText}
                    autoComplete="off"
                    helpText="Text to display next to the WhatsApp icon"
                  />
                )}

                <Checkbox
                  label="Use Custom Link instead of WhatsApp"
                  checked={useCustomLink}
                  onChange={setUseCustomLink}
                  helpText="Redirect users to a specific URL instead of opening WhatsApp chat."
                />

                {useCustomLink && (
                  <TextField
                    label="Custom URL"
                    value={customUrl}
                    onChange={setCustomUrl}
                    autoComplete="off"
                    placeholder="https://example.com"
                    helpText="Enter the full URL including https://"
                  />
                )}
              </BlockStack>
            </Card>

            {/* Appearance */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">2. Appearance</Text>
                <Text as="p" tone="subdued">Choose an icon, customize colors, and adjust the button style.</Text>

                <Text as="h3" variant="headingSm">Icon Dimensions</Text>
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                      label="Icon Width (px)"
                      type="number"
                      value={iconWidth}
                      onChange={setIconWidth}
                      autoComplete="off"
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                      label="Icon Height (px)"
                      type="number"
                      value={iconHeight}
                      onChange={setIconHeight}
                      autoComplete="off"
                    />
                  </Grid.Cell>
                </Grid>

                <Text as="h3" variant="headingSm">Colors</Text>
                <Checkbox
                  label="Transparent Background"
                  checked={transparentBg}
                  onChange={setTransparentBg}
                />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                      label="Background Color"
                      value={bgColor}
                      onChange={setBgColor}
                      autoComplete="off"
                      prefix={<div style={{ width: 20, height: 20, backgroundColor: transparentBg ? 'transparent' : bgColor, borderRadius: '100%', border: '1px solid #ccc' }} />}
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <TextField
                      label="Text/Icon Color"
                      value={textColor}
                      onChange={setTextColor}
                      autoComplete="off"
                      prefix={<div style={{ width: 20, height: 20, backgroundColor: textColor, borderRadius: '100%', border: '1px solid #ccc' }} />}
                    />
                  </Grid.Cell>
                </Grid>
              </BlockStack>
            </Card>

            {/* Position & Size */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">3. Position & Size</Text>
                <Text as="p" tone="subdued">Control where the button appears and how large it is.</Text>

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
                  value={rightOffset}
                  onChange={setRightOffset}
                  output
                  min={0}
                  max={100}
                />

                <RangeSlider
                  label="Bottom/Top Offset (px)"
                  value={bottomOffset}
                  onChange={setBottomOffset}
                  output
                  min={0}
                  max={100}
                />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Select
                      label="Visibility"
                      options={[{ label: 'Always visible', value: 'always' }]}
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

              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Right Column: Preview */}
        <Layout.Section variant="oneThird">
          <div style={{ position: 'sticky', top: '20px', height: 'max-content', zIndex: 10 }}>
            <style>{`
              /* Force Polaris Layout to stretch so sticky positioning works */
              .Polaris-Layout {
                align-items: stretch !important;
              }
              .Polaris-Layout__Section {
                height: auto !important;
              }
            `}</style>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Preview</Text>

                <Box background="bg-surface-secondary" padding="800" borderRadius="200" minHeight="400px" position="relative" overflowX="hidden" overflowY="hidden">
                  <Box background="bg-surface-tertiary" minHeight="12px" width="60%" borderRadius="100" marginBlockEnd="200" />
                  <Box background="bg-surface-tertiary" minHeight="12px" width="80%" borderRadius="100" marginBlockEnd="200" />
                  <Box background="bg-surface-tertiary" minHeight="12px" width="50%" borderRadius="100" marginBlockEnd="200" />

                  {/* The Floating Button */}
                  <div
                    style={{
                      position: 'absolute',
                      [horizontalPos === 'right' ? 'right' : 'left']: `${rightOffset}px`,
                      [verticalPos === 'bottom' ? 'bottom' : 'top']: `${bottomOffset}px`,
                      backgroundColor: transparentBg ? 'transparent' : bgColor,
                      padding: displayStyle === 'icon_text' ? '12px 16px' : '12px',
                      borderRadius: '50px',
                      color: textColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: transparentBg ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      transform: animation === 'pulse' ? 'scale(1.05)' : 'none',
                    }}
                  >
                    <div style={{ width: `${iconWidth}px`, height: `${iconHeight}px`, fill: textColor }}>
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </div>
                    {displayStyle === 'icon_text' && (
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{buttonText}</span>
                    )}
                  </div>
                </Box>
                <Text as="p" tone="subdued" alignment="center">Preview updates in real-time as you configure</Text>
              </BlockStack>
            </Card>

            <Box paddingBlockStart="400">
              <Button size="large" variant="primary" fullWidth onClick={handleSave}>
                Create WhatsApp Button
              </Button>
            </Box>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
