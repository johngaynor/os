"use client";
import React from "react";
import { H1 } from "@/components/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type PageTemplateProps = {
  title: string;
  showTitleMobile?: boolean;
  children: React.ReactNode;
};

export default function PageTemplate({
  children,
  showTitleMobile = false,
  title,
}: PageTemplateProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto px-5">
          <H1
            className={`py-6 align-left md:w-auto w-full md:flex ${
              showTitleMobile ? "flex" : "hidden"
            }`}
          >
            {title}
          </H1>
          <Breadcrumb className="pt-4 pl-3 md:block hidden">
            <BreadcrumbList>
              {segments.map((segment, idx) => {
                const href =
                  segment === "Dashboard"
                    ? "/"
                    : "/" + segments.slice(0, idx + 1).join("/");
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={href} className="capitalize">
                          {segment}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div
        className={`flex flex-col md:flex-row flex-1 gap-4 w-full max-w-6xl mx-auto md:px-5 pt-5 ${
          showTitleMobile ? "pt-4 px-5" : "pt-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
