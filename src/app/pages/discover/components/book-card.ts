import { Component, inject, input } from '@angular/core';
import { DiscoverService } from '../discover.service';
import { BookSearchResult } from '../discover.model';

@Component({
  selector: 'app-book-card',
  // RouterLink is no longer needed here
  template: `
    @if(book(); as book) {
      <!-- This is now a button that sets a signal, not a link -->
      <button (click)="discoverService.selectedBookId.set(book.id)" class="group block w-full text-left relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:!z-10 hover:-translate-y-1">
        <img [src]="book.coverImageUrl || 'https://placehold.co/400x600/e2e8f0/64748b?text=Cover'" alt="Cover for {{ book.title }}" class="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full p-4">
          <h3 class="font-semibold text-white truncate">{{ book.title }}</h3>
          <p class="text-sm text-slate-300 truncate">{{ book.author }}</p>
        </div>
      </button>
    }
  `
})
export class BookCard {
  public book = input.required<BookSearchResult>();
  protected discoverService = inject(DiscoverService);
}