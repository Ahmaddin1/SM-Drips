import { Bebas_Neue, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";
import SmoothScroll from "@/components/SmoothScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata = {
  title: {
    default: "SM Drips",
    template: "%s | SM Drips",
  },
  description: "Streetwear Essentials",
  keywords: [
    "SM Drips",
    "SM Drips Pakistan",
    "Engine",
    "streetwear Pakistan",
    "Pakistani streetwear brand",
    "streetwear Faisalabad",
    "urban fashion Pakistan",
    "Outfitters",
    "graphic tees Pakistan",
    "oversized tees Pakistan",
    "Pakistani clothing brand",
    "tracksuits",
    "street fashion Pakistan",
    "limited drops Pakistan",
    "youth fashion Pakistan",
    "premium streetwear",
    "Pakistani urban wear",
    "street style Lahore",
    "street style Karachi",
    "online clothing store Pakistan",
    "buy streetwear online Pakistan",
    "casual wear Pakistan",
    "drop culture Pakistan",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "SM Drips",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${bebasNeue.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {gaId ? (
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
        ) : null}
        {gaId ? (
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        ) : null}
        {fbPixelId ? (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        ) : null}
        <SmoothScroll>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster position="top-right" richColors />
        </SmoothScroll>
        {fbPixelId ? (
          <noscript>
            <img
              alt=""
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
      </body>
    </html>
  );
}

