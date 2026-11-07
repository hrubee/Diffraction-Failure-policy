import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diffraction | Physical AI Safety & Policy Verification Platform',
  description:
    'Continuous physics verification and regulatory certification across Humanoids, Heavy Haulers, Manipulators, Wheeled AMRs & Sidewalk Rovers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-[#F5E9D8] text-[#3E2C23] selection:bg-[#2FA4D7] selection:text-white">
        {children}
      </body>
    </html>
  );
}
