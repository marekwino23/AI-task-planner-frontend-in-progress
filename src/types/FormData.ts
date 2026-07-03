
export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: number;
  name: string;
  priority: Priority;
  estimated_hours: number;
}

export interface PlannedTask {
    title: string;
    duration_hours: number;
}

export interface DayPlan {
    day: number;
    tasks: PlannedTask[];
}

export interface WeeklyPlan {
    days: DayPlan[];
}