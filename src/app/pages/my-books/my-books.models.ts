/**
 * Defines the data structure for a single book.
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  description?: string; 
  status: 'to-read' | 'reading' | 'finished';
  rating?: number;
  notes?: string;
  createdAt: Date;
}

/**
 * The type used specifically when creating a new book entry in the database.
 */
export type NewBook = Omit<Book, 'id' | 'createdAt'>;