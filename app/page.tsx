// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { 
  Camera, Search, Home, Plus, Activity, CheckCircle2, ChevronLeft, ChevronRight, Scale, User, 
  TrendingDown, TrendingUp, Minus, Crown, Zap, Shield, Check, Barcode, AlertCircle,
  ImagePlus, Lightbulb, X, Mic, Send, CalendarDays, Flame, Droplet, Trash2, History, ChevronDown, Globe, MicOff
} from 'lucide-react';

let app: any = null;
let auth: any = null;
let db: any = null;
let appId: string = 'default-app-id';

try {
  if (typeof window !== 'undefined') {
    const rawConfig = (window as any).__firebase_config;
    const firebaseConfig = typeof rawConfig !== 'undefined' ? JSON.parse(rawConfig) : { apiKey: "AIzaSyDummyKeyForBuild", projectId: "dummy" };
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof (window as any).__app_id !== 'undefined') appId = (window as any).__app_id;
  }
} catch (e) { 
  console.error("Firebase init:", e); 
}

const apiKey = ""; 

const translations: any = {
  ru: {
    dashboard: "Сводка", searchTab: "Поиск", weightTab: "Вес", profileTab: "Профиль", calsLeft: "Осталось калорий", eatenToday: "Съедено за день", from: "из", kcal: "ккал", aiDietitian: "ИИ-диетолог: Что съесть?", proteins: "Белки", fats: "Жиры", carbs: "Углеводы", g: "г", waterConsumed: "Выпито воды", ml: "мл", addFood: "Добавить еду", breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин", snack: "Перекус", recordVoice: "Голосовой ввод", dictatePrompt: "Нажмите на микрофон и скажите, что вы съели, или напишите текст.", dictatePlaceholder: "Напр: 200г куриной грудки и 150г гречки", aiThinking: "Нейросеть анализирует...", aiCreating: "Создаем рецепты...", whereToSave: "Куда записать блюдо?", date: "Дата", cancel: "Отмена", base: "База", myRecipes: "Мои рецепты", searchPlaceholder: "Поиск...", recentAdded: "Недавно добавленные", notFound: "Ничего не найдено", ingredient: "Ингредиент", constructor: "Конструктор", recipeName: "Название блюда", addIngredient: "Добавить ингредиент", saveRecipe: "Сохранить рецепт", kbju100g: "КБЖУ (на 100 грамм)", addToDiary: "Добавить в дневник", weightInfo: "грамм", aiScanner: "AI Сканер еды", takePhoto: "Сделать фото", fromGallery: "Из галереи", recognitionError: "Ошибка распознавания", tryAgain: "Попробовать еще раз", recognized: "Распознанные продукты", weightTitle: "Записать вес (кг)", weightPlaceholder: "Напр. 75.5", add: "Добавить", chart: "График", needMoreData: "Нужен еще один замер", history: "История замеров", start: "Начало", inSystemSince: "Пользователь базы", subsLevels: "Уровни подписки", current: "Текущий", free: "Бесплатно", allFeatures: "Все возможности", hideDetails: "Скрыть подробности", bronzeF1: "Базовый поиск еды", bronzeF2: "скан. штрихкодов", bronzeF3: "ИИ сканер недоступен", silverF1: "Всё, что входит в Bronze", silverF2: "ИИ-фото в день", silverF3: "Безлимитный сканер штрихкодов", goldF1: "Полный доступ ко всем функциям", goldF2: "Безлимитное ИИ-сканирование", goldF3: "Советы ИИ-диетолога", buySilver: "Купить Silver (99 ⭐)", buyGold: "Купить Gold (249 ⭐)", yourTier: "Ваш текущий тариф", proActive: "Активный PRO-доступ", continue: "Продолжить", makingPlan: "Создаем план...", accountSetup: "Настроим NutriBot", activityLabel: "Активность", goalLabel: "Ваша цель", startUsing: "Начать использование", language: "Язык", loadingData: "Загрузка...", reqSub: "Требуется подписка", reqSubDesc: "Эта функция недоступна на вашем текущем тарифе. Перейдите в профиль, чтобы снять ограничения.", toProfile: "В профиль", silverUnlocked: "SILVER РАЗБЛОКИРОВАН", goldUnlocked: "GOLD СТАТУС", male: "Мужской", female: "Женский", age: "Возраст", height: "Рост (см)", weight: "Вес (кг)", listening: "Слушаю... Говорите", tapToSpeak: "Нажмите для голосового ввода",
    activities: { min: "Минимальная", low: "Слабая", med: "Средняя", high: "Высокая", ext: "Экстремальная" }, goals: { lose: "Похудение", keep: "Поддержание веса", gain: "Набор массы" }
  },
  en: {
    dashboard: "Dashboard", searchTab: "Search", weightTab: "Weight", profileTab: "Profile", calsLeft: "Calories left", eatenToday: "Eaten today", from: "of", kcal: "kcal", aiDietitian: "AI Dietitian: What to eat?", proteins: "Protein", fats: "Fats", carbs: "Carbs", g: "g", waterConsumed: "Water consumed", ml: "ml", addFood: "Add food", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", recordVoice: "Voice Input", dictatePrompt: "Tap the mic and speak what you ate, or type below.", dictatePlaceholder: "e.g., 200g chicken breast and 150g rice", aiThinking: "AI is analyzing...", aiCreating: "Creating recipes...", whereToSave: "Where to save this meal?", date: "Date", cancel: "Cancel", base: "Database", myRecipes: "My Recipes", searchPlaceholder: "Search...", recentAdded: "Recently added", notFound: "Nothing found", ingredient: "Ingredient", constructor: "Constructor", recipeName: "Recipe name", addIngredient: "Add ingredient", saveRecipe: "Save recipe", kbju100g: "Macros (per 100g)", addToDiary: "Add to diary", weightInfo: "grams", aiScanner: "AI Food Scanner", takePhoto: "Take a photo", fromGallery: "From gallery", recognitionError: "Recognition error", tryAgain: "Try again", recognized: "Recognized products", weightTitle: "Log weight (kg)", weightPlaceholder: "e.g. 75.5", add: "Add", chart: "Chart", needMoreData: "Need one more log", history: "Weight history", start: "Start", inSystemSince: "Cloud Member", subsLevels: "Subscription Tiers", current: "Current", free: "Free", allFeatures: "All features", hideDetails: "Hide details", bronzeF1: "Basic food search", bronzeF2: "barcode scans", bronzeF3: "AI scanner unavailable", silverF1: "Everything in Bronze", silverF2: "AI photo scans per day", silverF3: "Unlimited barcode scanner", goldF1: "Full access to all features", goldF2: "Unlimited AI food scanning", goldF3: "Smart AI Dietitian tips", buySilver: "Upgrade to Silver (99 ⭐)", buyGold: "Get Gold (249 ⭐)", yourTier: "Your current tier", proActive: "PRO Access Active", continue: "Continue", makingPlan: "Creating plan...", accountSetup: "Setup NutriBot", activityLabel: "Activity", goalLabel: "Your goal", startUsing: "Start using", language: "Language", loadingData: "Loading...", reqSub: "Subscription Required", reqSubDesc: "This feature is not available on your current plan. Upgrade in profile to unlock.", toProfile: "To Profile", silverUnlocked: "SILVER UNLOCKED", goldUnlocked: "GOLD STATUS", male: "Male", female: "Female", age: "Age", height: "Height (cm)", weight: "Weight (kg)", listening: "Listening... Speak now", tapToSpeak: "Tap to record voice",
    activities: { min: "Minimal", low: "Light", med: "Moderate", high: "High", ext: "Extreme" }, goals: { lose: "Weight loss", keep: "Maintain weight", gain: "Muscle gain" }
  }
};

