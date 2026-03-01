import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../stores/authStore'

export default function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            Living Hub
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('nav.properties')}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/mypage"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('nav.mypage')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
