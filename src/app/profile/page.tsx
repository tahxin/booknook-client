import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "BookNook | My Profile",
  description: "View and edit your BookNook library profile and settings.",
};

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <ProfileForm />
      </div>
    </PrivateRoute>
  );
}

