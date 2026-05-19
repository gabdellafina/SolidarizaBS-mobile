import { useEffect } from 'react'
import { useOngStore } from '../store/ongStore'
export const useOngs = () => { const store = useOngStore(); useEffect(() => { if (store.ongs.length === 0) store.fetchOngs() }, []); return store }
