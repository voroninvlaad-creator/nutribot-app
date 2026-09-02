// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { 
  Camera, Search, Home, Plus, Activity, CheckCircle2, ChevronLeft, ChevronRight, Scale, User, 
  TrendingDown, TrendingUp, Minus, Crown, Zap, Shield, Check, Barcode, AlertCircle,
  ImagePlus, Lightbulb, X, Mic, Send, CalendarDays, Flame, Droplet, Trash2, History, ChevronDown, Globe
} from 'lucide-react';

let app: any, auth: any, db: any, appId: any = 'default-app-id';
try {
  if (typeof window !== 'undefined') {
    const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined' ? JSON.parse((window as any).__firebase_config) : { apiKey: "AIzaSyDummyKeyForBuild" };
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof (window as any).__app_id !== 'undefined') appId = (window as any).__app_id;
  }
} catch (e: any) { console.error("Firebase init:", e); }

const translations = {
  ru: {
    dashboard: "Сводка", searchTab: "Поиск", weightTab: "Вес", profileTab: "Профиль", calsLeft: "Осталось калорий", eatenToday: "Съедено", from: "из", kcal: "ккал", aiDietitian: "ИИ-диетолог: Что съесть?", proteins: "Белки", fats: "Жиры", carbs: "Углеводы", g: "г", waterConsumed: "Вода", ml: "мл", addFood: "Добавить еду", breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин", snack: "Перекус", recordVoice: "Запись голосом", dictatePrompt: "Назовите блюдо и вес (например: 200г гречки)", dictatePlaceholder: "200г гречки и котлета...", aiThinking: "Нейросеть распознает...", aiCreating: "Подбираем блюда...", whereToSave: "Прием пищи", date: "Дата", cancel: "Отмена", base: "База", myRecipes: "Мои рецепты", searchPlaceholder: "Поиск продуктов...", recentAdded: "Недавние", notFound: "Ничего не найдено", ingredient: "Ингредиент", constructor: "Конструктор рецепта", recipeName: "Название", addIngredient: "Добавить ингредиент", saveRecipe: "Сохранить", kbju100g: "КБЖУ на 100г", addToDiary: "Записать в дневник", weightInfo: "грамм", aiScanner: "AI Сканер еды", takePhoto: "Камера", fromGallery: "Галерея", recognitionError: "Ошибка распознавания", tryAgain: "Повторить", weightTitle: "Текущий вес (кг)", weightPlaceholder: "75.0", add: "Внести", chart: "Динамика", needMoreData: "Нужно минимум 2 замера", history: "История", start: "Старт", inSystemSince: "Пользователь NutriBot", subsLevels: "Тарифы подписки", current: "Активен", free: "Бесплатно", allFeatures: "Все возможности", hideDetails: "Скрыть подробности", buySilver: "Оформить Silver — 199 ₽", buyGold: "Оформить Gold — 499 ₽", yourTier: "Текущий тариф", proActive: "PRO-доступ активен", accountSetup: "Настройка профиля", activityLabel: "Активность", goalLabel: "Цель", startUsing: "Сохранить и войти", language: "Язык", loadingData: "Синхронизация...", reqSub: "Требуется подписка", reqSubDesc: "Функция ограничена на вашем тарифе. Перейдите в профиль для апгрейда.", toProfile: "В профиль", male: "Мужской", female: "Женский", age: "Возраст", height: "Рост (см)", weight: "Вес (кг)",
    activities: { min: "Минимальная", low: "Низкая", med: "Средняя", high: "Высокая", ext: "Предельная" }, goals: { lose: "Похудение", keep: "Поддержание", gain: "Набор массы" }
  },
  en: {
    dashboard: "Dashboard", searchTab: "Search", weightTab: "Weight", profileTab: "Profile", calsLeft: "Calories left", eatenToday: "Eaten", from: "of", kcal: "kcal", aiDietitian: "AI Dietitian: Suggest meal", proteins: "Proteins", fats: "Fats", carbs: "Carbs", g: "g", waterConsumed: "Water", ml: "ml", addFood: "Add food", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", recordVoice: "Voice Log", dictatePrompt: "Say food and weight (e.g., 200g oatmeal)", dictatePlaceholder: "200g oatmeal and banana...", aiThinking: "AI is analyzing...", aiCreating: "Creating options...", whereToSave: "Meal category", date: "Date", cancel: "Cancel", base: "Catalog", myRecipes: "My Recipes", searchPlaceholder: "Search food...", recentAdded: "Recent", notFound: "Not found", ingredient: "Ingredient", constructor: "Recipe Builder", recipeName: "Title", addIngredient: "Add ingredient", saveRecipe: "Save", kbju100g: "Macros per 100g", addToDiary: "Add to diary", weightInfo: "grams", aiScanner: "AI Food Scanner", takePhoto: "Camera", fromGallery: "Gallery", recognitionError: "Recognition failed", tryAgain: "Retry", weightTitle: "Current weight (kg)", weightPlaceholder: "75.0", add: "Log", chart: "Progress", needMoreData: "Need at least 2 entries", history: "History", start: "Start", inSystemSince: "NutriBot User", subsLevels: "Subscription Plans", current: "Active", free: "Free", allFeatures: "All features", hideDetails: "Hide details", buySilver: "Get Silver — 199 ₽", buyGold: "Get Gold — 499 ₽", yourTier: "Current Plan", proActive: "PRO Active", accountSetup: "Account Setup", activityLabel: "Activity", goalLabel: "Goal", startUsing: "Save & Start", language: "Language", loadingData: "Loading...", reqSub: "Plan Required", reqSubDesc: "Feature is locked on current tier. Upgrade in profile.", toProfile: "Upgrade", male: "Male", female: "Female", age: "Age", height: "Height (cm)", weight: "Weight (kg)",
    activities: { min: "Sedentary", low: "Light", med: "Moderate", high: "High", ext: "Extreme" }, goals: { lose: "Lose weight", keep: "Maintain", gain: "Gain mass" }
  }
};

