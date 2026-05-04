# Rentra - Modern Property Management SaaS UI

A production-ready, clean SaaS interface for the Rentra property management platform. Built with Next.js 16, React 19, and Tailwind CSS v4.

## 🎯 Project Overview

Rentra is a modern property management platform designed for landlords to streamline operations, manage properties, track tenants, handle maintenance, and monitor analytics.

### Design Inspiration
- Stripe dashboard (clean, professional)
- Notion (structured, minimal)
- Airbnb host dashboard (intuitive navigation)

## 🎨 Design System

### Color Palette
- **Primary**: Deep Indigo (#1E1B4B) - Brand identity
- **Accent**: Electric Blue (#3B82F6) - Interactive elements
- **Background**: Soft Gray (#F5F7FA) - Main canvas
- **Text**: Dark Slate (#0F172A) - Primary text
- **Success**: Emerald (#10B981) - Confirmations
- **Error**: Red (#EF4444) - Destructive actions

### Typography
- **Font Family**: Geist (modern, clean, professional)
- **Heading Scale**: 2xl (24px) to 3xl (30px)
- **Body**: 14px-16px with 1.5-1.6 line height

### UI Components
- `rounded-xl` cards with soft shadows
- Consistent spacing via Tailwind scale
- Minimal, purposeful icons from Lucide
- Clean inputs with icon support
- Responsive grid layouts

## 📁 Project Structure

```
app/
├── layout.tsx                 # Root layout with metadata
├── page.tsx                   # Home redirect to /login
├── globals.css                # Design tokens & styles
├── auth/
│   ├── layout.tsx             # Auth layout (split design)
│   ├── login/page.tsx         # Login page
│   ├── signup/page.tsx        # Signup page
│   └── forgot-password/page.tsx
├── dashboard/
│   ├── layout.tsx             # Dashboard layout (sidebar + navbar)
│   ├── page.tsx               # Main dashboard
│   ├── properties/page.tsx    # Properties management
│   ├── tenants/page.tsx       # Tenants management
│   └── settings/page.tsx      # User settings
components/
├── ui/                        # shadcn/ui components
└── [Custom components here]
```

## 🔐 Authentication Pages

### Login Page (`/auth/login`)
- Email & password input with icons
- Loading state on button
- Error message display
- "Forgot password" link
- Sign up link below divider
- Clean, distraction-free design
- Left sidebar with branding (desktop only)

### Signup Page (`/auth/signup`)
- Full name, email, password fields
- Password match validation with visual feedback
- Loading states
- Link to login page
- Consistent styling with login page

### Forgot Password Page (`/auth/forgot-password`)
- Email input
- Reset link sent confirmation
- Back to login link

**Status**: UI only - API endpoints ready for integration

## 📊 Dashboard Pages

### Main Dashboard (`/dashboard`)
Features:
- **Summary Cards** (3 cards):
  - Total Properties with count
  - Total Tenants with count
  - Rent Overview placeholder
  
- **Quick Actions**:
  - Add Property button
  - Add Tenant button
  
- **Recent Activity Section**:
  - List of recent properties added
  - List of recent tenants added
  - Activity timeline with timestamps

- **Empty State**:
  - Friendly message when no data
  - CTA buttons to create first property/tenant

### Properties Page (`/dashboard/properties`)
- Properties list/grid view
- Add property button
- Empty state with CTA
- Ready for data integration

### Tenants Page (`/dashboard/tenants`)
- Tenants management interface
- Add tenant button
- Empty state placeholder
- Ready for data integration

### Settings Page (`/dashboard/settings`)
- Profile settings (name, email, phone)
- Notification settings placeholder
- Security options (password change, 2FA)
- Save changes functionality

## 🧭 Navigation System

### Sidebar Navigation (`/dashboard/layout.tsx`)
- Fixed sidebar (64px width on desktop)
- Collapsible on mobile (hamburger menu)
- Active item highlighting
- Navigation items:
  - 🏠 Dashboard
  - 🏢 Properties
  - 👥 Tenants
  - 🔧 Repairs (disabled placeholder)
  - ⚙️ Settings
- Logout button at bottom
- User avatar display

### Top Navbar
- Mobile menu toggle
- Current page indicator
- User avatar

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sidebar collapses on mobile with overlay
- Touch-friendly buttons and inputs

### Accessibility
- Semantic HTML (main, header, nav)
- ARIA labels where needed
- Proper contrast ratios
- Keyboard navigation support
- Form labels linked to inputs

### Performance
- Component-based architecture
- Optimized images
- Minimal re-renders
- Efficient CSS with Tailwind

### UX Polish
- Smooth transitions and hover states
- Loading states on buttons
- Error messaging
- Empty states with CTAs
- Consistent spacing and alignment

## 🔗 API Integration Points

Ready for backend connection:
```javascript
// Authentication
POST /api/auth/login          // Login with email/password
POST /api/auth/register       // Create new account
POST /api/auth/forgot-password // Request password reset

// Properties
GET /api/properties           // Fetch all properties
POST /api/properties          // Create new property
PATCH /api/properties/:id     // Update property
DELETE /api/properties/:id    // Delete property

// Tenants
GET /api/tenants              // Fetch all tenants
POST /api/tenants             // Create new tenant
PATCH /api/tenants/:id        // Update tenant
DELETE /api/tenants/:id       // Delete tenant
```

### Integration Example
```typescript
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (response.ok) {
    const data = await response.json();
    // Store token, redirect to dashboard
    router.push('/dashboard');
  }
};
```

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

### Environment Variables
Create `.env.local` for API endpoints:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎨 Customization

### Colors
Edit color tokens in `/app/globals.css`:
```css
:root {
  --primary: oklch(...);        /* Primary brand color */
  --accent: oklch(...);         /* Accent color */
  --background: oklch(...);     /* Background color */
  /* ... other tokens */
}
```

### Typography
Fonts are configured in `layout.tsx`:
- Uses `Geist` for sans (body/UI)
- Uses `Geist Mono` for code

### Components
All shadcn/ui components available in `/components/ui/`

## 📱 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ✨ Next Steps for Development

1. **Connect Backend APIs**
   - Replace placeholder API calls with real endpoints
   - Implement proper error handling
   - Add loading skeletons

2. **Add Authentication**
   - Implement login/logout with JWT tokens
   - Add session management
   - Secure cookie storage

3. **Data Display**
   - Fetch and display properties
   - Render tenant information
   - Show real rent data

4. **Advanced Features**
   - Property photos upload
   - Lease document management
   - Maintenance request tracking
   - Payment history

5. **Admin Features**
   - User management
   - Billing dashboard
   - Analytics and reports

## 🔐 Security Considerations

- Use HTTPS for all API calls
- Store tokens in secure HTTP-only cookies
- Implement CSRF protection
- Validate all form inputs
- Use parameterized queries for database access
- Implement rate limiting on auth endpoints
- Add two-factor authentication option

## 📞 Support

This is an MVP-level UI designed for production use. The structure is modular and ready for:
- Team collaboration
- Feature expansion
- A/B testing
- Analytics integration

---

Built with ❤️ for modern property management
