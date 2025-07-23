import { Component, input, viewChild, ElementRef } from '@angular/core';
import { BookSearchResult } from '../discover.model';
import { BookCard } from './book-card';

@Component({
  selector: 'app-book-carousel',
  imports: [BookCard],
  template: `
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-white">{{ title() }}</h2>
        <!-- Scroll Buttons -->
        <div class="hidden sm:flex items-center gap-2">
          <button (click)="scroll(-300)" class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600">
            <svg class="h-5 w-5" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </button>
          <button (click)="scroll(300)" class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600">
            <svg class="h-5 w-5" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </div>
      @if (isLoading()) {
        <p class="mt-4 text-slate-300">Loading genre...</p>
      } @else {
        <div #scrollContainer class="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          @for (book of books(); track book.id) {
            <div class="snap-start shrink-0 w-48">
              <app-book-card [book]="book" />
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class BookCarousel {
  public title = input.required<string>();
  public books = input<BookSearchResult[] | undefined>();
  public isLoading = input<boolean>();
  
  // THE FIX: Changed from viewChild.required to viewChild
  private scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  protected scroll(offset: number): void {
    // THE FIX: Added a check to ensure the element exists before scrolling
    this.scrollContainer()?.nativeElement.scrollBy({ left: offset, behavior: 'smooth' });
  }
}