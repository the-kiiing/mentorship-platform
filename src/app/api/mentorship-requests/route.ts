import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { mentorId } = await req.json()

    const mentor = await prisma.user.findUnique({
      where: {
        id: mentorId,
        role: 'MENTOR'
      }
    })

    if (!mentor) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      )
    }

    const existingRequest = await prisma.mentorshipRequest.findFirst({
      where: {
        AND: [
          { senderId: session.user.id },
          { receiverId: mentorId },
          { 
            status: {
              in: ['PENDING', 'ACTIVE']
            }
          }
        ]
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "An active or pending request already exists" },
        { status: 400 }
      )
    }

    const request = await prisma.mentorshipRequest.create({
      data: {
        senderId: session.user.id,
        receiverId: mentorId,
        status: 'PENDING'
      }
    })

    return NextResponse.json(request)
  } catch (error) {
    console.error("Mentorship request POST error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const requests = await prisma.mentorshipRequest.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Mentorship requests GET error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const { requestId, status } = await req.json()

    if (!['ACTIVE', 'COMPLETED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const request = await prisma.mentorshipRequest.findFirst({
      where: {
        id: requestId,
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      }
    })

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    if (status === 'ACTIVE' && session.user.role !== 'MENTOR') {
      return NextResponse.json(
        { error: "Only mentors can accept requests" },
        { status: 403 }
      )
    }

    if (status === 'REJECTED' && session.user.role !== 'MENTOR') {
      return NextResponse.json(
        { error: "Only mentors can reject requests" },
        { status: 403 }
      )
    }

    const updatedRequest = await prisma.mentorshipRequest.update({
      where: {
        id: requestId
      },
      data: {
        status
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Mentorship request PUT error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
