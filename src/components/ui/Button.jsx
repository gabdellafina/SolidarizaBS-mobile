import clsx from 'clsx'
const variants = { primary: 'bg-[#4C8BF5] text-white hover:bg-[#3B7AE4] active:scale-[0.98] shadow-md', secondary: 'bg-blue-50 text-[#4C8BF5] border border-blue-100', danger: 'bg-red-500 text-white', success: 'bg-emerald-500 text-white', ghost: 'bg-transparent text-gray-600', outline: 'bg-white text-gray-700 border-2 border-gray-200' }
const sizes = { sm: 'px-4 py-2 text-xs', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' }
export default function Button({ children, variant = 'primary', size = 'md', loading, disabled, className, ...props }) {
  return <button disabled={disabled || loading} className={clsx('font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50', variants[variant], sizes[size], className)} {...props}>{loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}{children}</button>
}
