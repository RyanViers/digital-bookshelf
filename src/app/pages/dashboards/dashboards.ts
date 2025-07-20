import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from './dashboards.service';
import { FirestoreService } from '../../shared/services/firestore.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Good Morning!</h1>
        <p class="mt-1 text-slate-500">Here's a snapshot of your bookshelf today.</p>
      </div>

      <!-- Loading State -->
      @if (firestoreService.isLoading()) {
        <p class="text-center text-slate-500 py-8">Loading dashboard analytics...</p>
      } @else {
        <!-- Stat Cards -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md">
            <dt class="truncate text-sm font-medium text-slate-500">Currently Reading</dt>
            <dd class="mt-1 text-3xl font-bold tracking-tight text-indigo-600">{{ dashboardService.currentlyReadingCount() }}</dd>
          </div>
          <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md">
            <dt class="truncate text-sm font-medium text-slate-500">Books Finished</dt>
            <dd class="mt-1 text-3xl font-bold tracking-tight text-green-600">{{ dashboardService.booksFinishedCount() }}</dd>
          </div>
          <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md">
            <dt class="truncate text-sm font-medium text-slate-500">On Your Wishlist</dt>
            <dd class="mt-1 text-3xl font-bold tracking-tight text-amber-600">{{ dashboardService.toReadCount() }}</dd>
          </div>
          <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md">
            <dt class="truncate text-sm font-medium text-slate-500">Average Rating</dt>
            <dd class="mt-1 text-3xl font-bold tracking-tight text-pink-600">{{ dashboardService.averageRating() }} / 5</dd>
          </div>
        </div>

        <!-- Main Charts Section -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div class="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <h3 class="font-semibold text-slate-800">Reading Progress Over Time</h3>
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
          <div class="rounded-lg bg-white p-6 shadow-md">
            <h3 class="font-semibold text-slate-800">Library Distribution</h3>
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
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div class="rounded-lg bg-white p-6 shadow-md">
            <h3 class="font-semibold text-slate-800">Top Authors</h3>
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
          <div class="rounded-lg bg-white p-6 shadow-md flex flex-col items-center">
            <h3 class="font-semibold text-slate-800">Average Book Rating</h3>
            <div class="mt-4 h-72 w-full">
              <ngx-charts-gauge
                [results]="[{ name: 'Rating', value: dashboardService.averageRating() }]"
                [min]="0"
                [max]="5"
                [angleSpan]="180"
                [startAngle]="-90"
                [units]="'/ 5'">
              </ngx-charts-gauge>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class Dashboards {
  protected dashboardService = inject(DashboardService);
  protected firestoreService = inject(FirestoreService);
}