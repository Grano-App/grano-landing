import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1E2E3E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: "#85C059",
            borderRadius: "0 100% 0 100%",
            transform: "rotate(-20deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
