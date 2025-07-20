import { Component, inject } from '@angular/core';
import { DiscoverService } from './discover.service';
import { ModalService } from '../../shared/modals/modals.service';
import { BookSearchResult } from './discover.model';

@Component({
  selector: 'app-discover',
  providers: [DiscoverService],
  template: `
    <div class="space-y-6">
      <!-- Header and Search Bar -->
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Discover New Books</h1>
        <p class="mt-1 text-slate-500">Search for books by title or author to add to your collection.</p>
        <div class="mt-4 relative">
          <input 
            #searchInput
            (input)="discoverService.searchTerm.set(searchInput.value)"
            type="text" 
            placeholder="Search for 'Dune', 'Brandon Sanderson', etc..."
            class="w-full rounded-md border-0 p-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          />
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" /></svg>
          </div>
        </div>
      </div>

      <!-- Results Grid -->
      @if (discoverService.isLoading()) {
        <div class="flex justify-center items-center py-12">
          <p class="text-slate-500">Searching for books...</p>
        </div>
      } @else {
        @if (discoverService.searchResults(); as results) {
          @if (results.length > 0) {
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              @for (book of results; track book.id) {
                <div class="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <img [src]="book.coverImageUrl || 'https://placehold.co/400x600/e2e8f0/64748b?text=Cover'" alt="Cover for {{ book.title }}" class="aspect-[2/3] w-full object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div class="absolute bottom-0 left-0 w-full p-4">
                    <h3 class="font-semibold text-white truncate">{{ book.title }}</h3>
                    <p class="text-sm text-slate-300 truncate">{{ book.author }}</p>
                  </div>
                  <button (click)="addBook(book)" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:scale-105">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                    Add to Shelf
                  </button>
                </div>
              }
            </div>
          } @else if (discoverService.searchTerm()) {
            <div class="text-center py-12">
              <p class="text-slate-500">No results found for "{{ discoverService.searchTerm() }}".</p>
            </div>
          }
        }
      }
    </div>
  `,
})
export class Discover {
  protected discoverService = inject(DiscoverService);
  private modalService = inject(ModalService);

  protected async addBook(book: BookSearchResult): Promise<void> {
    try {
      await this.discoverService.addBookToShelf(book);
      this.modalService.showConfirm({
        type: 'success',
        title: 'Book Added!',
        message: `"${book.title}" was successfully added to your bookshelf.`,
        confirmText: 'Great!',
      });
    } catch (error) {
      this.modalService.showConfirm({
        type: 'error',
        title: 'Error',
        message: 'There was a problem adding this book to your shelf.',
        confirmText: 'OK',
      });
    }
  }
}