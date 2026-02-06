import os
import re

def replace_korean(text):
    # Mapping some common terms
    mapping = {
        "회장님": "Chairman",
        "안녕하세요": "Hello",
        "미팅": "Meeting",
        "매칭": "Matching",
        "프라이빗": "Private",
        "노블레스": "Noblesse",
        "검증": "Verified",
        "상위 1%": "Top 1%",
        "인연": "Encounter",
        "대한민국": "Korea",
        "고품격": "Premium",
        "서비스": "Service",
        "방금 전": "Just now",
        "분 전": "mins ago",
        "시간 전": "hours ago",
        "서울": "Seoul",
        "강남구": "Gangnam",
        "용산구": "Yongsan",
        "서초구": "Seocho",
        "마포구": "Mapo",
        "송파구": "Songpa",
        "성동구": "Seongdong",
        "경기": "Gyeonggi",
        "성남시": "Seongnam",
        "온라인": "Online",
        "시작하기": "Get Started",
        "가입 신청하기": "Apply Now",
        "메시지": "Message",
        "프로필": "Profile",
        "관리": "Management",
        "씨앗": "Seed",
        "심기": "Planting",
        "수확": "Harvest",
        "골드": "Gold",
        "플레이": "Play",
        "운세": "Fortune",
        "가챠": "Gacha",
        "랭킹": "Ranking",
        "등록": "Register",
        "취소": "Cancel",
        "광고": "Ad",
        "충전": "Refill",
        "폭탄": "Bomb",
        "샷건": "Shotgun",
        "보스": "Boss",
        "레벨": "Level",
        "다음": "Next",
        "이전": "Prev",
        "뒤로가기": "Back",
        "홈": "Home",
        "이동": "Move",
        "발사": "Fire",
        "격추": "Destroyed",
        "최종 점수": "Final Score",
        "다시 도전하기": "Try Again",
        "메뉴로 나가기": "Exit to Menu",
        "전시회": "Exhibition",
        "카페": "Cafe",
        "독서": "Reading",
        "테니스": "Tennis",
        "러닝": "Running",
        "필라테스": "Pilates",
        "와인": "Wine",
        "골프": "Golf",
        "재즈": "Jazz",
        "운동": "Workout",
        "음악": "Music",
        "패션": "Fashion",
        "맛집": "Gourmet",
        "여행": "Travel",
        "사진": "Photo",
        "인테리어": "Interior",
        "베이킹": "Baking",
        "고양이": "Cat",
        "해외여행": "Global Travel",
        "언어공부": "Language",
        "수영": "Swimming",
        "웨이트": "Weight",
        "서핑": "Surfing",
        "요리": "Cooking",
        "명품": "Luxury",
        "호캉스": "Staycation",
        "파인다이닝": "Fine Dining",
        "큐레이터": "Curator",
        "강사": "Instructor",
        "대표": "CEO",
        "변호사": "Lawyer",
        "디자이너": "Designer",
        "기획자": "Planner",
        "승무원": "Attendant",
        "아트 디렉터": "Art Director",
        "브랜드 디렉터": "Brand Director",
        "소속": "Affiliation",
        "석사": "Master",
        "전공": "Major"
    }
    
    for k, v in mapping.items():
        text = text.replace(k, v)
    
    # Generic replacement for remaining Korean
    text = re.sub(r'[가-힣]+', 'EliteData', text)
    return text

src_path = "GoldRush/dating-site/src"
for root, dirs, files in os.walk(src_path):
    for file in files:
        if file.endswith((".tsx", ".ts", ".js", ".mjs")):
            full_path = os.path.join(root, file)
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = replace_korean(content)
            
            if content != new_content:
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed: {full_path}")
