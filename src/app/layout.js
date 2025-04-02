import { Geist, Geist_Mono } from "next/font/google";
import "@/src/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "../context/userContex";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Circle connect",
  description: "Platform for bloggers",
};

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <UserProvider>{children}</UserProvider>
          <ToastContainer />
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
