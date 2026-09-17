import type { Product, Review } from '../types';

/**
 * Catalogue de démarrage.
 *
 * DONNÉES DE DÉMONSTRATION. Elles amorcent le stock JSON local au premier
 * lancement (voir src/lib/services/product-service.ts). Ensuite, tout se gère
 * depuis /admin — vous n'aurez plus jamais à modifier ce fichier.
 *
 * Les visuels se trouvent dans /public/previews. Remplacez ces SVG par vos
 * propres captures Roblox Studio (mêmes noms de fichiers) et tout le site suit.
 *
 * Les slugs restent en anglais : ils servent d'identifiants et de noms de
 * fichiers pour les visuels. Seul le texte affiché est en français.
 */

const DAY = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY).toISOString();

type Seed = {
  slug: string;
  name: string;
  category: Product['category'];
  subcategory?: string;
  price: number;
  salePrice?: number;
  short: string;
  description: string;
  tags: string[];
  included: string[];
  perfectFor: string[];
  benefits?: { title: string; description: string; icon: string }[];
  specs: { fileType: string; fileSize: string; version: string };
  rating: number;
  reviewCount: number;
  sales: number;
  reviews: Omit<Review, 'id' | 'avatarSeed'>[];
  flags?: { featured?: boolean; newRelease?: boolean; bestSeller?: boolean };
  shots?: number;
  video?: string;
  license?: Partial<Product['license']>;
  createdDaysAgo: number;
  changelog?: { version: string; days: number; notes: string[] }[];
};

const DEFAULT_BENEFITS = [
  {
    title: 'Prêt pour la production',
    description:
      'Construit et testé dans Roblox Studio — aucune passe de nettoyage avant publication.',
    icon: 'Rocket',
  },
  {
    title: 'Performances optimisées',
    description:
      'Nombre de parts raisonnable, géométrie fusionnée et éclairage réglé pour un framerate stable.',
    icon: 'Gauge',
  },
  {
    title: 'Personnalisation simple',
    description:
      'Hiérarchie logique et nommage clair : recolorez, redimensionnez et remixez rapidement.',
    icon: 'SlidersHorizontal',
  },
  {
    title: 'Qualité professionnelle',
    description: 'Échelle cohérente, pivots propres et finitions soignées sur chaque pièce.',
    icon: 'Gem',
  },
];

