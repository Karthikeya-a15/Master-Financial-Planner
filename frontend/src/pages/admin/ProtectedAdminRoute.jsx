import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import LoadingSpinner from './../../components/common/LoadingSpinner'

export default function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated, loading } = useAdminAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" />
  }

  return children
}