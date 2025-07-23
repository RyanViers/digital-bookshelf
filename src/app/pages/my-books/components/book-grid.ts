import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBooksService } from '../my-books.service';
import { Book } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-grid',
  imports: [CommonModule],
  template: `
    <div class="space-y-10">
      <!-- Currently Reading Section -->
      <section>
        <h2 class="text-2xl font-bold text-white border-b border-slate-600 pb-2 mb-4">Currently Reading</h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          @for (book of booksService.readingBooks(); track book.id) {
            <button (click)="selectBook(book)" class="group block w-full text-left relative overflow-hidden rounded-lg bg-slate-800 border border-slate-700 shadow-sm transition-all duration-300 hover:shadow-xl hover:!z-10 hover:-translate-y-1">
              <img [src]="book.coverImageUrl" class="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105">
            </button>
          } @empty {
            <p class="text-slate-300 col-span-full">You're not reading any books right now.</p>
          }
        </div>
      </section>

      <!-- To Read Section -->
      <section>
        <h2 class="text-2xl font-bold text-white border-b border-slate-600 pb-2 mb-4">To Read</h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          @for (book of booksService.toReadBooks(); track book.id) {
            <button (click)="selectBook(book)" class="group block w-full text-left relative overflow-hidden rounded-lg bg-slate-800 border border-slate-700 shadow-sm transition-all duration-300 hover:shadow-xl hover:!z-10 hover:-translate-y-1">
              <img [src]="book.coverImageUrl" class="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105">
            </button>
          } @empty {
            <p class="text-slate-300 col-span-full">Your reading list is empty. Discover a new book!</p>
          }
        </div>
      </section>

      <!-- Finished Section -->
      <section>
        <h2 class="text-2xl font-bold text-white border-b border-slate-600 pb-2 mb-4">Finished</h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          @for (book of booksService.finishedBooks(); track book.id) {
            <button (click)="selectBook(book)" class="group block w-full text-left relative overflow-hidden rounded-lg bg-slate-800 border border-slate-700 shadow-sm transition-all duration-300 hover:shadow-xl hover:!z-10 hover:-translate-y-1">
              <img [src]="book.coverImageUrl" class="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105">
            </button>
          } @empty {
            <p class="text-slate-300 col-span-full">You haven't finished any books yet.</p>
          }
        </div>
      </section>
    </div>
  `,
})
export class BookGrid {
  protected booksService = inject(MyBooksService);

  protected selectBook(book: Book): void {
    this.booksService.selectedBook.set(book);
    // THE FIX: Scroll to the top of the page when a book is selected.
    window.scrollTo(0, 0);
  }
}