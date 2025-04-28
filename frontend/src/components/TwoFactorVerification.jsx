import { useState } from 'react'
import { Shield, Loader } from 'lucide-react'
import useUserStore from '../stores/useUserStore'

const TwoFactorVerification = () => {
  const [token, setToken] = useState('')
  const { loading, verify2FALogin, clearTwoFactorState } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    verify2FALogin(token)
  }

  const handleCancel = () => {
    clearTwoFactorState()
  }

  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Authentication</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Please enter the verification code from your authenticator app
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-control">
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

        <div className="flex gap-3 mt-8">
          <button 
            type="button" 
            onClick={handleCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
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
              'Verify'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TwoFactorVerification