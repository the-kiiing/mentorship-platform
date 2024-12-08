import './globals.css'
import type { Metadata } from 'next'
// import { Roboto } from 'next/font/google'
import localFont from 'next/font/local'
import Navigation from '@/components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import AuthProvider from '@/components/AuthProvider'

// const inter = Roboto({
//   subsets: ['latin'],
//   display: 'swap',
//   preload: true,
//   weight: ['400', '500', '700'],
//   adjustFontFallback: true,
// })

const roboto = localFont({
  src: [
    {
      path: '../fonts/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    // {
    //   path: './public/fonts/Roboto-Medium.ttf',
    //   weight: '500',
    //   style: 'normal',
    // },
    // {
    //   path: './public/fonts/Roboto-Bold.ttf',
    //   weight: '700',
    //   style: 'normal',
    // },
    // Add more variations as needed
  ],
  variable: '--font-roboto', 
})

export const metadata: Metadata = {
  title: 'MentorMatch - Find Your Perfect Mentor',
  description: 'Connect with experienced mentors who can guide you through your professional journey.',
  keywords: 'mentorship, mentor, mentee, professional development, career growth, learning',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={`h-full bg-gray-50`}>
      <body className={`${roboto.className} h-full`}>
        <AuthProvider session={session}>
          <div className="min-h-full">
            <Navigation />
            <main>{children}</main>
            {/* <footer className="bg-white mt-auto">
              <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="mt-8 md:order-1 md:mt-0">
                  <p className="text-center text-xs leading-5 text-gray-500">
                    &copy; {new Date().getFullYear()} MentorMatch. All rights reserved.
                  </p>
                </div>
              </div>
            </footer> */}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
