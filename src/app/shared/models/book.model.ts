export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  status: 'to-read' | 'reading' | 'finished';
  rating?: number;
  notes?: string;
  createdAt: Date;
}

/**
 * The type used specifically when creating a new book entry in the database.
 * This now lives alongside the main Book model.
 */
export type NewBook = Omit<Book, 'id' | 'createdAt'>;