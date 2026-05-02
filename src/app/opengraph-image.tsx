import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "STL-Musicians.com";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#11110f",
          color: "#f5ead2",
          padding: 64,
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "2px solid rgba(245,234,210,0.18)",
            padding: 48,
            background:
              "linear-gradient(135deg, rgba(181,139,42,0.28), rgba(75,23,28,0.48), rgba(33,49,77,0.55))",
          }}
        >
          <div style={{ color: "#d8b765", fontSize: 28, letterSpacing: 5 }}>
            ST. LOUIS MUSIC DISCOVERY
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 0.95 }}>
              STL-Musicians.com
            </div>
            <div style={{ fontSize: 36, color: "#c8b894" }}>
              Where St. Louis music gets discovered, promoted, and booked.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
