// 통합 콘텐츠 DB 허브 (구조 A: 히라가나 기본 데이터 + 단어·예문 확장 팩 병합 및 카테고리 통합)
(function (global) {
  const ROWS = ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

  const CATEGORY_LABELS = {
    all: '전체',
    hiragana: '히라가나',
    katakana: '가타카나',
    noun: '명사',
    i_adj: 'い형용사',
    na_adj: 'な형용사',
    verb: '동사'
  };

  function mergeHiraganaWithExtraPack(baseList, extraPack) {
    const list = Array.isArray(baseList) ? baseList : [];
    const pack = extraPack && typeof extraPack === 'object' ? extraPack : {};

    return list.map(item => {
      const extra = pack[item.id];
      if (!extra) return { ...item };

      const mergedWords = [
        ...(Array.isArray(item.words) ? item.words : []),
        ...(Array.isArray(extra.words) ? extra.words : [])
      ];

      const mergedExamples = [
        ...(Array.isArray(item.examples) ? item.examples : []),
        ...(Array.isArray(extra.examples) ? extra.examples : [])
      ];

      return {
        ...item,
        words: mergedWords,
        examples: mergedExamples
      };
    });
  }

  const rawHiragana = Array.isArray(global.HIRAGANA_DATA) ? global.HIRAGANA_DATA : [];
  const rawExtraPack = global.HIRAGANA_EXTRA_PACK || {};
  const hiraganaItems = mergeHiraganaWithExtraPack(rawHiragana, rawExtraPack);

  const katakanaItems = Array.isArray(global.KATAKANA_DATA) ? global.KATAKANA_DATA : [];
  const vocabItems = Array.isArray(global.VOCAB_DATA) ? global.VOCAB_DATA : [];

  const defaultGrammarLessons = [
    {
      stage: '기초 문법 1',
      title: '명사 서술문 (~です / ~ではありません)',
      desc: '명사 뒤에 です를 붙여 정중한 문장을 만들고, ですか를 붙여 질문합니다.',
      sample: 'わたしは がくせいです。 / こちらは なんですか。'
    },
    {
      stage: '기초 문법 2',
      title: '목적격 조사 を 와 이동 조사 に / へ',
      desc: '행동의 대상 뒤에는 を, 가는 장소 뒤에는 に 또는 へ를 사용합니다.',
      sample: 'みずを のみます。 / がっこうへ いきます。'
    },
    {
      stage: '기초 문법 3',
      title: 'い형용사 · な형용사 명사 수식',
      desc: 'い형용사는 원형 그대로, な형용사는 な를 붙여 명사를 꾸밉니다.',
      sample: 'あかい りんご / しずかな まち'
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
    Array.isArray(global.GRAMMAR_LESSONS) && global.GRAMMAR_LESSONS.length
      ? global.GRAMMAR_LESSONS
      : defaultGrammarLessons;

  const writingExercises =
    Array.isArray(global.WRITING_EXERCISES) && global.WRITING_EXERCISES.length
      ? global.WRITING_EXERCISES
      : defaultWritingExercises;

  const items = [
    ...hiraganaItems,
    ...katakanaItems,
    ...vocabItems
  ];

  const byId = new Map(items.map(item => [item.id, item]));

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
    },
    getCategoryLabel(category) {
      return CATEGORY_LABELS[category] || category;
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