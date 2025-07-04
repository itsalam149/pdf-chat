import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Get Started
          </h1>
          <p className="text-gray-600">Create your account to start chatting with PDFs</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/60 backdrop-blur-sm border-sky-100 shadow-xl",
            },
          }}
        />
      </div>
    </div>
  )
}
