import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBooksService } from '../my-books.service';
import { Book } from '../../../shared/models/book.model';

@Component({
  selector: 'app-book-table',
  imports: [CommonModule],
  template: `
    <div class="space-y-10">
      <!-- Currently Reading Table -->
      <section>
        <h2 class="text-2xl font-bold text-white border-b border-slate-600 pb-2 mb-4">Currently Reading</h2>
        @if(booksService.readingBooks().length > 0) {
          <div class="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Title</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Author</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Your Rating</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700 bg-slate-800">
                @for (book of booksService.readingBooks(); track book.id) {
                  <tr (click)="selectBook(book)" class="hover:bg-slate-700 cursor-pointer">
                    <td class="py-4 pl-6 pr-3 font-medium text-white">{{ book.title }}</td>
                    <td class="px-3 py-4 text-sm text-slate-300">{{ book.author }}</td>
                    <td class="px-3 py-4 text-sm text-slate-300">
                      @if (book.rating) {
                        <div class="flex items-center">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="h-4 w-4" [class.text-yellow-400]="star <= book.rating" [class.text-slate-500]="star > book.rating" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" clip-rule="evenodd" /></svg>
                          }
                        </div>
                      } @else { <span>--</span> }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="text-slate-300">You're not reading any books right now.</p>
        }
      </section>

      <!-- To Read Table -->
      <section>
        <h2 class="text-2xl font-bold text-white border-b border-slate-600 pb-2 mb-4">To Read</h2>
        @if(booksService.toReadBooks().length > 0) {
          <div class="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Title</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Author</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700 bg-slate-800">
                @for (book of booksService.toReadBooks(); track book.id) {
                  <tr (click)="selectBook(book)" class="hover:bg-slate-700 cursor-pointer">
                    <td class="py-4 pl-6 pr-3 font-medium text-white">{{ book.title }}</td>
                    <td class="px-3 py-4 text-sm text-slate-300">{{ book.author }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="text-slate-300">Your reading list is empty. Discover a new book!</p>
        }
      </section>

      <!-- Finished Table -->
      <section>
        <h2 class="text-2xl font-bold text-white border-b border-slate-600 pb-2 mb-4">Finished</h2>
        @if(booksService.finishedBooks().length > 0) {
          <div class="overflow-x-auto rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Title</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Author</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Your Rating</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700 bg-slate-800">
                @for (book of booksService.finishedBooks(); track book.id) {
                  <tr (click)="selectBook(book)" class="hover:bg-slate-700 cursor-pointer">
                    <td class="py-4 pl-6 pr-3 font-medium text-white">{{ book.title }}</td>
                    <td class="px-3 py-4 text-sm text-slate-300">{{ book.author }}</td>
                    <td class="px-3 py-4 text-sm text-slate-300">
                      @if (book.rating) {
                        <div class="flex items-center">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg class="h-4 w-4" [class.text-yellow-400]="star <= book.rating" [class.text-slate-500]="star > book.rating" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" clip-rule="evenodd" /></svg>
                          }
                        </div>
                      } @else { <span>--</span> }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="text-slate-300">You haven't finished any books yet.</p>
        }
      </section>
    </div>
  `,
})
export class BookTable {
  protected booksService = inject(MyBooksService);

  protected selectBook(book: Book): void {
    this.booksService.selectedBook.set(book);
    window.scrollTo(0, 0);
  }
}