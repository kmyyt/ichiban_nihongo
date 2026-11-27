// 통합 콘텐츠 DB 허브: 기본 50음도 + 심화 50음도 + 확장 단어·예문 + 영역별 문법·작문 통합
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
      if (!extra) return { ...item, subType: 'basic' };
      return {
        ...item,
        subType: 'basic',
        words: [
          ...(Array.isArray(item.words) ? item.words : []),
          ...(Array.isArray(extra.words) ? extra.words : [])
        ],
        examples: [
          ...(Array.isArray(item.examples) ? item.examples : []),
          ...(Array.isArray(extra.examples) ? extra.examples : [])
        ]
      };
    });
  }

  const rawHiragana = Array.isArray(global.HIRAGANA_DATA) ? global.HIRAGANA_DATA : [];
  const rawExtraPack = global.HIRAGANA_EXTRA_PACK || {};
  const hiraganaBasicItems = mergeHiraganaWithExtraPack(rawHiragana, rawExtraPack);
  const hiraganaAdvancedItems = Array.isArray(global.HIRAGANA_ADVANCED_DATA)
    ? global.HIRAGANA_ADVANCED_DATA.map(i => ({ ...i, category: 'hiragana' }))
    : [];

  const katakanaItems = Array.isArray(global.KATAKANA_DATA) ? global.KATAKANA_DATA : [];
  const vocabItems = Array.isArray(global.VOCAB_DATA) ? global.VOCAB_DATA : [];

  const items = [
    ...hiraganaBasicItems,
    ...hiraganaAdvancedItems,
    ...katakanaItems,
    ...vocabItems
  ];

  const byId = new Map(items.map(item => [item.id, item]));

  const grammarByCategory = global.GRAMMAR_BY_CATEGORY || {
    hiragana: Array.isArray(global.GRAMMAR_LESSONS) ? global.GRAMMAR_LESSONS : []
  };
  const writingByCategory = global.WRITING_BY_CATEGORY || {
    hiragana: Array.isArray(global.WRITING_EXERCISES) ? global.WRITING_EXERCISES : []
  };

  const ContentDB = {
    items,
    hiraganaBasicItems,
    hiraganaAdvancedItems,
    grammarByCategory,
    writingByCategory,
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
    getHiraganaBasic() {
      return hiraganaBasicItems;
    },
    getHiraganaAdvanced(subType = 'all') {
      if (!subType || subType === 'all') return hiraganaAdvancedItems;
      return hiraganaAdvancedItems.filter(i => i.subType === subType);
    },
    getGrammarByCategory(category) {
      return grammarByCategory[category] || [];
    },
    getWritingByCategory(category) {
      return writingByCategory[category] || [];
    },
    getRows() {
      return ROWS;
    },
    getCategoryLabel(category) {
      return CATEGORY_LABELS[category] || category;
    }
  };

  global.ContentDB = ContentDB;
  global.JP_DATA = {
    items: ContentDB.items,
    grammarLessons: grammarByCategory.hiragana || [],
    writingExercises: writingByCategory.hiragana || []
  };
})(window);
