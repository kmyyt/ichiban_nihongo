// [추가파일] 심화 50음도 데이터: 탁음(20자) · 반탁음(5자) · 요음(33자)
(function (global) {
  const HIRAGANA_ADVANCED_DATA = [
    // ==================== 1. 탁음 (が·ざ·だ·ば행) ====================
    {
      id: 'ha_ga', category: 'hiragana', subType: 'dakuon', row: 'が행(탁음)', jp: 'が', romaji: 'ga', meaning: '가',
      pronTip: 'か(카)에 탁점(゛)을 붙여 목을 울리며 "가"로 발음합니다.',
      mnemonic: 'か를 먼저 쓰고 오른쪽 위에 탁점(゛) 두 획을 추가합니다.',
      words: [
        { emoji: '🏫', jp: 'がっこう', romaji: 'gakkou', meaning: '학교' },
        { emoji: '🎨', jp: 'がいこく', romaji: 'gaikoku', meaning: '외국' },
        { emoji: '🎵', jp: 'おんがく', romaji: 'ongaku', meaning: '음악' }
      ],
      examples: [
        { jp: 'がっこうへ いきます。', romaji: 'gakkou e ikimasu.', meaning: '학교에 갑니다.' },
        { jp: 'おんがくを ききます。', romaji: 'ongaku o kikimasu.', meaning: '음악을 듣습니다.' }
      ]
    },
    {
      id: 'ha_gi', category: 'hiragana', subType: 'dakuon', row: 'が행(탁음)', jp: 'ぎ', romaji: 'gi', meaning: '기',
      pronTip: 'き(키)에 탁점(゛)을 붙여 "기"로 발음합니다.',
      mnemonic: 'き를 쓴 뒤 오른쪽 위에 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '🔑', jp: 'かぎ', romaji: 'kagi', meaning: '열쇠' },
        { emoji: '🏦', jp: 'ぎんこう', romaji: 'ginkou', meaning: '은행' },
        { emoji: '🎸', jp: 'ぎたー', romaji: 'gitaa', meaning: '기타' }
      ],
      examples: [
        { jp: 'ぎんこうは どこですか。', romaji: 'ginkou wa doko desu ka.', meaning: '은행은 어디입니까?' },
        { jp: 'かぎを さがします。', romaji: 'kagi o sagashimasu.', meaning: '열쇠를 찾습니다.' }
      ]
    },
    {
      id: 'ha_gu', category: 'hiragana', subType: 'dakuon', row: 'が행(탁음)', jp: 'ぐ', romaji: 'gu', meaning: '구',
      pronTip: 'く(쿠)에 탁점(゛)을 붙여 "구"로 발음합니다.',
      mnemonic: 'く를 한 획으로 쓴 뒤 오른쪽 위에 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '🧰', jp: 'どうぐ', romaji: 'dougu', meaning: '도구' },
        { emoji: '⚡', jp: 'すぐ', romaji: 'sugu', meaning: '곧 / 바로' },
        { emoji: '🥣', jp: 'ぐざい', romaji: 'guzai', meaning: '재료(건더기)' }
      ],
      examples: [
        { jp: 'すぐに いきます。', romaji: 'sugu ni ikimasu.', meaning: '바로 가겠습니다.' },
        { jp: 'べんりな どうぐです。', romaji: 'benri na dougu desu.', meaning: '편리한 도구입니다.' }
      ]
    },
    {
      id: 'ha_ge', category: 'hiragana', subType: 'dakuon', row: 'が행(탁음)', jp: 'げ', romaji: 'ge', meaning: '게',
      pronTip: 'け(케)에 탁점(゛)을 붙여 "게"로 발음합니다.',
      mnemonic: 'け를 쓴 뒤 오른쪽 상단에 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '💪', jp: 'げんき', romaji: 'genki', meaning: '건강 / 활기' },
        { emoji: '🎮', jp: 'げーむ', romaji: 'geemu', meaning: '게임' },
        { emoji: '🗓️', jp: 'げつようび', romaji: 'getsuyoubi', meaning: '월요일' }
      ],
      examples: [
        { jp: 'おげんきですか。', romaji: 'ogenki desu ka.', meaning: '잘 지내세요?' },
        { jp: 'げつようびに あいます。', romaji: 'getsuyoubi ni aimasu.', meaning: '월요일에 만납니다.' }
      ]
    },
    {
      id: 'ha_go', category: 'hiragana', subType: 'dakuon', row: 'が행(탁음)', jp: 'ご', romaji: 'go', meaning: '고',
      pronTip: 'こ(코)에 탁점(゛)을 붙여 "고"로 발음합니다.',
      mnemonic: 'こ의 두 획 뒤에 오른쪽 위 탁점(゛)을 추가합니다.',
      words: [
        { emoji: '🍚', jp: 'ごはん', romaji: 'gohan', meaning: '밥 / 식사' },
        { emoji: '🍎', jp: 'りんご', romaji: 'ringo', meaning: '사과' },
        { emoji: '🌇', jp: 'ごご', romaji: 'gogo', meaning: '오후' }
      ],
      examples: [
        { jp: 'あさごはんを たべます。', romaji: 'asagohan o tabemasu.', meaning: '아침밥을 먹습니다.' },
        { jp: 'ごごに べんきょうします。', romaji: 'gogo ni benkyou shimasu.', meaning: '오후에 공부합니다.' }
      ]
    },
    {
      id: 'ha_za', category: 'hiragana', subType: 'dakuon', row: 'ざ행(탁음)', jp: 'ざ', romaji: 'za', meaning: '자',
      pronTip: 'さ(사)에 탁점(゛)을 붙여 영어 z처럼 울리는 "자"로 발음합니다.',
      mnemonic: 'さ를 쓰고 오른쪽 상단에 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '📰', jp: 'ざっし', romaji: 'zasshi', meaning: '잡지' },
        { emoji: '🪑', jp: 'ざせき', romaji: 'zaseki', meaning: '좌석' },
        { emoji: '⛈️', jp: 'かざん', romaji: 'kazan', meaning: '화산' }
      ],
      examples: [
        { jp: 'ざっしを よみます。', romaji: 'zasshi o yomimasu.', meaning: '잡지를 읽습니다.' },
        { jp: 'ざせきに すわります。', romaji: 'zaseki ni suwarimasu.', meaning: '좌석에 앉습니다.' }
      ]
    },
    {
      id: 'ha_ji', category: 'hiragana', subType: 'dakuon', row: 'ざ행(탁음)', jp: 'じ', romaji: 'ji', meaning: '지',
      pronTip: 'し(시)에 탁점(゛)을 붙여 "지"로 발음합니다.',
      mnemonic: 'し를 한 획으로 그린 뒤 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '⏰', jp: 'じかん', romaji: 'jikan', meaning: '시간' },
        { emoji: '📖', jp: 'じしょ', romaji: 'jisho', meaning: '사전' },
        { emoji: '🚲', jp: 'じてんしゃ', romaji: 'jitensha', meaning: '자전거' }
      ],
      examples: [
        { jp: 'じかんが ありません。', romaji: 'jikan ga arimasen.', meaning: '시간이 없습니다.' },
        { jp: 'じてんしゃで いきます。', romaji: 'jitensha de ikimasu.', meaning: '자전거로 갑니다.' }
      ]
    },
    {
      id: 'ha_zu', category: 'hiragana', subType: 'dakuon', row: 'ざ행(탁음)', jp: 'ず', romaji: 'zu', meaning: '즈',
      pronTip: 'す(스)에 탁점(゛)을 붙여 "즈"로 발음합니다.',
      mnemonic: 'す를 쓰고 오른쪽 위에 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '💧', jp: 'みず', romaji: 'mizu', meaning: '물' },
        { emoji: '🗺️', jp: 'ちず', romaji: 'chizu', meaning: '지도' },
        { emoji: '👖', jp: 'ずぼん', romaji: 'zubon', meaning: '바지' }
      ],
      examples: [
        { jp: 'つめたい みずを ください。', romaji: 'tsumetai mizu o kudasai.', meaning: '차가운 물 주세요.' },
        { jp: 'ちずを みながら あるきます。', romaji: 'chizu o minagara arukimasu.', meaning: '지도를 보며 걷습니다.' }
      ]
    },
    {
      id: 'ha_ze', category: 'hiragana', subType: 'dakuon', row: 'ざ행(탁음)', jp: 'ぜ', romaji: 'ze', meaning: '제',
      pronTip: 'せ(세)에 탁점(゛)을 붙여 "제"로 발음합니다.',
      mnemonic: 'せ를 쓴 뒤 오른쪽 위에 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '🌬️', jp: 'かぜ', romaji: 'kaze', meaning: '바람 / 감기' },
        { emoji: '💯', jp: 'ぜんぶ', romaji: 'zenbu', meaning: '전부' },
        { emoji: '0️⃣', jp: 'ぜろ', romaji: 'zero', meaning: '영(0)' }
      ],
      examples: [
        { jp: 'かぜが つよいです。', romaji: 'kaze ga tsuyoi desu.', meaning: '바람이 강합니다.' },
        { jp: 'ぜんぶ たべました。', romaji: 'zenbu tabemashita.', meaning: '전부 먹었습니다.' }
      ]
    },
    {
      id: 'ha_zo', category: 'hiragana', subType: 'dakuon', row: 'ざ행(탁음)', jp: 'ぞ', romaji: 'zo', meaning: '조',
      pronTip: 'そ(소)에 탁점(゛)을 붙여 "조"로 발음합니다.',
      mnemonic: 'そ를 쓴 뒤 오른쪽 위에 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '🐘', jp: 'ぞう', romaji: 'zou', meaning: '코끼리' },
        { emoji: '👨‍👩‍👧‍👦', jp: 'かぞく', romaji: 'kazoku', meaning: '가족' },
        { emoji: '🙏', jp: 'どうぞ', romaji: 'douzo', meaning: '부디 / 자(권할 때)' }
      ],
      examples: [
        { jp: 'どうぞ おはいりください。', romaji: 'douzo ohairi kudasai.', meaning: '어서 들어오세요.' },
        { jp: 'かぞくと りょこうします。', romaji: 'kazoku to ryokou shimasu.', meaning: '가족과 여행합니다.' }
      ]
    },
    {
      id: 'ha_da', category: 'hiragana', subType: 'dakuon', row: 'だ행(탁음)', jp: 'だ', romaji: 'da', meaning: '다',
      pronTip: 'た(타)에 탁점(゛)을 붙여 "다"로 발음합니다.',
      mnemonic: 'た를 쓴 뒤 오른쪽 위에 탁점(゛)을 추가합니다.',
      words: [
        { emoji: '🎓', jp: 'だいがく', romaji: 'daigaku', meaning: '대학교' },
        { emoji: '👍', jp: 'だいじょうぶ', romaji: 'daijoubu', meaning: '괜찮아요' },
        { emoji: '❓', jp: 'だれ', romaji: 'dare', meaning: '누구' }
      ],
      examples: [
        { jp: 'だいじょうぶですか。', romaji: 'daijoubu desu ka.', meaning: '괜찮으신가요?' },
        { jp: 'だいがくで にほんごを まなびます。', romaji: 'daigaku de nihongo o manabimasu.', meaning: '대학에서 일본어를 배웁니다.' }
      ]
    },
    {
      id: 'ha_di', category: 'hiragana', subType: 'dakuon', row: 'だ행(탁음)', jp: 'ぢ', romaji: 'ji (di)', meaning: '지',
      pronTip: 'ち에 탁점(゛)을 붙이며 현대 일본어에서는 じ와 같은 "지"로 발음합니다.',
      mnemonic: 'ち를 쓴 뒤 탁점(゛)을 붙이며, 연탁(はなぢ 등)에 주로 쓰입니다.',
      words: [
        { emoji: '🩸', jp: 'はなぢ', romaji: 'hanaji', meaning: '코피' },
        { emoji: '縮', jp: 'ちぢむ', romaji: 'chijimu', meaning: '줄어들다' }
      ],
      examples: [
        { jp: 'ふくが ちぢみました。', romaji: 'fuku ga chijimimashita.', meaning: '옷이 줄어들었습니다.' }
      ]
    },
    {
      id: 'ha_du', category: 'hiragana', subType: 'dakuon', row: 'だ행(탁음)', jp: 'づ', romaji: 'zu (du)', meaning: '즈',
      pronTip: 'つ에 탁점(゛)을 붙이며 ず와 같은 "즈"로 발음합니다.',
      mnemonic: 'つ를 쓴 뒤 탁점(゛)을 붙이며, つづく·みかづき 등에 쓰입니다.',
      words: [
        { emoji: '🌙', jp: 'みかづき', romaji: 'mikazuki', meaning: '초승달' },
        { emoji: '➡️', jp: 'つづく', romaji: 'tsuzuku', meaning: '계속되다' }
      ],
      examples: [
        { jp: 'あめが つづきます。', romaji: 'ame ga tsuzukimasu.', meaning: '비가 계속됩니다.' }
      ]
    },
    {
      id: 'ha_de', category: 'hiragana', subType: 'dakuon', row: 'だ행(탁음)', jp: 'で', romaji: 'de', meaning: '데',
      pronTip: 'て(테)에 탁점(゛)을 붙여 "데"로 발음합니다.',
      mnemonic: 'て를 한 획으로 쓴 뒤 오른쪽 위에 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '🚃', jp: 'でんしゃ', romaji: 'densha', meaning: '전철' },
        { emoji: '📞', jp: 'でんわ', romaji: 'denwa', meaning: '전화' },
        { emoji: '🚪', jp: 'でぐち', romaji: 'deguchi', meaning: '출구' }
      ],
      examples: [
        { jp: 'でんしゃに のります。', romaji: 'densha ni norimasu.', meaning: '전철을 탑니다.' },
        { jp: 'でんわを かけます。', romaji: 'denwa o kakemasu.', meaning: '전화를 겁니다.' }
      ]
    },
    {
      id: 'ha_do', category: 'hiragana', subType: 'dakuon', row: 'だ행(탁음)', jp: 'ど', romaji: 'do', meaning: '도',
      pronTip: 'と(토)에 탁점(゛)을 붙여 "도"로 발음합니다.',
      mnemonic: 'と를 쓴 뒤 오른쪽 상단에 탁점(゛)을 추가합니다.',
      words: [
        { emoji: '🪟', jp: 'まど', romaji: 'mado', meaning: '창문' },
        { emoji: '📍', jp: 'どこ', romaji: 'doko', meaning: '어디' },
        { emoji: '🦁', jp: 'どうぶつ', romaji: 'doubutsu', meaning: '동물' }
      ],
      examples: [
        { jp: 'まどを しめます。', romaji: 'mado o shimemasu.', meaning: '창문을 닫습니다.' },
        { jp: 'どうぶつえんへ いきます。', romaji: 'doubutsuen e ikimasu.', meaning: '동물원에 갑니다.' }
      ]
    },
    {
      id: 'ha_ba', category: 'hiragana', subType: 'dakuon', row: 'ば행(탁음)', jp: 'ば', romaji: 'ba', meaning: '바',
      pronTip: 'は(하)에 탁점(゛)을 붙여 "바"로 발음합니다.',
      mnemonic: 'は를 쓰고 오른쪽 위에 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '🚌', jp: 'ばす', romaji: 'basu', meaning: '버스' },
        { emoji: '👜', jp: 'かばん', romaji: 'kaban', meaning: '가방' },
        { emoji: '📍', jp: 'ばしょ', romaji: 'basho', meaning: '장소' }
      ],
      examples: [
        { jp: 'かばんが おもいです。', romaji: 'kaban ga omoi desu.', meaning: '가방이 무겁습니다.' },
        { jp: 'ばすを まちます。', romaji: 'basu o machimasu.', meaning: '버스를 기다립니다.' }
      ]
    },
    {
      id: 'ha_bi', category: 'hiragana', subType: 'dakuon', row: 'ば행(탁음)', jp: 'び', romaji: 'bi', meaning: '비',
      pronTip: 'ひ(히)에 탁점(゛)을 붙여 "비"로 발음합니다.',
      mnemonic: 'ひ를 쓴 뒤 오른쪽 위에 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '🏥', jp: 'びょういん', romaji: 'byouin', meaning: '병원' },
        { emoji: '🎆', jp: 'はなび', romaji: 'hanabi', meaning: '불꽃놀이' },
        { emoji: '✈️', jp: 'たび', romaji: 'tabi', meaning: '여행' }
      ],
      examples: [
        { jp: 'なつに はなびを みます。', romaji: 'natsu ni hanabi o mimasu.', meaning: '여름에 불꽃놀이를 봅니다.' },
        { jp: 'びょういんへ いきます。', romaji: 'byouin e ikimasu.', meaning: '병원에 갑니다.' }
      ]
    },
    {
      id: 'ha_bu', category: 'hiragana', subType: 'dakuon', row: 'ば행(탁음)', jp: 'ぶ', romaji: 'bu', meaning: '부',
      pronTip: 'ふ(후)에 탁점(゛)을 붙여 "부"로 발음합니다.',
      mnemonic: 'ふ를 쓴 뒤 오른쪽 상단에 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '🐷', jp: 'ぶた', romaji: 'buta', meaning: '돼지' },
        { emoji: '🍇', jp: 'ぶどう', romaji: 'budou', meaning: '포도' },
        { emoji: '📰', jp: 'しんぶん', romaji: 'shinbun', meaning: '신문' }
      ],
      examples: [
        { jp: 'あまい ぶどうを たべます。', romaji: 'amai budou o tabemasu.', meaning: '달콤한 포도를 먹습니다.' },
        { jp: 'あさ しんぶんを よみます。', romaji: 'asa shinbun o yomimasu.', meaning: '아침에 신문을 읽습니다.' }
      ]
    },
    {
      id: 'ha_be', category: 'hiragana', subType: 'dakuon', row: 'ば행(탁음)', jp: 'べ', romaji: 'be', meaning: '베',
      pronTip: 'へ(헤)에 탁점(゛)을 붙여 "베"로 발음합니다.',
      mnemonic: 'へ를 한 획으로 그린 뒤 탁점(゛)을 붙입니다.',
      words: [
        { emoji: '🍱', jp: 'べんとう', romaji: 'bentou', meaning: '도시락' },
        { emoji: '📚', jp: 'べんきょう', romaji: 'benkyou', meaning: '공부' },
        { emoji: '🍽️', jp: 'たべもの', romaji: 'tabemono', meaning: '음식' }
      ],
      examples: [
        { jp: 'まいにち べんきょうします。', romaji: 'mainichi benkyou shimasu.', meaning: '매일 공부합니다.' },
        { jp: 'おべんとうを つくります。', romaji: 'obentou o tsukurimasu.', meaning: '도시락을 만듭니다.' }
      ]
    },
    {
      id: 'ha_bo', category: 'hiragana', subType: 'dakuon', row: 'ば행(탁음)', jp: 'ぼ', romaji: 'bo', meaning: '보',
      pronTip: 'ほ(호)에 탁점(゛)을 붙여 "보"로 발음합니다.',
      mnemonic: 'ほ를 쓴 뒤 오른쪽 위에 탁점(゛)을 찍습니다.',
      words: [
        { emoji: '🧢', jp: 'ぼうし', romaji: 'boushi', meaning: '모자' },
        { emoji: '🙋', jp: 'ぼく', romaji: 'boku', meaning: '나(남성)' },
        { emoji: '🔘', jp: 'ぼたん', romaji: 'botan', meaning: '단추 / 버튼' }
      ],
      examples: [
        { jp: 'ぼうしを かぶります。', romaji: 'boushi o kaburimasu.', meaning: '모자를 씁니다.' },
        { jp: 'ぼたんを おします。', romaji: 'botan o oshimasu.', meaning: '버튼을 누릅니다.' }
      ]
    },

    // ==================== 2. 반탁음 (ぱ행 5자) ====================
    {
      id: 'ha_pa', category: 'hiragana', subType: 'handakuon', row: 'ぱ행(반탁음)', jp: 'ぱ', romaji: 'pa', meaning: '파',
      pronTip: 'は(하)에 반탁점(゜)을 붙여 맑게 터지는 "파"로 발음합니다.',
      mnemonic: 'は를 쓰고 오른쪽 위에 작은 동그라미(゜)를 그립니다.',
      words: [
        { emoji: '🍞', jp: 'ぱん', romaji: 'pan', meaning: '빵' },
        { emoji: '🐼', jp: 'ぱんだ', romaji: 'panda', meaning: '판다' },
        { emoji: '🎉', jp: 'ぱーてぃー', romaji: 'paatii', meaning: '파티' }
      ],
      examples: [
        { jp: 'あさ ぱんを たべます。', romaji: 'asa pan o tabemasu.', meaning: '아침에 빵을 먹습니다.' },
        { jp: 'ぱんだが かわいいです。', romaji: 'panda ga kawaii desu.', meaning: '판다가 귀엽습니다.' }
      ]
    },
    {
      id: 'ha_pi', category: 'hiragana', subType: 'handakuon', row: 'ぱ행(반탁음)', jp: 'ぴ', romaji: 'pi', meaning: '피',
      pronTip: 'ひ(히)에 반탁점(゜)을 붙여 "피"로 발음합니다.',
      mnemonic: 'ひ를 쓴 뒤 오른쪽 위에 동그라미(゜)를 그립니다.',
      words: [
        { emoji: '✨', jp: 'ぴかぴか', romaji: 'pikapika', meaning: '반짝반짝' },
        { emoji: '✏️', jp: 'えんぴつ', romaji: 'enpitsu', meaning: '연필' },
        { emoji: '🎹', jp: 'ぴあの', romaji: 'piano', meaning: '피아노' }
      ],
      examples: [
        { jp: 'えんぴつで かきます。', romaji: 'enpitsu de kakimasu.', meaning: '연필로 씁니다.' },
        { jp: 'くつが ぴかぴかです。', romaji: 'kutsu ga pikapika desu.', meaning: '신발이 반짝반짝합니다.' }
      ]
    },
    {
      id: 'ha_pu', category: 'hiragana', subType: 'handakuon', row: 'ぱ행(반탁음)', jp: 'ぷ', romaji: 'pu', meaning: '푸',
      pronTip: 'ふ(후)에 반탁점(゜)을 붙여 "푸"로 발음합니다.',
      mnemonic: 'ふ를 쓴 뒤 오른쪽 위에 동그라미(゜)를 그립니다.',
      words: [
        { emoji: '🎁', jp: 'ぷれぜんと', romaji: 'purezento', meaning: '선물' },
        { emoji: '🏊', jp: 'ぷーる', romaji: 'puuru', meaning: '수영장' },
        { emoji: '🍎', jp: 'きっぷ', romaji: 'kippu', meaning: '표 / 승차권' }
      ],
      examples: [
        { jp: 'きっぷを かいます。', romaji: 'kippu o kaimasu.', meaning: '표를 삽니다.' },
        { jp: 'ぷーるで およぎます。', romaji: 'puuru de oyogimasu.', meaning: '수영장에서 수영합니다.' }
      ]
    },
    {
      id: 'ha_pe', category: 'hiragana', subType: 'handakuon', row: 'ぱ행(반탁음)', jp: 'ぺ', romaji: 'pe', meaning: '페',
      pronTip: 'へ(헤)에 반탁점(゜)을 붙여 "페"로 발음합니다.',
      mnemonic: 'へ를 쓰고 오른쪽 위에 동그라미(゜)를 그립니다.',
      words: [
        { emoji: '🐧', jp: 'ぺんぎん', romaji: 'pengin', meaning: '펭귄' },
        { emoji: '🖊️', jp: 'ぺん', romaji: 'pen', meaning: '펜' },
        { emoji: '😋', jp: 'ぺこぺこ', romaji: 'pekopeko', meaning: '배가 꼬르륵 고픔' }
      ],
      examples: [
        { jp: 'おなかが ぺこぺこです。', romaji: 'onaka ga pekopeko desu.', meaning: '배가 꼬르륵 고픕니다.' },
        { jp: 'あかい ぺんを つかいます。', romaji: 'akai pen o tsukaimasu.', meaning: '빨간 펜을 사용합니다.' }
      ]
    },
    {
      id: 'ha_po', category: 'hiragana', subType: 'handakuon', row: 'ぱ행(반탁음)', jp: 'ぽ', romaji: 'po', meaning: '포',
      pronTip: 'ほ(호)에 반탁점(゜)을 붙여 "포"로 발음합니다.',
      mnemonic: 'ほ를 쓴 뒤 오른쪽 위에 동그라미(゜)를 그립니다.',
      words: [
        { emoji: '🚶', jp: 'さんぽ', romaji: 'sanpo', meaning: '산책' },
        { emoji: '📮', jp: 'ぽすと', romaji: 'posuto', meaning: '우체통' },
        { emoji: '🧦', jp: 'ぽけっと', romaji: 'poketto', meaning: '주머니' }
      ],
      examples: [
        { jp: 'こうえんを さんぽします。', romaji: 'kouen o sanpo shimasu.', meaning: '공원을 산책합니다.' },
        { jp: 'ぽけっとに いれます。', romaji: 'poketto ni iremasu.', meaning: '주머니에 넣습니다.' }
      ]
    },

    // ==================== 3. 요음 (い단 + 작은 ゃ/ゅ/ょ) ====================
    {
      id: 'ha_kya', category: 'hiragana', subType: 'yoon', row: 'きゃ행(요음)', jp: 'きゃ', romaji: 'kya', meaning: '캬',
      pronTip: 'き와 작은 ゃ를 한 박자로 합쳐 "캬"라고 발음합니다.',
      mnemonic: 'き를 정상 크기로 쓰고 오른쪽 아래에 작은 ゃ를 붙입니다.',
      words: [
        { emoji: '🧑', jp: 'おきゃくさん', romaji: 'okyakusan', meaning: '손님' },
        { emoji: '🥬', jp: 'きゃべつ', romaji: 'kyabetsu', meaning: '양배추' }
      ],
      examples: [
        { jp: 'おきゃくさんが きました。', romaji: 'okyakusan ga kimashita.', meaning: '손님이 오셨습니다.' }
      ]
    },
    {
      id: 'ha_kyu', category: 'hiragana', subType: 'yoon', row: 'きゃ행(요음)', jp: 'きゅ', romaji: 'kyu', meaning: '큐',
      pronTip: 'き + 작은 ゅ를 한 박자로 합쳐 "큐"라고 발음합니다.',
      mnemonic: 'き 뒤에 작은 ゅ를 오른쪽 아래에 맞춰 씁니다.',
      words: [
        { emoji: '🥒', jp: 'きゅうり', romaji: 'kyuuri', meaning: '오이' },
        { emoji: '🚑', jp: 'きゅうきゅうしゃ', romaji: 'kyuukyuusha', meaning: '구급차' }
      ],
      examples: [
        { jp: 'きゅうりを きります。', romaji: 'kyuuri o kirimasu.', meaning: '오이를 자릅니다.' }
      ]
    },
    {
      id: 'ha_kyo', category: 'hiragana', subType: 'yoon', row: 'きゃ행(요음)', jp: 'きょ', romaji: 'kyo', meaning: '쿄',
      pronTip: 'き + 작은 ょ를 합쳐 "쿄"라고 발음합니다.',
      mnemonic: 'き 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '📅', jp: 'きょう', romaji: 'kyou', meaning: '오늘' },
        { emoji: '🗼', jp: 'とうきょう', romaji: 'toukyou', meaning: '도쿄' }
      ],
      examples: [
        { jp: 'きょうは いい てんきです。', romaji: 'kyou wa ii tenki desu.', meaning: '오늘은 좋은 날씨입니다.' }
      ]
    },
    {
      id: 'ha_sha', category: 'hiragana', subType: 'yoon', row: 'しゃ행(요음)', jp: 'しゃ', romaji: 'sha', meaning: '샤',
      pronTip: 'し + 작은 ゃ를 합쳐 "샤"라고 발음합니다.',
      mnemonic: 'し 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '📷', jp: 'しゃしん', romaji: 'shashin', meaning: '사진' },
        { emoji: '🏢', jp: 'かいしゃ', romaji: 'kaisha', meaning: '회사' }
      ],
      examples: [
        { jp: 'しゃしんを とります。', romaji: 'shashin o torimasu.', meaning: '사진을 찍습니다.' }
      ]
    },
    {
      id: 'ha_shu', category: 'hiragana', subType: 'yoon', row: 'しゃ행(요음)', jp: 'しゅ', romaji: 'shu', meaning: '슈',
      pronTip: 'し + 작은 ゅ를 합쳐 "슈"라고 발음합니다.',
      mnemonic: 'し 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🎨', jp: 'しゅみ', romaji: 'shumi', meaning: '취미' },
        { emoji: '📝', jp: 'しゅくだい', romaji: 'shukudai', meaning: '숙제' }
      ],
      examples: [
        { jp: 'しゅくだいを します。', romaji: 'shukudai o shimasu.', meaning: '숙제를 합니다.' }
      ]
    },
    {
      id: 'ha_sho', category: 'hiragana', subType: 'yoon', row: 'しゃ행(요음)', jp: 'しょ', romaji: 'sho', meaning: '쇼',
      pronTip: 'し + 작은 ょ를 합쳐 "쇼"라고 발음합니다.',
      mnemonic: 'し 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🤝', jp: 'いっしょに', romaji: 'issho ni', meaning: '함께' },
        { emoji: '🍜', jp: 'しょくじ', romaji: 'shokuji', meaning: '식사' }
      ],
      examples: [
        { jp: 'いっしょに たべましょう。', romaji: 'issho ni tabemashou.', meaning: '함께 먹읍시다.' }
      ]
    },
    {
      id: 'ha_cha', category: 'hiragana', subType: 'yoon', row: 'ちゃ행(요음)', jp: 'ちゃ', romaji: 'cha', meaning: '챠',
      pronTip: 'ち + 작은 ゃ를 합쳐 "챠"라고 발음합니다.',
      mnemonic: 'ち 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '🍵', jp: 'おちゃ', romaji: 'ocha', meaning: '차(녹차)' },
        { emoji: '🧸', jp: 'おもちゃ', romaji: 'omocha', meaning: '장난감' }
      ],
      examples: [
        { jp: 'あたたかい おちゃを のみます。', romaji: 'atatakai ocha o nomimasu.', meaning: '따뜻한 차를 마십니다.' }
      ]
    },
    {
      id: 'ha_chu', category: 'hiragana', subType: 'yoon', row: 'ちゃ행(요음)', jp: 'ちゅ', romaji: 'chu', meaning: '츄',
      pronTip: 'ち + 작은 ゅ를 합쳐 "츄"라고 발음합니다.',
      mnemonic: 'ち 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '⚠️', jp: 'ちゅうい', romaji: 'chuui', meaning: '주의' },
        { emoji: '🍽️', jp: 'ちゅうもん', romaji: 'chuumon', meaning: '주문' }
      ],
      examples: [
        { jp: 'ちゅうもんを おねがいします。', romaji: 'chuumon o onegaishimasu.', meaning: '주문 부탁드립니다.' }
      ]
    },
    {
      id: 'ha_cho', category: 'hiragana', subType: 'yoon', row: 'ちゃ행(요음)', jp: 'ちょ', romaji: 'cho', meaning: '쵸',
      pronTip: 'ち + 작은 ょ를 합쳐 "쵸"라고 발음합니다.',
      mnemonic: 'ち 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '⏳', jp: 'ちょっと', romaji: 'chotto', meaning: '잠깐 / 조금' },
        { emoji: '🍫', jp: 'ちょこれーと', romaji: 'chokoreeto', meaning: '초콜릿' }
      ],
      examples: [
        { jp: 'ちょっと まって ください。', romaji: 'chotto matte kudasai.', meaning: '잠깐 기다려 주세요.' }
      ]
    },
    {
      id: 'ha_nya', category: 'hiragana', subType: 'yoon', row: 'にゃ행(요음)', jp: 'にゃ', romaji: 'nya', meaning: '냐',
      pronTip: 'に + 작은 ゃ를 합쳐 "냐"라고 발음합니다.',
      mnemonic: 'に 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '🐱', jp: 'にゃーにゃー', romaji: 'nyaanyaa', meaning: '야옹야옹' },
        { emoji: '🍲', jp: 'こんにゃく', romaji: 'konnyaku', meaning: '곤약' }
      ],
      examples: [
        { jp: 'ねこが にゃーと なきます。', romaji: 'neko ga nyaa to nakimasu.', meaning: '고양이가 야옹하고 웁니다.' }
      ]
    },
    {
      id: 'ha_nyu', category: 'hiragana', subType: 'yoon', row: 'にゃ행(요음)', jp: 'にゅ', romaji: 'nyu', meaning: '뉴',
      pronTip: 'に + 작은 ゅ를 합쳐 "뉴"라고 발음합니다.',
      mnemonic: 'に 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🥛', jp: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaning: '우유' },
        { emoji: '📺', jp: 'にゅーす', romaji: 'nyuusu', meaning: '뉴스' }
      ],
      examples: [
        { jp: 'まいあさ ぎゅうにゅうを のみます。', romaji: 'maiasa gyuunyuu o nomimasu.', meaning: '매일 아침 우유를 마십니다.' }
      ]
    },
    {
      id: 'ha_nyo', category: 'hiragana', subType: 'yoon', row: 'にゃ행(요음)', jp: 'にょ', romaji: 'nyo', meaning: '뇨',
      pronTip: 'に + 작은 ょ를 합쳐 "뇨"라고 발음합니다.',
      mnemonic: 'に 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🎋', jp: 'にょきにょき', romaji: 'nyokinyoki', meaning: '쑥쑥(자라는 모양)' }
      ],
      examples: [
        { jp: 'たけのこが にょきにょき のびます。', romaji: 'takenoko ga nyokinyoki nobimasu.', meaning: '죽순이 쑥쑥 자랍니다.' }
      ]
    },
    {
      id: 'ha_hya', category: 'hiragana', subType: 'yoon', row: 'ひゃ행(요음)', jp: 'ひゃ', romaji: 'hya', meaning: '햐',
      pronTip: 'ひ + 작은 ゃ를 합쳐 "햐"라고 발음합니다.',
      mnemonic: 'ひ 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '💯', jp: 'ひゃく', romaji: 'hyaku', meaning: '백(100)' }
      ],
      examples: [
        { jp: 'ひゃくえん です。', romaji: 'hyakuen desu.', meaning: '100엔입니다.' }
      ]
    },
    {
      id: 'ha_hyu', category: 'hiragana', subType: 'yoon', row: 'ひゃ행(요음)', jp: 'ひゅ', romaji: 'hyu', meaning: '휴',
      pronTip: 'ひ + 작은 ゅ를 합쳐 "휴"라고 발음합니다.',
      mnemonic: 'ひ 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🌬️', jp: 'ひゅうひゅう', romaji: 'hyuuhyuu', meaning: '쌩쌩(바람 소리)' }
      ],
      examples: [
        { jp: 'かぜが ひゅうひゅう ふきます。', romaji: 'kaze ga hyuuhyuu fukimasu.', meaning: '바람이 쌩쌩 붑니다.' }
      ]
    },
    {
      id: 'ha_hyo', category: 'hiragana', subType: 'yoon', row: 'ひゃ행(요음)', jp: 'ひょ', romaji: 'hyo', meaning: '효',
      pronTip: 'ひ + 작은 ょ를 합쳐 "효"라고 발음합니다.',
      mnemonic: 'ひ 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🐆', jp: 'ひょう', romaji: 'hyou', meaning: '표범 / 표(도표)' }
      ],
      examples: [
        { jp: 'ひょうを みます。', romaji: 'hyou o mimasu.', meaning: '도표를 봅니다.' }
      ]
    },
    {
      id: 'ha_mya', category: 'hiragana', subType: 'yoon', row: 'みゃ행(요음)', jp: 'みゃ', romaji: 'mya', meaning: '먀',
      pronTip: 'み + 작은 ゃ를 합쳐 "먀"라고 발음합니다.',
      mnemonic: 'み 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '💓', jp: 'みゃく', romaji: 'myaku', meaning: '맥박' }
      ],
      examples: [
        { jp: 'みゃくを はかります。', romaji: 'myaku o hakarimasu.', meaning: '맥박을 잽니다.' }
      ]
    },
    {
      id: 'ha_myu', category: 'hiragana', subType: 'yoon', row: 'みゃ행(요음)', jp: 'みゅ', romaji: 'myu', meaning: '뮤',
      pronTip: 'み + 작은 ゅ를 합쳐 "뮤"라고 발음합니다.',
      mnemonic: 'み 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🎶', jp: 'みゅーじっく', romaji: 'myuujikku', meaning: '뮤직(음악)' }
      ],
      examples: [
        { jp: 'みゅーじっくが すきです。', romaji: 'myuujikku ga suki desu.', meaning: '음악을 좋아합니다.' }
      ]
    },
    {
      id: 'ha_myo', category: 'hiragana', subType: 'yoon', row: 'みゃ행(요음)', jp: 'みょ', romaji: 'myo', meaning: '묘',
      pronTip: 'み + 작은 ょ를 합쳐 "묘"라고 발음합니다.',
      mnemonic: 'み 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🏷️', jp: 'みょうじ', romaji: 'myouji', meaning: '성(성씨)' }
      ],
      examples: [
        { jp: 'みょうじを おしえて ください。', romaji: 'myouji o oshiete kudasai.', meaning: '성씨를 알려 주세요.' }
      ]
    },
    {
      id: 'ha_rya', category: 'hiragana', subType: 'yoon', row: 'りゃ행(요음)', jp: 'りゃ', romaji: 'rya', meaning: '랴',
      pronTip: 'り + 작은 ゃ를 합쳐 "랴"라고 발음합니다.',
      mnemonic: 'り 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '✂️', jp: 'りゃくご', romaji: 'ryakugo', meaning: '줄임말(약어)' }
      ],
      examples: [
        { jp: 'りゃくごを つかいます。', romaji: 'ryakugo o tsukaimasu.', meaning: '줄임말을 사용합니다.' }
      ]
    },
    {
      id: 'ha_ryu', category: 'hiragana', subType: 'yoon', row: 'りゃ행(요음)', jp: 'りゅ', romaji: 'ryu', meaning: '류',
      pronTip: 'り + 작은 ゅ를 합쳐 "류"라고 발음합니다.',
      mnemonic: 'り 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '✈️', jp: 'りゅうがく', romaji: 'ryuugaku', meaning: '유학' },
        { emoji: '🎒', jp: 'りゅっく', romaji: 'ryukku', meaning: '배낭' }
      ],
      examples: [
        { jp: 'にほんへ りゅうがくします。', romaji: 'nihon e ryuugaku shimasu.', meaning: '일본으로 유학합니다.' }
      ]
    },
    {
      id: 'ha_ryo', category: 'hiragana', subType: 'yoon', row: 'りゃ행(요음)', jp: 'りょ', romaji: 'ryo', meaning: '료',
      pronTip: 'り + 작은 ょ를 합쳐 "료"라고 발음합니다.',
      mnemonic: 'り 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '✈️', jp: 'りょこう', romaji: 'ryokou', meaning: '여행' },
        { emoji: '🍳', jp: 'りょうり', romaji: 'ryouri', meaning: '요리' }
      ],
      examples: [
        { jp: 'りょうりを つくります。', romaji: 'ryouri o tsukurimasu.', meaning: '요리를 만듭니다.' }
      ]
    },
    {
      id: 'ha_gya', category: 'hiragana', subType: 'yoon', row: 'ぎゃ행(탁음요음)', jp: 'ぎゃ', romaji: 'gya', meaning: '갸',
      pronTip: 'ぎ + 작은 ゃ를 합쳐 "갸"라고 발음합니다.',
      mnemonic: 'ぎ를 쓰고 오른쪽 아래에 작은 ゃ를 붙입니다.',
      words: [
        { emoji: '🔄', jp: 'ぎゃく', romaji: 'gyaku', meaning: '반대(역)' }
      ],
      examples: [
        { jp: 'ぎゃくの ほうこうです。', romaji: 'gyaku no houkou desu.', meaning: '반대 방향입니다.' }
      ]
    },
    {
      id: 'ha_gyu', category: 'hiragana', subType: 'yoon', row: 'ぎゃ행(탁음요음)', jp: 'ぎゅ', romaji: 'gyu', meaning: '규',
      pronTip: 'ぎ + 작은 ゅ를 합쳐 "규"라고 발음합니다.',
      mnemonic: 'ぎ 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🥩', jp: 'ぎゅうにく', romaji: 'gyuuniku', meaning: '소고기' }
      ],
      examples: [
        { jp: 'ぎゅうにくが おいしいです。', romaji: 'gyuuniku ga oishii desu.', meaning: '소고기가 맛있습니다.' }
      ]
    },
    {
      id: 'ha_gyo', category: 'hiragana', subType: 'yoon', row: 'ぎゃ행(탁음요음)', jp: 'ぎょ', romaji: 'gyo', meaning: '교',
      pronTip: 'ぎ + 작은 ょ를 합쳐 "교"라고 발음합니다.',
      mnemonic: 'ぎ 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🥟', jp: 'ぎょうざ', romaji: 'gyouza', meaning: '만두(교자)' },
        { emoji: '🐠', jp: 'きんぎょ', romaji: 'kingyo', meaning: '금붕어' }
      ],
      examples: [
        { jp: 'ぎょうざを たべます。', romaji: 'gyouza o tabemasu.', meaning: '만두를 먹습니다.' }
      ]
    },
    {
      id: 'ha_ja', category: 'hiragana', subType: 'yoon', row: 'じゃ행(탁음요음)', jp: 'じゃ', romaji: 'ja', meaning: '쟈',
      pronTip: 'じ + 작은 ゃ를 합쳐 "쟈"라고 발음합니다.',
      mnemonic: 'じ 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '🥔', jp: 'じゃがいも', romaji: 'jagaimo', meaning: '감자' },
        { emoji: '👋', jp: 'じゃあね', romaji: 'jaa ne', meaning: '그럼 안녕' }
      ],
      examples: [
        { jp: 'じゃがいもを かいます。', romaji: 'jagaimo o kaimasu.', meaning: '감자를 삽니다.' }
      ]
    },
    {
      id: 'ha_ju', category: 'hiragana', subType: 'yoon', row: 'じゃ행(탁음요음)', jp: 'じゅ', romaji: 'ju', meaning: '쥬',
      pronTip: 'じ + 작은 ゅ를 합쳐 "쥬"라고 발음합니다.',
      mnemonic: 'じ 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🏫', jp: 'じゅぎょう', romaji: 'jugyou', meaning: '수업' },
        { emoji: '🧃', jp: 'じゅーす', romaji: 'juusu', meaning: '주스' }
      ],
      examples: [
        { jp: 'じゅぎょうが はじまります。', romaji: 'jugyou ga hajimarimasu.', meaning: '수업이 시작됩니다.' }
      ]
    },
    {
      id: 'ha_jo', category: 'hiragana', subType: 'yoon', row: 'じゃ행(탁음요음)', jp: 'じょ', romaji: 'jo', meaning: '죠',
      pronTip: 'じ + 작은 ょ를 합쳐 "죠"라고 발음합니다.',
      mnemonic: 'じ 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '👏', jp: 'じょうず', romaji: 'jouzu', meaning: '능숙함 / 잘함' }
      ],
      examples: [
        { jp: 'にほんごが じょうずですね。', romaji: 'nihongo ga jouzu desu ne.', meaning: '일본어를 잘하시네요.' }
      ]
    },
    {
      id: 'ha_bya', category: 'hiragana', subType: 'yoon', row: 'びゃ행(탁음요음)', jp: 'びゃ', romaji: 'bya', meaning: '뱌',
      pronTip: 'び + 작은 ゃ를 합쳐 "뱌"라고 발음합니다.',
      mnemonic: 'び 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '3️⃣', jp: 'さんびゃく', romaji: 'sanbyaku', meaning: '삼백(300)' }
      ],
      examples: [
        { jp: 'さんびゃくえん です。', romaji: 'sanbyakuen desu.', meaning: '300엔입니다.' }
      ]
    },
    {
      id: 'ha_byu', category: 'hiragana', subType: 'yoon', row: 'びゃ행(탁음요음)', jp: 'びゅ', romaji: 'byu', meaning: '뷰',
      pronTip: 'び + 작은 ゅ를 합쳐 "뷰"라고 발음합니다.',
      mnemonic: 'び 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '🎤', jp: 'いんたびゅう', romaji: 'intabyuu', meaning: '인터뷰' }
      ],
      examples: [
        { jp: 'いんたびゅうを します。', romaji: 'intabyuu o shimasu.', meaning: '인터뷰를 합니다.' }
      ]
    },
    {
      id: 'ha_byo', category: 'hiragana', subType: 'yoon', row: 'びゃ행(탁음요음)', jp: 'びょ', romaji: 'byo', meaning: '뵤',
      pronTip: 'び + 작은 ょ를 합쳐 "뵤"라고 발음합니다.',
      mnemonic: 'び 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🏥', jp: 'びょういん', romaji: 'byouin', meaning: '병원' },
        { emoji: '🤒', jp: 'びょうき', romaji: 'byouki', meaning: '병(질병)' }
      ],
      examples: [
        { jp: 'びょうきが なおりました。', romaji: 'byouki ga naorimashita.', meaning: '병이 나았습니다.' }
      ]
    },
    {
      id: 'ha_pya', category: 'hiragana', subType: 'yoon', row: 'ぴゃ행(반탁음요음)', jp: 'ぴゃ', romaji: 'pya', meaning: '퍄',
      pronTip: 'ぴ + 작은 ゃ를 합쳐 "퍄"라고 발음합니다.',
      mnemonic: 'ぴ 뒤에 작은 ゃ를 붙여 씁니다.',
      words: [
        { emoji: '6️⃣', jp: 'ろっぴゃく', romaji: 'roppyaku', meaning: '육백(600)' }
      ],
      examples: [
        { jp: 'ろっぴゃくえん です。', romaji: 'roppyakuen desu.', meaning: '600엔입니다.' }
      ]
    },
    {
      id: 'ha_pyu', category: 'hiragana', subType: 'yoon', row: 'ぴゃ행(반탁음요음)', jp: 'ぴゅ', romaji: 'pyu', meaning: '퓨',
      pronTip: 'ぴ + 작은 ゅ를 합쳐 "퓨"라고 발음합니다.',
      mnemonic: 'ぴ 뒤에 작은 ゅ를 붙여 씁니다.',
      words: [
        { emoji: '💻', jp: 'こんぴゅーたー', romaji: 'konpyuutaa', meaning: '컴퓨터' }
      ],
      examples: [
        { jp: 'こんぴゅーたーを つかいます。', romaji: 'konpyuutaa o tsukaimasu.', meaning: '컴퓨터를 사용합니다.' }
      ]
    },
    {
      id: 'ha_pyo', category: 'hiragana', subType: 'yoon', row: 'ぴゃ행(반탁음요음)', jp: 'ぴょ', romaji: 'pyo', meaning: '표',
      pronTip: 'ぴ + 작은 ょ를 합쳐 "표"라고 발음합니다.',
      mnemonic: 'ぴ 뒤에 작은 ょ를 붙여 씁니다.',
      words: [
        { emoji: '🎤', jp: 'はっぴょう', romaji: 'happyou', meaning: '발표' },
        { emoji: '🐰', jp: 'ぴょんぴょん', romaji: 'pyonpyon', meaning: '깡충깡충' }
      ],
      examples: [
        { jp: 'あした はっぴょうが あります。', romaji: 'ashita happyou ga arimasu.', meaning: '내일 발표가 있습니다.' }
      ]
    }
  ];

  global.HIRAGANA_ADVANCED_DATA = HIRAGANA_ADVANCED_DATA;
})(window);