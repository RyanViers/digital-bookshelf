// import { Component, effect, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Book } from '../../../shared/models/book.model';
// import { MyBooksService } from '../my-books.service';
// import { ModalService } from '../../../shared/modals/modals.service';

// @Component({
//   selector: 'app-book-form',
//   imports: [ReactiveFormsModule],
//   template: `
//     <div class="mx-auto max-w-2xl">
//       @if (booksService.selectedBook(); as book) {
//         <div class="mb-6">
//           <h1 class="text-3xl font-bold text-slate-800">Edit Details</h1>
//           <p class="mt-1 text-slate-500">Update your review for "{{ book.title }}"</p>
//         </div>
//         <div class="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
//           <form [formGroup]="bookForm" (ngSubmit)="submitForm()" class="space-y-6">
//             <div>
//               <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
//               <div class="mt-2">
//                 <select formControlName="status" id="status" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300">
//                   <option value="to-read">To Read</option>
//                   <option value="reading">Reading</option>
//                   <option value="finished">Finished</option>
//                 </select>
//               </div>
//             </div>
            
//             <div>
//               <label class="block text-sm font-medium leading-6 text-slate-900">Rating</label>
//               <div class="mt-2 flex items-center">
//                 @for (star of [1, 2, 3, 4, 5]; track star) {
//                   <button (click)="setRating(star)" type="button" class="text-slate-300 transition-colors hover:text-yellow-400">
//                     <svg 
//                       class="h-6 w-6" 
//                       [class.text-yellow-400]="star <= (bookForm.get('rating')?.value || 0)" 
//                       fill="currentColor" 
//                       viewBox="0 0 20 20">
//                       <path d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.83 3.751 4.144.604c.73.107 1.022.998.494 1.503l-2.998 2.922.708 4.127c.125.726-.635 1.285-1.28.93l-3.706-1.948-3.706 1.948c-.645.355-1.405-.204-1.28-.93l.708-4.127-2.998-2.922c-.528-.505-.236-1.396.494-1.503l4.144-.604 1.83-3.751Z" />
//                     </svg>
//                   </button>
//                 }
//               </div>
//             </div>

//             <div>
//               <label for="notes" class="block text-sm font-medium leading-6 text-slate-900">Review / Notes</label>
//               <div class="mt-2"><textarea formControlName="notes" id="notes" rows="4" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300"></textarea></div>
//             </div>

//             <div class="flex items-center justify-end gap-x-4 border-t border-slate-200 pt-6">
//               <button (click)="cancel()" type="button" class="text-sm font-semibold leading-6 text-slate-900">Cancel</button>
//               <button type="submit" [disabled]="bookForm.invalid" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Save Changes</button>
//             </div>
//           </form>
//         </div>
//       }
//     </div>
//   `,
// })
// export class BookForm {
//   private fb = inject(FormBuilder);
//   protected booksService = inject(MyBooksService);
//   private modalService = inject(ModalService);

//   protected bookForm = this.fb.group({
//     status: this.fb.control<'to-read' | 'reading' | 'finished'>('to-read', Validators.required),
//     rating: [null as number | null, [Validators.min(1), Validators.max(5)]],
//     notes: ['']
//   });

//   constructor() {
//     effect(() => {
//       const bookToEdit = this.booksService.selectedBook();
//       if (bookToEdit) {
//         this.bookForm.patchValue({
//           status: bookToEdit.status,
//           rating: bookToEdit.rating,
//           notes: bookToEdit.notes,
//         });
//       }
//     });
//   }

//   protected setRating(rating: number): void {
//     const currentRating = this.bookForm.get('rating')?.value;
//     this.bookForm.get('rating')?.setValue(currentRating === rating ? null : rating);
//   }

//   protected cancel(): void {
//     this.booksService.view.set('list');
//     this.booksService.selectedBook.set(undefined);
//   }

//   public async submitForm(): Promise<void> {
//     if (this.bookForm.invalid) return;
    
//     const bookToUpdate = this.booksService.selectedBook();
//     if (!bookToUpdate) return; // Should not happen, but a good safety check

//     try {
//       const formValue = this.bookForm.getRawValue();
//       const updateData: Partial<Book> = {
//         status: formValue.status ?? undefined,
//         rating: formValue.rating ?? undefined,
//         notes: formValue.notes ?? undefined,
//       };
//       await this.booksService.updateBook(bookToUpdate.id, updateData);
      
//       this.modalService.showConfirm({
//         type: 'success',
//         title: 'Book Updated!',
//         message: `Your review for "${bookToUpdate.title}" was successfully saved.`,
//         confirmText: 'OK',
//       });
//       this.cancel();
//     } catch (error) {
//       console.error("Failed to update book:", error);
//       this.modalService.showConfirm({
//         type: 'error',
//         title: 'Update Failed',
//         message: 'There was a problem saving your review. Please try again.',
//         confirmText: 'OK',
//       });
//     }
//   }
// }