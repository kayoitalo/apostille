"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsButton } from "@/components/ui/notifications";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Translator Dashboard</h1>
        </div>

        <ThemeToggle />
        <NotificationsButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}