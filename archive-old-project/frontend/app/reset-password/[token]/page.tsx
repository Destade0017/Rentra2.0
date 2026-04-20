'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, Loader2, ArrowLeft, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { 
        password: formData.password 
      })
      if (response.data.success) {
        toast.success(response.data.message || 'Password updated successfully')
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The link might be expired.')
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
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tight text-white uppercase italic">Rentra</span>
          </div>

          <div className="space-y-8 mt-12">
            <h1 className="text-6xl font-black text-white leading-[1.05] tracking-tight">
              Secure <br /> <span className="text-blue-500">Access</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Create a new strong password to secure your account. Don't share it with anyone.
            </p>
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Bank-level security standards.
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
              Reset Password
            </h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] opacity-70">
              Enter your new credentials
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white border-slate-200 rounded-2xl py-7 pl-12 pr-12 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <Input 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="w-full bg-white border-slate-200 rounded-2xl py-7 pl-12 pr-4 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1e1b4b] hover:bg-[#2e2b5b] text-white rounded-2xl py-8 font-black text-sm shadow-2xl shadow-indigo-900/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
            </Button>
          </form>

        </div>
      </div>
    </div>
  )
}
