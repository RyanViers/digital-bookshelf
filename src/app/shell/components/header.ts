import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="flex h-16 shrink-0 items-center justify-end bg-white px-6 shadow-sm">
      <div class="relative">
        <button (click)="isDropdownOpen.set(!isDropdownOpen())" class="h-10 w-10 rounded-full bg-slate-200 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span class="text-sm font-semibold text-slate-600">ME</span>
        </button>

        @if (isDropdownOpen()) {
          <div class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</a>
            <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sign out</a>
          </div>
        }
      </div>
    </header>
  `,
})
export class Header {
  isDropdownOpen = signal(false);
}