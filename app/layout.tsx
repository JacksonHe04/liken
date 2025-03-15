// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChatProvider } from "@/contexts/chat-context"
import Image from "next/image";
import ChatButton from "@/components/ChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LIKEN | LLM 驱动的交互式知识引擎（Powered by Next.js）",
  description: "基于 Next.js 的大模型交互知识引擎",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <ChatProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-2">
                  <SidebarTrigger className="-ml-1" />
                  <ChatButton />
                </div>
                <Image src="/next.svg" alt="Next.js icon" width={90} height={36}/>
              </header>
              <Separator orientation="horizontal" className="my-2" />
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </ChatProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}