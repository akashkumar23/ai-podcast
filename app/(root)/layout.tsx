import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from '../../components/RightSidebar';
import Image from "next/image";
import MobileNav from "@/components/MobileNav";
import { Toaster } from "@/components/ui/toaster";
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
            <section className="border-2 border-red-700 flex min-h-screen flex-1 flex-col px-4 sm:px-14">
                <div className="border-2 border-blue-500 mx-auto flex w-full mx-w-5xl flex-col max-sm:px-4">
                    <div className="border-2 border-yellow-500 flex h-16 items-center justify-between md:hidden">
                        <Image
                            src='/icons/logo.svg'
                            width={30}
                            height={30}
                            alt='logo'
                        />
                        <MobileNav/>
                    </div>
                    <div className="flex flex-col md:pd-14">
                        {/* <p className="text-white-1">Toaster</p> */}
                        <Toaster/>
                        {children}
                    </div>
                </div>
            </section>
            <RightSidebar/>
        </main>
    </div>
  );
}
