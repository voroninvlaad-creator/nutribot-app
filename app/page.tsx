// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import {
Camera, Search, Home, Plus, Activity, CheckCircle2, ChevronLeft, ChevronRight, Scale, User,
TrendingDown, TrendingUp, Minus, Crown, Zap, Shield, Check, Barcode, AlertCircle,
ImagePlus, ArrowRight, Lightbulb, X, Mic, Send, CalendarDays, Flame, Droplet, Trash2, History, ChevronDown, Globe
} from 'lucide-react';

// === FIREBASE ИНИЦИАЛИЗАЦИЯ ===
let app: any, auth: any, db: any, appId: any = 'default-app-id';
try {
if (typeof window !== 'undefined') {
const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined'
? JSON.parse((window as any).__firebase_config)
: { apiKey: "AIzaSyDummyKeyForBuild" };
app = !getApps().length ? initializeApp(firebaseConfig) : getApps()

$$0$$

;
auth = getAuth(app);
db = getFirestore(app);
if (typeof (window as any).__app_id !== 'undefined') appId = (window as any).__app_id;
}
} catch (e: any) {
console.error("Firebase init error:", e);
}

// === ЛОКАЛИЗАЦИЯ ===
const translations = {
ru: {
dashboard: "Сводка", searchTab: "Поиск", weightTab: "Вес", profileTab: "Профиль", calsLeft: "Осталось калорий", eatenToday: "Съедено за день", from: "из", kcal: "ккал", aiDietitian: "ИИ-диетолог: Что съесть?", proteins: "Белки", fats: "Жиры", carbs: "Углеводы", g: "г", waterConsumed: "Выпито воды", ml: "мл", addFood: "Добавить еду", breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин", snack: "Перекус", recordVoice: "Запись голосом", dictatePrompt: "Напишите или продиктуйте, что вы съели.", dictatePlaceholder: "Напр: 200г гречки", aiThinking: "Нейросеть анализирует...", aiCreating: "Создаем рецепты...", whereToSave: "Куда записать блюдо?", date: "Дата", cancel: "Отмена", base: "База", myRecipes: "Мои рецепты", searchPlaceholder: "Поиск...", recentAdded: "Недавно добавленные", notFound: "Ничего не найдено", ingredient: "Ингредиент", constructor: "Конструктор", recipeName: "Название блюда", addIngredient: "Добавить ингредиент", saveRecipe: "Сохранить рецепт", kbju100g: "КБЖУ (на 100 грамм)", addToDiary: "Добавить в дневник", weightInfo: "грамм", aiScanner: "AI Сканер еды", takePhoto: "Сделать фото", fromGallery: "Из галереи", recognitionError: "Ошибка распознавания", tryAgain: "Попробовать еще раз", recognized: "Распознанные продукты", weightTitle: "Записать вес (кг)", weightPlaceholder: "Напр. 75.5", add: "Добавить", chart: "График", needMoreData: "Нужен еще один замер", history: "История замеров", start: "Начало", inSystemSince: "Пользователь базы", subsLevels: "Уровни подписки", current: "Текущий", free: "Бесплатно", allFeatures: "Все возможности", hideDetails: "Скрыть подробности", buySilver: "Перейти на Silver", buyGold: "Купить Gold доступ", yourTier: "Ваш текущий тариф", proActive: "Активный PRO-доступ", makingPlan: "Создаем план...", accountSetup: "Настроим NutriBot", activityLabel: "Активность", goalLabel: "Ваша цель", startUsing: "Начать использование", language: "Язык", loadingData: "Загрузка...", reqSub: "Требуется подписка", reqSubDesc: "Эта функция недоступна на вашем текущем тарифе. Перейдите в профиль, чтобы снять ограничения.", toProfile: "В профиль", silverUnlocked: "SILVER РАЗБЛОКИРОВАН", goldUnlocked: "GOLD", male: "Мужской", female: "Женский", age: "Возраст", height: "Рост (см)", weight: "Вес (кг)", bronzeF2: "скан. штрихкодов",
activities: { min: "Минимальная", low: "Слабая", med: "Средняя", high: "Высокая", ext: "Экстремальная" }, goals: { lose: "Похудение", keep: "Поддержание веса", gain: "Набор массы" }
},
en: {
dashboard: "Dashboard", searchTab: "Search", weightTab: "Weight", profileTab: "Profile", calsLeft: "Calories left", eatenToday: "Eaten today", from: "of", kcal: "kcal", aiDietitian: "AI Dietitian: What to eat?", proteins: "Protein", fats: "Fats", carbs: "Carbs", g: "g", waterConsumed: "Water consumed", ml: "ml", addFood: "Add food", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", recordVoice: "Voice Record", dictatePrompt: "Type or dictate what you ate.", dictatePlaceholder: "e.g., 200g of buckwheat", aiThinking: "AI is analyzing...", aiCreating: "Creating recipes...", whereToSave: "Where to save this meal?", date: "Date", cancel: "Cancel", base: "Database", myRecipes: "My Recipes", searchPlaceholder: "Search...", recentAdded: "Recently added", notFound: "Nothing found", ingredient: "Ingredient", constructor: "Constructor", recipeName: "Recipe name", addIngredient: "Add ingredient", saveRecipe: "Save recipe", kbju100g: "Macros (per 100g)", addToDiary: "Add to diary", weightInfo: "grams", aiScanner: "AI Food Scanner", takePhoto: "Take a photo", fromGallery: "From gallery", recognitionError: "Recognition error", tryAgain: "Try again", recognized: "Recognized products", weightTitle: "Log weight (kg)", weightPlaceholder: "e.g. 75.5", add: "Add", chart: "Chart", needMoreData: "Need one more log", history: "Weight history", start: "Start", inSystemSince: "Cloud Member", subsLevels: "Subscription Tiers", current: "Current", free: "Free", allFeatures: "All features", hideDetails: "Hide details", buySilver: "Upgrade to Silver", buyGold: "Get Gold Access", yourTier: "Your current tier", proActive: "PRO Access Active", makingPlan: "Creating plan...", accountSetup: "Setup NutriBot", activityLabel: "Activity", goalLabel: "Your goal", startUsing: "Start using", language: "Language", loadingData: "Loading...", reqSub: "Subscription Required", reqSubDesc: "This feature is not available on your current plan. Upgrade in profile to unlock.", toProfile: "To Profile", silverUnlocked: "SILVER UNLOCKED", goldUnlocked: "GOLD", male: "Male", female: "Female", age: "Age", height: "Height (cm)", weight: "Weight (kg)", bronzeF2: "barcode scans",
activities: { min: "Minimal", low: "Light", med: "Moderate", high: "High", ext: "Extreme" }, goals: { lose: "Weight loss", keep: "Maintain weight", gain: "Muscle gain" }
}
};

