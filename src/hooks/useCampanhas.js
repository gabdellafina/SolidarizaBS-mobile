import { useEffect } from 'react'
import { useCampanhaStore } from '../store/campanhaStore'
export const useCampanhas = () => { const store = useCampanhaStore(); useEffect(() => { if (store.campanhas.length === 0) store.fetchCampanhas() }, []); return store }
