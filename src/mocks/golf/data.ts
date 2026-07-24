import type { Category, Destination, GolfCourse, GolfPackage, GolfReview, ItineraryDay, PackageOption } from './types';

export const CATEGORIES: Category[] = [
  { key: 'stay-play', label: 'Stay & Play' },
  { key: 'all-inclusive', label: 'All Inclusive' },
  { key: 'weekend', label: 'Weekend Golf' },
  { key: 'luxury', label: 'Luxury Golf' },
  { key: 'group', label: 'Group Trips' },
  { key: 'women', label: "Women's Golf Trips" },
  { key: 'family', label: 'Family Golf' },
  { key: 'last-minute', label: 'Last Minute' },
];

export const DESTINATIONS: Destination[] = [
  { slug: 'jeju', city: 'Jeju', country: 'South Korea', avgPackageUSD: 780, season: 'Apr – Jun · Sep – Nov', courseCount: 28 },
  { slug: 'danang', city: 'Da Nang', country: 'Vietnam', avgPackageUSD: 690, season: 'Feb – Aug', courseCount: 9 },
  { slug: 'bangkok', city: 'Bangkok', country: 'Thailand', avgPackageUSD: 640, season: 'Nov – Feb', courseCount: 34 },
  { slug: 'okinawa', city: 'Okinawa', country: 'Japan', avgPackageUSD: 820, season: 'Mar – Jun · Oct – Dec', courseCount: 12 },
  { slug: 'hokkaido', city: 'Hokkaido', country: 'Japan', avgPackageUSD: 910, season: 'Jun – Sep', courseCount: 18 },
  { slug: 'algarve', city: 'Algarve', country: 'Portugal', avgPackageUSD: 1180, season: 'Mar – May · Sep – Oct', courseCount: 42 },
];

const REVIEW_AUTHORS = [
  ['James P.', 'United Kingdom'],
  ['Minseok K.', 'South Korea'],
  ['Haruto S.', 'Japan'],
  ['David L.', 'Australia'],
  ['Sophie M.', 'France'],
  ['Wei C.', 'Singapore'],
] as const;

function makeReviews(seed: number, hotel: string, course: string): GolfReview[] {
  const pick = (i: number) => REVIEW_AUTHORS[(seed + i) % REVIEW_AUTHORS.length];
  return [
    {
      author: pick(0)[0],
      country: pick(0)[1],
      date: '2026.05.18',
      target: 'Hotel',
      score: 9.2,
      title: 'Seamless stay & play',
      body: `${hotel} handled everything — transfers, tee times and breakfast were all on time. Rooms were spacious and quiet.`,
    },
    {
      author: pick(2)[0],
      country: pick(2)[1],
      date: '2026.04.30',
      target: 'Course',
      score: 8.8,
      title: `${course} in great condition`,
      body: 'Fairways and greens were immaculate. Caddie was knowledgeable and pace of play was excellent even on a weekend.',
    },
    {
      author: pick(4)[0],
      country: pick(4)[1],
      date: '2026.03.22',
      target: 'Hotel',
      score: 8.4,
      title: 'Great value package',
      body: 'The per-person pricing was fully transparent. No hidden green fees or cart charges at check-in. Would book again.',
    },
  ];
}

function itinerary(nights: number, courses: GolfCourse[]): ItineraryDay[] {
  const days: ItineraryDay[] = [
    { day: 1, title: 'Arrival & check-in', items: [{ text: 'Private airport pickup' }, { text: 'Hotel check-in & welcome drink' }, { time: '19:00', text: 'Dinner at resort restaurant (optional)' }] },
  ];
  for (let d = 2; d <= nights; d++) {
    const c = courses[(d - 2) % courses.length];
    days.push({
      day: d,
      title: `Golf day — ${c.name}`,
      items: [
        { time: '07:00', text: 'Breakfast at hotel' },
        { time: '08:20', text: `Round-trip transfer to ${c.name}` },
        { time: '09:00', text: `18 holes · shared cart & caddie included` },
        { text: 'Return to hotel · leisure time' },
      ],
    });
  }
  days.push({
    day: nights + 1,
    title: 'Checkout & departure',
    items: [{ time: '08:00', text: 'Breakfast at hotel' }, { text: 'Checkout' }, { text: 'Airport transfer' }],
  });
  return days;
}

