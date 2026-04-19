import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js Assignment',
  description: 'Simple web app with Supabase auth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}