import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.mentorshipRequest.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.interest.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  const skills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'Machine Learning',
    'Data Science',
    'DevOps',
    'Cloud Computing'
  ]

  const createdSkills = await Promise.all(
    skills.map(name => 
      prisma.skill.create({
        data: { name }
      })
    )
  )

  const interests = [
    'Web Development',
    'Mobile Development',
    'Artificial Intelligence',
    'Blockchain',
    'Cybersecurity',
    'UI/UX Design',
    'Game Development',
    'Cloud Architecture',
    'Data Analytics',
    'Open Source'
  ]

  const createdInterests = await Promise.all(
    interests.map(name =>
      prisma.interest.create({
        data: { name }
      })
    )
  )

  const mentors = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.MENTOR,
      profile: {
        bio: 'Senior Software Engineer with 10 years of experience in web development',
        skills: [createdSkills[0], createdSkills[1], createdSkills[2]],
        interests: [createdInterests[0], createdInterests[5]]
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.MENTOR,
      profile: {
        bio: 'Data Scientist specializing in machine learning and AI',
        skills: [createdSkills[6], createdSkills[7]],
        interests: [createdInterests[2], createdInterests[8]]
      }
    }
  ]

  for (const mentor of mentors) {
    await prisma.user.create({
      data: {
        name: mentor.name,
        email: mentor.email,
        password: mentor.password,
        role: mentor.role,
        profile: {
          create: {
            bio: mentor.profile.bio,
            skills: {
              connect: mentor.profile.skills.map(skill => ({ id: skill.id }))
            },
            interests: {
              connect: mentor.profile.interests.map(interest => ({ id: interest.id }))
            }
          }
        }
      }
    })
  }

  const mentees = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.MENTEE,
      profile: {
        bio: 'Junior developer looking to improve web development skills',
        skills: [createdSkills[0]],
        interests: [createdInterests[0], createdInterests[1]]
      }
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.MENTEE,
      profile: {
        bio: 'Aspiring data scientist interested in AI and machine learning',
        skills: [createdSkills[7]],
        interests: [createdInterests[2], createdInterests[8]]
      }
    }
  ]

  for (const mentee of mentees) {
    await prisma.user.create({
      data: {
        name: mentee.name,
        email: mentee.email,
        password: mentee.password,
        role: mentee.role,
        profile: {
          create: {
            bio: mentee.profile.bio,
            skills: {
              connect: mentee.profile.skills.map(skill => ({ id: skill.id }))
            },
            interests: {
              connect: mentee.profile.interests.map(interest => ({ id: interest.id }))
            }
          }
        }
      }
    })
  }

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