function options(base: number, nights: number, rounds: number): PackageOption[] {
  const mk = (n: number, r: number, transfer: boolean, mult: number): PackageOption => ({
    id: `n${n}r${r}${transfer ? 't' : ''}`,
    label: `${n} Nights + ${r} Rounds${transfer ? ' + Airport Transfer' : ''}`,
    nights: n,
    rounds: r,
    airportTransfer: transfer,
    pricePerPersonUSD: Math.round(base * mult),
    originalPerPersonUSD: Math.round(base * mult * 1.18),
  });
  return [
    mk(nights, rounds, false, 1),
    mk(nights + 1, rounds + 1, false, 1.34),
    mk(nights + 2, rounds + 1, true, 1.52),
  ];
}

const DRESS = 'Collared shirt & golf shoes required';

interface Seed {
  id: string;
  hotel: string;
  destination: string;
  country: string;
  coords: [number, number];
  hotelRating: number;
  reviewScore: number;
  reviewCount: number;
  roomType: string;
  nights: number;
  rounds: number;
  courses: { name: string; designer: string; par: number; rating: number; diff: GolfCourse['difficulty']; transfer: number; rental: boolean }[];
  transfer: number;
  original: number;
  sale: number;
  season: string;
  tags: string[];
  flags: Partial<Pick<GolfPackage, 'beginnerFriendly' | 'groupFriendly' | 'allInclusive' | 'breakfast' | 'cartIncluded' | 'caddieIncluded' | 'airportTransfer' | 'freeCancellation' | 'instantConfirmation' | 'bestSeller' | 'lastMinute'>>;
  facilities: string[];
}