const LanguageContext = createContext<any>(null);

const globalStyles = ".btn-glass { transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s ease, background-color 0.1s ease; cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; transform: translateZ(0); } \n .btn-glass:active { transform: scale(0.96) translateZ(0); opacity: 0.7; } \n @keyframes zapIn { 0% { transform: scale(0.1) skewX(20deg); opacity: 0; filter: brightness(2); } 60% { transform: scale(1.15) skewX(-10deg); opacity: 1; filter: brightness(1.5); } 100% { transform: scale(1) skewX(0); opacity: 1; filter: brightness(1); } } \n @keyframes floatUp { 0% { transform: translateY(150px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } } \n @keyframes particle-explode { 0% { transform: translate(0, 0) scale(0); opacity: 1; } 20% { transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } } \n @keyframes pulseWave { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }";

const langMap: any = { ru: "Русский", en: "English" };

const LightningStorm = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[150]">
    <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 0 L150 300 L250 300 L180 800" stroke="#93c5fd" strokeWidth="12" fill="none" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 20px #93c5fd)' }} />
      <path d="M300 100 L260 400 L340 400 L280 800" stroke="#ffffff" strokeWidth="8" fill="none" className="animate-ping" style={{ filter: 'drop-shadow(0 0 15px #ffffff)' }} />
    </svg>
  </div>
);

const GoldBurstAnimation = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[160] flex flex-col items-center justify-center">
    <div className="absolute w-96 h-96 bg-amber-500/60 blur-[60px] rounded-full animate-pulse"></div>
    <div className="relative z-10 flex flex-col items-center justify-center" style={{ animation: 'floatUp 0.8s ease-out forwards' }}>
      <Crown size={90} className="text-[#fde047] mb-[-12px] z-20" fill="currentColor" style={{ filter: 'drop-shadow(0 0 20px rgba(253,224,71,0.8))' }} />
      <span className="text-[#fde047] font-black text-7xl tracking-widest z-10 relative" style={{ filter: 'drop-shadow(0 0 25px rgba(253,224,71,1))' }}>GOLD</span>
    </div>
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      {[...Array(30)].map((_, i) => {
        const angle = (i * 360) / 30;
        const distance = 120 + Math.random() * 200;
        const tx = `${Math.cos(angle * Math.PI / 180) * distance}px`;
        const ty = `${Math.sin(angle * Math.PI / 180) * distance}px`;
        return (
          <div 
            key={`p-${i}`} 
            className="absolute bg-yellow-200 rounded-full"
            style={{
              width: 5, height: 5,
              left: '50%', top: '50%',
              // @ts-ignore
              '--tx': tx, '--ty': ty,
              animation: `particle-explode 1.2s ease-out infinite`,
              boxShadow: '0 0 15px 3px #fcd34d'
            }}
          />
        );
      })}
    </div>
  </div>
);

async function fetchGeminiWithRetry(prompt: string, schema: any, base64Image: any = null, mimeType: any = null) {
  const parts: any[] = [{ text: prompt }];
  if (base64Image) { parts.push({ inlineData: { mimeType: mimeType, data: base64Image } }); }
  const payload = { contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } };

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('HTTP error');
    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

async function analyzeImageWithGemini(file: File, isBarcode: boolean, lang: string) {
  const base64Image = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500;
        let width = img.width, height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6).split(',')[1]);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

  const schema = isBarcode 
    ? { type: "OBJECT", properties: { name: { type: "STRING" }, calories_100g: { type: "INTEGER" }, protein_100g: { type: "NUMBER" }, fats_100g: { type: "NUMBER" }, carbs_100g: { type: "NUMBER" } }, required: ["name", "calories_100g", "protein_100g", "fats_100g", "carbs_100g"] } 
    : { type: "OBJECT", properties: { dish_name: { type: "STRING" }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["calories", "protein", "fat", "carbs"] } }, required: ["dish_name", "total"] };
  const prompt = isBarcode ? `Analyze barcode. Return macros per 100g. Language: ${langMap[lang]}` : `Analyze food photo. Return dish name, and total estimated macros for portion. Language: ${langMap[lang]}`;
  return await fetchGeminiWithRetry(prompt, schema, base64Image, 'image/jpeg');
}

