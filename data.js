// 문자(히라가나·가타카나), 품사별 어휘(명사·い형용사·な형용사·동사), 행별 예문, v2 로드맵 데이터
const JP_DATA = {
  items: [
    // 1. 히라가나 (청음 46자)
    { id: 'h_a', category: 'hiragana', row: 'あ행', jp: 'あ', romaji: 'a', meaning: '아', mnemonic: '십자가(+) 아래 물고기 한 마리가 헤엄치는 모양' },
    { id: 'h_i', category: 'hiragana', row: 'あ행', jp: 'い', romaji: 'i', meaning: '이', mnemonic: '나란히 서 있는 두 사람(이)' },
    { id: 'h_u', category: 'hiragana', row: 'あ행', jp: 'う', romaji: 'u', meaning: '우', mnemonic: '우산을 쓰고 허리를 숙인 모습' },
    { id: 'h_e', category: 'hiragana', row: 'あ행', jp: 'え', romaji: 'e', meaning: '에', mnemonic: '에너지 넘치게 달리는 사람 모양' },
    { id: 'h_o', category: 'hiragana', row: 'あ행', jp: 'お', romaji: 'o', meaning: '오', mnemonic: '골프공을 치고 "오!" 외치는 모습' },

    { id: 'h_ka', category: 'hiragana', row: 'か행', jp: 'か', romaji: 'ka', meaning: '카', mnemonic: '칼(か)로 물건을 자르는 모양' },
    { id: 'h_ki', category: 'hiragana', row: 'か행', jp: 'き', romaji: 'ki', meaning: '키', mnemonic: '열쇠(Key) 모양을 닮은 글자' },
    { id: 'h_ku', category: 'hiragana', row: 'か행', jp: 'く', romaji: 'ku', meaning: '쿠', mnemonic: '부리(く)를 벌린 새 모양' },
    { id: 'h_ke', category: 'hiragana', row: 'か행', jp: 'け', romaji: 'ke', meaning: '케', mnemonic: '케이크(け) 조각을 자른 옆모습' },
    { id: 'h_ko', category: 'hiragana', row: 'か행', jp: 'こ', romaji: 'ko', meaning: '코', mnemonic: '동전(Coin) 두 개가 위아래로 놓인 모습' },

    { id: 'h_sa', category: 'hiragana', row: 'さ행', jp: 'さ', romaji: 'sa', meaning: '사', mnemonic: '사람이 웃으며 손 흔드는 얼굴' },
    { id: 'h_shi', category: 'hiragana', row: 'さ행', jp: 'し', romaji: 'shi', meaning: '시', mnemonic: '낚싯바늘(し) 모양' },
    { id: 'h_su', category: 'hiragana', row: 'さ행', jp: 'す', romaji: 'su', meaning: '수', mnemonic: '줄에 매달려 빙글 도는 수박' },
    { id: 'h_se', category: 'hiragana', row: 'さ행', jp: 'せ', romaji: 'se', meaning: '세', mnemonic: '세상 세(世) 자에서 온 글자' },
    { id: 'h_so', category: 'hiragana', row: 'さ행', jp: 'そ', romaji: 'so', meaning: '소', mnemonic: '지그재그로 바느질(Sew)한 모양' },

    { id: 'h_ta', category: 'hiragana', row: 'た행', jp: 'た', romaji: 'ta', meaning: '타', mnemonic: '알파벳 t와 a가 나란히 있는 모양' },
    { id: 'h_chi', category: 'hiragana', row: 'た행', jp: 'ち', romaji: 'chi', meaning: '치', mnemonic: '숫자 5와 닮은 치어리더' },
    { id: 'h_tsu', category: 'hiragana', row: 'た행', jp: 'つ', romaji: 'tsu', meaning: '츠', mnemonic: '거대한 쓰나미 파도가 밀려오는 모습' },
    { id: 'h_te', category: 'hiragana', row: 'た행', jp: 'て', romaji: 'te', meaning: '테', mnemonic: '손바닥(て)을 펼친 옆모습' },
    { id: 'h_to', category: 'hiragana', row: 'た행', jp: 'と', romaji: 'to', meaning: '토', mnemonic: '발가락에 가시(と)가 박힌 모습' },

    { id: 'h_na', category: 'hiragana', row: 'な행', jp: 'な', romaji: 'na', meaning: '나', mnemonic: '매듭(Knot)을 묶는 모양' },
    { id: 'h_ni', category: 'hiragana', row: 'な행', jp: 'に', romaji: 'ni', meaning: '니', mnemonic: '무릎(Knee)을 구부린 옆모습' },
    { id: 'h_nu', category: 'hiragana', row: 'な행', jp: 'ぬ', romaji: 'nu', meaning: '누', mnemonic: '젓가락으로 국수(Noodle)를 돌돌 만 모양' },
    { id: 'h_ne', category: 'hiragana', row: 'な행', jp: 'ね', romaji: 'ne', meaning: '네', mnemonic: '고양이(ねこ)가 꼬리를 말고 앉은 모습' },
    { id: 'h_no', category: 'hiragana', row: 'な행', jp: 'の', romaji: 'no', meaning: '노', mnemonic: '금지(NO) 표지판의 둥근 모양' },

    { id: 'h_ha', category: 'hiragana', row: 'は행', jp: 'は', romaji: 'ha', meaning: '하', mnemonic: '하하 웃는 사람 옆모습' },
    { id: 'h_hi', category: 'hiragana', row: 'は행', jp: 'ひ', romaji: 'hi', meaning: '히', mnemonic: '히죽 웃는 입 모양' },
    { id: 'h_fu', category: 'hiragana', row: 'は행', jp: 'ふ', romaji: 'fu', meaning: '후', mnemonic: '후지산(ふじさん) 봉우리 모양' },
    { id: 'h_he', category: 'hiragana', row: 'は행', jp: 'へ', romaji: 'he', meaning: '헤', mnemonic: '산 정상으로 올라갔다 내려가는 능선' },
    { id: 'h_ho', category: 'hiragana', row: 'は행', jp: 'ほ', romaji: 'ho', meaning: '호', mnemonic: '호수에 돛단배가 떠 있는 모습' },

    { id: 'h_ma', category: 'hiragana', row: 'ま행', jp: 'ま', romaji: 'ma', meaning: '마', mnemonic: '마스크 끈을 묶은 모양' },
    { id: 'h_mi', category: 'hiragana', row: 'ま행', jp: 'み', romaji: 'mi', meaning: '미', mnemonic: '숫자 21을 멋지게 흘려 쓴 모양' },
    { id: 'h_mu', category: 'hiragana', row: 'ま행', jp: 'む', romaji: 'mu', meaning: '무', mnemonic: '소(む)가 풀을 뜯는 모양' },
    { id: 'h_me', category: 'hiragana', row: 'ま행', jp: 'め', romaji: 'me', meaning: '메', mnemonic: '국수(め) 가락이 엉킨 모양' },
    { id: 'h_mo', category: 'hiragana', row: 'ま행', jp: 'も', romaji: 'mo', meaning: '모', mnemonic: '낚싯바늘에 미끼가 더(More) 달린 모양' },

    { id: 'h_ya', category: 'hiragana', row: 'や행', jp: 'や', romaji: 'ya', meaning: '야', mnemonic: '야크(Yak)의 뿔과 머리 모양' },
    { id: 'h_yu', category: 'hiragana', row: 'や행', jp: 'ゆ', romaji: 'yu', meaning: '유', mnemonic: '열대어 물고기가 헤엄치는 모양' },
    { id: 'h_yo', category: 'hiragana', row: 'や행', jp: 'よ', romaji: 'yo', meaning: '요', mnemonic: '요요(Yo-yo)가 줄에 매달린 모습' },

    { id: 'h_ra', category: 'hiragana', row: 'ら행', jp: 'ら', romaji: 'ra', meaning: '라', mnemonic: '토끼(Rabbit)가 웅크리고 앉은 모습' },
    { id: 'h_ri', category: 'hiragana', row: 'ら행', jp: 'り', romaji: 'ri', meaning: '리', mnemonic: '갈대(Reed) 두 줄기가 흔들리는 모양' },
    { id: 'h_ru', category: 'hiragana', row: 'ら행', jp: 'る', romaji: 'ru', meaning: '루', mnemonic: '루비 반지를 손에 낀 모양' },
    { id: 'h_re', category: 'hiragana', row: 'ら행', jp: 'れ', romaji: 're', meaning: '레', mnemonic: '순록(Reindeer)이 달리는 모습' },
    { id: 'h_ro', category: 'hiragana', row: 'ら행', jp: 'ろ', romaji: 'ro', meaning: '로', mnemonic: '반지가 빠진 숫자 3 모양' },

    { id: 'h_wa', category: 'hiragana', row: 'わ행', jp: 'わ', romaji: 'wa', meaning: '와', mnemonic: '백조(Swan)가 목을 구부린 모습' },
    { id: 'h_wo', category: 'hiragana', row: 'わ행', jp: 'を', romaji: 'wo', meaning: '오(조사)', mnemonic: '장애물을 뛰어넘는 사람 모양' },
    { id: 'h_n', category: 'hiragana', row: 'わ행', jp: 'ん', romaji: 'n', meaning: '응(받침)', mnemonic: '알파벳 소문자 n을 닮은 글자' },

    // 2. 가타카나 (주요 기본음)
    { id: 'k_a', category: 'katakana', row: 'ア행', jp: 'ア', romaji: 'a', meaning: '아', mnemonic: '도끼(Axe) 날 모양' },
    { id: 'k_i', category: 'katakana', row: 'ア행', jp: 'イ', romaji: 'i', meaning: '이', mnemonic: '이젤(Easel)이 서 있는 모습' },
    { id: 'k_u', category: 'katakana', row: 'ア행', jp: 'ウ', romaji: 'u', meaning: '우', mnemonic: '히라가나 う를 각지게 쓴 모양' },
    { id: 'k_e', category: 'katakana', row: 'ア행', jp: 'エ', romaji: 'e', meaning: '에', mnemonic: '엘리베이터 문(I자 기둥) 모양' },
    { id: 'k_o', category: 'katakana', row: 'ア행', jp: 'オ', romaji: 'o', meaning: '오', mnemonic: '오페라 가수가 팔을 벌린 모습' },
    { id: 'k_ka', category: 'katakana', row: 'カ행', jp: 'カ', romaji: 'ka', meaning: '카', mnemonic: '히라가나 か에서 점을 뺀 각진 모양' },
    { id: 'k_ki', category: 'katakana', row: 'カ행', jp: 'キ', romaji: 'ki', meaning: '키', mnemonic: '히라가나 き의 윗부분 열쇠 모양' },
    { id: 'k_ku', category: 'katakana', row: 'カ행', jp: 'ク', romaji: 'ku', meaning: '쿠', mnemonic: '쿠키 한 조각을 베어 문 모양' },
    { id: 'k_ke', category: 'katakana', row: 'カ행', jp: 'ケ', romaji: 'ke', meaning: '케', mnemonic: '알파벳 K를 기울인 모양' },
    { id: 'k_ko', category: 'katakana', row: 'カ행', jp: 'コ', romaji: 'ko', meaning: '코', mnemonic: '코너(Corner) 모서리 모양' },
    { id: 'k_sa', category: 'katakana', row: 'サ행', jp: 'サ', romaji: 'sa', meaning: '사', mnemonic: '사다리 울타리 모양' },
    { id: 'k_shi', category: 'katakana', row: 'サ행', jp: 'シ', romaji: 'shi', meaning: '시', mnemonic: '아래에서 위로 웃는 스마일 얼굴' },
    { id: 'k_su', category: 'katakana', row: 'サ행', jp: 'ス', romaji: 'su', meaning: '수', mnemonic: '스키를 타고 내려가는 모습' },
    { id: 'k_se', category: 'katakana', row: 'サ행', jp: 'セ', romaji: 'se', meaning: '세', mnemonic: '히라가나 せ를 간략화한 모양' },
    { id: 'k_so', category: 'katakana', row: 'サ행', jp: 'ソ', romaji: 'so', meaning: '소', mnemonic: '위에서 아래로 떨어지는 빗방울' },

    // 3. 명사 (그림 퀴즈용 emoji & 발음 포함)
    { id: 'n_neko', category: 'noun', row: 'な행', jp: 'ねこ', romaji: 'neko', meaning: '고양이', emoji: '🐱', mnemonic: 'ね(고양이) + こ(작은 아이)' },
    { id: 'n_inu', category: 'noun', row: 'あ행', jp: 'いぬ', romaji: 'inu', meaning: '강아지', emoji: '🐶', mnemonic: '이누(いぬ)는 강아지!' },
    { id: 'n_ringo', category: 'noun', row: 'ら행', jp: 'りんご', romaji: 'ringo', meaning: '사과', emoji: '🍎', mnemonic: '빨간 사과 링고(りんご)' },
    { id: 'n_kuruma', category: 'noun', row: 'か행', jp: 'くるま', romaji: 'kuruma', meaning: '자동차', emoji: '🚗', mnemonic: '바퀴가 굴러가는 쿠루마(くるま)' },
    { id: 'n_sakana', category: 'noun', row: 'さ행', jp: 'さかな', romaji: 'sakana', meaning: '물고기', emoji: '🐟', mnemonic: '바다에서 헤엄치는 사카나(さかな)' },
    { id: 'n_yama', category: 'noun', row: 'や행', jp: 'やま', romaji: 'yama', meaning: '산', emoji: '⛰️', mnemonic: '높은 산 야마(やま)' },

    // 4. い형용사
    { id: 'ia_oishii', category: 'i_adj', row: 'あ행', jp: 'おいしい', romaji: 'oishii', meaning: '맛있다', emoji: '😋', mnemonic: '어미가 い로 끝나는 대표 い형용사' },
    { id: 'ia_ookii', category: 'i_adj', row: 'あ행', jp: 'おおきい', romaji: 'ookii', meaning: '크다', emoji: '🐘', mnemonic: '코끼리처럼 크다 오오키이(おおきい)' },
    { id: 'ia_chiisai', category: 'i_adj', row: 'た행', jp: 'ちいさい', romaji: 'chiisai', meaning: '작다', emoji: '🐜', mnemonic: '개미처럼 작다 치이사이(ちいさい)' },
    { id: 'ia_atsui', category: 'i_adj', row: 'あ행', jp: 'あつい', romaji: 'atsui', meaning: '덥다 / 뜨겁다', emoji: '🔥', mnemonic: '여름처럼 덥다 아츠이(あつい)' },
    { id: 'ia_samui', category: 'i_adj', row: 'さ행', jp: 'さむい', romaji: 'samui', meaning: '춥다', emoji: '❄️', mnemonic: '겨울처럼 춥다 사무이(さむい)' },

    // 5. な형용사
    { id: 'na_suki', category: 'na_adj', row: 'さ행', jp: 'すき(な)', romaji: 'suki', meaning: '좋아하다', emoji: '❤️', mnemonic: '명사를 꾸밀 때 な가 붙는 な형용사' },
    { id: 'na_kirei', category: 'na_adj', row: 'か행', jp: 'きれい(な)', romaji: 'kirei', meaning: '예쁘다 / 깨끗하다', emoji: '✨', mnemonic: 'い로 끝나지만 な형용사인 예외 단어!' },
    { id: 'na_genki', category: 'na_adj', row: 'か행', jp: 'げんき(な)', romaji: 'genki', meaning: '건강하다 / 활기차다', emoji: '💪', mnemonic: '오겡끼데스까의 げんき!' },
    { id: 'na_shizuka', category: 'na_adj', row: 'さ행', jp: 'しずか(な)', romaji: 'shizuka', meaning: '조용하다', emoji: '🤫', mnemonic: '도서관처럼 조용하다 시즈카(しずか)' },

    // 6. 동사
    { id: 'v_taberu', category: 'verb', row: 'た행', jp: 'たべる', romaji: 'taberu', meaning: '먹다', emoji: '🍚', mnemonic: '밥을 먹다 타베루(たべる)' },
    { id: 'v_nomu', category: 'verb', row: 'な행', jp: 'のむ', romaji: 'nomu', meaning: '마시다', emoji: '🥤', mnemonic: '음료를 마시다 노무(のむ)' },
    { id: 'v_iku', category: 'verb', row: 'あ행', jp: 'いく', romaji: 'iku', meaning: '가다', emoji: '🚶', mnemonic: '학교에 가다 이쿠(いく)' },
    { id: 'v_miru', category: 'verb', row: 'ま행', jp: 'みる', romaji: 'miru', meaning: '보다', emoji: '👀', mnemonic: '영화를 보다 미루(みる)' },
    { id: 'v_neru', category: 'verb', row: 'な행', jp: 'ねる', romaji: 'neru', meaning: '자다', emoji: '😴', mnemonic: '침대에서 자다 네루(ねる)' }
  ],

  // 행별(あかさた...) 단어 및 예문
  rowLessons: [
    {
      row: 'あ행 (あ・い・う・え・お)',
      words: [
        { jp: 'あめ', reading: 'ame', ko: '비 / 사탕' },
        { jp: 'いぬ', reading: 'inu', ko: '강아지' },
        { jp: 'うみ', reading: 'umi', ko: '바다' }
      ],
      example: {
        jp: 'あおい うみへ いきます。',
        reading: 'aoi umi e ikimasu.',
        ko: '푸른 바다로 갑니다.'
      }
    },
    {
      row: 'か행 (か・き・く・け・こ)',
      words: [
        { jp: 'かさ', reading: 'kasa', ko: '우산' },
        { jp: 'きって', reading: 'kitte', ko: '우표' },
        { jp: 'くるま', reading: 'kuruma', ko: '자동차' }
      ],
      example: {
        jp: 'おおきい くるまが あります。',
        reading: 'ookii kuruma ga arimasu.',
        ko: '큰 자동차가 있습니다.'
      }
    },
    {
      row: 'さ행 (さ・し・す・せ・そ)',
      words: [
        { jp: 'さかな', reading: 'sakana', ko: '물고기' },
        { jp: 'しお', reading: 'shio', ko: '소금' },
        { jp: 'すし', reading: 'sushi', ko: '초밥' }
      ],
      example: {
        jp: 'おいしい すしを たべます。',
        reading: 'oishii sushi o tabemasu.',
        ko: '맛있는 초밥을 먹습니다.'
      }
    },
    {
      row: 'た행 (た・ち・つ・て・と)',
      words: [
        { jp: 'たまご', reading: 'tamago', ko: '달걀' },
        { jp: 'ちず', reading: 'chizu', ko: '지도' },
        { jp: 'とり', reading: 'tori', ko: '새' }
      ],
      example: {
        jp: 'ちいさい とりが とびます。',
        reading: 'chiisai tori ga tobimasu.',
        ko: '작은 새가 날아갑니다.'
      }
    },
    {
      row: 'な행 (な・に・ぬ・ね・の)',
      words: [
        { jp: 'なつ', reading: 'natsu', ko: '여름' },
        { jp: 'ねこ', reading: 'neko', ko: '고양이' },
        { jp: 'のみもの', reading: 'nomimono', ko: '마실 것(음료)' }
      ],
      example: {
        jp: 'ねこが みずを のみます。',
        reading: 'neko ga mizu o nomimasu.',
        ko: '고양이가 물을 마십니다.'
      }
    }
  ],

  // 추후 확장 로드맵 (v2)
  roadmapV2: [
    {
      stage: 'STEP 1 · 기초 문법',
      title: '명사 기초 문법 (~です / ~ではありません)',
      desc: '명사의 긍정, 부정, 의문문(~ですか)과 조사 の(의) 연결법을 학습합니다.',
      sample: 'わたしは がくせい です。 (저는 학생입니다.)'
    },
    {
      stage: 'STEP 2 · 기초 문법',
      title: '형용사 기초 문법 (い형용사 / な형용사 활용)',
      desc: '명사 수식(~い + 명사 / ~な + 명사)과 정중형·부정형(~くないです / ~ではありません)을 익힙니다.',
      sample: 'しずかな まち / おいしい りんご'
    },
    {
      stage: 'STEP 3 · 기초 문법',
      title: '동사 기초 문법 (ます형 기본 활용)',
      desc: '동사 원형을 정중한 ます형으로 바꾸고, 목적격 조사 を·장소 조사 へ/に를 연결합니다.',
      sample: 'まいにち にほんごを べんきょうします。'
    },
    {
      stage: 'STEP 4 · 읽기 및 표현',
      title: '간단한 예문 읽기',
      desc: '배운 문자와 품사만으로 구성된 짧은 일기·대화문 지문을 소리 내어 읽고 해석합니다.',
      sample: 'きょうは あついです。つめたい みずを のみます。'
    },
    {
      stage: 'STEP 5 · 출력 및 작문',
      title: '한글 보고 일본어 적어보기 & 작문하기',
      desc: '제시된 한국어 단어·문장을 보고 히라가나로 직접 입력하거나 문장 어순을 배열해 작문합니다.',
      sample: '문제: "나는 고양이를 좋아합니다" → わたしは ねこが すきです。'
    }
  ]
};