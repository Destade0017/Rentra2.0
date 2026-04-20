'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Building2, Loader2, ArrowRight, ShieldCheck, UserCircle, Mail, Lock, User } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'

export default function AuthPage() {
  const router = useRouter()
  const { login, register, loading, error, clearError, isAuthenticated, user } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<'landlord' | 'tenant'>('landlord')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'landlord') {
        router.push('/landlord')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (isLogin) {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        toast.success('Successfully logged in')
      } else {
        toast.error(result.message || 'Login failed')
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      const result = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role
      })
      if (result.success) {
        toast.success('Account created successfully')
      } else {
        toast.error(result.message || 'Registration failed')
      }
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

          <div className="space-y-8">
            <h1 className="text-6xl font-black text-white leading-[1.05] tracking-tight">
              Manage your <br /> <span className="text-blue-500">Empire</span> <br /> from anywhere.
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Join thousands of landlords and tenants automating their lives with Rentra's next-gen property platform.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#020617] bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
              +2k
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
            Trusted by proprietors globally.
          </p>
        </div>
      </div>

      {/* Main Content - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 bg-white relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <Building2 className="text-[#020617]" size={32} />
            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">Rentra</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Join Rentra'}
            </h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] opacity-70">
              {isLogin ? 'Sign in to continue' : 'Create your world-class account'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  type="button" 
                  onClick={() => setRole('landlord')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                      role === 'landlord' 
                        ? "border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/20" 
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                    <ShieldCheck size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Landlord</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('tenant')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                      role === 'tenant' 
                        ? "border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/20" 
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                    <UserCircle size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider">Tenant</span>
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <Input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border-slate-200 rounded-2xl py-7 pl-12 pr-4 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <Input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border-slate-200 rounded-2xl py-7 pl-12 pr-4 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
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
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <Link href="/forgot-password" className="text-xs font-bold text-blue-500 hover:text-blue-600 underline-offset-4 hover:underline transition-all">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <Input 
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-white border-slate-200 rounded-2xl py-7 pl-12 pr-4 text-sm focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium placeholder:text-slate-300 shadow-sm"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1e1b4b] hover:bg-[#2e2b5b] text-white rounded-2xl py-8 font-black text-sm shadow-2xl shadow-indigo-900/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Sign In to Rentra' : 'Create World-Class Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-bold">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-500 font-black hover:text-blue-600 underline-offset-4 hover:underline transition-all"
                >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
