import { Component, inject, input, effect } from '@angular/core';
import { DiscoverService } from '../discover.service';
import { ModalService } from '../../../shared/modals/modals.service';
import { BookDetails } from '../discover.model';

@Component({
  selector: 'app-detail',

  template: `
    @if (discoverService.isSelectedBookLoading()) {
      <p class="text-center text-slate-500 py-12">Loading book details...</p>
    } @else {
      @if (discoverService.selectedBook(); as book) {
        <div class="mx-auto max-w-5xl">
          <button (click)="discoverService.selectedBookId.set(null)" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6">
            <svg class="h-5 w-5" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" /></svg>
            Back to Discover
          </button>
          <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow-md md:flex-row">
            <div class="w-full md:w-1/3 flex-shrink-0">
              <img class="w-full rounded-lg object-cover shadow-lg" [src]="book.coverImageUrl" alt="Cover for {{ book.title }}">
            </div>
            <div class="flex flex-col">
              <div>
                @if (book.categories.length > 0) { <p class="font-semibold text-indigo-600">{{ book.categories[0] }}</p> }
                <h1 class="mt-1 text-4xl font-bold tracking-tight text-slate-900">{{ book.title }}</h1>
                <p class="mt-2 text-xl text-slate-600">by {{ book.author }}</p>
                <div class="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>{{ book.publishedDate }}</span><span>&bull;</span><span>{{ book.publisher }}</span><span>&bull;</span><span>{{ book.pageCount }} pages</span>
                </div>
              </div>
              <div class="mt-6 border-t border-slate-200 pt-6">
                <h2 class="text-lg font-semibold text-slate-800">Description</h2>
                <div class="mt-2 prose prose-slate max-w-none" [innerHTML]="book.description"></div>
              </div>
              <div class="mt-auto pt-8">
                <button (click)="addBook(book)" class="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                  Add to My Bookshelf
                </button>
              </div>
            </div>
          </div>

        </div>
      
      }
    }
  `
})
export class Detail {
  public id = input.required<string>();
  protected discoverService = inject(DiscoverService);
  private modalService = inject(ModalService);

  constructor() {
    effect(() => {
      this.discoverService.selectedBookId.set(this.id());
    });
  }

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