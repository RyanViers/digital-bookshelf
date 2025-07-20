import { inject, Injectable, computed } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private firestoreService = inject(FirestoreService);
  private books = computed(() => this.firestoreService.books() || []);

  // --- Stat Card Signals ---
  public currentlyReadingCount = computed(() => 
    this.books().filter(book => book.status === 'reading').length
  );
  public booksFinishedCount = computed(() => 
    this.books().filter(book => book.status === 'finished').length
  );
  public toReadCount = computed(() => 
    this.books().filter(book => book.status === 'to-read').length
  );

  // --- "Continue Reading" List ---
  public currentlyReadingList = computed(() => 
    this.books().filter(book => book.status === 'reading').slice(0, 4) // Limit to 4 for the UI
  );

  // --- NEW: Advanced Chart Data ---

  // Average Rating Gauge Chart
  public averageRating = computed(() => {
    const ratedBooks = this.books().filter(b => b.status === 'finished' && b.rating);
    if (ratedBooks.length === 0) return 0;
    const totalRating = ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
    return parseFloat((totalRating / ratedBooks.length).toFixed(1));
  });

  // Top Authors Bar Chart
  public topAuthorsChartData = computed(() => {
    const authorCounts = new Map<string, number>();
    this.books().forEach(book => {
      authorCounts.set(book.author, (authorCounts.get(book.author) || 0) + 1);
    });
    return Array.from(authorCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Show top 5 authors
  });

  // Books Finished by Month (Line Chart)
  public booksByMonthChartData = computed(() => {
    const monthCounts = new Map<string, number>();
    const finishedBooks = this.books().filter(b => b.status === 'finished');

    for (const book of finishedBooks) {
      const date = (book.createdAt as any).toDate ? (book.createdAt as any).toDate() : new Date(book.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
    }

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const series = monthOrder.map(month => ({
      name: month,
      value: monthCounts.get(month) || 0,
    }));
    return [{ name: 'Books Finished', series }];
  });

  // Status Distribution (Pie Chart)
  public statusDistributionChartData = computed(() => [
    { name: 'To Read', value: this.toReadCount() },
    { name: 'Reading', value: this.currentlyReadingCount() },
    { name: 'Finished', value: this.booksFinishedCount() },
  ]);
}