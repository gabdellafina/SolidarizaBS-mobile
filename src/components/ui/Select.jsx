import { forwardRef } from 'react'
import clsx from 'clsx'
const Select = forwardRef(({ label, error, children, className, ...props }, ref) => (
  <div className="mb-3">
    {label && <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>}
    <select ref={ref} className={clsx('w-full px-4 py-3 rounded-xl border-2 text-sm bg-white transition-colors focus:outline-none focus:border-[#4C8BF5]', error ? 'border-red-300' : 'border-gray-200', className)} {...props}>{children}</select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
))
Select.displayName = 'Select'
export default Select
