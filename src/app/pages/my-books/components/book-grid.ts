import { Component, inject } from '@angular/core';
import { MyBooksService } from '../my-books.service';
import { Book } from '../my-books.models';
import { ModalService } from '../../../shared/modals/modals.service';

@Component({
  selector: 'app-book-grid',
  template: `
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      @for (book of booksService.books(); track book.id) {
        <div class="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <div (click)="showDetailView(book)" class="cursor-pointer">
            <img [src]="book.coverImageUrl || 'https://placehold.co/400x600/e2e8f0/64748b?text=Cover'" alt="Cover for {{ book.title }}" class="aspect-[2/3] w-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div class="absolute bottom-0 left-0 w-full p-4">
            @if(book.rating) {
              <div class="flex items-center mb-1">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="h-4 w-4" [class.text-yellow-400]="star <= book.rating" [class.text-slate-500]="star > book.rating" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" /></svg>
                }
              </div>
            }
            <h3 class="font-semibold text-white truncate">{{ book.title }}</h3>
            <p class="text-sm text-slate-300 truncate">{{ book.author }}</p>
          </div>
          <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button (click)="showEditForm(book)" class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
              <span class="sr-only">Edit Book</span>
            </button>
            <button (click)="promptDelete(book)" class="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/50 text-white backdrop-blur-sm hover:bg-red-600/70">
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              <span class="sr-only">Delete Book</span>
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class BookGrid {
  protected booksService = inject(MyBooksService);
  private modalService = inject(ModalService);

  protected showEditForm(book: Book): void {
    this.booksService.selectedBook.set(book);
    this.booksService.view.set('edit');
  }

  protected showDetailView(book: Book): void {
    this.booksService.selectedBook.set(book);
    this.booksService.view.set('detail');
  }

  protected async promptDelete(book: Book): Promise<void> {
    const confirmed = await this.modalService.showConfirm({
      type: 'warning',
      title: 'Delete Book',
      message: `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
    });

    if (confirmed) {
      await this.booksService.deleteBook(book.id);
    }
  }
}