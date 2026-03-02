import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../stores/authStore'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const displayName = user
    ? `${user.last_name} ${user.first_name}`.trim() || user.email
    : ''

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar: lang switcher + auth links */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-8 items-center justify-between">
            <span className="text-xs text-gray-500 hidden sm:block">
              LIVING HUB — 不動産物件情報サイト
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <LanguageSwitcher />

              {isAuthenticated ? (
                <>
                  <span className="text-gray-300 text-xs">|</span>
                  <span className="text-xs text-gray-600 hidden sm:block">{displayName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-300 text-xs">|</span>
                  <Link
                    to="/login"
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: logo + main nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-[#1a1f2e]">LIVING HUB</span>
              <span className="text-[9px] font-medium tracking-[0.15em] text-[#b8ca80] uppercase">
                Premium Properties
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden sm:flex items-center gap-6">
              <NavLink to="/properties">{t('nav.properties')}</NavLink>
              <NavLink to="/bulletin">{t('nav.bulletin')}</NavLink>
              {isAuthenticated && (
                <NavLink to="/mypage">{t('nav.mypage')}</NavLink>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="メニューを開く"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-3 px-4 space-y-1 bg-white">
            <MobileNavLink to="/properties" onClose={() => setMenuOpen(false)}>
              {t('nav.properties')}
            </MobileNavLink>
            <MobileNavLink to="/bulletin" onClose={() => setMenuOpen(false)}>
              {t('nav.bulletin')}
            </MobileNavLink>

            {isAuthenticated ? (
              <>
                <MobileNavLink to="/mypage" onClose={() => setMenuOpen(false)}>
                  {t('nav.mypage')}
                </MobileNavLink>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout() }}
                  className="block w-full text-left text-sm font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClose={() => setMenuOpen(false)}>
                  {t('nav.login')}
                </MobileNavLink>
                <MobileNavLink to="/register" onClose={() => setMenuOpen(false)}>
                  {t('nav.register')}
                </MobileNavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  to,
  onClose,
  children,
}: {
  to: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="block text-sm font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50"
    >
      {children}
    </Link>
  )
}
