/**
 * A simplified interface for a book in a search result list or carousel.
 */
export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
}

/**
 * A detailed interface for a single book's page, containing more info.
 */
export interface BookDetails extends BookSearchResult {
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
}