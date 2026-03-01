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

  // Map URL search params to API filter params
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
      <PropertyFilterBar />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <ErrorMessage message={t('error.serverError')} />
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500">
            {data.count} 件の物件
          </p>

          {data.results.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              条件に一致する物件はありません
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Simple pagination */}
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
    <div className="flex justify-center gap-3 pt-4">
      <button
        disabled={!data.previous}
        onClick={() => goToPage(currentPage - 1)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        前へ
      </button>
      <span className="flex items-center text-sm text-gray-600">
        {currentPage} ページ
      </span>
      <button
        disabled={!data.next}
        onClick={() => goToPage(currentPage + 1)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        次へ
      </button>
    </div>
  )
}
