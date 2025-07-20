import { inject, Injectable, resource, signal, Signal, Injector } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import { BookSearchResult } from './discover.model';
import { FirestoreService } from '../../shared/services/firestore.service';
import { environment } from '../../../environments/environment'; 

@Injectable() // Provided at the Discover component level
export class DiscoverService {
  private injector: Injector = inject(Injector);
  private firestoreService: FirestoreService = inject(FirestoreService);

  public searchTerm = signal('');

  private searchResource = resource({
    params: () => ({ query: this.searchTerm() }),
    loader: async ({ params }) => {
      if (!params.query) return [];
      
      return runInInjectionContext(this.injector, async () => {
        const apiKey = environment.googleBooksApiKey; // Use the API key from the environment
        const url = `https://www.googleapis.com/books/v1/volumes?q=${params.query}&key=${apiKey}&maxResults=20`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();

        return (data.items || []).map((item: any): BookSearchResult => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.[0] || 'Unknown Author',
          coverImageUrl: item.volumeInfo.imageLinks?.thumbnail,
        }));
      });
    },
  });

  public searchResults: Signal<BookSearchResult[] | undefined> = this.searchResource.value;
  public isLoading: Signal<boolean> = this.searchResource.isLoading;

  /**
   * Delegates the task of adding a book to the global FirestoreService.
   * @param book The book search result to add.
   */
  public async addBookToShelf(book: BookSearchResult): Promise<void> {
    await this.firestoreService.addBook(book);
  }
}