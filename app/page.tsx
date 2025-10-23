"use client"

import { useEffect, useState } from "react"
import { ParkingCard } from "@/components/parking-card"
import { NotificationPanel } from "@/components/notification-panel"
import { ReservationModal } from "@/components/reservation-modal"
import { ReservationsList } from "@/components/reservations-list"
import { parkingRepository, type ParkingSpace } from "@/lib/patterns/repository"
import { parkingAvailabilitySubject } from "@/lib/patterns/observer"
import { Car, Sparkles } from "lucide-react"

export default function Home() {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null)

  useEffect(() => {
    loadSpaces()
    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      simulateRealTimeUpdates()
    }, 10000) // Cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const loadSpaces = async () => {
    setLoading(true)
    const data = await parkingRepository.getAllSpaces()
    setSpaces(data)
    setLoading(false)
  }

  const simulateRealTimeUpdates = async () => {
    // Simula cambios aleatorios en la disponibilidad
    const randomSpace = spaces[Math.floor(Math.random() * spaces.length)]
    if (randomSpace) {
      const wasOccupied = randomSpace.status === "occupied"
      const newStatus = Math.random() > 0.5 ? "available" : "occupied"

      await parkingRepository.updateSpaceStatus(randomSpace.id, newStatus)

      // Notificar a los observadores
      if (wasOccupied && newStatus === "available") {
        parkingAvailabilitySubject.notifySpaceAvailable(randomSpace.name)
      } else if (!wasOccupied && newStatus === "occupied") {
        parkingAvailabilitySubject.notifySpaceOccupied(randomSpace.name)
      }

      // Recargar espacios
      await loadSpaces()
    }
  }

  const handleReserve = (spaceId: string) => {
    const space = spaces.find((s) => s.id === spaceId)
    if (space) {
      setSelectedSpace(space)
    }
  }

  const handleConfirmReservation = async (spaceId: string, startTime: Date, endTime: Date) => {
    console.log("[v0] Main Page - Confirming reservation for space:", spaceId)

    const reservation = await parkingRepository.createReservation({
      spaceId,
      userId: "user-123",
      startTime,
      endTime,
      status: "confirmed",
    })

    console.log("[v0] Main Page - Reservation created successfully:", reservation)

    const space = spaces.find((s) => s.id === spaceId)
    if (space) {
      parkingAvailabilitySubject.notifyReservationConfirmed(space.name)
    }

    await loadSpaces()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Car className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SmartPark</h1>
                <p className="text-sm text-muted">Encuentra tu espacio ideal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Actualizaciones en tiempo real</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel - Observer Pattern */}
      <NotificationPanel subject={parkingAvailabilitySubject} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Espacios Disponibles</h2>
          <p className="text-muted">Reserva tu espacio de parqueo con anticipación y evita el estrés</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface rounded-(--radius) p-6 border border-border animate-pulse">
                <div className="h-6 bg-border rounded mb-4 w-3/4" />
                <div className="h-4 bg-border rounded mb-2 w-1/2" />
                <div className="h-20 bg-border rounded mb-4" />
                <div className="h-12 bg-border rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <ParkingCard key={space.id} space={space} onReserve={handleReserve} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <ReservationsList />
        </div>

        {/* Pattern Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-(--radius) p-6">
            <h3 className="text-xl font-bold text-foreground mb-3">Repository Pattern</h3>
            <p className="text-muted mb-4">
              Separa la lógica de acceso a datos de la lógica de negocio, proporcionando una interfaz limpia para
              operaciones CRUD.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li>✓ Abstracción de la fuente de datos</li>
              <li>✓ Facilita testing con mocks</li>
              <li>✓ Centraliza la lógica de datos</li>
              <li>✓ Permite cambiar la implementación sin afectar el código</li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-(--radius) p-6">
            <h3 className="text-xl font-bold text-foreground mb-3">Observer Pattern</h3>
            <p className="text-muted mb-4">
              Permite que múltiples componentes se suscriban a eventos y reciban notificaciones automáticas cuando
              ocurren cambios.
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li>✓ Comunicación desacoplada entre componentes</li>
              <li>✓ Actualizaciones en tiempo real</li>
              <li>✓ Múltiples suscriptores a un evento</li>
              <li>✓ Fácil agregar/remover observadores</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Reservation Modal */}
      {selectedSpace && (
        <ReservationModal
          space={selectedSpace}
          onClose={() => setSelectedSpace(null)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </div>
  )
}
