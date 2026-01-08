
import { Item, ItemCondition } from './types';

export const CATEGORIES = [
  'Femmes',
  'Hommes',
  'Enfants',
  'Maison',
  'Électronique',
  'Divertissement',
  'Loisirs & Collections',
  'Sport',
  'Articles de créateurs'
];

export const DETAILED_CATEGORIES: Record<string, Record<string, string[]>> = {
  'Femmes': {
    'Vêtements': ['Robes', 'T-shirts & débardeurs', 'Pantalons', 'Jupes', 'Manteaux & vestes', 'Sweats & sweats à capuche'],
    'Chaussures': ['Baskets', 'Bottes', 'Escarpins', 'Sandales', 'Chaussures plates'],
    'Accessoires': ['Sacs à main', 'Bijoux', 'Ceintures', 'Lunettes de soleil', 'Écharpes & foulards']
  },
  'Hommes': {
    'Vêtements': ['T-shirts', 'Pantalons & Jeans', 'Pulls & gilets', 'Costumes & vestes', 'Vêtements d\'extérieur'],
    'Chaussures': ['Baskets', 'Chaussures habillées', 'Bottes', 'Mocassins'],
    'Accessoires': ['Montres', 'Ceintures', 'Cravates', 'Portefeuilles', 'Bonnets & casquettes']
  },
  'Enfants': {
    'Filles': ['Vêtements', 'Chaussures', 'Accessoires'],
    'Garçons': ['Vêtements', 'Chaussures', 'Accessoires'],
    'Jouets': ['Jeux d\'éveil', 'Poupées', 'Lego & construction', 'Puzzles'],
    'Puériculture': ['Poussettes', 'Sièges auto', 'Repas', 'Hygiène']
  },
  'Maison': {
    'Cuisine': ['Vaisselle', 'Ustensiles', 'Petit électroménager', 'Linge de table'],
    'Décoration': ['Bougies', 'Tableaux', 'Miroirs', 'Vases'],
    'Textiles': ['Linge de lit', 'Coussins', 'Rideaux', 'Tapis'],
    'Bricolage': ['Outils', 'Quincaillerie', 'Peinture']
  },
  'Électronique': {
    'Informatique': ['Ordinateurs portables', 'Tablettes', 'Accessoires clavier/souris'],
    'Audio': ['Casques', 'Enceintes', 'Écouteurs'],
    'Photo': ['Appareils photo', 'Objectifs', 'Trépieds'],
    'Jeux Vidéo': ['Consoles', 'Jeux', 'Manettes']
  },
  'Divertissement': {
    'Livres': ['Romans', 'BD', 'Mangas', 'Livres jeunesse'],
    'Musique': ['Vinyles', 'CD', 'Instruments'],
    'Vidéos': ['DVD', 'Blu-ray']
  },
  'Loisirs & Collections': {
    'Jeux de société': ['Puzzles', 'Jeux de cartes', 'Stratégie'],
    'Collections': ['Timbres', 'Pièces de monnaie', 'Miniatures'],
    'Fournitures créatives': ['Dessin', 'Couture', 'Tricot']
  },
  'Sport': {
    'Fitness': ['Vêtements', 'Matériel', 'Chaussures'],
    'Sports collectifs': ['Football', 'Basketball', 'Rugby'],
    'Plein air': ['Randonnée', 'Camping', 'Cyclisme']
  },
  'Articles de créateurs': {
    'Sacs de luxe': ['Main', 'Épaule', 'Sac à dos'],
    'Vêtements créateurs': ['Prêt-à-porter', 'Haute couture'],
    'Chaussures créateurs': ['Escarpins', 'Baskets']
  }
};

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'Veste Vintage en Cuir',
    description: 'Une superbe veste en cuir des années 90, parfaitement entretenue. Taille M.',
    price: 85,
    category: 'Femmes',
    condition: ItemCondition.EXCELLENT,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Julie R.',
      rating: 4.8,
      avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Appareil Photo Reflex Canon',
    description: 'Vendu avec objectif 18-55mm. Idéal pour débuter en photographie.',
    price: 240,
    category: 'Électronique',
    condition: ItemCondition.GOOD,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Thomas M.',
      rating: 4.5,
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Table de Chevet Scandinave',
    description: 'Style minimaliste, bois clair. Très bon état.',
    price: 35,
    category: 'Maison',
    condition: ItemCondition.EXCELLENT,
    imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Sarah L.',
      rating: 5.0,
      avatar: 'https://picsum.photos/seed/user3/100/100'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Écran PC Gaming 27"',
    description: '144Hz, 1ms de réponse. Parfait pour les gamers.',
    price: 150,
    category: 'Électronique',
    condition: ItemCondition.SATISFACTORY,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Kévin B.',
      rating: 4.2,
      avatar: 'https://picsum.photos/seed/user4/100/100'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Sac à main de luxe',
    description: 'Sac en cuir véritable, édition limitée. Certificat d\'authenticité inclus.',
    price: 450,
    category: 'Articles de créateurs',
    condition: ItemCondition.NEW,
    imageUrl: 'https://images.unsplash.com/photo-1584917033904-49399ce371b4?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Elena D.',
      rating: 4.9,
      avatar: 'https://picsum.photos/seed/user5/100/100'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Short de Football France',
    description: 'Short officiel équipe de France 2022. Très peu porté.',
    price: 25,
    category: 'Sport',
    condition: ItemCondition.EXCELLENT,
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800',
    seller: {
      name: 'Marc O.',
      rating: 4.6,
      avatar: 'https://picsum.photos/seed/user6/100/100'
    },
    createdAt: new Date().toISOString()
  }
];
