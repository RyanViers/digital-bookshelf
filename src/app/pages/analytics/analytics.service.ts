import { inject, Injectable, signal, computed } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { 
  ReadingGoal, 
  NewReadingGoal, 
  ReadingSession, 
  NewReadingSession, 
  ReadingStreak, 
  MonthlyStats, 
  GoalProgress,
  ChartData 
} from './analytics.models';

// Utility function to safely convert any date-like value to a Date object
function toSafeDate(dateValue: any): Date {
  if (dateValue instanceof Date) {
    return dateValue;
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    return new Date(dateValue);
  } else if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
    // Firestore Timestamp
    return dateValue.toDate();
  } else {
    // Fallback
    return new Date(dateValue);
  }
}

@Injectable()
export class AnalyticsService {
  private firestoreService = inject(FirestoreService);

  // --- State Signals ---
  public selectedYear = signal<number>(new Date().getFullYear());
  public activeTab = signal<'overview' | 'goals' | 'streaks' | 'detailed'>('overview');

  // --- Data Signals ---
  public books = this.firestoreService.books;
  public goals = this.firestoreService.goals;
  public sessions = this.firestoreService.sessions;
  public isLoading = this.firestoreService.isLoading;
  public isGoalsLoading = this.firestoreService.isGoalsLoading;
  public isSessionsLoading = this.firestoreService.isSessionsLoading;

  // --- Computed Analytics ---
  public currentYearBooks = computed(() => {
    const year = this.selectedYear();
    const allBooks = this.books() || [];
    
    // If no books exist, return empty array
    if (allBooks.length === 0) return [];
    
    return allBooks.filter(book => {
      if (!book.createdAt) return false;
      
      const bookDate = toSafeDate(book.createdAt);
      return bookDate.getFullYear() === year;
    });
  });

  public booksFinishedThisYear = computed(() => 
    this.currentYearBooks().filter(book => book.status === 'finished')
  );

  public booksCurrentlyReading = computed(() => 
    this.books()?.filter(book => book.status === 'reading') || []
  );

