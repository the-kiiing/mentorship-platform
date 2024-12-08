'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TagInput from '@/components/TagInput'
import { SKILLS, INTERESTS } from '@/constants/options'

interface ProfileData {
  bio: string | null
  skills: string[]
  interests: string[]
}

export default function Profile() {
  const { status, data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData>({
    bio: '',
    skills: [],
    interests: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitState, setSubmitState] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch profile')
      }
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const bio = formData.get('bio') as string

    setError(null)
    setSubmitState('saving')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio,
          skills: profile.skills,
          interests: profile.interests,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      const data = await response.json()
      setProfile(data)
      
      setSubmitState('saved')
      setTimeout(() => {
        setSubmitState('idle')
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
      setSubmitState('idle')
    }
  }

  const handleAddSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }))
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: [...prev.interests, interest]
    }))
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Your Profile</h2>
            
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={profile.bio || ''}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <div className="mt-1">
                  <TagInput
                    tags={profile.skills}
                    suggestions={SKILLS}
                    onAddTag={handleAddSkill}
                    onRemoveTag={handleRemoveSkill}
                    placeholder="Add a skill"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interests</label>
                <div className="mt-1">
                  <TagInput
                    tags={profile.interests}
                    suggestions={INTERESTS}
                    onAddTag={handleAddInterest}
                    onRemoveTag={handleRemoveInterest}
                    placeholder="Add an interest"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitState === 'saving'}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                    ${submitState === 'saving' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                >
                  {submitState === 'saving' 
                    ? 'Saving...' 
                    : submitState === 'saved' 
                    ? 'Saved Successfully' 
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}