import { inject, Injectable, resource, signal, Signal, Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import { BookSearchResult, BookDetails } from './discover.model';
import { FirestoreService } from '../../shared/services/firestore.service';
import { environment } from '../../../environments/environment';  

@Injectable({ providedIn: 'root' })
export class DiscoverService {
  private injector: Injector = inject(Injector);
  private firestoreService: FirestoreService = inject(FirestoreService);

  // --- State Signals ---
  public searchTerm = signal('');
  public selectedBookId = signal<string | null>(null);

  // --- Resources ---
  private searchResource = resource({
    params: () => ({ query: this.searchTerm() }),
    loader: ({ params }) => this.fetchBooksFromGoogle(params.query),
  });

  private fantasyResource = resource({ loader: () => this.fetchBooksFromGoogle('subject:fantasy') });
  private scienceFictionResource = resource({ loader: () => this.fetchBooksFromGoogle('subject:science+fiction') });
  private mysteryResource = resource({ loader: () => this.fetchBooksFromGoogle('subject:mystery') });

  private bookDetailResource = resource({
    params: () => ({ bookId: this.selectedBookId() }),
    loader: async ({ params }) => {
      if (!params.bookId) return null;
      return runInInjectionContext(this.injector, async () => {
        const apiKey = environment.googleBooksApiKey;
        const url = `https://www.googleapis.com/books/v1/volumes/${params.bookId}?key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch book details');
        const item = await response.json();
        
        return {
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.[0] || 'Unknown Author',
          coverImageUrl: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail,
          publisher: item.volumeInfo.publisher || 'N/A',
          publishedDate: item.volumeInfo.publishedDate || 'N/A',
          description: item.volumeInfo.description || 'No description available.',
          pageCount: item.volumeInfo.pageCount || 0,
          categories: item.volumeInfo.categories || [],
        } as BookDetails;
      });
    }
  });

  // --- Public Signals ---
  public searchResults: Signal<BookSearchResult[] | undefined> = this.searchResource.value;
  public isSearching: Signal<boolean> = this.searchResource.isLoading;
  public fantasyBooks: Signal<BookSearchResult[] | undefined> = this.fantasyResource.value;
  public scienceFictionBooks: Signal<BookSearchResult[] | undefined> = this.scienceFictionResource.value;
  public mysteryBooks: Signal<BookSearchResult[] | undefined> = this.mysteryResource.value;
  
  public selectedBook: Signal<BookDetails | null | undefined> = this.bookDetailResource.value;
  public isSelectedBookLoading: Signal<boolean> = this.bookDetailResource.isLoading;

  private async fetchBooksFromGoogle(query: string): Promise<BookSearchResult[]> {
    if (!query) return Promise.resolve([]);
    
    return runInInjectionContext(this.injector, async () => {
      const apiKey = environment.googleBooksApiKey;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=15`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      return (data.items || []).map((item: any): BookSearchResult => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.[0] || 'Unknown Author',
        coverImageUrl: item.volumeInfo.imageLinks?.thumbnail,
      }));
    });
  }

  public async addBookToShelf(book: BookSearchResult): Promise<void> {
    await this.firestoreService.addBook(book);
  }
}