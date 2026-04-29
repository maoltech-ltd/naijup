"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { canAccessAdminReports } from "../utils/adminAccess";

interface AdminProtectedRouteProps {
  children: any;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.userId || user.userId === "") {
      router.push("/signin");
      return;
    }

    if (!canAccessAdminReports(user.userEmail)) {
      router.push("/");
    }
  }, [router, user]);

  return children({ user });
};

export default AdminProtectedRoute;
