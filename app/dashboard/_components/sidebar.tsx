"use client";

import { cn } from "@/lib/utils";
import {
  Files,
  FolderOpen,
  Home,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip";

const links = [
  {
    title: "Início",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Documentos",
    href: "/dashboard/documents",
    icon: Files,
  },
  {
    title: "Lotes",
    href: "/dashboard/batches",
    icon: FolderOpen,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 bg-card min-h-[calc(100vh-4rem)] p-2 border-r flex flex-col items-center">
      <TooltipProvider>
        <nav className="space-y-2 w-full">
          {links.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                    pathname.startsWith(link.href) && "bg-accent text-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}