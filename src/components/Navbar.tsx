"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { menuitems } from "@/constants";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="flex flex-row justify-between items-center my-5 max-w-screen-xl mx-auto px-5">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-bold text-slate-800">
          Blunk
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {menuitems.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-1 p-2">
                        {item.children.map((child, idx) => (
                          <li key={idx}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.path}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                {child.title}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.path}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.title}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-1.5 py-0 px-1.5 text-[9px] animate-pulse font-semibold uppercase bg-indigo-600 text-white"
                        >
                          soon
                        </Badge>
                      )}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <OrganizationSwitcher />
        <UserButton />
        <SignedOut>
          <SignInButton>
            <Button>Sign up</Button>
          </SignInButton>
        </SignedOut>
      </div>

      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <MenuIcon className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="text-left">Blunk</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <nav className="flex flex-col gap-1">
            {menuitems.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        {item.title}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child, idx) => (
                        <DropdownMenuItem key={idx} asChild>
                          <Link href={child.path}>{child.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href={item.path}>
                      {item.title}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-1.5 py-0 px-1.5 text-[9px] animate-pulse font-semibold uppercase bg-indigo-600 text-white"
                        >
                          soon
                        </Badge>
                      )}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </nav>
          <Separator className="my-4" />
          <div className="flex flex-col gap-2 px-1">
            <OrganizationSwitcher />
            <UserButton />
            <SignedOut>
              <SignInButton>
                <Button className="w-full">Sign up</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Navbar;