async function getAIAdviceForRemaining(remaining: any, lang: string) {
  const schema = { type: "OBJECT", properties: { suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["title", "description", "calories", "protein", "fat", "carbs"] } } }, required: ["suggestions"] };
  return await fetchGeminiWithRetry(`User has left: Cals: ${remaining.calories}, P: ${remaining.protein}g, F: ${remaining.fat}g, C: ${remaining.carbs}g. Suggest 3 meals. Language: ${langMap[lang]}`, schema);
}

async function analyzeTextToFood(text: string, lang: string) {
  const schema = { type: "OBJECT", properties: { dish_name: { type: "STRING" }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["calories", "protein", "fat", "carbs"] } }, required: ["dish_name", "total"] };
  return await fetchGeminiWithRetry(`Text: "${text}". Convert to single dish or meal summary, estimate total weight and macros. Language: ${langMap[lang]}`, schema);
}

const calculateLocalMacros = (profile: any, weight: any) => {
  const w = parseFloat(weight) || 70, h = parseFloat(profile.height) || 170, a = parseInt(profile.age) || 30;
  const multipliers: any = { min: 1.2, low: 1.375, med: 1.55, high: 1.725, ext: 1.9 };
  let tdee = ((10 * w) + (6.25 * h) - (5 * a) + (profile.gender === 'Мужской' || profile.gender === 'Male' ? 5 : -161)) * (multipliers[profile.activity] || 1.375);
  if (profile.goal === 'lose') tdee -= 500; if (profile.goal === 'gain') tdee += 500;
  const cals = Math.round(tdee), prot = Math.round(w * (profile.goal === 'gain' ? 2.0 : 1.8)), fat = Math.round(w * 1);
  return { calories: cals, protein: prot, fat: fat, carbs: Math.max(Math.round((cals - (prot * 4) - (fat * 9)) / 4), 0) };
};

const MOCK_CATALOG = [
  { id: 1, name: "Куриное филе грудки отварное", calories_100g: 137, protein_100g: 29.8, fats_100g: 1.8, carbs_100g: 0.0 },
  { id: 2, name: "Гречка отварная", calories_100g: 100, protein_100g: 4.0, fats_100g: 1.0, carbs_100g: 20.0 },
  { id: 3, name: "Рис Басмати отварной", calories_100g: 116, protein_100g: 2.2, fats_100g: 0.5, carbs_100g: 24.9 },
  { id: 4, name: "Овсяные хлопья Геркулес", calories_100g: 360, protein_100g: 12.0, fats_100g: 6.0, carbs_100g: 62.0 },
  { id: 5, name: "Творог 5%", calories_100g: 121, protein_100g: 17.2, fats_100g: 5.0, carbs_100g: 1.8 },
  { id: 6, name: "Яйцо куриное (1 шт = ~50г)", calories_100g: 157, protein_100g: 12.7, fats_100g: 11.5, carbs_100g: 0.7 },
  { id: 7, name: "Банан", calories_100g: 89, protein_100g: 1.5, fats_100g: 0.1, carbs_100g: 21.8 },
  { id: 8, name: "Авокадо", calories_100g: 160, protein_100g: 2.0, fats_100g: 14.7, carbs_100g: 8.5 },
  { id: 9, name: "Лосось (семга запеченная)", calories_100g: 153, protein_100g: 20.0, fats_100g: 8.1, carbs_100g: 0.0 },
  { id: 10, name: "Протеин сывороточный (WPC 80)", calories_100g: 400, protein_100g: 80.0, fats_100g: 5.0, carbs_100g: 8.0 }
];

export default function Page() {
  const [lang, setLang] = useState('ru');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] || translations['en'] }}>
      <MainApp />
    </LanguageContext.Provider>
  );
}

