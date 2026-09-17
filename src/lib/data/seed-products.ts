import type { Product, Review } from '../types';

/**
 * Starter catalogue.
 *
 * This is DEMO DATA. It seeds the local JSON store the first time the app runs
 * (see src/lib/services/product-service.ts). Once seeded, everything is managed
 * from /admin — you never need to edit this file again to run the shop.
 *
 * Preview art lives in /public/previews. Replace those SVGs with your own
 * Roblox Studio screenshots (same filenames) and the whole site updates.
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
    title: 'Production ready',
    description: 'Built and tested inside Roblox Studio — no cleanup pass required before you publish.',
    icon: 'Rocket',
  },
  {
    title: 'Optimised performance',
    description: 'Sensible part counts, merged geometry and lighting tuned to keep framerates stable.',
    icon: 'Gauge',
  },
  {
    title: 'Easy customisation',
    description: 'Logical hierarchy and clear naming so you can recolour, rescale and remix quickly.',
    icon: 'SlidersHorizontal',
  },
  {
    title: 'Professional quality',
    description: 'Consistent scale, clean pivots and finished details across every single piece.',
    icon: 'Gem',
  },
];

const SEEDS: Seed[] = [
  {
    slug: 'modern-city-map',
    name: 'Modern City Map',
    category: 'maps',
    subcategory: 'Urban',
    price: 34.99,
    short: 'A full modern city block with drivable roads, interiors and tuned lighting.',
    description:
      'A complete urban environment you can publish the same day you buy it. The road network is laid out on a proper grid with working intersections, the pavements are walkable end to end, and every ground-floor building opens into a finished interior. Lighting is set up for both day and night cycles, and the whole place is streaming-friendly so it holds up on lower-end devices.\n\nUse it as the backbone of a roleplay game, a driving experience or an open-world hub — or strip it for parts and reuse the buildings elsewhere.',
    tags: ['city', 'urban', 'roleplay', 'open world', 'roads', 'interiors'],
    included: [
      '1 complete Roblox Studio map (.rbxl)',
      '120+ custom assets, individually reusable',
      'Optimised day / night lighting setup',
      '18 buildings with finished interiors',
      'Full road network with junctions and signage',
      'Decorative props, street furniture and vegetation',
    ],
    perfectFor: ['Roleplay games', 'Driving experiences', 'Open world hubs', 'Showcases', 'Simulators'],
    specs: { fileType: '.RBXL / .RBXM', fileSize: '350 MB', version: '1.4' },
    rating: 4.9,
    reviewCount: 128,
    sales: 1240,
    flags: { featured: true, bestSeller: true },
    shots: 5,
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    createdDaysAgo: 210,
    changelog: [
      { version: '1.4', days: 12, notes: ['Reworked night lighting', 'Fixed collisions on the north bridge', 'Added 4 new storefronts'] },
      { version: '1.3', days: 74, notes: ['Reduced part count by 18%', 'Added interior lighting to offices'] },
      { version: '1.2', days: 140, notes: ['New park district', 'Fixed floating props near the docks'] },
    ],
    reviews: [
      { author: 'VexBuilds', rating: 5, date: daysAgo(6), verified: true, title: 'Saved me about three weeks', comment: 'I was quoting a builder for something like this and it would have cost far more than €35. Roads line up, interiors are actually finished, and the part count is reasonable. Published a roleplay game on it two days later.' },
      { author: 'mika_dev', rating: 5, date: daysAgo(19), verified: true, title: 'Interiors are the selling point', comment: 'Most city maps are hollow facades. These open up properly, which meant I could build the whole shop system without touching the exterior. Night lighting is genuinely good.' },
      { author: 'ArcadeStudios', rating: 4, date: daysAgo(33), verified: true, title: 'Great base, needed some tuning', comment: 'Runs well on desktop, had to lower some detail for older mobiles. Took an hour. Everything else was plug and play and the update to 1.4 fixed the bridge collision I reported.' },
      { author: 'NoahBuildsGames', rating: 5, date: daysAgo(58), verified: true, title: 'Clean hierarchy', comment: 'Everything is named and grouped sensibly so finding and recolouring things is quick. That sounds minor until you buy a map where it is not true.' },
    ],
  },
  {
    slug: 'realistic-vehicle-pack',
    name: 'Realistic Vehicle Pack',
    category: 'vehicles',
    subcategory: 'Civilian',
    price: 24.99,
    salePrice: 19.99,
    short: 'Twelve drivable civilian vehicles with tuned handling and working lights.',
    description:
      'A civilian fleet that feels good to drive out of the box. Each vehicle uses a consistent chassis setup, so handling stays predictable as players switch between them, and suspension values are tuned rather than left at defaults.\n\nSeats, doors, headlights, brake lights and indicators are all wired up. Bodies use a shared material setup, which means recolouring the whole fleet to match your game is a two-minute job.',
    tags: ['cars', 'driving', 'civilian', 'chassis', 'roleplay'],
    included: [
      '12 drivable vehicles (.rbxm)',
      'Tuned A-Chassis compatible setup',
      'Working headlights, brake lights and indicators',
      'Driver and passenger seats configured',
      'Shared material setup for fast recolouring',
      'Setup documentation (PDF)',
    ],
    perfectFor: ['Roleplay games', 'Driving experiences', 'Open world hubs', 'Racing games'],
    specs: { fileType: '.RBXM', fileSize: '96 MB', version: '2.1' },
    rating: 4.8,
    reviewCount: 94,
    sales: 870,
    flags: { bestSeller: true, featured: true },
    createdDaysAgo: 160,
    changelog: [
      { version: '2.1', days: 21, notes: ['Retuned suspension on all 12 vehicles', 'Fixed indicator scripts on the van'] },
      { version: '2.0', days: 96, notes: ['Added 4 new vehicles', 'Rebuilt lighting rig'] },
    ],
    reviews: [
      { author: 'DriftKing_RBLX', rating: 5, date: daysAgo(9), verified: true, title: 'Handling is actually tuned', comment: 'Bought two other packs before this one and both drove like shopping trolleys. These feel consistent across the fleet, which matters when players swap cars.' },
      { author: 'TheoRP', rating: 5, date: daysAgo(27), verified: true, title: 'Recolour setup is smart', comment: 'Shared materials meant I matched all twelve cars to my game palette in one sitting. Lights work properly too.' },
      { author: 'builderjay', rating: 4, date: daysAgo(44), verified: true, title: 'Solid, docs could be longer', comment: 'Vehicles are great. The PDF covers the basics but I had to work out the custom spawn logic myself. Still good value at the sale price.' },
    ],
  },
  {
    slug: 'advanced-inventory-gui',
    name: 'Advanced Inventory GUI',
    category: 'gui',
    subcategory: 'Systems',
    price: 19.99,
    short: 'A drag-and-drop inventory with hotbar, tooltips and full mobile support.',
    description:
      'A complete inventory interface, not just a mockup. Drag and drop between slots, a configurable hotbar, item tooltips on hover and long-press, stack splitting and a search filter are all implemented and commented.\n\nScaling is handled with UIScale and constraints, so it holds its proportions from a phone to a 1440p monitor. The data layer is separated from the view, which means wiring it to your own item system is an afternoon rather than a rewrite.',
    tags: ['inventory', 'ui', 'hotbar', 'drag and drop', 'mobile', 'luau'],
    included: [
      'Complete inventory UI (.rbxm)',
      'Drag-and-drop slot system with stack splitting',
      'Configurable hotbar (1–9 slots)',
      'Hover and long-press tooltips',
      'Search and category filtering',
      'Commented Luau modules, view/data separated',
      'Integration guide (PDF)',
    ],
    perfectFor: ['Simulators', 'RPG games', 'Survival games', 'Tycoons', 'Roleplay games'],
    specs: { fileType: '.RBXM / .LUA', fileSize: '14 MB', version: '3.0' },
    rating: 4.9,
    reviewCount: 156,
    sales: 1510,
    flags: { bestSeller: true, featured: true },
    shots: 5,
    createdDaysAgo: 240,
    changelog: [
      { version: '3.0', days: 8, notes: ['Rebuilt drag layer for mobile', 'Added stack splitting', 'New tooltip component'] },
      { version: '2.4', days: 62, notes: ['Fixed scaling on ultrawide', 'Added search filter'] },
    ],
    reviews: [
      { author: 'LunaScripts', rating: 5, date: daysAgo(4), verified: true, title: 'The separation is what sold me', comment: 'View and data are properly split so I plugged my existing item module in without fighting the UI. Mobile drag actually works, which is rare.' },
      { author: 'Pixel_Dev', rating: 5, date: daysAgo(16), verified: true, title: 'Scales correctly everywhere', comment: 'Tested on a phone, a tablet and a 1440p monitor. No stretched text, no overflowing slots. Comments in the modules are genuinely useful.' },
      { author: 'HexaGames', rating: 5, date: daysAgo(38), verified: true, title: 'Worth it for the hotbar alone', comment: 'I had rebuilt a hotbar three times across projects. Bought this, configured slots, done. 3.0 mobile rework is a real improvement.' },
      { author: 'skyward_rb', rating: 4, date: daysAgo(70), verified: true, title: 'Good but read the guide', comment: 'Took me a while because I skipped the integration PDF. My fault — once I read it, setup was straightforward.' },
    ],
  },
  {
    slug: 'military-base-map',
    name: 'Military Base Map',
    category: 'maps',
    subcategory: 'Military',
    price: 29.99,
    short: 'A fortified base with hangars, barracks, checkpoints and a working perimeter.',
    description:
      'A military installation designed around gameplay rather than scenery. Sightlines are deliberate, cover is placed for firefights, and the perimeter has defined entry points instead of an unbroken wall.\n\nHangars, barracks, an armoury, a control tower and an underground section are all fully built inside. Terrain is sculpted and blended with the built structures so nothing floats or clips.',
    tags: ['military', 'base', 'fps', 'combat', 'terrain', 'hangar'],
    included: [
      '1 complete Roblox Studio map (.rbxl)',
      '5 interior buildings incl. hangar and armoury',
      'Sculpted terrain with blended transitions',
      'Perimeter fencing, checkpoints and watchtowers',
      'Vehicle and crate prop set',
      'Gameplay-oriented cover placement',
    ],
    perfectFor: ['FPS games', 'Roleplay games', 'Training facilities', 'Showcases'],
    specs: { fileType: '.RBXL', fileSize: '280 MB', version: '1.2' },
    rating: 4.7,
    reviewCount: 62,
    sales: 430,
    flags: { featured: true },
    createdDaysAgo: 120,
    changelog: [{ version: '1.2', days: 30, notes: ['Added underground level', 'Improved terrain blending'] }],
    reviews: [
      { author: 'TacticalTom', rating: 5, date: daysAgo(11), verified: true, title: 'Cover placement is thought through', comment: 'You can tell this was built by someone who plays shooters. Sightlines work, and the hangar interior gives a proper close-quarters space.' },
      { author: 'RBX_Kaden', rating: 4, date: daysAgo(29), verified: true, title: 'Great map, heavy on mobile', comment: 'Looks excellent and the underground section added in 1.2 is a nice bonus. Needed some detail culling for phones.' },
      { author: 'Orion_Builds', rating: 5, date: daysAgo(51), verified: true, title: 'Terrain blending is clean', comment: 'No floating rocks or clipping foundations, which is usually the first thing I have to fix in bought maps.' },
    ],
  },
  {
    slug: 'low-poly-city-assets',
    name: 'Low Poly City Assets',
    category: 'assets',
    subcategory: 'Low Poly',
    price: 14.99,
    short: '180+ low-poly urban pieces on a consistent grid, built for fast blockouts.',
    description:
      'A modular low-poly kit for building cities quickly. Everything shares one scale and snaps to a 4-stud grid, so pieces line up the first time instead of after twenty minutes of nudging.\n\nPart counts are deliberately low, which makes this the right choice for mobile-first experiences or any game where you need a lot of environment without paying for it in performance.',
    tags: ['low poly', 'modular', 'city', 'mobile', 'kit', 'blockout'],
    included: [
      '180+ modular assets (.rbxm)',
      'Consistent 4-stud grid alignment',
      'Buildings, roads, vegetation and street furniture',
      'Colour-variant materials included',
      'Organised, named folder structure',
    ],
    perfectFor: ['Mobile experiences', 'Simulators', 'Tycoons', 'Prototyping', 'Obbies'],
    specs: { fileType: '.RBXM', fileSize: '42 MB', version: '1.6' },
    rating: 4.8,
    reviewCount: 203,
    sales: 2100,
    flags: { bestSeller: true },
    createdDaysAgo: 300,
    changelog: [{ version: '1.6', days: 18, notes: ['Added 24 new props', 'Fixed pivot on corner pieces'] }],
    reviews: [
      { author: 'TinyTowns', rating: 5, date: daysAgo(7), verified: true, title: 'Grid alignment is perfect', comment: 'Snapping just works. I blocked out an entire town in an evening. For €15 this is the best value thing I have bought on here.' },
      { author: 'devon_rbx', rating: 5, date: daysAgo(22), verified: true, title: 'Runs great on mobile', comment: 'Part counts are low enough that my phone build holds 60fps with a full city loaded.' },
      { author: 'MapleGames', rating: 4, date: daysAgo(48), verified: true, title: 'Would like more variety', comment: 'The 1.6 props helped. Still would like a few more building silhouettes, but quality is consistent throughout.' },
    ],
  },
  {
    slug: 'police-vehicle-pack',
    name: 'Police Vehicle Pack',
    category: 'vehicles',
    subcategory: 'Emergency',
    price: 19.99,
    short: 'Six emergency vehicles with working lightbars, sirens and pushbars.',
    description:
      'An emergency fleet built for roleplay servers. Each vehicle ships with a configurable lightbar, four siren tones, a working spotlight and a pushbar that actually collides.\n\nThe lighting controller is a single module shared across the fleet, so changing patterns or adding a tone applies everywhere at once instead of six times.',
    tags: ['police', 'emergency', 'siren', 'roleplay', 'lightbar'],
    included: [
      '6 emergency vehicles (.rbxm)',
      'Configurable lightbar patterns',
      '4 siren tones with horn',
      'Working spotlight and pushbar',
      'Shared lighting controller module',
      'Livery template (PSD-free, editable in Studio)',
    ],
    perfectFor: ['Roleplay games', 'Emergency response games', 'City servers'],
    specs: { fileType: '.RBXM', fileSize: '58 MB', version: '1.8' },
    rating: 4.7,
    reviewCount: 88,
    sales: 760,
    createdDaysAgo: 140,
    changelog: [{ version: '1.8', days: 25, notes: ['New lightbar pattern editor', 'Fixed siren overlap bug'] }],
    reviews: [
      { author: 'Officer_Dev', rating: 5, date: daysAgo(13), verified: true, title: 'Lightbar controller is excellent', comment: 'One module drives the whole fleet. Adding a custom pattern took five minutes across all six cars.' },
      { author: 'CityRP_Admin', rating: 4, date: daysAgo(35), verified: true, title: 'Good for RP servers', comment: 'Players noticed the siren quality immediately. Liveries took some work to match our department but the template helped.' },
      { author: 'zaneworks', rating: 5, date: daysAgo(66), verified: true, title: 'Pushbars actually collide', comment: 'Small thing, but most packs fake it. These push cars properly.' },
    ],
  },
  {
    slug: 'modern-house-pack',
    name: 'Modern House Pack',
    category: 'buildings',
    subcategory: 'Residential',
    price: 24.99,
    short: 'Eight modern homes, fully furnished inside and ready to drop into a plot.',
    description:
      'Eight residential builds with finished interiors — furniture, lighting, working door frames and decorated rooms. Each house sits on a standard plot footprint, so they drop straight into a tycoon or roleplay lot without resizing.\n\nArchitecture is consistent across the set, which means a street built from these looks intentional rather than assembled from three different asset packs.',
    tags: ['house', 'residential', 'interior', 'furniture', 'tycoon', 'modern'],
    included: [
      '8 fully furnished houses (.rbxm)',
      'Consistent plot footprint across the set',
      'Interior lighting per room',
      '90+ furniture pieces, individually reusable',
      'Exterior landscaping props',
    ],
    perfectFor: ['Tycoons', 'Roleplay games', 'Showcases', 'Housing systems'],
    specs: { fileType: '.RBXM', fileSize: '134 MB', version: '2.0' },
    rating: 4.8,
    reviewCount: 117,
    sales: 980,
    flags: { bestSeller: true },
    createdDaysAgo: 175,
    changelog: [{ version: '2.0', days: 40, notes: ['Added 3 new houses', 'Refurnished interiors', 'Unified plot sizes'] }],
    reviews: [
      { author: 'HomeTycoonDev', rating: 5, date: daysAgo(10), verified: true, title: 'Plot sizes match', comment: 'Every house fits the same footprint so my housing system did not need per-model offsets. That alone saved a day.' },
      { author: 'ellie_builds', rating: 5, date: daysAgo(26), verified: true, title: 'Interiors are properly furnished', comment: 'Not three chairs and a table. Rooms feel lived in, and the furniture is reusable on its own.' },
      { author: 'RBXArchitect', rating: 4, date: daysAgo(55), verified: true, title: 'Cohesive set', comment: 'A street built from these looks deliberate. Would love a few more roof variations in a future update.' },
    ],
  },
  {
    slug: 'sci-fi-gui-kit',
    name: 'Sci-Fi GUI Kit',
    category: 'gui',
    subcategory: 'Themes',
    price: 14.99,
    short: 'A complete sci-fi interface kit: menus, HUD, shop and settings screens.',
    description:
      'A themed interface set with a consistent visual language across every screen. Main menu, in-game HUD, shop, settings, loading and notification components are all included and already wired to each other.\n\nColours are driven by a single theme module, so switching the accent from cyan to your own brand colour updates the entire kit.',
    tags: ['sci-fi', 'ui kit', 'hud', 'menu', 'shop', 'theme'],
    included: [
      'Main menu, HUD, shop and settings screens',
      'Notification and loading components',
      'Single theme module for global recolouring',
      'Animated transitions between screens',
      'Mobile-safe layout constraints',
    ],
    perfectFor: ['Sci-fi games', 'Simulators', 'Space games', 'Showcases'],
    specs: { fileType: '.RBXM', fileSize: '9 MB', version: '1.5' },
    rating: 4.6,
    reviewCount: 74,
    sales: 690,
    createdDaysAgo: 110,
    changelog: [{ version: '1.5', days: 15, notes: ['Added notification stack', 'Theme module rewrite'] }],
    reviews: [
      { author: 'NovaDev', rating: 5, date: daysAgo(8), verified: true, title: 'Theme module is the best part', comment: 'Changed one colour value and the whole kit matched my game. Saved me going through forty frames by hand.' },
      { author: 'astro_rb', rating: 4, date: daysAgo(31), verified: true, title: 'Looks sharp', comment: 'Animations are tasteful rather than over the top. A couple of screens needed padding tweaks on small phones.' },
      { author: 'QuasarStudio', rating: 5, date: daysAgo(59), verified: true, title: 'Consistent across screens', comment: 'Everything shares the same spacing and type scale, which is what makes it look professional.' },
    ],
  },
  {
    slug: 'hospital-map',
    name: 'Hospital Map',
    category: 'maps',
    subcategory: 'Institutional',
    price: 34.99,
    salePrice: 27.99,
    short: 'A three-floor hospital with wards, theatres, reception and a working lift.',
    description:
      'A detailed medical facility built across three floors. Reception, A&E, wards, operating theatres, a pharmacy and staff areas are all fully furnished, connected by stairwells and a scripted lift.\n\nSigns and wayfinding are in place, so players can actually navigate the building — a detail most institutional maps skip and then need patching after launch.',
    tags: ['hospital', 'medical', 'roleplay', 'interior', 'multi-floor'],
    included: [
      '1 complete Roblox Studio map (.rbxl)',
      '3 connected floors with stairwells',
      'Scripted lift between all levels',
      'Wards, theatres, pharmacy and reception',
      'Full medical prop set (60+ pieces)',
      'Wayfinding signage throughout',
    ],
    perfectFor: ['Roleplay games', 'Medical roleplay', 'Horror games', 'Showcases'],
    specs: { fileType: '.RBXL', fileSize: '215 MB', version: '1.3' },
    rating: 4.9,
    reviewCount: 71,
    sales: 520,
    flags: { featured: true },
    createdDaysAgo: 95,
    changelog: [{ version: '1.3', days: 20, notes: ['Lift script rewritten', 'Added pharmacy', 'Improved signage'] }],
    reviews: [
      { author: 'MedRP_Owner', rating: 5, date: daysAgo(5), verified: true, title: 'Navigable, which is rare', comment: 'Signage means new players find the wards without a guide. The lift rewrite in 1.3 is much smoother than the old one.' },
      { author: 'clara_dev', rating: 5, date: daysAgo(24), verified: true, title: 'Props alone are worth it', comment: 'Sixty-odd medical props that all match in style. I have reused them in a second project already.' },
      { author: 'GrimGames', rating: 5, date: daysAgo(47), verified: true, title: 'Works for horror too', comment: 'Dropped the lighting, added fog, and it became a completely different game. Very flexible base.' },
    ],
  },
  {
    slug: 'weapon-ui-pack',
    name: 'Weapon UI Pack',
    category: 'gui',
    subcategory: 'HUD',
    price: 9.99,
    short: 'Combat HUD components: ammo counters, crosshairs, hit markers and killfeed.',
    description:
      'The interface layer of a shooter, ready to wire in. Ammo counters, a set of six crosshairs, hit markers with damage numbers, a killfeed and a weapon wheel are all included.\n\nComponents are independent, so you can take only the killfeed if that is all you need, and each one exposes a small API instead of expecting you to edit its internals.',
    tags: ['fps', 'hud', 'crosshair', 'killfeed', 'combat', 'ui'],
    included: [
      'Ammo counter with reload states',
      '6 crosshair styles, switchable at runtime',
      'Hit markers with damage numbers',
      'Killfeed with configurable duration',
      'Weapon wheel selector',
      'Per-component API documentation',
    ],
    perfectFor: ['FPS games', 'Battle royale', 'PvP arenas', 'Combat simulators'],
    specs: { fileType: '.RBXM', fileSize: '6 MB', version: '2.2' },
    rating: 4.7,
    reviewCount: 142,
    sales: 1320,
    flags: { bestSeller: true },
    createdDaysAgo: 190,
    changelog: [{ version: '2.2', days: 28, notes: ['Added weapon wheel', 'Killfeed performance fix'] }],
    reviews: [
      { author: 'FragMaster_RB', rating: 5, date: daysAgo(12), verified: true, title: 'Components are independent', comment: 'I only needed the killfeed and hit markers. Took them, ignored the rest, no broken references. Well structured.' },
      { author: 'devsam', rating: 4, date: daysAgo(30), verified: true, title: 'Good value', comment: 'Ten euros for something I would have spent a weekend on. Crosshair switching is a nice touch.' },
      { author: 'ZenithFPS', rating: 5, date: daysAgo(63), verified: true, title: 'Clean APIs', comment: 'Each component takes a table of options instead of making you edit its source. That is how it should be done.' },
    ],
  },
  {
    slug: 'nature-asset-pack',
    name: 'Nature Asset Pack',
    category: 'assets',
    subcategory: 'Environment',
    price: 19.99,
    short: '220+ trees, rocks, plants and terrain details with seasonal variants.',
    description:
      'A natural environment kit with enough variety to build a forest that does not look copy-pasted. Trees come in four species with three size variants each, rocks in two material families, and ground cover in enough shapes to break up repetition.\n\nEvery model has a correct pivot at its base, so scattering them across sculpted terrain does not leave anything floating or buried.',
    tags: ['nature', 'trees', 'forest', 'terrain', 'environment', 'seasonal'],
    included: [
      '220+ nature assets (.rbxm)',
      '4 tree species with 3 size variants each',
      'Rocks, cliffs and boulder formations',
      'Ground cover, ferns and flowers',
      'Autumn and winter colour variants',
      'Base-aligned pivots on every model',
    ],
    perfectFor: ['Open world experiences', 'Survival games', 'Showcases', 'Obbies', 'Roleplay games'],
    specs: { fileType: '.RBXM', fileSize: '88 MB', version: '1.7' },
    rating: 4.8,
    reviewCount: 165,
    sales: 1420,
    flags: { bestSeller: true },
    createdDaysAgo: 220,
    changelog: [{ version: '1.7', days: 22, notes: ['Added winter variants', 'Fixed pivots on cliff pieces'] }],
    reviews: [
      { author: 'ForestFables', rating: 5, date: daysAgo(9), verified: true, title: 'Enough variety to avoid repetition', comment: 'Twelve tree combinations means a forest that looks natural instead of tiled. Seasonal variants were an unexpected bonus.' },
      { author: 'rowan_dev', rating: 5, date: daysAgo(25), verified: true, title: 'Pivots are correct', comment: 'Scattered 400 models across terrain with a script and not one floated. Whoever prepared these cared.' },
      { author: 'IsleStudios', rating: 4, date: daysAgo(52), verified: true, title: 'Great, watch your part count', comment: 'Beautiful assets but a dense forest adds up. Use them thoughtfully and it is fine.' },
    ],
  },
  {
    slug: 'street-props-pack',
    name: 'Street Props Pack',
    category: 'props',
    subcategory: 'Urban',
    price: 9.99,
    short: '140 urban props — benches, bins, signage, lighting and street clutter.',
    description:
      'The set dressing that turns an empty street into a place people believe in. Benches, bins, bus stops, traffic lights, road signs, bollards, hydrants, planters and the small clutter that most builds forget.\n\nAll pieces share a scale and material palette with our city ranges, so they mix cleanly with anything else in the store.',
    tags: ['props', 'street', 'urban', 'clutter', 'signage', 'detail'],
    included: [
      '140 urban props (.rbxm)',
      'Street lighting with emissive setup',
      'Full signage set including road signs',
      'Bus stops, benches and shelters',
      'Bins, bollards, hydrants and planters',
      'Shared scale and material palette',
    ],
    perfectFor: ['Roleplay games', 'City builds', 'Driving experiences', 'Showcases'],
    specs: { fileType: '.RBXM', fileSize: '34 MB', version: '1.4' },
    rating: 4.7,
    reviewCount: 189,
    sales: 1680,
    flags: { bestSeller: true },
    createdDaysAgo: 260,
    changelog: [{ version: '1.4', days: 35, notes: ['Added 20 props', 'Emissive pass on street lighting'] }],
    reviews: [
      { author: 'UrbanRBX', rating: 5, date: daysAgo(14), verified: true, title: 'Cheapest thing that improved my map most', comment: 'Ten euros of props did more for how my city feels than a much more expensive building pack.' },
      { author: 'nina_builds', rating: 5, date: daysAgo(29), verified: true, title: 'Mixes with everything', comment: 'Scale matches the other city packs here, so nothing looks out of place when combined.' },
      { author: 'GridlockDev', rating: 4, date: daysAgo(57), verified: true, title: 'Does exactly what it says', comment: 'No surprises, good quality, sensible naming. The emissive lighting pass was a nice update.' },
    ],
  },
  {
    slug: 'luxury-mansion-map',
    name: 'Luxury Mansion Map',
    category: 'maps',
    subcategory: 'Residential',
    price: 49.99,
    short: 'A high-detail estate with furnished interiors, pool, garage and grounds.',
    description:
      'Our most detailed residential build. A two-storey mansion with a fully furnished interior — entrance hall, living areas, kitchen, six bedrooms, a home cinema and a garage — set in landscaped grounds with a pool, tennis court and gated driveway.\n\nLighting is set up per room with reflection probes placed, so the interiors look expensive in screenshots without you touching a single setting.',
    tags: ['mansion', 'luxury', 'estate', 'interior', 'showcase', 'premium'],
    included: [
      '1 complete Roblox Studio map (.rbxl)',
      '2-storey mansion, fully furnished',
      'Landscaped grounds with pool and tennis court',
      'Garage with vehicle bays',
      'Per-room lighting and reflection setup',
      '200+ interior furniture and decor pieces',
    ],
    perfectFor: ['Roleplay games', 'Showcases', 'Luxury simulators', 'Housing systems'],
    specs: { fileType: '.RBXL', fileSize: '410 MB', version: '1.1' },
    rating: 4.9,
    reviewCount: 43,
    sales: 310,
    flags: { featured: true, newRelease: true },
    shots: 5,
    video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    createdDaysAgo: 24,
    changelog: [{ version: '1.1', days: 9, notes: ['Added home cinema', 'Reworked pool area lighting'] }],
    reviews: [
      { author: 'EliteRP', rating: 5, date: daysAgo(3), verified: true, title: 'Screenshots sell themselves', comment: 'Posted one interior shot in our Discord and got more sign-ups than a week of posting. The per-room lighting does a lot of work.' },
      { author: 'marc_dev', rating: 5, date: daysAgo(12), verified: true, title: 'Expensive but justified', comment: 'Fifty euros felt steep until I opened it. The furniture alone is worth a large part of the price.' },
      { author: 'VistaGames', rating: 5, date: daysAgo(18), verified: true, title: 'Grounds are not an afterthought', comment: 'Most mansion maps stop at the walls. The landscaping here is properly finished.' },
    ],
  },
  {
    slug: 'simulator-ui-pack',
    name: 'Simulator UI Pack',
    category: 'gui',
    subcategory: 'Systems',
    price: 14.99,
    short: 'Shop, rebirth, pet inventory and leaderboard screens for simulator games.',
    description:
      'The interface set simulators actually need. A shop with tabs and currency display, a rebirth screen with confirmation flow, a pet inventory with equip states, a leaderboard and a daily reward popup — all built to the same visual system.\n\nNumber formatting for large values is handled, so 1,240,000 renders as 1.24M without you writing that function again.',
    tags: ['simulator', 'shop', 'rebirth', 'pets', 'leaderboard', 'ui'],
    included: [
      'Shop UI with category tabs',
      'Rebirth screen with confirmation flow',
      'Pet inventory with equip and lock states',
      'Leaderboard component',
      'Daily reward popup with streak tracking',
      'Large-number formatting utility',
    ],
    perfectFor: ['Simulators', 'Tycoons', 'Pet games', 'Clicker games'],
    specs: { fileType: '.RBXM / .LUA', fileSize: '11 MB', version: '2.3' },
    rating: 4.8,
    reviewCount: 131,
    sales: 1190,
    flags: { bestSeller: true },
    createdDaysAgo: 150,
    changelog: [{ version: '2.3', days: 17, notes: ['Added daily reward streaks', 'Pet inventory lock states'] }],
    reviews: [
      { author: 'SimuDev', rating: 5, date: daysAgo(6), verified: true, title: 'Covers the whole genre', comment: 'Shop, rebirth, pets, leaderboard — everything a simulator needs in one consistent style. Number formatting saved me a util file.' },
      { author: 'coco_rbx', rating: 5, date: daysAgo(21), verified: true, title: 'Rebirth flow is well designed', comment: 'The confirmation step stops players rebirthing by accident, which was a genuine complaint in my game before.' },
      { author: 'PetTycoonHQ', rating: 4, date: daysAgo(45), verified: true, title: 'Solid', comment: 'Needed to restyle it to match my game but the structure made that easy.' },
    ],
  },
  {
    slug: 'industrial-building-pack',
    name: 'Industrial Building Pack',
    category: 'buildings',
    subcategory: 'Industrial',
    price: 24.99,
    short: 'Warehouses, factories and depots with interiors and loading bays.',
    description:
      'Heavy industry buildings with the interiors built out — warehouse floors, factory lines, offices, mezzanines and loading bays with working roller doors.\n\nScale is deliberately generous so vehicles can drive inside, which matters for logistics and roleplay games where the interior is part of the gameplay rather than scenery.',
    tags: ['industrial', 'warehouse', 'factory', 'logistics', 'interior'],
    included: [
      '7 industrial buildings (.rbxm)',
      'Warehouse, factory, depot and office variants',
      'Loading bays with roller doors',
      'Interior mezzanines and walkways',
      'Industrial prop set (machinery, pallets, crates)',
      'Vehicle-accessible interior clearances',
    ],
    perfectFor: ['Logistics games', 'Roleplay games', 'Tycoons', 'Driving experiences'],
    specs: { fileType: '.RBXM', fileSize: '156 MB', version: '1.5' },
    rating: 4.6,
    reviewCount: 58,
    sales: 470,
    createdDaysAgo: 130,
    changelog: [{ version: '1.5', days: 33, notes: ['Added depot variant', 'Roller door script fix'] }],
    reviews: [
      { author: 'HaulerRP', rating: 5, date: daysAgo(15), verified: true, title: 'Lorries fit inside', comment: 'Clearances are right, so our delivery gameplay works indoors. Most warehouse packs are built to the wrong scale for that.' },
      { author: 'ind_dev', rating: 4, date: daysAgo(37), verified: true, title: 'Good range', comment: 'Seven buildings is enough for a full industrial district. Roller doors had a bug that got patched quickly in 1.5.' },
      { author: 'CrateWorks', rating: 5, date: daysAgo(61), verified: true, title: 'Props are reusable', comment: 'Pallets and machinery ended up all over my map, not just in these buildings.' },
    ],
  },
  {
    slug: 'datastore-save-system',
    name: 'Datastore & Save System',
    category: 'scripts',
    subcategory: 'Backend',
    price: 14.99,
    short: 'Session-locked data saving with retries, migrations and an admin panel.',
    description:
      'A production data layer, not a tutorial script. Session locking prevents duplication across servers, retries with backoff handle Roblox datastore throttling, and a schema migration system lets you change your data shape without wiping existing players.\n\nAn in-game admin panel lets you inspect and edit a player profile live, which turns a class of bug reports into a thirty-second fix.',
    tags: ['datastore', 'saving', 'session lock', 'luau', 'backend', 'migrations'],
    included: [
      'Session-locked profile system (.lua)',
      'Automatic retry with exponential backoff',
      'Schema versioning and migration helpers',
      'In-game admin inspector panel',
      'Auto-save with configurable interval',
      'Commented source and integration guide (PDF)',
    ],
    perfectFor: ['Simulators', 'Tycoons', 'RPG games', 'Any game with progression'],
    specs: { fileType: '.LUA / .RBXM', fileSize: '4 MB', version: '3.1' },
    rating: 4.9,
    reviewCount: 97,
    sales: 830,
    flags: { featured: true },
    createdDaysAgo: 170,
    changelog: [{ version: '3.1', days: 14, notes: ['Migration helper rewrite', 'Admin panel search'] }],
    reviews: [
      { author: 'BackendBen', rating: 5, date: daysAgo(7), verified: true, title: 'Migrations are the killer feature', comment: 'I changed my data shape twice since buying and lost nothing. Writing that myself is where most people get it wrong.' },
      { author: 'ryu_scripts', rating: 5, date: daysAgo(23), verified: true, title: 'Session locking works', comment: 'Duplication exploit in my game disappeared the day I switched to this. Code is readable and commented.' },
      { author: 'TycoonLabs', rating: 5, date: daysAgo(49), verified: true, title: 'Admin panel saves support time', comment: 'Being able to inspect a live profile turned hour-long investigations into a quick look.' },
    ],
  },
  {
    slug: 'modular-build-kit',
    name: 'Modular Build Kit',
    category: 'studs',
    subcategory: 'Construction',
    price: 19.99,
    short: '300+ grid-aligned construction blocks for rapid, consistent architecture.',
    description:
      'A stud-accurate construction system. Walls, floors, roofs, stairs, windows, doors and trim, all built to a 4-stud module so anything connects to anything else without gaps.\n\nThis is the kit to reach for when you want architectural consistency across a large build and do not want to model each structure from scratch.',
    tags: ['modular', 'construction', 'kit', 'grid', 'architecture', 'blockout'],
    included: [
      '300+ modular building pieces (.rbxm)',
      'Strict 4-stud grid module',
      'Walls, floors, roofs, stairs and trim',
      'Window and door frames with matching inserts',
      '6 material presets',
      'Quick-start build guide (PDF)',
    ],
    perfectFor: ['Prototyping', 'Tycoons', 'Roleplay games', 'Showcases', 'Open world experiences'],
    specs: { fileType: '.RBXM', fileSize: '52 MB', version: '2.0' },
    rating: 4.8,
    reviewCount: 112,
    sales: 940,
    flags: { newRelease: true },
    createdDaysAgo: 38,
    changelog: [{ version: '2.0', days: 11, notes: ['Added 80 pieces', 'New material presets', 'Grid audit pass'] }],
    reviews: [
      { author: 'ModularMax', rating: 5, date: daysAgo(4), verified: true, title: 'Everything snaps', comment: 'The grid discipline is strict, which is exactly what you want. I built four structures in an evening and they all match.' },
      { author: 'blockwright', rating: 5, date: daysAgo(17), verified: true, title: 'Replaced my own kit', comment: 'I had been maintaining a personal version of this for years. This is better organised than mine was.' },
      { author: 'StudioNine', rating: 4, date: daysAgo(30), verified: true, title: 'Takes a moment to learn', comment: 'Read the build guide first. Once the module clicks it is very fast.' },
    ],
  },
  {
    slug: 'roleplay-starter-pack',
    name: 'Roleplay Starter Pack',
    category: 'packs',
    subcategory: 'Bundle',
    price: 49.99,
    salePrice: 39.99,
    short: 'City map, vehicle fleet, props and UI — a full roleplay game in one bundle.',
    description:
      'Everything needed to launch a roleplay experience, bundled at roughly half the price of buying each part separately. A city map, a civilian vehicle fleet, the emergency fleet, the street prop set and a matching interface kit — all chosen because they share scale and style.\n\nIf you are starting a roleplay game from nothing, this is the fastest credible route from empty baseplate to something players will stay in.',
    tags: ['bundle', 'roleplay', 'starter', 'city', 'vehicles', 'value'],
    included: [
      'Complete city map (.rbxl)',
      '12 civilian vehicles',
      '6 emergency vehicles with lightbars',
      '140 street props',
      'Roleplay interface kit (menus, HUD, shop)',
      'Setup and integration guide (PDF)',
    ],
    perfectFor: ['Roleplay games', 'City servers', 'Emergency response games', 'Open world hubs'],
    specs: { fileType: '.RBXL / .RBXM', fileSize: '620 MB', version: '1.2' },
    rating: 4.9,
    reviewCount: 66,
    sales: 540,
    flags: { featured: true, bestSeller: true },
    shots: 5,
    createdDaysAgo: 80,
    changelog: [{ version: '1.2', days: 16, notes: ['Updated all components to latest versions', 'Unified colour palette across bundle'] }],
    reviews: [
      { author: 'RPCityOwner', rating: 5, date: daysAgo(5), verified: true, title: 'The value is obvious', comment: 'Priced these individually before buying — the bundle is roughly half. And because they were picked to match, nothing looks mismatched.' },
      { author: 'jules_rb', rating: 5, date: daysAgo(20), verified: true, title: 'Launched in a week', comment: 'From nothing to a playable roleplay server in about a week of evenings. The guide covers how the pieces fit together.' },
      { author: 'MetroRoleplay', rating: 4, date: daysAgo(41), verified: true, title: 'Big download, worth it', comment: '620MB takes a while but everything is there. Would recommend to anyone starting an RP game.' },
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
