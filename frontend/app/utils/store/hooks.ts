import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import type { IRootState, TStoreDispatch } from './store';
import type { IRootState, TStoreDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<TStoreDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector; 