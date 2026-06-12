import { ImageResponse } from "next/og";

// Site-wide Open Graph / Twitter card image, generated at build time.
// Per-page titles still come from metadata; this provides the branded visual.

export const alt = "GovBidWriter — Win Government Contracts Faster with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #16294a 0%, #1e3a5f 60%, #1f9188 160%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 36,
            fontWeight: 700,
            color: "#7fd4cc",
          }}
        >
          ✓ GovBidWriter
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 950,
          }}
        >
          Win Government Contracts Faster with AI
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#c3d0e3",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Upload any RFP → compliance matrix, proposal outline, and first draft
          in minutes.
        </div>
      </div>
    ),
    size
  );
}
