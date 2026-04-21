'use client';

import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Side Content - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#222_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-60" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full max-w-2xl mx-auto">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-950 font-bold text-xl">
                R
              </div>
              <span className="text-2xl font-semibold tracking-tight text-white">Rentra</span>
            </Link>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-medium leading-[1.2] text-white tracking-tight">
              Manage your properties with <span className="text-zinc-400">calm and precision.</span>
            </h2>
            
            <div className="space-y-6">
              {[
                "Centralized tenant management",
                "Automated rent collection tracking",
                "Seamless maintenance workflows"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-zinc-400">
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <p className="text-lg font-light leading-none">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Rentra Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white lg:bg-transparent">
        <div className="w-full max-w-[400px]">
          {/* Logo only shows on mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
             <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-950">Rentra</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
