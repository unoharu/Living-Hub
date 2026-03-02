import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/property/PropertyCard'
import PropertyFilterBar from '../components/property/PropertyFilterBar'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import type { PropertyFilterParams } from '../types/api'

export default function PropertyListPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()

  const filters: PropertyFilterParams = {
    ward: params.get('ward') || undefined,
    min_rent: params.get('min_rent') ? Number(params.get('min_rent')) : undefined,
    max_rent: params.get('max_rent') ? Number(params.get('max_rent')) : undefined,
    layout: params.get('layout') || undefined,
    page: params.get('page') ? Number(params.get('page')) : undefined,
  }

  const { data, isLoading, isError } = useProperties(filters)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">物件一覧</h1>
          {data && (
            <p className="mt-1 text-sm text-gray-500">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ background: '#b8ca80' }}
              >
                {data.count}件
              </span>
              {' '}の物件が見つかりました
            </p>
          )}
        </div>
      </div>

      <PropertyFilterBar />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && <ErrorMessage message={t('error.serverError')} />}

      {data && (
        <>
          {data.results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
              <p className="text-sm">条件に一致する物件はありません</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <Pagination data={data} currentPage={Number(params.get('page') ?? 1)} />
        </>
      )}
    </div>
  )
}

function Pagination({
  data,
  currentPage,
}: {
  data: { count: number; next: string | null; previous: string | null }
  currentPage: number
}) {
  const [, setParams] = useSearchParams()

  function goToPage(page: number) {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
  }

  if (!data.next && !data.previous) return null

  return (
    <div className="flex justify-center items-center gap-3 pt-6">
      <button
        disabled={!data.previous}
        onClick={() => goToPage(currentPage - 1)}
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        前へ
      </button>
      <span className="text-sm font-medium text-gray-500 tabular-nums">
        {currentPage} ページ
      </span>
      <button
        disabled={!data.next}
        onClick={() => goToPage(currentPage + 1)}
        className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        次へ
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  )
}
