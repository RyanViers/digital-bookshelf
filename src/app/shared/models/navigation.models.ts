export enum WebPage {
  DASHBOARD = '', // Corrected from 'dashboards' to match the empty path route
  MY_BOOKS = 'my-books',
  DISCOVER = 'discover', // NEW: Added discover page
  SETTINGS = 'settings',
}

// An interface to define the shape of our navigation items
export interface NavigationItem {
  path: WebPage;
  label: string;
  icon: 'dashboard' | 'books' | 'discover' | 'settings'; // NEW: Added 'discover' icon type
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
    path: WebPage.DISCOVER, // NEW: Added Discover item
    label: 'Discover',
    icon: 'discover',
  },
  {
    path: WebPage.SETTINGS,
    label: 'Settings',
    icon: 'settings',
  },
];