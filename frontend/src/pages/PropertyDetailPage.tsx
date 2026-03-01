import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePropertyDetail } from '../hooks/useProperties'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import type { Unit } from '../types/api'

const availabilityLabel: Record<Unit['availability'], string> = {
  available: 'property.available',
  reserved: 'property.reserved',
  contracted: 'property.contracted',
}

const availabilityColor: Record<Unit['availability'], string> = {
  available: 'bg-green-100 text-green-700',
  reserved: 'bg-yellow-100 text-yellow-700',
  contracted: 'bg-red-100 text-red-700',
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { data, isLoading, isError } = usePropertyDetail(Number(id))

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorMessage message={t('error.serverError')} className="mt-8" />
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← 物件一覧に戻る
      </Link>

      {/* Property header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{data.property_name}</h1>
        <p className="mt-1 text-gray-500">
          {data.city_name} {data.ward_name} · {data.line} {data.station}{' '}
          {t('property.walk')}
          {data.walk_minute}
          {t('property.minutes')}
        </p>
      </div>

      {/* Cover image / gallery */}
      {data.cover_image && (
        <img
          src={data.cover_image}
          alt={data.property_name}
          className="w-full max-h-96 object-cover rounded-xl"
        />
      )}

      {data.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {data.images.map((img) => (
            <img
              key={img.id}
              src={img.image}
              alt=""
              className="aspect-[4/3] w-full object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-2 text-sm">
        <InfoRow label="住所" value={data.address} />
        <InfoRow label="電話番号" value={data.phone_number} />
        <InfoRow label="築年数" value={`${data.year_built}年築`} />
        <InfoRow label="種別" value={data.property_type_name} />
      </div>

      {/* Units */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">部屋一覧</h2>
        {data.units.length === 0 ? (
          <p className="text-gray-500 text-sm">部屋情報はありません</p>
        ) : (
          <div className="space-y-4">
            {data.units.map((unit) => (
              <div
                key={unit.id}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {unit.room_number}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${availabilityColor[unit.availability]}`}
                      >
                        {t(availabilityLabel[unit.availability])}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {unit.layout} · {unit.area}m² · {unit.floor}{t('property.floor')}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gray-900">
                      ¥{unit.rent.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">/月</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      管理費 ¥{unit.management_fee.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Conditions */}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                  <Tag active={unit.pet_allowed}>ペット可</Tag>
                  <Tag active={unit.parking}>駐車場あり</Tag>
                  <Tag active={unit.credit_card_ok}>クレジットカード可</Tag>
                </div>

                {/* 3D tour button — Phase 5 */}
                {unit.has_3d_model && (
                  <button
                    disabled
                    className="mt-3 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 cursor-not-allowed opacity-60"
                    title="Phase 5 で実装予定"
                  >
                    {t('property.view3d')}（準備中）
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-24 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

function Tag({ active, children }: { active: boolean; children: React.ReactNode }) {
  if (!active) return null
  return (
    <span className="rounded-full bg-gray-100 px-2 py-0.5">{children}</span>
  )
}
