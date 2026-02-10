export interface FormData {
  name: string;
  email: string;
  phone: string;
  type: string;
  description: string;
  dayNumber: number;
  isScheduled: boolean;
}

export interface DayObject {
  day: number;
  isAvailable?: boolean;
}
