import type { Metadata } from "next";

import { AddressBook } from "@/features/profile/components/address-book";

export const metadata: Metadata = {
  title: "Addresses",
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-foreground mb-6">Addresses</h1>
      <AddressBook />
    </div>
  );
}
