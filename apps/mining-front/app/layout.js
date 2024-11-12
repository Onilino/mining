import localFont from "next/font/local";
import "./globals.css";
import {AntdRegistry} from '@ant-design/nextjs-registry';
import {ConfigProvider} from "antd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Mining Map",
  description: "Find mining Project around you !",
};

export default function RootLayout({ children }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Drawer: {
            zIndexPopup: 1000
          },
        },
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </ConfigProvider>
  );
}
