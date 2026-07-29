/**
 * 골프 여행 이야기 — 블로그(에디토리얼) 아티클 목데이터.
 * 각 글 하단에서 relatedDestination / relatedTags 로 실제 패키지를 연결해
 * 콘텐츠 → 예약으로 이어지게 한다.
 */
export interface StorySection {
  heading?: string;
  paragraphs: string[];
  imageSeed?: string;
  imageKind?: 'course' | 'green' | 'resort';
  caption?: string;
}

export interface Story {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  heroSeed: string;
  author: string;
  authorRole: string;
  date: string;
  readMin: number;
  tags: string[]; // 아티클 태그(표시용)
  sections: StorySection[];
  relatedDestination?: string; // 관련 패키지 필터(도시)
  relatedTags?: string[]; // 관련 패키지 필터(카테고리 key)
}

export const STORIES: Story[] = [
  {
    slug: 'vietnam-best-golf-resorts',
    title: '베트남 베스트 골프 리조트 5선',
    category: '여행지 가이드',
    excerpt: '다낭·나트랑을 중심으로, 그린피부터 리조트 퀄리티까지 만족스러운 베트남 골프 여행지를 정리했습니다.',
    heroSeed: 'story-vietnam-hero',
    author: 'Yuna Park',
    authorRole: '골프 여행 에디터',
    date: '2026.05.18',
    readMin: 6,
    tags: ['베트남', '다낭', '가성비'],
    sections: [
      {
        paragraphs: [
          '베트남은 지난 몇 년 사이 아시아 골프 여행의 중심지로 떠올랐습니다. 연중 온화한 날씨, 세계적인 코스 디자이너의 손을 거친 챔피언십 코스, 그리고 합리적인 그린피가 만나 “가성비 골프 여행”의 대명사가 되었죠.',
          '이 글에서는 다낭과 나트랑을 중심으로, 숙박부터 라운드까지 한 번에 즐기기 좋은 리조트를 골라 소개합니다. 모두 그린피·카트·이동이 포함된 패키지로 예약할 수 있어 현장 추가 결제 걱정이 없습니다.',
        ],
      },
      {
        heading: '1. 다낭 — 해변과 챔피언십 코스의 만남',
        imageSeed: 'story-vietnam-danang',
        imageKind: 'course',
        caption: '바다를 낀 다낭의 링크스 코스',
        paragraphs: [
          '다낭은 그렉 노먼과 콜린 몽고메리가 설계한 코스가 나란히 있는, 골퍼라면 한 번쯤 꿈꾸는 여행지입니다. 오전 라운드 후 오후엔 미케 비치에서 휴식을 즐기는 일정이 특히 인기예요.',
          '초보자라면 페어웨이가 넓은 몽고메리 링크스를, 도전을 원한다면 바닷바람이 변수인 BRG 다낭을 추천합니다.',
        ],
      },
      {
        heading: '2. 나트랑 — 아일랜드 리조트에서의 스테이앤플레이',
        imageSeed: 'story-vietnam-natrang',
        imageKind: 'green',
        paragraphs: [
          '나트랑은 섬 전체가 리조트로 조성된 곳이 많아, 가족·단체 여행에 특히 잘 맞습니다. 라운드 후 워터파크와 스파를 함께 즐길 수 있어 비골퍼 동반 만족도가 높습니다.',
          '올인클루시브 패키지를 고르면 식사와 음료까지 포함되어 예산 관리가 쉽습니다.',
        ],
      },
      {
        heading: '언제 가면 좋을까',
        paragraphs: [
          '다낭·나트랑 모두 2월부터 8월이 골프 시즌으로 꼽힙니다. 우기(9~11월)에는 오후 스콜이 잦으니, 오전 티타임을 확보하는 것이 좋습니다.',
          '항공권은 성수기 2~3개월 전 예약이 유리하며, 패키지는 티타임이 함께 확정되므로 일정이 정해지면 서둘러 예약하는 편이 좋습니다.',
        ],
      },
    ],
    relatedDestination: 'Da Nang',
    relatedTags: ['stay-play', 'all-inclusive'],
  },
  {
    slug: 'weekend-golf-from-seoul',
    title: '서울 출발, 1박 2일 주말 골프 여행',
    category: '짧은 일탈',
    excerpt: '금요일 밤 출발해 일요일 저녁 복귀. 제주·부산으로 떠나는 알찬 주말 골프 코스를 제안합니다.',
    heroSeed: 'story-weekend-hero',
    author: 'Minseok Kim',
    authorRole: '트래블 플래너',
    date: '2026.05.02',
    readMin: 4,
    tags: ['주말', '제주', '부산'],
    sections: [
      {
        paragraphs: [
          '연차를 쓰지 않고도 즐길 수 있는 주말 골프 여행. 국내선으로 한 시간이면 닿는 제주와 부산은 바쁜 직장인에게 딱 맞는 목적지입니다.',
          '핵심은 “이동은 짧게, 라운드는 알차게”. 숙소를 골프장 인근으로 잡으면 이동 시간을 아껴 두 번의 라운드도 여유롭게 소화할 수 있습니다.',
        ],
      },
      {
        heading: '제주 — 바다를 보며 치는 두 라운드',
        imageSeed: 'story-weekend-jeju',
        imageKind: 'course',
        paragraphs: [
          '제주는 오션 코스와 하이랜드 코스의 분위기가 확연히 달라, 1박 2일 동안 서로 다른 두 라운드를 즐기기 좋습니다. 클럽하우스에서 골프장까지 5~12분 거리라 아침 라운드가 부담스럽지 않아요.',
          '봄(4~6월)과 가을(9~11월)이 가장 쾌적하며, 렌터카 없이도 리조트 셔틀로 이동할 수 있는 패키지가 많습니다.',
        ],
      },
      {
        heading: '부산 — 해운대와 라운드를 한 번에',
        imageSeed: 'story-weekend-busan',
        imageKind: 'green',
        paragraphs: [
          '부산은 라운드 후 해운대·광안리에서의 저녁이 매력입니다. 초보자 친화적인 코스가 많아 입문자 동반 라운드에도 좋습니다.',
          '주말 티타임은 빠르게 마감되니, 금요일 저녁 도착 후 토·일 오전 티타임을 미리 확정해 두는 것을 추천합니다.',
        ],
      },
    ],
    relatedTags: ['weekend'],
  },
  {
    slug: 'beginner-friendly-golf',
    title: '골프 입문자에게 딱 맞는 여행지',
    category: '입문자 추천',
    excerpt: '넓은 페어웨이, 친절한 캐디, 여유로운 진행. 부담 없이 첫 골프 여행을 즐길 수 있는 곳을 모았습니다.',
    heroSeed: 'story-beginner-hero',
    author: 'Sophie Martin',
    authorRole: '골프 코치 · 여행 칼럼니스트',
    date: '2026.04.21',
    readMin: 5,
    tags: ['입문', '초보', '가족'],
    sections: [
      {
        paragraphs: [
          '첫 골프 여행은 “잘 치는 것”보다 “즐겁게 마치는 것”이 중요합니다. 코스 난이도, 진행 속도, 캐디 서비스가 초보자의 경험을 좌우하죠.',
          '이 글에서는 넓은 페어웨이와 여유로운 진행으로 입문자에게 특히 편안한 여행지를 소개합니다.',
        ],
      },
      {
        heading: '왜 “초보자 친화” 코스가 중요할까',
        imageSeed: 'story-beginner-course',
        imageKind: 'green',
        paragraphs: [
          '초보자에게 좁은 페어웨이와 깊은 벙커는 스코어보다 “찾으러 다니는 시간”을 늘립니다. 반대로 페어웨이가 넓고 해저드가 적은 코스는 공을 잃지 않고 리듬 있게 플레이할 수 있어요.',
          '캐디가 클럽 선택과 라인을 도와주는 패키지라면, 룰과 매너에 익숙지 않은 입문자도 훨씬 편안합니다.',
        ],
      },
      {
        heading: '입문자를 위한 체크리스트',
        paragraphs: [
          '① 카트·캐디 포함 여부 — 이동과 진행이 수월해집니다.',
          '② 클럽 렌탈 가능 여부 — 장비 없이 가볍게 떠날 수 있어요.',
          '③ 무료 취소 — 날씨나 컨디션에 따라 유연하게 대응할 수 있습니다.',
        ],
      },
    ],
    relatedTags: ['family', 'weekend'],
  },
  {
    slug: 'japan-luxury-golf',
    title: '일본 럭셔리 골프 리조트에서의 하룻밤',
    category: '프리미엄 스테이',
    excerpt: '오키나와의 오션뷰, 홋카이도의 하이랜드. 라운드 후 온천과 파인다이닝까지 이어지는 프리미엄 여정.',
    heroSeed: 'story-japan-hero',
    author: 'Haruto Sato',
    authorRole: '럭셔리 트래블 에디터',
    date: '2026.03.30',
    readMin: 7,
    tags: ['일본', '럭셔리', '온천'],
    sections: [
      {
        paragraphs: [
          '일본의 골프 리조트는 “라운드”만이 아니라 “스테이” 전체를 설계합니다. 정갈하게 관리된 코스, 라운드 후의 온천, 지역 식재료로 차린 파인다이닝까지 — 하루가 하나의 경험으로 이어집니다.',
          '오키나와와 홋카이도는 그 대표적인 무대입니다.',
        ],
      },
      {
        heading: '오키나와 — 바다를 품은 리조트 코스',
        imageSeed: 'story-japan-okinawa',
        imageKind: 'course',
        caption: '오키나와의 오션프론트 코스',
        paragraphs: [
          '오키나와는 3월부터 6월, 10월부터 12월이 가장 쾌적합니다. 오션뷰 객실에서 아침을 맞고, 바다를 낀 코스에서 라운드를 즐긴 뒤 스파로 마무리하는 일정이 인기예요.',
          '가족 여행이라면 키즈클럽과 프라이빗 비치를 갖춘 리조트를 고르면 비골퍼 동반 만족도가 높습니다.',
        ],
      },
      {
        heading: '홋카이도 — 여름 하이랜드의 청량함',
        imageSeed: 'story-japan-hokkaido',
        imageKind: 'green',
        paragraphs: [
          '홋카이도는 6월부터 9월이 골프 시즌입니다. 서늘한 고원 기후 속에서 아놀드 파머·로버트 트렌트 존스가 설계한 코스를 즐길 수 있어요.',
          '라운드 후 온천과 와인 셀러, 파인다이닝으로 이어지는 저녁은 홋카이도 럭셔리 스테이의 백미입니다.',
        ],
      },
    ],
    relatedDestination: 'Okinawa',
    relatedTags: ['luxury'],
  },
];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}
