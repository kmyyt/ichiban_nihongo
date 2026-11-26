// 통합 콘텐츠 DB 허브: window 전역으로 데이터를 모아 조회 API 제공
(function (global) {
  const ROWS = ['あ행', 'か행', 'さ행', 'た행', 'な행', 'は행', 'ま행', 'や행', 'ら행', 'わ행'];

  const hiraganaItems =
    global.HIRAGANA_DATA || (typeof HIRAGANA_DATA !== 'undefined' ? HIRAGANA_DATA : []);
  const katakanaItems =
    global.KATAKANA_DATA || (typeof KATAKANA_DATA !== 'undefined' ? KATAKANA_DATA : []);
  const vocabItems =
    global.VOCAB_DATA || (typeof VOCAB_DATA !== 'undefined' ? VOCAB_DATA : []);
  const grammarLessons =
    global.GRAMMAR_LESSONS || (typeof GRAMMAR_LESSONS !== 'undefined' ? GRAMMAR_LESSONS : []);
  const writingExercises =
    global.WRITING_EXERCISES || (typeof WRITING_EXERCISES !== 'undefined' ? WRITING_EXERCISES : []);

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
