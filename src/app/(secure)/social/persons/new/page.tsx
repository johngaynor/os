"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePersonStore } from "@/store/personStore";
import { Page, Error } from "../../../components/Pages";
import EditPerson from "../components/PersonForm";

export default function NewPerson() {
  const router = useRouter();
  const { fetchPersons, persons, error } = usePersonStore();

  // Ensure we have existing persons loaded before creating a new one
  useEffect(() => {
    if (!persons && !error) {
      fetchPersons();
    }
  }, [persons, error, fetchPersons]);

  const handleSuccess = () => {
    router.push("/social/persons");
  };

  const handleCancel = () => {
    router.push("/social/persons");
  };

  if (error) return <Error error={error} />;

  return (
    <Page title="Add New Person" showTitleMobile>
      <EditPerson onSuccess={handleSuccess} onCancel={handleCancel} />
    </Page>
  );
}
