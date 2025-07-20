import { inject, Injectable, signal, computed } from '@angular/core';
import { Book } from '../../shared/models/book.model';
import { FirestoreService } from '../../shared/services/firestore.service';

type BookStatus = 'all' | 'to-read' | 'reading' | 'finished';

/**
 * Manages the UI state for the MyBooks feature. It gets book data from the
 * global FirestoreService and provides filtered lists and state management
 * for the components.
 */
@Injectable() // Provided by the MyBooks component
export class MyBooksService {
  private firestoreService = inject(FirestoreService);

  // --- UI State Signals ---
  public view = signal<'list' | 'edit' | 'detail'>('list');
  public selectedBook = signal<Book | undefined>(undefined);
  public layout = signal<'table' | 'grid'>('table');
  public activeFilter = signal<BookStatus>('all'); // NEW: For the filter tabs

  // --- Data Signals ---
  public books = this.firestoreService.books;
  public isLoading = this.firestoreService.isLoading;
  
  // NEW: A computed signal that filters the book list based on the active tab.
  public filteredBooks = computed(() => {
    const books = this.books() || [];
    const filter = this.activeFilter();
    if (filter === 'all') {
      return books;
    }
    return books.filter(book => book.status === filter);
  });

  // --- CRUD Methods (proxied to FirestoreService) ---
  // Note: addBook has been removed from this service.
  public updateBook(bookId: string, dataToUpdate: Partial<Book>): Promise<void> {
    return this.firestoreService.updateBook(bookId, dataToUpdate);
  }

  public deleteBook(bookId: string): Promise<void> {
    return this.firestoreService.deleteBook(bookId);
  }
}