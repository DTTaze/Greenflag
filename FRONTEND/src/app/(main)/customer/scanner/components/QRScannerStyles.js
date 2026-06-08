export const qrOverlayStyle = `
.qr-corner-overlay {
  position: absolute;
  inset: 20px;
  z-index: 2;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid var(--primary-green);
  border-radius: 8px;
}
.qr-corner {
  position: absolute;
  width: 48px;
  height: 48px;
  border: 6px solid var(--primary-green);
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
}
.qr-corner-tl {
  top: -24px; left: -24px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 12px;
}
.qr-corner-tr {
  top: -24px; right: -24px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 12px;
}
.qr-corner-bl {
  bottom: -24px; left: -24px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 12px;
}
.qr-corner-br {
  bottom: -24px; right: -24px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 12px;
}
.qr-overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--primary-green);
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  pointer-events: none;
}
`;

export const injectQRScannerStyles = () => {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("qr-corner-style")
  ) {
    const style = document.createElement("style");
    style.id = "qr-corner-style";
    style.innerHTML = qrOverlayStyle;
    document.head.appendChild(style);
  }
};
