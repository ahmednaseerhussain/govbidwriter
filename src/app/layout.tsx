import type { Metadata } from "next";
import "./globals.css";
import { APP_URL } from "@/lib/utils";
import { PHProvider } from "@/components/posthog-provider";
import { PostHogPageView } from "@/components/posthog-pageview";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "GovBidWriter — Win Government Contracts Faster with AI",
    template: "%s | GovBidWriter",
  },
  description:
    "Upload any RFP and instantly generate a compliance matrix, proposal outline, and first draft tailored to your business.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <PHProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
