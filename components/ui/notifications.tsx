"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // In a real app, this would fetch notifications from an API
    setNotifications([
      {
        id: "1",
        title: "Novo Lote Criado",
        message: "Empresa A criou um novo lote de documentos",
        timestamp: "2024-02-20T10:00:00Z",
        read: false
      },
      {
        id: "2",
        title: "Status Atualizado",
        message: "O status do documento #123 foi atualizado para 'Em Processamento'",
        timestamp: "2024-02-20T09:30:00Z",
        read: true
      }
    ]);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificações</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg",
                  notification.read ? "bg-muted/50" : "bg-muted"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-destructive rounded-full" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <time className="text-xs text-muted-foreground mt-2 block">
                  {new Date(notification.timestamp).toLocaleString()}
                </time>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}