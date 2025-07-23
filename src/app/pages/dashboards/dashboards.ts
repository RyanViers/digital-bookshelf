import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from './dashboards.service';
import { FirestoreService } from '../../shared/services/firestore.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="min-h-screen bg-slate-700 text-slate-100">
      <div class="space-y-8 p-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-white">Good Morning!</h1>
          <p class="mt-1 text-slate-400">Here's a snapshot of your bookshelf today.</p>
        </div>

        <!-- Loading State -->
        @if (firestoreService.isLoading()) {
          <p class="text-center text-slate-400 py-8">Loading dashboard analytics...</p>
        } @else {
          <!-- Stat Cards -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
              <dt class="truncate text-sm font-medium text-slate-400">Currently Reading</dt>
              <dd class="mt-1 text-3xl font-bold tracking-tight text-blue-400">{{ dashboardService.currentlyReadingCount() }}</dd>
            </div>
            <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
              <dt class="truncate text-sm font-medium text-slate-400">Books Finished</dt>
              <dd class="mt-1 text-3xl font-bold tracking-tight text-emerald-400">{{ dashboardService.booksFinishedCount() }}</dd>
            </div>
            <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
              <dt class="truncate text-sm font-medium text-slate-400">On Your Wishlist</dt>
              <dd class="mt-1 text-3xl font-bold tracking-tight text-amber-400">{{ dashboardService.toReadCount() }}</dd>
            </div>
            <div class="overflow-hidden rounded-lg bg-slate-800 border border-slate-700 p-5 shadow-xl">
              <dt class="truncate text-sm font-medium text-slate-400">Average Rating</dt>
              <dd class="mt-1 text-3xl font-bold tracking-tight text-purple-400">{{ dashboardService.averageRating() }} / 5</dd>
            </div>
          </div>

          <!-- Main Charts Section -->
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl lg:col-span-2">
              <h3 class="font-semibold text-white">Reading Progress Over Time</h3>
              <div class="mt-4 h-80">
                <ngx-charts-line-chart
                  [results]="dashboardService.booksByMonthChartData()"
                  [xAxis]="true"
                  [yAxis]="true"
                  [legend]="false"
                  [showXAxisLabel]="true"
                  [showYAxisLabel]="true"
                  [autoScale]="true"
                  xAxisLabel="Month"
                  yAxisLabel="Books Finished">
                </ngx-charts-line-chart>
              </div>
            </div>
            <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl">
              <h3 class="font-semibold text-white">Library Distribution</h3>
              <div class="mt-4 h-80">
                <ngx-charts-pie-chart
                  [results]="dashboardService.statusDistributionChartData()"
                  [labels]="true"
                  [legend]="false"
                  [doughnut]="true"
                  [arcWidth]="0.5">
                </ngx-charts-pie-chart>
              </div>
            </div>
          </div>

          <!-- Secondary Charts Section -->
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl">
              <h3 class="font-semibold text-white">Top Authors</h3>
              <div class="mt-4 h-72">
                <ngx-charts-bar-horizontal
                  [results]="dashboardService.topAuthorsChartData()"
                  [xAxis]="true"
                  [yAxis]="true"
                  [showXAxisLabel]="true"
                  xAxisLabel="Number of Books">
                </ngx-charts-bar-horizontal>
              </div>
            </div>
            <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl">
              <h3 class="font-semibold text-white">Genre Distribution</h3>
              <div class="mt-4 h-72">
                <ngx-charts-pie-chart
                  [results]="dashboardService.genreDistributionChartData()"
                  [labels]="true"
                  [legend]="true"
                  [doughnut]="true"
                  [arcWidth]="0.5">
                </ngx-charts-pie-chart>
              </div>
            </div>
            <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl">
              <h3 class="font-semibold text-white">Rating Distribution</h3>
              <div class="mt-4 h-72">
                <ngx-charts-bar-vertical
                  [results]="dashboardService.ratingDistributionChartData()"
                  [xAxis]="true"
                  [yAxis]="true"
                  [showXAxisLabel]="true"
                  [showYAxisLabel]="true"
                  xAxisLabel="Rating"
                  yAxisLabel="Number of Books">
                </ngx-charts-bar-vertical>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class Dashboards {
  protected dashboardService = inject(DashboardService);
  protected firestoreService = inject(FirestoreService);
}