import { Component, inject } from '@angular/core';
import { BookDetail } from './components/book-detail';
import { BookForm } from './components/book-form';
import { MyBooksService } from './my-books.service';
import { BookTable } from './components/book-table';
import { BookGrid } from './components/book-grid';

@Component({
  selector: 'app-my-books',
  imports: [BookDetail, BookForm, BookTable, BookGrid],
  providers: [MyBooksService],
  template: `
    @switch (booksService.view()) {
      @case ('list') {
        <div class="space-y-6">
          <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 class="text-3xl font-bold text-slate-800">My Books</h1>
              <p class="mt-1 text-slate-500">Manage your entire collection here.</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center rounded-md bg-slate-200 p-1">
                <button (click)="booksService.layout.set('table')" [class.bg-white]="booksService.layout() === 'table'" [class.shadow-sm]="booksService.layout() === 'table'" class="rounded p-1.5 text-slate-500 transition-colors hover:bg-white">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
                <button (click)="booksService.layout.set('grid')" [class.bg-white]="booksService.layout() === 'grid'" [class.shadow-sm]="booksService.layout() === 'grid'" class="rounded p-1.5 text-slate-500 transition-colors hover:bg-white">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75A2.25 2.25 0 0 1 15.75 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Updated Loading State Check -->
          @if (booksService.isLoading()) {
            <p class="text-center text-slate-500 py-8">Loading your books...</p>
          } @else {
            @if (booksService.layout() === 'table') {
              <app-book-table />
            } @else {
              <app-book-grid />
            }
          }
        </div>
      }
      @case ('edit') { <app-book-form /> }
      @case ('detail') { <app-book-detail /> }
    }
  `,
})
export class MyBooks {
  protected booksService = inject(MyBooksService);
}