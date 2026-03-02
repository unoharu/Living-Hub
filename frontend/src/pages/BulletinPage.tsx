import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useArticles, useCreateArticle } from '../hooks/useBulletin'
import useAuthStore from '../stores/authStore'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function BulletinPage() {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: articles, isLoading, isError } = useArticles()
  const createMutation = useCreateArticle()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [formError, setFormError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    try {
      await createMutation.mutateAsync({ title: title.trim(), content: content.trim() })
      setTitle('')
      setContent('')
    } catch {
      setFormError(t('error.serverError'))
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('bulletin.title')}</h1>

      {/* Post form — authenticated only */}
      {isAuthenticated && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">{t('bulletin.newPost')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bulletin.postTitle')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8ca80]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bulletin.postContent')} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8ca80] resize-none"
              />
            </div>

            {formError && (
              <p className="text-sm text-red-500">{formError}</p>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #b8ca80, #8fa84e)' }}
            >
              {createMutation.isPending ? '送信中...' : t('bulletin.submit')}
            </button>
          </form>
        </section>
      )}

      {/* Article list */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && <ErrorMessage message={t('error.serverError')} />}

      {articles && articles.length === 0 && (
        <p className="text-gray-500 text-sm">{t('bulletin.empty')}</p>
      )}

      {articles && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-gray-900">{article.title}</h3>
                <time className="shrink-0 text-xs text-gray-400">
                  {new Date(article.created_at).toLocaleDateString()}
                </time>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{article.content}</p>
              <p className="mt-3 text-xs text-gray-400">{article.author_name}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
