import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { ReadingGoals } from './components/reading-goals';
import { ProgressCharts } from './components/progress-charts';
import { ReadingStreaks } from './components/reading-streaks';
import { YearlySummary } from './components/yearly-summary';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, ReadingGoals, ProgressCharts, ReadingStreaks, YearlySummary],
  providers: [AnalyticsService],
  template: `
    <div class="min-h-screen bg-slate-700 text-slate-100">
      <div class="space-y-6 p-6">
        <!-- Header -->
        <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Reading Analytics</h1>
            <p class="mt-1 text-slate-400">Track your reading progress and achieve your goals.</p>
          </div>
          
          <!-- Year Selector -->
          <div class="flex items-center gap-2">
            <label for="year-select" class="text-sm font-medium text-slate-300">Year:</label>
            <select 
              id="year-select"
              [value]="analyticsService.selectedYear()"
              (change)="onYearChange($event)"
              class="rounded-md bg-slate-800 border-slate-600 text-slate-100 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400">
              @for (year of availableYears; track year) {
                <option [value]="year" class="bg-slate-800">{{ year }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="border-b border-slate-700">
          <nav class="-mb-px flex space-x-8">
            <button 
              (click)="analyticsService.activeTab.set('overview')"
              [class.border-indigo-400]="analyticsService.activeTab() === 'overview'"
              [class.text-indigo-400]="analyticsService.activeTab() === 'overview'"
              [class.border-transparent]="analyticsService.activeTab() !== 'overview'"
              [class.text-slate-400]="analyticsService.activeTab() !== 'overview'"
              class="whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-colors">
              Overview
            </button>
            <button 
              (click)="analyticsService.activeTab.set('goals')"
              [class.border-indigo-400]="analyticsService.activeTab() === 'goals'"
              [class.text-indigo-400]="analyticsService.activeTab() === 'goals'"
              [class.border-transparent]="analyticsService.activeTab() !== 'goals'"
              [class.text-slate-400]="analyticsService.activeTab() !== 'goals'"
              class="whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-colors">
              Goals
            </button>
            <button 
              (click)="analyticsService.activeTab.set('streaks')"
              [class.border-indigo-400]="analyticsService.activeTab() === 'streaks'"
              [class.text-indigo-400]="analyticsService.activeTab() === 'streaks'"
              [class.border-transparent]="analyticsService.activeTab() !== 'streaks'"
              [class.text-slate-400]="analyticsService.activeTab() !== 'streaks'"
              class="whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-colors">
              Streaks
            </button>
            <button 
              (click)="analyticsService.activeTab.set('detailed')"
              [class.border-indigo-400]="analyticsService.activeTab() === 'detailed'"
              [class.text-indigo-400]="analyticsService.activeTab() === 'detailed'"
              [class.border-transparent]="analyticsService.activeTab() !== 'detailed'"
              [class.text-slate-400]="analyticsService.activeTab() !== 'detailed'"
              class="whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium hover:border-slate-500 hover:text-slate-300 transition-colors">
              Detailed
            </button>
          </nav>
        </div>

        <!-- Loading State -->
        @if (analyticsService.isLoading()) {
          <p class="text-center text-slate-400 py-8">Loading analytics...</p>
        } @else {
          <!-- Tab Content -->
          @switch (analyticsService.activeTab()) {
            @case ('overview') {
              <div class="space-y-6">
                <!-- Quick Stats Cards -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
                    <dt class="truncate text-sm font-medium text-slate-400">Books Finished</dt>
                    <dd class="mt-1 text-3xl font-bold tracking-tight text-emerald-400">
                      {{ analyticsService.booksFinishedThisYear().length }}
                    </dd>
                  </div>
                  <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
                    <dt class="truncate text-sm font-medium text-slate-400">Currently Reading</dt>
                    <dd class="mt-1 text-3xl font-bold tracking-tight text-blue-400">
                      {{ analyticsService.booksCurrentlyReading().length }}
                    </dd>
                  </div>
                  <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
                    <dt class="truncate text-sm font-medium text-slate-400">Average Rating</dt>
                    <dd class="mt-1 text-3xl font-bold tracking-tight text-amber-400">
                      {{ analyticsService.averageRatingThisYear() || '—' }}
                    </dd>
                  </div>
                  <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
                    <dt class="truncate text-sm font-medium text-slate-400">Reading Streak</dt>
                    <dd class="mt-1 text-3xl font-bold tracking-tight text-purple-400">
                      {{ analyticsService.sessions() ? analyticsService.readingStreak().currentStreak : 0 }}
                    </dd>
                  </div>
                </div>

                <!-- Charts Section -->
                <app-progress-charts />
              </div>
            }
            
            @case ('goals') {
              <app-reading-goals />
            }
            
            @case ('streaks') {
              <app-reading-streaks />
            }
            
            @case ('detailed') {
              <app-yearly-summary />
            }
          }
        }
      </div>
    </div>
  `
})
export class Analytics {
  protected analyticsService = inject(AnalyticsService);
  
  protected availableYears = this.generateYearRange();

  private generateYearRange(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    // Show current year and 4 years back
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }

  protected onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.analyticsService.selectedYear.set(parseInt(target.value));
  }
}
