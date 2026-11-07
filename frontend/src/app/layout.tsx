import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diffraction AI | Universal Physical AI Safety Verification Engine',
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
      <body className="antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
