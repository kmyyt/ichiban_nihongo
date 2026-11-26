// 히라가나 문자별 추가 단어 & 예문 확장 팩 (window.HIRAGANA_EXTRA_PACK)
// 추후 히라가나 단어·예문을 계속 추가할 때 이 파일에 항목을 이어 붙이면 됩니다.
(function (global) {
  const HIRAGANA_EXTRA_PACK = {
    h_a: {
      words: [
        { emoji: '☀️', jp: 'あさ', romaji: 'asa', meaning: '아침' },
        { emoji: '🧸', jp: 'あそぶ', romaji: 'asobu', meaning: '놀다' }
      ],
      examples: [
        { jp: 'あさごはんを たべます。', romaji: 'asagohan o tabemasu.', meaning: '아침밥을 먹습니다.' }
      ]
    },
    h_i: {
      words: [
        { emoji: '🍓', jp: 'いちご', romaji: 'ichigo', meaning: '딸기' },
        { emoji: '⛰️', jp: 'いわ', romaji: 'iwa', meaning: '바위' }
      ],
      examples: [
        { jp: 'いちごが すきです。', romaji: 'ichigo ga suki desu.', meaning: '딸기를 좋아합니다.' }
      ]
    },
    h_u: {
      words: [
        { emoji: '🐂', jp: 'うし', romaji: 'ushi', meaning: '소' },
        { emoji: '🌷', jp: 'うえる', romaji: 'ueru', meaning: '심다' }
      ],
      examples: [
        { jp: 'はなを うえます。', romaji: 'hana o uemasu.', meaning: '꽃을 심습니다.' }
      ]
    },
    h_e: {
      words: [
        { emoji: '🍎', jp: 'えいご', romaji: 'eigo', meaning: '영어' },
        { emoji: '🪜', jp: 'えだ', romaji: 'eda', meaning: '나뭇가지' }
      ],
      examples: [
        { jp: 'えいごを はなします。', romaji: 'eigo o hanashimasu.', meaning: '영어를 말합니다.' }
      ]
    },
    h_o: {
      words: [
        { emoji: '🌕', jp: 'おおきい', romaji: 'ookii', meaning: '크다' },
        { emoji: '🏯', jp: 'おしろ', romaji: 'oshiro', meaning: '성' }
      ],
      examples: [
        { jp: 'おおきな いぬが います。', romaji: 'ookina inu ga imasu.', meaning: '큰 강아지가 있습니다.' }
      ]
    }
  };

  global.HIRAGANA_EXTRA_PACK = HIRAGANA_EXTRA_PACK;
})(window);