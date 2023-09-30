import './globals.css'
import 'highlight.js/styles/base16/atelier-sulphurpool-light.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import 'katex/dist/katex.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shiro space',
  description: 'とあるエンジニアの備忘録です。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header/>
        {children}
      </body>
    </html>
  )
}
