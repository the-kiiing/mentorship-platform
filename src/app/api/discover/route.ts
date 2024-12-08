import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: {
          include: {
            skills: true,
            interests: true
          }
        }
      }
    })

    const sanitizedUsers = users.map(user => {
      const { password, ...rest } = user
      return rest
    })

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
