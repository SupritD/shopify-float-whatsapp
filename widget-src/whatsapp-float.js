document.addEventListener("DOMContentLoaded", async function() {
  const root = document.getElementById("contact-float-root");
  if (!root) return;

  const shopDomain = root.getAttribute("data-shop-domain");

  try {
    const response = await fetch(`/apps/contact-float?shop=${shopDomain}`);
    if (!response.ok) return;

    const config = await response.json();
    if (!config || config.error) return;

    // Check page visibility rules
    if (config.pageVisibilityRule && config.pageVisibilityRule !== 'all' && config.targetPages) {
      try {
        const targetPages = JSON.parse(config.targetPages);
        const currentPath = window.location.pathname;
        
        const isMatch = targetPages.some(page => {
          if (page === '/') return currentPath === '/';
          return currentPath.startsWith(page);
        });

        if (config.pageVisibilityRule === 'include' && !isMatch) return;
        if (config.pageVisibilityRule === 'exclude' && isMatch) return;
      } catch (e) {
        console.error("Error parsing target pages:", e);
      }
    }

    setTimeout(() => {
      renderMultiChannelWidget(config, root);
    }, (parseFloat(config.displayDelay) || 0) * 1000);

  } catch (err) {
    console.error("Error loading Contact Float config:", err);
  }
});

