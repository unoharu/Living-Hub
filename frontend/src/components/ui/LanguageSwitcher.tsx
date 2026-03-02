import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'ja', label: 'JA' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: 'ZH' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  return (
    <div className="flex items-center gap-0.5">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
            currentLang.startsWith(code)
              ? 'bg-[#b8ca80] text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
