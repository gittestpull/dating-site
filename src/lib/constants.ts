export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  image: string;
  bio: string;
  tags: string[];
  location: string;
  occupation: string;
  height?: number;
  isVerified?: boolean;
  lastLogin?: string;
  prestige?: string;
  education?: string;
  matchScore?: number;
  assets?: number;
}

export const MOCK_PROFILES: Profile[] = [
  {
    id: "1",
    name: "민서",
    age: 24,
    gender: "female",
    image: "/profiles/KR_Woman_20s_1_00004_.png",
    bio: "예술과 커피를 사랑하는 큐레이터입니다. 함께 전시회를 보러 갈 품격 있는 분을 찾아요.",
    tags: ["전시회", "카페", "독서"],
    location: "서울 강남구",
    occupation: "큐레이터",
    height: 165,
    isVerified: true,
    lastLogin: "방금 전",
    prestige: "국내 명문대 석사",
    education: "예술 경영 전공"
  },
  {
    id: "2",
    name: "지현",
    age: 27,
    gender: "female",
    image: "/profiles/KR_Woman_20s_2_00004_.png",
    bio: "건강한 라이프스타일을 지향합니다. 주말마다 테니스와 러닝을 즐겨요.",
    tags: ["테니스", "러닝", "필라테스"],
    location: "서울 용산구",
    occupation: "필라테스 강사",
    height: 168,
    isVerified: true,
    lastLogin: "15분 전",
    prestige: "한남동 P 스튜디오 운영",
    education: "체육학 전공"
  },
  {
    id: "3",
    name: "은정",
    age: 31,
    gender: "female",
    image: "/profiles/KR_Woman_30s_1_00001_.png",
    bio: "지적인 대화가 잘 통하는 분이 이상형입니다. 와인과 재즈를 즐기며 여유로운 저녁을 보내는 걸 좋아해요.",
    tags: ["와인", "골프", "재즈"],
    location: "서울 서초구",
    occupation: "변호사",
    height: 163,
    isVerified: true,
    lastLogin: "3시간 전",
    prestige: "대형 로펌 소속",
    education: "서울대 법대 졸업"
  },
  {
    id: "4",
    name: "성진",
    age: 28,
    gender: "male",
    image: "/profiles/Male_Model_1_00001_.png",
    bio: "새로운 기술과 트렌드에 관심이 많습니다. 함께 성장할 수 있는 파트너를 찾습니다.",
    tags: ["운동", "음악", "패션"],
    location: "서울 강남구",
    occupation: "IT 스타트업 대표",
    height: 183,
    isVerified: true,
    lastLogin: "접속 중",
    prestige: "포브스 30세 이하 리더 선정",
    education: "스탠퍼드 CS 졸업"
  },
  {
    id: "5",
    name: "유진",
    age: 25,
    gender: "female",
    image: "/profiles/KR_Woman_20s_5_00002_.png",
    bio: "여행하며 사진 찍는 것을 좋아합니다. 세상의 아름다운 곳들을 함께 경험하고 싶어요.",
    tags: ["맛집", "여행", "사진"],
    location: "서울 마포구",
    occupation: "UX 디자이너",
    height: 160,
    isVerified: true,
    lastLogin: "1시간 전",
    prestige: "글로벌 빅테크 기업 재직",
    education: "파슨스 디자인 스쿨"
  },
  {
    id: "6",
    name: "혜린",
    age: 29,
    gender: "female",
    image: "/profiles/KR_Woman_30s_3_00001_.png",
    bio: "홈베이킹과 인테리어에 관심이 많습니다. 소소한 일상에서 행복을 찾아요.",
    tags: ["인테리어", "베이킹", "반려묘"],
    location: "경기 성남시",
    occupation: "IT 서비스 기획자",
    height: 166,
    isVerified: true,
    lastLogin: "방금 전",
    prestige: "판교 테크노밸리 핵심 인력",
    education: "심리학 전공"
  },
  {
    id: "7",
    name: "수민",
    age: 26,
    gender: "female",
    image: "/profiles/KR_Woman_20s_4_00002_.png",
    bio: "하늘 위에서 세상을 보는 승무원입니다. 쉬는 날에는 수영과 외국어 공부를 즐겨요.",
    tags: ["해외여행", "외국어", "수영"],
    location: "서울 송파구",
    occupation: "항공 승무원",
    height: 170,
    isVerified: true,
    lastLogin: "45분 전",
    prestige: "국적 항공사 1등석 담당",
    education: "어문학 전공"
  },
  {
    id: "8",
    name: "가윤",
    age: 28,
    gender: "female",
    image: "/profiles/KR_Woman_30s_5_00001_.png",
    bio: "서핑과 요리를 좋아하는 활동적인 성격입니다. 에너제틱한 삶을 함께할 분 환영합니다.",
    tags: ["웨이트", "서핑", "요리"],
    location: "서울 성동구",
    occupation: "아트 디렉터",
    height: 167,
    isVerified: true,
    lastLogin: "접속 중",
    prestige: "광고 대상 수상 경력",
    education: "시각 디자인 전공"
  },
  {
    id: "9",
    name: "소율",
    age: 30,
    gender: "female",
    image: "/profiles/Luxury_Fashion_1_00001_.png",
    bio: "고품격 라이프스타일을 지향합니다. 파인 다이닝과 호텔 스테이케이션을 즐겨요.",
    tags: ["명품", "호캉스", "파인다이닝"],
    location: "서울 강남구",
    occupation: "브랜드 디렉터",
    height: 172,
    isVerified: true,
    lastLogin: "2시간 전",
    prestige: "LVMH 그룹 출신",
    education: "해외 명문 MBA"
  }
];
