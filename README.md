# QR Wedding Snap

A web application for wedding guests to upload and share photos from Renas & Ayse's special day.

## Overview

QR Wedding Snap is a modern, responsive web application built with Next.js that allows wedding guests to easily upload photos from the wedding celebration. By scanning a QR code, guests can access the application, view the photo gallery, and contribute their own photos to create a shared memory collection.

## Features

- **Photo Upload**: Guests can easily upload photos directly from their devices
- **Gallery View**: Browse all uploaded photos in an elegant gallery format
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop devices
- **Real-time Updates**: Photos appear in the gallery immediately after upload
- **Minimal UI**: Clean, intuitive interface for all age groups
- **Email Notifications**: Automatic email notifications with attached photos when guests upload images

## Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Prisma ORM
- **Storage**: Supabase Storage for photo management
- **Authentication**: Simple, guest-friendly approach
- **Email**: Nodemailer for sending notifications
- **Hosting**: Vercel

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Copy `.env.example` to `.env.local` and fill in the required environment variables (see Environment Variables section)
4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The following environment variables are required:

### App Configuration

- `NEXT_PUBLIC_APP_URL`: The base URL of the application (e.g., https://ayserenas.dk)

### Email Configuration

- `EMAIL_HOST`: SMTP server host (e.g., smtp.gmail.com)
- `EMAIL_PORT`: SMTP port (typically 587 for TLS)
- `EMAIL_USER`: Email username/address
- `EMAIL_PASSWORD`: App-specific password for email account
- `NOTIFICATION_EMAIL`: Email to receive notifications

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_URL`: Same as NEXT_PUBLIC_SUPABASE_URL (for server-side)
- `SUPABASE_ANON_KEY`: Same as NEXT_PUBLIC_SUPABASE_ANON_KEY (for server-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for privileged operations

### Database Configuration

- `DATABASE_URL`: PostgreSQL connection string via pooler
- `DIRECT_URL`: Direct PostgreSQL connection string for Prisma CLI

## Deployment

The application is optimized for deployment on Vercel. Simply connect your repository to Vercel and ensure the environment variables are configured.

## License

This project is private and intended for personal use only.
