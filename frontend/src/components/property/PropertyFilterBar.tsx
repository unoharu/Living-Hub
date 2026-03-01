import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'

const LAYOUT_OPTIONS = ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK']

const RENT_RANGES = [
  { label: '〜5万円', max: 50000 },
  { label: '5〜10万円', min: 50000, max: 100000 },
  { label: '10〜15万円', min: 100000, max: 150000 },
  { label: '15万円〜', min: 150000 },
]

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
    // Reset page when filter changes
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

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Ward / area search */}
      <input
        type="text"
        placeholder="エリア（例: 渋谷区）"
        defaultValue={params.get('ward') ?? ''}
        onChange={(e) => update('ward', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Rent range */}
      <select
        value={selectedRentIndex >= 0 ? selectedRentIndex : ''}
        onChange={handleRentChange}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('property.rent')}</option>
        {RENT_RANGES.map((r, i) => (
          <option key={i} value={i}>
            {r.label}
          </option>
        ))}
      </select>

      {/* Layout */}
      <select
        value={params.get('layout') ?? ''}
        onChange={(e) => update('layout', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('property.layout')}</option>
        {LAYOUT_OPTIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {/* Clear all filters */}
      {params.toString() && (
        <button
          onClick={() => setParams({})}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          クリア
        </button>
      )}
    </div>
  )
}
