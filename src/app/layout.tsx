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
      <body className="min-h-screen bg-[#FDFCFB] text-[#1C1C1C] selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}