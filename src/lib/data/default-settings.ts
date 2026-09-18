import type { SiteSettings } from '../types';

/**
 * Valeurs d'usine de tout le contenu éditable du site.
 *
 * Elles amorcent la base de données au premier lancement. Ensuite,
 * /admin/settings fait autorité — modifier ce fichier n'a aucun effet sur une
 * installation déjà démarrée. Utilisez « Réinitialiser » dans l'admin pour y
 * revenir.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  // À COMPLÉTER dans /admin/settings → Mentions légales.
  // Tant que ces champs sont vides, la page /mentions-legales affiche un
  // avertissement : un site professionnel français doit les publier.
  legal: {
    editorType: 'individual',
    editorName: '',
    legalForm: '',
    shareCapital: '',
    address: '',
    phone: '',
    email: '',
    registrationNumber: '',
    rcs: '',
    vatNumber: '',
    vatRegistered: false,
    publicationDirector: '',
    hostName: 'Vercel Inc.',
    hostAddress: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    hostPhone: 'https://vercel.com/contact',
    mediatorName: '',
    mediatorUrl: '',
    dpoContact: '',
    minimumAge: 18,
  },
  brand: {
    name: 'One More Click Studio',
    shortName: 'OMC Studio',
    wordmarkTop: 'ONE MORE CLICK',
    wordmarkBottom: 'Studio',
    tagline: 'Ressources premium pour Roblox Studio',
    description:
      'Maps, assets, interfaces et ressources de développement premium, conçus pour les créateurs Roblox ambitieux.',
  },
  links: {
    discordUrl: 'https://discord.gg/TJ4a2JrS9S',
    supportEmail: 'support@onemoreclick.studio',
  },
  theme: {
    brand: '#533AFD',
    accent: '#7F71E6',
    violet: '#182659',
  },
  hero: {
    badge: 'Nouveautés chaque semaine',
    titleLine1: 'Créez de meilleurs',
    titleLine2: 'jeux Roblox.',
    titleAccent: 'Plus vite.',
    subtitle:
      'Maps, assets, interfaces et ressources de développement premium, conçus pour les créateurs Roblox ambitieux.',
    primaryCta: { label: 'Explorer la marketplace', href: '/marketplace' },
    secondaryCta: { label: 'Voir les nouveautés', href: '/new-releases' },
    stats: [
      { value: 1240, suffix: '+', label: 'Ressources livrées' },
      { value: 4.8, decimals: 1, label: 'Note moyenne' },
      { value: 12, suffix: 'k+', label: 'Créateurs' },
    ],
    reassurance: ['Annonces vérifiées', 'Téléchargement immédiat', 'Prêt pour Roblox Studio'],
  },
  trust: [
    {
      icon: 'Zap',
      title: 'Téléchargement immédiat',
      description: 'Les fichiers se débloquent dès le paiement validé.',
      colour: '#B45309',
    },
    {
      icon: 'Gem',
      title: 'Assets de qualité',
      description: 'Optimisés, testés, prêts pour la production.',
      colour: '#533AFD',
    },
    {
      icon: 'ShieldCheck',
      title: 'Paiement sécurisé',
      description: 'Transactions gérées par Stripe.',
      colour: '#059669',
    },
    {
      icon: 'Blocks',
      title: 'Prêt pour Roblox Studio',
      description: 'Importez, publiez, continuez à créer.',
      colour: '#7F71E6',
    },
  ],
  ticker: [
    'Maps', 'Véhicules', 'Kits GUI', 'Systèmes Luau', 'Assets low-poly', 'Bâtiments',
    'Props urbains', 'Kits de construction', 'Packs complets', 'Terrain', 'HUD', 'Intérieurs',
  ],
  sections: {
    categoriesEyebrow: 'Catégories',
    categoriesTitle: 'Explorer par catégorie',
    categoriesDescription:
      'Tout est rangé pour que vous trouviez la pièce qui vous manque, au lieu de faire défiler le catalogue entier.',
    bestSellersTitle: 'Meilleures ventes',
    bestSellersDescription:
      'Les ressources vers lesquelles les créateurs reviennent. Classées par ventes, notées par des gens qui ont réellement publié avec.',
    newReleasesTitle: 'Nouveautés',
    newReleasesDescription:
      'Ajoutées ce mois-ci, au même niveau d’exigence que le reste du catalogue.',
  },
  promo: {
    eyebrow: 'Ressources premium',
    title: 'Passez au niveau supérieur sur votre prochain projet.',
    description:
      'Arrêtez de tout reconstruire de zéro. Partez de ressources prêtes pour la production et concentrez-vous sur l’expérience de jeu.',
    cta: { label: 'Découvrir les assets premium', href: '/marketplace' },
    points: [
      {
        icon: 'Clock',
        title: 'Des semaines gagnées',
        description: 'Sautez la partie du projet qui n’est pas la plus intéressante.',
      },
      {
        icon: 'Layers',
        title: 'Qualité homogène',
        description: 'Des assets cohérents en échelle, en style et en finition.',
      },
      {
        icon: 'Wrench',
        title: 'À vous de personnaliser',
        description: 'Des hiérarchies propres, pensées pour être modifiées.',
      },
    ],
  },
  discord: {
    title: 'Créez aux côtés d’autres créateurs Roblox.',
    description:
      'Notre Discord, c’est là que le support se fait, que les sorties sont annoncées en premier et que les créateurs partagent ce qui marche dans leurs jeux. Gratuit, sans obligation d’achat.',
    ctaLabel: 'Rejoindre le Discord',
    perks: [
      {
        icon: 'LifeBuoy',
        title: 'Aide à l’installation',
        description: 'Bloqué sur un import ? Posez la question, vous aurez une réponse.',
      },
      {
        icon: 'Bell',
        title: 'Alertes de sortie',
        description: 'Nouveautés et mises à jour annoncées en avant-première.',
      },
      {
        icon: 'Users',
        title: 'Communauté de créateurs',
        description: 'Partagez vos builds, échangez des techniques, recevez des retours.',
      },
    ],
  },
  footer: {
    blurb:
      'Maps, assets, interfaces et ressources de développement premium pour les créateurs Roblox ambitieux. Conçus pour vous faire gagner des semaines.',
    disclaimer:
      'One More Click Studio est un studio de création indépendant. Il n’est ni affilié à Roblox Corporation, ni approuvé ou sponsorisé par elle. « Roblox » et « Roblox Studio » sont des marques de Roblox Corporation.',
    copyright: 'One More Click Studio. Tous droits réservés.',
  },
  seo: {
    titleSuffix: 'Assets, maps et GUI premium pour Roblox Studio',
    description:
      'Maps, assets, interfaces et ressources de développement premium, conçus pour les créateurs Roblox ambitieux.',
  },
  updatedAt: new Date(0).toISOString(),
};
