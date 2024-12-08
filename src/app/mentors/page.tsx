'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Mentor {
  id: string
  name: string
  bio: string | null
  skills: string[]
  interests: string[]
  matchScore?: number
  requestStatus?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | null
}

export default function Mentors() {
  const { data: session } = useSession()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [bestMatches, setBestMatches] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (session?.user) {
      Promise.all([fetchMatches(), fetchMentors()])
        .finally(() => setLoading(false))
    }
  }, [session])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/match')
      if (!response.ok) throw new Error('Failed to fetch matches')
      const data = await response.json()
      const processedData = data.map((mentor: any) => ({
        ...mentor,
        skills: mentor.skills || [],
        interests: mentor.interests || []
      }))
      setBestMatches(processedData.slice(0, 3))
    } catch (error) {
      setError('Failed to load matches')
    }
  }

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors')
      if (!response.ok) throw new Error('Failed to fetch mentors')
      const data = await response.json()
      const processedData = data.map((mentor: any) => ({
        ...mentor,
        skills: mentor.skills || [],
        interests: mentor.interests || []
      }))
      setMentors(processedData)
    } catch (error) {
      setError('Failed to load mentors')
    }
  }

  const handleConnect = async (mentorId: string) => {
    try {
      const response = await fetch('/api/mentorship-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId }),
      })

      if (!response.ok) throw new Error('Failed to send request')
      
      const updateStatus = (prevMentors: Mentor[]): Mentor[] => 
        prevMentors.map(mentor => 
          mentor.id === mentorId 
            ? { ...mentor, requestStatus: 'PENDING' as const }
            : mentor
        )

      setMentors(updateStatus)
      setBestMatches(updateStatus)
    } catch (error) {
      setError('Failed to send mentorship request')
    }
  }

  const getActionButton = (mentor: Mentor) => {
    switch (mentor.requestStatus) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100">
            Request Pending
          </span>
        )
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100">
            Active Mentorship
          </span>
        )
      case 'COMPLETED':
        return (
          <button
            onClick={() => handleConnect(mentor.id)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect
          </button>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100">
            Request Rejected
          </span>
        )
      default:
        return (
          <button
            onClick={() => handleConnect(mentor.id)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect
          </button>
        )
    }
  }

  const MentorCard = ({ mentor }: { mentor: Mentor }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
          {mentor.matchScore !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {mentor.matchScore}% Match
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{mentor.bio || 'No bio provided'}</p>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {(mentor.skills || []).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
            {mentor.skills.length === 0 && (
              <span className="text-sm text-gray-500">No skills listed</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Interests</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {(mentor.interests || []).map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {interest}
              </span>
            ))}
            {mentor.interests.length === 0 && (
              <span className="text-sm text-gray-500">No interests listed</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        {getActionButton(mentor)}
      </div>
    </div>
  )

  const filteredMentors = mentors.filter(mentor => {
    const searchLower = searchTerm.toLowerCase()
    return (
      mentor.name.toLowerCase().includes(searchLower) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      mentor.interests.some(interest => interest.toLowerCase().includes(searchLower))
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Find a Mentor</h2>
            <p className="mt-1 text-sm text-gray-500">
              Connect with experienced mentors who can help guide your journey.
            </p>
          </div>

          {bestMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Best Matches</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bestMatches.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">All Mentors</h3>
              <input
                type="text"
                placeholder="Search by name, skills, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-64"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No mentors found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
