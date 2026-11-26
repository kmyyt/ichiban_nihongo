// 히라가나 46자 전용 데이터 모듈 (window.HIRAGANA_DATA로 전역 등록)
(function (global) {
  const HIRAGANA_DATA = [
    // ==================== あ행 ====================
    {
      id: 'h_a', category: 'hiragana', row: 'あ행', jp: 'あ', romaji: 'a', meaning: '아',
      pronTip: '입을 자연스럽고 크게 벌려 맑게 "아"라고 발음합니다.',
      mnemonic: '십자가(+) 아래에 물고기 한 마리가 헤엄치는 모양으로 연상해보세요.',
      mnemonicQuiz: {
        q: '히라가나 「あ」의 연상 기법으로 알맞은 것은?',
        choices: ['십자가 아래 물고기 모양', '낚싯바늘 모양', '숫자 5 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 25 32 L 72 32', tip: '1획: 위쪽 가로획을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 48 16 L 48 76', tip: '2획: 세로획을 위에서 아래로 길게 내려긋습니다.' },
        { d: 'M 72 38 C 68 62, 42 82, 24 72 C 12 65, 22 46, 46 46 C 68 46, 84 58, 82 74 C 80 84, 66 88, 56 85', tip: '3획: 오른쪽에서 돌아 왼쪽 고리를 만들고 크게 감싸며 마무리합니다.' }
      ],
      words: [
        { emoji: '🌧️', jp: 'あめ', romaji: 'ame', meaning: '비 / 사탕' },
        { emoji: '👣', jp: 'あし', romaji: 'ashi', meaning: '발 / 다리' },
        { jp: 'あか', romaji: 'aka', meaning: '빨강' }
      ],
      examples: [
        { jp: 'あめが ふっています。', romaji: 'ame ga futte imasu.', meaning: '비가 내리고 있습니다.' },
        { jp: 'あかい りんごを たべます。', romaji: 'akai ringo o tabemasu.', meaning: '빨간 사과를 먹습니다.' }
      ]
    },
    {
      id: 'h_i', category: 'hiragana', row: 'あ행', jp: 'い', romaji: 'i', meaning: '이',
      pronTip: '입술을 옆으로 살짝 벌리고 혀를 앞쪽 위에 가깝게 두고 "이"라고 발음합니다.',
      mnemonic: '나란히 서 있는 두 사람(이)의 모습입니다.',
      mnemonicQuiz: {
        q: '히라가나 「い」는 어떤 모습에서 연상할까요?',
        choices: ['나란히 서 있는 두 사람', '동전 두 개', '우산 쓴 사람'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 26 C 22 48, 25 68, 34 78 C 38 82, 44 74, 46 66', tip: '1획: 왼쪽 획을 부드럽게 휘어 내려긋고 살짝 올립니다.' },
        { d: 'M 68 28 C 73 46, 77 64, 76 78', tip: '2획: 오른쪽 획을 위에서 아래로 살짝 휘어 내려긋습니다.' }
      ],
      words: [
        { emoji: '🐶', jp: 'いぬ', romaji: 'inu', meaning: '강아지' },
        { emoji: '🪑', jp: 'いす', romaji: 'isu', meaning: '의자' },
        { jp: 'いく', romaji: 'iku', meaning: '가다' }
      ],
      examples: [
        { jp: 'いぬが います。', romaji: 'inu ga imasu.', meaning: '강아지가 있습니다.' },
        { jp: 'いすに すわります。', romaji: 'isu ni suwarimasu.', meaning: '의자에 앉습니다.' }
      ]
    },
    {
      id: 'h_u', category: 'hiragana', row: 'あ행', jp: 'う', romaji: 'u', meaning: '우',
      pronTip: '입술을 앞으로 너무 내밀지 않고 오므린 듯 자연스럽게 "우"라고 발음합니다.',
      mnemonic: '우산을 쓰고 살짝 몸을 숙인 모습으로 기억하세요.',
      mnemonicQuiz: {
        q: '히라가나 「う」의 발음은 무엇인가요?',
        choices: ['u (우)', 'o (오)', 'e (에)'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 18 L 54 24', tip: '1획: 위쪽 짧은 점을 찍듯 내려긋습니다.' },
        { d: 'M 24 38 C 44 34, 68 35, 72 52 C 75 68, 56 82, 36 84', tip: '2획: 둥근 곡선을 그리며 아래쪽으로 감아 내려옵니다.' }
      ],
      words: [
        { emoji: '🌊', jp: 'うみ', romaji: 'umi', meaning: '바다' },
        { emoji: '🐰', jp: 'うさぎ', romaji: 'usagi', meaning: '토끼' },
        { jp: 'うた', romaji: 'uta', meaning: '노래' }
      ],
      examples: [
        { jp: 'うみに いきます。', romaji: 'umi ni ikimasu.', meaning: '바다에 갑니다.' },
        { jp: 'うさぎが はしります。', romaji: 'usagi ga hashirimasu.', meaning: '토끼가 달립니다.' }
      ]
    },
    {
      id: 'h_e', category: 'hiragana', row: 'あ행', jp: 'え', romaji: 'e', meaning: '에',
      pronTip: '입을 중간 정도 벌리고 평평하게 "에"라고 발음합니다.',
      mnemonic: '에너지(Energy) 넘치게 지그재그로 움직이는 선을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '히라가나 「え」의 로마자 표기는?',
        choices: ['e', 'a', 'i'],
        answer: 0
      },
      strokes: [
        { d: 'M 44 18 L 56 25', tip: '1획: 위쪽 점을 짧게 긋습니다.' },
        { d: 'M 22 36 L 74 36 L 38 64 C 52 54, 72 56, 74 70 C 75 80, 62 84, 48 82', tip: '2획: 가로획 후 꺾어 내려오며 오른쪽 호를 그립니다.' }
      ],
      words: [
        { emoji: '🚉', jp: 'えき', romaji: 'eki', meaning: '역' },
        { emoji: '🖼️', jp: 'え', romaji: 'e', meaning: '그림' },
        { jp: 'えがお', romaji: 'egao', meaning: '미소' }
      ],
      examples: [
        { jp: 'えきまで あるきます。', romaji: 'eki made arukimasu.', meaning: '역까지 걸어갑니다.' },
        { jp: 'きれいな えを かきます。', romaji: 'kirei na e o kakimasu.', meaning: '예쁜 그림을 그립니다.' }
      ]
    },
    {
      id: 'h_o', category: 'hiragana', row: 'あ행', jp: 'お', romaji: 'o', meaning: '오',
      pronTip: '입술을 동그랗게 오므려 또렷하게 "오"라고 발음합니다.',
      mnemonic: '공을 치고 "오!" 하고 감탄하는 사람 모습입니다.',
      mnemonicQuiz: {
        q: '히라가나 「お」의 획수는 몇 획인가요?',
        choices: ['3획', '1획', '5획'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 34 L 74 34', tip: '1획: 가로획을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 52 16 L 52 78 C 52 84, 42 84, 34 78', tip: '2획: 세로로 내려와 아래에서 둥글게 말아 올립니다.' },
        { d: 'M 52 52 C 36 52, 22 64, 24 74 C 26 82, 44 76, 52 52 M 74 22 L 80 28', tip: '3획: 왼쪽 아래 고리를 돌고 오른쪽 위에 점을 찍습니다.' }
      ],
      words: [
        { emoji: '🍵', jp: 'おちゃ', romaji: 'ocha', meaning: '차(녹차 등)' },
        { emoji: '🌞', jp: 'おはよう', romaji: 'ohayou', meaning: '좋은 아침' },
        { jp: 'おと', romaji: 'oto', meaning: '소리' }
      ],
      examples: [
        { jp: 'おちゃを のみます。', romaji: 'ocha o nomimasu.', meaning: '차를 마십니다.' },
        { jp: 'おおきな おとが します。', romaji: 'ookina oto ga shimasu.', meaning: '큰 소리가 납니다.' }
      ]
    },

    // ==================== か행 ====================
    {
      id: 'h_ka', category: 'hiragana', row: 'か행', jp: 'か', romaji: 'ka', meaning: '카',
      pronTip: '목구멍 뒤쪽에서 "ㅋ" 소리를 가볍게 내며 "카"라고 발음합니다.',
      mnemonic: '칼(か)을 들고 휘두르는 모습에서 카(ka)를 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「か」와 가장 잘 어울리는 연상 이미지는?',
        choices: ['휘두르는 칼', '물고기', '바늘'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 36 C 42 34, 62 32, 66 44 C 70 58, 56 78, 44 80', tip: '1획: 휘어 내려오며 오른쪽 아래로 꺾어 내립니다.' },
        { d: 'M 42 18 C 38 44, 30 66, 20 80', tip: '2획: 위에서 아래로 길게 사선으로 내려긋습니다.' },
        { d: 'M 74 24 L 82 34', tip: '3획: 오른쪽 위에 짧게 점을 찍습니다.' }
      ],
      words: [
        { emoji: '☂️', jp: 'かさ', romaji: 'kasa', meaning: '우산' },
        { emoji: '🔑', jp: 'かぎ', romaji: 'kagi', meaning: '열쇠' },
        { jp: 'かわ', romaji: 'kawa', meaning: '강' }
      ],
      examples: [
        { jp: 'あかい かさを さします。', romaji: 'akai kasa o sashimasu.', meaning: '빨간 우산을 씁니다.' },
        { jp: 'かぎを わすれました。', romaji: 'kagi o wasuremashita.', meaning: '열쇠를 잊었습니다.' }
      ]
    },
    {
      id: 'h_ki', category: 'hiragana', row: 'か행', jp: 'き', romaji: 'ki', meaning: '키',
      pronTip: '혀끝이 닿지 않게 "ㅋ" 소리를 내며 "키"라고 발음합니다.',
      mnemonic: '열쇠(Key)의 모양을 닮은 글자입니다.',
      mnemonicQuiz: {
        q: '「き」를 영단어 발음과 연결하면 무엇인가요?',
        choices: ['Key(열쇠)', 'Sun(태양)', 'Cat(고양이)'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 28 L 68 24', tip: '1획: 첫 번째 가로획을 살짝 위로 긋습니다.' },
        { d: 'M 24 44 L 70 40', tip: '2획: 두 번째 가로획을 나란히 긋습니다.' },
        { d: 'M 48 14 C 50 36, 52 54, 54 68 C 40 66, 28 72, 34 80 C 40 86, 58 84, 66 78', tip: '3획: 세로획을 내려 긋고 아래쪽에서 곡선으로 감습니다.' }
      ],
      words: [
        { emoji: '🌳', jp: 'き', romaji: 'ki', meaning: '나무' },
        { emoji: '🚉', jp: 'えき', romaji: 'eki', meaning: '역' },
        { jp: 'きいろ', romaji: 'kiiro', meaning: '노랑' }
      ],
      examples: [
        { jp: 'おおきな きが あります。', romaji: 'ookina ki ga arimasu.', meaning: '큰 나무가 있습니다.' },
        { jp: 'きいろい はなが さきます。', romaji: 'kiiroi hana ga sakimasu.', meaning: '노란 꽃이 핍니다.' }
      ]
    },
    {
      id: 'h_ku', category: 'hiragana', row: 'か행', jp: 'く', romaji: 'ku', meaning: '쿠',
      pronTip: '입술을 살짝 오므리며 "쿠"라고 짧게 발음합니다.',
      mnemonic: '부리(く)를 뾰족하게 벌린 새의 옆모습입니다.',
      mnemonicQuiz: {
        q: '「く」의 모양으로 연상하기 좋은 것은?',
        choices: ['새의 부리(<)', '가로줄 세 개', '동그라미'],
        answer: 0
      },
      strokes: [
        { d: 'M 66 20 L 34 48 L 68 78', tip: '1획: 왼쪽을 향해 꺾어 들어갔다가 오른쪽 아래로 긋습니다.' }
      ],
      words: [
        { emoji: '👟', jp: 'くつ', romaji: 'kutsu', meaning: '신발' },
        { emoji: '☁️', jp: 'くも', romaji: 'kumo', meaning: '구름' },
        { jp: 'くに', romaji: 'kuni', meaning: '나라' }
      ],
      examples: [
        { jp: 'あたらしい くつを はきます。', romaji: 'atarashii kutsu o hakimasu.', meaning: '새 신발을 신습니다.' },
        { jp: 'そらに くもが うかびます。', romaji: 'sora ni kumo ga ukabimasu.', meaning: '하늘에 구름이 뜹니다.' }
      ]
    },
    {
      id: 'h_ke', category: 'hiragana', row: 'か행', jp: 'け', romaji: 'ke', meaning: '케',
      pronTip: '입을 자연스럽게 벌리고 "케"라고 발음합니다.',
      mnemonic: '케이크(Cake) 한 조각을 자른 옆모습으로 기억하세요.',
      mnemonicQuiz: {
        q: '「け」의 발음은?',
        choices: ['ke (케)', 'ko (코)', 'ka (카)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 24 L 24 78', tip: '1획: 왼쪽 세로획을 위에서 아래로 긋습니다.' },
        { d: 'M 24 44 C 34 40, 42 36, 44 46 C 46 56, 36 62, 32 58', tip: '2획: 가운데 부분을 둥글게 굴려 긋습니다.' },
        { d: 'M 66 18 L 66 82', tip: '3획: 오른쪽 세로획을 길게 내려긋습니다.' }
      ],
      words: [
        { emoji: '🍰', jp: 'けーき', romaji: 'keeki', meaning: '케이크' },
        { emoji: '⏰', jp: 'とけい', romaji: 'tokei', meaning: '시계' },
        { jp: 'けさ', romaji: 'kesa', meaning: '오늘 아침' }
      ],
      examples: [
        { jp: 'けーきを たべます。', romaji: 'keeki o tabemasu.', meaning: '케이크를 먹습니다.' },
        { jp: 'とけいを みます。', romaji: 'tokei o mimasu.', meaning: '시계를 봅니다.' }
      ]
    },
    {
      id: 'h_ko', category: 'hiragana', row: 'か행', jp: 'こ', romaji: 'ko', meaning: '코',
      pronTip: '입술을 동그랗게 모아 "코"라고 발음합니다.',
      mnemonic: '동전(Coin) 두 개가 위아래로 놓인 모습입니다.',
      mnemonicQuiz: {
        q: '「こ」는 몇 획으로 쓰나요?',
        choices: ['2획', '4획', '1획'],
        answer: 0
      },
      strokes: [
        { d: 'M 30 28 C 48 24, 66 26, 68 38', tip: '1획: 위쪽 획을 왼쪽에서 오른쪽으로 살짝 휘어 긋습니다.' },
        { d: 'M 26 56 C 24 72, 42 78, 70 72', tip: '2획: 아래쪽 획을 감아 돌리듯 오른쪽으로 긋습니다.' }
      ],
      words: [
        { emoji: '👶', jp: 'こども', romaji: 'kodomo', meaning: '아이' },
        { emoji: '☕', jp: 'こーひー', romaji: 'koohii', meaning: '커피' },
        { jp: 'こえ', romaji: 'koe', meaning: '목소리' }
      ],
      examples: [
        { jp: 'こどもが あそびます。', romaji: 'kodomo ga asobimasu.', meaning: '아이가 놉니다.' },
        { jp: 'こーひーを のみます。', romaji: 'koohii o nomimasu.', meaning: '커피를 마십니다.' }
      ]
    },

    // ==================== さ행 ====================
    {
      id: 'h_sa', category: 'hiragana', row: 'さ행', jp: 'さ', romaji: 'sa', meaning: '사',
      pronTip: '혀끝을 윗잇몸 뒤에 살짝 대며 부드럽게 "사"라고 발음합니다.',
      mnemonic: '사람(sa)이 웃으며 손을 흔드는 모습입니다.',
      mnemonicQuiz: {
        q: '「さ」의 발음은?',
        choices: ['sa (사)', 'su (수)', 'so (소)'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 28 L 68 24', tip: '1획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 22 46 L 70 42', tip: '2획: 두 번째 가로획을 긋습니다.' },
        { d: 'M 48 14 L 54 66 C 42 66, 30 72, 36 80 C 42 84, 58 82, 66 76', tip: '3획: 세로획을 내려 긋고 아래쪽을 둥글게 감습니다.' }
      ],
      words: [
        { emoji: '🐟', jp: 'さかな', romaji: 'sakana', meaning: '물고기' },
        { emoji: '🌸', jp: 'さくら', romaji: 'sakura', meaning: '벚꽃' },
        { jp: 'あさ', romaji: 'asa', meaning: '아침' }
      ],
      examples: [
        { jp: 'さかなを やきます。', romaji: 'sakana o yakimasu.', meaning: '물고기를 굽습니다.' },
        { jp: 'さくらが きれいです。', romaji: 'sakura ga kirei desu.', meaning: '벚꽃이 예쁩니다.' }
      ]
    },
    {
      id: 'h_shi', category: 'hiragana', row: 'さ행', jp: 'し', romaji: 'shi', meaning: '시',
      pronTip: '한국어 "시"보다 혀를 둥글게 말지 않고 평평하게 "시"라고 발음합니다.',
      mnemonic: '휘어진 낚싯바늘 모양을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「し」의 모양으로 연상할 수 있는 것은?',
        choices: ['낚싯바늘', '구름', '별'],
        answer: 0
      },
      strokes: [
        { d: 'M 34 20 C 30 46, 30 68, 42 78 C 54 86, 70 76, 76 64', tip: '1획: 위에서 아래로 길게 내려와 오른쪽으로 부드럽게 휘어 올립니다.' }
      ],
      words: [
        { emoji: '🗺️', jp: 'ちず', romaji: 'chizu', meaning: '지도' },
        { emoji: '🤍', jp: 'しろ', romaji: 'shiro', meaning: '하양' },
        { jp: 'しお', romaji: 'shio', meaning: '소금' }
      ],
      examples: [
        { jp: 'しろい はな', romaji: 'shiroi hana', meaning: '하얀 꽃' },
        { jp: 'しおを いれます。', romaji: 'shio o iremasu.', meaning: '소금을 넣습니다.' }
      ]
    },
    {
      id: 'h_su', category: 'hiragana', row: 'さ행', jp: 'す', romaji: 'su', meaning: '수',
      pronTip: '입술을 살짝 오므려 "스/수" 느낌으로 발음합니다.',
      mnemonic: '줄에 매달린 수박(su)이 빙글 도는 모습입니다.',
      mnemonicQuiz: {
        q: '「す」의 발음은?',
        choices: ['su (수)', 'se (세)', 'shi (시)'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 30 L 74 28', tip: '1획: 가로획을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 54 16 L 54 54 C 54 64, 42 66, 38 58 C 34 50, 48 46, 56 54 C 62 62, 58 76, 42 84', tip: '2획: 세로획을 내려 고리를 만들고 아래로 길게 꼬리를 내립니다.' }
      ],
      words: [
        { emoji: '🍣', jp: 'すし', romaji: 'sushi', meaning: '초밥' },
        { emoji: '🍉', jp: 'すいか', romaji: 'suika', meaning: '수박' },
        { jp: 'すき', romaji: 'suki', meaning: '좋아함' }
      ],
      examples: [
        { jp: 'すしが すきです。', romaji: 'sushi ga suki desu.', meaning: '초밥을 좋아합니다.' },
        { jp: 'すいかを たべます。', romaji: 'suika o tabemasu.', meaning: '수박을 먹습니다.' }
      ]
    },
    {
      id: 'h_se', category: 'hiragana', row: 'さ행', jp: 'せ', romaji: 'se', meaning: '세',
      pronTip: '입을 자연스럽게 벌리고 "세"라고 발음합니다.',
      mnemonic: '세상 세(世) 자에서 나온 글자로 기억하세요.',
      mnemonicQuiz: {
        q: '「せ」의 로마자 표기는?',
        choices: ['se', 'sa', 'so'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 42 L 78 38', tip: '1획: 가로획을 길게 긋습니다.' },
        { d: 'M 58 18 L 58 58', tip: '2획: 가운데 세로획을 위에서 아래로 긋습니다.' },
        { d: 'M 32 22 L 32 66 C 32 76, 44 80, 68 78', tip: '3획: 왼쪽 세로획을 내려와 아래쪽에서 오른쪽으로 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🌍', jp: 'せかい', romaji: 'sekai', meaning: '세계' },
        { emoji: '📏', jp: 'せ', romaji: 'se', meaning: '등 / 키' },
        { jp: 'せんせい', romaji: 'sensei', meaning: '선생님' }
      ],
      examples: [
        { jp: 'せかいを りょこうします。', romaji: 'sekai o ryokou shimasu.', meaning: '세계를 여행합니다.' },
        { jp: 'せんせいに ききます。', romaji: 'sensei ni kikimasu.', meaning: '선생님께 묻습니다.' }
      ]
    },
    {
      id: 'h_so', category: 'hiragana', row: 'さ행', jp: 'そ', romaji: 'so', meaning: '소',
      pronTip: '입술을 동그랗게 오므려 "소"라고 발음합니다.',
      mnemonic: '지그재그로 한 번에 이어 쓴 바느질 선(Sew)입니다.',
      mnemonicQuiz: {
        q: '「そ」는 보통 몇 획으로 쓰나요?',
        choices: ['1획', '3획', '4획'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 24 L 64 24 L 30 48 L 68 50 C 52 58, 42 72, 54 82', tip: '1획: 지그재그로 꺾어 내려오며 아래쪽 곡선까지 한 번에 긋습니다.' }
      ],
      words: [
        { emoji: '☀️', jp: 'そら', romaji: 'sora', meaning: '하늘' },
        { emoji: '🧦', jp: 'くつした', romaji: 'kutsushita', meaning: '양말' },
        { jp: 'そと', romaji: 'soto', meaning: '밖' }
      ],
      examples: [
        { jp: 'そらが あおいです。', romaji: 'sora ga aoi desu.', meaning: '하늘이 파랗습니다.' },
        { jp: 'そとに でます。', romaji: 'soto ni demasu.', meaning: '밖에 나갑니다.' }
      ]
    },

    // ==================== た행 ====================
    {
      id: 'h_ta', category: 'hiragana', row: 'た행', jp: 'た', romaji: 'ta', meaning: '타',
      pronTip: '혀끝을 윗잇몸에 가볍게 대었다 떼며 "타"라고 발음합니다.',
      mnemonic: '알파벳 t와 a를 합친 모양으로 기억하세요.',
      mnemonicQuiz: {
        q: '「た」의 발음은?',
        choices: ['ta (타)', 'te (테)', 'to (토)'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 36 L 54 32', tip: '1획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 38 16 C 34 42, 24 64, 16 80', tip: '2획: 왼쪽에서 사선으로 길게 내려긋습니다.' },
        { d: 'M 48 48 C 58 46, 70 46, 76 48 M 46 66 C 54 76, 68 78, 78 74', tip: '3~4획: 오른쪽 가로획과 아래쪽 곡선 획을 긋습니다.' }
      ],
      words: [
        { emoji: '🥚', jp: 'たまご', romaji: 'tamago', meaning: '달걀' },
        { emoji: '⛰️', jp: 'やま', romaji: 'yama', meaning: '산' },
        { jp: 'たべる', romaji: 'taberu', meaning: '먹다' }
      ],
      examples: [
        { jp: 'たまごを たべます。', romaji: 'tamago o tabemasu.', meaning: '달걀을 먹습니다.' },
        { jp: 'たかい やまに のぼります。', romaji: 'takai yama ni noborimasu.', meaning: '높은 산에 오릅니다.' }
      ]
    },
    {
      id: 'h_chi', category: 'hiragana', row: 'た행', jp: 'ち', romaji: 'chi', meaning: '치',
      pronTip: '혀를 윗잇몸에 대며 "치"라고 발음합니다.',
      mnemonic: '숫자 5와 닮은 치어리더를 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「ち」의 로마자 표기는?',
        choices: ['chi', 'tsu', 'te'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 28 C 40 26, 56 24, 68 22', tip: '1획: 위쪽 가로획을 살짝 위로 긋습니다.' },
        { d: 'M 46 14 C 42 32, 32 46, 22 54 C 38 48, 64 46, 68 62 C 70 74, 54 82, 36 80', tip: '2획: 내려오며 둥근 곡선을 크게 감아 돌립니다.' }
      ],
      words: [
        { emoji: '🗺️', jp: 'ちず', romaji: 'chizu', meaning: '지도' },
        { emoji: '🥛', jp: 'ちち', romaji: 'chichi', meaning: '아버지 / 젖' },
        { jp: 'ちかい', romaji: 'chikai', meaning: '가깝다' }
      ],
      examples: [
        { jp: 'ちずを みます。', romaji: 'chizu o mimasu.', meaning: '지도를 봅니다.' },
        { jp: 'えきが ちかいです。', romaji: 'eki ga chikai desu.', meaning: '역이 가깝습니다.' }
      ]
    },
    {
      id: 'h_tsu', category: 'hiragana', row: 'た행', jp: 'つ', romaji: 'tsu', meaning: '츠',
      pronTip: '혀끝을 윗잇몸에 대었다가 바람을 내보내며 "츠"라고 발음합니다.',
      mnemonic: '바다에서 밀려오는 쓰나미(Tsunami) 파도 모양입니다.',
      mnemonicQuiz: {
        q: '「つ」와 연관된 단어는?',
        choices: ['쓰나미 파도', '열쇠', '우산'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 34 C 44 26, 72 28, 74 48 C 76 66, 56 78, 36 82', tip: '1획: 둥근 파도 곡선을 그리며 아래로 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🌙', jp: 'つき', romaji: 'tsuki', meaning: '달' },
        { emoji: '🐦', jp: 'とり', romaji: 'tori', meaning: '새' },
        { jp: 'つくえ', romaji: 'tsukue', meaning: '책상' }
      ],
      examples: [
        { jp: 'よるに つきが みえます。', romaji: 'yoru ni tsuki ga miemasu.', meaning: '밤에 달이 보입니다.' },
        { jp: 'つくえの うえに ほんが あります。', romaji: 'tsukue no ue ni hon ga arimasu.', meaning: '책상 위에 책이 있습니다.' }
      ]
    },
    {
      id: 'h_te', category: 'hiragana', row: 'た행', jp: 'て', romaji: 'te', meaning: '테',
      pronTip: '입을 자연스럽게 벌리고 "테"라고 발음합니다.',
      mnemonic: '손(て)을 옆으로 뻗은 모양으로 기억하세요.',
      mnemonicQuiz: {
        q: '「て」의 발음은?',
        choices: ['te (테)', 'ta (타)', 'to (토)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 28 C 44 26, 66 24, 76 22 C 56 34, 42 50, 44 68 C 46 80, 58 84, 70 82', tip: '1획: 가로로 뻗은 뒤 꺾어 내려오며 아래 곡선을 긋습니다.' }
      ],
      words: [
        { emoji: '✋', jp: 'て', romaji: 'te', meaning: '손' },
        { emoji: '✉️', jp: 'てがみ', romaji: 'tegami', meaning: '편지' },
        { jp: 'てんき', romaji: 'tenki', meaning: '날씨' }
      ],
      examples: [
        { jp: 'てを あらいます。', romaji: 'te o araimasu.', meaning: '손을 씻습니다.' },
        { jp: 'てがみを かきます。', romaji: 'tegami o kakimasu.', meaning: '편지를 씁니다.' }
      ]
    },
    {
      id: 'h_to', category: 'hiragana', row: 'た행', jp: 'と', romaji: 'to', meaning: '토',
      pronTip: '입술을 동그랗게 모아 "토"라고 발음합니다.',
      mnemonic: '가시(토)가 살짝 꽂힌 모양으로 연상해보세요.',
      mnemonicQuiz: {
        q: '「と」의 로마자 표기는?',
        choices: ['to', 'te', 'ta'],
        answer: 0
      },
      strokes: [
        { d: 'M 44 18 C 40 34, 44 48, 56 54 C 40 58, 30 68, 34 78 C 38 86, 58 84, 72 76', tip: '1획: 세로로 내려와 아래에서 둥글게 감아 오른쪽으로 긋습니다.' }
      ],
      words: [
        { emoji: '🚪', jp: 'とけい', romaji: 'tokei', meaning: '시계' },
        { emoji: '🐦', jp: 'とり', romaji: 'tori', meaning: '새' },
        { jp: 'ともだち', romaji: 'tomodachi', meaning: '친구' }
      ],
      examples: [
        { jp: 'ともだちと あいます。', romaji: 'tomodachi to aimasu.', meaning: '친구와 만납니다.' },
        { jp: 'とりが とびます。', romaji: 'tori ga tobimasu.', meaning: '새가 납니다.' }
      ]
    },

    // ==================== な행 ====================
    {
      id: 'h_na', category: 'hiragana', row: 'な행', jp: 'な', romaji: 'na', meaning: '나',
      pronTip: '혀끝을 윗잇몸에 대며 부드럽게 "나"라고 발음합니다.',
      mnemonic: '끈으로 매듭(나)을 묶는 모양입니다.',
      mnemonicQuiz: {
        q: '「な」의 발음은?',
        choices: ['na (나)', 'ni (니)', 'ne (네)'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 34 L 54 32', tip: '1획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 38 16 C 34 40, 24 64, 16 78', tip: '2획: 왼쪽에서 사선으로 내려긋습니다.' },
        { d: 'M 62 28 C 66 44, 68 58, 66 70 C 56 66, 44 70, 46 78 C 48 84, 64 82, 74 74 M 74 36 L 80 42', tip: '3~4획: 오른쪽 획과 점으로 마무리합니다.' }
      ],
      words: [
        { emoji: '☀️', jp: 'なつ', romaji: 'natsu', meaning: '여름' },
        { emoji: '🥬', jp: 'なっぱ', romaji: 'nappa', meaning: '푸른 잎채소' },
        { jp: 'なまえ', romaji: 'namae', meaning: '이름' }
      ],
      examples: [
        { jp: 'なつやすみが すきです。', romaji: 'natsuyasumi ga suki desu.', meaning: '여름방학을 좋아합니다.' },
        { jp: 'なまえを かきます。', romaji: 'namae o kakimasu.', meaning: '이름을 씁니다.' }
      ]
    },
    {
      id: 'h_ni', category: 'hiragana', row: 'な행', jp: 'に', romaji: 'ni', meaning: '니',
      pronTip: '입을 옆으로 살짝 벌려 "니"라고 발음합니다.',
      mnemonic: '무릎(Knee)을 구부린 모습으로 연상해보세요.',
      mnemonicQuiz: {
        q: '「に」와 연결하기 좋은 영어 단어는?',
        choices: ['Knee(무릎)', 'Sun(태양)', 'Fish(물고기)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 24 C 20 46, 20 66, 26 78', tip: '1획: 왼쪽 세로획을 살짝 휘어 내려긋습니다.' },
        { d: 'M 44 32 L 72 30', tip: '2획: 오른쪽 위 가로획을 긋습니다.' },
        { d: 'M 46 66 C 54 76, 68 78, 78 74', tip: '3획: 오른쪽 아래 곡선 획을 긋습니다.' }
      ],
      words: [
        { emoji: '🧄', jp: 'にんにく', romaji: 'ninniku', meaning: '마늘' },
        { emoji: '🎒', jp: 'にもつ', romaji: 'nimotsu', meaning: '짐' },
        { jp: 'にほん', romaji: 'nihon', meaning: '일본' }
      ],
      examples: [
        { jp: 'にほんに いきます。', romaji: 'nihon ni ikimasu.', meaning: '일본에 갑니다.' },
        { jp: 'にもつを もちます。', romaji: 'nimotsu o mochimasu.', meaning: '짐을 듭니다.' }
      ]
    },
    {
      id: 'h_nu', category: 'hiragana', row: 'な행', jp: 'ぬ', romaji: 'nu', meaning: '누',
      pronTip: '입술을 살짝 오므려 "누"라고 발음합니다.',
      mnemonic: '국수(Noodle) 가락을 돌돌 말아 올린 모양입니다.',
      mnemonicQuiz: {
        q: '「ぬ」의 연상 단어로 알맞은 것은?',
        choices: ['Noodle(국수)', 'Apple(사과)', 'Clock(시계)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 26 L 44 68 C 34 74, 20 68, 22 56 C 24 44, 44 36, 62 42 C 74 46, 76 62, 66 74 L 74 82', tip: '1획: 대각선 획과 돌돌 말린 곡선을 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🪡', jp: 'ぬう', romaji: 'nuu', meaning: '꿰매다 / 바느질하다' },
        { emoji: '🧸', jp: 'ぬいぐるみ', romaji: 'nuigurumi', meaning: '인형' },
        { jp: 'いぬ', romaji: 'inu', meaning: '강아지' }
      ],
      examples: [
        { jp: 'ぬいぐるみと ねます。', romaji: 'nuigurumi to nemasu.', meaning: '인형과 함께 잡니다.' },
        { jp: 'いぬが はしります。', romaji: 'inu ga hashirimasu.', meaning: '강아지가 달립니다.' }
      ]
    },
    {
      id: 'h_ne', category: 'hiragana', row: 'な행', jp: 'ね', romaji: 'ne', meaning: '네',
      pronTip: '입을 자연스럽게 벌려 "네"라고 발음합니다.',
      mnemonic: '고양이(ねこ)가 꼬리를 말고 앉은 모습입니다.',
      mnemonicQuiz: {
        q: '「ね」의 발음은?',
        choices: ['ne (네)', 'no (노)', 'na (나)'],
        answer: 0
      },
      strokes: [
        { d: 'M 38 18 L 38 78', tip: '1획: 세로획을 위에서 아래로 길게 긋습니다.' },
        { d: 'M 20 38 C 38 34, 62 28, 66 38 C 70 48, 48 64, 54 74 C 58 80, 70 78, 78 72', tip: '2획: 곡선으로 돌아 꼬리 모양을 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🐱', jp: 'ねこ', romaji: 'neko', meaning: '고양이' },
        { emoji: '💤', jp: 'ねる', romaji: 'neru', meaning: '자다' },
        { jp: 'ねだん', romaji: 'nedan', meaning: '가격' }
      ],
      examples: [
        { jp: 'ねこが います。', romaji: 'neko ga imasu.', meaning: '고양이가 있습니다.' },
        { jp: 'はやく ねます。', romaji: 'hayaku nemasu.', meaning: '일찍 잡니다.' }
      ]
    },
    {
      id: 'h_no', category: 'hiragana', row: 'な행', jp: 'の', romaji: 'no', meaning: '노',
      pronTip: '입술을 동그랗게 모아 "노"라고 발음합니다.',
      mnemonic: '금지(NO) 표지판의 둥근 원 모양을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「の」는 몇 획으로 쓰나요?',
        choices: ['1획', '2획', '3획'],
        answer: 0
      },
      strokes: [
        { d: 'M 54 24 C 34 24, 20 40, 22 58 C 24 72, 42 74, 56 64 C 70 54, 74 34, 58 24', tip: '1획: 위에서 시작해 한 바퀴 둥글게 돌아 아래로 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🥤', jp: 'のみもの', romaji: 'nomimono', meaning: '음료' },
        { emoji: '👖', jp: 'のぼる', romaji: 'noboru', meaning: '오르다' },
        { jp: 'のど', romaji: 'nodo', meaning: '목구멍' }
      ],
      examples: [
        { jp: 'つめたい のみものを のみます。', romaji: 'tsumetai nomimono o nomimasu.', meaning: '차가운 음료를 마십니다.' },
        { jp: 'やまに のぼります。', romaji: 'yama ni noborimasu.', meaning: '산에 오릅니다.' }
      ]
    },

    // ==================== は행 ====================
    {
      id: 'h_ha', category: 'hiragana', row: 'は행', jp: 'は', romaji: 'ha', meaning: '하',
      pronTip: '입을 크게 벌리고 숨을 부드럽게 내쉬며 "하"라고 발음합니다.',
      mnemonic: '하하 웃는 사람의 옆모습입니다.',
      mnemonicQuiz: {
        q: '「は」의 발음은?',
        choices: ['ha (하)', 'hi (히)', 'ho (호)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 24 C 20 46, 20 66, 26 78', tip: '1획: 왼쪽 세로획을 내려긋습니다.' },
        { d: 'M 44 34 L 74 32', tip: '2획: 오른쪽 위 가로획을 긋습니다.' },
        { d: 'M 62 20 L 62 62 C 62 72, 46 76, 44 68 C 42 60, 58 58, 76 72', tip: '3획: 세로로 내려와 고리를 만들고 오른쪽으로 뻗어 나갑니다.' }
      ],
      words: [
        { emoji: '🌸', jp: 'はな', romaji: 'hana', meaning: '꽃 / 코' },
        { emoji: '🍃', jp: 'はっぱ', romaji: 'happa', meaning: '나뭇잎' },
        { jp: 'はれる', romaji: 'hareru', meaning: '개다(날씨)' }
      ],
      examples: [
        { jp: 'きれいな はなが さきます。', romaji: 'kirei na hana ga sakimasu.', meaning: '예쁜 꽃이 핍니다.' },
        { jp: 'きょうは はれています。', romaji: 'kyou wa harete imasu.', meaning: '오늘은 날씨가 맑습니다.' }
      ]
    },
    {
      id: 'h_hi', category: 'hiragana', row: 'は행', jp: 'ひ', romaji: 'hi', meaning: '히',
      pronTip: '입꼬리를 살짝 올리며 "히"라고 발음합니다.',
      mnemonic: '히죽 웃는 입 모양으로 기억하세요.',
      mnemonicQuiz: {
        q: '「ひ」는 몇 획으로 쓰나요?',
        choices: ['1획', '2획', '3획'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 28 C 36 26, 44 28, 42 42 C 40 56, 32 70, 44 76 C 56 82, 72 72, 78 58', tip: '1획: 왼쪽 곡선에서 아래로 내려와 오른쪽으로 크게 휘어 올립니다.' }
      ],
      words: [
        { emoji: '☀️', jp: 'ひかり', romaji: 'hikari', meaning: '빛' },
        { emoji: '🐥', jp: 'ひよこ', romaji: 'hiyoko', meaning: '병아리' },
        { jp: 'ひと', romaji: 'hito', meaning: '사람' }
      ],
      examples: [
        { jp: 'かわいい ひよこが います。', romaji: 'kawaii hiyoko ga imasu.', meaning: '귀여운 병아리가 있습니다.' },
        { jp: 'たくさんの ひとが きます。', romaji: 'takusan no hito ga kimasu.', meaning: '많은 사람이 옵니다.' }
      ]
    },
    {
      id: 'h_fu', category: 'hiragana', row: 'は행', jp: 'ふ', romaji: 'fu', meaning: '후',
      pronTip: '위아래 입술을 살짝 좁혀 바람을 가볍게 내며 "후"라고 발음합니다.',
      mnemonic: '후지산(ふじさん)의 산봉우리와 점들입니다.',
      mnemonicQuiz: {
        q: '「ふ」와 연관된 일본의 대표 산은?',
        choices: ['후지산', '백두산', '한라산'],
        answer: 0
      },
      strokes: [
        { d: 'M 46 18 L 54 24', tip: '1획: 위쪽 점을 찍습니다.' },
        { d: 'M 24 44 C 36 36, 52 38, 52 54 C 52 68, 38 78, 22 80', tip: '2획: 왼쪽 산봉우리 곡선을 그립니다.' },
        { d: 'M 64 34 L 72 42', tip: '3획: 오른쪽 위 점을 찍습니다.' },
        { d: 'M 74 56 L 82 66', tip: '4획: 오른쪽 아래 점을 찍습니다.' }
      ],
      words: [
        { emoji: '🗻', jp: 'ふじさん', romaji: 'fujisan', meaning: '후지산' },
        { emoji: '❄️', jp: 'ふゆ', romaji: 'fuyu', meaning: '겨울' },
        { jp: 'ふね', romaji: 'fune', meaning: '배' }
      ],
      examples: [
        { jp: 'ふゆは さむいです。', romaji: 'fuyu wa samui desu.', meaning: '겨울은 춥습니다.' },
        { jp: 'うみに ふねが あります。', romaji: 'umi ni fune ga arimasu.', meaning: '바다에 배가 있습니다.' }
      ]
    },
    {
      id: 'h_he', category: 'hiragana', row: 'は행', jp: 'へ', romaji: 'he', meaning: '헤',
      pronTip: '입을 자연스럽게 벌리고 "헤"라고 발음합니다.',
      mnemonic: '산 정상으로 올라갔다 내려가는 능선(∧)입니다.',
      mnemonicQuiz: {
        q: '「へ」의 모양으로 연상하기 좋은 것은?',
        choices: ['산 능선 모양', '동그라미', '네모 상자'],
        answer: 0
      },
      strokes: [
        { d: 'M 20 68 L 46 32 L 80 68', tip: '1획: 왼쪽 아래에서 위로 올라갔다가 오른쪽 아래로 내려긋습니다.' }
      ],
      words: [
        { emoji: '🐍', jp: 'へび', romaji: 'hebi', meaning: '뱀' },
        { emoji: '🏠', jp: 'へや', romaji: 'heya', meaning: '방' },
        { jp: 'へいわ', romaji: 'heiwa', meaning: '평화' }
      ],
      examples: [
        { jp: 'ひろい へやです。', romaji: 'hiroi heya desu.', meaning: '넓은 방입니다.' },
        { jp: 'へいわな せかい', romaji: 'heiwa na sekai', meaning: '평화로운 세계' }
      ]
    },
    {
      id: 'h_ho', category: 'hiragana', row: 'は행', jp: 'ほ', romaji: 'ho', meaning: '호',
      pronTip: '입술을 동그랗게 모아 "호"라고 발음합니다.',
      mnemonic: '호수(ほ) 위에 돛단배가 떠 있는 모습입니다.',
      mnemonicQuiz: {
        q: '「ほ」의 발음은?',
        choices: ['ho (호)', 'ha (하)', 'hi (히)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 24 C 20 46, 20 66, 26 78', tip: '1획: 왼쪽 세로획을 내려긋습니다.' },
        { d: 'M 42 26 L 74 24', tip: '2획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 40 42 L 76 40', tip: '3획: 두 번째 가로획을 긋습니다.' },
        { d: 'M 60 14 L 60 62 C 60 72, 46 76, 44 68 C 42 60, 58 58, 76 72', tip: '4획: 세로로 내려와 고리를 만들고 오른쪽으로 뻗어 나갑니다.' }
      ],
      words: [
        { emoji: '⭐', jp: 'ほし', romaji: 'hoshi', meaning: '별' },
        { emoji: '📚', jp: 'ほん', romaji: 'hon', meaning: '책' },
        { jp: 'ほてる', romaji: 'hoteru', meaning: '호텔' }
      ],
      examples: [
        { jp: 'よるに ほしが ひかります。', romaji: 'yoru ni hoshi ga hikarimasu.', meaning: '밤에 별이 빛납니다.' },
        { jp: 'ほんを よみます。', romaji: 'hon o yomimasu.', meaning: '책을 읽습니다.' }
      ]
    },

    // ==================== ま행 ====================
    {
      id: 'h_ma', category: 'hiragana', row: 'ま행', jp: 'ま', romaji: 'ma', meaning: '마',
      pronTip: '입술을 가볍게 다물었다 떼며 "마"라고 발음합니다.',
      mnemonic: '마스크(ma) 끈을 묶은 모양을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「ま」의 발음은?',
        choices: ['ma (마)', 'mi (미)', 'mo (모)'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 28 L 68 24', tip: '1획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 24 46 L 68 42', tip: '2획: 두 번째 가로획을 긋습니다.' },
        { d: 'M 52 14 L 54 66 C 42 66, 30 72, 36 80 C 42 84, 58 82, 66 76', tip: '3획: 세로로 내려와 아래 곡선을 감습니다.' }
      ],
      words: [
        { emoji: '🪟', jp: 'まど', romaji: 'mado', meaning: '창문' },
        { emoji: '🏘️', jp: 'まち', romaji: 'machi', meaning: '마을 / 도시' },
        { jp: 'まめ', romaji: 'mame', meaning: '콩' }
      ],
      examples: [
        { jp: 'まどを あけます。', romaji: 'mado o akemasu.', meaning: '창문을 엽니다.' },
        { jp: 'にぎやかな まちです。', romaji: 'nigiyaka na machi desu.', meaning: '활기찬 도시입니다.' }
      ]
    },
    {
      id: 'h_mi', category: 'hiragana', row: 'ま행', jp: 'み', romaji: 'mi', meaning: '미',
      pronTip: '입술을 가볍게 다물었다 떼며 "미"라고 발음합니다.',
      mnemonic: '숫자 21을 흘려 쓴 듯한 모양입니다.',
      mnemonicQuiz: {
        q: '「み」의 로마자 표기는?',
        choices: ['mi', 'mu', 'me'],
        answer: 0
      },
      strokes: [
        { d: 'M 34 22 C 48 20, 56 32, 48 48 C 40 64, 24 68, 22 58 C 20 48, 44 46, 62 56 C 72 62, 74 74, 62 80', tip: '1획: 위쪽 곡선에서 내려와 고리를 만들고 오른쪽 아래로 이어 긋습니다.' },
        { d: 'M 64 26 L 72 34', tip: '2획: 오른쪽 위에 점을 찍습니다.' }
      ],
      words: [
        { emoji: '🍊', jp: 'みかん', romaji: 'mikan', meaning: '귤' },
        { emoji: '💧', jp: 'みず', romaji: 'mizu', meaning: '물' },
        { jp: 'みち', romaji: 'michi', meaning: '길' }
      ],
      examples: [
        { jp: 'つめたい みずを のみます。', romaji: 'tsumetai mizu o nomimasu.', meaning: '차가운 물을 마십니다.' },
        { jp: 'みかんを たべます。', romaji: 'mikan o tabemasu.', meaning: '귤을 먹습니다.' }
      ]
    },
    {
      id: 'h_mu', category: 'hiragana', row: 'ま행', jp: 'む', romaji: 'mu', meaning: '무',
      pronTip: '입술을 가볍게 다물었다 떼며 "무"라고 발음합니다.',
      mnemonic: '소가 풀을 뜯으며 "음메/무~" 하는 모습을 연상해보세요.',
      mnemonicQuiz: {
        q: '「む」의 발음은?',
        choices: ['mu (무)', 'ma (마)', 'me (메)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 34 L 74 30', tip: '1획: 가로획을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 48 16 L 42 64 C 34 68, 24 62, 28 52 C 32 42, 54 44, 62 58 C 68 68, 60 80, 46 82', tip: '2획: 세로로 내려와 고리를 만들고 오른쪽으로 감습니다.' },
        { d: 'M 74 56 L 82 66', tip: '3획: 오른쪽 아래에 점을 찍습니다.' }
      ],
      words: [
        { emoji: '🐛', jp: 'むし', romaji: 'mushi', meaning: '벌레' },
        { emoji: '🎀', jp: 'むすぶ', romaji: 'musubu', meaning: '묶다' },
        { jp: 'むこう', romaji: 'mukou', meaning: '저쪽 / 맞은편' }
      ],
      examples: [
        { jp: 'くつひもを むすびます。', romaji: 'kutsuhimo o musubimasu.', meaning: '신발 끈을 묶습니다.' },
        { jp: 'むこうに えきが みえます。', romaji: 'mukou ni eki ga miemasu.', meaning: '저쪽에 역이 보입니다.' }
      ]
    },
    {
      id: 'h_me', category: 'hiragana', row: 'ま행', jp: 'め', romaji: 'me', meaning: '메',
      pronTip: '입술을 가볍게 다물었다 떼며 "메"라고 발음합니다.',
      mnemonic: '눈(目) 또는 엉킨 실타래·국수 가락을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「め」의 발음은?',
        choices: ['me (메)', 'mi (미)', 'mo (모)'],
        answer: 0
      },
      strokes: [
        { d: 'M 36 22 L 48 64', tip: '1획: 왼쪽 위에서 오른쪽 아래로 사선으로 긋습니다.' },
        { d: 'M 64 24 C 66 46, 52 68, 32 72 C 18 74, 18 54, 38 42 C 58 30, 78 38, 78 58 C 78 72, 66 80, 52 82', tip: '2획: 내려오며 크게 감아 돌리고 오른쪽 아래 꼬리까지 이어 긋습니다.' }
      ],
      words: [
        { emoji: '👀', jp: 'め', romaji: 'me', meaning: '눈' },
        { emoji: '🌱', jp: 'め', romaji: 'me', meaning: '새싹' },
        { jp: 'めがね', romaji: 'megane', meaning: '안경' }
      ],
      examples: [
        { jp: 'めがねを かけます。', romaji: 'megane o kakemasu.', meaning: '안경을 씁니다.' },
        { jp: 'はるに めが でます。', romaji: 'haru ni me ga demasu.', meaning: '봄에 새싹이 납니다.' }
      ]
    },
    {
      id: 'h_mo', category: 'hiragana', row: 'ま행', jp: 'も', romaji: 'mo', meaning: '모',
      pronTip: '입술을 가볍게 다물었다 떼며 "모"라고 발음합니다.',
      mnemonic: '낚싯바늘에 미끼가 더(More) 달린 모습입니다.',
      mnemonicQuiz: {
        q: '「も」는 몇 획으로 쓰나요?',
        choices: ['3획', '1획', '5획'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 18 C 38 42, 34 62, 42 74 C 50 84, 68 80, 76 68', tip: '1획: 위에서 아래로 길게 내려와 오른쪽으로 휘어 올립니다.' },
        { d: 'M 24 36 L 62 32', tip: '2획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 22 52 L 60 48', tip: '3획: 아래쪽 가로획을 긋습니다.' }
      ],
      words: [
        { emoji: '🍑', jp: 'もも', romaji: 'momo', meaning: '복숭아' },
        { emoji: '🌲', jp: 'もり', romaji: 'mori', meaning: '숲' },
        { jp: 'もの', romaji: 'mono', meaning: '물건' }
      ],
      examples: [
        { jp: 'あまい ももを たべます。', romaji: 'amai momo o tabemasu.', meaning: '달콤한 복숭아를 먹습니다.' },
        { jp: 'もりで さんぽします。', romaji: 'mori de sanpo shimasu.', meaning: '숲에서 산책합니다.' }
      ]
    },

    // ==================== や행 ====================
    {
      id: 'h_ya', category: 'hiragana', row: 'や행', jp: 'や', romaji: 'ya', meaning: '야',
      pronTip: '입을 넓게 벌리며 "야"라고 발음합니다.',
      mnemonic: '야크(Yak)의 뿔과 머리 모양을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「や」의 로마자 표기는?',
        choices: ['ya', 'yu', 'yo'],
        answer: 0
      },
      strokes: [
        { d: 'M 20 46 C 36 40, 56 32, 62 44 C 66 54, 52 68, 38 72', tip: '1획: 왼쪽에서 올라가 꺾어 내려오며 곡선을 긋습니다.' },
        { d: 'M 42 16 L 46 82', tip: '2획: 가운데 세로획을 위에서 아래로 길게 긋습니다.' },
        { d: 'M 68 20 L 74 68', tip: '3획: 오른쪽 세로획을 위에서 아래로 긋습니다.' }
      ],
      words: [
        { emoji: '⛰️', jp: 'やま', romaji: 'yama', meaning: '산' },
        { emoji: '🔥', jp: 'やきにく', romaji: 'yakiniku', meaning: '야키니쿠 / 고기구이' },
        { jp: 'やすみ', romaji: 'yasumi', meaning: '휴일 / 쉬는 날' }
      ],
      examples: [
        { jp: 'やまに いきます。', romaji: 'yama ni ikimasu.', meaning: '산에 갑니다.' },
        { jp: 'きょうは やすみです。', romaji: 'kyou wa yasumi desu.', meaning: '오늘은 휴일입니다.' }
      ]
    },
    {
      id: 'h_yu', category: 'hiragana', row: 'や행', jp: 'ゆ', romaji: 'yu', meaning: '유',
      pronTip: '입술을 살짝 오므리며 "유"라고 발음합니다.',
      mnemonic: '물고기가 헤엄치는 옆모습으로 연상해보세요.',
      mnemonicQuiz: {
        q: '「ゆ」의 발음은?',
        choices: ['yu (유)', 'ya (야)', 'yo (요)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 28 C 20 48, 22 64, 30 74', tip: '1획: 왼쪽 세로획을 휘어 내려긋습니다.' },
        { d: 'M 28 52 C 42 36, 68 34, 72 54 C 74 68, 56 78, 38 76 M 56 18 L 56 64', tip: '2획: 곡선으로 감아 돌고 세로획을 관통하듯 내립니다.' }
      ],
      words: [
        { emoji: '❄️', jp: 'ゆき', romaji: 'yuki', meaning: '눈' },
        { emoji: '♨️', jp: 'おゆ', romaji: 'oyu', meaning: '뜨거운 물' },
        { jp: 'ゆめ', romaji: 'yume', meaning: '꿈' }
      ],
      examples: [
        { jp: 'ゆきが ふります。', romaji: 'yuki ga furimasu.', meaning: '눈이 내립니다.' },
        { jp: 'おおきな ゆめを みます。', romaji: 'ookina yume o mimasu.', meaning: '큰 꿈을 꿉니다.' }
      ]
    },
    {
      id: 'h_yo', category: 'hiragana', row: 'や행', jp: 'よ', romaji: 'yo', meaning: '요',
      pronTip: '입술을 동그랗게 모아 "요"라고 발음합니다.',
      mnemonic: '줄에 매달린 요요(Yo-yo) 장난감을 떠올려 보세요.',
      mnemonicQuiz: {
        q: '「よ」와 연관된 장난감은?',
        choices: ['요요(Yo-yo)', '팽이', '공'],
        answer: 0
      },
      strokes: [
        { d: 'M 36 42 L 66 38', tip: '1획: 가로획을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 52 16 L 54 68 C 42 66, 28 72, 34 80 C 40 84, 58 82, 68 74', tip: '2획: 세로획을 길게 내려 긋고 아래쪽 고리를 감습니다.' }
      ],
      words: [
        { emoji: '🌙', jp: 'よる', romaji: 'yoru', meaning: '밤' },
        { emoji: '⛵', jp: 'よっと', romaji: 'yotto', meaning: '요트' },
        { jp: 'よむ', romaji: 'yomu', meaning: '읽다' }
      ],
      examples: [
        { jp: 'よるに ほんを よみます。', romaji: 'yoru ni hon o yomimasu.', meaning: '밤에 책을 읽습니다.' },
        { jp: 'うみに よっとが うかびます。', romaji: 'umi ni yotto ga ukabimasu.', meaning: '바다에 요트가 뜹니다.' }
      ]
    },

    // ==================== ら행 ====================
    {
      id: 'h_ra', category: 'hiragana', row: 'ら행', jp: 'ら', romaji: 'ra', meaning: '라',
      pronTip: '혀끝을 윗잇몸에 한 번 가볍게 튕기며 "라"라고 발음합니다.',
      mnemonic: '토끼(Rabbit)가 웅크리고 앉은 모습입니다.',
      mnemonicQuiz: {
        q: '일본어 ら행 발음의 특징으로 알맞은 것은?',
        choices: ['혀끝을 윗잇몸에 가볍게 한 번 튕김', '혀를 입천장 깊숙이 말아 굴림', '입술을 꽉 다물었다 뗌'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 18 L 54 24', tip: '1획: 위쪽 점을 짧게 긋습니다.' },
        { d: 'M 32 36 L 30 66 C 42 54, 68 50, 72 64 C 74 76, 56 84, 34 82', tip: '2획: 내려와 아래 곡선으로 크게 감아 돌립니다.' }
      ],
      words: [
        { emoji: '📻', jp: 'らじお', romaji: 'rajio', meaning: '라디오' },
        { emoji: '🍜', jp: 'らーめん', romaji: 'raamen', meaning: '라면' },
        { jp: 'らいねん', romaji: 'rainen', meaning: '내년' }
      ],
      examples: [
        { jp: 'らじおを ききます。', romaji: 'rajio o kikimasu.', meaning: '라디오를 듣습니다.' },
        { jp: 'あたたかい らーめんを たべます。', romaji: 'atatakai raamen o tabemasu.', meaning: '따뜻한 라면을 먹습니다.' }
      ]
    },
    {
      id: 'h_ri', category: 'hiragana', row: 'ら행', jp: 'り', romaji: 'ri', meaning: '리',
      pronTip: '혀끝을 가볍게 튕기며 "리"라고 발음합니다.',
      mnemonic: '갈대(Reed) 두 줄기가 나란히 흔들리는 모양입니다.',
      mnemonicQuiz: {
        q: '「り」는 몇 획으로 쓰나요?',
        choices: ['2획', '4획', '1획'],
        answer: 0
      },
      strokes: [
        { d: 'M 30 24 C 28 42, 28 56, 32 64', tip: '1획: 왼쪽 획을 위에서 아래로 긋습니다.' },
        { d: 'M 64 20 C 68 44, 68 68, 48 82', tip: '2획: 오른쪽 획을 길게 내려오며 왼쪽으로 휘어 마무리합니다.' }
      ],
      words: [
        { emoji: '🍎', jp: 'りんご', romaji: 'ringo', meaning: '사과' },
        { emoji: '🐿️', jp: 'りす', romaji: 'risu', meaning: '다람쥐' },
        { jp: 'りょうり', romaji: 'ryouri', meaning: '요리' }
      ],
      examples: [
        { jp: 'りんごが すきです。', romaji: 'ringo ga suki desu.', meaning: '사과를 좋아합니다.' },
        { jp: 'りすを みました。', romaji: 'risu o mimashita.', meaning: '다람쥐를 보았습니다.' }
      ]
    },
    {
      id: 'h_ru', category: 'hiragana', row: 'ら행', jp: 'る', romaji: 'ru', meaning: '루',
      pronTip: '혀끝을 가볍게 튕기며 "루"라고 발음합니다.',
      mnemonic: '루비 반지(Ruby ring)를 손에 낀 모양입니다.',
      mnemonicQuiz: {
        q: '「る」의 로마자 표기는?',
        choices: ['ru', 're', 'ro'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 24 L 64 22 L 36 52 C 52 44, 72 48, 72 64 C 72 78, 52 84, 34 80', tip: '1획: 위쪽에서 꺾어 내려와 고리를 그리며 마무리합니다.' }
      ],
      words: [
        { emoji: '💎', jp: 'るびー', romaji: 'rubii', meaning: '루비' },
        { emoji: '🚪', jp: 'るす', romaji: 'rusu', meaning: '부재중 / 집 비움' },
        { jp: 'あるく', romaji: 'aruku', meaning: '걷다' }
      ],
      examples: [
        { jp: 'こうえんを あるきます。', romaji: 'kouen o arukimasu.', meaning: '공원을 걷습니다.' },
        { jp: 'いま るすです。', romaji: 'ima rusu desu.', meaning: '지금 부재중입니다.' }
      ]
    },
    {
      id: 'h_re', category: 'hiragana', row: 'ら행', jp: 'れ', romaji: 're', meaning: '레',
      pronTip: '혀끝을 가볍게 튕기며 "레"라고 발음합니다.',
      mnemonic: '순록(Reindeer)이 달리는 모습으로 연상해보세요.',
      mnemonicQuiz: {
        q: '「れ」의 발음은?',
        choices: ['re (레)', 'ra (라)', 'ru (루)'],
        answer: 0
      },
      strokes: [
        { d: 'M 38 18 L 38 78', tip: '1획: 세로획을 위에서 아래로 길게 긋습니다.' },
        { d: 'M 22 38 C 38 34, 62 28, 66 38 C 70 48, 48 64, 54 74 C 58 80, 70 78, 78 72', tip: '2획: 곡선으로 돌아 아래 꼬리까지 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🍋', jp: 'れもん', romaji: 'remon', meaning: '레몬' },
        { emoji: '🚂', jp: 'れっしゃ', romaji: 'ressha', meaning: '열차' },
        { jp: 'れんしゅう', romaji: 'renshuu', meaning: '연습' }
      ],
      examples: [
        { jp: 'れもんを たべます。', romaji: 'remon o tabemasu.', meaning: '레몬을 먹습니다.' },
        { jp: 'まいにち れんしゅうします。', romaji: 'mainichi renshuu shimasu.', meaning: '매일 연습합니다.' }
      ]
    },
    {
      id: 'h_ro', category: 'hiragana', row: 'ら행', jp: 'ろ', romaji: 'ro', meaning: '로',
      pronTip: '혀끝을 가볍게 튕기며 "로"라고 발음합니다.',
      mnemonic: '끝에 고리가 빠진 숫자 3 모양입니다.',
      mnemonicQuiz: {
        q: '「ろ」는 몇 획으로 쓰나요?',
        choices: ['1획', '2획', '3획'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 24 L 64 22 L 36 52 C 52 44, 72 48, 72 64 C 72 78, 52 84, 34 80', tip: '1획: 위쪽에서 꺾어 내려와 둥글게 감아 마무리합니다.' }
      ],
      words: [
        { emoji: '🤖', jp: 'ろぼっと', romaji: 'robotto', meaning: '로봇' },
        { emoji: '🕯️', jp: 'ろうそく', romaji: 'rousoku', meaning: '양초' },
        { jp: 'ろく', romaji: 'roku', meaning: '육(6)' }
      ],
      examples: [
        { jp: 'ろぼっとが うごきます。', romaji: 'robotto ga ugokimasu.', meaning: '로봇이 움직입니다.' },
        { jp: 'ろうそくに ひを つけます。', romaji: 'rousoku ni hi o tsukemasu.', meaning: '양초에 불을 켭니다.' }
      ]
    },

    // ==================== わ행 ====================
    {
      id: 'h_wa', category: 'hiragana', row: 'わ행', jp: 'わ', romaji: 'wa', meaning: '와',
      pronTip: '입술을 살짝 오므렸다 넓게 벌리며 "와"라고 발음합니다.',
      mnemonic: '백조(Swan)가 목을 구부린 우아한 모습입니다.',
      mnemonicQuiz: {
        q: '「わ」의 발음은?',
        choices: ['wa (와)', 'wo (오)', 'n (응)'],
        answer: 0
      },
      strokes: [
        { d: 'M 38 18 L 38 78', tip: '1획: 세로획을 위에서 아래로 길게 긋습니다.' },
        { d: 'M 22 38 C 38 34, 62 28, 66 38 C 70 48, 48 64, 54 74 C 58 80, 70 78, 78 72', tip: '2획: 곡선으로 돌아 아래쪽 꼬리까지 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🦢', jp: 'わに', romaji: 'wani', meaning: '악어' },
        { emoji: '💍', jp: 'わ', romaji: 'wa', meaning: '고리 / 원' },
        { jp: 'わたし', romaji: 'watashi', meaning: '나 / 저' }
      ],
      examples: [
        { jp: 'わたしは がくせいです。', romaji: 'watashi wa gakusei desu.', meaning: '저는 학생입니다.' },
        { jp: 'かわに わにが います。', romaji: 'kawa ni wani ga imasu.', meaning: '강에 악어가 있습니다.' }
      ]
    },
    {
      id: 'h_wo', category: 'hiragana', row: 'わ행', jp: 'を', romaji: 'wo', meaning: '오(조사)',
      pronTip: '문장 속 목적격 조사로 쓰일 때는 주로 "오"에 가깝게 발음합니다.',
      mnemonic: '장애물을 뛰어넘는 사람 모양으로 기억하세요.',
      mnemonicQuiz: {
        q: '「を」는 주로 어떤 역할로 쓰이나요?',
        choices: ['목적격 조사(~을/를)', '형용사 어미', '숫자'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 34 L 54 32', tip: '1획: 위쪽 가로획을 긋습니다.' },
        { d: 'M 38 16 C 34 40, 24 64, 16 78', tip: '2획: 사선으로 내려긋습니다.' },
        { d: 'M 32 58 C 46 48, 70 48, 74 64 C 76 76, 56 84, 38 80', tip: '3획: 오른쪽 아래에서 곡선을 크게 감아 돌립니다.' }
      ],
      words: [
        { jp: 'ほんを よむ', romaji: 'hon o yomu', meaning: '책을 읽다' },
        { jp: 'みずを のむ', romaji: 'mizu o nomu', meaning: '물을 마시다' }
      ],
      examples: [
        { jp: 'りんごを たべます。', romaji: 'ringo o tabemasu.', meaning: '사과를 먹습니다.' },
        { jp: 'おんがくを ききます。', romaji: 'ongaku o kikimasu.', meaning: '음악을 듣습니다.' }
      ]
    },
    {
      id: 'h_n', category: 'hiragana', row: 'わ행', jp: 'ん', romaji: 'n', meaning: '응(받침)',
      pronTip: '독립된 모음이 아니라 앞 음절 뒤의 받침(ㄴ/ㅁ/ㅇ)처럼 부드럽게 이어 발음합니다.',
      mnemonic: '알파벳 소문자 n을 닮은 글자입니다.',
      mnemonicQuiz: {
        q: '「ん」의 특징으로 알맞은 것은?',
        choices: ['앞소리에 이어지는 받침 역할', '항상 첫 글자로만 씀', '장음 기호 역할'],
        answer: 0
      },
      strokes: [
        { d: 'M 34 24 C 30 46, 26 64, 24 76 C 34 56, 48 44, 56 54 C 62 62, 58 76, 74 72', tip: '1획: 왼쪽에서 내려와 꺾어 올라간 뒤 오른쪽 아래로 이어 긋습니다.' }
      ],
      words: [
        { emoji: '🍞', jp: 'ぱん', romaji: 'pan', meaning: '빵' },
        { emoji: '🚆', jp: 'でんしゃ', romaji: 'densha', meaning: '전철' },
        { jp: 'ほん', romaji: 'hon', meaning: '책' }
      ],
      examples: [
        { jp: 'でんしゃに のります。', romaji: 'densha ni norimasu.', meaning: '전철을 탑니다.' },
        { jp: 'あたたかい ぱんを たべます。', romaji: 'atatakai pan o tabemasu.', meaning: '따뜻한 빵을 먹습니다.' }
      ]
    }
  ];

  global.HIRAGANA_DATA = HIRAGANA_DATA;
})(window);