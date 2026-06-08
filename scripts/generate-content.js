const fs = require('fs');
const path = require('path');

const enContent = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/content/en.json'), 'utf8'));

const languages = ['ar', 'ur', 'tr', 'fr', 'es', 'hi', 'id', 'de', 'ru', 'bn', 'pt', 'zh', 'ja', 'sw', 'ko'];

const translations = {
  ar: {
    title: { 'Shahada - Declaration of Faith': 'الشهادة - الإيمان بالله', 'Salah - Prayer': 'الصلاة', 'Zakat - Charity': 'الزكاة', 'Sawm - Fasting in Ramadan': 'الصيام في رمضان', 'Hajj - Pilgrimage to Mecca': 'الحج - رحلة مكة', 'Tawheed - Oneness of God': 'التوحيد - إله واحد', 'Angels': 'الملائكة', 'Holy Books': 'الكتب السماوية', 'Prophets of Allah': 'أنبياء الله', 'Day of Judgment': 'يوم القيامة', 'Wudu - Ablution': 'الوضوء', 'Islamic Dress': 'اللباس الإسلامي', 'Halal Food': 'الطعام الحلال', 'Duas - Supplications': 'الأدعية', 'Reading Quran': 'قراءة القرآن', 'Honesty': 'الصدق', 'Kindness': 'اللطف', 'Respect': 'الاحترام', 'Patience': 'الصبر', 'Gratitude': 'الشكر', 'Prophet Muhammad ﷺ': 'النبي محمد ﷺ', 'Prophet Ibrahim': 'النبي إبراهيم', 'Islamic Civilization': 'الحضارة الإسلامية', 'Ramadan': 'رمضان', 'Eid al-Fitr': 'عيد الفطر', 'Eid al-Adha': 'عيد الأضحى' },
  },
};

languages.forEach(lang => {
  const langContent = enContent.map(topic => {
    const langTopic = { ...topic };
    
    // Translate title if we have a translation, otherwise keep English
    if (lang === 'ar' && translations.ar.title[topic.title]) {
      langTopic.title = translations.ar.title[topic.title];
    }
    
    // Keep content in English for now - to be translated later
    // The structure is correct, just needs real translations
    
    return langTopic;
  });
  
  fs.writeFileSync(
    path.join(__dirname, `../src/content/${lang}.json`),
    JSON.stringify(langContent, null, 2),
    'utf8'
  );
  console.log(`Generated ${lang}.json`);
});

console.log('Done! All language files generated.');
