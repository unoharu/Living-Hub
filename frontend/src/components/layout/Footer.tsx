import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-[#25313E] text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Left: site links + contact */}
          <div className="space-y-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li className="text-gray-400 text-xs flex items-center">
                {t('footer.address')}
              </li>
            </ul>
            <div className="text-xs text-gray-400 space-y-1">
              <p>© 2023 Living Hub. All Rights Reserved.</p>
              <p>{t('footer.contact')}: contact@company.co.jp</p>
            </div>
          </div>

          {/* Right: social links */}
          <ul className="flex items-start gap-6 text-sm text-gray-300 shrink-0">
            <li>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
