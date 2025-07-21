import { inject, Injectable, signal, computed } from '@angular/core';
import { Book } from '../../shared/models/book.model';
import { FirestoreService } from '../../shared/services/firestore.service';

type BookStatusFilter = 'all' | 'to-read' | 'reading' | 'finished';

@Injectable() // Provided by the MyBooks component
export class MyBooksService {
  private firestoreService = inject(FirestoreService);

  // --- UI State Signals ---
  public selectedBook = signal<Book | undefined>(undefined);
  public layout = signal<'grid' | 'table'>('grid');
  public activeFilter = signal<BookStatusFilter>('all');

  // --- Data Signals ---
  public books = this.firestoreService.books;
  public isLoading = this.firestoreService.isLoading;
  
  public filteredBooks = computed(() => {
    const books = this.books() || [];
    const filter = this.activeFilter();
    if (filter === 'all') {
      return books;
    }
    return books.filter(book => book.status === filter);
  });

  public readingBooks = computed(() => this.books()?.filter(b => b.status === 'reading') || []);
  public toReadBooks = computed(() => this.books()?.filter(b => b.status === 'to-read') || []);
  public finishedBooks = computed(() => this.books()?.filter(b => b.status === 'finished') || []);

  // --- CRUD Methods (proxied to FirestoreService) ---
  public updateBook(bookId: string, dataToUpdate: Partial<Book>): Promise<void> {
    return this.firestoreService.updateBook(bookId, dataToUpdate);
  }

  public deleteBook(bookId: string): Promise<void> {
    return this.firestoreService.deleteBook(bookId);
  }
}