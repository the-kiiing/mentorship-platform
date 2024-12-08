import { UserRole } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      email: string
      name: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: UserRole
    email: string
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    email: string
    name: string
  }
}
