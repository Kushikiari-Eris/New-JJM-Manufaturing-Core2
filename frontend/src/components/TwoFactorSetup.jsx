import { useState, useEffect } from 'react'
import { Shield, Loader, CheckCircle } from 'lucide-react'
import useUserStore from '../stores/useUserStore'

const TwoFactorSetup = () => {
  const [step, setStep] = useState(1) // 1: Initial, 2: QR shown, 3: Verify
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [token, setToken] = useState('')
  const [disableToken, setDisableToken] = useState('')
  const [disableMode, setDisableMode] = useState(false)
  
  const { user, loading, setup2FA, verify2FA, disable2FA } = useUserStore()

  useEffect(() => {
    // Reset state when user changes
    setStep(1)
    setDisableMode(false)
  }, [user?._id])

  const initiateSetup = async () => {
    const result = await setup2FA()
    if (result) {
      setSecret(result.secret)
      setQrCode(result.qrCode)
      setStep(2)
    }
  }

  const verifyAndEnable = async (e) => {
    e.preventDefault()
    const success = await verify2FA(token)
    if (success) {
      setStep(3)
    }
  }

  const handleDisable = async (e) => {
    e.preventDefault()
    await disable2FA(disableToken)
    setDisableMode(false)
    setDisableToken('')
  }

  if (!user) return null

  // Show disable option if 2FA is already enabled
  if (user.twoFactorEnabled && !disableMode) {
    return (
      <div className="card bg-base-100 shadow-md p-6 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <CheckCircle className="h-6 w-6 text-emerald-500 mr-2" />
          <h2 className="text-xl font-semibold">Two-factor authentication is enabled</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Your account is secured with two-factor authentication. You'll need to enter a verification code from your authenticator app when you sign in.
        </p>
        <button 
          className="btn btn-error"
          onClick={() => setDisableMode(true)}
        >
          Disable 2FA
        </button>
      </div>
    )
  }

  // Disable 2FA form
  if (disableMode) {
    return (
      <div className="card bg-base-100 shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Disable Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-6">
          To disable two-factor authentication, please enter a verification code from your authenticator app.
        </p>
        
        <form onSubmit={handleDisable}>
          <div className="form-control mb-6">
            <label htmlFor="disableToken" className="block text-sm text-gray-800 mb-1">
              Verification Code
            </label>
            <div className="mt-1 relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input 
                type="text" 
                id="disableToken" 
                required 
                value={disableToken} 
                onChange={(e) => setDisableToken(e.target.value)} 
                className="block w-full px-3 py-2 pl-10 bg-white border input-bordered rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-900" 
                placeholder="123456"
                autoComplete="off"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setDisableMode(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading || !disableToken}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                'Disable 2FA'
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Setup 2FA flow
  return (
    <div className="card bg-base-100 shadow-md p-6 max-w-md mx-auto">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Set up Two-Factor Authentication</h2>
          <p className="text-gray-600 mb-6">
            Two-factor authentication adds an extra layer of security to your account. Once enabled, you'll need to enter a verification code from your mobile authenticator app when signing in.
          </p>
          <button 
            onClick={initiateSetup} 
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Setting up...
              </>
            ) : (
              'Set up 2FA'
            )}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          <p className="text-gray-600 mb-4">
            Scan this QR code with your authenticator app, or enter the setup key manually.
          </p>
          
          <div className="flex justify-center mb-4">
            {qrCode && <img src={qrCode} alt="QR Code" className="w-48 h-48" />}
          </div>
          
          <div className="form-control mb-4">
            <label className="block text-sm text-gray-800 mb-1">
              Setup Key (manual entry)
            </label>
            <input 
              type="text" 
              value={secret} 
              readOnly
              className="block w-full px-3 py-2 bg-gray-100 border input-bordered rounded-md focus:outline-none sm:text-sm text-gray-900"
            />
          </div>
          
          <form onSubmit={verifyAndEnable}>
            <div className="form-control mb-6">
              <label htmlFor="token" className="block text-sm text-gray-800 mb-1">
                Verification Code
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input 
                  type="text" 
                  id="token" 
                  required 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                  className="block w-full px-3 py-2 pl-10 bg-white border input-bordered rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-900" 
                  placeholder="123456"
                  autoComplete="off"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={loading || !token}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Enable'
                )}
              </button>
            </div>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Two-Factor Authentication Enabled</h2>
            <p className="text-gray-600 mb-6">
              You've successfully set up two-factor authentication. Your account is now more secure.
            </p>
            <button 
              onClick={() => setStep(1)} 
              className="btn btn-primary"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TwoFactorSetup