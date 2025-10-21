// REPOSITORY PATTERN - Abstracción de acceso a datos
// Separa la lógica de negocio de la lógica de acceso a datos

export interface ParkingSpace {
  id: string
  name: string
  location: string
  status: "available" | "occupied" | "reserved"
  price: number
  coordinates: { lat: number; lng: number }
  capacity: number
  occupied: number
}

export interface Reservation {
  id: string
  spaceId: string
  userId: string
  startTime: Date
  endTime: Date
  status: "pending" | "confirmed" | "cancelled"
}

// Interfaz del Repository - define el contrato
export interface IParkingRepository {
  getAllSpaces(): Promise<ParkingSpace[]>
  getSpaceById(id: string): Promise<ParkingSpace | null>
  updateSpaceStatus(id: string, status: ParkingSpace["status"]): Promise<void>
  createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation>
  getReservationsByUser(userId: string): Promise<Reservation[]>
}

// Implementación concreta del Repository
export class ParkingRepository implements IParkingRepository {
  private spaces: ParkingSpace[] = [
    {
      id: "1",
      name: "Centro Comercial Plaza",
      location: "Av. Principal 123",
      status: "available",
      price: 3.5,
      coordinates: { lat: 4.6097, lng: -74.0817 },
      capacity: 150,
      occupied: 45,
    },
    {
      id: "2",
      name: "Parqueadero Torre Empresarial",
      location: "Calle 72 #10-34",
      status: "available",
      price: 4.0,
      coordinates: { lat: 4.6533, lng: -74.0602 },
      capacity: 200,
      occupied: 180,
    },
    {
      id: "3",
      name: "Estacionamiento Zona Rosa",
      location: "Carrera 13 #82-71",
      status: "occupied",
      price: 5.0,
      coordinates: { lat: 4.6667, lng: -74.0548 },
      capacity: 100,
      occupied: 100,
    },
    {
      id: "4",
      name: "Parking Aeropuerto",
      location: "Terminal 1, Aeropuerto El Dorado",
      status: "available",
      price: 6.5,
      coordinates: { lat: 4.7016, lng: -74.1469 },
      capacity: 500,
      occupied: 320,
    },
  ]

  private reservations: Reservation[] = []

  async getAllSpaces(): Promise<ParkingSpace[]> {
    // Simula latencia de red
    await this.delay(300)
    return [...this.spaces]
  }

  async getSpaceById(id: string): Promise<ParkingSpace | null> {
    await this.delay(100)
    return this.spaces.find((space) => space.id === id) || null
  }

  async updateSpaceStatus(id: string, status: ParkingSpace["status"]): Promise<void> {
    await this.delay(200)
    const space = this.spaces.find((s) => s.id === id)
    if (space) {
      space.status = status
      if (status === "occupied") {
        space.occupied = Math.min(space.occupied + 1, space.capacity)
      } else if (status === "available" && space.occupied > 0) {
        space.occupied = Math.max(space.occupied - 1, 0)
      }
    }
  }

  async createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation> {
    await this.delay(300)
    const newReservation: Reservation = {
      ...reservation,
      id: `res-${Date.now()}`,
    }
    this.reservations.push(newReservation)
    await this.updateSpaceStatus(reservation.spaceId, "reserved")
    return newReservation
  }

  async getReservationsByUser(userId: string): Promise<Reservation[]> {
    await this.delay(200)
    return this.reservations.filter((r) => r.userId === userId)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// Singleton instance
export const parkingRepository = new ParkingRepository()
