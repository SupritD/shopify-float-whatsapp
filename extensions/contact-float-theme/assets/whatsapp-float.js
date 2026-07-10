document.addEventListener("DOMContentLoaded", async function() {
  const root = document.getElementById("contact-float-root");
  if (!root) return;

  const shopDomain = root.getAttribute("data-shop-domain");

  try {
    // Fetch configuration from our App Proxy
    const response = await fetch(`/apps/contact-float?shop=${shopDomain}`);
    if (!response.ok) return;

    const config = await response.json();
    if (!config || config.error) return;

    // Check visibility / display delay
    setTimeout(() => {
      renderButton(config, root);
    }, (parseFloat(config.displayDelay) || 0) * 1000);

  } catch (err) {
    console.error("Error loading Contact Float config:", err);
  }
});

function renderButton(config, root) {
  const btn = document.createElement("a");
  
  if (config.useCustomLink) {
    btn.href = config.customUrl;
  } else {
    // Construct WhatsApp Link
    const phone = config.phoneNumber.replace(/[^+\d]/g, '');
    const text = encodeURIComponent(config.message);
    btn.href = `https://wa.me/${phone}?text=${text}`;
  }
  
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  
  // Base Styling
  btn.style.position = "fixed";
  btn.style.zIndex = "2147483647"; // Max z-index
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.gap = "8px";
  btn.style.textDecoration = "none";
  btn.style.transition = "all 0.3s ease";
  
  // Position
  btn.style[config.horizontalPos === 'right' ? 'right' : 'left'] = `${config.rightOffset}px`;
  btn.style[config.verticalPos === 'bottom' ? 'bottom' : 'top'] = `${config.bottomOffset}px`;
  
  // Colors & BG
  if (!config.transparentBg) {
    btn.style.backgroundColor = config.bgColor;
    btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  } else {
    btn.style.backgroundColor = "transparent";
  }
  
  // Button Size scaling
  let scale = 1;
  if (config.buttonSize === 'small') scale = 0.8;
  if (config.buttonSize === 'large') scale = 1.2;

  const basePaddingV = 12 * scale;
  const basePaddingH = (config.displayStyle === 'icon_text' ? 16 : 12) * scale;
  btn.style.padding = `${basePaddingV}px ${basePaddingH}px`;
  btn.style.borderRadius = "50px";
  btn.style.color = config.textColor;

  // Animation class
  if (config.animation === 'pulse') {
    btn.classList.add('contact-float-pulse');
  } else if (config.animation === 'bounce') {
    btn.classList.add('contact-float-bounce');
  }

  // Visibility class
  if (config.visibility === 'desktop_only') {
    btn.classList.add('contact-float-desktop-only');
  } else if (config.visibility === 'mobile_only') {
    btn.classList.add('contact-float-mobile-only');
  }

  const finalIconWidth = (parseFloat(config.iconWidth) || 28) * scale;
  const finalIconHeight = (parseFloat(config.iconHeight) || 28) * scale;

  // Icon HTML
  const iconHtml = `
    <div style="width: ${finalIconWidth}px; height: ${finalIconHeight}px; fill: ${config.textColor}; display: flex; align-items: center; justify-content: center;">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </div>
  `;

  let contentHtml = iconHtml;
  
  if (config.displayStyle === 'icon_text') {
    contentHtml += `<span style="font-size: 14px; font-weight: 600; font-family: inherit;">${config.buttonText}</span>`;
  }

  btn.innerHTML = contentHtml;
  root.appendChild(btn);
}
