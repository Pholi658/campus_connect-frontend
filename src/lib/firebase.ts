// Mock Firebase lib for UI-only mode
export const db = {} as any;
export const auth = {
  currentUser: null,
  onAuthStateChanged: () => () => {},
} as any;
export const storage = {} as any;
