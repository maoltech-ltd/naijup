// components/ProtectedRoute.js
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

//   if (!user) {
//     return null; // Optionally show a loading indicator
//   }

  return children({ user });
};

export default ProtectedRoute;

