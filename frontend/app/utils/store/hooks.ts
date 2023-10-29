import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { IRootState, TStoreDispatch } from '@/app/utils/store/store';

export const useAppDispatch = () => useDispatch<TStoreDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector; 