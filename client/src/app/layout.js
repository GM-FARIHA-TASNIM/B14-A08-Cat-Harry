import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import ToastProvider from "@/providers/toast-provider";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata = {
  title: "StudioSpace | Creative Spaces, Shared",
  description:
    "Discover and book creative studios, photography spaces, podcast rooms, music suites and production workspaces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
