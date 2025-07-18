import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewBook, Book } from '../my-books.models';
import { MyBooksService } from '../my-books.service';
import { ModalService } from '../../../shared/modals/modals.service';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-slate-800">{{ title() }}</h1>
        <p class="mt-1 text-slate-500">Fill out the details below to save the book.</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <form [formGroup]="bookForm" (ngSubmit)="submitForm()" class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium leading-6 text-slate-900">Book Title</label>
            <div class="mt-2"><input formControlName="title" type="text" id="title" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"></div>
          </div>
          <div>
            <label for="author" class="block text-sm font-medium leading-6 text-slate-900">Author</label>
            <div class="mt-2"><input formControlName="author" type="text" id="author" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"></div>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
            <div class="mt-2">
              <select formControlName="status" id="status" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300">
                <option value="to-read">To Read</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
          <div>
            <label for="coverImageUrl" class="block text-sm font-medium leading-6 text-slate-900">Cover Image URL</label>
            <div class="mt-2"><input formControlName="coverImageUrl" type="text" id="coverImageUrl" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"></div>
          </div>
          
          <!-- Star Rating Input -->
          <div>
            <label class="block text-sm font-medium leading-6 text-slate-900">Rating</label>
            <div class="mt-2 flex items-center">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <button (click)="setRating(star)" type="button" class="text-slate-300 transition-colors hover:text-yellow-400">
                  <svg 
                    class="h-6 w-6" 
                    [class.text-yellow-400]="star <= (bookForm.get('rating')?.value || 0)" 
                    fill="currentColor" 
                    viewBox="0 0 20 20">
                    <path d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" />
                  </svg>
                </button>
              }
            </div>
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium leading-6 text-slate-900">Review / Notes</label>
            <div class="mt-2"><textarea formControlName="notes" id="notes" rows="4" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"></textarea></div>
          </div>
          <div class="flex items-center justify-end gap-x-4 border-t border-slate-200 pt-6">
            <button (click)="cancel()" type="button" class="text-sm font-semibold leading-6 text-slate-900">Cancel</button>
            <button type="submit" [disabled]="bookForm.invalid" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Save Book</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class BookForm {
  private fb = inject(FormBuilder);
  protected booksService = inject(MyBooksService);
  private modalService = inject(ModalService);

  protected title = computed(() => this.booksService.selectedBook() ? 'Edit Book' : 'Add a New Book');

  protected bookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    status: this.fb.control<'to-read' | 'reading' | 'finished'>('to-read', Validators.required),
    coverImageUrl: [''],
    rating: [null as number | null, [Validators.min(1), Validators.max(5)]],
    notes: ['']
  });

  constructor() {
    effect(() => {
      const bookToEdit = this.booksService.selectedBook();
      if (bookToEdit) {
        this.bookForm.patchValue(bookToEdit);
      } else {
        this.bookForm.reset({ status: 'to-read' });
      }
    });
  }

  protected setRating(rating: number): void {
    const currentRating = this.bookForm.get('rating')?.value;
    if (currentRating === rating) {
      this.bookForm.get('rating')?.setValue(null);
    } else {
      this.bookForm.get('rating')?.setValue(rating);
    }
  }

  protected cancel(): void {
    this.booksService.view.set('list');
    this.booksService.selectedBook.set(undefined);
  }

  public async submitForm(): Promise<void> {
    if (this.bookForm.invalid) return;
    
    const bookToSave = this.booksService.selectedBook();
    try {
      const formValue = this.bookForm.getRawValue();

      if (bookToSave) {
        const updateData: Partial<Book> = {
          title: formValue.title ?? undefined,
          author: formValue.author ?? undefined,
          status: formValue.status ?? undefined,
          coverImageUrl: formValue.coverImageUrl ?? undefined,
          rating: formValue.rating ?? undefined,
          notes: formValue.notes ?? undefined,
        };
        await this.booksService.updateBook(bookToSave.id, updateData);
        this.modalService.showConfirm({
          type: 'success',
          title: 'Book Updated!',
          message: `"${updateData.title}" was successfully updated.`,
          confirmText: 'OK',
        });
      } else {
        const newBook: NewBook = {
          title: formValue.title!,
          author: formValue.author!,
          status: formValue.status!,
          coverImageUrl: formValue.coverImageUrl || undefined,
          rating: formValue.rating || undefined,
          notes: formValue.notes || undefined,
        };
        await this.booksService.addBook(newBook);
        this.modalService.showConfirm({
          type: 'success',
          title: 'Book Added!',
          message: `"${newBook.title}" was successfully added to your bookshelf.`,
          confirmText: 'OK',
        });
      }
      this.cancel();
    } catch (error) {
      console.error("Failed to save book:", error);
      this.modalService.showConfirm({
        type: 'error',
        title: 'Save Failed',
        message: 'There was a problem saving the book. Please try again.',
        confirmText: 'OK',
      });
    }
  }
}