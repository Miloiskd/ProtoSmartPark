"use client"

import type { ParkingSpace } from "@/lib/patterns/repository"
import { MapPin, Users, DollarSign } from "lucide-react"

interface ParkingCardProps {
  space: ParkingSpace
  onReserve: (spaceId: string) => void
}

export function ParkingCard({ space, onReserve }: ParkingCardProps) {
  const availabilityPercentage = ((space.capacity - space.occupied) / space.capacity) * 100

  const getStatusColor = () => {
    if (space.status === "occupied") return "bg-danger"
    if (availabilityPercentage < 20) return "bg-warning"
    return "bg-accent"
  }

  const getStatusText = () => {
    if (space.status === "occupied") return "Completo"
    if (space.status === "reserved") return "Reservado"
    return `${space.capacity - space.occupied} disponibles`
  }

  return (
    <div className="bg-surface rounded-(--radius) p-6 border border-border hover:bg-surface-hover transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{space.name}</h3>
          <div className="flex items-center gap-2 text-muted text-sm">
            <MapPin className="w-4 h-4" />
            <span>{space.location}</span>
          </div>
        </div>
        <div className={`${getStatusColor()} px-3 py-1 rounded-full text-xs font-medium text-background`}>
          {getStatusText()}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Users className="w-4 h-4" />
            <span>Capacidad</span>
          </div>
          <span className="text-foreground font-medium">
            {space.occupied}/{space.capacity}
          </span>
        </div>

        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getStatusColor()} transition-all duration-500`}
            style={{ width: `${(space.occupied / space.capacity) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted">
            <DollarSign className="w-4 h-4" />
            <span>Tarifa por hora</span>
          </div>
          <span className="text-primary font-semibold text-lg">${space.price.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => onReserve(space.id)}
        disabled={space.status === "occupied"}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-border disabled:cursor-not-allowed text-background font-medium py-3 rounded-lg transition-colors"
      >
        {space.status === "occupied" ? "No Disponible" : "Reservar Ahora"}
      </button>
    </div>
  )
}
