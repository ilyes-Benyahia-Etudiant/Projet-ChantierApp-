
export interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: TaskStatus;
  user_id: number | null;
  project_id: number;
}

export type TaskStatus = "pending" | "stopped" | "finished" | "started";
