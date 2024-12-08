import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Skill, Interest, User, Profile } from "@prisma/client";

interface MentorWithProfile extends User {
  profile: (Profile & {
    skills: Skill[];
    interests: Interest[];
  }) | null;
}

interface MentorWithScore extends MentorWithProfile {
  matchScore: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: {
          include: {
            skills: true,
            interests: true,
          },
        },
      },
    });

    if (!currentUser?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const userProfile = currentUser.profile as Profile & {
      skills: Skill[];
      interests: Interest[];
    };

    const mentors = await prisma.user.findMany({
      where: {
        role: "MENTOR",
        NOT: {
          id: currentUser.id,
        },
      },
      include: {
        profile: {
          include: {
            skills: true,
            interests: true,
          },
        },
      },
    }) as MentorWithProfile[];

    const mentorsWithScores = mentors.map((mentor: MentorWithProfile): MentorWithScore => {
      if (!mentor.profile) return { ...mentor, matchScore: 0 };

      const commonSkills = mentor.profile.skills.filter((skill: Skill) =>
        userProfile.skills.some((userSkill: Skill) => userSkill.id === skill.id)
      );

      const commonInterests = mentor.profile.interests.filter((interest: Interest) =>
        userProfile.interests.some(
          (userInterest: Interest) => userInterest.id === interest.id
        )
      );

      const matchScore =
        (commonSkills.length * 2 + commonInterests.length) /
        (2 * Math.max(userProfile.skills.length, mentor.profile.skills.length) +
          Math.max(userProfile.interests.length, mentor.profile.interests.length));

      return {
        ...mentor,
        matchScore: Math.round(matchScore * 100),
      };
    });

    const sortedMentors = mentorsWithScores.sort(
      (a: MentorWithScore, b: MentorWithScore) => b.matchScore - a.matchScore
    );

    return NextResponse.json(sortedMentors);
  } catch (error) {
    console.error("Error in match API:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
