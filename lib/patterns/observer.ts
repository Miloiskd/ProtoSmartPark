// OBSERVER PATTERN - Notificaciones en tiempo real
// Permite que múltiples componentes se suscriban a cambios de estado

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
}

// Interfaz del Observer
export interface IObserver {
  update(notification: Notification): void
}

// Interfaz del Subject (Observable)
export interface ISubject {
  attach(observer: IObserver): void
  detach(observer: IObserver): void
  notify(notification: Notification): void
}

// Implementación del Subject
export class NotificationSubject implements ISubject {
  private observers: IObserver[] = []

  attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer)
    if (!isExist) {
      this.observers.push(observer)
      console.log("[v0] Observer attached. Total observers:", this.observers.length)
    }
  }

  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1)
      console.log("[v0] Observer detached. Total observers:", this.observers.length)
    }
  }

  notify(notification: Notification): void {
    console.log("[v0] Notifying observers:", notification.title)
    for (const observer of this.observers) {
      observer.update(notification)
    }
  }
}

// Subject para cambios de disponibilidad de espacios
export class ParkingAvailabilitySubject extends NotificationSubject {
  notifySpaceAvailable(spaceName: string): void {
    this.notify({
      id: `notif-${Date.now()}`,
      type: "success",
      title: "¡Espacio Disponible!",
      message: `${spaceName} ahora tiene espacios disponibles`,
      timestamp: new Date(),
    })
  }

  notifySpaceOccupied(spaceName: string): void {
    this.notify({
      id: `notif-${Date.now()}`,
      type: "warning",
      title: "Espacio Ocupado",
      message: `${spaceName} está llegando a su capacidad máxima`,
      timestamp: new Date(),
    })
  }

  notifyReservationConfirmed(spaceName: string): void {
    this.notify({
      id: `notif-${Date.now()}`,
      type: "success",
      title: "Reserva Confirmada",
      message: `Tu reserva en ${spaceName} ha sido confirmada`,
      timestamp: new Date(),
    })
  }
}

// Singleton instance
export const parkingAvailabilitySubject = new ParkingAvailabilitySubject()
