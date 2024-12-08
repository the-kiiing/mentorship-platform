'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, useCallback } from 'react'

interface MentorshipRequest {
  id: string
  sender: {
    name: string
    email: string
  }
  receiver: {
    name: string
    email: string
  }
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED'
  createdAt: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<MentorshipRequest[]>([])

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/mentorship-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const quickActions = [
    ...(session?.user?.role === 'MENTEE' ? [
      {
        title: 'Find Mentors',
        description: 'Browse and connect with mentors in your field of interest',
        icon: UsersIcon,
        href: '/mentors',
        color: 'bg-blue-50'
      }
    ] : []),
    {
      title: 'Update Profile',
      description: 'Keep your profile up to date to find better matches',
      icon: UserIcon,
      href: '/profile',
      color: 'bg-purple-50'
    },
    {
      title: 'Mentorship Requests',
      description: 'Manage your mentorship connections and requests',
      icon: ClockIcon,
      href: '/requests',
      color: 'bg-green-50'
    }
  ]

  const relevantRequests = requests.filter(request => {
    if (!session?.user?.email) return false
    
    if (session?.user?.role === 'MENTEE') {
      return request.sender.email === session.user.email
    } else {
      return request.receiver.email === session.user.email
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            You are registered as a {session?.user?.role?.toLowerCase()}.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`${action.color} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center">
                <action.icon className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Mentorship Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="py-2">{session?.user?.role === 'MENTEE' ? 'MENTOR' : 'MENTEE'}</th>
                    <th className="py-2">STATUS</th>
                    <th className="py-2">START DATE</th>
                    <th className="py-2">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {relevantRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No mentorship activity found.
                      </td>
                    </tr>
                  ) : (
                    relevantRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session?.user?.role === 'MENTEE' 
                                ? request.receiver.name 
                                : request.sender.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session?.user?.role === 'MENTEE'
                                ? request.receiver.email
                                : request.sender.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${request.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                            ${request.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {request.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <Link
                            href="/requests"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
