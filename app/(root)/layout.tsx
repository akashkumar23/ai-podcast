export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <main>
            {/* LEFTSIDEBAR
            MAIN
            RIGHTSIDEBAR */}
            <p className="text-white-1">Left</p>
            {children}
            <p className="text-white-1">Right</p>
        </main>
    </div>
  );
}
