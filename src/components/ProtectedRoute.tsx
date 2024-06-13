"use client";
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../redux/store';

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  console.log({user})
  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  return children({ user });
};

export default ProtectedRoute;

