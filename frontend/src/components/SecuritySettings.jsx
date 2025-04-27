import { useState } from 'react'
import { Shield, Lock, AlertTriangle } from 'lucide-react'
import TwoFactorSetup from './TwoFactorSetUp'
import useUserStore from '../stores/useUserStore'

const SecuritySettings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const { user, loading } = useUserStore()
  
  const handlePasswordChange = (e) => {
    e.preventDefault()
    // Password change functionality would go here
    // Not implemented in this example
    alert('Password change functionality not implemented in this example')
  }
  
  if (!user) return null

  return (
    <>
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
              <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </a>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">Profile</span>
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
        
        {/* Password Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-emerald-500 mr-2" />
              <h2 className="text-2xl font-semibold">Password</h2>
            </div>
            
            {!showChangePassword ? (
              <div>
                <p className="text-gray-600 mb-4">
                  It's a good practice to use a strong, unique password and change it periodically.
                </p>
                
                <button 
                  onClick={() => setShowChangePassword(true)}
                  className="btn btn-primary"
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div className="form-control mb-3">
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="input input-bordered" 
                    required 
                  />
                </div>
                
                <div className="form-control mb-3">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="input input-bordered" 
                    required 
                    minLength={6}
                  />
                </div>
                
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="input input-bordered" 
                    required 
                    minLength={6}
                  />
                  {passwordData.newPassword && 
                   passwordData.confirmPassword && 
                   passwordData.newPassword !== passwordData.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Passwords do not match
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowChangePassword(false)
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={
                      loading || 
                      !passwordData.currentPassword || 
                      !passwordData.newPassword || 
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SecuritySettings