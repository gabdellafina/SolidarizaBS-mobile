import clsx from 'clsx'
const status = { aprovado: 'bg-green-100 text-green-700', pendente: 'bg-yellow-100 text-yellow-700', rejeitado: 'bg-red-100 text-red-700' }
export default function Badge({ children, className, status: s }) {
  return <span className={clsx('inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border', s && status[s], className)}>{children}</span>
}