const SEEDS: Seed[] = [
  {
    id: 'danang-luxury-escape', hotel: 'Ocean Dunes Resort & Spa', destination: 'Da Nang', country: 'Vietnam', coords: [16.05, 108.25],
    hotelRating: 5, reviewScore: 9.1, reviewCount: 842, roomType: 'Ocean View Deluxe', nights: 3, rounds: 2, transfer: 15,
    courses: [
      { name: 'BRG Da Nang Golf Resort', designer: 'Greg Norman', par: 72, rating: 74.1, diff: 'Championship', transfer: 15, rental: true },
      { name: 'Montgomerie Links', designer: 'Colin Montgomerie', par: 72, rating: 73.2, diff: 'Intermediate', transfer: 22, rental: true },
    ],
    original: 980, sale: 790, season: 'Feb – Aug', tags: ['luxury', 'stay-play', 'all-inclusive'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
    facilities: ['Infinity pool', 'Spa & sauna', '3 restaurants', 'Beach access', 'Fitness center', 'Kids club'],
  },
  {
    id: 'jeju-signature-stayplay', hotel: 'Hallim Bay Golf Hotel', destination: 'Jeju', country: 'South Korea', coords: [33.41, 126.26],
    hotelRating: 5, reviewScore: 9.0, reviewCount: 1204, roomType: 'Fairway Suite', nights: 2, rounds: 2, transfer: 5,
    courses: [
      { name: 'Hallim Ocean Course', designer: 'Robert Trent Jones Jr.', par: 72, rating: 73.8, diff: 'Championship', transfer: 5, rental: true },
      { name: 'Jeju Highland Links', designer: 'Jack Nicklaus', par: 71, rating: 72.6, diff: 'Intermediate', transfer: 12, rental: true },
    ],
    original: 1040, sale: 880, season: 'Apr – Jun · Sep – Nov', tags: ['luxury', 'weekend', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
    facilities: ['On-site clubhouse', 'Spa', 'Korean & Western dining', 'Indoor pool', 'Driving range'],
  },
  {
    id: 'bangkok-value-golf', hotel: 'Riverside Grand Bangkok', destination: 'Bangkok', country: 'Thailand', coords: [13.75, 100.5],
    hotelRating: 4, reviewScore: 8.6, reviewCount: 690, roomType: 'Grand Deluxe', nights: 4, rounds: 3, transfer: 40,
    courses: [
      { name: 'Alpine Golf Club', designer: 'Ronald Fream', par: 72, rating: 73.0, diff: 'Championship', transfer: 40, rental: true },
      { name: 'Thana City Country Club', designer: 'Greg Norman', par: 72, rating: 72.4, diff: 'Intermediate', transfer: 35, rental: true },
    ],
    original: 760, sale: 590, season: 'Nov – Feb', tags: ['all-inclusive', 'group', 'stay-play'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true },
    facilities: ['Rooftop pool', 'Spa', 'River-view dining', 'Golf lounge', 'Free shuttle'],
  },
  {
    id: 'okinawa-oceanfront', hotel: 'Coral Bay Okinawa Resort', destination: 'Okinawa', country: 'Japan', coords: [26.34, 127.8],
    hotelRating: 5, reviewScore: 9.3, reviewCount: 512, roomType: 'Premier Ocean Room', nights: 3, rounds: 2, transfer: 18,
    courses: [
      { name: 'Kanucha Bay Golf Course', designer: 'Yasuhiro Sasaki', par: 72, rating: 72.9, diff: 'Intermediate', transfer: 18, rental: true },
      { name: 'The Southern Links', designer: 'Desmond Muirhead', par: 72, rating: 73.5, diff: 'Championship', transfer: 25, rental: true },
    ],
    original: 1120, sale: 940, season: 'Mar – Jun · Oct – Dec', tags: ['luxury', 'family', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: false, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, groupFriendly: true },
    facilities: ['Private beach', 'Spa', 'Kids club', '4 restaurants', 'Infinity pool', 'Snorkeling'],
  },
  {
    id: 'natrang-beach-golf', hotel: 'Nha Trang Pearl Resort', destination: 'Nha Trang', country: 'Vietnam', coords: [12.24, 109.19],
    hotelRating: 4, reviewScore: 8.5, reviewCount: 438, roomType: 'Sea View Room', nights: 3, rounds: 2, transfer: 20,
    courses: [
      { name: 'Vinpearl Golf Nha Trang', designer: 'IMG Design', par: 71, rating: 72.0, diff: 'Intermediate', transfer: 20, rental: true },
      { name: 'Diamond Bay Golf', designer: 'Andy Dye', par: 72, rating: 72.8, diff: 'Championship', transfer: 30, rental: true },
    ],
    original: 700, sale: 560, season: 'Feb – Aug', tags: ['all-inclusive', 'weekend', 'family'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, lastMinute: true },
    facilities: ['Island access', 'Water park', 'Spa', 'Buffet dining', 'Pool bar'],
  },
  {
    id: 'hokkaido-highland', hotel: 'Niseko Green Highlands Hotel', destination: 'Hokkaido', country: 'Japan', coords: [42.8, 140.68],
    hotelRating: 5, reviewScore: 9.4, reviewCount: 377, roomType: 'Mountain View Suite', nights: 4, rounds: 3, transfer: 10,
    courses: [
      { name: 'Niseko Village Golf', designer: 'Arnold Palmer', par: 72, rating: 73.6, diff: 'Championship', transfer: 10, rental: true },
      { name: 'Rusutsu Highland Course', designer: 'Robert Trent Jones', par: 72, rating: 73.0, diff: 'Intermediate', transfer: 20, rental: true },
    ],
    original: 1320, sale: 1080, season: 'Jun – Sep', tags: ['luxury', 'group', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: false, airportTransfer: true, freeCancellation: true, instantConfirmation: false, groupFriendly: true, bestSeller: true },
    facilities: ['Onsen', 'Fine dining', 'Spa', 'Hiking trails', 'Wine cellar'],
  },
  {
    id: 'algarve-links-collection', hotel: 'Vale do Sol Golf Resort', destination: 'Algarve', country: 'Portugal', coords: [37.09, -8.25],
    hotelRating: 5, reviewScore: 9.2, reviewCount: 921, roomType: 'Garden Suite', nights: 5, rounds: 3, transfer: 8,
    courses: [
      { name: 'Vale do Sol Championship', designer: 'Nick Faldo', par: 72, rating: 74.4, diff: 'Championship', transfer: 8, rental: true },
      { name: 'Ocean Cliffs Links', designer: 'Arnold Palmer', par: 71, rating: 73.1, diff: 'Intermediate', transfer: 15, rental: true },
    ],
    original: 1480, sale: 1180, season: 'Mar – May · Sep – Oct', tags: ['luxury', 'group', 'all-inclusive'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: false, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
    facilities: ['Golf academy', 'Michelin dining', 'Spa & thalasso', '3 pools', 'Tennis', 'Wine tasting'],
  },
  {
    id: 'pattaya-golf-break', hotel: 'Pattaya Bayview Golf Hotel', destination: 'Pattaya', country: 'Thailand', coords: [12.93, 100.88],
    hotelRating: 4, reviewScore: 8.3, reviewCount: 605, roomType: 'Deluxe Twin', nights: 3, rounds: 3, transfer: 25,
    courses: [
      { name: 'Siam Country Club Old', designer: 'Ichisuke Izumi', par: 72, rating: 73.3, diff: 'Championship', transfer: 25, rental: true },
      { name: 'Laem Chabang International', designer: 'Jack Nicklaus', par: 72, rating: 72.7, diff: 'Intermediate', transfer: 30, rental: true },
    ],
    original: 720, sale: 540, season: 'Nov – Feb', tags: ['weekend', 'group', 'last-minute'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: false, instantConfirmation: true, groupFriendly: true, lastMinute: true },
    facilities: ['Beachfront', 'Pool', 'Golf bar', 'Spa', 'Late checkout'],
  },
  {
    id: 'taipei-city-golf', hotel: 'Taipei Skyline Golf Hotel', destination: 'Taipei', country: 'Taiwan', coords: [25.03, 121.56],
    hotelRating: 4, reviewScore: 8.7, reviewCount: 349, roomType: 'City View Deluxe', nights: 2, rounds: 2, transfer: 35,
    courses: [
      { name: 'Linkou International', designer: 'Kinya Fujita', par: 72, rating: 72.5, diff: 'Intermediate', transfer: 35, rental: true },
      { name: 'Taiwan Golf & Country Club', designer: 'C.H. Chen', par: 72, rating: 73.0, diff: 'Championship', transfer: 40, rental: true },
    ],
    original: 640, sale: 520, season: 'Oct – Apr', tags: ['weekend', 'women', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: false, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true },
    facilities: ['Rooftop bar', 'Spa', 'Night market nearby', 'Fitness center'],
  },
  {
    id: 'bali-cliffside-golf', hotel: 'Bali Cliffs Golf & Spa', destination: 'Bali', country: 'Indonesia', coords: [-8.65, 115.13],
    hotelRating: 5, reviewScore: 9.0, reviewCount: 733, roomType: 'Cliff Pool Villa', nights: 4, rounds: 2, transfer: 30,
    courses: [
      { name: 'Bali National Golf', designer: 'Nelson & Haworth', par: 72, rating: 73.4, diff: 'Intermediate', transfer: 30, rental: true },
      { name: 'New Kuta Ocean Course', designer: 'Ronald Fream', par: 72, rating: 73.9, diff: 'Championship', transfer: 20, rental: true },
    ],
    original: 1160, sale: 950, season: 'Apr – Oct', tags: ['luxury', 'women', 'family'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, groupFriendly: true },
    facilities: ['Private villa pool', 'Cliffside spa', 'Yoga deck', '2 restaurants', 'Butler service'],
  },
  {
    id: 'phuket-island-golf', hotel: 'Phuket Lagoon Golf Resort', destination: 'Phuket', country: 'Thailand', coords: [7.94, 98.34],
    hotelRating: 4, reviewScore: 8.6, reviewCount: 528, roomType: 'Lagoon Access Room', nights: 3, rounds: 2, transfer: 22,
    courses: [
      { name: 'Blue Canyon Canyon Course', designer: 'Yoshikazu Kato', par: 72, rating: 74.0, diff: 'Championship', transfer: 22, rental: true },
      { name: 'Red Mountain Golf', designer: 'Schmidt-Curley', par: 72, rating: 73.2, diff: 'Intermediate', transfer: 28, rental: true },
    ],
    original: 780, sale: 620, season: 'Nov – Apr', tags: ['all-inclusive', 'family', 'last-minute'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, lastMinute: true },
    facilities: ['Lagoon pool', 'Spa', 'Kids pool', 'Beach shuttle', 'Buffet'],
  },
  {
    id: 'busan-coastal-golf', hotel: 'Busan Marina Golf Hotel', destination: 'Busan', country: 'South Korea', coords: [35.15, 129.11],
    hotelRating: 4, reviewScore: 8.8, reviewCount: 462, roomType: 'Marina View Room', nights: 2, rounds: 2, transfer: 18,
    courses: [
      { name: 'Asiad Country Club', designer: 'Song Ho', par: 72, rating: 72.8, diff: 'Intermediate', transfer: 18, rental: true },
      { name: 'Dongrae Benest GC', designer: 'Ronald Fream', par: 71, rating: 72.2, diff: 'Beginner', transfer: 22, rental: true },
    ],
    original: 700, sale: 580, season: 'Apr – Jun · Sep – Nov', tags: ['weekend', 'women', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: false, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true },
    facilities: ['Marina view', 'Spa', 'Seafood dining', 'Sauna', 'Fitness'],
  },
];

const DEFAULT_TEE: import('./types').TeeTime[] = [
  { time: '06:40', bestValue: true },
  { time: '07:20' },
  { time: '08:10' },
  { time: '09:00', soldOut: true },
  { time: '10:30', bestValue: true },
  { time: '12:40' },
  { time: '14:10', soldOut: true },
];

function buildCourses(s: Seed): GolfCourse[] {
  return s.courses.map((c) => ({
    name: c.name,
    designer: c.designer,
    holes: 18,
    par: c.par,
    courseRating: c.rating,
    difficulty: c.diff,
    transferMin: c.transfer,
    dressCode: DRESS,
    rentalClubs: c.rental,
  }));
}

export const PACKAGES: GolfPackage[] = SEEDS.map((s, idx) => {
  const courses = buildCourses(s);
  const flags = s.flags;
  const inclusions = [
    `${s.nights} nights at ${s.hotel}`,
    'Daily breakfast',
    `${s.rounds} × 18-hole rounds (green fee)`,
    ...(flags.caddieIncluded ? ['Caddie fee'] : []),
    'Shared golf cart',
    ...(flags.airportTransfer ? ['Airport transfer (round trip)'] : []),
    'Golf course transfer',
    ...(flags.allInclusive ? ['All meals & selected drinks'] : []),
  ];
  const exclusions = [
    'International flights',
    'Travel insurance',
    ...(flags.caddieIncluded ? [] : ['Caddie fee (payable locally)']),
    'Personal expenses & tips',
    'Club rental (available on request)',
  ];
  return {
    id: s.id,
    hotel: s.hotel,
    destination: s.destination,
    country: s.country,
    coordinates: { lat: s.coords[0], lng: s.coords[1] },
    hotelRating: s.hotelRating,
    reviewScore: s.reviewScore,
    reviewCount: s.reviewCount,
    reviewBreakdown: {
      hotel: s.reviewScore,
      courseCondition: Math.min(10, s.reviewScore + 0.2),
      paceOfPlay: s.reviewScore - 0.3,
      transportation: s.reviewScore - 0.1,
      value: s.reviewScore - 0.4,
      service: s.reviewScore + 0.1,
    },
    roomType: s.roomType,
    nights: s.nights,
    rounds: s.rounds,
    golfCourses: courses,
    teeTimes: DEFAULT_TEE,
    inclusions,
    exclusions,
    transferTimeMin: s.transfer,
    originalPriceUSD: s.original,
    salePriceUSD: s.sale,
    cancellationPolicy: flags.freeCancellation
      ? 'Free cancellation up to 14 days before check-in. 50% refund up to 7 days.'
      : 'Non-refundable. Date change allowed once, subject to availability.',
    instantConfirmation: Boolean(flags.instantConfirmation),
    recommendedSeason: s.season,
    tags: s.tags,
    beginnerFriendly: Boolean(flags.beginnerFriendly),
    groupFriendly: Boolean(flags.groupFriendly),
    allInclusive: Boolean(flags.allInclusive),
    breakfast: Boolean(flags.breakfast),
    cartIncluded: Boolean(flags.cartIncluded),
    caddieIncluded: Boolean(flags.caddieIncluded),
    airportTransfer: Boolean(flags.airportTransfer),
    freeCancellation: Boolean(flags.freeCancellation),
    images: [s.id, `${s.id}-2`, `${s.id}-3`, `${s.id}-4`, `${s.id}-5`],
    options: options(s.sale, s.nights, s.rounds),
    itinerary: itinerary(s.nights, courses),
    hotelFacilities: s.facilities,
    reviews: makeReviews(idx, s.hotel, courses[0].name),
    bestSeller: flags.bestSeller,
    lastMinute: flags.lastMinute,
  };
});

export function getPackage(id: string): GolfPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function discountPct(p: GolfPackage): number {
  return Math.round(((p.originalPriceUSD - p.salePriceUSD) / p.originalPriceUSD) * 100);
}