function renderMultiChannelWidget(config, root) {
  const channels = config.channels ? config.channels.filter(c => c.active) : [];
  if (channels.length === 0) return;

  const layoutStyle = config.layoutStyle || 'stacked';
  const buttonSize = config.buttonSize || 'medium';
  const horizontalPos = config.horizontalPos || 'right';
  const verticalPos = config.verticalPos || 'bottom';
  const rightOffset = config.rightOffset || 20;
  const bottomOffset = config.bottomOffset || 20;

  // Create main container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.zIndex = '2147483647';
  container.style[verticalPos] = `${bottomOffset}px`;
  container.style[horizontalPos] = `${rightOffset}px`;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '12px';
  container.style.alignItems = horizontalPos === 'right' ? 'flex-end' : 'flex-start';

  // Device visibility class
  if (config.visibility === 'desktop_only') container.classList.add('contact-float-desktop-only');
  else if (config.visibility === 'mobile_only') container.classList.add('contact-float-mobile-only');

  let isExpanded = false;

  const getButtonDimensions = (size) => {
    if (size === 'small') return '40px';
    if (size === 'large') return '64px';
    return '52px';
  };
  const sizePx = getButtonDimensions(buttonSize);

  const createChannelLink = (channel) => {
    let href = channel.detail;
    if (channel.type === 'whatsapp') {
      const phone = channel.detail.replace(/[^+\d]/g, '');
      const text = encodeURIComponent(channel.prefilledMessage || '');
      href = `https://wa.me/${phone}?text=${text}`;
    } else if (channel.type === 'messenger') {
      href = `https://${channel.detail}`;
    } else if (channel.type === 'instagram') {
      href = `https://instagram.com/${channel.detail}`;
    } else if (channel.type === 'phone') {
      href = `tel:${channel.detail.replace(/[^+\d]/g, '')}`;
    } else if (channel.type === 'email') {
      href = `mailto:${channel.detail}`;
    } else if (channel.type === 'x') {
      href = `https://${channel.detail}`;
    } else if (channel.type === 'youtube') {
      href = `https://${channel.detail}`;
    }

    const a = document.createElement('a');
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.textDecoration = 'none';
    return a;
  };

  const createIconEl = (channel) => {
    const iconContainer = document.createElement('div');
    const iWidth = channel.appearance?.iconWidth || 28;
    const iHeight = channel.appearance?.iconHeight || 28;
    iconContainer.style.width = `${iWidth}px`;
    iconContainer.style.height = `${iHeight}px`;
    iconContainer.style.display = 'flex';
    iconContainer.style.alignItems = 'center';
    iconContainer.style.justifyContent = 'center';

    if (channel.icon && channel.icon.startsWith('<svg')) {
      iconContainer.innerHTML = channel.icon;
      const svg = iconContainer.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
      }
    } else if (channel.icon && (channel.icon.startsWith('http') || channel.icon.startsWith('data:image'))) {
      iconContainer.innerHTML = `<img src="${channel.icon}" style="width: 100%; height: 100%; object-fit: contain;" />`;
    } else {
      iconContainer.innerHTML = `<span style="font-size: ${iWidth}px;">${channel.icon}</span>`;
    }
    return iconContainer;
  };

  // 1. DRAWER LAYOUT
  if (layoutStyle === 'drawer') {
    const drawerCard = document.createElement('div');
    drawerCard.style.backgroundColor = '#ffffff';
    drawerCard.style.borderRadius = '12px';
    drawerCard.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    drawerCard.style.padding = '8px 0';
    drawerCard.style.minWidth = '220px';
    drawerCard.style.marginBottom = '4px';
    drawerCard.style.display = 'flex';
    drawerCard.style.flexDirection = 'column';
    drawerCard.style.overflow = 'hidden';
    drawerCard.style.opacity = '0';
    drawerCard.style.transform = 'translateY(20px) scale(0.95)';
    drawerCard.style.pointerEvents = 'none';
    drawerCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    drawerCard.style.transformOrigin = horizontalPos === 'right' ? 'bottom right' : 'bottom left';
    
    channels.forEach(channel => {
      const a = createChannelLink(channel);
      a.style.display = 'flex';
      a.style.alignItems = 'center';
      a.style.gap = '12px';
      a.style.padding = '10px 16px';
      a.style.cursor = 'pointer';
      a.style.transition = 'background-color 0.2s';
      a.onmouseenter = () => a.style.backgroundColor = '#f9f9f9';
      a.onmouseleave = () => a.style.backgroundColor = 'transparent';

      const iconWrap = document.createElement('div');
      iconWrap.style.width = '24px';
      iconWrap.style.height = '24px';
      iconWrap.style.display = 'flex';
      iconWrap.style.alignItems = 'center';
      iconWrap.style.justifyContent = 'center';
      iconWrap.style.color = channel.appearance?.bgColor || '#000';
      iconWrap.style.fill = channel.appearance?.bgColor || '#000';
      iconWrap.appendChild(createIconEl(channel));

      const span = document.createElement('span');
      span.style.fontSize = '14px';
      span.style.fontWeight = '500';
      span.style.color = '#333';
      span.innerText = (channel.type === 'custom' && channel.customName) ? channel.customName : channel.name;

      a.appendChild(iconWrap);
      a.appendChild(span);
      drawerCard.appendChild(a);
    });
    
    container.appendChild(drawerCard);

    // Trigger button
    const trigger = document.createElement('div');
    trigger.style.backgroundColor = '#000';
    trigger.style.color = '#fff';
    trigger.style.width = sizePx;
    trigger.style.height = sizePx;
    trigger.style.borderRadius = '50%';
    trigger.style.display = 'flex';
    trigger.style.alignItems = 'center';
    trigger.style.justifyContent = 'center';
    trigger.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    trigger.style.cursor = 'pointer';
    trigger.style.transition = 'transform 0.3s ease';
    
    if (config.animation === 'pulse') trigger.classList.add('contact-float-pulse');
    if (config.animation === 'bounce') trigger.classList.add('contact-float-bounce');

    const toggleIcon = document.createElement('div');
    toggleIcon.style.width = buttonSize === 'small' ? '24px' : buttonSize === 'large' ? '40px' : '32px';
    toggleIcon.style.height = buttonSize === 'small' ? '24px' : buttonSize === 'large' ? '40px' : '32px';
    toggleIcon.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    
    trigger.appendChild(toggleIcon);
    container.appendChild(trigger);

    trigger.onclick = () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        drawerCard.style.opacity = '1';
        drawerCard.style.transform = 'translateY(0) scale(1)';
        drawerCard.style.pointerEvents = 'auto';
        trigger.style.transform = 'rotate(135deg)';
      } else {
        drawerCard.style.opacity = '0';
        drawerCard.style.transform = 'translateY(20px) scale(0.95)';
        drawerCard.style.pointerEvents = 'none';
        trigger.style.transform = 'rotate(0deg)';
      }
    };
  }

  // 2. STACKED OR EXPANDABLE LAYOUT
  if (layoutStyle === 'stacked' || layoutStyle === 'expandable') {
    const channelContainer = document.createElement('div');
    channelContainer.style.display = 'flex';
    channelContainer.style.flexDirection = 'column';
    channelContainer.style.gap = '12px';

    const channelNodes = [];

    channels.forEach((channel, index) => {
      const a = createChannelLink(channel);
      a.style.backgroundColor = channel.appearance?.transparentBg ? 'transparent' : (channel.appearance?.bgColor || '#000');
      a.style.color = channel.appearance?.transparentBg ? (channel.appearance?.bgColor || '#000') : (channel.appearance?.textColor || '#fff');
      a.style.fill = a.style.color;
      a.style.width = sizePx;
      a.style.height = sizePx;
      a.style.borderRadius = '50%';
      a.style.display = 'flex';
      a.style.alignItems = 'center';
      a.style.justifyContent = 'center';
      a.style.boxShadow = channel.appearance?.transparentBg ? 'none' : '0 4px 12px rgba(0,0,0,0.15)';
      
      if (layoutStyle === 'stacked') {
        a.style.opacity = '1';
        a.style.transform = 'translateY(0) scale(1)';
        a.style.pointerEvents = 'auto';
        if (config.animation === 'pulse') a.classList.add('contact-float-pulse');
        if (config.animation === 'bounce') a.classList.add('contact-float-bounce');
      } else {
        a.style.opacity = '0';
        a.style.transform = 'translateY(20px) scale(0.5)';
        a.style.pointerEvents = 'none';
        a.style.transition = `all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${(channels.length - index) * 0.05}s`;
      }
      
      const iconEl = createIconEl(channel);
      iconEl.style.fill = 'currentColor';
      iconEl.style.color = 'currentColor';
      a.appendChild(iconEl);
      
      channelContainer.appendChild(a);
      channelNodes.push(a);
    });

    container.appendChild(channelContainer);

    if (layoutStyle === 'expandable') {
      const trigger = document.createElement('div');
      trigger.style.backgroundColor = '#000';
      trigger.style.color = '#fff';
      trigger.style.width = sizePx;
      trigger.style.height = sizePx;
      trigger.style.borderRadius = '50%';
      trigger.style.display = 'flex';
      trigger.style.alignItems = 'center';
      trigger.style.justifyContent = 'center';
      trigger.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      trigger.style.cursor = 'pointer';
      trigger.style.transition = 'transform 0.3s ease';
      
      if (config.animation === 'pulse') trigger.classList.add('contact-float-pulse');
      if (config.animation === 'bounce') trigger.classList.add('contact-float-bounce');
  
      const toggleIcon = document.createElement('div');
      toggleIcon.style.width = buttonSize === 'small' ? '24px' : buttonSize === 'large' ? '40px' : '32px';
      toggleIcon.style.height = buttonSize === 'small' ? '24px' : buttonSize === 'large' ? '40px' : '32px';
      toggleIcon.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/24/svg"><path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      
      trigger.appendChild(toggleIcon);
      container.appendChild(trigger);

      trigger.onclick = () => {
        isExpanded = !isExpanded;
        if (isExpanded) {
          trigger.style.transform = 'rotate(135deg)';
          channelNodes.forEach(node => {
            node.style.opacity = '1';
            node.style.transform = 'translateY(0) scale(1)';
            node.style.pointerEvents = 'auto';
          });
        } else {
          trigger.style.transform = 'rotate(0deg)';
          channelNodes.forEach(node => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(20px) scale(0.5)';
            node.style.pointerEvents = 'none';
          });
        }
      };
    }
  }

  root.appendChild(container);
}
