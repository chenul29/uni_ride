export type BusStop = {
  name: string
  detail: string
  x: number
  y: number
  passed?: boolean
}

export type LiveBus = {
  id: string
  driverPhone: string
  supportPhone: string
  routeName: string
  status: 'On route' | 'Arriving soon'
  eta: string
  nextStop: string
  progress: number
  x: number
  y: number
  stops: BusStop[]
}

export type StudentLocation = {
  latitude: number
  longitude: number
  accuracy: number
}

export type EventSchedule = {
  event: string
  date: string
  times: string
  route: string
  note: string
}

export const specialEventSchedules: EventSchedule[] = [
  {
    event: 'Freshers Welcome Night',
    date: '18 Oct · Saturday',
    times: '6:00 PM · 8:30 PM · 10:30 PM',
    route: 'Campus → Kandy City → Peradeniya',
    note: 'Extra return trips from Main Gate',
  },
  {
    event: 'Inter-campus Sports Meet',
    date: '26 Oct · Sunday',
    times: '7:00 AM · 12:30 PM · 5:30 PM',
    route: 'Campus → Kandy City → Peradeniya',
    note: 'Early morning departure available',
  },
]

export const mockStudentLocation: StudentLocation = {
  latitude: 7.2906,
  longitude: 80.6337,
  accuracy: 120,
}

// This adapter is intentionally small so Firebase realtime data can replace it later.
export const mockLiveBus: LiveBus = {
  id: 'UR-04',
  driverPhone: '0000000000',
  supportPhone: '0000000000',
  routeName: 'Kandy City Loop',
  status: 'On route',
  eta: '4 min',
  nextStop: 'Main Gate',
  progress: 68,
  x: 65,
  y: 44,
  stops: [
    { name: 'Kandy Railway Station', detail: 'Start point', x: 15, y: 72, passed: true },
    { name: 'City Centre', detail: 'Passed 2 min ago', x: 32, y: 54, passed: true },
    { name: 'Main Gate', detail: 'Arriving in 4 min', x: 65, y: 44 },
    { name: 'North Campus', detail: '8 min after Main Gate', x: 84, y: 22 },
  ],
}
