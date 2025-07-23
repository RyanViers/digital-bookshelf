/**
 * Defines the data structure for reading goals.
 */
export interface ReadingGoal {
  id: string;
  userId: string;
  year: number;
  type: 'books' | 'pages' | 'minutes';
  target: number;
  current: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The type used when creating a new reading goal.
 */
export type NewReadingGoal = Omit<ReadingGoal, 'id' | 'userId' | 'current' | 'createdAt' | 'updatedAt'>;

/**
 * Reading session for time tracking.
 */
export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  pagesRead?: number;
  notes?: string;
  createdAt: Date;
}

/**
 * The type used when creating a new reading session.
 */
export type NewReadingSession = Omit<ReadingSession, 'id' | 'userId' | 'createdAt'>;

/**
 * Reading streak data.
 */
export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: Date | null;
}

/**
 * Monthly reading statistics.
 */
export interface MonthlyStats {
  year: number;
  month: number;
  booksFinished: number;
  pagesRead: number;
  minutesRead: number;
  averageRating: number;
}

/**
 * Chart data structure for analytics displays.
 */
export interface ChartData {
  name: string;
  value: number;
  extra?: any;
}

/**
 * Progress data for goal tracking.
 */
export interface GoalProgress {
  goal: ReadingGoal;
  percentage: number;
  remaining: number;
  onTrack: boolean;
  projectedCompletion: Date | null;
}
