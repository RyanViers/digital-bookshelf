export enum WebPage {
  DASHBOARD = '', // Corrected from 'dashboards' to match the empty path route
  MY_BOOKS = 'my-books',
  DISCOVER = 'discover', // NEW: Added discover page
  ANALYTICS = 'analytics', // NEW: Added analytics page
  SETTINGS = 'settings',
}

// An interface to define the shape of our navigation items
export interface NavigationItem {
  path: WebPage;
  label: string;
  icon: 'dashboard' | 'books' | 'discover' | 'analytics' | 'settings'; // NEW: Added 'analytics' icon type
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
    path: WebPage.ANALYTICS, // NEW: Added Analytics item
    label: 'Analytics',
    icon: 'analytics',
  },
  {
    path: WebPage.SETTINGS,
    label: 'Settings',
    icon: 'settings',
  },
];