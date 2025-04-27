import { useState } from 'react'
import { Shield, Lock, AlertTriangle, Loader, CheckCircle } from 'lucide-react'
import TwoFactorSetup from '../components/TwoFactorSetup'
import useUserStore from '../stores/useUserStore'

const SecuritySettingsPage = () => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false)
  const { user, loading, updatePassword } = useUserStore()
  
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return
    }
    
    const success = await updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    )
    
    if (success) {
      // Reset form and show success message
      setPasswordUpdateSuccess(true)
      
      // Clear form data
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordUpdateSuccess(false)
        setShowChangePassword(false)
      }, 3000)
    }
  }
  
  if (!user) return null

  return (
    <>
          <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">
                Settings
              </span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">
                Security
              </span>
            </div>
          </li>
        </ol>
      </nav>

    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Security Settings</h1>
      
      <div className="grid gap-8">
        {/* Two-Factor Authentication Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-emerald-500 mr-2" />
              <h2 className="text-2xl font-semibold">Two-Factor Authentication</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Two-factor authentication adds an extra layer of security to your account. 
                When 2FA is enabled, you'll need to provide both your password and a verification code 
                from your mobile device when you sign in.
              </p>
            </div>
            
            <TwoFactorSetup />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SecuritySettingsPage