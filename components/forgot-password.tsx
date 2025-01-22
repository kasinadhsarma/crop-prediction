// app/components/forgot-password.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data: ForgotPasswordResponse = await response.json()

      if (data.success) {
        setMessage({
          text: 'Password reset link has been sent to your email',
          type: 'success'
        })
        setTimeout(() => router.push('/login'), 3000)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to send reset link',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={isLoading}
        />
      </div>

      {message && (
        <div className={`p-3 rounded text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending Reset Link...' : 'Reset Password'}
      </Button>

      <div className="text-center text-sm">
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => router.push('/login')}
          type="button"
        >
          Back to Login
        </Button>
      </div>
    </form>
  )
}