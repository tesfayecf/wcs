import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { IRootState, TStoreDispatch } from '@/app/lib/store/store';

export const useAppDispatch = () => useDispatch<TStoreDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector; 