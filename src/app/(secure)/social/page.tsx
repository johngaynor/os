import React from "react";
import { Page } from "../components/Pages";
import AppsGrid from "../components/AppsGrid";

const title = "Social";

export default function Social() {
  return (
    <Page title={title} showTitleMobile>
      <AppsGrid filter="/social" />
    </Page>
  );
}

export const metadata = {
  title: `${title} | OS`,
};
