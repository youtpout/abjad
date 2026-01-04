/**
 * Script pour générer tous les fichiers audio MP3 de l'alphabet arabe
 * 
 * Usage:
 *   npm install gtts
 *   node generate-audio.js
 */

import gtts from 'gtts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Dossier de sortie
const OUTPUT_DIR = './public/audio';

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Alphabet arabe avec toutes les variations
const sounds = [
  // Lettres isolées
  { id: 'alif', text: 'ا', name: 'Alif' },
  { id: 'ba', text: 'ب', name: 'Ba' },
  { id: 'ta', text: 'ت', name: 'Ta' },
  { id: 'tha', text: 'ث', name: 'Tha' },
  { id: 'jim', text: 'ج', name: 'Jim' },
  { id: 'ha', text: 'ح', name: 'Ha' },
  { id: 'kha', text: 'خ', name: 'Kha' },
  { id: 'dal', text: 'د', name: 'Dal' },
  { id: 'dhal', text: 'ذ', name: 'Dhal' },
  { id: 'ra', text: 'ر', name: 'Ra' },
  { id: 'zay', text: 'ز', name: 'Zay' },
  { id: 'sin', text: 'س', name: 'Sin' },
  { id: 'shin', text: 'ش', name: 'Shin' },
  { id: 'sad', text: 'ص', name: 'Sad' },
  { id: 'dad', text: 'ض', name: 'Dad' },
  { id: 'ta_emph', text: 'ط', name: 'Ta emphatique' },
  { id: 'dha_emph', text: 'ظ', name: 'Dha emphatique' },
  { id: 'ayn', text: 'ع', name: 'Ayn' },
  { id: 'ghayn', text: 'غ', name: 'Ghayn' },
  { id: 'fa', text: 'ف', name: 'Fa' },
  { id: 'qaf', text: 'ق', name: 'Qaf' },
  { id: 'kaf', text: 'ك', name: 'Kaf' },
  { id: 'lam', text: 'ل', name: 'Lam' },
  { id: 'mim', text: 'م', name: 'Mim' },
  { id: 'nun', text: 'ن', name: 'Nun' },
  { id: 'ha_light', text: 'ه', name: 'Ha léger' },
  { id: 'waw', text: 'و', name: 'Waw' },
  { id: 'ya', text: 'ي', name: 'Ya' },

  // Lettres avec Fatha (son "a")
  { id: 'alif_fatha', text: 'أَ', name: 'Alif Fatha' },
  { id: 'ba_fatha', text: 'بَ', name: 'Ba Fatha' },
  { id: 'ta_fatha', text: 'تَ', name: 'Ta Fatha' },
  { id: 'tha_fatha', text: 'ثَ', name: 'Tha Fatha' },
  { id: 'jim_fatha', text: 'جَ', name: 'Jim Fatha' },
  { id: 'ha_fatha', text: 'حَ', name: 'Ha Fatha' },
  { id: 'kha_fatha', text: 'خَ', name: 'Kha Fatha' },
  { id: 'dal_fatha', text: 'دَ', name: 'Dal Fatha' },
  { id: 'dhal_fatha', text: 'ذَ', name: 'Dhal Fatha' },
  { id: 'ra_fatha', text: 'رَ', name: 'Ra Fatha' },
  { id: 'zay_fatha', text: 'زَ', name: 'Zay Fatha' },
  { id: 'sin_fatha', text: 'سَ', name: 'Sin Fatha' },
  { id: 'shin_fatha', text: 'شَ', name: 'Shin Fatha' },
  { id: 'sad_fatha', text: 'صَ', name: 'Sad Fatha' },
  { id: 'dad_fatha', text: 'ضَ', name: 'Dad Fatha' },
  { id: 'ta_emph_fatha', text: 'طَ', name: 'Ta emph Fatha' },
  { id: 'dha_emph_fatha', text: 'ظَ', name: 'Dha emph Fatha' },
  { id: 'ayn_fatha', text: 'عَ', name: 'Ayn Fatha' },
  { id: 'ghayn_fatha', text: 'غَ', name: 'Ghayn Fatha' },
  { id: 'fa_fatha', text: 'فَ', name: 'Fa Fatha' },
  { id: 'qaf_fatha', text: 'قَ', name: 'Qaf Fatha' },
  { id: 'kaf_fatha', text: 'كَ', name: 'Kaf Fatha' },
  { id: 'lam_fatha', text: 'لَ', name: 'Lam Fatha' },
  { id: 'mim_fatha', text: 'مَ', name: 'Mim Fatha' },
  { id: 'nun_fatha', text: 'نَ', name: 'Nun Fatha' },
  { id: 'ha_light_fatha', text: 'هَ', name: 'Ha léger Fatha' },
  { id: 'waw_fatha', text: 'وَ', name: 'Waw Fatha' },
  { id: 'ya_fatha', text: 'يَ', name: 'Ya Fatha' },

  // Lettres avec Kasra (son "i")
  { id: 'alif_kasra', text: 'إِ', name: 'Alif Kasra' },
  { id: 'ba_kasra', text: 'بِ', name: 'Ba Kasra' },
  { id: 'ta_kasra', text: 'تِ', name: 'Ta Kasra' },
  { id: 'tha_kasra', text: 'ثِ', name: 'Tha Kasra' },
  { id: 'jim_kasra', text: 'جِ', name: 'Jim Kasra' },
  { id: 'ha_kasra', text: 'حِ', name: 'Ha Kasra' },
  { id: 'kha_kasra', text: 'خِ', name: 'Kha Kasra' },
  { id: 'dal_kasra', text: 'دِ', name: 'Dal Kasra' },
  { id: 'dhal_kasra', text: 'ذِ', name: 'Dhal Kasra' },
  { id: 'ra_kasra', text: 'رِ', name: 'Ra Kasra' },
  { id: 'zay_kasra', text: 'زِ', name: 'Zay Kasra' },
  { id: 'sin_kasra', text: 'سِ', name: 'Sin Kasra' },
  { id: 'shin_kasra', text: 'شِ', name: 'Shin Kasra' },
  { id: 'sad_kasra', text: 'صِ', name: 'Sad Kasra' },
  { id: 'dad_kasra', text: 'ضِ', name: 'Dad Kasra' },
  { id: 'ta_emph_kasra', text: 'طِ', name: 'Ta emph Kasra' },
  { id: 'dha_emph_kasra', text: 'ظِ', name: 'Dha emph Kasra' },
  { id: 'ayn_kasra', text: 'عِ', name: 'Ayn Kasra' },
  { id: 'ghayn_kasra', text: 'غِ', name: 'Ghayn Kasra' },
  { id: 'fa_kasra', text: 'فِ', name: 'Fa Kasra' },
  { id: 'qaf_kasra', text: 'قِ', name: 'Qaf Kasra' },
  { id: 'kaf_kasra', text: 'كِ', name: 'Kaf Kasra' },
  { id: 'lam_kasra', text: 'لِ', name: 'Lam Kasra' },
  { id: 'mim_kasra', text: 'مِ', name: 'Mim Kasra' },
  { id: 'nun_kasra', text: 'نِ', name: 'Nun Kasra' },
  { id: 'ha_light_kasra', text: 'هِ', name: 'Ha léger Kasra' },
  { id: 'waw_kasra', text: 'وِ', name: 'Waw Kasra' },
  { id: 'ya_kasra', text: 'يِ', name: 'Ya Kasra' },

  // Lettres avec Damma (son "u")
  { id: 'alif_damma', text: 'أُ', name: 'Alif Damma' },
  { id: 'ba_damma', text: 'بُ', name: 'Ba Damma' },
  { id: 'ta_damma', text: 'تُ', name: 'Ta Damma' },
  { id: 'tha_damma', text: 'ثُ', name: 'Tha Damma' },
  { id: 'jim_damma', text: 'جُ', name: 'Jim Damma' },
  { id: 'ha_damma', text: 'حُ', name: 'Ha Damma' },
  { id: 'kha_damma', text: 'خُ', name: 'Kha Damma' },
  { id: 'dal_damma', text: 'دُ', name: 'Dal Damma' },
  { id: 'dhal_damma', text: 'ذُ', name: 'Dhal Damma' },
  { id: 'ra_damma', text: 'رُ', name: 'Ra Damma' },
  { id: 'zay_damma', text: 'زُ', name: 'Zay Damma' },
  { id: 'sin_damma', text: 'سُ', name: 'Sin Damma' },
  { id: 'shin_damma', text: 'شُ', name: 'Shin Damma' },
  { id: 'sad_damma', text: 'صُ', name: 'Sad Damma' },
  { id: 'dad_damma', text: 'ضُ', name: 'Dad Damma' },
  { id: 'ta_emph_damma', text: 'طُ', name: 'Ta emph Damma' },
  { id: 'dha_emph_damma', text: 'ظُ', name: 'Dha emph Damma' },
  { id: 'ayn_damma', text: 'عُ', name: 'Ayn Damma' },
  { id: 'ghayn_damma', text: 'غُ', name: 'Ghayn Damma' },
  { id: 'fa_damma', text: 'فُ', name: 'Fa Damma' },
  { id: 'qaf_damma', text: 'قُ', name: 'Qaf Damma' },
  { id: 'kaf_damma', text: 'كُ', name: 'Kaf Damma' },
  { id: 'lam_damma', text: 'لُ', name: 'Lam Damma' },
  { id: 'mim_damma', text: 'مُ', name: 'Mim Damma' },
  { id: 'nun_damma', text: 'نُ', name: 'Nun Damma' },
  { id: 'ha_light_damma', text: 'هُ', name: 'Ha léger Damma' },
  { id: 'waw_damma', text: 'وُ', name: 'Waw Damma' },
  { id: 'ya_damma', text: 'يُ', name: 'Ya Damma' },

  // Lettres avec Sukun (pas de voyelle)
  { id: 'alif_sukun', text: 'أْ', name: 'Alif Sukun' },
  { id: 'ba_sukun', text: 'بْ', name: 'Ba Sukun' },
  { id: 'ta_sukun', text: 'تْ', name: 'Ta Sukun' },
  { id: 'tha_sukun', text: 'ثْ', name: 'Tha Sukun' },
  { id: 'jim_sukun', text: 'جْ', name: 'Jim Sukun' },
  { id: 'ha_sukun', text: 'حْ', name: 'Ha Sukun' },
  { id: 'kha_sukun', text: 'خْ', name: 'Kha Sukun' },
  { id: 'dal_sukun', text: 'دْ', name: 'Dal Sukun' },
  { id: 'dhal_sukun', text: 'ذْ', name: 'Dhal Sukun' },
  { id: 'ra_sukun', text: 'رْ', name: 'Ra Sukun' },
  { id: 'zay_sukun', text: 'زْ', name: 'Zay Sukun' },
  { id: 'sin_sukun', text: 'سْ', name: 'Sin Sukun' },
  { id: 'shin_sukun', text: 'شْ', name: 'Shin Sukun' },
  { id: 'sad_sukun', text: 'صْ', name: 'Sad Sukun' },
  { id: 'dad_sukun', text: 'ضْ', name: 'Dad Sukun' },
  { id: 'ta_emph_sukun', text: 'طْ', name: 'Ta emph Sukun' },
  { id: 'dha_emph_sukun', text: 'ظْ', name: 'Dha emph Sukun' },
  { id: 'ayn_sukun', text: 'عْ', name: 'Ayn Sukun' },
  { id: 'ghayn_sukun', text: 'غْ', name: 'Ghayn Sukun' },
  { id: 'fa_sukun', text: 'فْ', name: 'Fa Sukun' },
  { id: 'qaf_sukun', text: 'قْ', name: 'Qaf Sukun' },
  { id: 'kaf_sukun', text: 'كْ', name: 'Kaf Sukun' },
  { id: 'lam_sukun', text: 'لْ', name: 'Lam Sukun' },
  { id: 'mim_sukun', text: 'مْ', name: 'Mim Sukun' },
  { id: 'nun_sukun', text: 'نْ', name: 'Nun Sukun' },
  { id: 'ha_light_sukun', text: 'هْ', name: 'Ha léger Sukun' },
  { id: 'waw_sukun', text: 'وْ', name: 'Waw Sukun' },
  { id: 'ya_sukun', text: 'يْ', name: 'Ya Sukun' },

  // Harakat exemples
  { id: 'haraka_fatha', text: 'بَ', name: 'Exemple Fatha' },
  { id: 'haraka_kasra', text: 'بِ', name: 'Exemple Kasra' },
  { id: 'haraka_damma', text: 'بُ', name: 'Exemple Damma' },
  { id: 'haraka_sukun', text: 'بْ', name: 'Exemple Sukun' },
  { id: 'haraka_shadda', text: 'بّ', name: 'Exemple Shadda' },
  { id: 'haraka_tanwin_fath', text: 'بًا', name: 'Exemple Tanwin Fath' },
  { id: 'haraka_tanwin_kasr', text: 'بٍ', name: 'Exemple Tanwin Kasr' },
  { id: 'haraka_tanwin_damm', text: 'بٌ', name: 'Exemple Tanwin Damm' },
];

