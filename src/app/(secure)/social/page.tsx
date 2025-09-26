import React from "react";
import PageTemplate from "../components/Templates/PageTemplate";
import AppsGrid from "../components/Templates/AppsGrid";

const title = "Social";

export default function Page() {
  return (
    <PageTemplate title={title}>
      <AppsGrid filter="/social" />
    </PageTemplate>
  );
}

export const metadata = {
  title: `${title} | OS`,
};
