import LeftSidebar from "@/components/LeftSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
        <main className="flex relative bg-black-3">
            {/* LEFTSIDEBAR
            MAIN
            RIGHTSIDEBAR */}
            <LeftSidebar/>
            <section>

            </section>
            {children}
            <p className="text-white-1">Right</p>
        </main>
    </div>
  );
}