function MainApp() {
  const { t } = useContext(LanguageContext);
  
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dailyGoals, setDailyGoals] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [meals, setMeals] = useState<any[]>([]);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [waterLogs, setWaterLogs] = useState<any>({});
  const [customFoods, setCustomFoods] = useState<any[]>([]);
  const [recentFoods, setRecentFoods] = useState<any[]>([]);
  const [pendingMeal, setPendingMeal] = useState<any>(null);
  
  const [streakDays, setStreakDays] = useState(0);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [subscription, setSubscription] = useState('bronze'); 
  const [scansToday, setScansToday] = useState(0); 
  const [barcodeScansToday, setBarcodeScansToday] = useState(0); 
  const [upgradePrompt, setUpgradePrompt] = useState({ show: false, required: '' });

  useEffect(() => {
    if (!auth) { 
      const mockUid = 'offline-user-' + Math.random().toString(36).substring(7);
      setUser({ uid: mockUid });
      setAuthLoading(false); 
      setDataLoading(false); 
      return; 
    }
    const initAuth = async () => {
      try {
        const rawToken = (window as any).__initial_auth_token;
        if (typeof rawToken !== 'undefined' && rawToken) { 
          await signInWithCustomToken(auth, rawToken); 
        } else { 
          await signInAnonymously(auth); 
        }
      } catch (e) { 
        setUser({ uid: 'offline-user-' + Math.random().toString(36).substring(7) });
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!user || !db || user.uid.startsWith('offline')) { 
      setDataLoading(false); 
      return; 
    }
    let isSubscribed = true;
    const uid = user.uid;

    const unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'profile'), (docSnap) => {
      if (!isSubscribed) return;
      if(docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data.formData); setDailyGoals(data.goals); setIsFirstLaunch(false);
      } else { setIsFirstLaunch(true); }
      setDataLoading(false);
    });

    const unsubMeals = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'meals'), (snap) => {
      if (!isSubscribed) return;
      const items: any[] = []; snap.forEach(d => items.push(d.data())); setMeals(items);
    });

    const unsubWeight = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'weights'), (snap) => {
      if (!isSubscribed) return;
      const items: any[] = []; snap.forEach(d => items.push(d.data())); setWeightHistory(items.sort((a,b) => b.id - a.id));
    });

    const unsubWater = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'water'), (docSnap) => {
      if (!isSubscribed) return;
      if(docSnap.exists()) setWaterLogs(docSnap.data().logs || {});
    });

    const unsubCustomFoods = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'customFoods'), (snap) => {
      if (!isSubscribed) return;
      const items: any[] = []; snap.forEach(d => items.push(d.data())); setCustomFoods(items);
    });

    const unsubStats = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'stats'), (docSnap) => {
      if (!isSubscribed) return;
      if(docSnap.exists()) {
        const data = docSnap.data();
        setSubscription(data.subscription || 'bronze'); 
        setStreakDays(data.streakDays || 0);
        if(data.lastScanDate === new Date().toDateString()) {
          setScansToday(data.scansToday || 0); setBarcodeScansToday(data.barcodeScansToday || 0);
        } else { setScansToday(0); setBarcodeScansToday(0); }
      }
    });

    return () => { isSubscribed = false; unsubProfile(); unsubMeals(); unsubWeight(); unsubWater(); unsubStats(); unsubCustomFoods(); };
  }, [user]);

  const formattedSelectedDate = useMemo(() => { const d = new Date(selectedDate); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }, [selectedDate]);
  const todayFormatted = useMemo(() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }, []);
  const currentDayMeals = useMemo(() => meals.filter(m => m.date === formattedSelectedDate), [meals, formattedSelectedDate]);
  const hasMealsToday = useMemo(() => meals.some(m => m.date === todayFormatted), [meals, todayFormatted]);

  const current = useMemo(() => currentDayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.total?.calories || 0), protein: acc.protein + (meal.total?.protein || 0),
      fat: acc.fat + (meal.total?.fat || 0), carbs: acc.carbs + (meal.total?.carbs || 0),
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 }
  ), [currentDayMeals]);

  const handleOnboardingComplete = useCallback(async (goals: any, formData: any) => {
    setUserProfile(formData); setDailyGoals(goals); setIsFirstLaunch(false);
    const d = new Date(); const today = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    const wData = { id: Date.now(), date: today, weight: parseFloat(String(formData.weight).replace(',', '.')) };
    setWeightHistory([wData]);
    if(user && db && !user.uid.startsWith('offline')) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { formData, goals });
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', wData.id.toString()), wData);
    }
  }, [user]);

  const checkAccess = useCallback((requiredTier: string) => {
    const tiers: any = { bronze: 0, silver: 1, gold: 2 };
    if (tiers[subscription] >= tiers[requiredTier]) return true;
    setUpgradePrompt({ show: true, required: requiredTier }); return false;
  }, [subscription]);

  const requestAddMeal = useCallback((mealData: any) => setPendingMeal(mealData), []);

  const confirmAddMeal = useCallback(async (type: string) => {
    if(pendingMeal) {
      const willIgniteStreak = formattedSelectedDate === todayFormatted && !hasMealsToday;
      const d = new Date(); const safeTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
      const newMeal = { ...pendingMeal, type, date: formattedSelectedDate, id: Date.now() + Math.random(), time: safeTime };
      setMeals(prev => [...prev, newMeal]); setPendingMeal(null); setActiveTab('dashboard');
      
      if (willIgniteStreak) { 
        const newStreak = streakDays + 1; 
        setStreakDays(newStreak);
        if ([5, 10, 30, 60, 100, 200].includes(newStreak)) {
          setShowStreakPopup(true); 
          setTimeout(() => setShowStreakPopup(false), 4500); 
        }
        if(user && db && !user.uid.startsWith('offline')) {
          setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), { streakDays: newStreak }, {merge:true});
        }
      }
      if(user && db && !user.uid.startsWith('offline')) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', newMeal.id.toString()), newMeal);
      }
    }
  }, [pendingMeal, formattedSelectedDate, todayFormatted, hasMealsToday, user, streakDays]);

  const deleteMeal = useCallback(async (id: any) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    if(user && db && !user.uid.startsWith('offline')) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', id.toString()));
    }
  }, [user]);

  const addWeight = useCallback(async (weightStr: any) => {
    const weight = parseFloat(String(weightStr).replace(',', '.'));
    if(isNaN(weight)) return;
    const d = new Date(); const today = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    const wData = { id: Date.now(), date: today, weight };
    setWeightHistory(prev => [wData, ...prev]);
    if(user && db && !user.uid.startsWith('offline')) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', wData.id.toString()), wData);
    }
    if (userProfile) {
      const newGoals = calculateLocalMacros(userProfile, weight);
      setDailyGoals(newGoals);
      if(user && db && !user.uid.startsWith('offline')) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { formData: userProfile, goals: newGoals }, {merge:true});
      }
    }
  }, [userProfile, user]);

  const currentWater = waterLogs[formattedSelectedDate] || 0;
  const handleAddWater = useCallback(async (amount: number) => {
    const newAmount = Math.max((waterLogs[formattedSelectedDate] || 0) + amount, 0);
    const newLogs = { ...waterLogs, [formattedSelectedDate]: newAmount };
    setWaterLogs(newLogs);
    if(user && db && !user.uid.startsWith('offline')) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'water'), { logs: newLogs });
    }
  }, [formattedSelectedDate, waterLogs, user]);

  const saveCustomRecipeToDB = useCallback(async (recipeItem: any) => {
    setCustomFoods(prev => [recipeItem, ...prev]);
    if(user && db && !user.uid.startsWith('offline')) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customFoods', recipeItem.id.toString()), recipeItem);
    }
  }, [user]);

  const updateSubscription = useCallback(async (level: string) => {
    setSubscription(level);
    if(user && db && !user.uid.startsWith('offline')) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), { subscription: level }, {merge:true});
    }
  }, [user]);

  if (authLoading || dataLoading) return (<div className="flex flex-col h-screen bg-slate-900 text-slate-100 items-center justify-center"><Activity className="text-emerald-500 animate-spin mb-4" size={40}/><p className="text-slate-400 font-medium">{t?.loadingData}</p></div>);
  if (isFirstLaunch || !dailyGoals) return <OnboardingScreen onComplete={handleOnboardingComplete} />;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      <header className="px-4 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2"><Activity className="text-emerald-400" size={24} /><h1 className="text-lg font-bold">NutriBot</h1></div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${hasMealsToday ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
            <Flame size={16} className={hasMealsToday ? 'fill-orange-400 animate-pulse' : ''} />
            <span className="font-bold text-sm">{streakDays}</span>
          </div>
          <div onClick={() => setActiveTab('profile')} className={`btn-glass text-sm border px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md ${subscription === 'gold' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : subscription === 'silver' ? 'bg-slate-400/10 border-slate-400/30 text-slate-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
            {subscription === 'gold' ? <Crown size={14} /> : subscription === 'silver' ? <Zap size={14} /> : <Shield size={14} />}
            <span className="font-bold tracking-wide">{subscription.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 relative">
        {activeTab === 'dashboard' && <Dashboard current={current} goals={dailyGoals} meals={currentDayMeals} onAddClick={() => setActiveTab('search')} selectedDate={selectedDate} setSelectedDate={setSelectedDate} currentWater={currentWater} addWater={handleAddWater} deleteMeal={deleteMeal} checkAccess={checkAccess} />}
        {activeTab === 'search' && <FoodSearch customFoods={customFoods} saveCustomRecipeToDB={saveCustomRecipeToDB} recentFoods={recentFoods} setRecentFoods={setRecentFoods} onSave={requestAddMeal} checkAccess={checkAccess} subscription={subscription} barcodeScansToday={barcodeScansToday} />}
        {activeTab === 'weight' && <WeightTracker history={weightHistory} onAdd={addWeight} />}
        {activeTab === 'profile' && <UserProfile currentSub={subscription} setSubscription={updateSubscription} userId={user?.uid} />}
      </main>

      <nav className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-white/5 pb-safe pt-2 z-20">
        <div className="flex justify-between items-end px-2 pb-2">
          <div className="flex w-2/5 justify-around">
            <NavButton icon={<Home />} label={t.dashboard} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavButton icon={<Search />} label={t.searchTab} isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          </div>
          <div className="w-1/5 flex justify-center relative">
            <div onClick={() => setActiveTab('search')} className="btn-glass absolute bottom-4 bg-emerald-500 text-slate-900 p-4 rounded-full shadow-[0_5px_20px_rgba(16,185,129,0.5)] flex items-center justify-center z-30">
              <Camera size={28} />
            </div>
          </div>
          <div className="flex w-2/5 justify-around">
            <NavButton icon={<Scale />} label={t.weightTab} isActive={activeTab === 'weight'} onClick={() => setActiveTab('weight')} />
            <NavButton icon={<User />} label={t.profileTab} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </div>
      </nav>

      {upgradePrompt.show && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-slate-800/95 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-500/20">
              <Crown size={40} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.reqSub} {upgradePrompt.required.toUpperCase()}</h3>
            <p className="text-slate-300 text-sm mb-6">{t.reqSubDesc}</p>
            <div className="flex gap-3">
              <div onClick={() => setUpgradePrompt({ show: false, required: '' })} className="btn-glass flex-1 py-3 rounded-xl bg-slate-700/50 text-white font-medium text-center">{t.cancel}</div>
              <div onClick={() => { setUpgradePrompt({ show: false, required: '' }); setActiveTab('profile'); }} className="btn-glass flex-1 py-3 rounded-xl bg-emerald-500 text-slate-900 font-bold text-center">{t.toProfile}</div>
            </div>
          </div>
        </div>
      )}

      {pendingMeal && (
        <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-slate-800/95 w-full rounded-3xl p-6 shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2 text-center">{t.whereToSave}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div onClick={() => confirmAddMeal('breakfast')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl">🌅</span> {t.breakfast}</div>
              <div onClick={() => confirmAddMeal('lunch')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl">☀️</span> {t.lunch}</div>
              <div onClick={() => confirmAddMeal('dinner')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl">🌙</span> {t.dinner}</div>
              <div onClick={() => confirmAddMeal('snack')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl">🍎</span> {t.snack}</div>
            </div>
            <div onClick={() => setPendingMeal(null)} className="btn-glass w-full mt-2 py-4 text-slate-400 font-medium bg-slate-800 rounded-xl text-center">{t.cancel}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = React.memo(({ icon, label, isActive, onClick }: any) => (
  <div onClick={onClick} className={`btn-glass flex flex-col items-center gap-1 w-14 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}<span className="text-[10px] font-semibold">{label}</span>
  </div>
));

