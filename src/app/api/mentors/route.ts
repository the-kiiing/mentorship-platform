import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const mentors = await prisma.user.findMany({
      where: {
        role: 'MENTOR',
        NOT: {
          id: session.user.id 
        }
      },
      include: {
        profile: {
          include: {
            skills: true,
            interests: true,
          }
        },
        receivedRequests: {
          where: {
            senderId: session.user.id
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            status: true
          }
        }
      }
    })

    const transformedMentors = mentors.map(mentor => ({
      id: mentor.id,
      name: mentor.name,
      bio: mentor.profile?.bio,
      skills: mentor.profile?.skills.map(s => s.name) || [],
      interests: mentor.profile?.interests.map(i => i.name) || [],
      requestStatus: mentor.receivedRequests[0]?.status || null
    }))

    return NextResponse.json(transformedMentors)
  } catch (error) {
    console.error("Mentors GET error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
