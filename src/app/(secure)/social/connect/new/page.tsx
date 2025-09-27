"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePersonStore } from "@/store/personStore";
import { Page, Error } from "../../../components/Pages";
import InteractionForm from "../components/InteractionForm";

export default function NewInteraction() {
  const router = useRouter();
  const { fetchPersons, persons, error } = usePersonStore();

  // Ensure we have existing persons loaded before creating a new one
  useEffect(() => {
    if (!persons && !error) {
      fetchPersons();
    }
  }, [persons, error, fetchPersons]);

  const handleSuccess = () => {
    router.push("/social/connect");
  };

  const handleCancel = () => {
    router.push("/social/connect");
  };

  if (error) return <Error error={error} />;

  return (
    <Page title="Add New Interaction" showTitleMobile>
      <InteractionForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </Page>
  );
}