const MacroCard = React.memo(({ label, current, goal, color, g }: any) => {
  const percent = Math.min(Math.round((current / goal) * 100), 100) || 0;
  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col shadow-lg">
      <span className="text-xs text-slate-400 mb-1">{label}</span>
      <span className="font-bold text-sm mb-2 text-white">{Math.round(current)} / {goal}{g}</span>
      <div className="h-1.5 w-full bg-slate-700/50 rounded-full mt-auto overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
});

const Dashboard = React.memo(({ current, goals, meals, onAddClick, selectedDate, setSelectedDate, currentWater, addWater, deleteMeal, checkAccess }: any) => {
  const { t, lang } = useContext(LanguageContext);
  const [adviceData, setAdviceData] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);

  const WATER_GOAL = 2000;
  const getPercent = (val: number, max: number) => Math.min(Math.round((val / max) * 100), 100);
  const remaining = { 
    calories: Math.max((goals?.calories || 2000) - current.calories, 0), 
    protein: Math.max(Math.round((goals?.protein || 150) - current.protein), 0), 
    fat: Math.max(Math.round((goals?.fat || 70) - current.fat), 0), 
    carbs: Math.max(Math.round((goals?.carbs || 200) - current.carbs), 0) 
  };

  const handleAskAI = async () => {
    if (!checkAccess('gold')) return;
    setShowAdviceModal(true); setLoadingAdvice(true);
    try { 
      const advice = await getAIAdviceForRemaining(remaining, lang);
      setAdviceData(advice.suggestions); 
    } catch { 
      setAdviceData([{ title: "Идеи перекуса", description: "Творог 5% с ягодами или омлет с овощами.", calories: 250, protein: 25, fat: 5, carbs: 15 }]); 
    }
    setLoadingAdvice(false);
  };

  const mealTypes = [{ id: 'breakfast', label: t.breakfast, icon: '🌅' }, { id: 'lunch', label: t.lunch, icon: '☀️' }, { id: 'dinner', label: t.dinner, icon: '🌙' }, { id: 'snack', label: t.snack, icon: '🍎' }];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/5">
        <div onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d);}} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-xl"><ChevronLeft size={24} /></div>
        <div className="flex items-center gap-2 font-bold text-white text-lg"><CalendarDays size={20} className="text-emerald-400" />{selectedDate.toLocaleDateString()}</div>
        <div onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d);}} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-xl"><ChevronRight size={24} /></div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-slate-400 text-sm font-medium">{t.calsLeft}</h2>
          <div className="text-right"><span className="text-[10px] text-slate-500 uppercase font-bold">{t.eatenToday}</span><div className="text-sm font-bold text-emerald-400">{current.calories} <span className="text-slate-500 text-xs">{t.kcal}</span></div></div>
        </div>
        <div className="flex items-end gap-2 mb-4 mt-[-10px]"><span className="text-4xl font-bold text-white">{remaining.calories}</span><span className="text-slate-400 text-sm mb-1">{t.from} {goals?.calories || 2000}</span></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-5"><div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${getPercent(current.calories, goals?.calories || 2000)}%` }} /></div>
        <div onClick={handleAskAI} className="btn-glass w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2"><Lightbulb size={20} className="text-amber-400" /> {t.aiDietitian}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MacroCard label={t.proteins} current={current.protein} goal={goals?.protein || 150} color="from-blue-500 to-blue-400" g={t.g} />
        <MacroCard label={t.fats} current={current.fat} goal={goals?.fat || 70} color="from-amber-500 to-amber-400" g={t.g}/>
        <MacroCard label={t.carbs} current={current.carbs} goal={goals?.carbs || 200} color="from-purple-500 to-purple-400" g={t.g}/>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-3"><h2 className="text-slate-200 font-bold flex items-center gap-2"><Droplet className="text-blue-400" size={20} /> {t.waterConsumed}</h2><span className="text-sm font-bold text-blue-400">{currentWater} / {WATER_GOAL} {t.ml}</span></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${getPercent(currentWater, WATER_GOAL)}%` }} /></div>
        <div className="flex gap-3">
          <div onClick={() => addWater(250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥛 +250 {t.ml}</div>
          <div onClick={() => addWater(-250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥤 -250 {t.ml}</div>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        {mealTypes.map(type => {
          const typeMeals = meals.filter((m: any) => m.type === type.id);
          const typeCals = typeMeals.reduce((acc: number, m: any) => acc + (m.total?.calories || 0), 0);
          return (
            <div key={type.id}>
              <div className="flex justify-between items-center mb-2 px-1"><h4 className="font-bold text-slate-200 flex items-center gap-2"><span>{type.icon}</span> {type.label}</h4><span className="text-sm font-semibold text-emerald-400">{Math.round(typeCals)} {t.kcal}</span></div>
              {typeMeals.length === 0 ? (
                <div onClick={onAddClick} className="btn-glass w-full bg-slate-800/30 border border-slate-700/50 border-dashed rounded-xl p-3 flex justify-center items-center text-sm text-slate-500"><Plus size={16} className="mr-1"/> {t.addFood}</div>
              ) : (
                <div className="space-y-2">
                  {typeMeals.map((meal: any) => (
                    <div key={meal.id} className="bg-slate-800/80 backdrop-blur-md p-3 rounded-xl flex justify-between items-center border border-white/5">
                      <div><h4 className="font-medium text-slate-100">{meal.dish_name}</h4><div className="text-xs text-slate-400">Б: {Math.round(meal.total?.protein || 0)} | Ж: {Math.round(meal.total?.fat || 0)} | У: {Math.round(meal.total?.carbs || 0)}</div></div>
                      <div className="flex items-center gap-3"><div className="font-bold text-emerald-400">{Math.round(meal.total?.calories || 0)}</div><div onClick={() => deleteMeal(meal.id)} className="btn-glass text-slate-500 hover:text-red-400"><Trash2 size={18} /></div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

const FoodSearch = React.memo(({ customFoods, saveCustomRecipeToDB, recentFoods, setRecentFoods, onSave, checkAccess, subscription }: any) => {
  const { t } = useContext(LanguageContext);
  const [query, setQuery] = useState('');
  const [weight, setWeight] = useState(100);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const displayList = useMemo(() => {
    if (!query.trim()) return MOCK_CATALOG;
    return MOCK_CATALOG.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleSaveToDiary = () => {
    if(!selectedItem) return;
    const factor = (Number(weight) || 0) / 100;
    const finalItem = { 
      dish_name: selectedItem.name, 
      total: { 
        calories: Math.round(selectedItem.calories_100g * factor), 
        protein: parseFloat((selectedItem.protein_100g * factor).toFixed(1)), 
        fat: parseFloat((selectedItem.fats_100g * factor).toFixed(1)), 
        carbs: parseFloat((selectedItem.carbs_100g * factor).toFixed(1)) 
      } 
    };
    onSave(finalItem);
    setSelectedItem(null); 
    setQuery('');
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {!selectedItem ? (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder={t.searchPlaceholder} value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-slate-800/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none"/>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pb-16">
            {displayList.map((item) => (
              <div key={item.id} onClick={() => { setSelectedItem(item); setWeight(100); }} className="btn-glass bg-slate-800/80 p-4 rounded-xl flex justify-between items-center border border-white/5">
                <div><h4 className="font-medium text-slate-100">{item.name}</h4><div className="text-xs text-slate-400">Б: {item.protein_100g} | Ж: {item.fats_100g} | У: {item.carbs_100g}</div></div>
                <div className="font-bold text-emerald-400">{item.calories_100g} ккал</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-6"><div onClick={() => setSelectedItem(null)} className="btn-glass p-1 text-slate-400 bg-slate-700/50 rounded-full"><ChevronLeft size={24} /></div><h3 className="font-bold text-lg text-white">{selectedItem.name}</h3></div>
          <div className="flex items-center justify-center gap-4 mb-8"><input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-center text-3xl font-bold w-32 outline-none text-white" /><span className="text-xl text-slate-400">{t.weightInfo}</span></div>
          <div onClick={handleSaveToDiary} className="btn-glass w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl text-lg text-center shadow-[0_5px_20px_rgba(16,185,129,0.4)]">{t.addToDiary}</div>
        </div>
      )}
    </div>
  );
});

const WeightTracker = React.memo(({ history, onAdd }: any) => {
  const { t } = useContext(LanguageContext);
  const [inputWeight, setInputWeight] = useState('');
  const handleSubmit = (e: any) => { 
    e.preventDefault(); 
    const val = parseFloat(String(inputWeight).replace(',', '.')); 
    if (!isNaN(val) && val > 0) { onAdd(val); setInputWeight(''); } 
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h2 className="text-slate-200 font-semibold mb-4 flex items-center gap-2"><Scale size={20} className="text-emerald-400" /> {t.weightTitle}</h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input type="text" inputMode="decimal" value={inputWeight} onChange={e => setInputWeight(e.target.value)} placeholder={t.weightPlaceholder} className="flex-1 bg-slate-900/80 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-center"/>
          <button type="submit" className="btn-glass bg-emerald-500 text-slate-900 font-bold px-6 py-3 rounded-xl">{t.add}</button>
        </form>
      </div>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">{t.history}</h3>
        <div className="space-y-2">
          {history.map((record: any) => (
            <div key={record.id} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
              <span className="text-slate-300">{record.date}</span>
              <span className="text-lg font-bold text-white">{record.weight} кг</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const UserProfile = React.memo(({ currentSub, setSubscription, userId }: any) => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const [purchaseStatus, setPurchaseStatus] = useState('idle');
  const [purchasingTier, setPurchasingTier] = useState<string | null>(null);

  const handlePurchase = async (level: string) => {
    setPurchasingTier(level);
    setPurchaseStatus('loading');

    const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;

    try {
      const res = await fetch('/api/stars/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: level, userId: userId || 'user' }),
      });

      const data = await res.json();
      if (!res.ok || !data.invoiceLink) {
        throw new Error(data.error || 'Ошибка формирования счёта');
      }

      if (tg && typeof tg.openInvoice === 'function') {
        tg.openInvoice(data.invoiceLink, (status: string) => {
          if (status === 'paid') {
            setPurchaseStatus('confetti');
            setTimeout(() => {
              setPurchaseStatus('success');
              setSubscription(level);
              setTimeout(() => {
                setPurchaseStatus('idle');
                setPurchasingTier(null);
              }, 3500);
            }, 400);
          } else {
            setPurchaseStatus('idle');
            setPurchasingTier(null);
          }
        });
      } else {
        window.open(data.invoiceLink, '_blank');
        setPurchaseStatus('idle');
        setPurchasingTier(null);
      }
    } catch (err: any) {
      console.error('Ошибка оплаты:', err);
      alert(err.message || 'Не удалось сформировать платёж Звёздами');
      setPurchaseStatus('idle');
      setPurchasingTier(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex justify-between items-center border border-white/5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-emerald-500"><User size={32} className="text-slate-400" /></div>
          <div><h2 className="text-xl font-bold text-white">@telegram_user</h2><p className="text-slate-400 text-sm">{t.inSystemSince}</p></div>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-lg">
        <div className="flex items-center gap-2 text-white font-medium"><Globe size={20} className="text-blue-400"/> {t.language}</div>
        <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none font-medium">
          <option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option>
        </select>
      </div>

      <h3 className="font-bold text-lg px-1 mt-8 mb-4">{t.subsLevels}</h3>
      <div className="space-y-4">
        {/* Bronze */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-lg text-[#cd7f32] flex items-center gap-2"><Shield size={20} /> Bronze</h4>
            <span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">{currentSub === 'bronze' ? t.current : t.free}</span>
          </div>
          <p className="text-xs text-slate-400">Базовый поиск еды, учет воды и веса.</p>
        </div>

        {/* Silver */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-lg text-slate-300 flex items-center gap-2"><Zap size={20} /> Silver</h4>
            <span className="text-sm font-bold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">99 ⭐ / мес</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">AI-сканирование блюд (до 10/день) и безлимитный штрихкод-сканер.</p>
          {currentSub !== 'silver' && currentSub !== 'gold' ? (
            <div onClick={() => handlePurchase('silver')} className="btn-glass w-full bg-slate-700 text-white font-medium py-3 rounded-xl text-center">{t.buySilver}</div>
          ) : (
            currentSub === 'silver' && <div className="w-full text-center text-slate-400 font-bold py-3 bg-slate-800 rounded-xl">{t.yourTier}</div>
          )}
        </div>

        {/* Gold */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 shadow-xl shadow-amber-500/10">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-lg text-amber-400 flex items-center gap-2"><Crown size={20} /> Gold VIP</h4>
            <span className="text-sm font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg">249 ⭐ / мес</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Полный безлимит на ИИ, персональный ИИ-диетолог и максимальная скорость.</p>
          {currentSub !== 'gold' ? (
            <div onClick={() => handlePurchase('gold')} className="btn-glass w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold py-4 rounded-xl text-center">{t.buyGold}</div>
          ) : (
            <div className="w-full text-center text-amber-400 font-bold py-4 bg-amber-500/10 rounded-xl border border-amber-500/30">{t.proActive}</div>
          )}
        </div>
      </div>

      {(purchaseStatus === 'confetti' || purchaseStatus === 'success') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          {purchasingTier === 'silver' ? (
            <div className="flex flex-col items-center justify-center">
              <LightningStorm />
              <h2 className="text-3xl font-black text-blue-300">{t.silverUnlocked}</h2>
            </div>
          ) : (
            <GoldBurstAnimation />
          )}
        </div>
      )}

      {purchaseStatus === 'loading' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});

const OnboardingScreen = React.memo(({ onComplete }: any) => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({ gender: 'Мужской', age: '', height: '', weight: '', goal: 'lose', activity: 'med' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleCalculate = () => {
    if (!formData.age || !formData.height || !formData.weight) { setErrorMsg("Заполните все поля!"); return; }
    setErrorMsg('');
    onComplete(calculateLocalMacros(formData, formData.weight), formData);
  };

  const genderOptions = [{ id: 'Мужской', label: t.male }, { id: 'Женский', label: t.female }];
  const activityOptions = [{ id: 'min', label: t.activities.min }, { id: 'low', label: t.activities.low }, { id: 'med', label: t.activities.med }, { id: 'high', label: t.activities.high }, { id: 'ext', label: t.activities.ext }];
  const goalOptions = [{ id: 'lose', label: t.goals.lose }, { id: 'keep', label: t.goals.keep }, { id: 'gain', label: t.goals.gain }];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans max-w-md mx-auto p-4 relative overflow-y-auto pb-10">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-6 text-center"><Activity className="text-emerald-400 mx-auto mb-2" size={40} /><h1 className="text-3xl font-black text-white mb-1">NutriBot</h1><p className="text-slate-400 text-sm">Умный трекер КБЖУ</p></div>
        {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-4 text-center">{errorMsg}</div>}
        <div className="space-y-4">
          <div className="bg-slate-800 p-1 rounded-xl flex gap-1">{genderOptions.map(g => (<div key={g.id} onClick={() => setFormData({...formData, gender: g.id})} className={`btn-glass flex-1 py-3 text-sm font-bold rounded-lg text-center ${formData.gender === g.id ? 'bg-emerald-500 text-slate-900' : 'text-slate-400'}`}>{g.label}</div>))}</div>
          <div className="flex gap-4">
            <div className="flex-1"><label className="text-xs text-slate-400 block mb-1">{t.age}</label><input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="25" className="w-full bg-slate-800/80 rounded-xl px-4 py-3 text-white outline-none"/></div>
            <div className="flex-1"><label className="text-xs text-slate-400 block mb-1">{t.height}</label><input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="175" className="w-full bg-slate-800/80 rounded-xl px-4 py-3 text-white outline-none"/></div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1"><label className="text-xs text-slate-400 block mb-1">{t.weight}</label><input type="number" inputMode="decimal" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="70" className="w-full bg-slate-800/80 rounded-xl px-4 py-3 text-white outline-none"/></div>
            <div className="flex-1"><label className="text-xs text-slate-400 block mb-1">{t.activityLabel}</label><select value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} className="w-full bg-slate-800/80 rounded-xl px-2 py-3 text-white outline-none text-sm">{activityOptions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}</select></div>
          </div>
          <div><label className="text-xs text-slate-400 block mb-1">{t.goalLabel}</label><div className="flex flex-col gap-2">{goalOptions.map(g => (<div key={g.id} onClick={() => setFormData({...formData, goal: g.id})} className={`btn-glass text-left px-4 py-3 text-sm font-bold rounded-xl border flex justify-between items-center ${formData.goal === g.id ? 'bg-slate-800 border-emerald-500 text-emerald-400' : 'bg-slate-700/50 border-slate-700/50 text-slate-300'}`}>{g.label}{formData.goal === g.id && <CheckCircle2 size={18} />}</div>))}</div></div>
        </div>
        <div onClick={handleCalculate} className="btn-glass mt-8 w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl text-lg text-center">{t.startUsing}</div>
      </div>
    </div>
  );
});
