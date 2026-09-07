import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const pixelFont = localFont({
  src: '../public/fonts/Galmuri11.woff2',
  variable: '--font-pixel',
  display: 'swap',
  weight: '400',
})

const nunitoBlack = localFont({
  src: '../public/fonts/Nunito-Black.ttf',
  variable: '--font-nunito',
  display: 'swap',
  weight: '900',
})

export const metadata: Metadata = {
  title: 'kt is AI ZEROTHON — What will you build with AI?',
  description:
    'kt is AI ZEROTHON is a premium AI hackathon. 48 hours. One question: what will you build with AI? Join builders, designers, and researchers shaping the next generation of intelligent products.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#09071c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable} ${pixelFont.variable} ${nunitoBlack.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
