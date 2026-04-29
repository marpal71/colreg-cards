export interface Flashcard {
  id: string;
  frontImage: string;
  backImage: string;
  category: string;
  title: string;
}

export type Category = string | 'All';
