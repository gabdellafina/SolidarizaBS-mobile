import { forwardRef } from 'react'
import clsx from 'clsx'
const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="mb-3">
    {label && <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>}
    <input ref={ref} className={clsx('w-full px-4 py-3 rounded-xl border-2 text-sm bg-white transition-colors focus:outline-none focus:border-[#4C8BF5] placeholder:text-gray-400', error ? 'border-red-300' : 'border-gray-200', className)} {...props} />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
))
Input.displayName = 'Input'
export default Input
