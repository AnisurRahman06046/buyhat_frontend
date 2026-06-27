import type { Metadata } from "next";

import { ProfileForm } from "@/features/profile/components/profile-form";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-headline-lg text-foreground mb-6">Profile</h1>
      <ProfileForm />
    </div>
  );
}
