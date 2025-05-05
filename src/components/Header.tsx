"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
  };

  const NavLinks = () => (
    <nav className="flex flex-col pl-5 sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
      <Link
        href="/players"
        className={`${
          pathname === "/players"
            ? "text-primary font-semibold"
            : "text-muted-foreground"
        }`}
      >
        Players
      </Link>
      <Link
        href="/teams"
        className={`${
          pathname === "/teams"
            ? "text-primary font-semibold"
            : "text-muted-foreground"
        }`}
      >
        Teams
      </Link>
    </nav>
  );

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <HamburgerMenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full py-4">
                <div className="flex-1 space-y-4">
                  <NavLinks />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm pl-2">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Always visible */}
        <Link href="/" className="text-xl font-semibold hover:opacity-80">
          NBA Teams App
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
