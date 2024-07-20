"use client";
import EditProfile from "@/src/components/Profile/EditProfile";
import ProtectedRoute from "@/src/components/ProtectedRoute";

const EditUserProfile = () => {
  return (
    <ProtectedRoute>
      {({ user }: any) => (
        <div>
          <EditProfile user={user} />
        </div>
      )}
    </ProtectedRoute>
    
  )
}

export default EditUserProfile;