"use client";

import { LogOut, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsButton } from "@/components/ui/notifications";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Sistema de Apostilamento</h1>
        </div>
        
        <Link href="/dashboard-client">
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Portal do Cliente
          </Button>
        </Link>

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
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}