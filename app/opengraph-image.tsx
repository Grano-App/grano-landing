import { ImageResponse } from "next/og";

export const alt = "Grano — твій цифровий агроном";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E2E3E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: -2,
          }}
        >
          Grano
        </div>
        <div
          style={{
            fontSize: 48,
            color: "#9CA8B4",
            marginTop: 24,
          }}
        >
          Твій цифровий агроном
        </div>
      </div>
    ),
    { ...size }
  );
}
