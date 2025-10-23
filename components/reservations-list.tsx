"use client"

import { useEffect, useState } from "react"
import { parkingRepository, type Reservation, type ParkingSpace } from "@/lib/patterns/repository"
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export function ReservationsList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [spaces, setSpaces] = useState<ParkingSpace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // Actualizar cada 5 segundos para mostrar nuevas reservas
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    const [allReservations, allSpaces] = await Promise.all([
      parkingRepository.getAllReservations(),
      parkingRepository.getAllSpaces(),
    ])
    setReservations(allReservations)
    setSpaces(allSpaces)
    setLoading(false)
  }

  const getSpaceName = (spaceId: string) => {
    const space = spaces.find((s) => s.id === spaceId)
    return space?.name || "Espacio desconocido"
  }

  const getSpaceLocation = (spaceId: string) => {
    const space = spaces.find((s) => s.id === spaceId)
    return space?.location || "Ubicación desconocida"
  }

  const getStatusIcon = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5 text-success" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-danger" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-warning" />
    }
  }

  const getStatusText = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "cancelled":
        return "Cancelada"
      case "pending":
        return "Pendiente"
    }
  }

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-(--radius) p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-border rounded w-1/3" />
          <div className="h-20 bg-border rounded" />
          <div className="h-20 bg-border rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-(--radius) p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Reservas Guardadas</h3>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
          {reservations.length} {reservations.length === 1 ? "reserva" : "reservas"}
        </span>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-muted mx-auto mb-3" />
          <p className="text-muted">No hay reservas guardadas aún</p>
          <p className="text-sm text-muted mt-1">Las reservas aparecerán aquí cuando las crees</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{getSpaceName(reservation.spaceId)}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{getSpaceLocation(reservation.spaceId)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(reservation.status)}
                  <span className="text-sm font-medium text-foreground">{getStatusText(reservation.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs">Inicio</p>
                    <p className="font-medium text-foreground">
                      {new Date(reservation.startTime).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs">Hora</p>
                    <p className="font-medium text-foreground">
                      {new Date(reservation.startTime).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted">
                  ID de Reserva: <span className="font-mono text-foreground">{reservation.id}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
