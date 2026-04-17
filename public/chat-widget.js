(function () {
  if (window.NhanhChatWidgetLoaded) return;
  window.NhanhChatWidgetLoaded = true;

  var scriptTag = document.currentScript;

  var iframeUrl =
    (scriptTag && scriptTag.getAttribute("data-url")) ||
    "https://nhanhtravelchatai.vercel.app/chat-embed";

  var buttonText =
    (scriptTag && scriptTag.getAttribute("data-button-text")) ||
    "CHAT AI";

  var rightOffset =
    (scriptTag && scriptTag.getAttribute("data-right")) || "20";

  var topOffset =
    (scriptTag && scriptTag.getAttribute("data-top")) || "50%";

  var buttonBg =
    (scriptTag && scriptTag.getAttribute("data-button-bg")) ||
    "#9C27B0";

  var buttonColor =
    (scriptTag && scriptTag.getAttribute("data-button-color")) ||
    "#ffffff";

  var zIndex =
    (scriptTag && scriptTag.getAttribute("data-z-index")) || "999999";

  var style = document.createElement("style");
  style.innerHTML = `
    #nhanh-chat-widget-root {
      position: relative;
      z-index: ${zIndex};
    }

    #nhanh-chat-widget-button {
      position: fixed;
      top: ${topOffset};
      right: ${rightOffset}px;
      transform: translateY(-50%);
      height: 52px;
      min-width: 150px;
      padding: 0 18px;
      border: none;
      border-radius: 8px 0 0 8px;
      background: ${buttonBg};
      color: ${buttonColor};
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(0,0,0,0.25);
      z-index: ${zIndex};
    }

    #nhanh-chat-widget-button:hover {
      opacity: 0.95;
    }

    #nhanh-chat-widget-frame {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
      display: none;
      z-index: ${Number(zIndex) + 1};
      box-shadow: 0 0 10px rgba(0,0,0,0.35);
    }

    #nhanh-chat-widget-close {
      position: fixed;
      top: 18px;
      right: 24px;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 999px;
      background: #ffffff;
      color: #333333;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      display: none;
      z-index: ${Number(zIndex) + 2};
      box-shadow: 0 0 10px rgba(0,0,0,0.25);
    }

    #nhanh-chat-widget-close:hover {
      background: #f4f4f4;
    }

    @media (max-width: 768px) {
      #nhanh-chat-widget-button {
        top: auto;
        bottom: 20px;
        right: 16px;
        transform: none;
        min-width: 120px;
        height: 46px;
        border-radius: 8px;
        font-size: 14px;
      }

      #nhanh-chat-widget-close {
        top: 14px;
        right: 14px;
        width: 40px;
        height: 40px;
        font-size: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  var root = document.createElement("div");
  root.id = "nhanh-chat-widget-root";

  var button = document.createElement("button");
  button.id = "nhanh-chat-widget-button";
  button.type = "button";
  button.innerText = buttonText;

  var iframe = document.createElement("iframe");
  iframe.id = "nhanh-chat-widget-frame";
  iframe.src = iframeUrl;
  iframe.title = "Nhanh Travel Chat AI";

  var closeBtn = document.createElement("button");
  closeBtn.id = "nhanh-chat-widget-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Đóng");
  closeBtn.innerHTML = "×";

  root.appendChild(button);
  root.appendChild(iframe);
  root.appendChild(closeBtn);
  document.body.appendChild(root);

  function openWidget() {
    button.style.display = "none";
    iframe.style.display = "block";
    closeBtn.style.display = "block";
  }

  function closeWidget() {
    iframe.style.display = "none";
    closeBtn.style.display = "none";
    button.style.display = "block";
  }

  button.addEventListener("click", openWidget);
  closeBtn.addEventListener("click", closeWidget);

  window.addEventListener("message", function (event) {
    if (!event || !event.data) return;

    if (event.data.type === "NHANH_CHAT_CLOSE") {
      closeWidget();
    }
  });

  window.NhanhChatWidget = {
    open: openWidget,
    close: closeWidget,
  };
})();