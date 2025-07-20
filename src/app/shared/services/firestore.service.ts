import { inject, Injectable, resource, Signal, Injector, computed } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import {
  Firestore, addDoc, collection, getDocs,
  deleteDoc, doc, updateDoc
} from '@angular/fire/firestore';
import { Book } from '../models/book.model';
import { AuthService } from './auth.service';
import { BookSearchResult } from '../../pages/discover/discover.model'; // Import search result type

/**
 * A global service that acts as the single data layer for all
 * Firestore interactions related to the user's book collection.
 */
@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);
  private injector: Injector = inject(Injector);
  private authService: AuthService = inject(AuthService);

  private booksCollection = computed(() => {
    const user = this.authService.currentUser();
    if (user) {
      return collection(this.firestore, `users/${user.uid}/books`);
    }
    return null;
  });

  private booksResource = resource({
    params: () => ({ collectionRef: this.booksCollection() }),
    loader: async ({ params }) => {
      const { collectionRef } = params;
      if (!collectionRef) return [];
      
      return runInInjectionContext(this.injector, async () => {
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Book[];
      });
    },
  });

  // --- Public Data Signals ---
  public books: Signal<Book[] | undefined> = this.booksResource.value;
  public isLoading: Signal<boolean> = this.booksResource.isLoading;
  public error: Signal<unknown | undefined> = this.booksResource.error;

  // --- CRUD Methods ---
  public async addBook(bookData: BookSearchResult): Promise<any> {
    const collectionRef = this.booksCollection();
    if (!collectionRef) throw new Error('User not logged in');

    // Transform the search result into the Book object we want to save
    const newBookForDb = {
      googleBooksId: bookData.id, // Good practice to store the original ID
      title: bookData.title,
      author: bookData.author,
      coverImageUrl: bookData.coverImageUrl,
      status: 'to-read', // Default status
      createdAt: new Date(),
    };

    const result = await addDoc(collectionRef, newBookForDb);
    this.booksResource.reload();
    return result;
  }

  public async updateBook(bookId: string, dataToUpdate: Partial<Book>): Promise<void> {
    const collectionRef = this.booksCollection();
    if (!collectionRef) throw new Error('User not logged in');
    const bookDoc = doc(collectionRef, bookId);
    await updateDoc(bookDoc, dataToUpdate);
    this.booksResource.reload();
  }

  public async deleteBook(bookId: string): Promise<void> {
    const collectionRef = this.booksCollection();
    if (!collectionRef) throw new Error('User not logged in');
    const bookDoc = doc(collectionRef, bookId);
    await deleteDoc(bookDoc);
    this.booksResource.reload();
  }
}