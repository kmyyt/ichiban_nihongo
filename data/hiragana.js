// 히라가나 46자 데이터 + 6단계 연상기법 및 심화 발음 규칙 (window.HIRAGANA_DATA, window.HIRAGANA_ADVANCED_RULES)
(function (global) {
  const HIRAGANA_DATA = [
    // ==================== 1. 모음 (あ행) ====================
    {
      id: 'h_a',
      category: 'hiragana',
      row: 'あ행',
      jp: 'あ',
      romaji: 'a',
      meaning: '아',
      pronTip: '입을 크게 벌려 "아"라고 맑고 짧게 발음합니다.',
      mnemonic: '아기를 안은 엄마의 모습에서 유래한 모양으로 연상해 보세요.',
      mnemonicQuiz: {
        q: '「あ」의 연상 기법으로 알맞은 것은?',
        choices: ['아기를 안은 엄마', '이빨 모양', '우산 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 28 L 76 28', tip: '1획: 왼쪽에서 오른쪽으로 가로선을 긋습니다.' },
        { d: 'M 48 15 L 48 82', tip: '2획: 위에서 아래로 세로선을 긋습니다.' },
        { d: 'M 68 38 C 34 38, 22 60, 32 76 C 42 88, 72 82, 74 62 C 76 44, 54 38, 36 48', tip: '3획: 아기를 안은 곡선을 그리며 마무리합니다.' }
      ],
      words: [
        { emoji: '🌅', jp: 'あさ', romaji: 'asa', meaning: '아침' },
        { emoji: '🦶', jp: 'あし', romaji: 'ashi', meaning: '발 / 다리' },
        { emoji: '🍬', jp: 'あめ', romaji: 'ame', meaning: '사탕 / 비' }
      ],
      examples: [
        { jp: 'あさが きました。', romaji: 'asa ga kimashita.', meaning: '아침이 왔습니다.' },
        { jp: 'あめを たべます。', romaji: 'ame o tabemasu.', meaning: '사탕을 먹습니다.' }
      ]
    },
    {
      id: 'h_i',
      category: 'hiragana',
      row: 'あ행',
      jp: 'い',
      romaji: 'i',
      meaning: '이',
      pronTip: '입술을 옆으로 살짝 당기며 "이"라고 발음합니다.',
      mnemonic: '이빨 모양을 떠올리며 "이(i)" 소리와 연결해 보세요.',
      mnemonicQuiz: {
        q: '「い」의 모양 연상으로 알맞은 것은?',
        choices: ['이빨 모양', '카메라', '오리'],
        answer: 0
      },
      strokes: [
        { d: 'M 32 24 C 24 46, 26 70, 38 78 C 44 82, 50 74, 52 64', tip: '1획: 왼쪽 세로 획을 부드럽게 휘어 내립니다.' },
        { d: 'M 72 28 C 76 46, 78 64, 74 78', tip: '2획: 오른쪽 획을 위에서 아래로 살짝 휘어 긋습니다.' }
      ],
      words: [
        { emoji: '🐕', jp: 'いぬ', romaji: 'inu', meaning: '개 / 강아지' },
        { emoji: '🌊', jp: 'うみ', romaji: 'umi', meaning: '바다' },
        { emoji: '🏠', jp: 'いえ', romaji: 'ie', meaning: '집' }
      ],
      examples: [
        { jp: 'いぬが います。', romaji: 'inu ga imasu.', meaning: '강아지가 있습니다.' },
        { jp: 'いえに かえります。', romaji: 'ie ni kaerimasu.', meaning: '집에 돌아갑니다.' }
      ]
    },
    {
      id: 'h_u',
      category: 'hiragana',
      row: 'あ행',
      jp: 'う',
      romaji: 'u',
      meaning: '우',
      pronTip: '입술을 너무 앞으로 내밀지 않고 자연스럽게 "우"라고 발음합니다.',
      mnemonic: '우산 모양을 떠올리며 "우(u)" 발음과 함께 기억해 보세요.',
      mnemonicQuiz: {
        q: '「う」의 연상 기법으로 알맞은 것은?',
        choices: ['우산', '사과', '타조'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 18 L 58 24', tip: '1획: 위쪽의 짧은 점을 찍듯 긋습니다.' },
        { d: 'M 24 40 C 44 32, 74 34, 74 56 C 74 74, 54 84, 38 86', tip: '2획: 우산 곡선처럼 휘어 아래로 크게 감아 내립니다.' }
      ],
      words: [
        { emoji: '🌊', jp: 'うみ', romaji: 'umi', meaning: '바다' },
        { emoji: '🐇', jp: 'うさぎ', romaji: 'usagi', meaning: '토끼' },
        { emoji: '🎶', jp: 'うた', romaji: 'uta', meaning: '노래' }
      ],
      examples: [
        { jp: 'うみが きれいです。', romaji: 'umi ga kirei desu.', meaning: '바다가 예쁩니다.' },
        { jp: 'うさぎが います。', romaji: 'usagi ga imasu.', meaning: '토끼가 있습니다.' }
      ]
    },
    {
      id: 'h_e',
      category: 'hiragana',
      row: 'あ행',
      jp: 'え',
      romaji: 'e',
      meaning: '에',
      pronTip: '입을 반쯤 열고 "에"라고 또렷하게 발음합니다.',
      mnemonic: '에어로빅 동작을 연상하며 "에(e)" 소리를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「え」의 연상 기법으로 알맞은 것은?',
        choices: ['에어로빅', '소라', '나비'],
        answer: 0
      },
      strokes: [
        { d: 'M 44 18 L 56 25', tip: '1획: 위쪽 점을 짧게 찍습니다.' },
        { d: 'M 22 38 L 76 38 L 42 64 C 54 56, 74 56, 76 72 C 78 84, 58 86, 46 80', tip: '2획: 가로선 후 지그재그와 곡선으로 이어 씁니다.' }
      ],
      words: [
        { emoji: '🚉', jp: 'えき', romaji: 'eki', meaning: '역' },
        { emoji: '🖼️', jp: 'え', romaji: 'e', meaning: '그림' },
        { emoji: '✏️', jp: 'えんぴつ', romaji: 'enpitsu', meaning: '연필' }
      ],
      examples: [
        { jp: 'えきへ いきます。', romaji: 'eki e ikimasu.', meaning: '역으로 갑니다.' },
        { jp: 'えを かきます。', romaji: 'e o kakimasu.', meaning: '그림을 그립니다.' }
      ]
    },
    {
      id: 'h_o',
      category: 'hiragana',
      row: 'あ행',
      jp: 'お',
      romaji: 'o',
      meaning: '오',
      pronTip: '입술을 동그랗게 모아 "오"라고 발음합니다.',
      mnemonic: '오리 모양을 떠올리며 "오(o)" 발음과 연결해 보세요.',
      mnemonicQuiz: {
        q: '「お」의 연상 기법으로 알맞은 것은?',
        choices: ['오리', '기타', '치타'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 32 L 78 32', tip: '1획: 가로선을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 52 16 L 52 78 C 52 86, 40 86, 30 78 C 20 70, 32 54, 54 52 C 74 50, 82 64, 72 76 C 64 84, 48 76, 44 64', tip: '2획: 세로로 내려온 뒤 오리 몸통처럼 아래 곡선을 감아 줍니다.' },
        { d: 'M 78 18 L 84 24', tip: '3획: 오른쪽 위에 점을 찍습니다.' }
      ],
      words: [
        { emoji: '🍵', jp: 'おちゃ', romaji: 'ocha', meaning: '차(녹차 등)' },
        { emoji: '🌙', jp: 'おおきい', romaji: 'ookii', meaning: '크다' },
        { emoji: '🌸', jp: 'おはな', romaji: 'ohana', meaning: '꽃(정중 표현)' }
      ],
      examples: [
        { jp: 'おちゃを のみます。', romaji: 'ocha o nomimasu.', meaning: '차를 마십니다.' },
        { jp: 'おはなが きれいです。', romaji: 'ohana ga kirei desu.', meaning: '꽃이 예쁩니다.' }
      ]
    },

    // ==================== 2. 카행 (か~こ) ====================
    {
      id: 'h_ka',
      category: 'hiragana',
      row: 'か행',
      jp: 'か',
      romaji: 'ka',
      meaning: '카',
      pronTip: '목구멍 뒤쪽에서 "카"라고 가볍게 발음합니다.',
      mnemonic: '카메라 모양을 떠올리며 "카(ka)"를 연상해 보세요.',
      mnemonicQuiz: {
        q: '「か」의 연상 기법으로 알맞은 것은?',
        choices: ['카메라', '쿠션', '토끼 귀'],
        answer: 0
      },
      strokes: [
        { d: 'M 20 42 C 42 38, 62 36, 62 52 C 62 70, 48 80, 36 74', tip: '1획: 왼쪽에서 시작해 휘어 내려옵니다.' },
        { d: 'M 42 20 L 34 80', tip: '2획: 세로 방향으로 길게 긋습니다.' },
        { d: 'M 72 26 L 82 44', tip: '3획: 오른쪽에 짧은 획을 긋습니다.' }
      ],
      words: [
        { emoji: '🔑', jp: 'かぎ', romaji: 'kagi', meaning: '열쇠' },
        { emoji: '🌂', jp: 'かさ', romaji: 'kasa', meaning: '우산' },
        { emoji: '👦', jp: 'かれ', romaji: 'kare', meaning: '그 / 남자친구' }
      ],
      examples: [
        { jp: 'かさが あります。', romaji: 'kasa ga arimasu.', meaning: '우산이 있습니다.' },
        { jp: 'かぎを わすれました。', romaji: 'kagi o wasuremashita.', meaning: '열쇠를 잊어버렸습니다.' }
      ]
    },
    {
      id: 'h_ki',
      category: 'hiragana',
      row: 'か행',
      jp: 'き',
      romaji: 'ki',
      meaning: '키',
      pronTip: '"키"라고 맑게 발음합니다.',
      mnemonic: '기타 모양을 연상하며 "키(ki)" 발음과 연결해 보세요.',
      mnemonicQuiz: {
        q: '「き」의 연상 기법으로 알맞은 것은?',
        choices: ['기타', '계산기', '소라'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 28 L 72 24', tip: '1획: 위 가로선을 긋습니다.' },
        { d: 'M 24 46 L 74 42', tip: '2획: 아래 가로선을 긋습니다.' },
        { d: 'M 52 14 L 56 64 C 38 66, 30 74, 38 82 C 46 88, 64 84, 72 78', tip: '3획: 세로축을 내린 뒤 기타 바디처럼 아래 곡선을 긋습니다.' }
      ],
      words: [
        { emoji: '🌳', jp: 'き', romaji: 'ki', meaning: '나무' },
        { emoji: '🚉', jp: 'えき', romaji: 'eki', meaning: '역' },
        { emoji: '👂', jp: 'きく', romaji: 'kiku', meaning: '듣다 / 묻다' }
      ],
      examples: [
        { jp: 'おおきな きが あります。', romaji: 'ookina ki ga arimasu.', meaning: '큰 나무가 있습니다.' },
        { jp: 'おんがくを ききます。', romaji: 'ongaku o kikimasu.', meaning: '음악을 듣습니다.' }
      ]
    },
    {
      id: 'h_ku',
      category: 'hiragana',
      row: 'か행',
      jp: 'く',
      romaji: 'ku',
      meaning: '쿠',
      pronTip: '입술을 살짝 오므리며 "쿠"라고 발음합니다.',
      mnemonic: '푹신한 쿠션 모양을 떠올리며 "쿠(ku)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「く」의 연상 기법으로 알맞은 것은?',
        choices: ['쿠션', '나비', '바구니'],
        answer: 0
      },
      strokes: [
        { d: 'M 66 22 L 32 50 L 68 80', tip: '1획: 왼쪽으로 꺾였다가 오른쪽 아래로 뻗는 한 획으로 씁니다.' }
      ],
      words: [
        { emoji: '👟', jp: 'くつ', romaji: 'kutsu', meaning: '신발' },
        { emoji: '☁️', jp: 'くも', romaji: 'kumo', meaning: '구름 / 거미' },
        { emoji: '🐻', jp: 'くま', romaji: 'kuma', meaning: '곰' }
      ],
      examples: [
        { jp: 'あたらしい くつを かいます。', romaji: 'atarashii kutsu o kaimasu.', meaning: '새 신발을 삽니다.' },
        { jp: 'しろい くもが うかんでいます。', romaji: 'shiroi kumo ga ukande imasu.', meaning: '하얀 구름이 떠 있습니다.' }
      ]
    },
    {
      id: 'h_ke',
      category: 'hiragana',
      row: 'か행',
      jp: 'け',
      romaji: 'ke',
      meaning: '케',
      pronTip: '"케"라고 명료하게 발음합니다.',
      mnemonic: '계산기 모양을 떠올리며 "케(ke)" 소리와 연결해 보세요.',
      mnemonicQuiz: {
        q: '「け」의 연상 기법으로 알맞은 것은?',
        choices: ['계산기', '사과', '그네'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 24 L 24 80', tip: '1획: 왼쪽 세로 획을 아래로 긋습니다.' },
        { d: 'M 18 46 C 36 44, 52 38, 54 54 C 54 66, 44 72, 36 68', tip: '2획: 왼쪽에서 뻗어 나와 둥글게 감습니다.' },
        { d: 'M 68 20 L 70 84', tip: '3획: 오른쪽 세로 획을 위에서 아래로 길게 긋습니다.' }
      ],
      words: [
        { emoji: '🍰', jp: 'けーき', romaji: 'keeki', meaning: '케이크' },
        { emoji: '⏰', jp: 'とけい', romaji: 'tokei', meaning: '시계' },
        { emoji: '🗓️', jp: 'げつようび', romaji: 'getsuyoubi', meaning: '월요일' }
      ],
      examples: [
        { jp: 'けーきを たべます。', romaji: 'keeki o tabemasu.', meaning: '케이크를 먹습니다.' },
        { jp: 'とけいを みます。', romaji: 'tokei o mimasu.', meaning: '시계를 봅니다.' }
      ]
    },
    {
      id: 'h_ko',
      category: 'hiragana',
      row: 'か행',
      jp: 'こ',
      romaji: 'ko',
      meaning: '코',
      pronTip: '"코"라고 가볍게 발음합니다.',
      mnemonic: '코끼리 등과 배 모양을 떠올리며 "코(ko)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「こ」의 연상 기법으로 알맞은 것은?',
        choices: ['코끼리 등과 배', '낚시바늘', '타조'],
        answer: 0
      },
      strokes: [
        { d: 'M 32 30 C 48 26, 66 28, 70 36', tip: '1획: 코끼리 등처럼 위쪽 곡선을 긋습니다.' },
        { d: 'M 28 62 C 28 76, 48 78, 72 72', tip: '2획: 코끼리 배처럼 아래쪽을 둥글게 긋습니다.' }
      ],
      words: [
        { emoji: '👶', jp: 'こども', romaji: 'kodomo', meaning: '어린이 / 아이' },
        { emoji: '❤️', jp: 'こころ', romaji: 'kokoro', meaning: '마음' },
        { emoji: '🗣️', jp: 'こえ', romaji: 'koe', meaning: '목소리' }
      ],
      examples: [
        { jp: 'こどもが あそんでいます。', romaji: 'kodomo ga asonde imasu.', meaning: '아이가 놀고 있습니다.' },
        { jp: 'げんきな こえですね。', romaji: 'genki na koe desu ne.', meaning: '활기찬 목소리네요.' }
      ]
    },

    // ==================== 3. 사행 (さ~そ) ====================
    {
      id: 'h_sa',
      category: 'hiragana',
      row: 'さ행',
      jp: 'さ',
      romaji: 'sa',
      meaning: '사',
      pronTip: '혀끝을 윗잇몸 가까이 대고 "사"라고 맑게 발음합니다.',
      mnemonic: '사과 모양을 연상하며 "사(sa)" 발음과 연결해 보세요.',
      mnemonicQuiz: {
        q: '「さ」의 연상 기법으로 알맞은 것은?',
        choices: ['사과', '세면대', '누에'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 30 L 76 28', tip: '1획: 위 가로선을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 22 50 L 76 46', tip: '2획: 두 번째 가로선을 긋습니다.' },
        { d: 'M 54 16 L 56 64 C 44 74, 34 78, 42 84 C 52 88, 66 82, 74 76', tip: '3획: 세로획을 내리고 사과 아래 곡선을 이어 씁니다.' }
      ],
      words: [
        { emoji: '🐟', jp: 'さかな', romaji: 'sakana', meaning: '생선 / 물고기' },
        { emoji: '🌸', jp: 'さくら', romaji: 'sakura', meaning: '벚꽃' },
        { emoji: '朝', jp: 'あさ', romaji: 'asa', meaning: '아침' }
      ],
      examples: [
        { jp: 'さかなを やきます。', romaji: 'sakana o yakimasu.', meaning: '생선을 굽습니다.' },
        { jp: 'さくらが さきました。', romaji: 'sakura ga sakimashita.', meaning: '벚꽃이 피었습니다.' }
      ]
    },
    {
      id: 'h_shi',
      category: 'hiragana',
      row: 'さ행',
      jp: 'し',
      romaji: 'shi',
      meaning: '시',
      pronTip: '입술을 살짝 둥글게 하고 "시"라고 부드럽게 발음합니다.',
      mnemonic: '낚시바늘 모양을 떠올리며 "시(shi)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「し」의 연상 기법으로 알맞은 것은?',
        choices: ['낚시바늘', '스프링', '부추 앞부분'],
        answer: 0
      },
      strokes: [
        { d: 'M 38 18 C 34 44, 34 72, 48 80 C 60 86, 74 76, 78 64', tip: '1획: 낚시바늘처럼 위에서 아래로 내려와 오른쪽으로 휘어 올립니다.' }
      ],
      words: [
        { emoji: '🗺️', jp: 'ちず', romaji: 'chizu', meaning: '지도' },
        { emoji: '白', jp: 'しろい', romaji: 'shiroi', meaning: '하얗다' },
        { emoji: '📖', jp: 'じしょ', romaji: 'jisho', meaning: '사전' }
      ],
      examples: [
        { jp: 'ちずを みます。', romaji: 'chizu o mimasu.', meaning: '지도를 봅니다.' },
        { jp: 'しろい ねこが います。', romaji: 'shiroi neko ga imasu.', meaning: '하얀 고양이가 있습니다.' }
      ]
    },
    {
      id: 'h_su',
      category: 'hiragana',
      row: 'さ행',
      jp: 'す',
      romaji: 'su',
      meaning: '스',
      pronTip: '참고: \'스\'와 \'츠\'는 \'우\'보다 \'으\'에 가깝게 발음합니다.',
      mnemonic: '용수철 스프링 모양을 떠올리며 \'으\'에 가까운 \'스(su)\'를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「す」의 연상 기법과 발음 팁으로 알맞은 것은?',
        choices: ['스프링 (\'우\'보다 \'으\'에 가깝게 발음)', '소라 (강한 \'우\' 발음)', '테이프 (된소리 발음)'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 30 L 78 28', tip: '1획: 가로선을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 56 16 L 56 56 C 56 68, 42 70, 42 58 C 42 46, 62 46, 62 64 C 62 78, 48 86, 36 88', tip: '2획: 세로로 내려와 스프링 고리를 감고 아래로 뻗습니다.' }
      ],
      words: [
        { emoji: '🍉', jp: 'すいか', romaji: 'suika', meaning: '수박' },
        { emoji: '🍣', jp: 'すし', romaji: 'sushi', meaning: '초밥' },
        { emoji: '🎼', jp: 'すき', romaji: 'suki', meaning: '좋아함' }
      ],
      examples: [
        { jp: 'すいかを たべます。', romaji: 'suika o tabemasu.', meaning: '수박을 먹습니다.' },
        { jp: 'すしが すきです。', romaji: 'sushi ga suki desu.', meaning: '초밥을 좋아합니다.' }
      ]
    },
    {
      id: 'h_se',
      category: 'hiragana',
      row: 'さ행',
      jp: 'せ',
      romaji: 'se',
      meaning: '세',
      pronTip: '"세"라고 깔끔하게 발음합니다.',
      mnemonic: '세면대 모양을 연상하며 "세(se)" 발음과 연결해 보세요.',
      mnemonicQuiz: {
        q: '「せ」의 연상 기법으로 알맞은 것은?',
        choices: ['세면대', '사과', '높은음자리표'],
        answer: 0
      },
      strokes: [
        { d: 'M 20 44 L 80 42', tip: '1획: 가로선을 긋습니다.' },
        { d: 'M 36 22 L 36 68 C 36 78, 52 80, 74 78', tip: '2획: 왼쪽 세로획을 내리고 세면대 바닥처럼 오른쪽으로 이어 긋습니다.' },
        { d: 'M 62 18 L 62 56', tip: '3획: 오른쪽 세로획을 위에서 아래로 긋습니다.' }
      ],
      words: [
        { emoji: '🌍', jp: 'せかい', romaji: 'sekai', meaning: '세계' },
        { emoji: '先生', jp: 'せんせい', romaji: 'sensei', meaning: '선생님' },
        { emoji: '背', jp: 'せなか', romaji: 'senaka', meaning: '등' }
      ],
      examples: [
        { jp: 'せんせいに あいます。', romaji: 'sensei ni aimasu.', meaning: '선생님을 만납니다.' },
        { jp: 'せかいを りょこうします。', romaji: 'sekai o ryokou shimasu.', meaning: '세계를 여행합니다.' }
      ]
    },
    {
      id: 'h_so',
      category: 'hiragana',
      row: 'さ행',
      jp: 'そ',
      romaji: 'so',
      meaning: '소',
      pronTip: '"소"라고 또렷하게 발음합니다.',
      mnemonic: '소라 껍질 모양을 떠올리며 "소(so)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「そ」의 연상 기법으로 알맞은 것은?',
        choices: ['소라', '오리', '토끼 귀'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 24 L 68 24 L 34 52 C 52 50, 72 54, 70 68 C 68 80, 48 84, 34 78', tip: '1획: 지그재그와 소라 곡선을 한 획으로 이어 씁니다.' }
      ],
      words: [
        { emoji: '🌌', jp: 'そら', romaji: 'sora', meaning: '하늘' },
        { emoji: '外', jp: 'そと', romaji: 'soto', meaning: '밖' },
        { emoji: '🧦', jp: 'くつした', romaji: 'kutsushita', meaning: '양말' }
      ],
      examples: [
        { jp: 'そらが あおいです。', romaji: 'sora ga aoi desu.', meaning: '하늘이 파랗습니다.' },
        { jp: 'そとに でます。', romaji: 'soto ni demasu.', meaning: '밖에 나갑니다.' }
      ]
    },

    // ==================== 4. 타행 (た~と) ====================
    {
      id: 'h_ta',
      category: 'hiragana',
      row: 'た행',
      jp: 'た',
      romaji: 'ta',
      meaning: '타',
      pronTip: '"타"라고 발음합니다.',
      mnemonic: '타조의 목과 몸통 모양을 떠올리며 "타(ta)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「た」의 연상 기법으로 알맞은 것은?',
        choices: ['타조', '치타', '테이프'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 34 L 74 30', tip: '1획: 가로선을 왼쪽에서 오른쪽으로 긋습니다.' },
        { d: 'M 48 16 L 24 80', tip: '2획: 왼쪽 아래로 길게 사선 획을 긋습니다.' },
        { d: 'M 52 50 C 62 46, 74 48, 76 54', tip: '3획: 오른쪽 위 짧은 곡선을 긋습니다.' },
        { d: 'M 48 64 C 54 76, 68 80, 78 76', tip: '4획: 오른쪽 아래 곡선을 부드럽게 이어 씁니다.' }
      ],
      words: [
        { emoji: '🥚', jp: 'たまご', romaji: 'tamago', meaning: '달걀 / 계란' },
        { emoji: '🎋', jp: 'たけ', romaji: 'take', meaning: '대나무' },
        { emoji: '👣', jp: 'たび', romaji: 'tabi', meaning: '여행' }
      ],
      examples: [
        { jp: 'たまごを たべます。', romaji: 'tamago o tabemasu.', meaning: '달걀을 먹습니다.' },
        { jp: 'たのしい たびでした。', romaji: 'tanoshii tabi deshita.', meaning: '즐거운 여행이었습니다.' }
      ]
    },
    {
      id: 'h_chi',
      category: 'hiragana',
      row: 'た행',
      jp: 'ち',
      romaji: 'chi',
      meaning: '치',
      pronTip: '"치"라고 발음합니다.',
      mnemonic: '치타의 움직임과 옆모습을 떠올리며 "치(chi)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「ち」의 연상 기법으로 알맞은 것은?',
        choices: ['치타', '타조', '부추 앞부분'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 28 L 72 24', tip: '1획: 가로선을 긋습니다.' },
        { d: 'M 48 14 L 44 48 C 58 42, 74 46, 74 64 C 74 78, 56 84, 38 78', tip: '2획: 세로로 내려온 뒤 치타 곡선처럼 감아 씁니다.' }
      ],
      words: [
        { emoji: '🥛', jp: 'ちち', romaji: 'chichi', meaning: '아버지 / 젖' },
        { emoji: '🗺️', jp: 'ちず', romaji: 'chizu', meaning: '지도' },
        { emoji: '⚡', jp: 'ちから', romaji: 'chikara', meaning: '힘' }
      ],
      examples: [
        { jp: 'ちちが かえりました。', romaji: 'chichi ga kaerimashita.', meaning: '아버지가 돌아오셨습니다.' },
        { jp: 'ちからが つきます。', romaji: 'chikara ga tsukimasu.', meaning: '힘이 생깁니다.' }
      ]
    },
    {
      id: 'h_tsu',
      category: 'hiragana',
      row: 'た행',
      jp: 'つ',
      romaji: 'tsu',
      meaning: '츠',
      pronTip: '참고: \'스\'와 \'츠\'는 \'우\'보다 \'으\'에 가깝게 발음합니다.',
      mnemonic: '부추 앞부분 모양을 떠올리며 \'으\'에 가까운 \'츠(tsu)\'를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「つ」의 연상 기법과 발음 팁으로 알맞은 것은?',
        choices: ['부추 앞부분 (\'우\'보다 \'으\'에 가깝게 발음)', '토끼 귀 (긴 모음 발음)', '나비 (받침 발음)'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 38 C 46 28, 76 32, 74 56 C 72 72, 54 80, 38 84', tip: '1획: 부추 앞부분 곡선처럼 부드럽게 휘어 감아 내립니다.' }
      ],
      words: [
        { emoji: '🌙', jp: 'つき', romaji: 'tsuki', meaning: '달' },
        { emoji: '🐦', jp: 'とり', romaji: 'tori', meaning: '새' },
        { emoji: '🧊', jp: 'つめたい', romaji: 'tsumetai', meaning: '차갑다' }
      ],
      examples: [
        { jp: 'つきが きれいです。', romaji: 'tsuki ga kirei desu.', meaning: '달이 예쁩니다.' },
        { jp: 'みずが つめたいです。', romaji: 'mizu ga tsumetai desu.', meaning: '물이 차갑습니다.' }
      ]
    },
    {
      id: 'h_te',
      category: 'hiragana',
      row: 'た행',
      jp: 'て',
      romaji: 'te',
      meaning: '테',
      pronTip: '"테"라고 발음합니다.',
      mnemonic: '테이프 모양을 떠올리며 "테(te)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「て」의 연상 기법으로 알맞은 것은?',
        choices: ['테이프', '바구니', '그네'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 28 C 46 24, 66 22, 76 22 C 56 34, 42 52, 44 68 C 46 80, 60 82, 72 78', tip: '1획: 테이프가 풀리듯 가로로 뻗은 뒤 아래 곡선으로 이어 씁니다.' }
      ],
      words: [
        { emoji: '✋', jp: 'て', romaji: 'te', meaning: '손' },
        { emoji: '✉️', jp: 'てがみ', romaji: 'tegami', meaning: '편지' },
        { emoji: '🌤️', jp: 'てんき', romaji: 'tenki', meaning: '날씨' }
      ],
      examples: [
        { jp: 'てを あらいます。', romaji: 'te o araimasu.', meaning: '손을 씻습니다.' },
        { jp: 'てがみを かきます。', romaji: 'tegami o kakimasu.', meaning: '편지를 씁니다.' }
      ]
    },
    {
      id: 'h_to',
      category: 'hiragana',
      row: 'た행',
      jp: 'と',
      romaji: 'to',
      meaning: '토',
      pronTip: '"토"라고 발음합니다.',
      mnemonic: '토끼 귀 모양을 떠올리며 "토(to)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「と」의 연상 기법으로 알맞은 것은?',
        choices: ['토끼 귀', '오리', '높은음자리표'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 18 L 42 54 C 58 46, 74 52, 74 66 C 74 78, 54 84, 36 76 C 26 70, 28 56, 42 52', tip: '1획: 세로획을 내린 뒤 토끼 귀 곡선을 감아 씁니다.' }
      ],
      words: [
        { emoji: '🐦', jp: 'とり', romaji: 'tori', meaning: '새' },
        { emoji: '⏰', jp: 'とけい', romaji: 'tokei', meaning: '시계' },
        { emoji: '友達', jp: 'ともだち', romaji: 'tomodachi', meaning: '친구' }
      ],
      examples: [
        { jp: 'ともだちと あそびます。', romaji: 'tomodachi to asobimasu.', meaning: '친구와 놉니다.' },
        { jp: 'とりが とんでいます。', romaji: 'tori ga tonde imasu.', meaning: '새가 날고 있습니다.' }
      ]
    },

    // ==================== 5. 나행 (な~の) ====================
    {
      id: 'h_na',
      category: 'hiragana',
      row: 'な행',
      jp: 'な',
      romaji: 'na',
      meaning: '나',
      pronTip: '"나"라고 맑게 발음합니다.',
      mnemonic: '나비 모양을 떠올리며 "나(na)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「な」의 연상 기법으로 알맞은 것은?',
        choices: ['나비', '바구니', '누에'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 30 L 62 28', tip: '1획: 가로선을 긋습니다.' },
        { d: 'M 42 16 L 28 78', tip: '2획: 위에서 아래로 길게 긋습니다.' },
        { d: 'M 62 42 C 74 44, 78 58, 70 68 C 62 76, 46 72, 46 62 C 46 54, 60 52, 74 60', tip: '3획: 오른쪽에 나비 날개 곡선을 긋습니다.' },
        { d: 'M 66 20 L 72 26', tip: '4획: 오른쪽 위에 점을 찍습니다.' }
      ],
      words: [
        { emoji: '夏', jp: 'なつ', romaji: 'natsu', meaning: '여름' },
        { emoji: '名前', jp: 'なまえ', romaji: 'namae', meaning: '이름' },
        { emoji: '中', jp: 'なか', romaji: 'naka', meaning: '안 / 속' }
      ],
      examples: [
        { jp: 'なつやすみが すきです。', romaji: 'natsuyasumi ga suki desu.', meaning: '여름방학을 좋아합니다.' },
        { jp: 'なまえを かきます。', romaji: 'namae o kakimasu.', meaning: '이름을 씁니다.' }
      ]
    },
    {
      id: 'h_ni',
      category: 'hiragana',
      row: 'な행',
      jp: 'に',
      romaji: 'ni',
      meaning: '니',
      pronTip: '"니"라고 발음합니다.',
      mnemonic: '바구니 모양을 떠올리며 "니(ni)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「니」의 연상 기법으로 알맞은 것은?',
        choices: ['바구니', '나비', '그네'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 24 L 24 80', tip: '1획: 왼쪽 세로 획을 아래로 긋습니다.' },
        { d: 'M 46 30 L 74 28', tip: '2획: 오른쪽 위 가로선을 긋습니다.' },
        { d: 'M 46 68 C 56 76, 72 76, 80 70', tip: '3획: 바구니 아래쪽 곡선을 부드럽게 긋습니다.' }
      ],
      words: [
        { emoji: '🥕', jp: 'にんじん', romaji: 'ninjin', meaning: '당근' },
        { emoji: '荷', jp: 'にもつ', romaji: 'nimotsu', meaning: '짐' },
        { emoji: '庭', jp: 'にわ', romaji: 'niwa', meaning: '마당 / 정원' }
      ],
      examples: [
        { jp: 'にんじんを たべます。', romaji: 'ninjin o tabemasu.', meaning: '당근을 먹습니다.' },
        { jp: 'にもつが おもいです。', romaji: 'nimotsu ga omoi desu.', meaning: '짐이 무겁습니다.' }
      ]
    },
    {
      id: 'h_nu',
      category: 'hiragana',
      row: 'な행',
      jp: 'ぬ',
      romaji: 'nu',
      meaning: '누',
      pronTip: '"누"라고 발음합니다.',
      mnemonic: '누에 모양을 떠올리며 "누(nu)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「ぬ」의 연상 기법으로 알맞은 것은?',
        choices: ['누에', '높은음자리표', '카메라'],
        answer: 0
      },
      strokes: [
        { d: 'M 36 22 L 32 76', tip: '1획: 세로획을 아래로 긋습니다.' },
        { d: 'M 20 40 C 44 34, 74 36, 74 56 C 74 70, 56 76, 48 66 C 42 58, 56 48, 66 58 C 74 68, 66 82, 54 84', tip: '2획: 가로선과 누에 고리 곡선을 이어 씁니다.' }
      ],
      words: [
        { emoji: '🧵', jp: 'ぬう', romaji: 'nuu', meaning: '바느질하다 / 꿰매다' },
        { emoji: '犬', jp: 'いぬ', romaji: 'inu', meaning: '개 / 강아지' },
        { emoji: '布', jp: 'ぬの', romaji: 'nuno', meaning: '천 / 직물' }
      ],
      examples: [
        { jp: 'あたらしい ふくを ぬいます。', romaji: 'atarashii fuku o nuimasu.', meaning: '새 옷을 꿰맵니다.' },
        { jp: 'いぬが 走っています。', romaji: 'inu ga hashitte imasu.', meaning: '강아지가 달리고 있습니다.' }
      ]
    },
    {
      id: 'h_ne',
      category: 'hiragana',
      row: 'な행',
      jp: 'ね',
      romaji: 'ne',
      meaning: '네',
      pronTip: '"네"라고 발음합니다.',
      mnemonic: '그네 모양을 떠올리며 "네(ne)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「ね」의 연상 기법으로 알맞은 것은?',
        choices: ['그네', '나비', '오리'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 16 L 42 80', tip: '1획: 세로 기둥 획을 아래로 긋습니다.' },
        { d: 'M 22 34 C 42 32, 68 28, 72 34 C 74 42, 42 58, 26 68 C 44 56, 68 54, 72 68 C 74 78, 64 82, 58 76', tip: '2획: 그네 줄과 흔들리는 곡선을 이어 씁니다.' }
      ],
      words: [
        { emoji: '🐱', jp: 'ねこ', romaji: 'neko', meaning: '고양이' },
        { emoji: '😴', jp: 'ねる', romaji: 'neru', meaning: '자다 / 눕다' },
        { emoji: '根', jp: 'ねっこ', romaji: 'nekko', meaning: '뿌리' }
      ],
      examples: [
        { jp: 'ねこが ねています。', romaji: 'neko ga nete imasu.', meaning: '고양이가 자고 있습니다.' },
        { jp: 'はやく ねます。', romaji: 'hayaku nemasu.', meaning: '일찍 잡니다.' }
      ]
    },
    {
      id: 'h_no',
      category: 'hiragana',
      row: 'な행',
      jp: 'の',
      romaji: 'no',
      meaning: '노',
      pronTip: '"노"라고 발음합니다.',
      mnemonic: '높은음자리표 곡선을 떠올리며 "노(no)"를 기억해 보세요.',
      mnemonicQuiz: {
        q: '「の」의 연상 기법으로 알맞은 것은?',
        choices: ['높은음자리표', '사과', '쿠션'],
        answer: 0
      },
      strokes: [
        { d: 'M 54 24 C 36 24, 22 40, 24 58 C 26 72, 42 74, 56 64 C 70 54, 76 34, 62 24 C 54 18, 46 20, 40 24', tip: '1획: 높은음자리표처럼 한 획으로 둥글게 감아 씁니다.' }
      ],
      words: [
        { emoji: '🥛', jp: 'のみもの', romaji: 'nomimono', meaning: '마실 것 / 음료' },
        { emoji: '🐎', jp: 'うま', romaji: 'uma', meaning: '말' },
        { emoji: '⛰️', jp: 'やま', romaji: 'yama', meaning: '산' }
      ],
      examples: [
        { jp: 'つめたい のみものを のみます。', romaji: 'tsumetai nomimono o nomimasu.', meaning: '차가운 음료를 마십니다.' },
        { jp: 'やまの くうきが おいしいです。', romaji: 'yama no kuuki ga oishii desu.', meaning: '산의 공기가 좋습니다.' }
      ]
    },

    // ==================== 6. 하행 (は~ほ) ====================
    {
      id: 'h_ha',
      category: 'hiragana',
      row: 'は행',
      jp: 'は',
      romaji: 'ha',
      meaning: '하',
      pronTip: '입을 벌려 "하"라고 가볍게 발음합니다.',
      mnemonic: '할아버지 지팡이 모양을 연상합니다.',
      mnemonicQuiz: {
        q: '「は」의 연상 기법으로 알맞은 것은?',
        choices: ['할아버지 지팡이 모양', '히틀러의 코 모양', '호랑이 이마의 무늬'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 22 L 22 80', tip: '1획: 왼쪽 세로 획을 위에서 아래로 긋습니다.' },
        { d: 'M 38 42 L 74 38', tip: '2획: 지팡이 손잡이 위 가로선을 긋습니다.' },
        { d: 'M 62 24 L 64 68 C 64 78, 46 80, 42 70 C 38 62, 56 56, 76 66', tip: '3획: 지팡이 대와 곡선 부분을 이어 씁니다.' }
      ],
      words: [
        { emoji: '🌸', jp: 'はな', romaji: 'hana', meaning: '꽃 / 코' },
        { emoji: '☀️', jp: 'はれ', romaji: 'hare', meaning: '맑음 / 감' },
        { emoji: '🏃', jp: 'はしる', romaji: 'hashiru', meaning: '달리다' }
      ],
      examples: [
        { jp: 'きょうは はれです。', romaji: 'kyou wa hare desu.', meaning: '오늘은 맑습니다.' },
        { jp: 'こうえんを はしります。', romaji: 'kouen o hashirimasu.', meaning: '공원을 달립니다.' }
      ]
    },
    {
      id: 'h_hi',
      category: 'hiragana',
      row: 'は행',
      jp: 'ひ',
      romaji: 'hi',
      meaning: '히',
      pronTip: '"히"라고 발음합니다.',
      mnemonic: '히틀러의 코 모양을 본떠 기억합니다.',
      mnemonicQuiz: {
        q: '「ひ」의 연상 기법으로 알맞은 것은?',
        choices: ['히틀러의 코 모양', '계란 프라이 모양', '할아버지 지팡이 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 26 C 38 22, 46 28, 38 46 C 30 62, 34 78, 52 78 C 68 78, 76 66, 76 54', tip: '1획: 코 모양 곡선을 부드럽게 이어 한 획으로 씁니다.' }
      ],
      words: [
        { emoji: '☀️', jp: 'ひ', romaji: 'hi', meaning: '해 / 날 / 불' },
        { emoji: '👤', jp: 'ひと', romaji: 'hito', meaning: '사람' },
        { emoji: '🗺️', jp: 'ひがし', romaji: 'higashi', meaning: '동쪽' }
      ],
      examples: [
        { jp: 'たくさんの ひとが います。', romaji: 'takusan no hito ga imasu.', meaning: '많은 사람이 있습니다.' },
        { jp: 'ひがしから ひが でます。', romaji: 'higashi kara hi ga demasu.', meaning: '동쪽에서 해가 뜹니다.' }
      ]
    },
    {
      id: 'h_fu',
      category: 'hiragana',
      row: 'は행',
      jp: 'ふ',
      romaji: 'fu',
      meaning: '후',
      pronTip: '윗입술과 아랫입술을 살짝 다가가게 하며 "후"라고 부드럽게 발음합니다.',
      mnemonic: '계란 프라이(노른자 2개) 모양과 비슷합니다.',
      mnemonicQuiz: {
        q: '「ふ」의 연상 기법으로 알맞은 것은?',
        choices: ['계란 프라이(노른자 2개) 모양', '산 모양', '호랑이 이마의 무늬'],
        answer: 0
      },
      strokes: [
        { d: 'M 44 18 C 52 16, 58 20, 52 26', tip: '1획: 위쪽 노른자 부분을 짧게 긋습니다.' },
        { d: 'M 24 66 C 32 48, 56 44, 62 62 C 66 74, 52 84, 38 78', tip: '2획: 아래쪽 노른자 곡선을 둥글게 그립니다.' },
        { d: 'M 20 38 C 24 32, 30 34, 28 40', tip: '3획: 왼쪽 작은 점을 찍습니다.' },
        { d: 'M 72 36 C 78 36, 82 42, 78 46', tip: '4획: 오른쪽 작은 점을 찍습니다.' }
      ],
      words: [
        { emoji: '🗻', jp: 'ふじさん', romaji: 'fujisan', meaning: '후지산' },
        { emoji: '冬', jp: 'ふゆ', romaji: 'fuyu', meaning: '겨울' },
        { emoji: '船', jp: 'ふね', romaji: 'fune', meaning: '배(선박)' }
      ],
      examples: [
        { jp: 'ふじさんが みえます。', romaji: 'fujisan ga miemasu.', meaning: '후지산이 보입니다.' },
        { jp: 'ふゆは さむいです。', romaji: 'fuyu wa samui desu.', meaning: '겨울은 춥습니다.' }
      ]
    },
    {
      id: 'h_he',
      category: 'hiragana',
      row: 'は행',
      jp: 'へ',
      romaji: 'he',
      meaning: '헤',
      pronTip: '"헤"라고 발음합니다.',
      mnemonic: '헤엄치는 사람의 모습이나 산 모양을 떠올립니다.',
      mnemonicQuiz: {
        q: '「へ」의 연상 기법으로 알맞은 것은?',
        choices: ['헤엄치는 사람의 모습이나 산 모양', '할아버지 지팡이 모양', '히틀러의 코 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 20 68 L 46 34 L 80 68', tip: '1획: 산 능선처럼 올라갔다가 내려오는 한 획으로 씁니다.' }
      ],
      words: [
        { emoji: '部屋', jp: 'へや', romaji: 'heya', meaning: '방' },
        { emoji: '蛇', jp: 'へび', romaji: 'hebi', meaning: '뱀' },
        { emoji: '🐧', jp: 'ぺんぎん', romaji: 'pengin', meaning: '펭귄' }
      ],
      examples: [
        { jp: 'へやを そうじします。', romaji: 'heya o souji shimasu.', meaning: '방을 청소합니다.' },
        { jp: 'へやが あたたかいです。', romaji: 'heya ga atatakai desu.', meaning: '방이 따뜻합니다.' }
      ]
    },
    {
      id: 'h_ho',
      category: 'hiragana',
      row: 'は행',
      jp: 'ほ',
      romaji: 'ho',
      meaning: '호',
      pronTip: '"호"라고 발음합니다.',
      mnemonic: '호랑이 이마의 무늬를 연상합니다.',
      mnemonicQuiz: {
        q: '「ほ」의 연상 기법으로 알맞은 것은?',
        choices: ['호랑이 이마의 무늬', '계란 프라이 모양', '산 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 24 20 L 22 82', tip: '1획: 왼쪽 세로 획을 아래로 긋습니다.' },
        { d: 'M 36 30 L 76 28', tip: '2획: 위 가로선을 긋습니다.' },
        { d: 'M 36 46 L 76 44', tip: '3획: 아래 가로선을 긋습니다.' },
        { d: 'M 60 16 L 62 70 C 62 80, 44 82, 40 72 C 36 64, 54 58, 76 68', tip: '4획: 세로획과 호랑이 무늬 곡선을 이어 씁니다.' }
      ],
      words: [
        { emoji: '⭐', jp: 'ほし', romaji: 'hoshi', meaning: '별' },
        { emoji: '📕', jp: 'ほん', romaji: 'hon', meaning: '책' },
        { emoji: '🏨', jp: 'ほてる', romaji: 'hoteru', meaning: '호텔' }
      ],
      examples: [
        { jp: 'ほんを よみます。', romaji: 'hon o yomimasu.', meaning: '책을 읽습니다.' },
        { jp: 'よるに ほしが ひかります。', romaji: 'yoru ni hoshi ga hikarimasu.', meaning: '밤에 별이 빛납니다.' }
      ]
    },

    // ==================== 7. 마행 (ま~も) ====================
    {
      id: 'h_ma',
      category: 'hiragana',
      row: 'ま행',
      jp: 'ま',
      romaji: 'ma',
      meaning: '마',
      pronTip: '"마"라고 부드럽게 발음합니다.',
      mnemonic: '마라톤하는 사람의 모습입니다.',
      mnemonicQuiz: {
        q: '「ま」의 연상 기법으로 알맞은 것은?',
        choices: ['마라톤하는 사람의 모습', '복잡한 미로 모양', '모자의 주름 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 26 28 L 72 26', tip: '1획: 위 가로선을 긋습니다.' },
        { d: 'M 26 46 L 72 44', tip: '2획: 아래 가로선을 긋습니다.' },
        { d: 'M 54 16 L 56 66 C 56 78, 36 80, 34 68 C 32 58, 54 56, 74 68', tip: '3획: 세로획을 내리고 마라톤 주자처럼 아래 곡선을 긋습니다.' }
      ],
      words: [
        { emoji: '👁️', jp: 'め', romaji: 'me', meaning: '눈 / 싹' },
        { emoji: '窓', jp: 'まど', romaji: 'mado', meaning: '창문' },
        { emoji: '町', jp: 'まち', romaji: 'machi', meaning: '마을 / 거리' }
      ],
      examples: [
        { jp: 'まどを あけます。', romaji: 'mado o akemasu.', meaning: '창문을 엽니다.' },
        { jp: 'まちを さんぽします。', romaji: 'machi o sanpo shimasu.', meaning: '거리를 산책합니다.' }
      ]
    },
    {
      id: 'h_mi',
      category: 'hiragana',
      row: 'ま행',
      jp: 'み',
      romaji: 'mi',
      meaning: '미',
      pronTip: '"미"라고 발음합니다.',
      mnemonic: '아주 복잡한 미로 모양과 비슷합니다.',
      mnemonicQuiz: {
        q: '「み」의 연상 기법으로 알맞은 것은?',
        choices: ['아주 복잡한 미로 모양', '수염이 난 메기', '마라톤하는 사람의 모습'],
        answer: 0
      },
      strokes: [
        { d: 'M 32 24 C 46 20, 56 26, 46 42 C 36 56, 26 68, 38 76 C 50 84, 70 72, 74 56', tip: '1획: 왼쪽 미로 곡선을 그리며 아래로 감습니다.' },
        { d: 'M 22 46 C 42 42, 66 44, 76 54', tip: '2획: 가로로 가로지르며 미로를 연결합니다.' }
      ],
      words: [
        { emoji: '💧', jp: 'みず', romaji: 'mizu', meaning: '물' },
        { emoji: '道', jp: 'みち', romaji: 'michi', meaning: '길' },
        { emoji: '耳', jp: 'みみ', romaji: 'mimi', meaning: '귀' }
      ],
      examples: [
        { jp: 'みずを のみます。', romaji: 'mizu o nomimasu.', meaning: '물을 마십니다.' },
        { jp: 'ひろい みちを あるきます。', romaji: 'hiroi michi o arukimasu.', meaning: '넓은 길을 걷습니다.' }
      ]
    },
    {
      id: 'h_mu',
      category: 'hiragana',
      row: 'ま행',
      jp: 'む',
      romaji: 'mu',
      meaning: '무',
      pronTip: '"무"라고 발음합니다.',
      mnemonic: '우아하게 무용하는 사람의 다리 모양을 연상합니다.',
      mnemonicQuiz: {
        q: '「む」의 연상 기법으로 알맞은 것은?',
        choices: ['우아하게 무용하는 사람의 다리 모양', '모자의 주름 모양', '수염이 난 메기'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 32 L 74 28', tip: '1획: 위 가로선을 긋습니다.' },
        { d: 'M 48 16 L 34 74 C 32 82, 46 84, 56 72 C 64 62, 68 54, 74 68', tip: '2획: 무용 동작처럼 내려왔다가 고리를 감고 옆으로 뻗습니다.' },
        { d: 'M 74 44 L 80 54', tip: '3획: 오른쪽에 작은 점을 찍습니다.' }
      ],
      words: [
        { emoji: '村', jp: 'むら', romaji: 'mura', meaning: '마을' },
        { emoji: '虫', jp: 'むし', romaji: 'mushi', meaning: '벌레' },
        { emoji: '向こう', jp: 'むこう', romaji: 'mukou', meaning: '저쪽 / 건너편' }
      ],
      examples: [
        { jp: 'ちいさな むらに すんでいます。', romaji: 'chiisana mura ni sunde imasu.', meaning: '작은 마을에 살고 있습니다.' },
        { jp: 'むこうに やまが みえます。', romaji: 'mukou ni yama ga miemasu.', meaning: '저쪽에 산이 보입니다.' }
      ]
    },
    {
      id: 'h_me',
      category: 'hiragana',
      row: 'ま행',
      jp: 'め',
      romaji: 'me',
      meaning: '메',
      pronTip: '"메"라고 발음합니다.',
      mnemonic: '수염이 난 메기를 떠올립니다.',
      mnemonicQuiz: {
        q: '「め」의 연상 기법으로 알맞은 것은?',
        choices: ['수염이 난 메기', '아주 복잡한 미로 모양', '마라톤하는 사람의 모습'],
        answer: 0
      },
      strokes: [
        { d: 'M 32 22 L 32 66', tip: '1획: 수직 획을 위에서 아래로 긋습니다.' },
        { d: 'M 22 36 C 44 26, 76 32, 76 56 C 76 74, 54 84, 34 78 C 22 74, 24 58, 44 54 C 60 52, 72 64, 78 76', tip: '2획: 메기 얼굴과 수염 곡선을 이어 씁니다.' }
      ],
      words: [
        { emoji: '👁️', jp: 'め', romaji: 'me', meaning: '눈' },
        { emoji: '雨', jp: 'あめ', romaji: 'ame', meaning: '비' },
        { emoji: '芽', jp: 'め', romaji: 'me', meaning: '새싹' }
      ],
      examples: [
        { jp: 'めを とじます。', romaji: 'me o tojimasu.', meaning: '눈을 감습니다.' },
        { jp: 'あめが ふっています。', romaji: 'ame ga futte imasu.', meaning: '비가 내리고 있습니다.' }
      ]
    },
    {
      id: 'h_mo',
      category: 'hiragana',
      row: 'ま행',
      jp: 'も',
      romaji: 'mo',
      meaning: '모',
      pronTip: '"모"라고 발음합니다.',
      mnemonic: '모자의 주름 모양을 생각합니다.',
      mnemonicQuiz: {
        q: '「も」의 연상 기법으로 알맞은 것은?',
        choices: ['모자의 주름 모양', '무용하는 사람의 다리 모양', '수염이 난 메기'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 18 L 38 72 C 38 82, 66 84, 74 72', tip: '1획: 세로획을 내린 뒤 모자 아랫단처럼 오른쪽으로 둥글게 감습니다.' },
        { d: 'M 22 36 L 64 34', tip: '2획: 위 가로선을 긋습니다.' },
        { d: 'M 22 52 L 64 50', tip: '3획: 아래 가로선을 긋습니다.' }
      ],
      words: [
        { emoji: '🍑', jp: 'もも', romaji: 'momo', meaning: '복숭아' },
        { emoji: '森', jp: 'もり', romaji: 'mori', meaning: '숲' },
        { emoji: '物', jp: 'もの', romaji: 'mono', meaning: '물건' }
      ],
      examples: [
        { jp: 'あまい ももを たべます。', romaji: 'amai momo o tabemasu.', meaning: '달콤한 복숭아를 먹습니다.' },
        { jp: 'もりで さんぽします。', romaji: 'mori de sanpo shimasu.', meaning: '숲에서 산책합니다.' }
      ]
    },

    // ==================== 8. 반모음 (야행: や, 유, 요) ====================
    {
      id: 'h_ya',
      category: 'hiragana',
      row: 'や행',
      jp: 'や',
      romaji: 'ya',
      meaning: '야',
      pronTip: '"야"라고 맑게 발음합니다.',
      mnemonic: '야구 방망이를 들고 있는 모습입니다.',
      mnemonicQuiz: {
        q: '「や」의 연상 기법으로 알맞은 것은?',
        choices: ['야구 방망이를 들고 있는 모습', '유도의 업어치기 기술', '요트의 몸체 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 48 C 40 38, 66 36, 74 52 C 78 60, 68 68, 58 62', tip: '1획: 방망이를 휘두르는 곡선을 긋습니다.' },
        { d: 'M 42 18 L 34 82', tip: '2획: 왼쪽에서 아래로 길게 긋습니다.' },
        { d: 'M 58 22 L 62 76', tip: '3획: 오른쪽 세로획을 긋습니다.' }
      ],
      words: [
        { emoji: '⛰️', jp: 'やま', romaji: 'yama', meaning: '산' },
        { emoji: '野菜', jp: 'やさい', romaji: 'yasai', meaning: '채소 / 야채' },
        { emoji: '夜', jp: 'よる', romaji: 'yoru', meaning: '밤' }
      ],
      examples: [
        { jp: 'しんせん な やさいを かいます。', romaji: 'shinsen na yasai o kaimasu.', meaning: '신선한 채소를 삽니다.' },
        { jp: 'やまに のぼります。', romaji: 'yama ni noborimasu.', meaning: '산에 오릅니다.' }
      ]
    },
    {
      id: 'h_yu',
      category: 'hiragana',
      row: 'や행',
      jp: 'ゆ',
      romaji: 'yu',
      meaning: '유',
      pronTip: '"유"라고 발음합니다.',
      mnemonic: '유도의 업어치기 기술을 떠올립니다.',
      mnemonicQuiz: {
        q: '「ゆ」의 연상 기법으로 알맞은 것은?',
        choices: ['유도의 업어치기 기술', '야구 방망이를 들고 있는 모습', '요트의 몸체 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 24 L 24 76', tip: '1획: 왼쪽 세로획을 위에서 아래로 긋습니다.' },
        { d: 'M 24 52 C 42 36, 76 36, 76 62 C 76 76, 56 80, 44 74', tip: '2획: 업어치기 곡선처럼 둥글게 휘어 감아 씁니다.' }
      ],
      words: [
        { emoji: '♨️', jp: 'ゆき', romaji: 'yuki', meaning: '눈 / 용기' },
        { emoji: '♨️', jp: 'おゆ', romaji: 'oyu', meaning: '뜨거운 물' },
        { emoji: '夢', jp: 'ゆめ', romaji: 'yume', meaning: '꿈' }
      ],
      examples: [
        { jp: 'ゆきが ふっています。', romaji: 'yuki ga futte imasu.', meaning: '눈이 내리고 있습니다.' },
        { jp: 'おおきな ゆめが あります。', romaji: 'ookina yume ga arimasu.', meaning: '큰 꿈이 있습니다.' }
      ]
    },
    {
      id: 'h_yo',
      category: 'hiragana',
      row: 'や행',
      jp: 'よ',
      romaji: 'yo',
      meaning: '요',
      pronTip: '"요"라고 발음합니다.',
      mnemonic: '요트의 몸체 모양을 떠올립니다.',
      mnemonicQuiz: {
        q: '「よ」의 연상 기법으로 알맞은 것은?',
        choices: ['요트의 몸체 모양', '유도의 업어치기 기술', '야구 방망이를 들고 있는 모습'],
        answer: 0
      },
      strokes: [
        { d: 'M 42 42 L 72 38', tip: '1획: 가로선을 오른쪽으로 긋습니다.' },
        { d: 'M 48 18 L 52 72 C 52 80, 32 82, 26 72 C 22 64, 38 58, 66 68', tip: '2획: 세로로 내려와 요트 선체 모양의 곡선을 긋습니다.' }
      ],
      words: [
        { emoji: '🌙', jp: 'よる', romaji: 'yoru', meaning: '밤' },
        { emoji: '世', jp: 'よのなか', romaji: 'yononaka', meaning: '세상' },
        { emoji: '呼ぶ', jp: 'よぶ', romaji: 'yobu', meaning: '부르다' }
      ],
      examples: [
        { jp: 'よるが ふけました。', romaji: 'yoru ga fukemashita.', meaning: '밤이 깊었습니다.' },
        { jp: 'ともだちを よびます。', romaji: 'tomodachi o yobimasu.', meaning: '친구를 부릅니다.' }
      ]
    },

    // ==================== 9. 라행 (ら~ろ) ====================
    {
      id: 'h_ra',
      category: 'hiragana',
      row: 'ら행',
      jp: 'ら',
      romaji: 'ra',
      meaning: '라',
      pronTip: '혀끝을 윗잇몸에 가볍게 대며 ㄹ과 ㄷ 사이의 부드러운 소리로 발음합니다.',
      mnemonic: '라디오의 안테나와 몸체를 생각합니다.',
      mnemonicQuiz: {
        q: '「ら」의 연상 기법으로 알맞은 것은?',
        choices: ['라디오의 안테나와 몸체', '예쁜 리본 모양', '롤러 스케이트의 바퀴 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 44 18 L 54 24', tip: '1획: 위쪽 안테나 획을 짧게 긋습니다.' },
        { d: 'M 32 36 L 68 34 L 34 52 C 52 46, 74 52, 74 68 C 74 80, 52 84, 36 78', tip: '2획: 라디오 몸체와 곡선을 이어 씁니다.' }
      ],
      words: [
        { emoji: '📻', jp: 'らじお', romaji: 'rajio', meaning: '라디오' },
        { emoji: '🦁', jp: 'らいおん', romaji: 'raion', meaning: '사자' },
        { emoji: '来週', jp: 'らいしゅう', romaji: 'raishuu', meaning: '다음 주' }
      ],
      examples: [
        { jp: 'らじおを ききます。', romaji: 'rajio o kikimasu.', meaning: '라디오를 듣습니다.' },
        { jp: 'らいしゅう りょこうします。', romaji: 'raishuu ryokou shimasu.', meaning: '다음 주에 여행합니다.' }
      ]
    },
    {
      id: 'h_ri',
      category: 'hiragana',
      row: 'ら행',
      jp: 'り',
      romaji: 'ri',
      meaning: '리',
      pronTip: '혀끝을 윗잇몸에 가볍게 대며 "리"라고 발음합니다.',
      mnemonic: '예쁜 리본 모양입니다.',
      mnemonicQuiz: {
        q: '「り」의 연상 기법으로 알맞은 것은?',
        choices: ['예쁜 리본 모양', '캥거루의 주머니 부분', '레슬링하는 모습'],
        answer: 0
      },
      strokes: [
        { d: 'M 30 24 C 26 42, 28 58, 36 64', tip: '1획: 왼쪽 리본 자락을 부드럽게 내립니다.' },
        { d: 'M 68 22 C 74 44, 72 68, 48 80', tip: '2획: 오른쪽 획을 길게 내리며 아래로 휘어 긋습니다.' }
      ],
      words: [
        { emoji: '🍎', jp: 'りんご', romaji: 'ringo', meaning: '사과' },
        { emoji: '🐿️', jp: 'りす', romaji: 'risu', meaning: '다람쥐' },
        { emoji: '旅行', jp: 'りょこう', romaji: 'ryokou', meaning: '여행' }
      ],
      examples: [
        { jp: 'あかい りんごを たべます。', romaji: 'akai ringo o tabemasu.', meaning: '빨간 사과를 먹습니다.' },
        { jp: 'りすを みました。', romaji: 'risu o mimashita.', meaning: '다람쥐를 봤습니다.' }
      ]
    },
    {
      id: 'h_ru',
      category: 'hiragana',
      row: 'ら행',
      jp: 'る',
      romaji: 'ru',
      meaning: '루',
      pronTip: '"루"라고 부드럽게 발음합니다.',
      mnemonic: '캥거루의 주머니 부분을 강조해서 외웁니다.',
      mnemonicQuiz: {
        q: '「る」의 연상 기법으로 알맞은 것은?',
        choices: ['캥거루의 주머니 부분', '예쁜 리본 모양', '롤러 스케이트의 바퀴 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 24 L 68 22 L 36 52 C 54 46, 76 52, 76 68 C 76 80, 56 84, 44 76 C 38 72, 46 64, 56 68', tip: '1획: 캥거루 주머니 고리를 감아 마무리하는 한 획으로 씁니다.' }
      ],
      words: [
        { emoji: '留守', jp: 'るす', romaji: 'rusu', meaning: '부재중 / 집 비움' },
        { emoji: '光る', jp: 'ひかる', romaji: 'hikaru', meaning: '빛나다' },
        { emoji: '作る', jp: 'つくる', romaji: 'tsukuru', meaning: '만들다' }
      ],
      examples: [
        { jp: 'ほしが ひかっています。', romaji: 'hoshi ga hikatte imasu.', meaning: '별이 빛나고 있습니다.' },
        { jp: 'ごはんを つくります。', romaji: 'gohan o tsukurimasu.', meaning: '밥을 만듭니다.' }
      ]
    },
    {
      id: 'h_re',
      category: 'hiragana',
      row: 'ら행',
      jp: 'れ',
      romaji: 're',
      meaning: '레',
      pronTip: '"레"라고 발음합니다.',
      mnemonic: '뒷다리를 뻗고 레슬링하는 모습입니다.',
      mnemonicQuiz: {
        q: '「れ」의 연상 기법으로 알맞은 것은?',
        choices: ['뒷다리를 뻗고 레슬링하는 모습', '캥거루의 주머니 부분', '라디오의 안테나와 몸체'],
        answer: 0
      },
      strokes: [
        { d: 'M 32 18 L 30 80', tip: '1획: 세로축을 위에서 아래로 긋습니다.' },
        { d: 'M 24 38 C 44 26, 74 28, 74 44 C 74 56, 42 64, 34 62 C 48 64, 62 76, 78 76', tip: '2획: 레슬링 자세 곡선과 뻗은 다리를 이어 씁니다.' }
      ],
      words: [
        { emoji: '🍋', jp: 'れもん', romaji: 'remon', meaning: '레몬' },
        { emoji: '列車', jp: 'れっしゃ', romaji: 'ressha', meaning: '열차' },
        { emoji: '歴史', jp: 'れきし', romaji: 'rekishi', meaning: '역사' }
      ],
      examples: [
        { jp: 'れもんは すっぱいです。', romaji: 'remon wa suppai desu.', meaning: '레몬은 시큼합니다.' },
        { jp: 'れっしゃが きました。', romaji: 'ressha ga kimashita.', meaning: '열차가 왔습니다.' }
      ]
    },
    {
      id: 'h_ro',
      category: 'hiragana',
      row: 'ら행',
      jp: 'ろ',
      romaji: 'ro',
      meaning: '로',
      pronTip: '"로"라고 발음합니다.',
      mnemonic: '롤러 스케이트의 바퀴 모양을 연상합니다.',
      mnemonicQuiz: {
        q: '「ろ」의 연상 기법으로 알맞은 것은?',
        choices: ['롤러 스케이트의 바퀴 모양', '뒷다리를 뻗고 레슬링하는 모습', '예쁜 리본 모양'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 24 L 68 22 L 36 52 C 54 46, 76 52, 76 68 C 76 80, 52 84, 36 78', tip: '1획: 롤러 스케이트 바퀴처럼 둥글게 감아 한 획으로 씁니다.' }
      ],
      words: [
        { emoji: '🛣️', jp: 'どうろ', romaji: 'douro', meaning: '도로' },
        { emoji: 'ろうそく', romaji: 'rousoku', meaning: '양초' },
        { emoji: 'ろく', romaji: 'roku', meaning: '숫자 6' }
      ],
      examples: [
        { jp: 'ひろい どうろです。', romaji: 'hiroi douro desu.', meaning: '넓은 도로입니다.' },
        { jp: 'ろうそくに ひを つけます。', romaji: 'rousoku ni hi o tsukemasu.', meaning: '양초에 불을 붙입니다.' }
      ]
    },

    // ==================== 10. 기타 (와행: わ, を, ん) ====================
    {
      id: 'h_wa',
      category: 'hiragana',
      row: 'わ행',
      jp: 'わ',
      romaji: 'wa',
      meaning: '와',
      pronTip: '"와"라고 밝게 발음합니다.',
      mnemonic: '\'와\'라고 크게 말하는 입 모양입니다.',
      mnemonicQuiz: {
        q: '「わ」의 연상 기법으로 알맞은 것은?',
        choices: ['\'와\'라고 크게 말하는 입 모양', '복잡하게 생긴 오징어 모양', '음목걸이의 꼬리 부분'],
        answer: 0
      },
      strokes: [
        { d: 'M 28 22 L 26 78', tip: '1획: 왼쪽 세로 획을 아래로 긋습니다.' },
        { d: 'M 22 38 C 44 26, 76 32, 76 56 C 76 74, 54 84, 34 78', tip: '2획: 크게 벌린 입 모양처럼 둥글게 감아 씁니다.' }
      ],
      words: [
        { emoji: '🦅', jp: 'わし', romaji: 'washi', meaning: '독수리 / 나(옛·노인 말투)' },
        { emoji: '輪', jp: 'わ', romaji: 'wa', meaning: '고리 / 원' },
        { emoji: '私', jp: 'わたし', romaji: 'watashi', meaning: '나 / 저' }
      ],
      examples: [
        { jp: 'わたしは がくせいです。', romaji: 'watashi wa gakusei desu.', meaning: '저는 학생입니다.' },
        { jp: 'おおきな わを つくります。', romaji: 'ookina wa o tsukurimasu.', meaning: '큰 원을 만듭니다.' }
      ]
    },
    {
      id: 'h_wo',
      category: 'hiragana',
      row: 'わ행',
      jp: 'を',
      romaji: 'wo (o)',
      meaning: '오(조사)',
      pronTip: '조사로 쓰일 때는 주로 "오"에 가깝게 발음합니다.',
      mnemonic: '복잡하게 생긴 오징어 모양입니다.',
      mnemonicQuiz: {
        q: '「を」의 연상 기법으로 알맞은 것은?',
        choices: ['복잡하게 생긴 오징어 모양', '\'와\'라고 크게 말하는 입 모양', '음목걸이의 꼬리 부분'],
        answer: 0
      },
      strokes: [
        { d: 'M 22 32 L 72 28', tip: '1획: 위 가로선을 긋습니다.' },
        { d: 'M 52 16 L 34 62', tip: '2획: 세로 방향으로 내려 긋습니다.' },
        { d: 'M 36 52 C 52 44, 76 48, 76 66 C 76 78, 54 84, 34 78 C 24 74, 28 62, 46 60', tip: '3획: 오징어 다리처럼 아래 곡선을 감아 마무리합니다.' }
      ],
      words: [
        { emoji: '📖', jp: 'ほんを よむ', romaji: 'hon o yomu', meaning: '책을 읽다' },
        { emoji: '🍞', jp: 'ぱんを たべる', romaji: 'pan o taberu', meaning: '빵을 먹다' },
        { emoji: '💧', jp: 'みずを のむ', romaji: 'mizu o nomu', meaning: '물을 마시다' }
      ],
      examples: [
        { jp: 'みずを のみます。', romaji: 'mizu o nomimasu.', meaning: '물을 마십니다.' },
        { jp: 'ほんを かいます。', romaji: 'hon o kaimasu.', meaning: '책을 삽니다.' }
      ]
    },
    {
      id: 'h_n',
      category: 'hiragana',
      row: 'わ행',
      jp: 'ん',
      romaji: 'n',
      meaning: '응(받침)',
      pronTip: '단어 맨 앞에는 올 수 없으며, 뒤에 오는 소리에 따라 받침(ㄴ/ㅁ/ㅇ)처럼 유연하게 발음됩니다.',
      mnemonic: '음목걸이의 꼬리 부분을 떠올립니다.',
      mnemonicQuiz: {
        q: '「ん」의 연상 기법과 특징으로 알맞은 것은?',
        choices: ['음목걸이의 꼬리 부분 (단어 첫머리 불가)', '오징어 모양 (단어 첫머리 가능)', '산 모양 (장음 기호)'],
        answer: 0
      },
      strokes: [
        { d: 'M 38 22 C 34 44, 28 66, 26 76 C 36 60, 52 46, 62 52 C 70 58, 62 76, 78 72', tip: '1획: 음목걸이 꼬리처럼 내려왔다가 곡선으로 이어 한 획으로 씁니다.' }
      ],
      words: [
        { emoji: '🍞', jp: 'ぱん', romaji: 'pan', meaning: '빵' },
        { emoji: '🍵', jp: 'おちゃ', romaji: 'ocha', meaning: '차' },
        { emoji: '⛰️', jp: 'やま', romaji: 'yama', meaning: '산' }
      ],
      examples: [
        { jp: 'あたらしい ぱんを かいました。', romaji: 'atarashii pan o kaimashita.', meaning: '새 빵을 샀습니다.' },
        { jp: 'みなさんと いっしょに べんきょうします。', romaji: 'minasan to issho ni benkyou shimasu.', meaning: '여러분과 함께 공부합니다.' }
      ]
    }
  ];

  // 히라가나 심화 규칙 데이터 (탁음 · 반탁음 · 요음 · 특수규칙 · 장음)
  const HIRAGANA_ADVANCED_RULES = [
    {
      id: 'rule_dakuon',
      badge: '심화 1 · 탁음 (゛)',
      title: '탁음 규칙 — 오른쪽 상단 점 두 개(")',
      summary: '기본 히라가나 글자 오른쪽 상단에 점 두 개(")를 붙여 발음을 탁하게 만드는 규칙입니다.',
      items: [
        { pair: 'か행(카키쿠케코) → が행(가기구게고)', example: 'がっこう(학교), ごはん(밥)' },
        { pair: 'さ행(사시스세소) → ざ행(자지즈제조)', example: 'じかん(시간), ぜんぶ(전부)' },
        { pair: 'た행(타치츠테토) → だ행(다지즈데도)', example: 'だいじょうぶ(괜찮아요), でんしゃ(전차)' },
        { pair: 'は행(하히후헤호) → ば행(바비부베보)', example: 'ばしょ(장소), ばんごはん(저녁밥)' }
      ]
    },
    {
      id: 'rule_handakuon',
      badge: '심화 2 · 반탁음 (゜)',
      title: '반탁음 규칙 — 오른쪽 상단 동그라미(゜)',
      summary: 'は행 글자 오른쪽 상단에 동그라미(゜)를 붙여 ㅍ 계열 발음으로 바꾸는 규칙입니다.',
      items: [
        { pair: 'は행(하히후헤호) → ぱ행(파피푸페포)', example: 'ぱん(빵), ぴかぴか(반짝반짝), ぷーる(수영장)' }
      ]
    },
    {
      id: 'rule_yoon',
      badge: '심화 3 · 요음 (ゃ, ゅ, ょ)',
      title: '요음 규칙 — い단(い 제외) + 작은 야·유·요 결합',
      summary: 'い단 글자(い 제외) 뒤에 작은 ゃ, ゅ, ょ를 붙여 한 음절로 합쳐 발음합니다. 탁음·반탁음에도 동일하게 적용됩니다.',
      items: [
        { pair: '기본 요음 (예: き + ゃ = きゃ [캬])', example: 'きゃく(손님), しゃしん(사진), ちょこれーと(초콜릿)' },
        { pair: '탁음·반탁음 요음 (예: び + ゅ = びゅ [뷰])', example: 'びょういん(병원), ぎゅうにく(소고기), ぴゅあ(퓨어)' }
      ]
    },
    {
      id: 'rule_special',
      badge: '심화 4 · 특수 발음 (ん · 촉음 っ)',
      title: '응(ん)과 촉음(작은 つ) 규칙',
      summary: '응(ん)은 받침 역할을 하며 단어 맨 앞에는 올 수 없고, 촉음(작은 つ)은 뒤 자음의 받침처럼 한 박자 쉬어 된소리로 읽습니다.',
      items: [
        { pair: '응(ん) 받침 규칙', example: 'ほん(책), せんせい(선생님) — 단어 첫머리 불가' },
        { pair: '촉음(작은 つ) 된소리 규칙', example: 'きって(우표), がっこう(학교), まって(기다려)' }
      ]
    },
    {
      id: 'rule_choon',
      badge: '심화 5 · 장음 규칙',
      title: '장음 규칙 — 모음을 길게 끌어 발음하기',
      summary: '모음 뒤에 같은 모음을 연결하거나 특정 글자(い, う)를 붙여 길게 발음하는 규칙입니다.',
      items: [
        { pair: 'あ단 + あ / い단 + い / う단 + う', example: 'おかあさん(어머니), おにいさん(형/오빠), くうき(공기)' },
        { pair: 'え단 + え 또는 い / お단 + お 또는 う', example: 'せんせい(선생님), おおきい(크다), とうきょう(도쿄)' }
      ]
    }
  ];

  global.HIRAGANA_DATA = HIRAGANA_DATA;
  global.HIRAGANA_ADVANCED_RULES = HIRAGANA_ADVANCED_RULES;
})(window);
