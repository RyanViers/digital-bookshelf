import { Component, inject } from '@angular/core';
import { DiscoverService } from './discover.service';
import { ModalService } from '../../shared/modals/modals.service';
import { BookDetails } from './discover.model';
import { BookCard } from './components/book-card';
import { BookCarousel } from './components/book-carousel';

@Component({
  selector: 'app-discover',
  imports: [BookCard, BookCarousel],
  providers: [DiscoverService],
  template: `
    <div class="min-h-screen bg-slate-700 text-slate-100">
      <div class="relative overflow-x-hidden p-6">
        <!-- Master View (List) -->
        <div 
          class="transition-transform duration-500 ease-in-out"
          [class.translate-x-0]="!discoverService.selectedBookId()"
          [class.-translate-x-full]="discoverService.selectedBookId()">
          <div class="space-y-12">
            <!-- Header and Search Bar -->
            <div>
              <h1 class="text-3xl font-bold text-white">Discover New Books</h1>
              <p class="mt-1 text-slate-400">Search for books by title or author, or browse our featured genres.</p>
              <div class="mt-6 relative">
                <input #searchInput (input)="discoverService.searchTerm.set(searchInput.value)" type="text" placeholder="Search for 'Dune'..." class="w-full rounded-md border-0 p-3 pr-10 bg-slate-800 text-slate-100 shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500" />
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" /></svg>
                </div>
              </div>
            </div>
            @if (discoverService.searchTerm(); as term) {
              <h2 class="text-2xl font-bold text-white">Search Results</h2>
              @if (discoverService.isSearching()) {
                <p class="text-center text-slate-400 py-8">Searching for books...</p>
              } @else {
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  @for (book of discoverService.searchResults(); track book.id) {
                    <app-book-card [book]="book" />
                  } @empty {
                    <div class="text-center py-12 col-span-full">
                      <p class="text-slate-400">No results found for "{{ term }}".</p>
                    </div>
                  }
                </div>
              }
            } @else {
              <div class="space-y-10">
                <app-book-carousel title="Popular in Fantasy" [books]="discoverService.fantasyBooks()" />
                <app-book-carousel title="Top Science Fiction" [books]="discoverService.scienceFictionBooks()" />
                <app-book-carousel title="Thrilling Mysteries" [books]="discoverService.mysteryBooks()" />
            </div>
          }
        </div>
      </div>

      <!-- Detail View Container -->
      <div 
        class="absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out"
        [class.translate-x-full]="!discoverService.selectedBookId()"
        [class.translate-x-0]="discoverService.selectedBookId()">
        @if (discoverService.isSelectedBookLoading()) {
          <p class="text-center text-slate-300 py-12">Loading book details...</p>
        } @else {
          @if (discoverService.selectedBook(); as book) {
            <div class="mx-auto max-w-5xl">
              <button (click)="discoverService.selectedBookId.set(null)" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white mb-6">
                <!-- ... back button svg ... -->
                Back to Discover
              </button>
              <div class="flex flex-col gap-8 rounded-lg bg-slate-800 border border-slate-700 p-8 shadow-md md:flex-row">
                <div class="w-full md:w-1/3 flex-shrink-0"><img class="w-full rounded-lg object-cover shadow-lg" [src]="book.coverImageUrl" alt="Cover for {{ book.title }}"></div>
                <div class="flex flex-col">
                  <div>
                    @if (book.categories.length > 0) { <p class="font-semibold text-indigo-400">{{ book.categories[0] }}</p> }
                    <h1 class="mt-1 text-4xl font-bold tracking-tight text-white">{{ book.title }}</h1>
                    <p class="mt-2 text-xl text-slate-300">by {{ book.author }}</p>
                    <div class="mt-4 flex items-center gap-4 text-sm text-slate-400">
                      <span>{{ book.publishedDate }}</span><span>&bull;</span><span>{{ book.publisher }}</span><span>&bull;</span><span>{{ book.pageCount }} pages</span>
                    </div>
                  </div>
                  <div class="mt-6 border-t border-slate-600 pt-6">
                    <h2 class="text-lg font-semibold text-white">Description</h2>
                    <div class="mt-2 prose prose-slate prose-invert max-w-none" [innerHTML]="book.description"></div>
                  </div>
                  <div class="mt-auto pt-8">
                    <button (click)="addBook(book)" class="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">Add to My Bookshelf</button>
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class Discover {
  protected discoverService = inject(DiscoverService);
  private modalService = inject(ModalService);

  protected async addBook(book: BookDetails): Promise<void> {
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