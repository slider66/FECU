# QR Wedding Snap 💒📸

A modern wedding photo-sharing application built with Next.js that makes it easy for guests to upload and share photos from the wedding.

## 🎯 Features

- **Photo Upload**: Guests can easily upload their photos from the wedding
- **Gallery**: Private gallery to view all uploaded photos
- **Validation**: Maximum 10 photos per upload with Zod validation
- **Real-time Updates**: Photos appear immediately after upload
- **Responsive Design**: Works on all devices
- **Secure Storage**: Photos are securely stored in Supabase Storage
- **Database**: PostgreSQL with Prisma ORM for metadata management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js (v20 or newer)
- npm or yarn
- Supabase account
- PostgreSQL database

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-wedding-snap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root of the project:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Database
   DATABASE_URL=your_database_url
   DIRECT_URL=your_direct_database_url

   # Email (optional)
   GOOGLE_EMAIL=your_email
   GOOGLE_APP_PASSWORD=your_app_password
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Feature Details

### Upload System
- Maximum 10 photos per upload
- Validation with Zod schema
- Automatic optimization and compression
- Real-time feedback during upload
- Error handling

### Gallery
- Responsive grid layout
- Lazy loading of images
- Loading states
- Optimized with Next.js Image

## 📜 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🔒 Security

- Environment variables for sensitive data
- Service role key for server-side operations
- Input validation with Zod
- Secure file upload to Supabase Storage

## 📝 License

MIT License - Open Source

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
