# SecrecyNote

SecrecyNote is a sleek and secure web application for sending private, encrypted notes. Built with Next.js, TypeScript, and Prisma, this open-source project provides a user-friendly interface for creating and sharing self-destructing, encrypted messages.

## Features

- Create encrypted notes with customizable expiration settings
- Password protection for added security
- Self-destructing notes that delete after viewing or a set time period
- Dark mode support
- Responsive design for desktop and mobile devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Open-source relational database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/youssefbrr/SecrecyNote.git
   cd SecrecyNote
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   DATABASE_URL="your_postgresql_database_url"
   ENCRYPTION_KEY="your_32_character_secret_key"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

SecrecyNote is designed to be easily deployed to Vercel. Follow these steps to deploy your own instance:

1. Fork this repository
2. Create a new project on Vercel and link it to your forked repository
3. Add the required environment variables (`DATABASE_URL` and `ENCRYPTION_KEY`) in the Vercel project settings
4. Deploy the project

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

Created with ❤️ by [youssefbrr](https://github.com/youssefbrr)