const SEEDS: Seed[] = [
  {
    slug: 'modern-city-map',
    name: 'Map Ville Moderne',
    category: 'maps',
    subcategory: 'Urbain',
    price: 34.99,
    short: 'Un quartier urbain complet : routes carrossables, intérieurs finis et éclairage réglé.',
    description:
      'Un environnement urbain complet, publiable le jour même de l’achat. Le réseau routier suit une vraie grille avec des intersections fonctionnelles, les trottoirs se parcourent d’un bout à l’autre, et chaque rez-de-chaussée ouvre sur un intérieur fini. L’éclairage est configuré pour le cycle jour et nuit, et l’ensemble est compatible streaming pour tenir sur les appareils modestes.\n\nUtilisez-le comme colonne vertébrale d’un jeu roleplay, d’une expérience de conduite ou d’un hub open world — ou démontez-le pour réutiliser les bâtiments ailleurs.',
    tags: ['ville', 'urbain', 'roleplay', 'open world', 'routes', 'intérieurs'],
    included: [
      '1 map Roblox Studio complète (.rbxl)',
      'Plus de 120 assets personnalisés, réutilisables séparément',
      'Éclairage jour / nuit optimisé',
      '18 bâtiments avec intérieurs finis',
      'Réseau routier complet avec carrefours et signalisation',
      'Props décoratifs, mobilier urbain et végétation',
    ],
    perfectFor: ['Jeux roleplay', 'Expériences de conduite', 'Hubs open world', 'Showcases', 'Simulateurs'],
    specs: { fileType: '.RBXL / .RBXM', fileSize: '350 MB', version: '1.4' },
    rating: 4.9,
    reviewCount: 128,
    sales: 1240,
    flags: { featured: true, bestSeller: true },
    shots: 5,
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    createdDaysAgo: 210,
    changelog: [
      { version: '1.4', days: 12, notes: ['Éclairage nocturne retravaillé', 'Collisions corrigées sur le pont nord', '4 nouvelles devantures ajoutées'] },
      { version: '1.3', days: 74, notes: ['Nombre de parts réduit de 18 %', 'Éclairage intérieur ajouté dans les bureaux'] },
      { version: '1.2', days: 140, notes: ['Nouveau quartier du parc', 'Props flottants corrigés près des docks'] },
    ],
    reviews: [
      { author: 'VexBuilds', rating: 5, date: daysAgo(6), verified: true, title: 'Trois semaines de gagnées', comment: 'Je faisais chiffrer ça par un builder, ça m’aurait coûté bien plus que 35 €. Les routes s’alignent, les intérieurs sont réellement finis, et le nombre de parts est raisonnable. J’ai publié un jeu roleplay dessus deux jours après.' },
      { author: 'mika_dev', rating: 5, date: daysAgo(19), verified: true, title: 'Les intérieurs font la différence', comment: 'La plupart des maps de ville sont des façades creuses. Ici, ça s’ouvre vraiment, j’ai donc pu construire tout le système de boutiques sans toucher à l’extérieur. L’éclairage de nuit est vraiment réussi.' },
      { author: 'ArcadeStudios', rating: 4, date: daysAgo(33), verified: true, title: 'Très bonne base, un peu de réglage', comment: 'Tourne bien sur PC, j’ai dû baisser certains détails pour les vieux mobiles. Une heure de travail. Le reste était directement exploitable, et la 1.4 a corrigé la collision du pont que j’avais signalée.' },
      { author: 'NoahBuildsGames', rating: 5, date: daysAgo(58), verified: true, title: 'Hiérarchie propre', comment: 'Tout est nommé et regroupé intelligemment, retrouver et recolorer un élément va vite. Ça paraît anodin jusqu’à ce que vous achetiez une map où ce n’est pas le cas.' },
    ],
  },
  {
    slug: 'realistic-vehicle-pack',
    name: 'Pack Véhicules Réalistes',
    category: 'vehicles',
    subcategory: 'Civil',
    price: 24.99,
    salePrice: 19.99,
    short: 'Douze véhicules civils conduisibles, comportement réglé et feux fonctionnels.',
    description:
      'Une flotte civile agréable à conduire dès l’import. Chaque véhicule utilise le même châssis de base : le comportement reste prévisible quand les joueurs changent de voiture, et les valeurs de suspension sont réglées plutôt que laissées par défaut.\n\nSièges, portes, phares, feux stop et clignotants sont tous câblés. Les carrosseries partagent la même configuration de matériaux : recolorer toute la flotte aux couleurs de votre jeu prend deux minutes.',
    tags: ['voitures', 'conduite', 'civil', 'châssis', 'roleplay'],
    included: [
      '12 véhicules conduisibles (.rbxm)',
      'Configuration réglée, compatible A-Chassis',
      'Phares, feux stop et clignotants fonctionnels',
      'Sièges conducteur et passagers configurés',
      'Matériaux partagés pour recolorer rapidement',
      'Documentation d’installation (PDF)',
    ],
    perfectFor: ['Jeux roleplay', 'Expériences de conduite', 'Hubs open world', 'Jeux de course'],
    specs: { fileType: '.RBXM', fileSize: '96 MB', version: '2.1' },
    rating: 4.8,
    reviewCount: 94,
    sales: 870,
    flags: { bestSeller: true, featured: true },
    createdDaysAgo: 160,
    changelog: [
      { version: '2.1', days: 21, notes: ['Suspension retravaillée sur les 12 véhicules', 'Scripts de clignotants corrigés sur le van'] },
      { version: '2.0', days: 96, notes: ['4 nouveaux véhicules ajoutés', 'Système d’éclairage reconstruit'] },
    ],
    reviews: [
      { author: 'DriftKing_RBLX', rating: 5, date: daysAgo(9), verified: true, title: 'Le comportement est vraiment réglé', comment: 'J’avais acheté deux autres packs avant, les deux se conduisaient comme des caddies. Ici c’est cohérent sur toute la flotte, ce qui compte quand les joueurs changent de voiture.' },
      { author: 'TheoRP', rating: 5, date: daysAgo(27), verified: true, title: 'Le système de recoloration est malin', comment: 'Grâce aux matériaux partagés, j’ai accordé les douze voitures à ma palette en une seule séance. Et les feux fonctionnent correctement.' },
      { author: 'builderjay', rating: 4, date: daysAgo(44), verified: true, title: 'Solide, doc un peu courte', comment: 'Les véhicules sont excellents. Le PDF couvre les bases mais j’ai dû trouver seul la logique de spawn personnalisée. Reste un bon rapport qualité-prix au prix promo.' },
    ],
  },
  {
    slug: 'advanced-inventory-gui',
    name: 'GUI Inventaire Avancé',
    category: 'gui',
    subcategory: 'Systèmes',
    price: 19.99,
    short: 'Un inventaire glisser-déposer avec barre rapide, infobulles et support mobile complet.',
    description:
      'Une interface d’inventaire complète, pas une simple maquette. Glisser-déposer entre les emplacements, barre rapide configurable, infobulles au survol et à l’appui long, division des piles et filtre de recherche : tout est implémenté et commenté.\n\nLa mise à l’échelle passe par UIScale et des contraintes : les proportions tiennent du téléphone à un écran 1440p. La couche de données est séparée de la vue, donc la brancher sur votre propre système d’objets prend un après-midi, pas une réécriture.',
    tags: ['inventaire', 'ui', 'barre rapide', 'glisser-déposer', 'mobile', 'luau'],
    included: [
      'Interface d’inventaire complète (.rbxm)',
      'Système d’emplacements en glisser-déposer avec division des piles',
      'Barre rapide configurable (1 à 9 emplacements)',
      'Infobulles au survol et à l’appui long',
      'Recherche et filtrage par catégorie',
      'Modules Luau commentés, vue et données séparées',
      'Guide d’intégration (PDF)',
    ],
    perfectFor: ['Simulateurs', 'Jeux de rôle', 'Jeux de survie', 'Tycoons', 'Jeux roleplay'],
    specs: { fileType: '.RBXM / .LUA', fileSize: '14 MB', version: '3.0' },
    rating: 4.9,
    reviewCount: 156,
    sales: 1510,
    flags: { bestSeller: true, featured: true },
    shots: 5,
    createdDaysAgo: 240,
    changelog: [
      { version: '3.0', days: 8, notes: ['Couche de glisser-déposer reconstruite pour mobile', 'Division des piles ajoutée', 'Nouveau composant d’infobulle'] },
      { version: '2.4', days: 62, notes: ['Mise à l’échelle corrigée en ultrawide', 'Filtre de recherche ajouté'] },
    ],
    reviews: [
      { author: 'LunaScripts', rating: 5, date: daysAgo(4), verified: true, title: 'C’est la séparation qui m’a convaincu', comment: 'Vue et données sont correctement séparées, j’ai branché mon module d’objets existant sans me battre avec l’interface. Le glisser-déposer mobile fonctionne vraiment, c’est rare.' },
      { author: 'Pixel_Dev', rating: 5, date: daysAgo(16), verified: true, title: 'S’adapte correctement partout', comment: 'Testé sur téléphone, tablette et écran 1440p. Aucun texte étiré, aucun emplacement qui déborde. Les commentaires dans les modules sont réellement utiles.' },
      { author: 'HexaGames', rating: 5, date: daysAgo(38), verified: true, title: 'Rien que pour la barre rapide', comment: 'J’avais refait une barre rapide trois fois sur différents projets. J’ai acheté ça, configuré les emplacements, terminé. La refonte mobile de la 3.0 est une vraie amélioration.' },
      { author: 'skyward_rb', rating: 4, date: daysAgo(70), verified: true, title: 'Bien, mais lisez le guide', comment: 'J’ai mis du temps parce que j’avais sauté le PDF d’intégration. Ma faute — une fois lu, l’installation était directe.' },
    ],
  },
  {
    slug: 'military-base-map',
    name: 'Map Base Militaire',
    category: 'maps',
    subcategory: 'Militaire',
    price: 29.99,
    short: 'Une base fortifiée : hangars, casernes, postes de contrôle et périmètre fonctionnel.',
    description:
      'Une installation militaire pensée pour le gameplay avant le décor. Les lignes de vue sont voulues, les couverts sont placés pour les échanges de tirs, et le périmètre a de vrais points d’entrée plutôt qu’un mur continu.\n\nHangars, casernes, armurerie, tour de contrôle et section souterraine sont entièrement construits à l’intérieur. Le terrain est sculpté et fondu avec les structures : rien ne flotte ni ne s’interpénètre.',
    tags: ['militaire', 'base', 'fps', 'combat', 'terrain', 'hangar'],
    included: [
      '1 map Roblox Studio complète (.rbxl)',
      '5 bâtiments avec intérieurs, dont hangar et armurerie',
      'Terrain sculpté avec transitions fondues',
      'Clôtures, postes de contrôle et miradors',
      'Set de props véhicules et caisses',
      'Couverts placés pour le gameplay',
    ],
    perfectFor: ['Jeux FPS', 'Jeux roleplay', 'Terrains d’entraînement', 'Showcases'],
    specs: { fileType: '.RBXL', fileSize: '280 MB', version: '1.2' },
    rating: 4.7,
    reviewCount: 62,
    sales: 430,
    flags: { featured: true },
    createdDaysAgo: 120,
    changelog: [{ version: '1.2', days: 30, notes: ['Niveau souterrain ajouté', 'Fondu du terrain amélioré'] }],
    reviews: [
      { author: 'TacticalTom', rating: 5, date: daysAgo(11), verified: true, title: 'Les couverts sont réfléchis', comment: 'On sent que c’est construit par quelqu’un qui joue aux shooters. Les lignes de vue fonctionnent, et l’intérieur du hangar offre un vrai espace de combat rapproché.' },
      { author: 'RBX_Kaden', rating: 4, date: daysAgo(29), verified: true, title: 'Excellente map, lourde sur mobile', comment: 'Le rendu est superbe et la section souterraine ajoutée en 1.2 est un vrai bonus. J’ai dû alléger les détails pour les téléphones.' },
      { author: 'Orion_Builds', rating: 5, date: daysAgo(51), verified: true, title: 'Le fondu du terrain est propre', comment: 'Aucun rocher flottant, aucune fondation qui traverse — c’est pourtant la première chose que je dois corriger sur les maps achetées.' },
    ],
  },
  {
    slug: 'low-poly-city-assets',
    name: 'Assets Ville Low Poly',
    category: 'assets',
    subcategory: 'Low Poly',
    price: 14.99,
    short: 'Plus de 180 pièces urbaines low-poly sur une grille cohérente, pour des blockouts rapides.',
    description:
      'Un kit low-poly modulaire pour construire des villes rapidement. Tout partage la même échelle et s’aligne sur une grille de 4 studs : les pièces s’ajustent du premier coup, pas après vingt minutes de repositionnement.\n\nLe nombre de parts est volontairement bas, ce qui en fait le bon choix pour les expériences pensées mobile ou tout jeu qui a besoin de beaucoup d’environnement sans le payer en performances.',
    tags: ['low poly', 'modulaire', 'ville', 'mobile', 'kit', 'blockout'],
    included: [
      'Plus de 180 assets modulaires (.rbxm)',
      'Alignement cohérent sur une grille de 4 studs',
      'Bâtiments, routes, végétation et mobilier urbain',
      'Variantes de couleurs incluses',
      'Arborescence de dossiers organisée et nommée',
    ],
    perfectFor: ['Expériences mobiles', 'Simulateurs', 'Tycoons', 'Prototypage', 'Obbies'],
    specs: { fileType: '.RBXM', fileSize: '42 MB', version: '1.6' },
    rating: 4.8,
    reviewCount: 203,
    sales: 2100,
    flags: { bestSeller: true },
    createdDaysAgo: 300,
    changelog: [{ version: '1.6', days: 18, notes: ['24 nouveaux props ajoutés', 'Pivot corrigé sur les pièces d’angle'] }],
    reviews: [
      { author: 'TinyTowns', rating: 5, date: daysAgo(7), verified: true, title: 'L’alignement sur grille est parfait', comment: 'L’accrochage fonctionne, tout simplement. J’ai blockouté une ville entière en une soirée. À 15 €, c’est le meilleur rapport qualité-prix que j’ai acheté ici.' },
      { author: 'devon_rbx', rating: 5, date: daysAgo(22), verified: true, title: 'Tourne très bien sur mobile', comment: 'Le nombre de parts est assez bas pour que ma build téléphone tienne 60 fps avec une ville entière chargée.' },
      { author: 'MapleGames', rating: 4, date: daysAgo(48), verified: true, title: 'J’aimerais plus de variété', comment: 'Les props de la 1.6 ont aidé. J’aimerais encore quelques silhouettes de bâtiments en plus, mais la qualité est constante partout.' },
    ],
  },
  {
    slug: 'police-vehicle-pack',
    name: 'Pack Véhicules de Police',
    category: 'vehicles',
    subcategory: 'Urgences',
    price: 19.99,
    short: 'Six véhicules d’urgence avec rampes lumineuses, sirènes et pare-buffles fonctionnels.',
    description:
      'Une flotte d’urgence conçue pour les serveurs roleplay. Chaque véhicule embarque une rampe lumineuse configurable, quatre tonalités de sirène, un projecteur fonctionnel et un pare-buffles qui entre réellement en collision.\n\nLe contrôleur d’éclairage est un module unique partagé par toute la flotte : changer un motif ou ajouter une tonalité s’applique partout d’un coup, pas six fois.',
    tags: ['police', 'urgences', 'sirène', 'roleplay', 'rampe lumineuse'],
    included: [
      '6 véhicules d’urgence (.rbxm)',
      'Motifs de rampe lumineuse configurables',
      '4 tonalités de sirène avec avertisseur',
      'Projecteur et pare-buffles fonctionnels',
      'Module de contrôle d’éclairage partagé',
      'Gabarit de livrée (sans PSD, éditable dans Studio)',
    ],
    perfectFor: ['Jeux roleplay', 'Jeux d’intervention d’urgence', 'Serveurs de ville'],
    specs: { fileType: '.RBXM', fileSize: '58 MB', version: '1.8' },
    rating: 4.7,
    reviewCount: 88,
    sales: 760,
    createdDaysAgo: 140,
    changelog: [{ version: '1.8', days: 25, notes: ['Nouvel éditeur de motifs lumineux', 'Bug de superposition des sirènes corrigé'] }],
    reviews: [
      { author: 'Officer_Dev', rating: 5, date: daysAgo(13), verified: true, title: 'Le contrôleur d’éclairage est excellent', comment: 'Un seul module pilote toute la flotte. Ajouter un motif personnalisé m’a pris cinq minutes pour les six voitures.' },
      { author: 'CityRP_Admin', rating: 4, date: daysAgo(35), verified: true, title: 'Parfait pour les serveurs RP', comment: 'Les joueurs ont remarqué la qualité des sirènes tout de suite. Les livrées ont demandé du travail pour coller à notre service, mais le gabarit a bien aidé.' },
      { author: 'zaneworks', rating: 5, date: daysAgo(66), verified: true, title: 'Les pare-buffles entrent vraiment en collision', comment: 'Petit détail, mais la plupart des packs le simulent. Ici, ça pousse réellement les voitures.' },
    ],
  },
  {
    slug: 'modern-house-pack',
    name: 'Pack Maisons Modernes',
    category: 'buildings',
    subcategory: 'Résidentiel',
    price: 24.99,
    short: 'Huit maisons modernes entièrement meublées, prêtes à poser sur une parcelle.',
    description:
      'Huit constructions résidentielles aux intérieurs finis : mobilier, éclairage, encadrements de portes fonctionnels et pièces décorées. Chaque maison occupe une emprise de parcelle standard : elles s’intègrent directement à un tycoon ou un terrain roleplay sans redimensionnement.\n\nL’architecture est cohérente sur tout le set : une rue construite avec ces maisons paraît voulue, et non assemblée depuis trois packs différents.',
    tags: ['maison', 'résidentiel', 'intérieur', 'mobilier', 'tycoon', 'moderne'],
    included: [
      '8 maisons entièrement meublées (.rbxm)',
      'Emprise de parcelle identique sur tout le set',
      'Éclairage intérieur pièce par pièce',
      'Plus de 90 meubles, réutilisables séparément',
      'Props d’aménagement extérieur',
    ],
    perfectFor: ['Tycoons', 'Jeux roleplay', 'Showcases', 'Systèmes de logement'],
    specs: { fileType: '.RBXM', fileSize: '134 MB', version: '2.0' },
    rating: 4.8,
    reviewCount: 117,
    sales: 980,
    flags: { bestSeller: true },
    createdDaysAgo: 175,
    changelog: [{ version: '2.0', days: 40, notes: ['3 nouvelles maisons ajoutées', 'Intérieurs remeublés', 'Tailles de parcelle unifiées'] }],
    reviews: [
      { author: 'HomeTycoonDev', rating: 5, date: daysAgo(10), verified: true, title: 'Les tailles de parcelle correspondent', comment: 'Toutes les maisons tiennent dans la même emprise, mon système de logement n’a pas eu besoin de décalages par modèle. Rien que ça m’a fait gagner une journée.' },
      { author: 'ellie_builds', rating: 5, date: daysAgo(26), verified: true, title: 'Des intérieurs vraiment meublés', comment: 'Pas trois chaises et une table. Les pièces semblent habitées, et le mobilier est réutilisable séparément.' },
      { author: 'RBXArchitect', rating: 4, date: daysAgo(55), verified: true, title: 'Un ensemble cohérent', comment: 'Une rue construite avec ça paraît voulue. J’aimerais quelques variantes de toit en plus dans une future mise à jour.' },
    ],
  },
  {
    slug: 'sci-fi-gui-kit',
    name: 'Kit GUI Science-Fiction',
    category: 'gui',
    subcategory: 'Thèmes',
    price: 14.99,
    short: 'Un kit d’interface science-fiction complet : menus, HUD, boutique et réglages.',
    description:
      'Un ensemble d’interfaces thématiques au langage visuel cohérent sur tous les écrans. Menu principal, HUD en jeu, boutique, réglages, chargement et notifications sont inclus et déjà reliés entre eux.\n\nLes couleurs sont pilotées par un module de thème unique : passer l’accent du cyan à votre couleur de marque met à jour tout le kit.',
    tags: ['science-fiction', 'kit ui', 'hud', 'menu', 'boutique', 'thème'],
    included: [
      'Écrans menu principal, HUD, boutique et réglages',
      'Composants de notification et de chargement',
      'Module de thème unique pour tout recolorer',
      'Transitions animées entre les écrans',
      'Contraintes de mise en page sûres sur mobile',
    ],
    perfectFor: ['Jeux science-fiction', 'Simulateurs', 'Jeux spatiaux', 'Showcases'],
    specs: { fileType: '.RBXM', fileSize: '9 MB', version: '1.5' },
    rating: 4.6,
    reviewCount: 74,
    sales: 690,
    createdDaysAgo: 110,
    changelog: [{ version: '1.5', days: 15, notes: ['Pile de notifications ajoutée', 'Module de thème réécrit'] }],
    reviews: [
      { author: 'NovaDev', rating: 5, date: daysAgo(8), verified: true, title: 'Le module de thème est le meilleur atout', comment: 'J’ai changé une valeur de couleur et tout le kit s’est accordé à mon jeu. Ça m’a évité de reprendre quarante frames à la main.' },
      { author: 'astro_rb', rating: 4, date: daysAgo(31), verified: true, title: 'Rendu net', comment: 'Les animations sont sobres plutôt qu’excessives. Deux écrans ont demandé des ajustements de marges sur petits téléphones.' },
      { author: 'QuasarStudio', rating: 5, date: daysAgo(59), verified: true, title: 'Cohérent d’un écran à l’autre', comment: 'Tout partage les mêmes espacements et la même échelle typographique, c’est ce qui fait pro.' },
    ],
  },
  {
    slug: 'hospital-map',
    name: 'Map Hôpital',
    category: 'maps',
    subcategory: 'Institutionnel',
    price: 34.99,
    salePrice: 27.99,
    short: 'Un hôpital sur trois étages : chambres, blocs opératoires, accueil et ascenseur fonctionnel.',
    description:
      'Un établissement médical détaillé réparti sur trois étages. Accueil, urgences, chambres, blocs opératoires, pharmacie et espaces du personnel sont entièrement meublés, reliés par des cages d’escalier et un ascenseur scripté.\n\nLa signalétique est en place : les joueurs peuvent réellement s’orienter dans le bâtiment — un détail que la plupart des maps institutionnelles oublient, et qu’il faut corriger après le lancement.',
    tags: ['hôpital', 'médical', 'roleplay', 'intérieur', 'multi-étages'],
    included: [
      '1 map Roblox Studio complète (.rbxl)',
      '3 étages reliés par des cages d’escalier',
      'Ascenseur scripté desservant tous les niveaux',
      'Chambres, blocs opératoires, pharmacie et accueil',
      'Set complet de props médicaux (plus de 60 pièces)',
      'Signalétique d’orientation dans tout le bâtiment',
    ],
    perfectFor: ['Jeux roleplay', 'Roleplay médical', 'Jeux d’horreur', 'Showcases'],
    specs: { fileType: '.RBXL', fileSize: '215 MB', version: '1.3' },
    rating: 4.9,
    reviewCount: 71,
    sales: 520,
    flags: { featured: true },
    createdDaysAgo: 95,
    changelog: [{ version: '1.3', days: 20, notes: ['Script d’ascenseur réécrit', 'Pharmacie ajoutée', 'Signalétique améliorée'] }],
    reviews: [
      { author: 'MedRP_Owner', rating: 5, date: daysAgo(5), verified: true, title: 'On s’y repère, c’est rare', comment: 'Grâce à la signalétique, les nouveaux joueurs trouvent les chambres sans guide. L’ascenseur réécrit en 1.3 est bien plus fluide que l’ancien.' },
      { author: 'clara_dev', rating: 5, date: daysAgo(24), verified: true, title: 'Les props valent déjà le prix', comment: 'Une soixantaine de props médicaux tous cohérents en style. Je les ai déjà réutilisés sur un second projet.' },
      { author: 'GrimGames', rating: 5, date: daysAgo(47), verified: true, title: 'Fonctionne aussi en horreur', comment: 'J’ai baissé l’éclairage, ajouté du brouillard, et c’est devenu un jeu complètement différent. Une base très flexible.' },
    ],
  },
  {
    slug: 'weapon-ui-pack',
    name: 'Pack UI de Combat',
    category: 'gui',
    subcategory: 'HUD',
    price: 9.99,
    short: 'Composants de HUD de combat : compteurs de munitions, viseurs, marqueurs de tir et killfeed.',
    description:
      'La couche interface d’un shooter, prête à brancher. Compteurs de munitions, six viseurs, marqueurs de tir avec nombres de dégâts, killfeed et roue d’armes sont tous inclus.\n\nLes composants sont indépendants : prenez uniquement le killfeed si c’est tout ce qu’il vous faut. Chacun expose une petite API au lieu d’exiger que vous modifiiez son code interne.',
    tags: ['fps', 'hud', 'viseur', 'killfeed', 'combat', 'ui'],
    included: [
      'Compteur de munitions avec états de rechargement',
      '6 styles de viseur, permutables en cours de partie',
      'Marqueurs de tir avec nombres de dégâts',
      'Killfeed à durée configurable',
      'Sélecteur en roue d’armes',
      'Documentation d’API par composant',
    ],
    perfectFor: ['Jeux FPS', 'Battle royale', 'Arènes PvP', 'Simulateurs de combat'],
    specs: { fileType: '.RBXM', fileSize: '6 MB', version: '2.2' },
    rating: 4.7,
    reviewCount: 142,
    sales: 1320,
    flags: { bestSeller: true },
    createdDaysAgo: 190,
    changelog: [{ version: '2.2', days: 28, notes: ['Roue d’armes ajoutée', 'Performances du killfeed corrigées'] }],
    reviews: [
      { author: 'FragMaster_RB', rating: 5, date: daysAgo(12), verified: true, title: 'Des composants indépendants', comment: 'Je n’avais besoin que du killfeed et des marqueurs de tir. Je les ai pris, ignoré le reste, aucune référence cassée. Bien structuré.' },
      { author: 'devsam', rating: 4, date: daysAgo(30), verified: true, title: 'Bon rapport qualité-prix', comment: 'Dix euros pour quelque chose qui m’aurait pris un week-end. Le changement de viseur est une bonne idée.' },
      { author: 'ZenithFPS', rating: 5, date: daysAgo(63), verified: true, title: 'Des API propres', comment: 'Chaque composant prend une table d’options au lieu de vous forcer à modifier sa source. C’est comme ça qu’il faut faire.' },
    ],
  },
  {
    slug: 'nature-asset-pack',
    name: 'Pack Assets Nature',
    category: 'assets',
    subcategory: 'Environnement',
    price: 19.99,
    short: 'Plus de 220 arbres, rochers, plantes et détails de terrain, avec variantes saisonnières.',
    description:
      'Un kit d’environnement naturel assez varié pour bâtir une forêt qui n’a pas l’air copiée-collée. Quatre essences d’arbres en trois tailles chacune, des rochers en deux familles de matériaux, et un couvre-sol aux formes assez nombreuses pour casser la répétition.\n\nChaque modèle a un pivot correct à sa base : les disperser sur un terrain sculpté ne laisse rien flotter ni s’enterrer.',
    tags: ['nature', 'arbres', 'forêt', 'terrain', 'environnement', 'saisonnier'],
    included: [
      'Plus de 220 assets nature (.rbxm)',
      '4 essences d’arbres en 3 tailles chacune',
      'Rochers, falaises et blocs erratiques',
      'Couvre-sol, fougères et fleurs',
      'Variantes de couleurs automne et hiver',
      'Pivots alignés à la base sur chaque modèle',
    ],
    perfectFor: ['Expériences open world', 'Jeux de survie', 'Showcases', 'Obbies', 'Jeux roleplay'],
    specs: { fileType: '.RBXM', fileSize: '88 MB', version: '1.7' },
    rating: 4.8,
    reviewCount: 165,
    sales: 1420,
    flags: { bestSeller: true },
    createdDaysAgo: 220,
    changelog: [{ version: '1.7', days: 22, notes: ['Variantes hiver ajoutées', 'Pivots corrigés sur les falaises'] }],
    reviews: [
      { author: 'ForestFables', rating: 5, date: daysAgo(9), verified: true, title: 'Assez varié pour éviter la répétition', comment: 'Douze combinaisons d’arbres donnent une forêt naturelle plutôt que carrelée. Les variantes saisonnières sont un bonus inattendu.' },
      { author: 'rowan_dev', rating: 5, date: daysAgo(25), verified: true, title: 'Les pivots sont corrects', comment: 'J’ai dispersé 400 modèles sur le terrain par script, pas un seul n’a flotté. Celui qui a préparé ça s’est appliqué.' },
      { author: 'IsleStudios', rating: 4, date: daysAgo(52), verified: true, title: 'Superbe, surveillez le nombre de parts', comment: 'Des assets magnifiques, mais une forêt dense, ça chiffre. Utilisés avec mesure, tout va bien.' },
    ],
  },
  {
    slug: 'street-props-pack',
    name: 'Pack Props Urbains',
    category: 'props',
    subcategory: 'Urbain',
    price: 9.99,
    short: '140 props urbains — bancs, poubelles, signalisation, éclairage et mobilier de rue.',
    description:
      'L’habillage de décor qui transforme une rue vide en lieu crédible. Bancs, poubelles, abribus, feux tricolores, panneaux, bornes, bouches d’incendie, jardinières et tous les petits détails que la plupart des builds oublient.\n\nToutes les pièces partagent l’échelle et la palette de matériaux de nos gammes urbaines : elles se mélangent proprement avec le reste de la boutique.',
    tags: ['props', 'rue', 'urbain', 'décor', 'signalisation', 'détail'],
    included: [
      '140 props urbains (.rbxm)',
      'Éclairage public avec configuration émissive',
      'Set de signalisation complet, panneaux routiers inclus',
      'Abribus, bancs et abris',
      'Poubelles, bornes, bouches d’incendie et jardinières',
      'Échelle et palette de matériaux partagées',
    ],
    perfectFor: ['Jeux roleplay', 'Constructions urbaines', 'Expériences de conduite', 'Showcases'],
    specs: { fileType: '.RBXM', fileSize: '34 MB', version: '1.4' },
    rating: 4.7,
    reviewCount: 189,
    sales: 1680,
    flags: { bestSeller: true },
    createdDaysAgo: 260,
    changelog: [{ version: '1.4', days: 35, notes: ['20 props ajoutés', 'Passe émissive sur l’éclairage public'] }],
    reviews: [
      { author: 'UrbanRBX', rating: 5, date: daysAgo(14), verified: true, title: 'Le moins cher, et le plus efficace', comment: 'Dix euros de props ont fait plus pour l’ambiance de ma ville qu’un pack de bâtiments bien plus cher.' },
      { author: 'nina_builds', rating: 5, date: daysAgo(29), verified: true, title: 'Se mélange avec tout', comment: 'L’échelle correspond aux autres packs urbains d’ici, rien ne détonne une fois combiné.' },
      { author: 'GridlockDev', rating: 4, date: daysAgo(57), verified: true, title: 'Fait exactement ce qui est annoncé', comment: 'Aucune surprise, bonne qualité, nommage sensé. La passe d’éclairage émissif était une bonne mise à jour.' },
    ],
  },
  {
    slug: 'luxury-mansion-map',
    name: 'Map Villa de Luxe',
    category: 'maps',
    subcategory: 'Résidentiel',
    price: 49.99,
    short: 'Une propriété très détaillée : intérieurs meublés, piscine, garage et parc.',
    description:
      'Notre construction résidentielle la plus détaillée. Une villa sur deux niveaux à l’intérieur entièrement meublé — hall d’entrée, pièces de vie, cuisine, six chambres, home cinéma et garage — posée dans un parc paysager avec piscine, court de tennis et allée sécurisée.\n\nL’éclairage est réglé pièce par pièce avec des sondes de réflexion placées : les intérieurs rendent luxueux en capture sans que vous touchiez le moindre réglage.',
    tags: ['villa', 'luxe', 'propriété', 'intérieur', 'showcase', 'premium'],
    included: [
      '1 map Roblox Studio complète (.rbxl)',
      'Villa sur 2 niveaux, entièrement meublée',
      'Parc paysager avec piscine et court de tennis',
      'Garage avec emplacements véhicules',
      'Éclairage et réflexions réglés pièce par pièce',
      'Plus de 200 meubles et éléments de décoration',
    ],
    perfectFor: ['Jeux roleplay', 'Showcases', 'Simulateurs de luxe', 'Systèmes de logement'],
    specs: { fileType: '.RBXL', fileSize: '410 MB', version: '1.1' },
    rating: 4.9,
    reviewCount: 43,
    sales: 310,
    flags: { featured: true, newRelease: true },
    shots: 5,
    video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    createdDaysAgo: 24,
    changelog: [{ version: '1.1', days: 9, notes: ['Home cinéma ajouté', 'Éclairage de la piscine retravaillé'] }],
    reviews: [
      { author: 'EliteRP', rating: 5, date: daysAgo(3), verified: true, title: 'Les captures se vendent toutes seules', comment: 'J’ai posté une photo d’intérieur sur notre Discord et j’ai eu plus d’inscriptions qu’en une semaine de publications. L’éclairage pièce par pièce fait beaucoup.' },
      { author: 'marc_dev', rating: 5, date: daysAgo(12), verified: true, title: 'Cher mais justifié', comment: 'Cinquante euros paraissaient élevés jusqu’à l’ouverture du fichier. Le mobilier à lui seul vaut une bonne partie du prix.' },
      { author: 'VistaGames', rating: 5, date: daysAgo(18), verified: true, title: 'Le parc n’est pas bâclé', comment: 'La plupart des maps de villa s’arrêtent aux murs. Ici, l’aménagement extérieur est vraiment fini.' },
    ],
  },
  {
    slug: 'simulator-ui-pack',
    name: 'Pack UI Simulateur',
    category: 'gui',
    subcategory: 'Systèmes',
    price: 14.99,
    short: 'Boutique, rebirth, inventaire de pets et classement pour jeux de simulateur.',
    description:
      'L’ensemble d’interfaces dont un simulateur a réellement besoin. Une boutique avec onglets et affichage de monnaie, un écran de rebirth avec confirmation, un inventaire de pets avec états d’équipement, un classement et une popup de récompense quotidienne — le tout dans le même système visuel.\n\nLe formatage des grands nombres est géré : 1 240 000 s’affiche 1,24 M sans que vous réécriviez cette fonction.',
    tags: ['simulateur', 'boutique', 'rebirth', 'pets', 'classement', 'ui'],
    included: [
      'Interface de boutique avec onglets de catégories',
      'Écran de rebirth avec parcours de confirmation',
      'Inventaire de pets avec états équipé et verrouillé',
      'Composant de classement',
      'Popup de récompense quotidienne avec suivi de série',
      'Utilitaire de formatage des grands nombres',
    ],
    perfectFor: ['Simulateurs', 'Tycoons', 'Jeux de pets', 'Jeux clicker'],
    specs: { fileType: '.RBXM / .LUA', fileSize: '11 MB', version: '2.3' },
    rating: 4.8,
    reviewCount: 131,
    sales: 1190,
    flags: { bestSeller: true },
    createdDaysAgo: 150,
    changelog: [{ version: '2.3', days: 17, notes: ['Séries de récompenses quotidiennes ajoutées', 'États de verrouillage dans l’inventaire de pets'] }],
    reviews: [
      { author: 'SimuDev', rating: 5, date: daysAgo(6), verified: true, title: 'Couvre tout le genre', comment: 'Boutique, rebirth, pets, classement — tout ce qu’un simulateur demande, dans un style cohérent. Le formatage des nombres m’a évité un fichier utilitaire.' },
      { author: 'coco_rbx', rating: 5, date: daysAgo(21), verified: true, title: 'Le parcours de rebirth est bien pensé', comment: 'L’étape de confirmation empêche les rebirths accidentels, ce qui était une vraie plainte dans mon jeu avant.' },
      { author: 'PetTycoonHQ', rating: 4, date: daysAgo(45), verified: true, title: 'Solide', comment: 'J’ai dû le restyler pour coller à mon jeu, mais la structure a rendu ça facile.' },
    ],
  },
  {
    slug: 'industrial-building-pack',
    name: 'Pack Bâtiments Industriels',
    category: 'buildings',
    subcategory: 'Industriel',
    price: 24.99,
    short: 'Entrepôts, usines et dépôts avec intérieurs et quais de chargement.',
    description:
      'Des bâtiments d’industrie lourde aux intérieurs construits : halls d’entrepôt, lignes de production, bureaux, mezzanines et quais de chargement avec rideaux métalliques fonctionnels.\n\nL’échelle est volontairement généreuse pour que les véhicules puissent entrer, ce qui compte dans les jeux de logistique et de roleplay où l’intérieur fait partie du gameplay et pas du décor.',
    tags: ['industriel', 'entrepôt', 'usine', 'logistique', 'intérieur'],
    included: [
      '7 bâtiments industriels (.rbxm)',
      'Variantes entrepôt, usine, dépôt et bureaux',
      'Quais de chargement avec rideaux métalliques',
      'Mezzanines et passerelles intérieures',
      'Set de props industriels (machines, palettes, caisses)',
      'Gabarits intérieurs accessibles aux véhicules',
    ],
    perfectFor: ['Jeux de logistique', 'Jeux roleplay', 'Tycoons', 'Expériences de conduite'],
    specs: { fileType: '.RBXM', fileSize: '156 MB', version: '1.5' },
    rating: 4.6,
    reviewCount: 58,
    sales: 470,
    createdDaysAgo: 130,
    changelog: [{ version: '1.5', days: 33, notes: ['Variante dépôt ajoutée', 'Script de rideau métallique corrigé'] }],
    reviews: [
      { author: 'HaulerRP', rating: 5, date: daysAgo(15), verified: true, title: 'Les camions rentrent', comment: 'Les gabarits sont justes, notre gameplay de livraison fonctionne à l’intérieur. La plupart des packs d’entrepôt sont à la mauvaise échelle pour ça.' },
      { author: 'ind_dev', rating: 4, date: daysAgo(37), verified: true, title: 'Belle gamme', comment: 'Sept bâtiments suffisent pour un quartier industriel complet. Les rideaux métalliques avaient un bug, corrigé rapidement en 1.5.' },
      { author: 'CrateWorks', rating: 5, date: daysAgo(61), verified: true, title: 'Les props sont réutilisables', comment: 'Les palettes et les machines se sont retrouvées partout sur ma map, pas seulement dans ces bâtiments.' },
    ],
  },
  {
    slug: 'datastore-save-system',
    name: 'Système de Sauvegarde Datastore',
    category: 'scripts',
    subcategory: 'Backend',
    price: 14.99,
    short: 'Sauvegarde verrouillée par session, avec réessais, migrations et panneau d’administration.',
    description:
      'Une couche de données de production, pas un script de tutoriel. Le verrouillage de session empêche la duplication entre serveurs, les réessais avec temporisation gèrent la limitation des datastores Roblox, et un système de migration de schéma permet de changer la structure des données sans effacer les joueurs existants.\n\nUn panneau d’administration en jeu permet d’inspecter et de modifier un profil joueur en direct, ce qui transforme toute une catégorie de rapports de bugs en correction de trente secondes.',
    tags: ['datastore', 'sauvegarde', 'verrou de session', 'luau', 'backend', 'migrations'],
    included: [
      'Système de profils verrouillés par session (.lua)',
      'Réessai automatique avec temporisation exponentielle',
      'Versionnage de schéma et aides à la migration',
      'Panneau d’inspection en jeu pour l’administrateur',
      'Sauvegarde automatique à intervalle configurable',
      'Source commentée et guide d’intégration (PDF)',
    ],
    perfectFor: ['Simulateurs', 'Tycoons', 'Jeux de rôle', 'Tout jeu avec progression'],
    specs: { fileType: '.LUA / .RBXM', fileSize: '4 MB', version: '3.1' },
    rating: 4.9,
    reviewCount: 97,
    sales: 830,
    flags: { featured: true },
    createdDaysAgo: 170,
    changelog: [{ version: '3.1', days: 14, notes: ['Aide à la migration réécrite', 'Recherche dans le panneau d’administration'] }],
    reviews: [
      { author: 'BackendBen', rating: 5, date: daysAgo(7), verified: true, title: 'Les migrations font toute la différence', comment: 'J’ai changé la structure de mes données deux fois depuis l’achat sans rien perdre. C’est précisément là que la plupart des gens se plantent en l’écrivant eux-mêmes.' },
      { author: 'ryu_scripts', rating: 5, date: daysAgo(23), verified: true, title: 'Le verrouillage de session fonctionne', comment: 'L’exploit de duplication dans mon jeu a disparu le jour où je suis passé à ça. Le code est lisible et commenté.' },
      { author: 'TycoonLabs', rating: 5, date: daysAgo(49), verified: true, title: 'Le panneau admin fait gagner du temps', comment: 'Pouvoir inspecter un profil en direct a transformé des enquêtes d’une heure en un simple coup d’œil.' },
    ],
  },
  {
    slug: 'modular-build-kit',
    name: 'Kit de Construction Modulaire',
    category: 'studs',
    subcategory: 'Construction',
    price: 19.99,
    short: 'Plus de 300 blocs alignés sur la grille pour une architecture rapide et cohérente.',
    description:
      'Un système de construction au stud près. Murs, sols, toits, escaliers, fenêtres, portes et moulures, tous construits sur un module de 4 studs : tout se raccorde à tout sans espace.\n\nC’est le kit vers lequel se tourner quand on veut une cohérence architecturale sur une grande construction sans modéliser chaque structure de zéro.',
    tags: ['modulaire', 'construction', 'kit', 'grille', 'architecture', 'blockout'],
    included: [
      'Plus de 300 pièces de construction modulaires (.rbxm)',
      'Module de grille strict de 4 studs',
      'Murs, sols, toits, escaliers et moulures',
      'Encadrements de fenêtres et portes avec inserts assortis',
      '6 préréglages de matériaux',
      'Guide de prise en main (PDF)',
    ],
    perfectFor: ['Prototypage', 'Tycoons', 'Jeux roleplay', 'Showcases', 'Expériences open world'],
    specs: { fileType: '.RBXM', fileSize: '52 MB', version: '2.0' },
    rating: 4.8,
    reviewCount: 112,
    sales: 940,
    flags: { newRelease: true },
    createdDaysAgo: 38,
    changelog: [{ version: '2.0', days: 11, notes: ['80 pièces ajoutées', 'Nouveaux préréglages de matériaux', 'Audit complet de la grille'] }],
    reviews: [
      { author: 'ModularMax', rating: 5, date: daysAgo(4), verified: true, title: 'Tout s’accroche', comment: 'La discipline de grille est stricte, et c’est exactement ce qu’on veut. J’ai construit quatre structures en une soirée, toutes cohérentes.' },
      { author: 'blockwright', rating: 5, date: daysAgo(17), verified: true, title: 'A remplacé mon propre kit', comment: 'Je maintenais une version personnelle de ça depuis des années. Celui-ci est mieux organisé que le mien.' },
      { author: 'StudioNine', rating: 4, date: daysAgo(30), verified: true, title: 'Demande un temps d’adaptation', comment: 'Lisez le guide d’abord. Une fois le module compris, c’est très rapide.' },
    ],
  },
  {
    slug: 'roleplay-starter-pack',
    name: 'Pack Roleplay Complet',
    category: 'packs',
    subcategory: 'Bundle',
    price: 49.99,
    salePrice: 39.99,
    short: 'Map de ville, flotte de véhicules, props et interface — un jeu roleplay complet en un bundle.',
    description:
      'Tout ce qu’il faut pour lancer une expérience roleplay, réuni à environ la moitié du prix de l’achat séparé. Une map de ville, une flotte de véhicules civils, la flotte d’urgence, le set de props urbains et un kit d’interface assorti — tous choisis parce qu’ils partagent échelle et style.\n\nSi vous démarrez un jeu roleplay de zéro, c’est le chemin crédible le plus rapide entre une baseplate vide et un jeu où les joueurs restent.',
    tags: ['bundle', 'roleplay', 'démarrage', 'ville', 'véhicules', 'économie'],
    included: [
      'Map de ville complète (.rbxl)',
      '12 véhicules civils',
      '6 véhicules d’urgence avec rampes lumineuses',
      '140 props urbains',
      'Kit d’interface roleplay (menus, HUD, boutique)',
      'Guide d’installation et d’intégration (PDF)',
    ],
    perfectFor: ['Jeux roleplay', 'Serveurs de ville', 'Jeux d’intervention d’urgence', 'Hubs open world'],
    specs: { fileType: '.RBXL / .RBXM', fileSize: '620 MB', version: '1.2' },
    rating: 4.9,
    reviewCount: 66,
    sales: 540,
    flags: { featured: true, bestSeller: true },
    shots: 5,
    createdDaysAgo: 80,
    changelog: [{ version: '1.2', days: 16, notes: ['Tous les composants mis à jour', 'Palette de couleurs unifiée sur tout le bundle'] }],
    reviews: [
      { author: 'RPCityOwner', rating: 5, date: daysAgo(5), verified: true, title: 'L’économie saute aux yeux', comment: 'J’ai chiffré chaque élément séparément avant d’acheter — le bundle revient à peu près à la moitié. Et comme ils ont été choisis pour aller ensemble, rien ne détonne.' },
      { author: 'jules_rb', rating: 5, date: daysAgo(20), verified: true, title: 'Lancé en une semaine', comment: 'De rien à un serveur roleplay jouable en une semaine de soirées. Le guide explique comment les pièces s’emboîtent.' },
      { author: 'MetroRoleplay', rating: 4, date: daysAgo(41), verified: true, title: 'Gros téléchargement, mais ça vaut le coup', comment: '620 Mo, ça prend un moment, mais tout y est. Je le recommande à quiconque démarre un jeu RP.' },
    ],
  },
];

export const SEED_META = SEEDS.map((s) => ({
  slug: s.slug,
  palette: (
    {
      maps: 'violet', assets: 'cyan', gui: 'pink', scripts: 'green', vehicles: 'amber',
      buildings: 'blue', props: 'slate', studs: 'gold', packs: 'pink', other: 'slate',
    } as Record<string, string>
  )[s.category],
  kind: (
    { gui: 'gui', scripts: 'code', vehicles: 'vehicle', props: 'props' } as Record<string, string>
  )[s.category] ?? 'build',
  shots: s.shots ?? 4,
}));

export { SEEDS, DEFAULT_BENEFITS, daysAgo };
export type { Seed };
