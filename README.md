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
- Docker and Docker Compose (optional, for containerized deployment)

### Environment Variables

Before running the application, you need to set up your environment variables:

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

   ```env
   # Database connection string
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/securenotes?schema=public"

   # 32-character encryption key for securing notes
   ENCRYPTION_KEY="your_32_character_secret_key_here"
   ```

   Note: Make sure to generate a secure 32-character encryption key for production use.

### Installation

#### Option 1: Local Development

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

3. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

#### Option 2: Docker Deployment

1. Clone the repository:

   ```bash
   git clone https://github.com/youssefbrr/SecrecyNote.git
   cd SecrecyNote
   ```

2. Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

3. Choose your deployment mode:

   **Production Mode:**

   ```bash
   # Build and run for production
   npm run docker:prod
   ```

   **Development Mode with Hot Reload:**

   ```bash
   # Build and run for development with hot reload
   npm run docker:dev
   ```

   Both modes will:

   - Start a PostgreSQL database container
   - Build and start the SecrecyNote application
   - Make the application available on port 3001

   The key difference is that development mode:

   - Enables hot reload (changes to your code are reflected immediately)
   - Mounts your local code into the container
   - Uses a separate database volume for development

4. Access the application at [http://localhost:3001](http://localhost:3001)

To stop the containers:

```bash
# For production
npm run docker:prod:down

# For development
npm run docker:dev:down
```

To view logs:

```bash
# For production
docker-compose logs -f

# For development
docker-compose -f docker-compose.dev.yml logs -f
```

To rebuild the containers after making changes to Dockerfile or dependencies:

```bash
# For production
docker-compose up -d --build

# For development
docker-compose -f docker-compose.dev.yml up -d --build
```

### Docker Configuration

The application provides two Docker Compose configurations:

1. **Production Mode** (`docker-compose.yml`):

   - Optimized for production use
   - Multi-stage build for smaller image size
   - No source code mounting
   - Standalone Next.js server

2. **Development Mode** (`docker-compose.dev.yml`):
   - Hot reload enabled
   - Source code mounted from host
   - Faster rebuild times
   - Ideal for development and testing

Each configuration includes:

- **app**: The Next.js application

  - Runs on port 3001 (host) -> 3000 (container)
  - Depends on the database service

- **db**: PostgreSQL database
  - Uses PostgreSQL 15
  - Runs on port 5432
  - Includes health checks
  - Persists data using Docker volumes

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
