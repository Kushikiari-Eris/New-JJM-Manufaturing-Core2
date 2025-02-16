import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from "framer-motion"
import { useUserStore } from '../stores/useUserStore'
import bg2 from '/background2.jpg'

const SignUpPage = () => {
  const [ formData, setFormData ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const {signup, loading} = useUserStore()

  const handleSubmit = (e) =>{
    e.preventDefault()
    signup(formData)
  }

  return (
    <>
       <div className="hero relative bg-base-200 min-h-screen" style={{ backgroundImage: `url(${bg2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div> 
          <div className="hero-content flex-col lg:flex-row-reverse">
            <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{duration: 0.8}}>
              <div className="text-center lg:text-left text-white">
                <h1 className="text-5xl font-bold">Sign Up now!</h1>
                <p className="py-6 font-medium">
                  At JJM MANUFACTURING, we believe in the power of purity, offering top-notch soaps and detergents to keep your world spotless.
                </p>
              </div>
            </motion.div>

            <motion.div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md' initial={{opacity: 0, x: 0}} animate={{opacity: 1, x: 20}} transition={{duration: 0.8, delay: 0.2}}>
              <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <form onSubmit={handleSubmit} className="card-body">

                  <div className="form-control">
                    <label htmlFor="name" className='block text-sm text-gray-800'>
                      Full Name
                    </label>
                    <div className='mt-1 relative rounded-md'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </div>
                      <input 
                      type="text" 
                      id='name' 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value})} 
                      className='block w-full px-3 py-2 pl-10 bg-white border input-bordered rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500
                      focus:border-emerald-500 sm:text-sm text-gray-900' placeholder='john doe'
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label htmlFor="email" className='block text-sm text-gray-800'>
                      Email address
                    </label>
                    <div className='mt-1 relative rounded-md '>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </div>
                      <input 
                      type="email" 
                      id='email' 
                      required 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value})} 
                      className='block w-full px-3 py-2 pl-10 bg-white border input-bordered rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500
                      focus:border-emerald-500 sm:text-sm text-gray-900' placeholder='you@gmail.com'
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label htmlFor="password" className='block text-sm text-gray-800'>
                      Password
                    </label>
                    <div className='mt-1 relative rounded-md'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </div>
                      <input 
                      type="password" 
                      id='password' 
                      required 
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value})} 
                      className='block w-full px-3 py-2 pl-10 bg-white border input-bordered rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500
                      focus:border-emerald-500 sm:text-sm text-gray-900' placeholder='*******'
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label htmlFor="confirmPassword" className='block text-sm text-gray-800'>
                      Confirm Password
                    </label>
                    <div className='mt-1 relative rounded-md'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </div>
                      <input 
                      type="password" 
                      id='confirmPassword' 
                      required 
                      value={formData.confirmPassword} 
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value})} 
                      className='block w-full px-3 py-2 pl-10 bg-white border input-bordered rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500
                      focus:border-emerald-500 sm:text-sm text-gray-900' placeholder='*******'
                      />
                    </div>
                  </div>

                  <p className='text-center text-sm text-gray-400'>
                    Already have an account?{""}
                    <Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
                      Login here <ArrowRight className='inline h-4 w-4'/>
                    </Link>
                  </p>
                    
                  <div className="form-control mt-6">
                    <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
                    hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50' disabled={loading}> 
                      {loading ? (
                        <>
                          <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/>
                          Loading...                    
                        </>
                      ):(
                        <>
                          <UserPlus className='mr-2 h-5 w-5' aria-hidden='true'/>
                          Sign Up 
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
    </>
  )
}

export default SignUpPage