const LanguageContext = createContext<any>(null);

const MOCK_CATALOG = [
  { id: 1, name: "Куриная грудка (отварная)", calories_100g: 137, protein_100g: 29.8, fats_100g: 1.8, carbs_100g: 0 },
  { id: 2, name: "Гречка отварная", calories_100g: 110, protein_100g: 4.2, fats_100g: 1.1, carbs_100g: 21.3 },
  { id: 3, name: "Овсяная каша на воде", calories_100g: 88, protein_100g: 3.0, fats_100g: 1.7, carbs_100g: 15.0 },
  { id: 4, name: "Яйцо куриное (вареное)", calories_100g: 155, protein_100g: 12.6, fats_100g: 10.6, carbs_100g: 0.8 },
  { id: 5, name: "Рис белый отварной", calories_100g: 130, protein_100g: 2.7, fats_100g: 0.3, carbs_100g: 28.2 },
  { id: 6, name: "Творог 5%", calories_100g: 121, protein_100g: 16.0, fats_100g: 5.0, carbs_100g: 3.0 },
  { id: 7, name: "Банан", calories_100g: 89, protein_100g: 1.1, fats_100g: 0.3, carbs_100g: 22.8 },
  { id: 8, name: "Яблоко", calories_100g: 52, protein_100g: 0.3, fats_100g: 0.2, carbs_100g: 13.8 },
  { id: 9, name: "Лосось на пару", calories_100g: 197, protein_100g: 21.6, fats_100g: 12.3, carbs_100g: 0 },
  { id: 10, name: "Макароны твердых сортов", calories_100g: 157, protein_100g: 5.8, fats_100g: 0.9, carbs_100g: 30.7 },
  { id: 11, name: "Картофель отварной", calories_100g: 82, protein_100g: 2.0, fats_100g: 0.4, carbs_100g: 16.7 },
  { id: 12, name: "Хлеб цельнозерновой", calories_100g: 247, protein_100g: 13.0, fats_100g: 3.4, carbs_100g: 41.0 }
];

const calculateLocalMacros = (profile: any, weight: any) => {
  const w = parseFloat(weight) || 70, h = parseFloat(profile?.height) || 172, a = parseInt(profile?.age) || 28;
  const multipliers: any = { min: 1.2, low: 1.375, med: 1.55, high: 1.725, ext: 1.9 };
  let tdee = ((10 * w) + (6.25 * h) - (5 * a) + (profile?.gender === 'Женский' || profile?.gender === 'Female' ? -161 : 5)) * (multipliers[profile?.activity] || 1.375);
  if (profile?.goal === 'lose') tdee -= 450;
  if (profile?.goal === 'gain') tdee += 450;
  const cals = Math.round(tdee);
  const prot = Math.round(w * (profile?.goal === 'gain' ? 2.0 : 1.7));
  const fat = Math.round(w * 0.9);
  return { calories: cals, protein: prot, fat, carbs: Math.max(Math.round((cals - (prot * 4) - (fat * 9)) / 4), 0) };
};

async function fetchGeminiWithRetry(prompt: string, schema: any, base64Image: any = null, mimeType: any = null) {
  const parts: any[] = [{ text: prompt }];
  if (base64Image) parts.push({ inlineData: { mimeType, data: base64Image } });
  const payload = { contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } };

  let retries = 2;
  while (retries >= 0) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || 'Server error');
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (err: any) {
      if (retries === 0) throw err;
      retries--;
      await new Promise(r => setTimeout(r, 800));
    }
  }
}

async function analyzeImageWithGemini(file: any, isBarcode: boolean, lang: string) {
  const base64Image = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 500;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX; }
        else if (h > MAX) { w = (w * MAX) / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.6).split(',')[1]);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

  const schema = isBarcode 
    ? { type: "OBJECT", properties: { name: { type: "STRING" }, calories_100g: { type: "INTEGER" }, protein_100g: { type: "NUMBER" }, fats_100g: { type: "NUMBER" }, carbs_100g: { type: "NUMBER" } }, required: ["name", "calories_100g", "protein_100g", "fats_100g", "carbs_100g"] }
    : { type: "OBJECT", properties: { dish_name: { type: "STRING" }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["calories", "protein", "fat", "carbs"] } }, required: ["dish_name", "total"] };

  const prompt = isBarcode ? `Analyze barcode nutrition per 100g. Lang: ${lang}` : `Analyze meal photo, name and total macros. Lang: ${lang}`;
  return await fetchGeminiWithRetry(prompt, schema, base64Image, 'image/jpeg');
}

async function getAIAdviceForRemaining(remaining: any, lang: string) {
  const schema = { type: "OBJECT", properties: { suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["title", "description", "calories", "protein", "fat", "carbs"] } } }, required: ["suggestions"] };
  return await fetchGeminiWithRetry(`Remaining goals: Cals: ${remaining.calories}, P: ${remaining.protein}g, F: ${remaining.fat}g, C: ${remaining.carbs}g. Suggest 3 meals. Lang: ${lang}`, schema);
}

