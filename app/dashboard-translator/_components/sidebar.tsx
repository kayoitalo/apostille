"use client";

import { cn } from "@/lib/utils";
import { FileText, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Home",
    href: "/dashboard-translator",
    icon: Home,
  },
  {
    title: "Documents",
    href: "/dashboard-translator/documents",
    icon: FileText,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card min-h-[calc(100vh-4rem)] p-4 border-r">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              pathname === link.href && "bg-accent text-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}