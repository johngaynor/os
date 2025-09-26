"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useTheme } from "next-themes";
import {
  House,
  // Dumbbell,
  Database,
  Sun,
  Moon,
  HeartPlus,
} from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NavItems = [
  {
    href: "/",
    icon: <House size={24} />,
  },
  {
    href: "/health",
    icon: <HeartPlus size={24} />,
  },
  // {
  //   href: "/training/train",
  //   icon: <Dumbbell size={24} />,
  // },
  {
    href: "/apps",
    icon: <Database size={24} />,
  },
];

const MobileNav = ({}) => {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenu className="fixed bottom-0 pb-5 right-0 left-0 border-t border-gray-100 bg-background z-50">
      <NavigationMenuList>
        {NavItems.map((item, index) => (
          <NavigationMenuItem
            key={"mobile-nav-item-" + index}
            className="w-full"
          >
            <Link
              href={item.href}
              className="flex items-center justify-center h-16"
            >
              {item.icon}
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem className="w-full">
          {theme === "dark" ? (
            <Sun
              size={24}
              onClick={() => setTheme("light")}
              className="flex items-center justify-center mx-auto"
            />
          ) : (
            <Moon
              size={24}
              onClick={() => setTheme("dark")}
              className="flex items-center justify-center mx-auto"
            />
          )}
        </NavigationMenuItem>

        <NavigationMenuItem className="w-full">
          <SignedIn>
            <div className="flex justify-center items-center h-16">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "border border-gray-300 rounded-full",
                  },
                }}
              />
            </div>
          </SignedIn>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MobileNav;