async function analyzeTextToFood(text: string, lang: string) {
  const schema = { type: "OBJECT", properties: { dish_name: { type: "STRING" }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["calories", "protein", "fat", "carbs"] } }, required: ["dish_name", "total"] };
  return await fetchGeminiWithRetry(`Convert user description to meal with total estimated macros: "${text}". Lang: ${lang}`, schema);
}

const NavButton = ({ icon, label, isActive, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>
    {React.cloneElement(icon, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
    <span className="text-[10px] font-semibold">{label}</span>
  </button>
);

const MacroCard = ({ label, current, goal, color, g }: any) => {
  const pct = Math.min(Math.round((current / (goal || 1)) * 100), 100);
  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/5 shadow">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="font-bold text-sm mb-2 text-white">{Math.round(current)} / {goal}{g}</div>
      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Dashboard = ({ current, goals, meals, onAddClick, selectedDate, setSelectedDate, requestAddMeal, currentWater, addWater, deleteMeal, checkAccess }: any) => {
  const { t, lang } = useContext(LanguageContext);
  const [adviceData, setAdviceData] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [err, setErr] = useState('');

  const remaining = {
    calories: Math.max((goals?.calories || 2000) - current.calories, 0),
    protein: Math.max((goals?.protein || 140) - current.protein, 0),
    fat: Math.max((goals?.fat || 65) - current.fat, 0),
    carbs: Math.max((goals?.carbs || 210) - current.carbs, 0)
  };

  const handleAskAI = async () => {
    if (!checkAccess('gold')) return;
    setShowAdviceModal(true);
    setLoadingAdvice(true);
    setErr('');
    try {
      const res = await getAIAdviceForRemaining(remaining, lang);
      setAdviceData(res?.suggestions || []);
    } catch (e: any) {
      setErr(e.message || "Ошибка ИИ");
    }
    setLoadingAdvice(false);
  };

  const handleVoiceSubmit = async () => {
    if (!voiceText.trim()) return;
    setIsVoiceLoading(true);
    setErr('');
    try {
      const res = await analyzeTextToFood(voiceText, lang);
      setIsVoiceOpen(false);
      setVoiceText('');
      requestAddMeal(res);
    } catch (e: any) {
      setErr(e.message || "Не удалось распознать");
    }
    setIsVoiceLoading(false);
  };

  const mealTypes = [
    { id: 'breakfast', label: t.breakfast, icon: '🌅' },
    { id: 'lunch', label: t.lunch, icon: '☀️' },
    { id: 'dinner', label: t.dinner, icon: '🌙' },
    { id: 'snack', label: t.snack, icon: '🍎' }
  ];

  return (
    <div className="p-4 space-y-5">
      <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-2xl border border-white/5">
        <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} className="p-2 text-slate-400 bg-slate-700/50 rounded-xl hover:text-white"><ChevronLeft size={20}/></button>
        <div className="flex items-center gap-2 font-bold text-white"><CalendarDays size={18} className="text-emerald-400"/> {selectedDate.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}</div>
        <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} className="p-2 text-slate-400 bg-slate-700/50 rounded-xl hover:text-white"><ChevronRight size={20}/></button>
      </div>

      <div className="bg-slate-800/80 p-5 rounded-2xl border border-white/5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-slate-400 text-sm">{t.calsLeft}</span>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold">{t.eatenToday}</span>
            <div className="text-sm font-bold text-emerald-400">{current.calories} <span className="text-xs text-slate-500">{t.kcal}</span></div>
          </div>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-black text-white">{remaining.calories}</span>
          <span className="text-slate-400 text-sm mb-1">{t.from} {goals?.calories || 2000}</span>
        </div>
        <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700" style={{ width: `${Math.min((current.calories / (goals?.calories || 2000)) * 100, 100)}%` }} />
        </div>
        <button onClick={handleAskAI} className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-colors">
          <Lightbulb size={18} className="text-amber-400" /> {t.aiDietitian}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <MacroCard label={t.proteins} current={current.protein} goal={goals?.protein || 140} color="from-blue-500 to-blue-400" g={t.g} />
        <MacroCard label={t.fats} current={current.fat} goal={goals?.fat || 65} color="from-amber-500 to-amber-400" g={t.g} />
        <MacroCard label={t.carbs} current={current.carbs} goal={goals?.carbs || 210} color="from-purple-500 to-purple-400" g={t.g} />
      </div>

      <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><Droplet size={16} className="text-blue-400" /> {t.waterConsumed}</span>
          <span className="text-xs font-bold text-blue-400">{currentWater} / 2000 {t.ml}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((currentWater / 2000) * 100, 100)}%` }} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => addWater(250)} className="flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-1.5 rounded-lg text-xs font-semibold">+250 {t.ml}</button>
          <button onClick={() => addWater(-250)} className="flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-1.5 rounded-lg text-xs font-semibold">-250 {t.ml}</button>
        </div>
      </div>

      <div className="space-y-4">
        {mealTypes.map(m => {
          const list = meals.filter((x: any) => x.type === m.id);
          const cals = list.reduce((s: number, x: any) => s + (x.total?.calories || 0), 0);
          return (
            <div key={m.id} className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5"><span>{m.icon}</span> {m.label}</span>
                <span className="text-xs font-bold text-emerald-400">{Math.round(cals)} {t.kcal}</span>
              </div>
              {list.length === 0 ? (
                <button onClick={onAddClick} className="w-full bg-slate-800/40 border border-slate-700 border-dashed rounded-xl py-2.5 text-xs text-slate-500 flex items-center justify-center gap-1 hover:text-slate-300">
                  <Plus size={14} /> {t.addFood}
                </button>
              ) : (
                list.map((it: any) => (
                  <div key={it.id} className="bg-slate-800/80 p-3 rounded-xl flex justify-between items-center border border-white/5">
                    <div>
                      <div className="font-medium text-sm text-white">{it.dish_name}</div>
                      <div className="text-[10px] text-slate-400">Б: {Math.round(it.total?.protein || 0)}г | Ж: {Math.round(it.total?.fat || 0)}г | У: {Math.round(it.total?.carbs || 0)}г</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">{Math.round(it.total?.calories || 0)} {t.kcal}</span>
                      <button onClick={() => deleteMeal(it.id)} className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => checkAccess('silver') && setIsVoiceOpen(true)} className="fixed bottom-24 right-4 bg-emerald-500 text-slate-900 p-3.5 rounded-full shadow-lg shadow-emerald-500/40 z-30">
        <Mic size={22} />
      </button>

      {isVoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white flex items-center gap-2"><Mic size={18} className="text-emerald-400"/> {t.recordVoice}</span>
              <button onClick={() => setIsVoiceOpen(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
            </div>
            <p className="text-xs text-slate-300">{t.dictatePrompt}</p>
            {err && <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded">{err}</div>}
            <div className="flex gap-2">
              <input type="text" value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder={t.dictatePlaceholder} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none"/>
              <button onClick={handleVoiceSubmit} disabled={isVoiceLoading || !voiceText.trim()} className="bg-emerald-500 text-slate-900 px-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50">
                {isVoiceLoading ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : <Send size={16}/>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdviceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <div className="bg-slate-900 w-full max-w-md max-h-[80vh] rounded-2xl p-5 border border-white/10 flex flex-col space-y-4 overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white flex items-center gap-2"><Lightbulb size={18} className="text-amber-400"/> {t.aiDietitian}</span>
              <button onClick={() => setShowAdviceModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {loadingAdvice ? (
                <div className="text-center py-10 text-slate-400 text-sm animate-pulse">{t.aiCreating}</div>
              ) : err ? (
                <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-xl">{err}</div>
              ) : (
                adviceData?.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-800/80 p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="font-bold text-white text-sm">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                    <div className="flex justify-between text-xs font-semibold pt-1">
                      <span className="text-emerald-400">{item.calories} {t.kcal}</span>
                      <span className="text-slate-400">Б: {item.protein}г | Ж: {item.fat}г | У: {item.carbs}г</span>
                    </div>
                    <button onClick={() => { setShowAdviceModal(false); requestAddMeal({ dish_name: item.title, total: { calories: item.calories, protein: item.protein, fat: item.fat, carbs: item.carbs } }); }} className="w-full bg-emerald-500/20 text-emerald-400 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/30">
                      {t.addToDiary}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CameraScanner = ({ onSave, onCancel, subscription, scansToday, incrementScan, checkAccess }: any) => {
  const { t, lang } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = async (e: any) => {
    if (subscription === 'silver' && scansToday >= 10) { checkAccess('gold'); return; }
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await analyzeImageWithGemini(file, false, lang);
      if (!res?.dish_name) throw new Error("Блюдо не определено");
      setResult(res);
      setStatus('result');
      if (subscription === 'silver') incrementScan('photo');
    } catch (err: any) {
      setErrorMsg(err.message || "Ошибка обработки");
      setStatus('error');
    }
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <button onClick={onCancel} className="p-2 text-slate-400 bg-slate-800 rounded-xl"><ChevronLeft size={20}/></button>
        <span className="font-bold text-white">{t.aiScanner}</span>
        <div className="w-9" />
      </div>

      {status === 'idle' && (
        <div className="space-y-3 my-auto">
          {subscription === 'silver' && <div className="text-center text-xs text-slate-400">Лимит сканирований: {10 - scansToday}/10</div>}
          <label className="flex items-center gap-3 bg-slate-800/80 border border-emerald-500/30 p-4 rounded-2xl cursor-pointer hover:bg-slate-800">
            <Camera className="text-emerald-400" size={24}/>
            <span className="text-sm font-bold text-white">{t.takePhoto}</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile}/>
          </label>
          <label className="flex items-center gap-3 bg-slate-800/80 border border-blue-500/30 p-4 rounded-2xl cursor-pointer hover:bg-slate-800">
            <ImagePlus className="text-blue-400" size={24}/>
            <span className="text-sm font-bold text-white">{t.fromGallery}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          </label>
        </div>
      )}

      {status === 'loading' && (
        <div className="my-auto text-center space-y-3">
          {preview && <img src={preview} alt="food" className="w-48 h-48 object-cover rounded-2xl mx-auto mb-4 border border-white/10" />}
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm text-slate-300">{t.aiThinking}</div>
        </div>
      )}

      {status === 'error' && (
        <div className="my-auto text-center space-y-3 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
          <AlertCircle size={36} className="text-red-400 mx-auto" />
          <div className="font-bold text-white text-sm">{t.recognitionError}</div>
          <div className="text-xs text-slate-400">{errorMsg}</div>
          <button onClick={() => setStatus('idle')} className="bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-xl">{t.tryAgain}</button>
        </div>
      )}

      {status === 'result' && result && (
        <div className="my-auto space-y-4 bg-slate-800/90 p-5 rounded-2xl border border-white/10">
          <div className="font-bold text-lg text-white">{result.dish_name}</div>
          <div className="grid grid-cols-4 gap-2 bg-slate-900 p-3 rounded-xl text-center">
            <div><div className="text-xs text-slate-500">{t.kcal}</div><div className="font-bold text-emerald-400 text-sm">{result.total?.calories}</div></div>
            <div><div className="text-xs text-slate-500">Б</div><div className="font-bold text-white text-sm">{result.total?.protein}г</div></div>
            <div><div className="text-xs text-slate-500">Ж</div><div className="font-bold text-white text-sm">{result.total?.fat}г</div></div>
            <div><div className="text-xs text-slate-500">У</div><div className="font-bold text-white text-sm">{result.total?.carbs}г</div></div>
          </div>
          <button onClick={() => onSave({ dish_name: result.dish_name, total: result.total })} className="w-full bg-emerald-500 text-slate-900 font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/30">
            {t.addToDiary}
          </button>
        </div>
      )}
    </div>
  );
};

const FoodSearch = ({ customFoods, saveCustomRecipeToDB, onSave, checkAccess, subscription, barcodeScansToday, incrementScan }: any) => {
  const { t, lang } = useContext(LanguageContext);
  const [tab, setTab] = useState('global');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<any>(null);
  const [weight, setWeight] = useState(100);
  const [isScanning, setIsScanning] = useState(false);

  const list = useMemo(() => {
    const src = tab === 'global' ? MOCK_CATALOG : customFoods;
    if (!q.trim()) return src;
    return src.filter((x: any) => x.name.toLowerCase().includes(q.toLowerCase()));
  }, [tab, q, customFoods]);

  const handleSave = () => {
    if (!sel) return;
    const factor = (weight || 100) / 100;
    onSave({
      dish_name: sel.name,
      total: {
        calories: Math.round(sel.calories_100g * factor),
        protein: parseFloat((sel.protein_100g * factor).toFixed(1)),
        fat: parseFloat((sel.fats_100g * factor).toFixed(1)),
        carbs: parseFloat((sel.carbs_100g * factor).toFixed(1))
      }
    });
    setSel(null);
  };

  const handleBarcode = async (e: any) => {
    if (subscription === 'bronze' && barcodeScansToday >= 7) { checkAccess('silver'); return; }
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const data = await analyzeImageWithGemini(file, true, lang);
      if (subscription === 'bronze') incrementScan('barcode');
      setSel({ name: data?.name || "Продукт", calories_100g: data?.calories_100g || 0, protein_100g: data?.protein_100g || 0, fats_100g: data?.fats_100g || 0, carbs_100g: data?.carbs_100g || 0 });
    } catch (e) {
      alert(t.recognitionError);
    }
    setIsScanning(false);
  };

  return (
    <div className="p-4 space-y-4">
      {!sel ? (
        <>
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setTab('global')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${tab === 'global' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>{t.base}</button>
            <button onClick={() => setTab('custom')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${tab === 'custom' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>{t.myRecipes}</button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
              <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-slate-800 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none"/>
            </div>
            <label className="p-2.5 bg-slate-800 border border-white/5 rounded-xl text-slate-300 cursor-pointer">
              <Barcode size={18}/>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleBarcode}/>
            </label>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {list.map((it: any) => (
              <div key={it.id} onClick={() => setSel(it)} className="bg-slate-800/80 p-3 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer hover:bg-slate-800">
                <div>
                  <div className="font-medium text-sm text-white">{it.name}</div>
                  <div className="text-[10px] text-slate-400">Б: {it.protein_100g} | Ж: {it.fats_100g} | У: {it.carbs_100g}</div>
                </div>
                <span className="font-bold text-xs text-emerald-400">{it.calories_100g} {t.kcal}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-slate-800 p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setSel(null)} className="p-1.5 text-slate-400 bg-slate-700 rounded-lg"><ChevronLeft size={16}/></button>
            <span className="font-bold text-white text-sm truncate">{sel.name}</span>
          </div>
          <div className="flex justify-center items-center gap-2 py-4">
            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="bg-slate-900 text-2xl font-bold text-white w-28 text-center py-2 rounded-xl border border-slate-700 outline-none"/>
            <span className="text-slate-400 font-medium text-sm">{t.weightInfo}</span>
          </div>
          <button onClick={handleSave} className="w-full bg-emerald-500 text-slate-900 font-bold py-3 rounded-xl text-sm shadow-md shadow-emerald-500/30">{t.addToDiary}</button>
        </div>
      )}
    </div>
  );
};

const WeightTracker = ({ history, onAdd }: any) => {
  const { t } = useContext(LanguageContext);
  const [val, setVal] = useState('');
  const submit = (e: any) => {
    e.preventDefault();
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num) && num > 0) { onAdd(num); setVal(''); }
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={submit} className="bg-slate-800/80 p-4 rounded-2xl border border-white/5 flex gap-2">
        <input type="text" inputMode="decimal" value={val} onChange={e => setVal(e.target.value)} placeholder={t.weightPlaceholder} className="flex-1 bg-slate-900 rounded-xl px-3 py-2 text-sm text-center text-white outline-none border border-white/5"/>
        <button type="submit" className="bg-emerald-500 text-slate-900 font-bold px-4 rounded-xl text-sm">{t.add}</button>
      </form>
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/5 space-y-2 max-h-[65vh] overflow-y-auto">
        <div className="text-xs font-bold text-slate-400">{t.history}</div>
        {history.map((h: any, idx: number) => (
          <div key={h.id || idx} className="flex justify-between py-2 border-b border-slate-700/50 text-xs">
            <span className="text-slate-400">{h.date}</span>
            <span className="font-bold text-white">{h.weight} кг</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserProfile = ({ currentSub, setSubscription }: any) => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const [openTier, setOpenTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'bronze', name: 'Bronze', price: t.free, color: 'text-[#cd7f32]', border: 'border-slate-700',
      features: [
        { text: "Базовый каталог и поиск продуктов", ok: true },
        { text: "Сканер штрихкодов продуктов (до 7/день)", ok: true },
        { text: "Учет выпитой воды, веса и КБЖУ", ok: true },
        { text: "Конструктор рецептов", ok: true },
        { text: "AI-сканирование блюд по фото", ok: false },
        { text: "Голосовой ввод съеденного", ok: false },
        { text: "Умный ИИ-диетолог", ok: false }
      ]
    },
    {
      id: 'silver', name: 'Silver', price: '199 ₽ / мес', color: 'text-slate-300', border: 'border-blue-500/40',
      features: [
        { text: "Всё, что входит в тариф Bronze", ok: true },
        { text: "AI-сканирование еды по фото (до 10/день)", ok: true },
        { text: "Безлимитный сканер штрихкодов", ok: true },
        { text: "Голосовой ввод съеденного", ok: true },
        { text: "Умный ИИ-диетолог", ok: false },
        { text: "Безлимитное AI-сканирование", ok: false }
      ]
    },
    {
      id: 'gold', name: 'Gold', price: '499 ₽ / мес', color: 'text-amber-400', border: 'border-amber-500/40',
      features: [
        { text: "Все функции тарифов Bronze и Silver", ok: true },
        { text: "Безлимитное AI-сканирование еды по фото", ok: true },
        { text: "ИИ-диетолог: персональный подбор блюд", ok: true },
        { text: "Максимальная скорость ответа нейросети", ok: true },
        { text: "Эксклюзивный золотой статус и темы", ok: true }
      ]
    }
  ];

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-emerald-500/30"><User size={24} className="text-slate-300"/></div>
          <div><div className="font-bold text-white text-sm">@telegram_user</div><div className="text-[11px] text-slate-400">{t.inSystemSince}</div></div>
        </div>
        <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1 outline-none">
          <option value="ru">RU</option><option value="en">EN</option>
        </select>
      </div>

      <div className="text-sm font-bold text-slate-200 px-1">{t.subsLevels}</div>
      <div className="space-y-3">
        {tiers.map(tr => (
          <div key={tr.id} className={`bg-slate-800/90 rounded-2xl p-4 border ${tr.border}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold ${tr.color} flex items-center gap-1.5`}>
                {tr.id === 'gold' ? <Crown size={18}/> : tr.id === 'silver' ? <Zap size={18}/> : <Shield size={18}/>}
                {tr.name}
              </span>
              <span className="text-xs font-semibold text-slate-400">{tr.price}</span>
            </div>

            <button 
              type="button"
              onClick={() => setOpenTier(openTier === tr.id ? null : tr.id)} 
              className="w-full flex justify-between items-center py-2 px-3 bg-slate-900/60 rounded-xl text-xs text-slate-300 font-medium hover:bg-slate-900 transition-colors"
            >
              <span>{openTier === tr.id ? t.hideDetails : t.allFeatures}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${openTier === tr.id ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`}/>
            </button>

            {openTier === tr.id && (
              <ul className="mt-3 space-y-2 text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl">
                {tr.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 ${!f.ok ? 'opacity-40' : ''}`}>
                    {f.ok ? <Check size={14} className="text-emerald-400 mt-0.5 shrink-0"/> : <Minus size={14} className="text-slate-500 mt-0.5 shrink-0"/>}
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentSub !== tr.id && tr.id !== 'bronze' && (
              <button onClick={() => setSubscription(tr.id)} className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                {tr.id === 'gold' ? t.buyGold : t.buySilver}
              </button>
            )}
            {currentSub === tr.id && (
              <div className="w-full mt-3 text-center text-xs font-bold py-2 bg-slate-900/40 text-slate-400 rounded-xl">{t.yourTier}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OnboardingScreen = ({ onComplete }: any) => {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({ gender: 'Мужской', age: '26', height: '175', weight: '74', goal: 'lose', activity: 'med' });

  return (
    <div className="p-5 max-w-sm mx-auto my-auto space-y-4">
      <div className="text-center space-y-1">
        <Activity className="text-emerald-400 mx-auto" size={32}/>
        <h1 className="text-2xl font-black text-white">NutriBot</h1>
        <p className="text-xs text-slate-400">{t.accountSetup}</p>
      </div>
      <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-white/5 text-xs">
        <div className="flex gap-2">
          <button type="button" onClick={() => setForm({ ...form, gender: 'Мужской' })} className={`flex-1 py-2 rounded-xl font-bold ${form.gender === 'Мужской' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>{t.male}</button>
          <button type="button" onClick={() => setForm({ ...form, gender: 'Женский' })} className={`flex-1 py-2 rounded-xl font-bold ${form.gender === 'Женский' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>{t.female}</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div><label className="text-[10px] text-slate-400">{t.age}</label><input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="w-full bg-slate-900 p-2 rounded-lg text-white text-center outline-none"/></div>
          <div><label className="text-[10px] text-slate-400">{t.height}</label><input type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="w-full bg-slate-900 p-2 rounded-lg text-white text-center outline-none"/></div>
          <div><label className="text-[10px] text-slate-400">{t.weight}</label><input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full bg-slate-900 p-2 rounded-lg text-white text-center outline-none"/></div>
        </div>
        <div>
          <label className="text-[10px] text-slate-400">{t.goalLabel}</label>
          <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className="w-full bg-slate-900 p-2 rounded-lg text-white outline-none">
            <option value="lose">{t.goals.lose}</option>
            <option value="keep">{t.goals.keep}</option>
            <option value="gain">{t.goals.gain}</option>
          </select>
        </div>
      </div>
      <button onClick={() => onComplete(calculateLocalMacros(form, form.weight), form)} className="w-full bg-emerald-500 text-slate-900 font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/30">
        {t.startUsing}
      </button>
    </div>
  );
};

function NutriBotApp() {
  const { t } = useContext(LanguageContext);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any>(null);
  const [tab, setTab] = useState('dashboard');
  const [date, setDate] = useState(new Date());
  const [meals, setMeals] = useState<any[]>([]);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [waterLogs, setWaterLogs] = useState<any>({});
  const [customFoods, setCustomFoods] = useState<any[]>([]);
  const [pendingMeal, setPendingMeal] = useState<any>(null);
  
  const [streakDays, setStreakDays] = useState(0);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [subscription, setSubscription] = useState('bronze');
  const [scansToday, setScansToday] = useState(0);
  const [barcodeScansToday, setBarcodeScansToday] = useState(0);
  const [upgradePrompt, setUpgradePrompt] = useState({ show: false, required: '' });

  const getStreakStyle = (d: number) => {
    if (d >= 400) return { text: "text-cyan-400", fill: "fill-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500" };
    if (d >= 100) return { text: "text-red-500", fill: "fill-red-500", border: "border-red-500/40", bg: "bg-red-500" };
    if (d >= 30) return { text: "text-purple-400", fill: "fill-purple-400", border: "border-purple-500/40", bg: "bg-purple-500" };
    return { text: "text-orange-400", fill: "fill-orange-400", border: "border-orange-500/40", bg: "bg-orange-500" };
  };
  const streakStyle = getStreakStyle(streakDays);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (curr) => {
      if (curr) setUser(curr);
      else {
        try { await signInAnonymously(auth); }
        catch { setUser({ uid: 'local-user' }); }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || !db || user.uid === 'local-user') return;
    const unsubP = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setProfile(d.formData);
        setGoals(d.goals);
      }
    });
    const unsubM = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'meals'), (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push(d.data()));
      setMeals(arr);
    });
    const unsubW = onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'weights'), (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push(d.data()));
      setWeightHistory(arr.sort((a,b) => b.id - a.id));
    });
    const unsubWt = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'water'), (snap) => {
      if (snap.exists()) setWaterLogs(snap.data().logs || {});
    });
    return () => { unsubP(); unsubM(); unsubW(); unsubWt(); };
  }, [user]);

  const dateStr = useMemo(() => `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`, [date]);
  const todayStr = useMemo(() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }, []);
  const dayMeals = useMemo(() => meals.filter((m: any) => m.date === dateStr), [meals, dateStr]);

  const currentMacros = useMemo(() => dayMeals.reduce((acc: any, m: any) => ({
    calories: acc.calories + (m.total?.calories || 0),
    protein: acc.protein + (m.total?.protein || 0),
    fat: acc.fat + (m.total?.fat || 0),
    carbs: acc.carbs + (m.total?.carbs || 0)
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 }), [dayMeals]);

  const checkAccess = useCallback((tier: string) => {
    const ranks: any = { bronze: 0, silver: 1, gold: 2 };
    if (ranks[subscription] >= ranks[tier]) return true;
    setUpgradePrompt({ show: true, required: tier });
    return false;
  }, [subscription]);

  const confirmAddMeal = useCallback(async (type: string) => {
    if (!pendingMeal) return;
    const hasToday = meals.some((m: any) => m.date === todayStr);
    const newMeal = { ...pendingMeal, type, date: dateStr, id: Date.now() };
    setMeals(prev => [...prev, newMeal]);
    setPendingMeal(null);
    setTab('dashboard');

    if (dateStr === todayStr && !hasToday) {
      const next = streakDays + 1;
      setStreakDays(next);
      if ([5, 10, 30, 60, 100, 200, 400].includes(next)) {
        setShowStreakPopup(true);
        setTimeout(() => setShowStreakPopup(false), 4000);
      }
    }
    if (user && db && user.uid !== 'local-user') {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', newMeal.id.toString()), newMeal);
    }
  }, [pendingMeal, meals, dateStr, todayStr, streakDays, user]);

  const deleteMeal = useCallback(async (id: any) => {
    setMeals(prev => prev.filter(x => x.id !== id));
    if (user && db && user.uid !== 'local-user') {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', id.toString()));
    }
  }, [user]);

  const handleWater = useCallback(async (amount: number) => {
    const updated = Math.max((waterLogs[dateStr] || 0) + amount, 0);
    const logs = { ...waterLogs, [dateStr]: updated };
    setWaterLogs(logs);
    if (user && db && user.uid !== 'local-user') {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'water'), { logs });
    }
  }, [waterLogs, dateStr, user]);

  const handleAddWeight = useCallback(async (w: number) => {
    const item = { id: Date.now(), date: new Date().toLocaleDateString(), weight: w };
    setWeightHistory(prev => [item, ...prev]);
    if (user && db && user.uid !== 'local-user') {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', item.id.toString()), item);
    }
  }, [user]);

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm font-semibold">{t.loadingData}</div>;
  if (!profile || !goals) return <OnboardingScreen onComplete={(g, f) => { setGoals(g); setProfile(f); }} />;

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 max-w-md mx-auto relative overflow-hidden font-sans">
      <header className="px-4 py-3 bg-slate-900/90 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 font-bold text-base"><Activity className="text-emerald-400" size={20} /> NutriBot</div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${streakDays > 0 ? `${streakStyle.border} ${streakStyle.text} bg-slate-800` : 'border-slate-700 text-slate-500'}`}>
            <Flame size={14} className={streakDays > 0 ? streakStyle.fill : ""} /> {streakDays}
          </div>
          <button onClick={() => setTab('profile')} className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
            {subscription.toUpperCase()}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'dashboard' && <Dashboard current={currentMacros} goals={goals} meals={dayMeals} onAddClick={() => setTab('search')} selectedDate={date} setSelectedDate={setDate} requestAddMeal={setPendingMeal} currentWater={waterLogs[dateStr] || 0} addWater={handleWater} deleteMeal={deleteMeal} checkAccess={checkAccess} />}
        {tab === 'camera' && <CameraScanner onSave={setPendingMeal} onCancel={() => setTab('dashboard')} subscription={subscription} scansToday={scansToday} incrementScan={(t: string) => t === 'photo' && setScansToday(p => p+1)} checkAccess={checkAccess} />}
        {tab === 'search' && <FoodSearch customFoods={customFoods} saveCustomRecipeToDB={(r: any) => setCustomFoods(p => [...p, r])} onSave={setPendingMeal} checkAccess={checkAccess} subscription={subscription} barcodeScansToday={barcodeScansToday} incrementScan={(t: string) => t === 'barcode' && setBarcodeScansToday(p => p+1)} />}
        {tab === 'weight' && <WeightTracker history={weightHistory} onAdd={handleAddWeight} />}
        {tab === 'profile' && <UserProfile currentSub={subscription} setSubscription={setSubscription} />}
      </main>

      <nav className="absolute bottom-0 w-full bg-slate-900/95 border-t border-white/5 py-2 px-3 flex justify-between items-center">
        <div className="flex gap-4">
          <NavButton icon={<Home />} label={t.dashboard} isActive={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
          <NavButton icon={<Search />} label={t.searchTab} isActive={tab === 'search'} onClick={() => setTab('search')} />
        </div>
        <button onClick={() => checkAccess('silver') && setTab('camera')} className="bg-emerald-500 text-slate-900 p-3 rounded-full shadow-lg shadow-emerald-500/30">
          <Camera size={22} />
        </button>
        <div className="flex gap-4">
          <NavButton icon={<Scale />} label={t.weightTab} isActive={tab === 'weight'} onClick={() => setTab('weight')} />
          <NavButton icon={<User />} label={t.profileTab} isActive={tab === 'profile'} onClick={() => setTab('profile')} />
        </div>
      </nav>

      {pendingMeal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="text-center font-bold text-white text-sm">{t.whereToSave}</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button onClick={() => confirmAddMeal('breakfast')} className="p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700">🌅 {t.breakfast}</button>
              <button onClick={() => confirmAddMeal('lunch')} className="p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700">☀️ {t.lunch}</button>
              <button onClick={() => confirmAddMeal('dinner')} className="p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700">🌙 {t.dinner}</button>
              <button onClick={() => confirmAddMeal('snack')} className="p-3 bg-slate-700/60 rounded-xl hover:bg-slate-700">🍎 {t.snack}</button>
            </div>
            <button onClick={() => setPendingMeal(null)} className="w-full py-2 text-xs text-slate-400 font-semibold">{t.cancel}</button>
          </div>
        </div>
      )}

      {upgradePrompt.show && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 w-full max-w-xs rounded-2xl p-5 border border-white/10 text-center space-y-3">
            <Crown size={32} className="text-amber-400 mx-auto" />
            <div className="font-bold text-white text-sm">{t.reqSub} {upgradePrompt.required.toUpperCase()}</div>
            <div className="text-xs text-slate-300">{t.reqSubDesc}</div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setUpgradePrompt({ show: false, required: '' })} className="flex-1 py-2 bg-slate-700 rounded-xl text-xs text-slate-300">{t.cancel}</button>
              <button onClick={() => { setUpgradePrompt({ show: false, required: '' }); setTab('profile'); }} className="flex-1 py-2 bg-emerald-500 text-slate-900 font-bold rounded-xl text-xs">{t.toProfile}</button>
            </div>
          </div>
        </div>
      )}

      {showStreakPopup && (
        <div onClick={() => setShowStreakPopup(false)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <Flame size={72} className={`${streakStyle.text} ${streakStyle.fill} mx-auto animate-bounce`} />
            <div className="text-3xl font-black text-white">ЮБИЛЕЙ!</div>
            <div className={`text-lg font-bold ${streakStyle.text}`}>{streakDays} ДНЕЙ ПОДРЯД</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = useState('ru');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] || translations['ru'] }}>
      <NutriBotApp />
    </LanguageContext.Provider>
  );
}
