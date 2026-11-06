import { EN, ES } from './languages.js';

// Proyecto de Traducila para "cinco noches en la UNRAF".
// Las keys se cargan siempre en español; la API devuelve la traducción al idioma pedido.
const PROJECT_ID = '121b3607-0377-43c5-a11c-701bf150baf7';
const API_URL = 'https://traducila.vercel.app/api/translations';
const LANGUAGE_STORAGE_KEY = 'unraf.language';
const TRANSLATIONS_STORAGE_KEY = 'unraf.translations.en';

let translations = null;
let language = readStoredLanguage();

function readStoredLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === EN ? EN : ES;
  } catch {
    return ES;
  }
}

function readStoredTranslations() {
  try {
    const stored = window.localStorage.getItem(TRANSLATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function getLanguage() {
  return language;
}

export function setLanguage(nextLanguage) {
  language = nextLanguage === EN ? EN : ES;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Si localStorage no está disponible, el idioma sigue funcionando en memoria.
  }
  return language;
}

// Descarga (o reutiliza) las traducciones al inglés de Traducila.
// El español no necesita fetch: las keys del juego ya están en español.
export async function loadTranslations(targetLanguage = language) {
  language = targetLanguage === EN ? EN : ES;
  if (language === ES) return null;
  if (translations) return translations;

  const cached = readStoredTranslations();
  if (cached) {
    translations = cached;
    return translations;
  }

  const response = await fetch(`${API_URL}/${PROJECT_ID}/${EN}`);
  if (!response.ok) {
    throw new Error(`Traducila respondió ${response.status}`);
  }

  const data = await response.json();
  if (data?.error) {
    throw new Error(data.error);
  }

  translations = data;
  try {
    window.localStorage.setItem(TRANSLATIONS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // La traducción también queda disponible en memoria durante la sesión.
  }
  return translations;
}

// Devuelve la frase traducida. En español las keys ya son el texto final.
// `englishFallback` cubre las keys que todavía no están cargadas en Traducila.
export function getPhrase(key, englishFallback = key) {
  if (language === ES) return key;

  if (!translations) {
    translations = readStoredTranslations();
  }

  const words = translations?.data?.words;
  if (Array.isArray(words)) {
    const translation = words.find((item) => item.key === key);
    if (translation?.translate) return translation.translate;
  }

  return englishFallback;
}
