const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'public', 'images');

// Mapping: clean name -> file that starts with prefix
const mappings = [
  ['ablution_wudu.webp', 'imgi_12_topic_ablution_wudu'],
  ['aqeedah.webp', 'imgi_6_pillar_aqeedah'],
  ['zakat.webp', 'imgi_45_zakat_overview'],
  ['duas.webp', 'imgi_10_pillar_duas'],
  ['eid_fitr.webp', 'imgi_42_eid_fitr_celebration'],
  ['fiqh.webp', 'imgi_7_pillar_fiqh'],
  ['akhlaq.webp', 'imgi_9_pillar_akhlaq'],
  ['hajj_overview.webp', 'imgi_32_hajj_overview'],
  ['shared_values.webp', 'imgi_22_topic_shared_values'],
  ['al_khwarizmi.webp', 'imgi_25_scholar_al_khwarizmi'],
  ['quran_arabic.webp', 'imgi_5_pillar_quran_arabic'],
  ['islamic_civilization.webp', 'imgi_20_topic_islamic_civilization'],
  ['muzdalifah_kids.webp', '5_muzdalifah_kids'],
  ['hero_children.webp', 'imgi_1_hero_diverse_children'],
  ['prayer_salah.webp', 'imgi_11_topic_prayer_salah'],
  ['quran_recitation.webp', 'imgi_2_quran_recitation'],
  ['ramadan_overview.webp', 'imgi_39_ramadan_overview'],
  ['prophet_stories.webp', 'imgi_3_prophet_stories'],
  ['tawaf_kids.webp', '1_tawaf_kids'],
  ['umrah_overview.webp', 'imgi_36_umrah_overview'],
  ['interfaith.webp', 'imgi_23_topic_interfaith'],
  ['respect_elders.webp', 'imgi_17_topic_respect_elders'],
  ['gamification.webp', 'imgi_4_gamification_trophy'],
  ['puberty_boys.webp', 'imgi_14_topic_puberty_boys'],
  ['zamzam_kids.webp', '3_zamzam_kids'],
  // Extra images
  ['islamic_dress.webp', 'imgi_13_topic_islamic_dress'],
  ['puberty_girls.webp', 'imgi_15_topic_puberty_girls'],
  ['halal_haram.webp', 'imgi_16_topic_halal_haram'],
  ['community_respect.webp', 'imgi_18_topic_community_respect'],
  ['prophet_journey.webp', 'imgi_19_topic_prophet_journey'],
  ['abrahamic_religions.webp', 'imgi_21_topic_abrahamic'],
  ['myths_facts.webp', 'imgi_24_topic_myths_facts'],
  ['ibn_sina.webp', 'imgi_26_scholar_ibn_sina'],
  ['al_razi.webp', 'imgi_27_scholar_al_razi'],
  ['al_biruni.webp', 'imgi_28_scholar_al_biruni'],
  ['al_ghazali.webp', 'imgi_29_scholar_al_ghazali'],
  ['fatima_al_fihri.webp', 'imgi_30_scholar_fatima'],
  ['ibn_khaldun.webp', 'imgi_31_scholar_ibn_khaldun'],
  ['hajj_ihram.webp', 'imgi_33_hajj_ihram'],
  ['hajj_tawaf.webp', 'imgi_34_hajj_tawaf'],
  ['hajj_arafat.webp', 'imgi_35_hajj_arafat'],
  ['umrah_vs_hajj.webp', 'imgi_38_umrah_vs_hajj'],
  ['ramadan_fasting.webp', 'imgi_40_ramadan_fasting'],
  ['ramadan_quran.webp', 'imgi_41_ramadan_quran'],
  ['eid_adha.webp', 'imgi_43_eid_adha'],
  ['eid_comparison.webp', 'imgi_44_eid_fitr_vs_adha'],
  ['sadaqah.webp', 'imgi_46_sadaqah'],
  ['waqf.webp', 'imgi_47_waqf'],
  ['orphan_sponsorship.webp', 'imgi_48_orphan'],
  ['helping_poor.webp', 'imgi_49_helping_poor'],
  ['hiba_gifts.webp', 'imgi_50_hiba'],
  ['sai_kids.webp', '2_sai_kids'],
  ['arafat_kids.webp', '4_arafat_kids'],
  ['jamarat_kids.webp', '6_jamarat_kids'],
  ['sacrifice_kids.webp', '7_sacrifice_kids'],
  ['shaving_kids.webp', '8_shaving_kids'],
  ['parent_dashboard.webp', 'imgi_51_parent_dashboard'],
];

const files = fs.readdirSync(imgDir);
let copied = 0;

for (const [cleanName, prefix] of mappings) {
  const target = path.join(imgDir, cleanName);
  if (fs.existsSync(target)) continue; // Already exists

  const source = files.find(f => f.startsWith(prefix));
  if (source) {
    fs.copyFileSync(path.join(imgDir, source), target);
    copied++;
  } else {
    console.log(`WARN: No file found for ${cleanName} (prefix: ${prefix})`);
  }
}

console.log(`Copied ${copied} files with clean names`);
console.log(`Total images now: ${fs.readdirSync(imgDir).length}`);
