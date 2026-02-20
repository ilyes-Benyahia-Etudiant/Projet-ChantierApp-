import { TaskStatus } from '@prisma/client';

export class Task {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: TaskStatus;
  user_id: number | null;
  project_id: number;
  updated_at: Date;
  created_at: Date;
}