// Fonction pour générer un fichier audio
function generateAudio(sound, index) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, `${sound.id}.mp3`);

    // Skip si le fichier existe déjà
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  [${index + 1}/${sounds.length}] ${sound.name} - existe déjà`);
      resolve();
      return;
    }

    const tts = new gtts(sound.text, 'ar');

    tts.save(filePath, (err) => {
      if (err) {
        console.error(`❌ [${index + 1}/${sounds.length}] ${sound.name} - Erreur:`, err.message);
        reject(err);
      } else {
        console.log(`✅ [${index + 1}/${sounds.length}] ${sound.name} → ${sound.id}.mp3`);
        resolve();
      }
    });
  });
}

// Générer tous les fichiers avec délai pour éviter le rate limiting
async function generateAll() {
  console.log('🎙️  Génération des fichiers audio arabes...\n');
  console.log(`📁 Dossier de sortie: ${OUTPUT_DIR}`);
  console.log(`📊 Total: ${sounds.length} fichiers à générer\n`);

  for (let i = 0; i < sounds.length; i++) {
    try {
      await generateAudio(sounds[i], i);
      // Délai de 500ms entre chaque requête pour éviter le blocage
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      // Continue avec le suivant en cas d'erreur
    }
  }

  console.log('\n✨ Génération terminée!');
  console.log(`📁 Fichiers créés dans: ${OUTPUT_DIR}`);

  // Générer le fichier de mapping
  generateMapping();
}

// Générer un fichier JSON avec le mapping des sons
function generateMapping() {
  const mapping = {};
  sounds.forEach(s => {
    mapping[s.text] = `/audio/${s.id}.mp3`;
  });

  const mappingPath = path.join(OUTPUT_DIR, 'sounds.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`📄 Mapping généré: ${mappingPath}`);
}

// Lancer la génération
generateAll().catch(console.error);
