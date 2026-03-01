interface ErrorMessageProps {
  message: string
  className?: string
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm ${className}`}
    >
      {message}
    </div>
  )
}
