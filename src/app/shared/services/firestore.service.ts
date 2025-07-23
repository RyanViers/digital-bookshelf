import { inject, Injectable, resource, Signal, Injector, computed } from '@angular/core';
import { runInInjectionContext } from '@angular/core';
import {
  Firestore, addDoc, collection, getDocs,
  deleteDoc as deleteFirestoreDoc, doc, updateDoc, setDoc,
} from '@angular/fire/firestore';
import { ref, uploadBytes, getDownloadURL, Storage, deleteObject } from '@angular/fire/storage';
import { updateProfile } from '@angular/fire/auth';
import { Book } from '../models/book.model';
import { AuthService } from './auth.service';
import { BookDetails } from '../../pages/discover/discover.model';
import { ReadingGoal, NewReadingGoal, ReadingSession, NewReadingSession } from '../../pages/analytics/analytics.models';

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

  private goalsCollection = computed(() => {
    const user = this.authService.currentUser();
    if (user) {
      return collection(this.firestore, `users/${user.uid}/reading_goals`);
    }
    return null;
  });

  private sessionsCollection = computed(() => {
    const user = this.authService.currentUser();
    if (user) {
      return collection(this.firestore, `users/${user.uid}/reading_sessions`);
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
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate?.() || data['createdAt'],
          } as Book;
        });
      });
    },
  });

  public books: Signal<Book[] | undefined> = this.booksResource.value;
  public isLoading: Signal<boolean> = this.booksResource.isLoading;
  public error: Signal<unknown | undefined> = this.booksResource.error;

  private goalsResource = resource({
    params: () => ({ collectionRef: this.goalsCollection() }),
    loader: async ({ params }) => {
      if (!params.collectionRef) return [];
      return runInInjectionContext(this.injector, async () => {
        const snapshot = await getDocs(params.collectionRef!);
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate?.() || data['createdAt'],
            updatedAt: data['updatedAt']?.toDate?.() || data['updatedAt'],
          } as ReadingGoal;
        });
      });
    },
  });

  private sessionsResource = resource({
    params: () => ({ collectionRef: this.sessionsCollection() }),
    loader: async ({ params }) => {
      if (!params.collectionRef) return [];
      return runInInjectionContext(this.injector, async () => {
        const snapshot = await getDocs(params.collectionRef!);
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startTime: data['startTime']?.toDate?.() || data['startTime'],
            endTime: data['endTime']?.toDate?.() || data['endTime'],
            createdAt: data['createdAt']?.toDate?.() || data['createdAt'],
          } as ReadingSession;
        });
      });
    },
  });

  public goals: Signal<ReadingGoal[] | undefined> = this.goalsResource.value;
  public sessions: Signal<ReadingSession[] | undefined> = this.sessionsResource.value;
  public isGoalsLoading: Signal<boolean> = this.goalsResource.isLoading;
  public isSessionsLoading: Signal<boolean> = this.sessionsResource.isLoading;

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

  // --- Reading Goals Methods ---
  public async createGoal(newGoal: NewReadingGoal): Promise<ReadingGoal> {
    const collectionRef = this.goalsCollection();
    if (!collectionRef) throw new Error('User not logged in');
    
    const user = this.authService.currentUser();
    if (!user) throw new Error('User not logged in');

    const goalData = {
      ...newGoal,
      userId: user.uid,
      current: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collectionRef, goalData);
    this.goalsResource.reload();
    
    return { id: docRef.id, ...goalData } as ReadingGoal;
  }

  public async updateGoal(goalId: string, dataToUpdate: Partial<ReadingGoal>): Promise<void> {
    const collectionRef = this.goalsCollection();
    if (!collectionRef) throw new Error('User not logged in');
    
    const goalDoc = doc(collectionRef, goalId);
    await updateDoc(goalDoc, { ...dataToUpdate, updatedAt: new Date() });
    this.goalsResource.reload();
  }

  public async deleteGoal(goalId: string): Promise<void> {
    const collectionRef = this.goalsCollection();
    if (!collectionRef) throw new Error('User not logged in');
    
    const goalDoc = doc(collectionRef, goalId);
    await deleteFirestoreDoc(goalDoc);
    this.goalsResource.reload();
  }

  // --- Reading Sessions Methods ---
  public async createSession(newSession: NewReadingSession): Promise<ReadingSession> {
    const collectionRef = this.sessionsCollection();
    if (!collectionRef) throw new Error('User not logged in');
    
    const user = this.authService.currentUser();
    if (!user) throw new Error('User not logged in');

    const sessionData = {
      ...newSession,
      userId: user.uid,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collectionRef, sessionData);
    this.sessionsResource.reload();
    
    return { id: docRef.id, ...sessionData } as ReadingSession;
  }

  public async updateSession(sessionId: string, dataToUpdate: Partial<ReadingSession>): Promise<void> {
    const collectionRef = this.sessionsCollection();
    if (!collectionRef) throw new Error('User not logged in');
    
    const sessionDoc = doc(collectionRef, sessionId);
    await updateDoc(sessionDoc, dataToUpdate);
    this.sessionsResource.reload();
  }

  public async deleteSession(sessionId: string): Promise<void> {
    const collectionRef = this.sessionsCollection();
    if (!collectionRef) throw new Error('User not logged in');
    
    const sessionDoc = doc(collectionRef, sessionId);
    await deleteFirestoreDoc(sessionDoc);
    this.sessionsResource.reload();
  }
}