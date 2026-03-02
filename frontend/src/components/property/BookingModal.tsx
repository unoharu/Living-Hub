import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateViewingRequest } from '../../hooks/useInquiries'

interface BookingModalProps {
  unitId: number | null
  unitLabel: string
  onClose: () => void
}

export default function BookingModal({ unitId, unitLabel, onClose }: BookingModalProps) {
  const { t } = useTranslation()
  const [preferredDate, setPreferredDate] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const mutation = useCreateViewingRequest()

  // Close on ESC
  useEffect(() => {
    if (unitId === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [unitId, onClose])

  // Reset form each time the modal opens for a new unit
  useEffect(() => {
    if (unitId !== null) {
      setPreferredDate('')
      setMessage('')
      setSuccess(false)
    }
  }, [unitId])

  if (unitId === null) return null

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await mutation.mutateAsync({
      unit: unitId!,
      preferred_date: preferredDate,
      message: message || undefined,
    })
    setSuccess(true)
    // Auto-close after 3 seconds
    setTimeout(onClose, 3000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full sm:max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('inquiry.title')}</h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">{unitLabel}</p>

        {success ? (
          <div className="py-6 text-center">
            <p className="text-green-600 font-medium">{t('inquiry.success')}</p>
            <p className="text-xs text-gray-400 mt-1">自動で閉じます…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inquiry.preferredDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                min={today}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8ca80]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('inquiry.message')}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8ca80] resize-none"
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-500">{t('inquiry.error')}</p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #b8ca80, #8fa84e)' }}
            >
              {mutation.isPending ? t('inquiry.submitting') : t('inquiry.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
