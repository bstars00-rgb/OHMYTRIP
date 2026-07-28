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
  summary?: string;
  meals?: string[]; // 조식/중식/석식
  items: { time?: string; text: string; tag?: string }[];
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

export interface ScorecardHole {
  hole: number;
  par: number;
  yards: number;
  si: number; // 스트로크 인덱스(핸디캡) 1~18
}

export interface CourseFee {
  label: string;
  amount: string; // 현지 통화 표기 문자열
  note?: string;
}

export interface SignatureHole {
  hole: number;
  par: number;
  yards: number;
  note: string;
}

/** 골프장 상세페이지용 확장 모델 (monkeytravel 골프텔 상세 참조) */
export interface CourseDetail {
  slug: string;
  name: string;
  destination: string;
  country: string;
  designer: string;
  holes: number;
  par: number;
  yardage: number; // 총 전장(야드)
  courseRating: number;
  slopeRating: number;
  difficulty: GolfCourse['difficulty'];
  established: number;
  greenGrass: string;
  fairwayGrass: string;
  greenSpeed: string;
  drivingRangeHours: string;
  restaurantHours: string;
  distanceFromHotel: string;
  transferMin: number;
  dressCode: string;
  rentalClubs: boolean;
  localFees: CourseFee[];
  playRules: string[];
  teamConfig: { slot: string; max: number }[];
  facilities: string[];
  signatureHoles: SignatureHole[];
  description: string;
  scorecard: ScorecardHole[];
  images: string[];
  packageIds: string[];
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
