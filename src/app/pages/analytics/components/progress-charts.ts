import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../analytics.service';
import { ClientOnlyChart } from './client-only-chart';

@Component({
  selector: 'app-progress-charts',
  imports: [CommonModule, ClientOnlyChart],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Reading Progress -->
      <div class="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4">Monthly Reading Progress</h3>
        @if (analyticsService.monthlyReadingData().length > 0) {
          <div class="h-80">
            <app-client-only-chart
              chartType="line"
              [data]="getLineChartData()"
              xAxisLabel="Month"
              yAxisLabel="Books">
            </app-client-only-chart>
          </div>
        } @else {
          <div class="text-center py-12 text-slate-400">
            <div class="text-4xl mb-4">📊</div>
            <p class="text-lg mb-2 text-slate-300">No Data Yet</p>
            <p class="text-sm">Start finishing books to see your progress!</p>
          </div>
        }
      </div>

      <!-- Genre Distribution -->
      <div class="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-semibold text-white mb-4">Genre Distribution</h3>
        @if (analyticsService.genreDistribution().length > 0) {
          <div class="h-80">
            <app-client-only-chart
              chartType="pie"
              [data]="analyticsService.genreDistribution()">
            </app-client-only-chart>
          </div>
        } @else {
          <div class="text-center py-12 text-slate-400">
            <div class="text-4xl mb-4">🥧</div>
            <p class="text-lg mb-2 text-slate-300">No Data Yet</p>
            <p class="text-sm">Finish books to see genre breakdown!</p>
          </div>
        }
      </div>

      <!-- Reading Goals Progress -->
      <div class="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl lg:col-span-2">
        <h3 class="text-lg font-semibold text-white mb-4">Goal Progress Overview</h3>
        @if (analyticsService.readingGoalProgress().length > 0) {
          <div class="space-y-4">
            @for (goalProgress of analyticsService.readingGoalProgress(); track goalProgress.goal.id) {
              <div class="border border-slate-600 rounded-lg p-4 bg-slate-700/50">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-medium text-slate-200">
                    {{ goalProgress.goal.target }} {{ getGoalTypeLabel(goalProgress.goal.type) }}
                  </h4>
                  <span 
                    class="text-sm font-medium"
                    [class.text-emerald-400]="goalProgress.onTrack"
                    [class.text-red-400]="!goalProgress.onTrack">
                    {{ goalProgress.percentage | number:'1.0-1' }}%
                  </span>
                </div>
                <div class="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    [class.bg-emerald-500]="goalProgress.onTrack"
                    [class.bg-red-500]="!goalProgress.onTrack"
                    [style.width.%]="goalProgress.percentage">
                  </div>
                </div>
                <div class="mt-2 text-sm text-slate-400">
                  {{ goalProgress.goal.current }} / {{ goalProgress.goal.target }}
                  @if (goalProgress.remaining > 0) {
                    · {{ goalProgress.remaining }} remaining
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">🎯</div>
            <p>No reading goals set for {{ analyticsService.selectedYear() }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ProgressCharts {
  protected analyticsService = inject(AnalyticsService);

  protected getLineChartData() {
    const monthlyData = this.analyticsService.monthlyReadingData();
    if (!monthlyData || monthlyData.length === 0) {
      return [];
    }
    
    return [{
      name: 'Books Finished',
      series: monthlyData
    }];
  }

  protected getGoalTypeLabel(type: 'books' | 'pages' | 'minutes'): string {
    switch (type) {
      case 'books': return 'Books';
      case 'pages': return 'Pages';
      case 'minutes': return 'Minutes';
      default: return '';
    }
  }
}
