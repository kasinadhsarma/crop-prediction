'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sprout, Facebook, Twitter, Linkedin, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthenticatedRoute = pathname?.startsWith('/dashboard') || 
                              pathname?.startsWith('/predict') || 
                              pathname?.startsWith('/history') ||
                              pathname?.startsWith('/results')

  return (
    <html lang="en">
      <body className={`${inter.className} bg-green-50`}>
        <nav className="bg-[#1B8A3D] text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href={isAuthenticatedRoute ? "/dashboard" : "/"} className="text-xl font-bold flex items-center gap-2">
              <Sprout className="h-6 w-6" />
              Crop Yield Predictor
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticatedRoute ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>John Farmer</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-green-600 hover:text-white"
                    onClick={() => window.location.href = '/'}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-x-4">
                  <Link 
                    href="/login" 
                    className="hover:text-green-200 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="bg-green-500 hover:bg-green-400 px-6 py-2 rounded-full transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-green-800 text-white p-8 mt-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">About Us</h3>
              <p className="text-sm text-green-100">Crop Yield Predictor is at the forefront of AI-powered precision agriculture, helping farmers maximize yields and sustainability.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                {isAuthenticatedRoute ? (
                  <>
                    <li><Link href="/dashboard" className="text-green-100 hover:text-white transition-colors duration-200">Dashboard</Link></li>
                    <li><Link href="/predict" className="text-green-100 hover:text-white transition-colors duration-200">New Prediction</Link></li>
                    <li><Link href="/history" className="text-green-100 hover:text-white transition-colors duration-200">History</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/about" className="text-green-100 hover:text-white transition-colors duration-200">About</Link></li>
                    <li><Link href="/features" className="text-green-100 hover:text-white transition-colors duration-200">Features</Link></li>
                    <li><Link href="/pricing" className="text-green-100 hover:text-white transition-colors duration-200">Pricing</Link></li>
                  </>
                )}
                <li><Link href="/contact" className="text-green-100 hover:text-white transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200"><Facebook className="h-6 w-6" /></a>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200"><Twitter className="h-6 w-6" /></a>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200"><Linkedin className="h-6 w-6" /></a>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-8 pt-4 border-t border-green-700 text-center text-sm text-green-100">
            © 2023 Crop Yield Predictor. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}

