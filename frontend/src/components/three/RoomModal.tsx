import { Suspense, useEffect, useState } from 'react'
import Spinner from '../ui/Spinner'
import RoomViewer from './RoomViewer'

const CAMERA_LABELS = ['リビング', 'キッチン', 'バスルーム', '寝室', '上面']

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RoomModal({ isOpen, onClose }: RoomModalProps) {
  const [cameraIndex, setCameraIndex] = useState(0)

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Reset camera position each time the modal opens
  useEffect(() => {
    if (isOpen) setCameraIndex(0)
  }, [isOpen])

  // Unmount entirely when closed to release the WebGL context
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white text-sm font-medium tracking-wide">
          LIVING HUB 3D View
        </span>
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="text-white/70 hover:text-white text-2xl leading-none w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 3D canvas area */}
      <div className="flex-1 relative min-h-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="lg" className="border-gray-600 border-t-blue-400" />
            </div>
          }
        >
          <RoomViewer cameraIndex={cameraIndex} />
        </Suspense>
      </div>

      {/* Camera position buttons */}
      <div className="shrink-0 flex justify-center gap-2 px-4 py-4 flex-wrap">
        {CAMERA_LABELS.map((label, index) => (
          <button
            key={label}
            onClick={() => setCameraIndex(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              cameraIndex === index
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