  // Debug method to see what years have books
  public availableBookYears = computed(() => {
    const allBooks = this.books() || [];
    const years = new Set<number>();
    
    allBooks.forEach(book => {
      if (!book.createdAt) return;
      
      let bookYear: number;
      if (book.createdAt instanceof Date) {
        bookYear = book.createdAt.getFullYear();
      } else if (typeof book.createdAt === 'string') {
        bookYear = new Date(book.createdAt).getFullYear();
      } else if (book.createdAt && typeof book.createdAt === 'object' && 'toDate' in book.createdAt) {
        bookYear = (book.createdAt as any).toDate().getFullYear();
      } else {
        bookYear = new Date(book.createdAt as any).getFullYear();
      }
      
      years.add(bookYear);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  });

  public averageRatingThisYear = computed(() => {
    const finishedBooks = this.booksFinishedThisYear();
    const ratedBooks = finishedBooks.filter(book => book.rating);
    if (ratedBooks.length === 0) return 0;
    
    const totalRating = ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
    return Math.round((totalRating / ratedBooks.length) * 10) / 10;
  });

  public readingGoalProgress = computed((): GoalProgress[] => {
    const currentGoals = this.goals()?.filter(goal => goal.year === this.selectedYear()) || [];
    const finishedBooks = this.booksFinishedThisYear();
    
    // If goals failed to load, return empty array
    if (!this.goals()) {
      return [];
    }
    
    return currentGoals.map(goal => {
      let current = 0;
      
      if (goal.type === 'books') {
        current = finishedBooks.length;
      } else if (goal.type === 'pages') {
        // This would need page tracking - placeholder for now
        current = finishedBooks.length * 250; // Average pages per book
      } else if (goal.type === 'minutes') {
        // This would come from reading sessions
        current = this.sessions()
          ?.filter(session => {
            const startTime = session.startTime instanceof Date ? session.startTime : new Date(session.startTime);
            return startTime.getFullYear() === this.selectedYear();
          })
          .reduce((total, session) => total + session.duration, 0) || 0;
      }

      const percentage = Math.min((current / goal.target) * 100, 100);
      const remaining = Math.max(goal.target - current, 0);
      const daysLeft = Math.max(
        Math.ceil((new Date(goal.year, 11, 31).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        0
      );
      const onTrack = daysLeft > 0 ? (current / (365 - daysLeft) * 365) >= goal.target : current >= goal.target;

      return {
        goal: { ...goal, current },
        percentage,
        remaining,
        onTrack,
        projectedCompletion: onTrack && daysLeft > 0 ? 
          new Date(Date.now() + (remaining / (current / (365 - daysLeft))) * 24 * 60 * 60 * 1000) : 
          null
      };
    });
  });

  public monthlyReadingData = computed((): ChartData[] => {
    const finishedBooks = this.booksFinishedThisYear();
    const monthlyData: { [key: number]: number } = {};

    // Initialize all months to 0
    for (let i = 0; i < 12; i++) {
      monthlyData[i] = 0;
    }

    // Count books finished per month
    finishedBooks.forEach(book => {
      const createdAt = toSafeDate(book.createdAt);
      const month = createdAt.getMonth();
      monthlyData[month]++;
    });

    return Object.entries(monthlyData).map(([month, count]) => ({
      name: new Date(2000, parseInt(month)).toLocaleDateString('en-US', { month: 'short' }),
      value: count
    }));
  });

  public genreDistribution = computed((): ChartData[] => {
    const finishedBooks = this.booksFinishedThisYear();
    const genreCounts: { [key: string]: number } = {};
    
    // Genre classification based on book content
    const genreKeywords = {
      'Fantasy': ['fantasy', 'dragon', 'magic', 'wizard', 'tolkien', 'martin', 'jordan'],
      'Science Fiction': ['sci-fi', 'space', 'robot', 'future', 'asimov', 'clarke', 'herbert'],
      'Mystery': ['mystery', 'detective', 'murder', 'crime', 'christie', 'conan'],
      'Romance': ['love', 'romance', 'heart', 'passion'],
      'Thriller': ['thriller', 'suspense', 'action'],
      'Non-Fiction': ['history', 'biography', 'science', 'politics', 'business']
    };
    
    finishedBooks.forEach(book => {
      const bookText = (book.title + ' ' + book.author + ' ' + (book.description || '')).toLowerCase();
      let genreAssigned = false;
      
      for (const [genre, keywords] of Object.entries(genreKeywords)) {
        if (keywords.some(keyword => bookText.includes(keyword))) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          genreAssigned = true;
          break; // Only assign one genre per book
        }
      }
      
      // Default to Fiction if no specific genre found
      if (!genreAssigned) {
        genreCounts['Fiction'] = (genreCounts['Fiction'] || 0) + 1;
      }
    });

    return Object.entries(genreCounts).map(([genre, count]) => ({
      name: genre,
      value: count
    }));
  });

  public readingStreak = computed((): ReadingStreak => {
    const sessions = this.sessions();
    
    // Handle case where sessions failed to load or is empty
    if (!sessions || sessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null
      };
    }

    // Sort sessions by date (most recent first)
    const sortedSessions = sessions
      .map(session => {
        const startTime = session.startTime instanceof Date ? session.startTime : new Date(session.startTime);
        return startTime;
      })
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedSessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    // Calculate streaks
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i]);
      sessionDate.setHours(0, 0, 0, 0);

      if (i === 0) {
        // First session
        lastDate = sessionDate;
        currentStreak = 1;
        tempStreak = 1;
      } else {
        const daysDiff = Math.floor((lastDate!.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          tempStreak++;
          if (i === 0 || (sessionDate.getTime() >= today.getTime() - 86400000)) {
            currentStreak = tempStreak;
          }
        } else {
          // Streak broken
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (sessionDate.getTime() >= today.getTime() - 86400000) {
            currentStreak = 1;
          } else {
            currentStreak = 0;
          }
        }
        
        lastDate = sessionDate;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      lastReadDate: sortedSessions[0] || null
    };
  });

  // --- Goal Management Methods ---
  public async createGoal(newGoal: NewReadingGoal): Promise<void> {
    try {
      await this.firestoreService.createGoal(newGoal);
    } catch (error) {
      console.error('Failed to create goal:', error);
      throw error;
    }
  }

  public async updateGoal(goalId: string, updates: Partial<ReadingGoal>): Promise<void> {
    try {
      await this.firestoreService.updateGoal(goalId, updates);
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  }

  public async deleteGoal(goalId: string): Promise<void> {
    try {
      await this.firestoreService.deleteGoal(goalId);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  }

  // --- Session Management Methods ---
  public async createSession(newSession: NewReadingSession): Promise<void> {
    try {
      await this.firestoreService.createSession(newSession);
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }

  // --- Goal Progress Updates ---
  public async updateGoalProgress(bookStatusChange?: { from: string; to: string }): Promise<void> {
    if (!bookStatusChange || bookStatusChange.to !== 'finished') return;

    try {
      const currentYear = new Date().getFullYear();
      const bookGoals = this.goals()?.filter(goal => 
        goal.year === currentYear && goal.type === 'books'
      ) || [];

      for (const goal of bookGoals) {
        const finishedBooksCount = this.booksFinishedThisYear().length;
        await this.updateGoal(goal.id, { current: finishedBooksCount });
      }
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    }
  }
}
