'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { CheckIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

type RequestStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED'

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
  status: RequestStatus
  createdAt: string
}

export default function Requests() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<RequestStatus>('PENDING')
  const [requests, setRequests] = useState<MentorshipRequest[]>([])

  const fetchRequests = useCallback(async () => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/mentorship-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    }
  }, [session?.user])

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }
    fetchRequests()
  }, [session?.user, router, fetchRequests])

  const handleRequestAction = async (requestId: string, action: RequestStatus) => {
    try {
      const response = await fetch('/api/mentorship-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: action }),
      })

      if (response.ok) {
        fetchRequests() 
      }
    } catch (error) {
      console.error('Failed to update request:', error)
    }
  }

  const tabs = [
    { name: 'Pending', value: 'PENDING' as RequestStatus },
    { name: 'Active', value: 'ACTIVE' as RequestStatus },
    { name: 'Completed', value: 'COMPLETED' as RequestStatus },
  ]

  const filteredRequests = requests.filter(request => {
    if (!session?.user?.email) return false
    
    const isRelevant = session.user.role === 'MENTEE'
      ? request.sender.email === session.user.email
      : request.receiver.email === session.user.email
    return isRelevant && request.status === activeTab
  })

  const renderActions = (request: MentorshipRequest) => {
    if (!session?.user?.role) return null

    switch (request.status) {
      case 'PENDING':
        return session.user.role === 'MENTOR' ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleRequestAction(request.id, 'ACTIVE')}
              className="text-green-600 hover:text-green-800"
              title="Accept"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleRequestAction(request.id, 'REJECTED')}
              className="text-red-600 hover:text-red-800"
              title="Reject"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <span className="text-yellow-600">Awaiting Response</span>
        )
      case 'ACTIVE':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleRequestAction(request.id, 'COMPLETED')}
              className="text-green-600 hover:text-green-800"
              title="Mark as Completed"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              className="text-blue-600 hover:text-blue-800"
              title="Message"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
            </button>
          </div>
        )
      case 'COMPLETED':
        return <span className="text-gray-600">Completed</span>
      case 'REJECTED':
        return <span className="text-red-600">Rejected</span>
      default:
        return null
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                    ${activeTab === tab.value
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Request List */}
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500">
                    <th className="py-2">{session.user.role === 'MENTEE' ? 'MENTOR' : 'MENTEE'}</th>
                    <th className="py-2">STATUS</th>
                    <th className="py-2">DATE</th>
                    <th className="py-2">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No {activeTab.toLowerCase()} requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {session.user.role === 'MENTEE'
                                ? request.receiver.name
                                : request.sender.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.user.role === 'MENTEE'
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
                            ${request.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {request.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          {renderActions(request)}
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
