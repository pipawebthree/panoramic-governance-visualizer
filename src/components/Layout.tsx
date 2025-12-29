import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Flywheel' },
    { path: '/simulator', label: 'Epoch Simulator' },
    { path: '/glossary', label: 'Glossary' },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="border-b border-dark-border bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-heading font-bold text-dark-accent hover:text-dark-accentHover transition-smooth">
                Panoramic Governance
              </Link>
              <div className="flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                      location.pathname === item.path
                        ? 'bg-dark-accent text-black'
                        : 'text-dark-textMuted hover:text-dark-text hover:bg-dark-surfaceHover'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

