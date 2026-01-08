
export enum ItemCondition {
  NEW = 'Neuf avec étiquette',
  EXCELLENT = 'Très bon état',
  GOOD = 'Bon état',
  SATISFACTORY = 'Satisfaisant'
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ItemCondition;
  imageUrl: string;
  seller: {
    name: string;
    rating: number;
    avatar: string;
  };
  createdAt: string;
}

export type ViewState = 'home' | 'sell' | 'details' | 'search';

export interface SuggestionResponse {
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedPrice: number;
  suggestedCategory: string;
}
