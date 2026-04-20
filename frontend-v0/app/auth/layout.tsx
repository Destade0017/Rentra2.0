export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex items-center justify-center bg-primary text-white p-12">
        <div className="space-y-8 max-w-md">
          <div>
            <h1 className="text-4xl font-bold mb-2">Rentra</h1>
            <p className="text-lg opacity-90">Modern Property Management</p>
          </div>
          <div className="space-y-4 opacity-80">
            <p className="text-base">
              Streamline your property operations with our intuitive platform designed for modern landlords.
            </p>
            <ul className="space-y-2 text-sm">
              <li>✓ Manage multiple properties</li>
              <li>✓ Track tenants and rent</li>
              <li>✓ Handle maintenance requests</li>
              <li>✓ Real-time analytics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        {children}
      </div>
    </div>
  );
}
