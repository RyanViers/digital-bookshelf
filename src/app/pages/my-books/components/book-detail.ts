import { Component, inject } from '@angular/core';
import { MyBooksService } from '../my-books.service';
import { Book } from '../my-books.models';

@Component({
  selector: 'app-book-detail',
  template: `
    @if (booksService.selectedBook(); as book) {
      <div class="relative mx-auto max-w-4xl rounded-2xl bg-slate-800 p-8 text-white shadow-2xl">
        <button (click)="close()" class="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
          <svg class="h-6 w-6" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close</span>
        </button>
        <div class="flex flex-col gap-8 md:flex-row">
          <div class="w-full flex-shrink-0 md:w-1/3">
            <img class="aspect-[2/3] w-full rounded-lg object-cover shadow-lg" [src]="book.coverImageUrl || '[https://placehold.co/400x600/1e293b/ffffff?text=No+Cover](https://placehold.co/400x600/1e293b/ffffff?text=No+Cover)'" alt="Cover image for {{ book.title }}">
          </div>
          <div class="flex flex-col">
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{{ book.title }}</h1>
            <p class="mt-2 text-xl text-slate-300">by {{ book.author }}</p>
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <div class="h-2 w-2 rounded-full" [class]="statusDotClass(book.status)"></div>
                <span class="text-sm font-medium capitalize">{{ book.status }}</span>
              </div>
              @if(book.rating) {
                <div class="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <svg class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" clip-rule="evenodd" /></svg>
                  <span class="text-sm font-medium">{{ book.rating }} / 5</span>
                </div>
              }
            </div>
            <div class="mt-auto pt-8">
              <h2 class="text-lg font-semibold">Personal Notes</h2>
              <p class="mt-2 leading-7 text-slate-300">{{ book.notes || 'No notes yet.' }}</p>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class BookDetail {
  protected booksService = inject(MyBooksService);

  protected close(): void {
    this.booksService.view.set('list');
    this.booksService.selectedBook.set(undefined);
  }

  protected statusDotClass(status: Book['status']): string {
    switch (status) {
      case 'finished': return 'bg-green-400';
      case 'reading': return 'bg-indigo-400';
      case 'to-read': return 'bg-amber-400';
      default: return 'bg-slate-400';
    }
  }
}