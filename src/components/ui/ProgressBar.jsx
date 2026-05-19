import { pct } from '../../utils/helpers'
import clsx from 'clsx'
export default function ProgressBar({ value, max, className }) {
  return <div className={clsx('w-full bg-gray-200 rounded-full h-2.5 overflow-hidden', className)}><div className="h-full bg-gradient-to-r from-blue-400 to-[#4C8BF5] rounded-full transition-all duration-500" style={{ width: pct(value, max) + '%' }} /></div>
}
