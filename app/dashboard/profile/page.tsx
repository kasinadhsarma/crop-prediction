'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    password: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/profile')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulated API call to update profile
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      alert('Profile updated successfully!')
      router.push('/dashboard') // Redirect to dashboard
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-md shadow-md mt-8 max-w-lg">
      <form onSubmit={handleSubmit}>
        <Image
          src="/path/to/profile-pic.jpg" // Replace with dynamic user image
          alt="Profile Picture"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="mt-1"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="mt-1"
          />
        </div>

        {/* Bio Input */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <Input
            id="bio"
            name="bio"
            value={user.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            className="mt-1"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter new password"
            className="mt-1"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
          disabled={isSaving}
        >
            </Button>
      </form>
    </div>
  )
}
