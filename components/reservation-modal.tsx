"use client"

import { useState } from "react"
import type { ParkingSpace } from "@/lib/patterns/repository"
import { X, Calendar, Clock, MapPin, DollarSign } from "lucide-react"

interface ReservationModalProps {
  space: ParkingSpace | null
  onClose: () => void
  onConfirm: (spaceId: string, startTime: Date, endTime: Date) => void
}

export function ReservationModal({ space, onClose, onConfirm }: ReservationModalProps) {
  const [hours, setHours] = useState(2)

  if (!space) return null

  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000)
  const totalCost = space.price * hours

  const handleConfirm = () => {
    onConfirm(space.id, startTime, endTime)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-(--radius) max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Confirmar Reserva</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-background rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">{space.name}</h3>
            <div className="flex items-center gap-2 text-muted text-sm">
              <MapPin className="w-4 h-4" />
              <span>{space.location}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted">Fecha</p>
                <p className="font-medium text-foreground">
                  {startTime.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted">Hora de inicio</p>
                <p className="font-medium text-foreground">
                  {startTime.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Duración (horas)</label>
              <input
                type="range"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-sm text-muted mt-1">
                <span>1h</span>
                <span className="text-primary font-semibold">{hours}h</span>
                <span>12h</span>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Total a pagar</span>
                </div>
                <span className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted mt-2">
                ${space.price.toFixed(2)} × {hours} hora{hours > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-background hover:bg-surface-hover border border-border text-foreground font-medium py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-primary-hover text-background font-medium py-3 rounded-lg transition-colors"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  )
}
