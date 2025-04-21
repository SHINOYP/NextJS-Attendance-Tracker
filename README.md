# Sports Club Attendance System

A comprehensive attendance tracking solution for college sports clubs, built with Next.js, React, and Prisma with MongoDB.

![Sports Club Attendance System](https://github.com/yourusername/sports-club-attendance/raw/main/public/api/placeholder/800/400)

## 🚀 Overview

This web-based application helps sports coaches and club administrators efficiently track and manage student attendance across different sports teams. It features real-time attendance marking, historical data viewing, reporting capabilities, and team-specific filtering.

## ✨ Features

- **Real-time Attendance Tracking**: Mark student attendance with a simple interface
- **Team-based Management**: Organize students by sports categories (Football, Basketball, Swimming, etc.)
- **Advanced Filtering**: Search for specific students by name or roll number
- **Attendance Reports**: Generate reports for specific date ranges and teams
- **Performance Optimized**: Pagination, memoization, and efficient data handling for smooth performance
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Secure login with NextAuth.js
- **Role-based Access**: Different views for coaches, administrators, and students

## 🛠️ Tech Stack

- **Frontend**: 
  - React.js with Next.js framework
  - Tailwind CSS for styling
  - ShadCN UI components
  - Lucide React for icons

- **Backend**:
  - Next.js API routes
  - Prisma ORM
  - MongoDB database
  - NextAuth.js for authentication

- **State Management**:
  - React Context API
  - Custom hooks
  - React hooks (useState, useEffect, useMemo, useCallback)

## 📊 Screenshots

### Attendance Dashboard
![Dashboard](https://github.com/yourusername/sports-club-attendance/raw/main/public/api/placeholder/600/300)

### Team View
![Team View](https://github.com/yourusername/sports-club-attendance/raw/main/public/api/placeholder/600/300)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sports-club-attendance.git
   cd sports-club-attendance
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your MongoDB connection string, NextAuth configuration, and other settings.

4. Set up Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
sports-club-attendance/
├── app/                  # Next.js App Router (pages and routes)
├── components/           # Reusable UI components
│   ├── app-sidebar/      # Application sidebar
│   └── ui/               # ShadCN UI components
├── context/              # React Context providers
├── helpers/              # Helper functions and utilities
├── hooks/                # Custom React hooks
├── lib/                  # Library code and utilities
├── types/                # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 📝 Database Schema

The application uses Prisma with MongoDB to manage:
- User accounts and authentication
- Student records
- Team/Category information
- Attendance records
- Reports and analytics data

## 🧪 Performance Optimizations

The application includes several performance optimizations:

- **Pagination**: Efficiently handle large datasets by showing data in chunks
- **Memoization**: Prevent unnecessary recalculations with useMemo and useCallback
- **Optimized Data Fetching**: Smart fetching to reduce unnecessary API calls
- **Efficient Rendering**: Minimizing re-renders through proper React patterns
- **MongoDB Indexing**: Optimized database queries for faster data retrieval
- **Context Optimization**: Carefully structured contexts to prevent unnecessary re-renders

## 🔒 Authentication

- Secure authentication using NextAuth.js
- Support for multiple authentication providers
- Role-based access control for coaches, administrators, and students
- Session management and token handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

Developed with ❤️ for College Sports Club
