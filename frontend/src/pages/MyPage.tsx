import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useProperties'
import { useMyViewingRequests } from '../hooks/useInquiries'
import { useMe } from '../hooks/useAuth'
import useAuthStore from '../stores/authStore'
import PropertyCard from '../components/property/PropertyCard'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import type { ViewingRequestStatus } from '../types/inquiry'

type Tab = 'top' | 'favorites' | 'viewing'

const statusBadgeColor: Record<ViewingRequestStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function MyPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<Tab>('top')

  const { data: favorites, isLoading: favLoading, isError: favError } = useFavorites()
  const { data: viewingRequests, isLoading: vrLoading, isError: vrError } = useMyViewingRequests()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const displayName = user
    ? `${user.last_name} ${user.first_name}`.trim() || user.email
    : ''

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <aside className="sm:w-52 shrink-0">
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Profile */}
            <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-gray-100 bg-gray-50">
              <img
                src="/person-circle.svg"
                alt=""
                className="w-16 h-16 rounded-full bg-gray-200 p-1"
                onError={(e) => {
                  // fallback to inline SVG circle if icon not found
                  e.currentTarget.style.display = 'none'
                }}
              />
              <p className="text-sm font-semibold text-gray-800 mt-1">{displayName}</p>
            </div>

            {/* Tab links */}
            <nav className="py-2">
              <TabLink active={activeTab === 'top'} onClick={() => setActiveTab('top')}>
                {t('nav.mypage')} TOP
              </TabLink>
              <TabLink active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')}>
                {t('nav.favorites')}
              </TabLink>
              <TabLink active={activeTab === 'viewing'} onClick={() => setActiveTab('viewing')}>
                {t('viewing.sectionTitle')}
              </TabLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* TOP tab — icon grid */}
          {activeTab === 'top' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('nav.mypage')} TOP</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <IconCard
                  onClick={() => setActiveTab('favorites')}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 text-gray-600">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  }
                  label={t('nav.favorites')}
                />
                <IconCard
                  onClick={() => setActiveTab('viewing')}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-10 h-10 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  }
                  label={t('viewing.sectionTitle')}
                />
                <IconCard
                  onClick={handleLogout}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-10 h-10 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                  }
                  label={t('nav.logout')}
                />
              </div>
            </div>
          )}

          {/* Favorites tab */}
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('nav.favorites')}</h2>

              {favLoading && (
                <div className="flex justify-center py-16"><Spinner /></div>
              )}
              {favError && <ErrorMessage message={t('error.serverError')} />}
              {favorites && favorites.results.length === 0 && (
                <p className="text-gray-500 text-sm">お気に入りに登録した物件はありません</p>
              )}
              {favorites && favorites.results.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.results.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Viewing requests tab */}
          {activeTab === 'viewing' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('viewing.sectionTitle')}</h2>

              {vrLoading && (
                <div className="flex justify-center py-16"><Spinner /></div>
              )}
              {vrError && <ErrorMessage message={t('error.serverError')} />}
              {viewingRequests && viewingRequests.length === 0 && (
                <p className="text-gray-500 text-sm">{t('viewing.empty')}</p>
              )}
              {viewingRequests && viewingRequests.length > 0 && (
                <div className="space-y-3">
                  {viewingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{req.property_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {t('viewing.unit')}: {req.unit_room_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('viewing.date')}: {req.preferred_date}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeColor[req.status]}`}>
                        {req.status_display}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabLink({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-5 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-[#b8ca80]/20 text-[#7a9040] font-semibold border-l-4 border-[#b8ca80]'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  )
}

function IconCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-100 hover:border-[#b8ca80] hover:bg-[#b8ca80]/5 transition-all text-center"
    >
      {icon}
      <span className="text-sm text-gray-600">{label}</span>
    </button>
  )
}
