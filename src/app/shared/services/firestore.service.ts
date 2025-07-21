import { inject, Injectable, resource, Signal, Injector, computed } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import {
  Firestore, addDoc, collection, getDocs,
  deleteDoc as deleteFirestoreDoc, doc, updateDoc, setDoc
} from '@angular/fire/firestore';
import { ref, uploadBytes, getDownloadURL, Storage, deleteObject } from '@angular/fire/storage';
import { updateProfile } from '@angular/fire/auth';
import { Book } from '../models/book.model';
import { AuthService } from './auth.service';
import { BookDetails } from '../../pages/discover/discover.model';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
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

  public books: Signal<Book[] | undefined> = this.booksResource.value;
  public isLoading: Signal<boolean> = this.booksResource.isLoading;
  public error: Signal<unknown | undefined> = this.booksResource.error;

  // --- Profile Image Methods ---
  public async uploadProfileImage(file: File): Promise<string> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('User not logged in');

    const storagePath = `profile-images/${user.uid}`;
    const storageRef = ref(this.storage, storagePath);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    await updateProfile(user, { photoURL: downloadURL });

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
    
    return downloadURL;
  }

  public async deleteProfileImage(): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('User not logged in');

    const storagePath = `profile-images/${user.uid}`;
    const storageRef = ref(this.storage, storagePath);
    await deleteObject(storageRef);
    await updateProfile(user, { photoURL: null });

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { photoURL: null }, { merge: true });
  }

  // --- Book CRUD Methods ---
  public async addBook(bookData: BookDetails): Promise<any> {
    const collectionRef = this.booksCollection();
    if (!collectionRef) throw new Error('User not logged in');

    const newBookForDb = {
      googleBooksId: bookData.id,
      title: bookData.title,
      author: bookData.author,
      coverImageUrl: bookData.coverImageUrl,
      description: bookData.description,
      status: 'to-read',
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
    await deleteFirestoreDoc(bookDoc);
    this.booksResource.reload();
  }
}