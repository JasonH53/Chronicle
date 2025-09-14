import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Willow',
  description: 'A blocky adventure in investing! Build your financial goals block by block, just like in Minecraft.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-minecraft" suppressHydrationWarning={true}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
