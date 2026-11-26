// 통합 콘텐츠 DB 허브: 카테고리별 전역 데이터(HIRAGANA_DATA 등)를 통합 제공
(function (global) {
  const ROWS = ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

  const hiraganaItems =
    global.HIRAGANA_DATA || (typeof HIRAGANA_DATA !== 'undefined' ? HIRAGANA_DATA : []);
  const katakanaItems =
    global.KATAKANA_DATA || (typeof KATAKANA_DATA !== 'undefined' ? KATAKANA_DATA : []);
  const vocabItems =
    global.VOCAB_DATA || (typeof VOCAB_DATA !== 'undefined' ? VOCAB_DATA : []);

  const items = [
    ...hiraganaItems,
    ...katakanaItems,
    ...vocabItems
  ];

  const byId = new Map(items.map(item => [item.id, item]));

  const defaultGrammarLessons = [
    {
      stage: 'STEP 1 · 명사 문법',
      title: '기본 긍정·부정·의문 (~です / ~ではありません / ~ですか)',
      desc: '명사 뒤에 です를 붙여 정중한 서술문을 만들고, ですか를 붙여 질문합니다.',
      sample: 'わたしは がくせいです。 / こちらは なんですか。'
    },
    {
      stage: 'STEP 2 · 형용사 문법',
      title: 'い형용사 & な형용사 활용',
      desc: 'い형용사는 원형 그대로 명사를 꾸미고, な형용사는 명사 앞에서 な를 붙입니다.',
      sample: 'あかい りんご / しずかな まち'
    },
    {
      stage: 'STEP 3 · 동사 문법',
      title: '정중형(ます형)과 조사(を·に·へ)',
      desc: '목적어 뒤에는 を, 이동 목적지 뒤에는 へ 또는 に를 연결합니다.',
      sample: 'みずを のみます。 / がっこうへ いきます。'
    }
  ];

  const defaultWritingExercises = [
    {
      ko: '사과를 먹습니다.',
      hint: 'りんご(사과) + を + たべます(먹습니다)',
      answer: 'りんごを たべます。',
      romaji: 'ringo o tabemasu.'
    },
    {
      ko: '고양이가 있습니다.',
      hint: 'ねこ(고양이) + が + います(있습니다)',
      answer: 'ねこが います。',
      romaji: 'neko ga imasu.'
    },
    {
      ko: '하늘이 파랗습니다.',
      hint: 'そら(하늘) + が + あおいです(파랗습니다)',
      answer: 'そらが あおいです。',
      romaji: 'sora ga aoi desu.'
    }
  ];

  const grammarLessons =
    global.GRAMMAR_LESSONS || (typeof GRAMMAR_LESSONS !== 'undefined' ? GRAMMAR_LESSONS : defaultGrammarLessons);
  const writingExercises =
    global.WRITING_EXERCISES || (typeof WRITING_EXERCISES !== 'undefined' ? WRITING_EXERCISES : defaultWritingExercises);

  const ContentDB = {
    items,
    grammarLessons,
    writingExercises,
    getAllItems() {
      return items;
    },
    getById(id) {
      return byId.get(id) || null;
    },
    getByCategory(category) {
      if (!category || category === 'all') return items;
      return items.filter(item => item.category === category);
    },
    getHiraganaByRow(row) {
      const hira = items.filter(item => item.category === 'hiragana');
      if (!row || row === 'all') return hira;
      return hira.filter(item => item.row === row);
    },
    getRows() {
      return ROWS;
    }
  };

  const JP_DATA = {
    items: ContentDB.items,
    grammarLessons: ContentDB.grammarLessons,
    writingExercises: ContentDB.writingExercises
  };

  global.ContentDB = ContentDB;
  global.JP_DATA = JP_DATA;
})(window);
