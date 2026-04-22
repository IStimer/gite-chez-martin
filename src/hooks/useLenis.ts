import { useContext } from 'react';
import { LenisContext } from '../providers/LenisProvider';

export const useLenis = () => {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error('useLenis must be used inside <LenisProvider>');
  return ctx;
};
