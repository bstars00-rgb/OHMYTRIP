export interface GolfCourse {
  name: string;
  designer: string;
  holes: number;
  par: number;
  courseRating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Championship';
  transferMin: number; // 호텔→골프장 이동(분)
  dressCode: string;
  rentalClubs: boolean;
}

export interface TeeTime {
  time: string; // "06:40"
  bestValue?: boolean;
  soldOut?: boolean;
}

export interface PackageOption {
  id: string;
  label: string; // "3 Nights + 2 Rounds"
  nights: number;
  rounds: number;
  airportTransfer: boolean;
  pricePerPersonUSD: number;
  originalPerPersonUSD: number;
}

export interface ReviewBreakdown {
  hotel: number;
  courseCondition: number;
  paceOfPlay: number;
  transportation: number;
  value: number;
  service: number;
}

export interface GolfReview {
  author: string;
  country: string;
  date: string;
  target: 'Hotel' | 'Course';
  score: number;
  title: string;
  body: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  items: { time?: string; text: string }[];
}

export interface GolfPackage {
  id: string;
  hotel: string;
  destination: string; // "Da Nang"
  country: string;
  coordinates: { lat: number; lng: number };
  hotelRating: number; // 1~5 (성급)
  reviewScore: number; // 0~10
  reviewCount: number;
  reviewBreakdown: ReviewBreakdown;
  roomType: string;
  nights: number;
  rounds: number;
  golfCourses: GolfCourse[];
  teeTimes: TeeTime[];
  inclusions: string[];
  exclusions: string[];
  transferTimeMin: number; // 대표 이동시간
  originalPriceUSD: number; // 1인당 정가
  salePriceUSD: number; // 1인당 판매가
  cancellationPolicy: string;
  instantConfirmation: boolean;
  recommendedSeason: string;
  tags: string[]; // category keys
  beginnerFriendly: boolean;
  groupFriendly: boolean;
  allInclusive: boolean;
  breakfast: boolean;
  cartIncluded: boolean;
  caddieIncluded: boolean;
  airportTransfer: boolean;
  freeCancellation: boolean;
  images: string[]; // scene seeds
  options: PackageOption[];
  itinerary: ItineraryDay[];
  hotelFacilities: string[];
  reviews: GolfReview[];
  bestSeller?: boolean;
  lastMinute?: boolean;
}

export interface Destination {
  slug: string;
  city: string;
  country: string;
  avgPackageUSD: number;
  season: string;
  courseCount: number;
}

export interface Category {
  key: string;
  label: string;
}
