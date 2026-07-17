import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Gap Checker",
  description: "Analyze your resume against a job description to find missing skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
