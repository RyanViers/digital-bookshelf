import { Component, inject } from '@angular/core';
import { MyBooksService } from '../my-books.service';
import { Book } from '../my-books.models';
import { ModalService } from '../../../shared/modals/modals.service';

@Component({
  selector: 'app-book-table',
  template: `
    <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th scope="col" class="py-3.5 pl-6 text-left text-sm font-semibold text-slate-900">Title</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Author</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Rating</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-6"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          @for (book of booksService.books(); track book.id) {
            <tr>
              <td (click)="showDetailView(book)" class="py-4 pl-6 font-medium text-slate-900 hover:text-indigo-600 cursor-pointer">{{ book.title }}</td>
              <td class="px-3 py-4 text-sm text-slate-500">{{ book.author }}</td>
              <td class="px-3 py-4 text-sm text-slate-500 capitalize">{{ book.status }}</td>
              <td class="px-3 py-4 text-sm text-slate-500">
                @if (book.rating) {
                  <div class="flex items-center">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="h-4 w-4" [class.text-yellow-400]="star <= book.rating" [class.text-slate-300]="star > book.rating" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" clip-rule="evenodd" /></svg>
                    }
                  </div>
                } @else {
                  <span>--</span>
                }
              </td>
              <td class="py-4 pl-3 pr-6 text-right">
                <div class="flex items-center justify-end gap-x-4">
                  <button (click)="showEditForm(book)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button (click)="promptDelete(book)" class="text-red-600 hover:text-red-900">Delete</button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class BookTable {
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