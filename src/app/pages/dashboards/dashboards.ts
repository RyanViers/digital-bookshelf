import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Good Morning!</h1>
        <p class="mt-1 text-slate-500">Here's a snapshot of your bookshelf today.</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Card 1: Currently Reading -->
        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md transition-transform hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-slate-500">Currently Reading</dt>
                <dd class="text-3xl font-bold text-slate-900">3</dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Card 2: Books Finished -->
        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md transition-transform hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-slate-500">Books Finished</dt>
                <dd class="text-3xl font-bold text-slate-900">27</dd>
              </dl>
            </div>
          </div>
        </div>

        <!-- Card 3: To Read -->
        <div class="overflow-hidden rounded-lg bg-white p-5 shadow-md transition-transform hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="truncate text-sm font-medium text-slate-500">On Your Wishlist</dt>
                <dd class="text-3xl font-bold text-slate-900">14</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Reading Section -->
      <div>
        <h2 class="text-xl font-bold text-slate-800">Continue Reading</h2>
        <div class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Book Card -->
          <div class="group overflow-hidden rounded-lg bg-white shadow-md">
            <img class="h-48 w-full object-cover" src="https://placehold.co/400x600/6366f1/ffffff?text=Dune" alt="Book cover for Dune">
            <div class="p-4">
              <h3 class="font-semibold text-slate-800">Dune</h3>
              <p class="text-sm text-slate-500">Frank Herbert</p>
              <div class="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div class="h-2 rounded-full bg-indigo-500" style="width: 75%"></div>
              </div>
            </div>
          </div>
          <!-- More books... -->
        </div>
      </div>
    </div>
  `,
})
export class Dashboards {}