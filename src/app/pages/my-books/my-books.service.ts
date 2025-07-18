import { inject, Injectable, resource, Signal, signal } from '@angular/core';
import {
  Firestore, addDoc, collection, getDocs,
  deleteDoc, doc, updateDoc
} from '@angular/fire/firestore';
import { NewBook, Book } from './my-books.models';

@Injectable()
export class MyBooksService {
  private firestore: Firestore = inject(Firestore);
  private booksCollection = collection(this.firestore, 'books');

  // --- Data Resource ---
  private booksResource = resource({
    loader: async () => {
      const querySnapshot = await getDocs(this.booksCollection);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Book[];
    },
  });

  // --- Public State Signals ---
   public books: Signal<Book[] | undefined> = this.booksResource.value;
  public isLoading: Signal<boolean> = this.booksResource.isLoading;
  public error: Signal<unknown | undefined> = this.booksResource.error;

  // --- UI State Signals ---
  public view = signal<'list' | 'new' | 'edit' | 'detail'>('list');
  public selectedBook = signal<Book | undefined>(undefined);
  public layout = signal<'table' | 'grid'>('table');
  public isDeleteModalVisible = signal(false); 

  // --- CRUD Methods ---
  public async addBook(bookData: NewBook): Promise<any> {
    const newBookWithTimestamp = { ...bookData, createdAt: new Date() };
    const result = await addDoc(this.booksCollection, newBookWithTimestamp);
    this.booksResource.reload();
    return result;
  }

  public async updateBook(bookId: string, dataToUpdate: Partial<Book>): Promise<void> {
    const bookDoc = doc(this.firestore, `books/${bookId}`);
    await updateDoc(bookDoc, dataToUpdate);
    this.booksResource.reload();
  }

  public async deleteBook(bookId: string): Promise<void> {
    const bookDoc = doc(this.firestore, `books/${bookId}`);
    await deleteDoc(bookDoc);
    this.booksResource.reload();
  }
}