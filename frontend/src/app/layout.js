import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'KANAD — Smart Agriculture Intelligence Platform',
  description: 'AI-powered agricultural assistant for crop optimization, disease detection, fertilizer recommendation, and IoT-based smart irrigation.',
  keywords: 'agriculture, AI, machine learning, crop recommendation, disease detection, smart irrigation, IoT, LSTM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
