(function () {
  if (window.NhanhChatWidgetLoaded) return;
  window.NhanhChatWidgetLoaded = true;

  var scriptTag = document.currentScript;

  var iframeUrl =
    (scriptTag && scriptTag.getAttribute("data-url")) ||
    "https://nhanhtravelchatai.vercel.app/chat-embed";

  var iconUrl =
    (scriptTag && scriptTag.getAttribute("data-icon")) ||
    "https://nhanhtravelchatai.vercel.app/chat-icon.jpg";

  var buttonText =
    (scriptTag && scriptTag.getAttribute("data-button-text")) || "";

  var buttonSize = parseInt(
    (scriptTag && scriptTag.getAttribute("data-button-size")) || "58",
    10
  );

  var popupWidth = parseInt(
    (scriptTag && scriptTag.getAttribute("data-width")) || "600",
    10
  );

  var popupHeight = parseInt(
    (scriptTag && scriptTag.getAttribute("data-height")) || "620",
    10
  );

  var rightOffset = parseInt(
    (scriptTag && scriptTag.getAttribute("data-right")) || "24",
    10
  );

  var bottomOffset = parseInt(
    (scriptTag && scriptTag.getAttribute("data-bottom")) || "24",
    10
  );

  var zIndex = parseInt(
    (scriptTag && scriptTag.getAttribute("data-z-index")) || "999999",
    10
  );

  var style = document.createElement("style");
  style.innerHTML = `
    #nhanh-chat-widget-button {
      position: fixed;
      right: ${rightOffset}px;
      bottom: ${bottomOffset}px;
      width: ${buttonSize}px;
      height: ${buttonSize}px;
      border: 2px solid #3b82f6;
      outline: none;
      padding: 0;
      margin: 0;
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
      z-index: ${zIndex + 3};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.16),
        0 0 0 10px rgba(59, 130, 246, 0.08);
      animation: nhanhChatPulse 1.8s ease-in-out infinite;
      overflow: visible;
    }

    #nhanh-chat-widget-button img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      border-radius: 999px;
      background: transparent;
    }

    #nhanh-chat-widget-button span {
      display: none;
    }

    #nhanh-chat-widget-button:hover {
      animation-play-state: paused;
      transform: scale(1.06);
    }

    #nhanh-chat-widget-button.is-hidden {
      display: none !important;
    }

    #nhanh-chat-widget-teaser.is-hidden {
      display: none !important;
    }

    @keyframes nhanhChatPulse {
      0% {
        transform: scale(1);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.16),
          0 0 0 0 rgba(59, 130, 246, 0.18);
      }
      50% {
        transform: scale(1.08);
        box-shadow:
          0 12px 28px rgba(15, 23, 42, 0.18),
          0 0 0 12px rgba(59, 130, 246, 0.06);
      }
      100% {
        transform: scale(1);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.16),
          0 0 0 0 rgba(59, 130, 246, 0.18);
      }
    }

    #nhanh-chat-widget-teaser {
      position: fixed;
      right: ${rightOffset}px;
      bottom: ${bottomOffset + buttonSize + 18}px;
      width: 320px;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
      padding: 16px 18px;
      z-index: ${zIndex + 2};
      border: 1px solid rgba(148, 163, 184, 0.16);
      cursor: pointer;
    }

    #nhanh-chat-widget-teaser::after {
      content: "";
      position: absolute;
      right: 24px;
      bottom: -8px;
      width: 16px;
      height: 16px;
      background: #ffffff;
      transform: rotate(45deg);
      border-right: 1px solid rgba(148, 163, 184, 0.16);
      border-bottom: 1px solid rgba(148, 163, 184, 0.16);
    }

    #nhanh-chat-widget-teaser-close {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 999px;
      background: #f3f4f6;
      color: #475569;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
      z-index: 2;
    }

    #nhanh-chat-widget-teaser-title {
      margin: 0 0 6px 0;
      font: 700 15px/1.4 Arial, sans-serif;
      color: #2563eb;
    }

    #nhanh-chat-widget-teaser-text {
      margin: 0;
      font: 400 14px/1.55 Arial, sans-serif;
      color: #334155;
    }

    #nhanh-chat-widget-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.18);
      z-index: ${zIndex};
      display: none;
    }

    #nhanh-chat-widget-popup {
      position: fixed;
      right: ${rightOffset}px;
      bottom: ${bottomOffset + buttonSize + 14}px;
      width: ${popupWidth}px;
      height: ${popupHeight}px;
      max-width: calc(100vw - 24px);
      max-height: calc(100vh - 24px);
      background: #ffffff;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 18px 60px rgba(15, 23, 42, 0.22);
      border: 1px solid rgba(148, 163, 184, 0.18);
      z-index: ${zIndex + 1};
      display: none;
    }

    #nhanh-chat-widget-topbar {
      height: 0;
      position: relative;
      z-index: 2;
    }

    #nhanh-chat-widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
      background: #ffffff;
    }

    @media (max-width: 768px) {
      #nhanh-chat-widget-overlay {
        display: none !important;
      }

      #nhanh-chat-widget-button {
        right: 16px !important;
        bottom: 16px !important;
        width: 60px !important;
        height: 60px !important;
        padding: 0 !important;
      }

      #nhanh-chat-widget-button img {
        width: 100% !important;
        height: 100% !important;
      }

      #nhanh-chat-widget-teaser {
        right: 16px !important;
        bottom: 88px !important;
        width: calc(100vw - 32px) !important;
        max-width: 320px !important;
      }

      #nhanh-chat-widget-popup {
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0 !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
      }
    }
  `;
  document.head.appendChild(style);

  var overlay = document.createElement("div");
  overlay.id = "nhanh-chat-widget-overlay";

  var popup = document.createElement("div");
  popup.id = "nhanh-chat-widget-popup";

  var topbar = document.createElement("div");
  topbar.id = "nhanh-chat-widget-topbar";

  var iframe = document.createElement("iframe");
  iframe.id = "nhanh-chat-widget-iframe";
  iframe.src = iframeUrl;
  iframe.title = "Nhanh Travel AI Chat";

  popup.appendChild(topbar);
  popup.appendChild(iframe);

  var teaser = document.createElement("div");
  teaser.id = "nhanh-chat-widget-teaser";
  teaser.innerHTML = `
    <button id="nhanh-chat-widget-teaser-close" type="button" aria-label="Đóng lời chào">×</button>
    <p id="nhanh-chat-widget-teaser-title">Xin chào 👋</p>
    <p id="nhanh-chat-widget-teaser-text">
      Chào mừng bạn đến với Nhanh Travel. Mình có thể hỗ trợ bạn tìm hiểu tính năng và đăng ký dùng thử demo.
    </p>
  `;

  var button = document.createElement("button");
  button.id = "nhanh-chat-widget-button";
  button.type = "button";
  button.setAttribute("aria-label", "Mở trợ lý AI Nhanh Travel");

  var icon = document.createElement("img");
  icon.src = iconUrl;
  icon.alt = "Nhanh Travel AI";
  button.appendChild(icon);

  if (buttonText) {
    var label = document.createElement("span");
    label.textContent = buttonText;
    button.appendChild(label);
  }

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  document.body.appendChild(teaser);
  document.body.appendChild(button);

  var teaserCloseBtn = document.getElementById("nhanh-chat-widget-teaser-close");
  var isOpen = false;
  var isExpanded = false;
  var isTeaserDismissed = false;

  function setNormalSize() {
  popup.style.right = rightOffset + "px";
  popup.style.bottom = (button.classList.contains("is-hidden")
    ? bottomOffset
    : bottomOffset + buttonSize + 14) + "px";
  popup.style.width = popupWidth + "px";
  popup.style.height = (
    popupHeight + (button.classList.contains("is-hidden") ? buttonSize + 14 : 0)
  ) + "px";
  popup.style.maxWidth = "calc(100vw - 24px)";
  popup.style.maxHeight = "calc(100vh - 24px)";
  popup.style.borderRadius = "22px";
}

  function setExpandedSize() {
    popup.style.right = rightOffset + "px";
    popup.style.bottom = (button.classList.contains("is-hidden")
  ? bottomOffset
  : bottomOffset + buttonSize + 14) + "px";
    popup.style.width = "1000px";
    popup.style.height = button.classList.contains("is-hidden")
  ? "calc(84vh + " + (buttonSize + 14) + "px)"
  : "83vh";
    popup.style.maxWidth = "calc(100vw - 24px)";
    popup.style.maxHeight = "calc(100vh - 24px)";
    popup.style.borderRadius = "22px";
  }

  function hideTeaser() {
    teaser.classList.add("is-hidden");
    teaser.style.display = "none";
  }

  function showTeaserIfAllowed() {
    if (isTeaserDismissed) {
      hideTeaser();
      return;
    }

    teaser.classList.remove("is-hidden");
    teaser.style.display = "block";
  }

  function hideLauncher() {
    button.classList.add("is-hidden");
    hideTeaser();
  }

  function showIconOnly() {
    button.classList.remove("is-hidden");
    hideTeaser();
  }

function openWidget() {
  isOpen = true;
  hideTeaser();
  button.classList.add("is-hidden");

  if (isExpanded) {
    setExpandedSize();
  } else {
    setNormalSize();
  }

  popup.style.display = "block";

  if (window.innerWidth > 768) {
    overlay.style.display = "block";
  }
}

  function closeWidget() {
    isOpen = false;
    isExpanded = false;
    popup.style.display = "none";
    overlay.style.display = "none";
    setNormalSize();
    showIconOnly();
  }

  function toggleWidget() {
    if (popup.style.display === "block") {
      closeWidget();
    } else {
      openWidget();
    }
  }

  function closeTeaser() {
    isTeaserDismissed = true;
    hideTeaser();
    button.classList.remove("is-hidden");
  }

  button.addEventListener("click", toggleWidget);
  overlay.addEventListener("click", closeWidget);

  if (teaserCloseBtn) {
    teaserCloseBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      closeTeaser();
    });
  }

  teaser.addEventListener("click", function () {
    openWidget();
  });

  window.addEventListener("message", function (event) {
    if (!event || !event.data) return;

    if (event.data.type === "NHANH_CHAT_CLOSE") {
      closeWidget();
      return;
    }

    if (event.data.type === "NHANH_CHAT_EXPAND") {
  isOpen = true;
  hideTeaser();

  if (isExpanded) {
    isExpanded = false;
    setNormalSize();
  } else {
    isExpanded = true;
    setExpandedSize();
  }

  popup.style.display = "block";
  button.classList.add("is-hidden");

  if (window.innerWidth > 768) {
    overlay.style.display = "block";
  }

  return;
}

    if (event.data.type === "NHANH_CHAT_HIDE_LAUNCHER") {
      hideLauncher();
      return;
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) {
      closeWidget();
    }
  });

  button.classList.remove("is-hidden");
  showTeaserIfAllowed();

  window.NhanhChatWidget = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
  };
})();