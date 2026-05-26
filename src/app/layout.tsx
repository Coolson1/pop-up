import "./globals.css";

export const metadata = {
  title: "Pop-up Kitchen",
  description: "Fresh daily menus from our pop-up kitchen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
        {children}
      </body>
    </html>
  );
}