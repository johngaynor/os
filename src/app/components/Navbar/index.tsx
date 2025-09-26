"use client";
import Mobile from "./Mobile";
import { useWindowDimensions } from "@/app/customHooks/useWindowDimensions";
import Desktop from "./Desktop";
import { useUser } from "@clerk/nextjs";
import { Github, Linkedin, FolderCode } from "lucide-react";

export default function NavbarWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useWindowDimensions("(max-width: 768px)");
  const { user } = useUser();

  if (isMobile === undefined) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {!isMobile && user && <Desktop />}
      <div
        className={`flex-1 ${!isMobile && user ? "pt-25" : ""} ${
          isMobile && user ? "pb-30" : "pb-10"
        }`}
      >
        {children}
      </div>
      {!isMobile && (
        <div className="bg-background border-t border-border text-center py-1 mt-auto">
          <p className="text-muted-foreground text-sm flex justify-center items-center gap-2">
            Designed and developed by John Gaynor.
            <span className="flex items-center gap-2 ml-2">
              <a
                href="https://github.com/johngaynor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-muted"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/john-gaynor1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-muted"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://johngaynor.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-3 rounded-full hover:bg-muted"
                aria-label="Portfolio"
              >
                <FolderCode className="h-5 w-5" />
              </a>
            </span>
          </p>
        </div>
      )}
      {isMobile && <Mobile />}
    </div>
  );
}
