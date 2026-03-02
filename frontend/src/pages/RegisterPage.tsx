import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useRegister } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function RegisterPage() {
  const { t } = useTranslation()
  const register = useRegister()

  const [form, setForm] = useState({
    email: '',
    password: '',
    password_confirm: '',
    last_name: '',
    first_name: '',
  })
  const [validationError, setValidationError] = useState('')

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError('')

    if (form.password !== form.password_confirm) {
      setValidationError('パスワードが一致しません')
      return
    }

    register.mutate(form)
  }

  return (
    <div className="mx-auto max-w-sm pt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('nav.register')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.lastName')}
            </label>
            <input
              type="text"
              required
              value={form.last_name}
              onChange={update('last_name')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.firstName')}
            </label>
            <input
              type="text"
              required
              value={form.first_name}
              onChange={update('first_name')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.email')}
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.password')}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update('password')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード（確認）
          </label>
          <input
            type="password"
            required
            value={form.password_confirm}
            onChange={update('password_confirm')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {(validationError || register.isError) && (
          <ErrorMessage
            message={validationError || 'アカウント登録に失敗しました。入力内容を確認してください'}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={register.isPending}
        >
          {t('auth.registerButton')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        すでにアカウントをお持ちの方は{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          {t('nav.login')}
        </Link>
      </p>
    </div>
  )
}
