import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "BookNook | My Profile",
  description: "View and edit your BookNook reader profile.",
};

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full">
        <ProfileForm />
      </div>
    </PrivateRoute>
  );
}
