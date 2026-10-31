import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Typodeck Studio — typography-only decks',
  description: 'Turn an idea or a public GitHub repo into an editable, typography-only pitch deck.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <h1 className="wordmark">
              Typodeck <span className="wordmark-sub">Studio</span>
            </h1>
            <p className="tagline">Typography-only pitch decks. No shapes, no stock, no clip art.</p>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <p>
              Typodeck Studio on the core pipeline (ingest → evidence → narrative → layout → export
              → validate).
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
