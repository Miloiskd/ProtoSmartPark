"use client"

import { useEffect, useState } from "react"
import type { Notification, IObserver } from "@/lib/patterns/observer"
import { Bell, X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"

interface NotificationPanelProps {
  subject: any // NotificationSubject
}

export function NotificationPanel({ subject }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Implementación del Observer
    const observer: IObserver = {
      update: (notification: Notification) => {
        console.log("[v0] Notification received:", notification)
        setNotifications((prev) => [notification, ...prev].slice(0, 10))
        setIsOpen(true)
      },
    }

    // Suscribirse al subject
    subject.attach(observer)

    // Cleanup: desuscribirse al desmontar
    return () => {
      subject.detach(observer)
    }
  }, [subject])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-accent" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case "error":
        return <XCircle className="w-5 h-5 text-danger" />
      default:
        return <Info className="w-5 h-5 text-primary" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-surface hover:bg-surface-hover border border-border rounded-full p-3 shadow-lg transition-colors relative"
      >
        <Bell className="w-6 h-6 text-foreground" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 w-96 bg-surface border border-border rounded-(--radius) shadow-2xl max-h-[600px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notificaciones</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-surface-hover transition-colors">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm mb-1">{notification.title}</h4>
                        <p className="text-muted text-sm mb-2">{notification.message}</p>
                        <p className="text-xs text-muted">{notification.timestamp.toLocaleTimeString()}</p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="flex-shrink-0 text-muted hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
