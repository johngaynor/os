"use client";
import React from "react";
import Dashboard from "./index";
import PageTemplate from "../components/Templates/PageTemplate";

export default function Page() {
  return (
    <PageTemplate title="Today" showTitleMobile>
      <Dashboard />
    </PageTemplate>
  );
}
