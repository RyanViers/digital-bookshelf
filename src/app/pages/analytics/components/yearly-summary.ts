import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from '../analytics.service';

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

@Component({
  selector: 'app-yearly-summary',
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-white">{{ analyticsService.selectedYear() }} Reading Summary</h2>
      
      <!-- Year Overview Card -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Year Overview</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-400">{{ analyticsService.booksFinishedThisYear().length }}</div>
            <div class="text-sm text-slate-400">Books Finished</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-emerald-400">{{ getTotalPages() }}</div>
            <div class="text-sm text-slate-400">Pages Read</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-400">{{ getTotalReadingTime() }}</div>
            <div class="text-sm text-slate-400">Hours Read</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-amber-400">{{ analyticsService.averageRatingThisYear() || '—' }}</div>
            <div class="text-sm text-slate-400">Avg Rating</div>
          </div>
        </div>
      </div>

      <!-- Top Books -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Top Rated Books</h3>
        @if (getTopRatedBooks().length > 0) {
          <div class="space-y-3">
            @for (book of getTopRatedBooks(); track book.id) {
              <div class="flex items-center justify-between p-3 border border-slate-600 rounded-lg bg-slate-700/50">
                <div class="flex items-center">
                  <img 
                    [src]="book.coverImageUrl || 'https://placehold.co/40x60/475569/94a3b8?text=Cover'" 
                    [alt]="'Cover for ' + book.title"
                    class="w-10 h-15 object-cover rounded mr-3">
                  <div>
                    <h4 class="font-medium text-white">{{ book.title }}</h4>
                    <p class="text-sm text-slate-400">{{ book.author }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg 
                      class="h-4 w-4"
                      [class.text-amber-400]="star <= (book.rating || 0)"
                      [class.text-slate-600]="star > (book.rating || 0)"
                      viewBox="0 0 20 20" 
                      fill="currentColor">
                      <path d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" />
                    </svg>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">⭐</div>
            <p>No rated books yet for {{ analyticsService.selectedYear() }}</p>
          </div>
        }
      </div>

      <!-- Reading Patterns -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Reading Patterns</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-slate-300 mb-3">Monthly Breakdown</h4>
            <div class="space-y-2">
              @for (monthData of getMonthlyBreakdown(); track monthData.month) {
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-400">{{ monthData.name }}</span>
                  <div class="flex items-center">
                    <div class="w-20 bg-slate-700 rounded-full h-2 mr-2">
                      <div 
                        class="bg-indigo-500 h-2 rounded-full"
                        [style.width.%]="(monthData.books / getBestMonth()) * 100">
                      </div>
                    </div>
                    <span class="text-sm font-medium text-white w-8">{{ monthData.books }}</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div>
            <h4 class="font-medium text-slate-300 mb-3">Reading Status</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">To Read</span>
                <span class="text-sm font-medium text-white">{{ getToReadCount() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Currently Reading</span>
                <span class="text-sm font-medium text-white">{{ analyticsService.booksCurrentlyReading().length }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-400">Finished</span>
                <span class="text-sm font-medium text-white">{{ analyticsService.booksFinishedThisYear().length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Year in Review -->
      <div class="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-6 border border-indigo-600/30">
        <h3 class="text-lg font-semibold text-white mb-4">{{ analyticsService.selectedYear() }} Highlights</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center">
            <div class="text-2xl mr-3">📚</div>
            <div>
              <p class="font-medium text-white">Best Reading Month</p>
              <p class="text-sm text-slate-300">{{ getBestMonthName() }} with {{ getBestMonth() }} books</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="text-2xl mr-3">⭐</div>
            <div>
              <p class="font-medium text-white">Favorite Genre</p>
              <p class="text-sm text-slate-300">{{ getFavoriteGenre() }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="text-2xl mr-3">🎯</div>
            <div>
              <p class="font-medium text-white">Goal Progress</p>
              <p class="text-sm text-slate-300">{{ getGoalProgressSummary() }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="text-2xl mr-3">📖</div>
            <div>
              <p class="font-medium text-white">Reading Pace</p>
              <p class="text-sm text-slate-300">{{ getReadingPace() }} books per month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class YearlySummary {
  protected analyticsService = inject(AnalyticsService);
  private platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);

  protected getTotalPages(): number {
    // Placeholder - would calculate from actual page data
    return this.analyticsService.booksFinishedThisYear().length * 275; // Average pages per book
  }

  protected getTotalReadingTime(): number {
    // Placeholder - would calculate from reading sessions
    return Math.round(this.analyticsService.booksFinishedThisYear().length * 8.5); // Average hours per book
  }

  protected getTopRatedBooks() {
    return this.analyticsService.booksFinishedThisYear()
      .filter(book => book.rating && book.rating >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }

  protected getMonthlyBreakdown() {
    const monthlyData: { month: number; name: string; books: number }[] = [];
    
    for (let i = 0; i < 12; i++) {
      const monthBooks = this.analyticsService.booksFinishedThisYear()
        .filter(book => {
          const bookDate = toSafeDate(book.createdAt);
          return bookDate.getMonth() === i;
        }).length;
      
      monthlyData.push({
        month: i,
        name: new Date(2000, i).toLocaleDateString('en-US', { month: 'short' }),
        books: monthBooks
      });
    }
    
    return monthlyData;
  }

  protected getBestMonth(): number {
    const breakdown = this.getMonthlyBreakdown();
    return Math.max(...breakdown.map(m => m.books));
  }

  protected getBestMonthName(): string {
    const breakdown = this.getMonthlyBreakdown();
    const bestMonth = breakdown.find(m => m.books === this.getBestMonth());
    return bestMonth?.name || 'N/A';
  }

  protected getToReadCount(): number {
    return this.analyticsService.books()?.filter(book => book.status === 'to-read').length || 0;
  }

  protected getFavoriteGenre(): string {
    const finishedBooks = this.analyticsService.booksFinishedThisYear();
    if (finishedBooks.length === 0) return 'N/A';
    
    // Simple genre assignment based on book titles/authors for demo
    // In a real app, you'd have genre metadata
    const genreKeywords = {
      'Fantasy': ['fantasy', 'dragon', 'magic', 'wizard', 'tolkien', 'martin', 'jordan'],
      'Science Fiction': ['sci-fi', 'space', 'robot', 'future', 'asimov', 'clarke', 'herbert'],
      'Mystery': ['mystery', 'detective', 'murder', 'crime', 'christie', 'conan'],
      'Romance': ['love', 'romance', 'heart', 'passion'],
      'Thriller': ['thriller', 'suspense', 'action'],
      'Non-Fiction': ['history', 'biography', 'science', 'politics', 'business']
    };
    
    const genreCounts: { [key: string]: number } = {};
    
    finishedBooks.forEach(book => {
      const bookText = (book.title + ' ' + book.author + ' ' + (book.description || '')).toLowerCase();
      
      for (const [genre, keywords] of Object.entries(genreKeywords)) {
        if (keywords.some(keyword => bookText.includes(keyword))) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          return; // Only assign one genre per book
        }
      }
      
      // Default to Fiction if no specific genre found
      genreCounts['Fiction'] = (genreCounts['Fiction'] || 0) + 1;
    });
    
    // Return the genre with the most books
    const topGenre = Object.entries(genreCounts).reduce((a, b) => 
      genreCounts[a[0]] > genreCounts[b[0]] ? a : b
    );
    
    return topGenre ? topGenre[0] : 'Fiction';
  }

  protected getGoalProgressSummary(): string {
    const goals = this.analyticsService.readingGoalProgress();
    if (goals.length === 0) return 'No goals set';
    
    const completedGoals = goals.filter(g => g.percentage >= 100).length;
    return `${completedGoals}/${goals.length} goals achieved`;
  }

  protected getReadingPace(): number {
    const monthsElapsed = new Date().getMonth() + 1;
    const booksFinished = this.analyticsService.booksFinishedThisYear().length;
    return Math.round((booksFinished / monthsElapsed) * 10) / 10;
  }
}
