'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Discover', href: '/discover' },
    // { name: 'Find Mentors', href: '/mentors' },
    { name: 'Requests', href: '/requests' },
  ]

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href={session ? "/dashboard" : "/"} 
              className="text-xl font-bold text-blue-600"
            >
              MentorMatch
            </Link>
            {session && (
              <div className="ml-10 hidden space-x-8 md:flex">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      inline-flex items-center px-1 pt-1 text-sm font-medium 
                      ${pathname === link.href
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center relative">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm focus:outline-none"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  <span className="ml-2 text-gray-700">{session.user?.name}</span>
                </button>

                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    onBlur={() => setIsDropdownOpen(false)}
                    tabIndex={-1}
                  >
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' })
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {session && (
          <div className="flex flex-wrap justify-center space-x-6 py-4 md:hidden">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  text-sm font-medium 
                  ${pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}