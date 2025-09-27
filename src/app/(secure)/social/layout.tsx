"use client";

import React, { useEffect } from "react";
import { usePersonStore } from "@/store/personStore";
import { useInteractionStore } from "@/store/interactionStore";

interface SocialLayoutProps {
  children: React.ReactNode;
}

export default function SocialLayout({ children }: SocialLayoutProps) {
  const {
    fetchPersons,
    persons,
    loading: personsLoading,
    error: personsError,
  } = usePersonStore();

  const {
    fetchInteractions,
    interactions,
    loading: interactionsLoading,
    error: interactionsError,
  } = useInteractionStore();

  useEffect(() => {
    if (!persons && !personsError && !personsLoading) {
      fetchPersons();
    }
  }, [persons, personsError, personsLoading, fetchPersons]);

  useEffect(() => {
    if (!interactions && !interactionsError && !interactionsLoading) {
      fetchInteractions();
    }
  }, [interactions, interactionsError, interactionsLoading, fetchInteractions]);

  return <>{children}</>;
}
