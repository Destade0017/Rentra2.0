'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email })
      if (response.data.success) {
        setSuccess(true)
        toast.success(response.data.message || 'Reset link sent')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Sidebar - Branding (Premium Dark Theme) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#020617] p-12 flex-col justify-between relative overflow-hidden border-r border-white/5">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 text-white">
          <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tight text-white uppercase italic">Rentra</span>
          </Link>

          <div className="space-y-8 mt-12">
            <h1 className="text-6xl font-black text-white leading-[1.05] tracking-tight">
              Password <br /> <span className="text-blue-500">Recovery</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Don't worry, even the greatest landlords sometimes forget their keys. We'll help you get back into your empire.
            </p>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Secure & Fast Access Recovery.
          </p>
        </div>
      </div>

      {/* Main Content - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 bg-white relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-500 mb-8 transition-colors">
             <ArrowLeft size={16} className="mr-2" /> Back to Login
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <Building2 className="text-[#020617]" size={32} />
            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">Rentra</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Forgot Password
            </h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] opacity-70">
              Enter your email to receive a reset link
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center space-y-4">
               <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-800">Check Your Email</h3>
               <p className="text-slate-500 text-sm font-medium">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
               </p>
               <Button 
                onClick={() => router.push('/')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-6 font-bold mt-4"
              >
                Return to Login
              </Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-slate-200 rounded-2xl py-7 pl-12 pr-4 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1e1b4b] hover:bg-[#2e2b5b] text-white rounded-2xl py-8 font-black text-sm shadow-2xl shadow-indigo-900/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group mt-6"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
