import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { City } from '../components/three/City'

function CityScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.4} color="#b8ca80" />
      <Suspense fallback={null}>
        <City position={[0, -2, 0]} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  )
}

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1a1f2e]">
      <Canvas
        shadows
        camera={{ fov: 60, position: [0, 15, 40], near: 0.1, far: 500 }}
        className="absolute inset-0"
      >
        <CityScene />
      </Canvas>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/80 via-transparent to-transparent pointer-events-none" />

      {/* Hero text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="pointer-events-auto mx-4 max-w-md rounded-2xl border border-white/20 p-8 text-center shadow-2xl animate-fadeIn"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70 mb-3 animate-rise">
            {t('landing.subtitle')}
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 animate-rise">
            LIVING HUB
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-white/70 mb-10 max-w-md mx-auto animate-rise">
            {t('landing.description')}
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg animate-rise"
            style={{ background: 'linear-gradient(135deg, #b8ca80, #8fa84e)' }}
          >
            {t('landing.cta')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator">
        <span className="text-xs text-white/40 tracking-widest uppercase">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  )
}
