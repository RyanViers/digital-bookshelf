import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MyBooksService } from '../my-books.service';
import { Book } from '../../../shared/models/book.model';
import { ModalService } from '../../../shared/modals/modals.service';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (booksService.selectedBook(); as book) {
      <div class="mx-auto max-w-5xl">
        <button (click)="close()" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6">
          <svg class="h-5 w-5" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" /></svg>
          Back to My Books
        </button>
        <div class="flex flex-col gap-8 rounded-lg bg-white p-8 shadow-md md:flex-row">
          <div class="w-full md:w-1/3 flex-shrink-0">
            <img class="w-full rounded-lg object-cover shadow-lg" [src]="book.coverImageUrl" alt="Cover for {{ book.title }}">
            <h1 class="mt-4 text-2xl font-bold tracking-tight text-slate-900">{{ book.title }}</h1>
            <p class="mt-1 text-lg text-slate-600">by {{ book.author }}</p>
            <!-- Description Section -->
            <div class="mt-4 border-t pt-4">
              <h2 class="text-sm font-medium text-slate-500">Description</h2>
              <p class="mt-1 text-sm text-slate-600">{{ book.description || 'No description available.' }}</p>
            </div>
          </div>
          <div class="w-full md:w-2/3">
            <form [formGroup]="editForm" (ngSubmit)="submitForm()" class="space-y-6">
              <div>
                <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Reading Status</label>
                <select formControlName="status" id="status" class="mt-2 block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300">
                  <option value="to-read">To Read</option>
                  <option value="reading">Reading</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium leading-6 text-slate-900">Your Rating</label>
                <div class="mt-2 flex items-center">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <button (click)="setRating(star)" type="button" class="text-slate-300 transition-colors hover:text-yellow-400">
                      <svg class="h-6 w-6" [class.text-yellow-400]="star <= (editForm.get('rating')?.value || 0)" fill="currentColor" viewBox="0 0 20 20"><path d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" /></svg>
                    </button>
                  }
                </div>
              </div>
              <div>
                <label for="notes" class="block text-sm font-medium leading-6 text-slate-900">Review / Notes</label>
                <textarea formControlName="notes" id="notes" rows="6" class="mt-2 block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"></textarea>
              </div>
              <div class="flex items-center justify-end gap-x-4 border-t border-slate-200 pt-6">
                <button (click)="promptDelete()" type="button" class="text-sm font-semibold leading-6 text-red-600 hover:text-red-500">Remove from Shelf</button>
                <button type="submit" [disabled]="editForm.invalid" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
})
export class BookDetail {
  protected booksService = inject(MyBooksService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  protected editForm = this.fb.group({
    status: this.fb.control<'to-read' | 'reading' | 'finished'>('to-read', Validators.required),
    rating: [null as number | null, [Validators.min(1), Validators.max(5)]],
    notes: ['']
  });

  constructor() {
    effect(() => {
      const bookToEdit = this.booksService.selectedBook();
      if (bookToEdit) {
        this.editForm.patchValue({
          status: bookToEdit.status,
          rating: bookToEdit.rating,
          notes: bookToEdit.notes,
        });
      }
    });
  }

  protected close(): void {
    this.booksService.selectedBook.set(undefined);
  }

  protected setRating(rating: number): void {
    const currentRating = this.editForm.get('rating')?.value;
    this.editForm.get('rating')?.setValue(currentRating === rating ? null : rating);
  }

  protected async submitForm(): Promise<void> {
    if (this.editForm.invalid) return;
    const bookToUpdate = this.booksService.selectedBook();
    if (!bookToUpdate) return;

    try {
      const formValue = this.editForm.getRawValue();
      const updateData: Partial<Book> = {
        status: formValue.status ?? undefined,
        rating: formValue.rating ?? undefined,
        notes: formValue.notes ?? undefined,
      };
      await this.booksService.updateBook(bookToUpdate.id, updateData);
      
      this.modalService.showConfirm({
        type: 'success',
        title: 'Book Updated!',
        message: `Your review for "${bookToUpdate.title}" was successfully saved.`,
        confirmText: 'OK',
      });
      this.close();
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  }

  protected async promptDelete(): Promise<void> {
    const bookToDelete = this.booksService.selectedBook();
    if (!bookToDelete) return;

    const confirmed = await this.modalService.showConfirm({
      type: 'warning',
      title: 'Remove Book',
      message: `Are you sure you want to remove "${bookToDelete.title}" from your shelf?`,
      confirmText: 'Remove',
    });

    if (confirmed) {
      await this.booksService.deleteBook(bookToDelete.id);
      this.close();
    }
  }
}