import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"Revenue Agent OS",description:"Local-first AI agent workspace for software company revenue operations"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>}
