"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { usePersonStore } from "@/store/personStore";
import PageTemplate from "../../../components/Templates/PageTemplate";
import EditPerson from "../components/PersonForm";

export default function NewPersonPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { fetchPersons, persons, error } = usePersonStore();

  // Ensure we have existing persons loaded before creating a new one
  useEffect(() => {
    if (isLoaded && user && !persons && !error) {
      fetchPersons();
    }
  }, [isLoaded, user, persons, error, fetchPersons]);

  const handleSuccess = () => {
    router.push("/social/persons");
  };

  return (
    <PageTemplate title="Add New Person" showTitleMobile>
      <EditPerson onSuccess={handleSuccess} />
    </PageTemplate>
  );
}
