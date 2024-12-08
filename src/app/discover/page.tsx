'use client'

import { useEffect, useState } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'

type User = {
  id: string
  name: string
  email: string
  role: 'MENTOR' | 'MENTEE'
  profile: {
    bio: string | null
    skills: { name: string }[]
    interests: { name: string }[]
  } | null
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/discover')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const mentors = users.filter(user => user.role === 'MENTOR')
  const mentees = users.filter(user => user.role === 'MENTEE')

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const UserCard = ({ user }: { user: User }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <UserCircleIcon className="h-12 w-12 text-gray-400" />
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
      </div>
      
      {user.profile?.bio && (
        <p className="text-gray-600 mb-4">{user.profile.bio}</p>
      )}

      {user.profile?.skills && user.profile.skills.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {user.profile.skills.map(skill => (
              <span 
                key={skill.name}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.profile?.interests && user.profile.interests.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {user.profile.interests.map(interest => (
              <span 
                key={interest.name}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {interest.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Discover</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(mentor => (
            <UserCard key={mentor.id} user={mentor} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mentees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentees.map(mentee => (
            <UserCard key={mentee.id} user={mentee} />
          ))}
        </div>
      </section>
    </div>
  )
}
