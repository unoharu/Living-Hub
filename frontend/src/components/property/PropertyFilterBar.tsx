import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'

const LAYOUT_OPTIONS = ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK']

const RENT_RANGES = [
  { label: '〜5万円', max: 50000 },
  { label: '5〜10万円', min: 50000, max: 100000 },
  { label: '10〜15万円', min: 100000, max: 150000 },
  { label: '15万円〜', min: 150000 },
]

const fieldClass =
  'w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8ca80]'

export default function PropertyFilterBar() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('page')
    setParams(next)
  }

  function handleRentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const index = Number(e.target.value)
    const next = new URLSearchParams(params)
    next.delete('min_rent')
    next.delete('max_rent')
    next.delete('page')

    if (index >= 0) {
      const range = RENT_RANGES[index]
      if (range.min !== undefined) next.set('min_rent', String(range.min))
      if (range.max !== undefined) next.set('max_rent', String(range.max))
    }
    setParams(next)
  }

  const currentMinRent = params.get('min_rent')
  const currentMaxRent = params.get('max_rent')
  const selectedRentIndex = RENT_RANGES.findIndex(
    (r) =>
      String(r.min ?? '') === (currentMinRent ?? '') &&
      String(r.max ?? '') === (currentMaxRent ?? '')
  )

  const hasFilters = params.toString().length > 0

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        {/* Area search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="エリア（例: 渋谷区）"
            defaultValue={params.get('ward') ?? ''}
            onChange={(e) => update('ward', e.target.value)}
            className={fieldClass}
          />
        </div>

        {/* Rent range */}
        <div className="sm:w-40">
          <select
            value={selectedRentIndex >= 0 ? selectedRentIndex : ''}
            onChange={handleRentChange}
            className={fieldClass}
          >
            <option value="">{t('property.rent')}</option>
            {RENT_RANGES.map((r, i) => (
              <option key={i} value={i}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Layout */}
        <div className="sm:w-32">
          <select
            value={params.get('layout') ?? ''}
            onChange={(e) => update('layout', e.target.value)}
            className={fieldClass}
          >
            <option value="">{t('property.layout')}</option>
            {LAYOUT_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Clear button — only shown when filters are active */}
        {hasFilters && (
          <button
            onClick={() => setParams({})}
            className="shrink-0 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            クリア
          </button>
        )}
      </div>
    </div>
  )
}
