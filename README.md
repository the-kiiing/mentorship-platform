# Mentorship Platform

A full-stack web application built with Next.js 14, TypeScript, Tailwind CSS, and Prisma that connects mentors with mentees.

## Features

- 🔐 Secure authentication with NextAuth.js
- 👥 User roles (Mentor/Mentee)
- 📝 Profile management with skills and interests
- 🔍 Mentor discovery with search functionality
- 🤝 Mentorship request system
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔒 Protected routes with middleware
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: Headless UI
- **Icons**: Heroicons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mentorship-platform.git
cd mentorship-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard page
│   │   ├── mentors/        # Mentor discovery page
│   │   ├── profile/        # Profile management page
│   │   ├── requests/       # Mentorship requests page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions and configurations
│   └── types/             # TypeScript type definitions
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Features in Detail

### Authentication
- Secure user registration and login
- Role-based access control (Mentor/Mentee)
- Protected routes with NextAuth.js middleware

### Profile Management
- User profile creation and editing
- Skills and interests management
- Bio and personal information

### Mentor Discovery
- Search mentors by name, skills, or interests
- View mentor profiles and expertise
- Send mentorship requests

### Mentorship Requests
- Send and receive mentorship requests
- Accept or reject incoming requests
- View request status and history

### Dashboard
- Overview of mentorship activities
- Quick access to important features
- Status updates and notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# mentorship-platform
