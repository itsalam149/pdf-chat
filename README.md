# 📚 PDF Chat App

> Transform your PDFs into interactive conversations with AI-powered document analysis

[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🚀 Core Functionality
- **PDF Upload & Processing** - Seamlessly upload and parse PDF documents
- **Intelligent Chat Interface** - Ask questions and get contextual answers from your PDFs
- **Real-time Conversations** - Interactive chat experience with instant responses
- **Document Analysis** - AI-powered content extraction and understanding

### 🎨 User Experience
- **Modern UI/UX** - Clean, responsive design with Radix UI components
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Drag & Drop** - Easy file upload with intuitive dropzone interface
- **Authentication** - Secure user authentication with Clerk
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 🔧 Technical Features
- **AI Integration** - Powered by Google AI SDK for intelligent responses
- **Database** - Supabase integration for data persistence
- **Form Handling** - React Hook Form with Zod validation
- **Animations** - Smooth transitions with Framer Motion
- **Toast Notifications** - User feedback with Sonner

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **PDF Processing**: PDF.js & React-PDF

### Backend & Services
- **Database**: Supabase
- **Authentication**: Clerk
- **AI**: Google AI SDK
- **File Handling**: React Dropzone

### Development
- **Build Tool**: Next.js built-in compiler
- **Linting**: ESLint
- **Package Manager**: npm/yarn/pnpm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- Clerk account
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/itsalam149/pdf-chat.git
   cd pdf-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Workflow

1. **Sign Up/Login** - Create an account or sign in with Clerk authentication
2. **Upload PDF** - Drag and drop or select a PDF file to upload
3. **Wait for Processing** - The app will extract and analyze the document content
4. **Start Chatting** - Ask questions about your PDF and get intelligent responses
5. **Manage Documents** - View, organize, and chat with multiple PDFs

### Example Questions
- "What is the main topic of this document?"
- "Summarize the key points from chapter 3"
- "Find information about [specific topic]"
- "What are the conclusions mentioned in this paper?"

## 🎨 UI Components

This project uses a comprehensive set of Radix UI components:

- **Layout**: Accordion, Collapsible, Separator, Tabs
- **Forms**: Checkbox, Radio Group, Select, Slider, Switch
- **Navigation**: Dropdown Menu, Navigation Menu, Menubar
- **Feedback**: Alert Dialog, Toast, Tooltip, Progress
- **Data Display**: Avatar, Aspect Ratio, Scroll Area
- **Overlays**: Dialog, Popover, Hover Card

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
pdf-chat-app/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
│   ├── ui/            # UI components
│   └── ...            # Feature components
├── lib/               # Utilities and configurations
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Clerk](https://clerk.com/) for authentication
- [Supabase](https://supabase.com/) for backend services
- [Google AI](https://ai.google.dev/) for AI capabilities

## 📧 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at alam014916@gmail.com
- Check out our documentation

---

<div align="center">
  <b>Made with by [Alam]</b>
  <br>
  <a href="https://github.com/itsalam149/pdf-chat">⭐ Star this repo if you found it helpful!</a>
</div>