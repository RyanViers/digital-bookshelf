export enum WebPage {
  DASHBOARD = '',
  MY_BOOKS = 'my-books',
  SETTINGS = 'settings',
  BOOK_NEW = 'my-books/new',
  BOOK_DETAIL = 'my-books/:id',
  BOOK_EDIT = 'my-books/edit/:id',

  // Auth Pages
  LOGIN = 'login',
}

// An interface to define the shape of our navigation items
export interface NavigationItem {
  path: WebPage;
  label: string;
  icon: 'dashboard' | 'books' | 'settings'; // We'll use these keys to select the right SVG
}

// The actual data that will drive the navigation menu
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    path: WebPage.DASHBOARD,
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    path: WebPage.MY_BOOKS,
    label: 'My Books',
    icon: 'books',
  },
  {
    path: WebPage.SETTINGS,
    label: 'Settings',
    icon: 'settings',
  },
];