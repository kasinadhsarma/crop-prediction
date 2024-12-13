import { SignupForm } from '@/components/signup-form'

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <div className="max-w-md mx-auto">
        <SignupForm />
      </div>
    </div>
  )
}

