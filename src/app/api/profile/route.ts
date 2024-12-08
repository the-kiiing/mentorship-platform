import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        skills: true,
        interests: true,
      }
    })

    if (!profile) {
      const newProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          bio: '',
        },
        include: {
          skills: true,
          interests: true,
        }
      })

      return new NextResponse(
        JSON.stringify({
          bio: newProfile.bio,
          skills: newProfile.skills.map(s => s.name),
          interests: newProfile.interests.map(i => i.name),
        })
      )
    }

    return new NextResponse(
      JSON.stringify({
        bio: profile.bio,
        skills: profile.skills.map(s => s.name),
        interests: profile.interests.map(i => i.name),
      })
    )
  } catch (error) {
    console.error("Profile GET error:", error)
    return new NextResponse(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      )
    }

    const { bio, skills, interests } = await req.json()

    const profile = await prisma.profile.upsert({
      where: {
        userId: session.user.id
      },
      create: {
        userId: session.user.id,
        bio,
        skills: {
          connectOrCreate: skills.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        },
        interests: {
          connectOrCreate: interests.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      update: {
        bio,
        skills: {
          set: [],
          connectOrCreate: skills.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        },
        interests: {
          set: [],
          connectOrCreate: interests.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: {
        skills: true,
        interests: true,
      }
    })

    return new NextResponse(
      JSON.stringify({
        bio: profile.bio,
        skills: profile.skills.map(s => s.name),
        interests: profile.interests.map(i => i.name),
      })
    )
  } catch (error) {
    console.error("Profile PUT error:", error)
    return new NextResponse(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    )
  }
}