const LanguageContext = createContext(null);

const globalStyles = .btn-glass { transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s ease, background-color 0.1s ease; cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; transform: translateZ(0); } .btn-glass:active { transform: scale(0.96) translateZ(0); opacity: 0.7; } @keyframes zapIn { 0% { transform: scale(0.1) skewX(20deg); opacity: 0; filter: brightness(2); } 60% { transform: scale(1.15) skewX(-10deg); opacity: 1; filter: brightness(1.5); } 100% { transform: scale(1) skewX(0); opacity: 1; filter: brightness(1); } } @keyframes floatUp { 0% { transform: translateY(150px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } };

const langMap: any = { ru: "Русский", en: "English" };

// === АНИМАЦИИ ПОДПИСОК ===
const LightningStorm = () => (

const GoldBurstAnimation = () => (

// === ВЗАИМОДЕЙСТВИЕ С БЭКЕНДОМ GEMINI ===
async function fetchGeminiWithRetry(prompt: string, schema: any, base64Image: any = null, mimeType: any = null) {
const parts: any

 = 

$${ text: prompt }$$

;
if (base64Image) {
parts.push({ inlineData: { mimeType: mimeType, data: base64Image } });
}
const payload = {
contents: 

$${ role: "user", parts }$$

,
generationConfig: { responseMimeType: "application/json", responseSchema: schema }
};

let retries = 3;
while (retries > 0) {
try {
const response = await fetch('/api/gemini', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
const result = await response.json();
if (!response.ok) throw new Error(result.error || 'Ошибка сервера Vercel');
if (result.error) throw new Error(result.error);
return JSON.parse(result.candidates

$$0$$

.content.parts

$$0$$

.text);
} catch (error: any) {
retries--;
if (retries === 0) throw error;
await new Promise(r => setTimeout(r, 1000));
}
}
}

async function analyzeImageWithGemini(file: any, isBarcode: boolean, lang: string) {
const base64Image = await new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = (event: any) => {
const img = new Image();
img.src = event.target.result;
img.onload = () => {
const canvas = document.createElement('canvas');
const MAX_SIZE = 500;
let width = img.width;
let height = img.height;
if (width > height) {
if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
} else {
if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
}
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
if (ctx) ctx.drawImage(img, 0, 0, width, height);
const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
resolve(dataUrl.split(',')

$$1$$

);
};
img.onerror = reject;
};
reader.onerror = reject;
});

const schema = isBarcode ? {
type: "OBJECT",
properties: {
name: { type: "STRING" },
calories_100g: { type: "INTEGER" },
protein_100g: { type: "NUMBER" },
fats_100g: { type: "NUMBER" },
carbs_100g: { type: "NUMBER" }
},
required: 

$$"name", "calories_100g", "protein_100g", "fats_100g", "carbs_100g"$$


} : {
type: "OBJECT",
properties: {
dish_name: { type: "STRING" },
total: {
type: "OBJECT",
properties: {
calories: { type: "INTEGER" },
protein: { type: "NUMBER" },
fat: { type: "NUMBER" },
carbs: { type: "NUMBER" }
},
required: 

$$"calories", "protein", "fat", "carbs"$$


}
},
required: 

$$"dish_name", "total"$$


};

const prompt = isBarcode
? Analyze barcode. Return macros per 100g. Language: ${langMap[lang] || 'Russian'}
: Analyze food photo. Identify dish and estimate total macros for the whole portion. Be extremely fast. Language: ${langMap[lang] || 'Russian'};
return await fetchGeminiWithRetry(prompt, schema, base64Image, 'image/jpeg');
}

async function getAIAdviceForRemaining(remaining: any, lang: string) {
const schema = {
type: "OBJECT",
properties: {
suggestions: {
type: "ARRAY",
items: {
type: "OBJECT",
properties: {
title: { type: "STRING" },
description: { type: "STRING" },
calories: { type: "INTEGER" },
protein: { type: "NUMBER" },
fat: { type: "NUMBER" },
carbs: { type: "NUMBER" }
},
required: 

$$"title", "description", "calories", "protein", "fat", "carbs"$$


}
}
},
required: 

$$"suggestions"$$


};
return await fetchGeminiWithRetry(
User has left: Cals: ${remaining.calories}, P: ${remaining.protein}g, F: ${remaining.fat}g, C: ${remaining.carbs}g. Suggest 3 meals. Language: ${langMap[lang] || 'Russian'},
schema
);
}

async function analyzeTextToFood(text: string, lang: string) {
const schema = {
type: "OBJECT",
properties: {
dish_name: { type: "STRING" },
total: {
type: "OBJECT",
properties: {
calories: { type: "INTEGER" },
protein: { type: "NUMBER" },
fat: { type: "NUMBER" },
carbs: { type: "NUMBER" }
},
required: 

$$"calories", "protein", "fat", "carbs"$$


}
},
required: 

$$"dish_name", "total"$$


};
return await fetchGeminiWithRetry(Text: "${text}". Convert to meal, estimate weight & macros. Language: ${langMap[lang] || 'Russian'}, schema);
}

const calculateLocalMacros = (profile: any, weight: any) => {
const w = parseFloat(weight) || 70, h = parseFloat(profile.height) || 170, a = parseInt(profile.age) || 30;
const multipliers: any = { min: 1.2, low: 1.375, med: 1.55, high: 1.725, ext: 1.9 };
let tdee = ((10 * w) + (6.25 * h) - (5 * a) + (profile.gender === 'Мужской' || profile.gender === 'Male' ? 5 : -161)) * (multipliers

$$profile.activity$$

 || 1.375);
if (profile.goal === 'lose') tdee -= 500;
if (profile.goal === 'gain') tdee += 500;
const cals = Math.round(tdee), prot = Math.round(w * (profile.goal === 'gain' ? 2.0 : 1.8)), fat = Math.round(w * 1);
return { calories: cals, protein: prot, fat: fat, carbs: Math.max(Math.round((cals - (prot * 4) - (fat * 9)) / 4), 0) };
};

const MOCK_CATALOG = 

$${ id: 1, name: "Творог 0\%", calories_100g: 71, protein_100g: 16.5, fats_100g: 0, carbs_100g: 1.3 }, { id: 2, name: "Творог 5\%", calories_100g: 121, protein_100g: 21, fats_100g: 5, carbs_100g: 3 }, { id: 3, name: "Куриная грудка (отварная)", calories_100g: 165, protein_100g: 31, fats_100g: 3.6, carbs_100g: 0 }, { id: 4, name: "Гречка (отварная)", calories_100g: 110, protein_100g: 4.5, fats_100g: 1.1, carbs_100g: 20 }, { id: 5, name: "Яйцо куриное (вареное)", calories_100g: 155, protein_100g: 13, fats_100g: 11, carbs_100g: 1.1 }$$

;

// === КОМПОНЕНТЫ ===
const NavButton = React.memo(({ icon, label, isActive, onClick }: any) => (

const MacroCard = React.memo(({ label, current, goal, color, g }: any) => {
const percent = Math.min(Math.round((current / goal) * 100), 100) || 0;
return (

{label}
{Math.round(current)} / {goal}{g}

);
});

const Dashboard = React.memo(({ current, goals, meals, onAddClick, selectedDate, setSelectedDate, requestAddMeal, currentWater, addWater, deleteMeal, checkAccess }: any) => {
const { t, lang } = useContext(LanguageContext);
const 

$$adviceData, setAdviceData$$

 = useState(null);
const 

$$loadingAdvice, setLoadingAdvice$$

 = useState(false);
const 

$$showAdviceModal, setShowAdviceModal$$

 = useState(false);
const 

$$isVoiceModalOpen, setIsVoiceModalOpen$$

 = useState(false);
const 

$$voiceText, setVoiceText$$

 = useState('');
const 

$$isAnalyzingVoice, setIsAnalyzingVoice$$

 = useState(false);
const 

$$aiErrorMsg, setAiErrorMsg$$

 = useState('');

const WATER_GOAL = 2000;
const getPercent = (val: any, max: any) => Math.min(Math.round((val / max) * 100), 100);
const remaining = {
calories: Math.max((goals?.calories || 2000) - current.calories, 0),
protein: Math.max(Math.round((goals?.protein || 150) - current.protein), 0),
fat: Math.max(Math.round((goals?.fat || 70) - current.fat), 0),
carbs: Math.max(Math.round((goals?.carbs || 200) - current.carbs), 0)
};

const handleAskAI = async () => {
if (!checkAccess('gold')) return;
setShowAdviceModal(true);
setLoadingAdvice(true);
setAiErrorMsg('');
try {
const res = await getAIAdviceForRemaining(remaining, lang);
setAdviceData(res.suggestions);
} catch (e: any) {
setAiErrorMsg(e.message || "Ошибка соединения");
}
setLoadingAdvice(false);
};

const handleVoiceSubmit = async () => {
if(!voiceText.trim()) return;
setIsAnalyzingVoice(true);
setAiErrorMsg('');
try {
const result = await analyzeTextToFood(voiceText, lang);
setIsVoiceModalOpen(false);
setVoiceText('');
requestAddMeal(result);
} catch (e: any) {
setAiErrorMsg(e.message || "Ошибка распознавания голоса");
}
setIsAnalyzingVoice(false);
};

const formatDisplayDate = (d: any) => {
const today = new Date(), yesterday = new Date(), tomorrow = new Date();
yesterday.setDate(today.getDate() - 1);
tomorrow.setDate(today.getDate() + 1);
if (d.toDateString() === today.toDateString()) return "Сегодня";
if (d.toDateString() === yesterday.toDateString()) return "Вчера";
if (d.toDateString() === tomorrow.toDateString()) return "Завтра";
return ${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()};
};

const mealTypes = 

$${ id: 'breakfast', label: t.breakfast, icon: '🌅' }, { id: 'lunch', label: t.lunch, icon: '☀️' }, { id: 'dinner', label: t.dinner, icon: '🌙' }, { id: 'snack', label: t.snack, icon: '🍎' }$$

;

return (

{formatDisplayDate(selectedDate)}

  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5 relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <h2 className="text-slate-400 text-sm font-medium">{t.calsLeft}</h2>
      <div className="text-right">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.eatenToday}</span>
        <div className="text-sm font-bold text-emerald-400">{current.calories} <span className="text-slate-500 text-xs">{t.kcal}</span></div>
      </div>
    </div>
    <div className="flex items-end gap-2 mb-4 mt-[-10px]">
      <span className="text-4xl font-bold text-white">{remaining.calories}</span>
      <span className="text-slate-400 text-sm mb-1">{t.from} {goals?.calories || 2000}</span>
    </div>
    <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-5">
      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${getPercent(current.calories, goals?.calories || 2000)}%` }} />
    </div>
    <div onClick={handleAskAI} className="btn-glass w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20">
      <Lightbulb size={20} className="text-amber-400" /> {t.aiDietitian}
    </div>
  </div>

  <div className="grid grid-cols-3 gap-3">
    <MacroCard label={t.proteins} current={current.protein} goal={goals?.protein || 150} color="from-blue-500 to-blue-400" g={t.g} />
    <MacroCard label={t.fats} current={current.fat} goal={goals?.fat || 70} color="from-amber-500 to-amber-400" g={t.g}/>
    <MacroCard label={t.carbs} current={current.carbs} goal={goals?.carbs || 200} color="from-purple-500 to-purple-400" g={t.g}/>
  </div>

  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-slate-200 font-bold flex items-center gap-2">
        <Droplet className="text-blue-400" size={20} fill="currentColor" fillOpacity={0.2} /> {t.waterConsumed}
      </h2>
      <span className="text-sm font-bold text-blue-400">{currentWater} / {WATER_GOAL} {t.ml}</span>
    </div>
    <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-4">
      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${getPercent(currentWater, WATER_GOAL)}%` }}>
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
    <div className="flex gap-3">
      <div onClick={() => addWater(250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥛 +250 {t.ml}</div>
      <div onClick={() => addWater(-250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥤 -250 {t.ml}</div>
    </div>
  </div>

  <div className="mt-8 space-y-6 pb-20">
    {mealTypes.map(type => {
      const typeMeals = meals.filter((m: any) => m.type === type.id);
      const typeCals = typeMeals.reduce((acc: any, m: any) => acc + (m.total?.calories || 0), 0);
      return (
        <div key={type.id} className="animate-in fade-in">
          <div className="flex justify-between items-center mb-3 px-1">
            <h4 className="font-bold text-slate-200 flex items-center gap-2"><span className="text-lg">{type.icon}</span> {type.label}</h4>
            <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">{Math.round(typeCals)} {t.kcal}</span>
          </div>
          {typeMeals.length === 0 ? (
            <div onClick={onAddClick} className="btn-glass w-full bg-slate-800/30 border border-slate-700/50 border-dashed rounded-xl p-4 flex justify-center items-center text-sm text-slate-500">
              <Plus size={16} className="mr-1"/> {t.addFood}
            </div>
          ) : (
            <div className="space-y-2">
              {typeMeals.map((meal: any) => (
                <div key={meal.id} className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl flex justify-between items-center border border-white/5 relative">
                  <div className="flex-1 pr-2">
                    <h4 className="font-medium text-slate-100 truncate">{meal.dish_name}</h4>
                    <div className="text-xs text-slate-400 mt-1 flex gap-2">
                      <span>Б: {Math.round(meal.total?.protein || 0)}</span>
                      <span>Ж: {Math.round(meal.total?.fat || 0)}</span>
                      <span>У: {Math.round(meal.total?.carbs || 0)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">{Math.round(meal.total?.calories || 0)}</div>
                      <div className="text-[10px] text-slate-500">{meal.time}</div>
                    </div>
                    <div onClick={() => deleteMeal(meal.id)} className="btn-glass p-2 text-slate-500 hover:text-red-400 bg-slate-700/30 rounded-lg">
                      <Trash2 size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>

  <div onClick={() => checkAccess('silver') && setIsVoiceModalOpen(true)} className="btn-glass fixed bottom-24 right-4 bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/50 z-50">
    <Mic size={24} />
  </div>

  {isVoiceModalOpen && (
    <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-800/95 w-full rounded-3xl p-6 border border-white/10 slide-in-from-bottom-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><Mic className="text-emerald-400"/> {t.recordVoice}</h3>
          <div onClick={() => setIsVoiceModalOpen(false)} className="btn-glass p-2 bg-slate-700/50 rounded-full text-slate-400"><X size={20}/></div>
        </div>
        <p className="text-sm text-slate-300 mb-4">{t.dictatePrompt}</p>
        {aiErrorMsg && <p className="text-red-400 text-xs mb-3 text-center bg-red-500/10 p-2 rounded-xl">{aiErrorMsg}</p>}
        <div className="flex gap-2 mb-4">
          <input type="text" value={voiceText} onChange={e => setVoiceText(String(e.target?.value || ''))} placeholder={t.dictatePlaceholder} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"/>
          <div onClick={handleVoiceSubmit} className={`btn-glass bg-emerald-500 text-slate-900 rounded-xl px-4 flex justify-center items-center ${isAnalyzingVoice || !voiceText ? 'opacity-50 pointer-events-none' : ''}`}>
            {isAnalyzingVoice ? <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : <Send size={20} />}
          </div>
        </div>
      </div>
    </div>
  )}

  {showAdviceModal && (
    <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900/95 w-full h-[85vh] rounded-t-3xl border-t border-white/10 flex flex-col slide-in-from-bottom-8">
        <div className="flex justify-between items-center p-5 border-b border-white/5">
          <div className="flex items-center gap-2 text-lg font-bold text-white"><Lightbulb className="text-amber-400" /> {t.aiDietitian}</div>
          <div onClick={() => setShowAdviceModal(false)} className="btn-glass p-2 text-slate-400 bg-slate-800 rounded-full"><X size={20}/></div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loadingAdvice ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-amber-400 animate-pulse font-medium">{t.aiCreating}</p>
            </div>
          ) : aiErrorMsg ? (
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-white mb-2">Ошибка нейросети</h3>
              <p className="text-slate-400 text-sm mb-6 break-words">{aiErrorMsg}</p>
              <div onClick={() => setShowAdviceModal(false)} className="btn-glass w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-xl">Закрыть</div>
            </div>
          ) : (
            <div className="space-y-4">
              {adviceData && Array.isArray(adviceData) && adviceData.map((advice: any, idx: number) => (
                <div key={idx} className="bg-slate-800/80 p-5 rounded-2xl border border-white/5 shadow-lg">
                  <h4 className="font-bold text-lg text-white mb-2">{advice?.title}</h4>
                  <p className="text-sm text-slate-400 mb-4">{advice?.description}</p>
                  <div className="flex justify-between bg-slate-900/80 rounded-xl p-3">
                    <div className="text-center"><span className="block text-emerald-400 font-bold">{advice?.calories}</span><span className="text-[10px] text-slate-500">ККАЛ</span></div>
                    <div className="text-center"><span className="block text-blue-400 font-bold">{advice?.protein}г</span><span className="text-[10px] text-slate-500">БЕЛКИ</span></div>
                    <div className="text-center"><span className="block text-amber-400 font-bold">{advice?.fat}г</span><span className="text-[10px] text-slate-500">ЖИРЫ</span></div>
                    <div className="text-center"><span className="block text-purple-400 font-bold">{advice?.carbs}г</span><span className="text-[10px] text-slate-500">УГЛЕВОДЫ</span></div>
                  </div>
                  <div onClick={() => { setShowAdviceModal(false); requestAddMeal({ dish_name: advice?.title, total: { calories: advice?.calories, protein: advice?.protein, fat: advice?.fat, carbs: advice?.carbs } }); }} className="btn-glass w-full mt-4 bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-center text-sm font-bold border border-emerald-500/30">
                    <Plus size={16} className="inline mr-1 mb-0.5"/> {t.addToDiary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>



);
});

const CameraScanner = React.memo(({ onSave, onCancel, subscription, scansToday, incrementScan, checkAccess }: any) => {
const { t, lang } = useContext(LanguageContext);
const 

$$status, setStatus$$

 = useState('idle');
const 

$$result, setResult$$

 = useState(null);
const 

$$imagePreview, setImagePreview$$

 = useState(null);
const 

$$errorDetails, setErrorDetails$$

 = useState('');

const handleFileChange = async (e: any) => {
if (subscription === 'silver' && scansToday >= 10) { checkAccess('gold'); return; }
const file = e.target.files

$$0$$

;
if (!file) return;
setImagePreview(URL.createObjectURL(file));
setStatus('scanning');
setErrorDetails('');
try {
const aiData = await analyzeImageWithGemini(file, false, lang);
if (!aiData || !aiData.dish_name) throw new Error("Не удалось распознать еду");
setResult(aiData);
setStatus('result');
if (subscription === 'silver') incrementScan('photo');
} catch (e: any) {
setErrorDetails(e.message || "Ошибка сервера");
setStatus('error');
}
};

return (

{t.aiScanner}

{status === 'idle' && (

{subscription === 'silver' && Доступно: {10 - scansToday}/10}

{t.takePhoto}

{t.fromGallery}

)}
{status === 'error' && (

{t.recognitionError}
{errorDetails}

)}
{(status === 'scanning' || status === 'result') && imagePreview && (

{status === 'scanning' && (

{t.aiThinking}

)}

{status === 'result' && result && (

{result.dish_name}

{Math.round(result.total?.calories || 0)}
{Math.round(result.total?.protein || 0)}г
{Math.round(result.total?.fat || 0)}г
{Math.round(result.total?.carbs || 0)}г

)}

)}

);
});

const FoodSearch = React.memo(({ customFoods, saveCustomRecipeToDB, recentFoods, setRecentFoods, onSave, checkAccess, subscription, barcodeScansToday, incrementScan }: any) => {
const { t, lang } = useContext(LanguageContext);
const 

$$activeSubTab, setActiveSubTab$$

 = useState('global');
const 

$$query, setQuery$$

 = useState('');
const 

$$weight, setWeight$$

 = useState(100);
const 

$$selectedItem, setSelectedItem$$

 = useState(null);
const 

$$isCreatingRecipe, setIsCreatingRecipe$$

 = useState(false);
const 

$$recipeName, setRecipeName$$

 = useState('');
const 

$$recipeIngredients, setRecipeIngredients$$

 = useState<any

>(

);
const 

$$recipeError, setRecipeError$$

 = useState('');
const 

$$isSearchingIngredient, setIsSearchingIngredient$$

 = useState(false);
const 

$$ingQuery, setIngQuery$$

 = useState('');
const 

$$ingSelected, setIngSelected$$

 = useState(null);
const 

$$ingWeight, setIngWeight$$

 = useState(100);
const 

$$isScanning, setIsScanning$$

 = useState(false);
const 

$$scanStatus, setScanStatus$$

 = useState('idle');

const safeQuery = String(query || '');
const safeIngQuery = String(ingQuery || '');

const displayList = useMemo(() => {
const list = activeSubTab === 'global' ? MOCK_CATALOG : customFoods;
if (safeQuery.trim() === '') return activeSubTab === 'global' ? (recentFoods.length > 0 ? recentFoods : MOCK_CATALOG.slice(0, 15)) : customFoods;
return list.filter((item: any) => String(item?.name || '').toLowerCase().includes(safeQuery.toLowerCase()));
}, 

$$safeQuery, activeSubTab, customFoods, recentFoods$$

);

const ingSearchResults = useMemo(() => {
if (safeIngQuery.trim() === '') return 

$$...MOCK_CATALOG, ...customFoods$$

.slice(0, 15);
return 

$$...MOCK_CATALOG, ...customFoods$$

.filter((item: any) => String(item?.name || '').toLowerCase().includes(safeIngQuery.toLowerCase()));
}, 

$$safeIngQuery, customFoods$$

);

useEffect(() => { setQuery(''); }, 

$$activeSubTab$$

);

const handleSelect = (item: any) => { setSelectedItem(item); setWeight(100); };

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
if (setRecentFoods) setRecentFoods((prev: any) => 

$${ ...selectedItem, id: selectedItem.id \vert{}\vert{} Date.now() }, ...prev.filter((i: any) => i.id !== selectedItem.id)$$

.slice(0, 15));
setSelectedItem(null);
setQuery('');
};

const addIngredientToRecipe = () => {
if(!ingSelected) return;
const nw = Number(ingWeight) || 0, factor = nw / 100;
setRecipeIngredients(

$$...recipeIngredients, { ...ingSelected, weight: nw, cals: ingSelected.calories_100g \* factor, prot: ingSelected.protein_100g \* factor, fat: ingSelected.fats_100g \* factor, carbs: ingSelected.carbs_100g \* factor }$$

);
setIngSelected(null);
setIsSearchingIngredient(false);
setIngQuery('');
setRecipeError('');
};

const removeIngredient = (index: number) => setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
const totalRecipeWeight = recipeIngredients.reduce((s, i) => s + (Number(i.weight) || 0), 0);

const saveCustomRecipe = () => {
if(!recipeName || recipeIngredients.length === 0) { setRecipeError(t.tryAgain); return; }
const factor = totalRecipeWeight > 0 ? 100 / totalRecipeWeight : 0;
const recipeItem = {
id: custom-${Date.now()},
name: String(recipeName),
calories_100g: Math.round(recipeIngredients.reduce((s, i) => s + i.cals, 0) * factor),
protein_100g: Number((recipeIngredients.reduce((s, i) => s + i.prot, 0) * factor).toFixed(1)),
fats_100g: Number((recipeIngredients.reduce((s, i) => s + i.fat, 0) * factor).toFixed(1)),
carbs_100g: Number((recipeIngredients.reduce((s, i) => s + i.carbs, 0) * factor).toFixed(1))
};
saveCustomRecipeToDB(recipeItem);
setIsCreatingRecipe(false);
setRecipeName('');
setRecipeIngredients(

);
setRecipeError('');
setActiveSubTab('custom');
};

const handleBarcodeFile = async (e: any) => {
if (subscription === 'bronze' && barcodeScansToday >= 7) { checkAccess('silver'); return; }
const file = e.target.files

$$0$$

;
if (!file) return;
setIsScanning(true);
setScanStatus('loading');
try {
const aiData = await analyzeImageWithGemini(file, true, lang);
setScanStatus('idle');
setIsScanning(false);
if (subscription === 'bronze') incrementScan('barcode');
handleSelect({
id: Date.now(),
name: String(aiData?.name || "Product"),
calories_100g: aiData?.calories_100g || 0,
protein_100g: aiData?.protein_100g || 0,
fats_100g: aiData?.fats_100g || 0,
carbs_100g: aiData?.carbs_100g || 0
});
} catch (e: any) {
setScanStatus('error');
setIsScanning(false);
}
};

if (isSearchingIngredient) {
if (ingSelected) {
return (

<input type="number" value={ingWeight} onChange={e => setIngWeight(Number(e.target.value))} className="bg-slate-800/80 border border-white/10 rounded-xl py-3 px-4 text-center text-3xl font-bold w-32 text-white outline-none" />
{t.g}

{t.addIngredient}

);
}
return (

<input type="text" placeholder={t.searchPlaceholder} value={safeIngQuery} onChange={e => setIngQuery(String(e.target?.value || ''))} className="w-full bg-slate-800/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none"/>

{ingSearchResults.map((item: any, idx: number) => (

{item.name}
Б: {item.protein_100g}Ж: {item.fats_100g}У: {item.carbs_100g}

{item.calories_100g} {t.kcal}

))}

);
}

if (isCreatingRecipe) {
const isReadyToSave = recipeName && recipeIngredients.length > 0;
return (

<input type="text" placeholder={t.recipeName} value={recipeName} onChange={e => setRecipeName(String(e.target?.value || ''))} className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"/>

{recipeError && {recipeError}}

{recipeIngredients.map((ing: any, idx: number) => (

{ing.name}{ing.weight}г

))}

{recipeIngredients.length > 0 && (

{t.kbju100g}

{Math.round(recipeIngredients.reduce((s,i)=>s+i.cals,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))}
{((recipeIngredients.reduce((s,i)=>s+i.prot,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))).toFixed(1)}
{((recipeIngredients.reduce((s,i)=>s+i.fat,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))).toFixed(1)}
{((recipeIngredients.reduce((s,i)=>s+i.carbs,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))).toFixed(1)}

)}

);
}

return (

{!selectedItem ? (
<>

<input type="text" placeholder={t.searchPlaceholder} value={safeQuery} onChange={e => setQuery(String(e.target?.value || ''))} className="w-full bg-slate-800/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none"/>

{activeSubTab === 'global' && (
<label
onClick={(e) => { if (subscription === 'bronze' && barcodeScansToday >= 7) { e.preventDefault(); checkAccess('silver'); } }}
className={btn-glass bg-slate-800/80 border border-white/5 rounded-xl px-4 flex justify-center items-center ${isScanning ? 'opacity-50 pointer-events-none' : 'text-slate-400'}}

{isScanning ?  : }

)}

{activeSubTab === 'global' && subscription === 'bronze' && {t.bronzeF2}: {barcodeScansToday}/7}

      {scanStatus === 'error' && <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 mb-4 text-red-400 text-sm"><AlertCircle size={18} className="shrink-0 mt-0.5" /> <p>{t.recognitionError}</p></div>}

      <div className="flex-1 overflow-y-auto pb-10 space-y-2">
        {activeSubTab === 'custom' && safeQuery.trim() === '' && <div onClick={() => setIsCreatingRecipe(true)} className="btn-glass w-full bg-slate-800 border border-emerald-500/30 text-emerald-400 py-4 rounded-xl flex justify-center items-center gap-2 mb-4 font-semibold"><Plus size={20}/> {t.constructor}</div>}
        {safeQuery.trim() === '' && activeSubTab === 'global' && recentFoods.length > 0 && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-3 mt-1 px-1"><History size={14} /> {t.recentAdded}</h3>}
        {displayList.length > 0 ? displayList.map((item: any, idx: number) => (
          <div key={`${item.id || idx}-${idx}`} onClick={() => handleSelect(item)} className="btn-glass bg-slate-800/80 p-4 rounded-xl flex justify-between items-center border border-white/5 mb-2">
            <div className="pr-2"><h4 className="font-medium text-slate-100 truncate">{item.name}</h4><div className="text-xs text-slate-400 mt-1 flex gap-2"><span>Б: {item.protein_100g}</span><span>Ж: {item.fats_100g}</span><span>У: {item.carbs_100g}</span></div></div>
            <div className="flex items-center gap-3"><div className="font-bold text-emerald-400 whitespace-nowrap">{item.calories_100g}</div><div className="bg-slate-700/50 text-emerald-400 p-2 rounded-lg pointer-events-none"><Plus size={20}/></div></div>
          </div>
        )) : <div className="text-center text-slate-500 py-8">{t.notFound}</div>}
      </div>
    </>
  ) : (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10 animate-in slide-in-from-right">
      <div className="flex items-center gap-3 mb-6"><div onClick={() => setSelectedItem(null)} className="btn-glass p-1 text-slate-400 bg-slate-700/50 rounded-full"><ChevronLeft size={24} /></div><h3 className="font-bold text-lg text-white truncate">{selectedItem.name}</h3></div>
      <div className="flex items-center justify-center gap-4 mb-8"><input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} className="bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-center text-3xl font-bold w-32 focus:border-emerald-500 outline-none text-white" /><span className="text-xl text-slate-400 font-medium">{t.weightInfo}</span></div>
      <div onClick={handleSaveToDiary} className="btn-glass w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl text-lg text-center shadow-[0_5px_20px_rgba(16,185,129,0.4)]">{t.addToDiary}</div>
    </div>
  )}
</div>



);
});

const WeightTracker = React.memo(({ history, onAdd }: any) => {
const { t } = useContext(LanguageContext);
const 

$$inputWeight, setInputWeight$$

 = useState('');
const handleSubmit = (e: any) => { e.preventDefault(); const val = parseFloat(String(inputWeight).replace(',', '.')); if (!isNaN(val) && val > 0) { onAdd(val); setInputWeight(''); } };

const chartData = 

$$...history$$

.reverse();
const maxW = chartData.length > 0 ? Math.max(...chartData.map((h: any) => h.weight)) + 1 : 100;
const minW = chartData.length > 0 ? Math.max(0, Math.min(...chartData.map((h: any) => h.weight)) - 1) : 0;
const range = maxW - minW || 1;
const points = chartData.map((d: any, i: number) => ${(i / Math.max(chartData.length - 1, 1)) * 300},${100 - ((d.weight - minW) / range) * 100}).join(' ');

return (

{t.weightTitle}

<input type="text" inputMode="decimal" value={inputWeight} onChange={e => setInputWeight(String(e.target?.value || ''))} placeholder={t.weightPlaceholder} className="flex-1 bg-slate-900/80 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-center"/>
{t.add}

{t.chart}
{history.length > 1 ? (

{chartData.map((d: any, i: number) => <circle key={i} cx={(i / Math.max(chartData.length - 1, 1)) * 300} cy={100 - ((d.weight - minW) / range) * 100} r="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />)}

) : (

{t.needMoreData}

)}

{t.history}

{history.map((record: any, index: number) => {
const prevRecord = history

$$index + 1$$

;
const diff = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : 0;
return (

{record.date}

{prevRecord ? (
<span className={flex items-center text-xs font-semibold ${diff < 0 ? 'text-emerald-400' : diff > 0 ? 'text-red-400' : 'text-slate-500'}}>
{diff < 0 ?  : diff > 0 ?  : } {Math.abs(diff as any)}

) : {t.start}}
{record.weight}

);
})}

);
});

const UserProfile = React.memo(({ currentSub, setSubscription }: any) => {
const { t, lang, setLang } = useContext(LanguageContext);
const 

$$purchaseStatus, setPurchaseStatus$$

 = useState('idle');
const 

$$expandedTier, setExpandedTier$$

 = useState(null);
const 

$$purchasingTier, setPurchasingTier$$

 = useState(null);

const handlePurchase = (level: string) => {
setPurchasingTier(level);
setPurchaseStatus('loading');
setTimeout(() => {
setPurchaseStatus('confetti');
setTimeout(() => {
setPurchaseStatus('success');
setSubscription(level);
setTimeout(() => { setPurchaseStatus('idle'); setPurchasingTier(null); }, 3500);
}, 500);
}, 1000);
};

return (

@telegram_user
{t.inSystemSince}

  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-lg">
    <div className="flex items-center gap-2 text-white font-medium"><Globe size={20} className="text-blue-400"/> {t.language}</div>
    <select value={lang} onChange={e => setLang(String(e.target.value))} className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none font-medium">
      <option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option>
    </select>
  </div>

  <h3 className="font-bold text-lg px-1 mt-8 mb-4">{t.subsLevels}</h3>
  <div className="space-y-4">
    {/* Bronze */}
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-[2px] rounded-2xl">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full transition-all">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg text-[#cd7f32] flex items-center gap-2"><Shield size={20} /> Bronze</h4>
          <span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">{currentSub === 'bronze' ? t.current : t.free}</span>
        </div>
        
        <div 
          onClick={() => setExpandedTier(expandedTier === 'bronze' ? null : 'bronze')} 
          className="btn-glass flex items-center justify-between w-full py-3 mt-2 text-slate-300 font-medium bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-xl px-4 border border-white/5"
        >
          <span className="text-sm">{expandedTier === 'bronze' ? t.hideDetails : t.allFeatures}</span>
          <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'bronze' ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`} size={20}/>
        </div>
        
        {expandedTier === 'bronze' && (
          <ul className="text-sm text-slate-300 space-y-3 mt-4 animate-in slide-in-from-top-2 fade-in bg-slate-800/30 p-4 rounded-xl border border-white/5">
            {[
              { text: "Базовый каталог продуктов питания и поиск", included: true },
              { text: "Сканер штрихкодов продуктов (до 7 раз в день)", included: true },
              { text: "Учет выпитой воды, веса и КБЖУ", included: true },
              { text: "Конструктор собственных рецептов", included: true },
              { text: "AI-сканирование блюд по фото", included: false },
              { text: "Голосовой ввод съеденного", included: false },
              { text: "Умный ИИ-диетолог", included: false }
            ].map((feat, i) => (
              <li key={i} className={`flex items-start gap-3 ${!feat.included ? 'opacity-50' : ''}`}>
                {feat.included ? <Check size={18} className="text-emerald-500 mt-0.5 shrink-0"/> : <Minus size={18} className="text-slate-500 mt-0.5 shrink-0"/>}
                <span className="leading-snug">{feat.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* Silver */}
    <div className="bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500 p-[2px] rounded-2xl shadow-lg">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden transition-all">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg text-slate-300 flex items-center gap-2"><Zap size={20} /> Silver</h4>
          <span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">199 ₽ / мес</span>
        </div>
        
        <div 
          onClick={() => setExpandedTier(expandedTier === 'silver' ? null : 'silver')} 
          className="btn-glass flex items-center justify-between w-full py-3 mt-2 text-slate-300 font-medium bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-xl px-4 border border-white/5"
        >
          <span className="text-sm">{expandedTier === 'silver' ? t.hideDetails : t.allFeatures}</span>
          <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'silver' ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} size={20}/>
        </div>
        
        {expandedTier === 'silver' && (
          <ul className="text-sm text-slate-300 space-y-3 mt-4 animate-in slide-in-from-top-2 fade-in bg-slate-800/30 p-4 rounded-xl border border-white/5">
            {[
              { text: "Всё, что входит в тариф Bronze", included: true },
              { text: "AI-сканирование еды по фото (до 10 раз в день)", included: true },
              { text: "Безлимитный сканер штрихкодов", included: true },
              { text: "Голосовой ввод съеденного", included: true },
              { text: "Умный ИИ-диетолог", included: false },
              { text: "Безлимитное AI-сканирование", included: false }
            ].map((feat, i) => (
              <li key={i} className={`flex items-start gap-3 ${!feat.included ? 'opacity-50' : ''}`}>
                {feat.included ? <Check size={18} className="text-blue-400 mt-0.5 shrink-0"/> : <Minus size={18} className="text-slate-500 mt-0.5 shrink-0"/>}
                <span className="leading-snug">{feat.text}</span>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6">
          {currentSub !== 'silver' && currentSub !== 'gold' ? (
            <div onClick={() => handlePurchase('silver')} className="btn-glass w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl text-center">{t.buySilver}</div>
          ) : (
            currentSub === 'silver' && <div className="w-full text-center text-slate-400 font-bold py-3 bg-slate-800 rounded-xl">{t.yourTier}</div>
          )}
        </div>
      </div>
    </div>

    {/* Gold */}
    <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 p-[2px] rounded-2xl shadow-xl shadow-amber-500/20">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden transition-all">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg text-amber-400 flex items-center gap-2"><Crown size={20} /> Gold</h4>
          <span className="text-sm font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg">499 ₽ / мес</span>
        </div>
        
        <div 
          onClick={() => setExpandedTier(expandedTier === 'gold' ? null : 'gold')} 
          className="btn-glass flex items-center justify-between w-full py-3 mt-2 text-slate-300 font-medium bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-xl px-4 border border-white/5"
        >
          <span className="text-sm">{expandedTier === 'gold' ? t.hideDetails : t.allFeatures}</span>
          <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'gold' ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} size={20}/>
        </div>
        
        {expandedTier === 'gold' && (
          <ul className="text-sm text-slate-300 space-y-3 mt-4 relative z-10 animate-in slide-in-from-top-2 fade-in bg-slate-800/30 p-4 rounded-xl border border-white/5">
            {[
              { text: "Всё, что входит в тарифы Bronze и Silver", included: true },
              { text: "Безлимитное AI-сканирование еды по фото", included: true },
              { text: "ИИ-диетолог: персональный подбор блюд", included: true },
              { text: "Высокая скорость обработки нейросетью", included: true },
              { text: "Эксклюзивные GOLD анимации", included: true }
            ].map((feat, i) => (
              <li key={i} className={`flex items-start gap-3 text-white`}>
                <Check size={18} className="text-amber-400 mt-0.5 shrink-0"/>
                <span className="leading-snug">{feat.text}</span>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6">
          {currentSub !== 'gold' ? (
            <div onClick={() => handlePurchase('gold')} className="btn-glass w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.4)] text-center">{t.buyGold}</div>
          ) : (
            <div className="w-full text-center text-amber-400 font-bold py-4 bg-amber-500/10 rounded-xl border border-amber-500/30">{t.proActive}</div>
          )}
        </div>
      </div>
    </div>
  </div>

  {(purchaseStatus === 'confetti' || purchaseStatus === 'success') && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden">
      {purchasingTier === 'silver' ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <LightningStorm />
          <div className="flex flex-col items-center justify-center relative z-[160]" style={{ animation: 'zapIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
            <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-blue-300 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(59,130,246,0.8)] rotate-12">
              <Zap size={64} className="text-slate-900 -rotate-12" />
            </div>
            <h2 className="text-4xl font-black mb-2 text-center uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-blue-200">{t.silverUnlocked}</h2>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <GoldBurstAnimation />
        </div>
      )}
    </div>
  )}
  {purchaseStatus === 'loading' && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
    </div>
  )}
</div>



);
});

const OnboardingScreen = React.memo(({ onComplete }: any) => {
const { t } = useContext(LanguageContext);
const 

$$formData, setFormData$$

 = useState({ gender: 'Мужской', age: '', height: '', weight: '', goal: 'lose', activity: 'med' });
const 

$$errorMsg, setErrorMsg$$

 = useState('');

const handleCalculate = () => {
if (!formData.age || !formData.height || !formData.weight) { setErrorMsg("Заполните все поля!"); return; }
setErrorMsg('');
onComplete(calculateLocalMacros(formData, formData.weight), formData);
};

const genderOptions = 

$${ id: 'Мужской', label: t.male }, { id: 'Женский', label: t.female }$$

;
const activityOptions = [
{ id: 'min', label: t.activities.min },
{ id: 'low', label: t.activities.low },
{ id: 'med', label: t.activities.med },
{ id: 'high', label: t.activities.high },
{ id: 'ext', label: t.activities.ext }
];
const goalOptions = [
{ id: 'lose', label: t.goals.lose },
{ id: 'keep', label: t.goals.keep },
{ id: 'gain', label: t.goals.gain }
];

return (
