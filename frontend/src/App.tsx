import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'
import useAuthStore from './stores/authStore'

// Lazy load pages to split bundles
const LandingPage = lazy(() => import('./pages/LandingPage'))
const PropertyListPage = lazy(() => import('./pages/PropertyListPage'))
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const MyPage = lazy(() => import('./pages/MyPage'))
const BulletinPage = lazy(() => import('./pages/BulletinPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

const router = createBrowserRouter([
  // Landing page — fullscreen, no Layout wrapper
  {
    path: '/',
    element: <LandingPage />,
  },
  // Main app — wrapped in Layout (Header + main container)
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'properties', element: <PropertyListPage /> },
      { path: 'properties/:id', element: <PropertyDetailPage /> },
      { path: 'bulletin', element: <BulletinPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'mypage',
        element: (
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
