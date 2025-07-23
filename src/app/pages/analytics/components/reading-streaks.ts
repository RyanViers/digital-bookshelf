import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-reading-streaks',
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-white">Reading Streaks</h2>
      
      <!-- Streak Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Current Streak -->
        <div class="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg p-6 text-white border border-purple-500/20 shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Current Streak</h3>
              <p class="text-3xl font-bold mt-2">{{ analyticsService.sessions() ? analyticsService.readingStreak().currentStreak : 0 }}</p>
              <p class="text-purple-200 text-sm mt-1">consecutive days</p>
            </div>
            <div class="text-4xl">🔥</div>
          </div>
        </div>

        <!-- Longest Streak -->
        <div class="bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg p-6 text-white border border-emerald-500/20 shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Longest Streak</h3>
              <p class="text-3xl font-bold mt-2">{{ analyticsService.sessions() ? analyticsService.readingStreak().longestStreak : 0 }}</p>
              <p class="text-emerald-200 text-sm mt-1">days record</p>
            </div>
            <div class="text-4xl">🏆</div>
          </div>
        </div>
      </div>

      <!-- Streak Calendar -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Reading Activity Calendar</h3>
        @if (isBrowser) {
          <div class="space-y-4">
            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-1 text-xs">
              <!-- Day Headers -->
              <div class="text-center text-slate-400 font-medium p-2">Sun</div>
              <div class="text-center text-slate-400 font-medium p-2">Mon</div>
              <div class="text-center text-slate-400 font-medium p-2">Tue</div>
              <div class="text-center text-slate-400 font-medium p-2">Wed</div>
              <div class="text-center text-slate-400 font-medium p-2">Thu</div>
              <div class="text-center text-slate-400 font-medium p-2">Fri</div>
              <div class="text-center text-slate-400 font-medium p-2">Sat</div>
              
              <!-- Calendar Days -->
              @for (day of getCalendarDays(); track day.date) {
                <div 
                  class="aspect-square rounded p-1 text-center text-xs flex items-center justify-center transition-colors"
                  [class.bg-slate-700]="!day.hasActivity && day.isCurrentMonth"
                  [class.bg-emerald-600]="day.hasActivity && day.activityLevel === 'high'"
                  [class.bg-emerald-700]="day.hasActivity && day.activityLevel === 'medium'" 
                  [class.bg-emerald-800]="day.hasActivity && day.activityLevel === 'low'"
                  [class.text-slate-500]="!day.isCurrentMonth"
                  [class.text-white]="day.isCurrentMonth"
                  [title]="day.hasActivity ? day.activityLevel + ' activity' : 'No activity'">
                  {{ day.day }}
                </div>
              }
            </div>
            
            <!-- Legend -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-slate-400">
                {{ getStartOfMonth() | date:'MMMM yyyy' }}
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span>Less</span>
                <div class="w-3 h-3 bg-slate-700 rounded-sm"></div>
                <div class="w-3 h-3 bg-emerald-800 rounded-sm"></div>
                <div class="w-3 h-3 bg-emerald-700 rounded-sm"></div>
                <div class="w-3 h-3 bg-emerald-600 rounded-sm"></div>
                <span>More</span>
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-12 text-slate-400">
            <div class="text-4xl mb-4">📅</div>
            <p class="text-lg mb-2 text-slate-300">Loading calendar...</p>
          </div>
        }
      </div>

      <!-- Streak Achievements -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Streak Achievements</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex items-center p-4 border border-slate-600 rounded-lg bg-slate-700/50">
            <div class="text-2xl mr-3">🥉</div>
            <div>
              <h4 class="font-medium text-white">Week Warrior</h4>
              <p class="text-sm text-slate-400">7-day reading streak</p>
              <span 
                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1"
                [class]="getAchievementClasses(7)">
                {{ getAchievementStatus(7) }}
              </span>
            </div>
          </div>

          <div class="flex items-center p-4 border border-slate-600 rounded-lg bg-slate-700/50">
            <div class="text-2xl mr-3">🥈</div>
            <div>
              <h4 class="font-medium text-white">Monthly Master</h4>
              <p class="text-sm text-slate-400">30-day reading streak</p>
              <span 
                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1"
                [class]="getAchievementClasses(30)">
                {{ getAchievementStatus(30) }}
              </span>
            </div>
          </div>

          <div class="flex items-center p-4 border border-slate-600 rounded-lg bg-slate-700/50">
            <div class="text-2xl mr-3">🥇</div>
            <div>
              <h4 class="font-medium text-white">Century Scholar</h4>
              <p class="text-sm text-slate-400">100-day reading streak</p>
              <span 
                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1"
                [class]="getAchievementClasses(100)">
                {{ getAchievementStatus(100) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivation Section -->
      <div class="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-6 border border-indigo-600/30">
        <div class="flex items-start">
          <div class="text-3xl mr-4">💡</div>
          <div>
            <h3 class="text-lg font-semibold text-white mb-2">Keep Your Streak Alive!</h3>
            <p class="text-slate-300 mb-3">
              Reading consistently, even for just 10-15 minutes a day, can help you finish 12-15 books per year.
            </p>
            @if (analyticsService.readingStreak().lastReadDate) {
              <p class="text-sm text-slate-400">
                Last read: {{ analyticsService.readingStreak().lastReadDate | date:'short' }}
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReadingStreaks {
  protected analyticsService = inject(AnalyticsService);
  private platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);

  protected getCalendarDays() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get first day of the month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the first Sunday of the calendar (might be from previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Get the last Saturday of the calendar (might be from next month)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Get reading sessions for activity checking
    const sessions = this.analyticsService.sessions() || [];
    const sessionDates = new Set(
      sessions.map(session => {
        const date = session.startTime instanceof Date ? session.startTime : new Date(session.startTime);
        return date.toDateString();
      })
    );
    
    while (currentDate <= endDate) {
      const dayString = currentDate.toDateString();
      const hasActivity = sessionDates.has(dayString);
      const isCurrentMonth = currentDate.getMonth() === month;
      
      // Simple activity level based on whether there was a session
      const activityLevel = hasActivity ? 'medium' : 'none';
      
      days.push({
        date: dayString,
        day: currentDate.getDate(),
        hasActivity,
        activityLevel,
        isCurrentMonth
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }

  protected getStartOfMonth(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  protected getAchievementStatus(requiredDays: number): string {
    const longestStreak = this.analyticsService.sessions() ? this.analyticsService.readingStreak().longestStreak : 0;
    
    if (longestStreak >= requiredDays) {
      return 'Achieved';
    } else if (longestStreak >= Math.floor(requiredDays / 2)) {
      return 'In Progress';
    } else {
      return 'Locked';
    }
  }

  protected getAchievementClasses(requiredDays: number): string {
    const longestStreak = this.analyticsService.sessions() ? this.analyticsService.readingStreak().longestStreak : 0;
    
    if (longestStreak >= requiredDays) {
      return 'bg-emerald-900/50 border border-emerald-600 text-emerald-400';
    } else if (longestStreak >= Math.floor(requiredDays / 2)) {
      return 'bg-amber-900/50 border border-amber-600 text-amber-400';
    } else {
      return 'bg-slate-700 border border-slate-600 text-slate-400';
    }
  }
}
