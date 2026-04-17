(function () {
  if (window.NhanhChatWidgetLoaded) return;
  window.NhanhChatWidgetLoaded = true;

  var scriptTag = document.currentScript;

  var iframeUrl =
    (scriptTag && scriptTag.getAttribute("data-url")) ||
    "http://localhost:3000/chat-embed";

  var iconUrl =
    (scriptTag && scriptTag.getAttribute("data-icon")) ||
    "http://localhost:3000/chat-icon.jpg";

  var buttonSize = 68;
  var popupWidth = 360;
  var popupHeight = 600;
  var rightOffset = 24;
  var bottomOffset = 24;
  var zIndex = 999999;

  var style = document.createElement("style");
  style.innerHTML = `
    #nhanh-chat-widget-button {
      position: fixed;
      right: ${rightOffset}px;
      bottom: ${bottomOffset}px;
      width: ${buttonSize}px;
      height: ${buttonSize}px;
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
      z-index: ${zIndex + 3};
    }

    #nhanh-chat-widget-button img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
      border-radius: 999px;
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

    #nhanh-chat-widget-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border: 1px solid rgba(203, 213, 225, 0.8);
      background: #ffffff;
      color: #334155;
      border-radius: 10px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
      z-index: 3;
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

  var closeBtn = document.createElement("button");
  closeBtn.id = "nhanh-chat-widget-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Đóng chat");
  closeBtn.innerHTML = "×";

  var iframe = document.createElement("iframe");
  iframe.id = "nhanh-chat-widget-iframe";
  iframe.src = iframeUrl;
  iframe.title = "Nhanh Travel AI Chat";

  topbar.appendChild(closeBtn);
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

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  document.body.appendChild(teaser);
  document.body.appendChild(button);

  var teaserCloseBtn = document.getElementById("nhanh-chat-widget-teaser-close");
  var isOpen = false;

  function openWidget() {
    isOpen = true;
    popup.style.display = "block";
    teaser.style.display = "none";
    if (window.innerWidth > 768) {
      overlay.style.display = "block";
    }
  }

  function closeWidget() {
    isOpen = false;
    popup.style.display = "none";
    overlay.style.display = "none";
  }

  function toggleWidget() {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  function closeTeaser() {
    teaser.style.display = "none";
  }

  button.addEventListener("click", toggleWidget);
  closeBtn.addEventListener("click", closeWidget);
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
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) {
      closeWidget();
    }
  });

  window.NhanhChatWidget = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
  };
})();