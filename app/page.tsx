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
let appId: any = 'default-app-id';

try {
  if (typeof window !== 'undefined') {
    const rawCfg = (window as any).__firebase_config;
    const firebaseConfig = typeof rawCfg !== 'undefined' 
      ? JSON.parse(rawCfg) 
      : { apiKey: "AIzaSyDummyKeyForBuild", projectId: "dummy" };
    
    if (firebaseConfig.projectId !== "dummy") {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }
    if (typeof (window as any).__app_id !== 'undefined') appId = (window as any).__app_id;
  }
} catch (e: any) { 
  console.warn("Firebase init note (running local-storage mode):", e); 
}

const apiKey = ""; 

const translations: any = {
  ru: {
    dashboard: "Сводка", searchTab: "Поиск", weightTab: "Вес", profileTab: "Профиль", calsLeft: "Осталось калорий", eatenToday: "Съедено за день", from: "из", kcal: "ккал", aiDietitian: "ИИ-диетолог: Что съесть?", proteins: "Белки", fats: "Жиры", carbs: "Углеводы", g: "г", waterConsumed: "Выпито воды", ml: "мл", addFood: "Добавить еду", breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин", snack: "Перекус", recordVoice: "Голосовой ввод", dictatePrompt: "Нажмите на микрофон и скажите, что вы съели, или напишите текст.", dictatePlaceholder: "Напр: 200г куриной грудки и 150г гречки", aiThinking: "Нейросеть анализирует...", aiCreating: "Создаем рецепты...", whereToSave: "Куда записать блюдо?", date: "Дата", cancel: "Отмена", base: "База", myRecipes: "Мои рецепты", searchPlaceholder: "Поиск продуктов...", recentAdded: "Недавно добавленные", notFound: "Ничего не найдено", ingredient: "Ингредиент", constructor: "Конструктор", recipeName: "Название блюда", addIngredient: "Добавить ингредиент", saveRecipe: "Сохранить рецепт", kbju100g: "КБЖУ (на 100 грамм)", addToDiary: "Добавить в дневник", weightInfo: "грамм", aiScanner: "AI Сканер еды", takePhoto: "Сделать фото", fromGallery: "Из галереи", recognitionError: "Ошибка распознавания", tryAgain: "Попробовать еще раз", recognized: "Распознанные продукты", weightTitle: "Записать вес (кг)", weightPlaceholder: "Напр. 75.5", add: "Добавить", chart: "График", needMoreData: "Нужен еще один замер", history: "История замеров", start: "Начало", inSystemSince: "Пользователь базы", subsLevels: "Уровни подписки", current: "Текущий", free: "Бесплатно", allFeatures: "Все возможности", hideDetails: "Скрыть подробности", bronzeF1: "Базовый поиск еды", bronzeF2: "скан. штрихкодов", bronzeF3: "ИИ сканер недоступен", silverF1: "Всё, что входит в Bronze", silverF2: "ИИ-фото в день", silverF3: "Безлимитный сканер штрихкодов", goldF1: "Полный доступ ко всем функциям", goldF2: "Безлимитное ИИ-сканирование", goldF3: "Советы ИИ-диетолога", buySilver: "Перейти на Silver", buyGold: "Купить Gold доступ", yourTier: "Ваш текущий тариф", proActive: "Активный PRO-доступ", continue: "Продолжить", makingPlan: "Создаем план...", accountSetup: "Настроим NutriBot", activityLabel: "Активность", goalLabel: "Ваша цель", startUsing: "Начать использование", language: "Язык", loadingData: "Загрузка...", reqSub: "Требуется подписка", reqSubDesc: "Эта функция недоступна на вашем текущем тарифе. Перейдите в профиль, чтобы снять ограничения.", toProfile: "В профиль", silverUnlocked: "SILVER РАЗБЛОКИРОВАН", goldUnlocked: "GOLD СТАТУС", male: "Мужской", female: "Женский", age: "Возраст", height: "Рост (см)", weight: "Вес (кг)", listening: "Слушаю... Говорите", tapToSpeak: "Нажмите для голосового ввода", micBlocked: "Доступ к микрофону ограничен. Введите блюдо текстом ниже.",
    resetTitle: "Начать сначала", resetDesc: "Удалить всю историю, замеры веса и приёмы пищи?", resetConfirmBtn: "Да, удалить всё", resetSuccess: "Данные очищены",
    activities: { min: "Минимальная", low: "Слабая", med: "Средняя", high: "Высокая", ext: "Экстремальная" }, goals: { lose: "Похудение", keep: "Поддержание веса", gain: "Набор массы" }
  },
  en: {
    dashboard: "Dashboard", searchTab: "Search", weightTab: "Weight", profileTab: "Profile", calsLeft: "Calories left", eatenToday: "Eaten today", from: "of", kcal: "kcal", aiDietitian: "AI Dietitian: What to eat?", proteins: "Protein", fats: "Fats", carbs: "Carbs", g: "g", waterConsumed: "Water consumed", ml: "ml", addFood: "Add food", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", recordVoice: "Voice Input", dictatePrompt: "Tap the mic and speak what you ate, or type below.", dictatePlaceholder: "e.g., 200g chicken breast and 150g rice", aiThinking: "AI is analyzing...", aiCreating: "Creating recipes...", whereToSave: "Where to save this meal?", date: "Date", cancel: "Cancel", base: "Database", myRecipes: "My Recipes", searchPlaceholder: "Search food...", recentAdded: "Recently added", notFound: "Nothing found", ingredient: "Ingredient", constructor: "Constructor", recipeName: "Recipe name", addIngredient: "Add ingredient", saveRecipe: "Save recipe", kbju100g: "Macros (per 100g)", addToDiary: "Add to diary", weightInfo: "grams", aiScanner: "AI Food Scanner", takePhoto: "Take a photo", fromGallery: "From gallery", recognitionError: "Recognition error", tryAgain: "Try again", recognized: "Recognized products", weightTitle: "Log weight (kg)", weightPlaceholder: "e.g. 75.5", add: "Add", chart: "Chart", needMoreData: "Need one more log", history: "Weight history", start: "Start", inSystemSince: "Cloud Member", subsLevels: "Subscription Tiers", current: "Current", free: "Free", allFeatures: "All features", hideDetails: "Hide details", bronzeF1: "Basic food search", bronzeF2: "barcode scans", bronzeF3: "AI scanner unavailable", silverF1: "Everything in Bronze", silverF2: "AI photo scans per day", silverF3: "Unlimited barcode scanner", goldF1: "Full access to all features", goldF2: "Unlimited AI food scanning", goldF3: "Smart AI Dietitian tips", buySilver: "Upgrade to Silver", buyGold: "Get Gold Access", yourTier: "Your current tier", proActive: "PRO Access Active", continue: "Continue", makingPlan: "Creating plan...", accountSetup: "Setup NutriBot", activityLabel: "Activity", goalLabel: "Your goal", startUsing: "Start using", language: "Language", loadingData: "Loading...", reqSub: "Subscription Required", reqSubDesc: "This feature is not available on your current plan. Upgrade in profile to unlock.", toProfile: "To Profile", silverUnlocked: "SILVER UNLOCKED", goldUnlocked: "GOLD STATUS", male: "Male", female: "Female", age: "Age", height: "Height (cm)", weight: "Weight (kg)", listening: "Listening... Speak now", tapToSpeak: "Tap to record voice", micBlocked: "Microphone permission denied. Please type below.",
    resetTitle: "Start from scratch", resetDesc: "Delete all user history, weight logs, and meals?", resetConfirmBtn: "Yes, wipe everything", resetSuccess: "Data cleared",
    activities: { min: "Minimal", low: "Light", med: "Moderate", high: "High", ext: "Extreme" }, goals: { lose: "Weight loss", keep: "Maintain weight", gain: "Muscle gain" }
  }
};

const LanguageContext = createContext<any>(null);

const globalStyles = `
  .btn-glass { transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s ease, background-color 0.1s ease; cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; transform: translateZ(0); }
  .btn-glass:active { transform: scale(0.96) translateZ(0); opacity: 0.75; }
  @keyframes zapIn { 0% { transform: scale(0.1) rotate(-15deg); opacity: 0; filter: brightness(2); } 60% { transform: scale(1.15) rotate(5deg); opacity: 1; filter: brightness(1.5); } 100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); } }
  @keyframes floatUp { 0% { transform: translateY(120px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
  @keyframes particle-explode { 0% { transform: translate(0, 0) scale(0); opacity: 1; } 20% { transform: translate(calc(var(--tx) * 0.25), calc(var(--ty) * 0.25)) scale(1.2); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
  @keyframes pulseWave { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
  @keyframes silverPulseWave { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.8); } 70% { transform: scale(1.08); box-shadow: 0 0 0 24px rgba(56, 189, 248, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); } }
  @keyframes lightningFlash { 0%, 100% { opacity: 0.1; } 12%, 35%, 55% { opacity: 0.85; } 22%, 45% { opacity: 0.15; } }
  @keyframes boltFlicker { 0%, 100% { opacity: 0.3; transform: scaleY(0.96); } 15%, 45%, 75% { opacity: 1; transform: scaleY(1); } 30%, 60% { opacity: 0.15; } }
  
  /* Dynamic Gold FX Animations */
  @keyframes goldRayRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes goldShockwave {
    0% { transform: scale(0.4); opacity: 1; border-width: 6px; }
    50% { opacity: 0.85; }
    100% { transform: scale(2.8); opacity: 0; border-width: 1px; }
  }
  @keyframes goldCrownBounce {
    0% { transform: scale(0.1) translateY(80px) rotate(-15deg); opacity: 0; filter: drop-shadow(0 0 50px #f59e0b) brightness(2.5); }
    55% { transform: scale(1.22) translateY(-15px) rotate(6deg); opacity: 1; filter: drop-shadow(0 0 70px #fde047) brightness(1.6); }
    75% { transform: scale(0.95) translateY(5px) rotate(-3deg); }
    100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 45px #f59e0b) brightness(1.2); }
  }
  @keyframes goldTextShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes floatSparkle {
    0% { transform: translateY(20px) scale(0.5); opacity: 0; }
    25% { opacity: 1; }
    80% { opacity: 0.9; }
    100% { transform: translateY(-130px) scale(1.2); opacity: 0; }
  }
  @keyframes goldAuraPulse {
    0%, 100% { transform: scale(0.85); opacity: 0.55; }
    50% { transform: scale(1.18); opacity: 0.95; }
  }
`;

const langMap: any = { ru: "Русский", en: "English" };

const LightningStorm = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[150]">
    {/* Atmospheric strobe light */}
    <div 
      className="absolute inset-0 bg-sky-500/20 pointer-events-none" 
      style={{ animation: 'lightningFlash 1.2s infinite ease-in-out' }}
    />
    
    {/* SVG Electric Lightning Bolts */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 800" preserveAspectRatio="none">
      <path 
        d="M200 0 L165 240 L235 260 L155 510 L220 530 L180 800" 
        stroke="#38bdf8" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
        style={{ 
          filter: 'drop-shadow(0 0 25px #0284c7) drop-shadow(0 0 10px #ffffff)',
          animation: 'boltFlicker 1.1s infinite ease-in-out' 
        }} 
      />
      <path 
        d="M200 0 L165 240 L235 260 L155 510 L220 530 L180 800" 
        stroke="#ffffff" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
        style={{ animation: 'boltFlicker 1.1s infinite ease-in-out' }} 
      />
      <path 
        d="M165 240 L105 380 L140 390 L85 570" 
        stroke="#93c5fd" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
        style={{ 
          filter: 'drop-shadow(0 0 18px #38bdf8)',
          animation: 'boltFlicker 1.5s infinite 0.25s ease-in-out' 
        }} 
      />
      <path 
        d="M235 260 L295 400 L260 415 L320 600" 
        stroke="#93c5fd" 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
        style={{ 
          filter: 'drop-shadow(0 0 18px #38bdf8)',
          animation: 'boltFlicker 1.7s infinite 0.45s ease-in-out' 
        }} 
      />
    </svg>
  </div>
);

const GoldBurstAnimation = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[160] flex flex-col items-center justify-center">
    {/* Atmospheric Golden Nebula */}
    <div 
      className="absolute w-[360px] h-[360px] bg-gradient-to-r from-amber-500/50 via-yellow-400/60 to-orange-500/50 blur-[85px] rounded-full"
      style={{ animation: 'goldAuraPulse 2.8s ease-in-out infinite' }}
    />

    {/* Rotating Majestic Sunburst Rays */}
    <div 
      className="absolute w-[680px] h-[680px] pointer-events-none opacity-35" 
      style={{ animation: 'goldRayRotate 24s linear infinite' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="goldRayGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(16)].map((_, i) => (
          <path
            key={`ray-${i}`}
            d={`M 50 50 L ${50 + 50 * Math.cos((i * 22.5 * Math.PI) / 180)} ${50 + 50 * Math.sin((i * 22.5 * Math.PI) / 180)} A 50 50 0 0 1 ${50 + 50 * Math.cos(((i * 22.5 + 11.25) * Math.PI) / 180)} ${50 + 50 * Math.sin(((i * 22.5 + 11.25) * Math.PI) / 180)} Z`}
            fill="url(#goldRayGrad)"
          />
        ))}
      </svg>
    </div>

    {/* Triple Golden Shockwave Rings */}
    <div className="absolute w-56 h-56 rounded-full border border-amber-400/90 shadow-[0_0_35px_#f59e0b]" style={{ animation: 'goldShockwave 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite' }} />
    <div className="absolute w-56 h-56 rounded-full border border-yellow-300/80 shadow-[0_0_30px_#fde047]" style={{ animation: 'goldShockwave 2s cubic-bezier(0.1, 0.8, 0.3, 1) 0.65s infinite' }} />
    <div className="absolute w-56 h-56 rounded-full border border-orange-400/60 shadow-[0_0_25px_#ea580c]" style={{ animation: 'goldShockwave 2s cubic-bezier(0.1, 0.8, 0.3, 1) 1.3s infinite' }} />

    {/* Floating Rising Luxury Glyphs */}
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {[
        { icon: '✨', left: '18%', delay: '0.2s', dur: '2.4s' },
        { icon: '👑', left: '80%', delay: '0.5s', dur: '2.8s' },
        { icon: '⭐', left: '30%', delay: '1.0s', dur: '2.2s' },
        { icon: '✦', left: '70%', delay: '0.3s', dur: '2.6s' },
        { icon: '💎', left: '14%', delay: '1.3s', dur: '3.0s' },
        { icon: '✨', left: '86%', delay: '1.6s', dur: '2.3s' },
        { icon: '⭐', left: '50%', delay: '0.8s', dur: '2.7s' },
      ].map((item, idx) => (
        <div
          key={`flt-${idx}`}
          className="absolute bottom-1/4 text-2xl select-none filter drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]"
          style={{
            left: item.left,
            animation: `floatSparkle ${item.dur} ease-out ${item.delay} infinite`
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>

    {/* Explosive Sparkling Golden Particles & Diamonds */}
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {[...Array(60)].map((_, i) => {
        const angle = (i * 360) / 60 + (Math.random() * 8 - 4);
        const distance = 95 + Math.random() * 320;
        const tx = `${Math.cos((angle * Math.PI) / 180) * distance}px`;
        const ty = `${Math.sin((angle * Math.PI) / 180) * distance}px`;
        const size = 3 + Math.random() * 7;
        const isDiamond = i % 3 === 0;
        const colors = ['#fef08a', '#fde047', '#f59e0b', '#ffffff', '#fbbf24'];
        const color = colors[i % colors.length];
        return (
          <div 
            key={`gp-${i}`} 
            className={`absolute ${isDiamond ? 'rotate-45 rounded-sm' : 'rounded-full'}`}
            style={{
              width: size, 
              height: size,
              backgroundColor: color,
              left: '50%', 
              top: '50%',
              '--tx': tx, 
              '--ty': ty,
              animation: `particle-explode ${0.85 + Math.random() * 1.3}s ease-out infinite`,
              animationDelay: `${Math.random() * 0.6}s`,
              boxShadow: `0 0 16px 3px ${color}`
            }}
          />
        );
      })}
    </div>

    {/* Central Dynamic Hero Badge */}
    <div 
      className="relative z-30 flex flex-col items-center justify-center px-4" 
      style={{ animation: 'goldCrownBounce 0.9s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards' }}
    >
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute w-28 h-28 bg-yellow-400/40 rounded-full blur-2xl animate-pulse" />
        <Crown 
          size={98} 
          className="text-[#fde047] relative z-10 filter drop-shadow-[0_0_35px_rgba(253,224,71,1)]" 
          fill="#fde047" 
          stroke="#b45309" 
          strokeWidth="1.5" 
        />
        <span className="absolute -top-1 -right-3 text-2xl animate-spin" style={{ animationDuration: '6s' }}>✦</span>
        <span className="absolute -bottom-1 -left-4 text-xl animate-bounce" style={{ animationDuration: '2s' }}>✨</span>
      </div>

      <span 
        className="font-black text-7xl tracking-widest uppercase bg-gradient-to-r from-amber-200 via-yellow-100 via-amber-300 to-yellow-500 bg-[length:200%_auto] bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(245,158,11,0.9)]"
        style={{ animation: 'goldTextShimmer 2.8s linear infinite' }}
      >
        GOLD
      </span>

      <div className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-500/25 border border-amber-300/60 shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-md">
        <Crown size={14} className="text-yellow-300 fill-yellow-300" />
        <span className="text-amber-100 font-extrabold text-xs tracking-wider uppercase drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
          VIP PRO СТАТУС АКТИВЕН
        </span>
        <Crown size={14} className="text-yellow-300 fill-yellow-300" />
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-amber-200/90 font-medium">
        <span className="flex items-center gap-1">⚡ Безлимит ИИ</span>
        <span>•</span>
        <span className="flex items-center gap-1">👑 ИИ-диетолог</span>
        <span>•</span>
        <span className="flex items-center gap-1">🚀 Турбо</span>
      </div>

      <span className="text-[11px] text-amber-200/50 uppercase tracking-widest mt-6">
        Нажмите в любое место, чтобы продолжить
      </span>
    </div>
  </div>
);

async function fetchGeminiWithRetry(prompt: string, schema: any, base64Image: any = null, mimeType: any = null) {
  const parts: any[] = [{ text: prompt }];
  if (base64Image) { parts.push({ inlineData: { mimeType: mimeType, data: base64Image } }); }
  const payload = { contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } };

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        if (apiKey) {
          const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
          const directRes = await fetch(directUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!directRes.ok) throw new Error('Direct API HTTP error');
          const dData = await directRes.json();
          return JSON.parse(dData.candidates[0].content.parts[0].text);
        }
        throw new Error('Server API error');
      }
      const result = await response.json();
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (error: any) { 
      retries--; 
      if (retries === 0) throw error; 
      await new Promise(r => setTimeout(r, 1000)); 
    }
  }
}

async function analyzeImageWithGemini(file: any, isBarcode: boolean, lang: string) {
  const base64Image: any = await new Promise((resolve, reject) => {
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
  const prompt = isBarcode ? `Analyze barcode. Return macros per 100g. Language: ${langMap[lang] || 'Russian'}` : `Analyze food photo. Return dish name, and total estimated macros for portion. Language: ${langMap[lang] || 'Russian'}`;
  return await fetchGeminiWithRetry(prompt, schema, base64Image, 'image/jpeg');
}

async function getAIAdviceForRemaining(remaining: any, lang: string) {
  const schema = { type: "OBJECT", properties: { suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["title", "description", "calories", "protein", "fat", "carbs"] } } }, required: ["suggestions"] };
  return await fetchGeminiWithRetry(`User has left: Cals: ${remaining.calories}, P: ${remaining.protein}g, F: ${remaining.fat}g, C: ${remaining.carbs}g. Suggest 3 meals. Language: ${langMap[lang] || 'Russian'}`, schema);
}

async function analyzeTextToFood(text: string, lang: string) {
  const schema = { type: "OBJECT", properties: { dish_name: { type: "STRING" }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["calories", "protein", "fat", "carbs"] } }, required: ["dish_name", "total"] };
  return await fetchGeminiWithRetry(`Text: "${text}". Convert to single dish or meal summary, estimate total weight and macros. Language: ${langMap[lang] || 'Russian'}`, schema);
}

const calculateLocalMacros = (profile: any, weight: any) => {
  const w = parseFloat(weight) || 70, h = parseFloat(profile.height) || 170, a = parseInt(profile.age) || 30;
  const multipliers: any = { min: 1.2, low: 1.375, med: 1.55, high: 1.725, ext: 1.9 };
  let tdee = ((10 * w) + (6.25 * h) - (5 * a) + (profile.gender === 'Мужской' || profile.gender === 'Male' ? 5 : -161)) * (multipliers[profile.activity] || 1.375);
  if (profile.goal === 'lose') tdee -= 500; if (profile.goal === 'gain') tdee += 500;
  const cals = Math.round(tdee), prot = Math.round(w * (profile.goal === 'gain' ? 2.0 : 1.8)), fat = Math.round(w * 1);
  return { calories: cals, protein: prot, fat: fat, carbs: Math.max(Math.round((cals - (prot * 4) - (fat * 9)) / 4), 0) };
};

const MOCK_CATALOG: any[] = [
  { id: 1, name: "Barilla Макароны Cannelloni (трубочки)", calories_100g: 359, protein_100g: 14.0, fats_100g: 2.0, carbs_100g: 71.0 },
  { id: 2, name: "Barilla Макароны Farfalle (Бант)", calories_100g: 359, protein_100g: 14.0, fats_100g: 2.0, carbs_100g: 71.0 },
  { id: 3, name: "Barilla Макароны Fusilli (Спирали)", calories_100g: 359, protein_100g: 14.0, fats_100g: 2.0, carbs_100g: 71.0 },
  { id: 4, name: "Barilla Макароны Lasagne нарезка", calories_100g: 359, protein_100g: 14.0, fats_100g: 2.0, carbs_100g: 71.0 },
  { id: 5, name: "Barilla Макароны Penne Rigate n.73", calories_100g: 359, protein_100g: 14.0, fats_100g: 2.0, carbs_100g: 71.0 },
  { id: 6, name: "Barilla Макароны Spaghetti n.5", calories_100g: 359, protein_100g: 14.0, fats_100g: 2.0, carbs_100g: 71.0 },
  { id: 7, name: "Barilla Макароны Tagliatelle яичные", calories_100g: 365, protein_100g: 15.0, fats_100g: 3.5, carbs_100g: 68.0 },
  { id: 8, name: "Barilla Макароны безглютеновые Senza Glutine", calories_100g: 359, protein_100g: 6.5, fats_100g: 1.8, carbs_100g: 79.0 },
  { id: 9, name: "Barilla Макароны цельнозерновые Integrale", calories_100g: 348, protein_100g: 13.0, fats_100g: 2.5, carbs_100g: 65.0 },
  { id: 10, name: "Barilla Соус Basilico томатный с базиликом", calories_100g: 61, protein_100g: 1.6, fats_100g: 2.7, carbs_100g: 6.8 },
  { id: 11, name: "Barilla Соус Bolognese мясной", calories_100g: 89, protein_100g: 4.5, fats_100g: 4.0, carbs_100g: 8.5 },
  { id: 12, name: "Barilla Соус Pesto alla Genovese", calories_100g: 482, protein_100g: 5.0, fats_100g: 46.0, carbs_100g: 9.8 },
  { id: 13, name: "De Cecco Макароны Spaghetti n.12", calories_100g: 355, protein_100g: 14.5, fats_100g: 1.5, carbs_100g: 70.0 },
  { id: 14, name: "Kosmostars Готовый медовый завтрак звездочки", calories_100g: 385, protein_100g: 7.0, fats_100g: 3.5, carbs_100g: 80.0 },
  { id: 15, name: "Nesquik Готовый шоколадный завтрак шарики", calories_100g: 380, protein_100g: 8.5, fats_100g: 3.8, carbs_100g: 77.0 },
  { id: 16, name: "Гранола Bionova ягодная без сахара", calories_100g: 410, protein_100g: 11.0, fats_100g: 16.0, carbs_100g: 52.0 },
  { id: 17, name: "Кукурузные хлопья Любятово (без глазури)", calories_100g: 370, protein_100g: 7.0, fats_100g: 1.0, carbs_100g: 83.0 },
  { id: 18, name: "Кукурузные хлопья Любятово медовые", calories_100g: 380, protein_100g: 6.0, fats_100g: 1.5, carbs_100g: 86.0 },
  { id: 19, name: "Лапша Доширак говядина (сухой брикет)", calories_100g: 440, protein_100g: 9.0, fats_100g: 19.0, carbs_100g: 58.0 },
  { id: 20, name: "Лапша Роллтон куриная (сухой брикет)", calories_100g: 448, protein_100g: 8.7, fats_100g: 21.1, carbs_100g: 55.7 },
  { id: 21, name: "Макфа Гречневая крупа ядрица", calories_100g: 335, protein_100g: 12.5, fats_100g: 2.5, carbs_100g: 65.0 },
  { id: 22, name: "Макфа Макароны Гречневые", calories_100g: 345, protein_100g: 13.0, fats_100g: 1.8, carbs_100g: 68.0 },
  { id: 23, name: "Макфа Макароны Перья (из твердых сортов)", calories_100g: 342, protein_100g: 12.0, fats_100g: 1.3, carbs_100g: 70.5 },
  { id: 24, name: "Макфа Макароны Рожки", calories_100g: 342, protein_100g: 12.0, fats_100g: 1.3, carbs_100g: 70.5 },
  { id: 25, name: "Макфа Макароны Спагетти", calories_100g: 342, protein_100g: 12.0, fats_100g: 1.3, carbs_100g: 70.5 },
  { id: 26, name: "Макфа Макароны Спирали", calories_100g: 342, protein_100g: 12.0, fats_100g: 1.3, carbs_100g: 70.5 },
  { id: 27, name: "Макфа Макароны Томатные", calories_100g: 340, protein_100g: 11.5, fats_100g: 1.2, carbs_100g: 70.0 },
  { id: 28, name: "Макфа Мука пшеничная в/с", calories_100g: 334, protein_100g: 10.3, fats_100g: 1.1, carbs_100g: 70.6 },
  { id: 29, name: "Макфа Мука ржаная сеяная", calories_100g: 298, protein_100g: 8.9, fats_100g: 1.7, carbs_100g: 61.8 },
  { id: 30, name: "Макфа Хлопья 5 злаков", calories_100g: 340, protein_100g: 11.0, fats_100g: 3.0, carbs_100g: 67.0 },
  { id: 31, name: "Мистраль Горох зеленый колотый", calories_100g: 310, protein_100g: 23.0, fats_100g: 1.5, carbs_100g: 50.0 },
  { id: 32, name: "Мистраль Гречка зеленая для проращивания", calories_100g: 310, protein_100g: 12.5, fats_100g: 3.0, carbs_100g: 62.0 },
  { id: 33, name: "Мистраль Киноа белая", calories_100g: 368, protein_100g: 14.1, fats_100g: 6.1, carbs_100g: 64.2 },
  { id: 34, name: "Мистраль Нут турецкий", calories_100g: 364, protein_100g: 19.0, fats_100g: 6.0, carbs_100g: 61.0 },
  { id: 35, name: "Мистраль Рис Басмати", calories_100g: 345, protein_100g: 7.5, fats_100g: 0.6, carbs_100g: 78.0 },
  { id: 36, name: "Мистраль Рис Жасмин", calories_100g: 340, protein_100g: 7.0, fats_100g: 0.5, carbs_100g: 77.0 },
  { id: 37, name: "Мистраль Рис круглозерный Кубань", calories_100g: 340, protein_100g: 6.5, fats_100g: 0.5, carbs_100g: 78.0 },
  { id: 38, name: "Мистраль Чечевица персидская красная", calories_100g: 310, protein_100g: 21.0, fats_100g: 1.5, carbs_100g: 48.0 },
  { id: 39, name: "Увелка Булгур в пакетиках", calories_100g: 342, protein_100g: 12.0, fats_100g: 1.5, carbs_100g: 75.0 },
  { id: 40, name: "Увелка Гречка в пакетиках для варки", calories_100g: 330, protein_100g: 12.0, fats_100g: 2.0, carbs_100g: 66.0 },
  { id: 41, name: "Увелка Овсяные хлопья Геркулес", calories_100g: 360, protein_100g: 12.0, fats_100g: 6.0, carbs_100g: 62.0 },
  { id: 42, name: "Увелка Рис круглозерный в пакетиках", calories_100g: 340, protein_100g: 7.0, fats_100g: 1.0, carbs_100g: 76.0 },
  { id: 43, name: "Шебекинские Макароны Перья", calories_100g: 350, protein_100g: 13.0, fats_100g: 1.5, carbs_100g: 72.0 },
  { id: 44, name: "Шебекинские Макароны Спагетти №003", calories_100g: 350, protein_100g: 13.0, fats_100g: 1.5, carbs_100g: 72.0 },
  { id: 45, name: "Ясно Солнышко Овсяные хлопья №1", calories_100g: 350, protein_100g: 12.0, fats_100g: 6.0, carbs_100g: 62.0 },
  { id: 46, name: "BCAA (аминокислоты, порошок)", calories_100g: 400, protein_100g: 100.0, fats_100g: 0.0, carbs_100g: 0.0 },
  { id: 47, name: "Котлета Beyond Meat", calories_100g: 252, protein_100g: 18.0, fats_100g: 19.0, carbs_100g: 5.0 },
  { id: 48, name: "Молоко миндальное", calories_100g: 24, protein_100g: 0.8, fats_100g: 1.5, carbs_100g: 2.0 },
  { id: 49, name: "Молоко овсяное", calories_100g: 45, protein_100g: 1.0, fats_100g: 1.5, carbs_100g: 7.0 },
  { id: 50, name: "Протеин сывороточный (WPC 80)", calories_100g: 400, protein_100g: 80.0, fats_100g: 5.0, carbs_100g: 8.0 },
  { id: 51, name: "Тофу (соевый сыр)", calories_100g: 76, protein_100g: 8.1, fats_100g: 4.8, carbs_100g: 1.9 },
  { id: 52, name: "Куриное филе грудки вареное", calories_100g: 137, protein_100g: 29.8, fats_100g: 1.8, carbs_100g: 0.0 },
  { id: 53, name: "Куриное филе грудки на гриле (без масла)", calories_100g: 150, protein_100g: 31.0, fats_100g: 2.8, carbs_100g: 0.0 },
  { id: 54, name: "Куриное бедро вареное без кожи", calories_100g: 165, protein_100g: 24.0, fats_100g: 7.5, carbs_100g: 0.0 },
  { id: 55, name: "Индейка: филе грудки", calories_100g: 114, protein_100g: 23.0, fats_100g: 1.9, carbs_100g: 0.0 },
  { id: 56, name: "Котлета по-киевски", calories_100g: 330, protein_100g: 15.0, fats_100g: 25.0, carbs_100g: 12.0 },
  { id: 57, name: "Пельмени отварные (свинина/говядина)", calories_100g: 275, protein_100g: 11.9, fats_100g: 12.4, carbs_100g: 29.0 },
  { id: 58, name: "Плов с говядиной / бараниной", calories_100g: 215, protein_100g: 7.5, fats_100g: 9.0, carbs_100g: 25.5 },
  { id: 59, name: "Борщ с говядиной", calories_100g: 45, protein_100g: 3.2, fats_100g: 2.5, carbs_100g: 3.4 },
  { id: 60, name: "Гречка отварная", calories_100g: 100, protein_100g: 4.0, fats_100g: 1.0, carbs_100g: 20.0 },
  { id: 61, name: "Рис отварной", calories_100g: 116, protein_100g: 2.2, fats_100g: 0.5, carbs_100g: 24.9 },
  { id: 62, name: "Макароны отварные", calories_100g: 112, protein_100g: 3.6, fats_100g: 0.4, carbs_100g: 23.2 },
  { id: 63, name: "Картофельное пюре (на молоке)", calories_100g: 106, protein_100g: 2.5, fats_100g: 4.2, carbs_100g: 14.5 },
  { id: 64, name: "Салат Оливье (с майонезом)", calories_100g: 198, protein_100g: 5.3, fats_100g: 16.2, carbs_100g: 7.5 },
  { id: 65, name: "Салат Цезарь (с курицей)", calories_100g: 175, protein_100g: 9.5, fats_100g: 12.0, carbs_100g: 6.5 },
  { id: 66, name: "Хачапури по-аджарски", calories_100g: 270, protein_100g: 11.0, fats_100g: 12.0, carbs_100g: 30.0 },
  { id: 67, name: "Хинкали (говядина/свинина)", calories_100g: 230, protein_100g: 9.0, fats_100g: 10.0, carbs_100g: 25.0 },
  { id: 68, name: "Стейк Рибай Black Angus", calories_100g: 290, protein_100g: 24.0, fats_100g: 22.0, carbs_100g: 0.0 },
  { id: 69, name: "Стейк Филе-миньон (Тендерлойн)", calories_100g: 155, protein_100g: 26.0, fats_100g: 5.5, carbs_100g: 0.0 },
  { id: 70, name: "Лосось (семга)", calories_100g: 153, protein_100g: 20.0, fats_100g: 8.1, carbs_100g: 0.0 },
  { id: 71, name: "Тунец консервированный (в собст. соку)", calories_100g: 96, protein_100g: 21.0, fats_100g: 0.8, carbs_100g: 0.0 },
  { id: 72, name: "Креветки (отварные)", calories_100g: 97, protein_100g: 18.3, fats_100g: 1.2, carbs_100g: 0.8 },
  { id: 73, name: "Творог 5%", calories_100g: 121, protein_100g: 17.2, fats_100g: 5.0, carbs_100g: 1.8 },
  { id: 74, name: "Творог обезжиренный (0%)", calories_100g: 71, protein_100g: 16.5, fats_100g: 0.0, carbs_100g: 1.3 },
  { id: 75, name: "Яйцо куриное (1 шт = ~50г)", calories_100g: 157, protein_100g: 12.7, fats_100g: 11.5, carbs_100g: 0.7 },
  { id: 76, name: "Сыр Пармезан", calories_100g: 392, protein_100g: 35.8, fats_100g: 25.8, carbs_100g: 3.2 },
  { id: 77, name: "Сыр Моцарелла (для пиццы)", calories_100g: 300, protein_100g: 22.0, fats_100g: 22.0, carbs_100g: 2.0 },
  { id: 78, name: "Авокадо", calories_100g: 160, protein_100g: 2.0, fats_100g: 14.7, carbs_100g: 8.5 },
  { id: 79, name: "Банан", calories_100g: 89, protein_100g: 1.5, fats_100g: 0.1, carbs_100g: 21.8 },
  { id: 80, name: "Яблоко", calories_100g: 47, protein_100g: 0.4, fats_100g: 0.4, carbs_100g: 9.8 },
  { id: 81, name: "Огурец", calories_100g: 15, protein_100g: 0.8, fats_100g: 0.1, carbs_100g: 2.8 },
  { id: 82, name: "Помидор", calories_100g: 20, protein_100g: 1.1, fats_100g: 0.2, carbs_100g: 3.7 },
  { id: 83, name: "Капуста брокколи", calories_100g: 34, protein_100g: 2.8, fats_100g: 0.4, carbs_100g: 6.6 },
  { id: 84, name: "Арахисовая паста (без сахара)", calories_100g: 588, protein_100g: 25.0, fats_100g: 50.0, carbs_100g: 20.0 },
  { id: 85, name: "Миндаль", calories_100g: 609, protein_100g: 18.6, fats_100g: 53.7, carbs_100g: 13.0 },
  { id: 86, name: "Bombbar Батончик протеиновый (Малиновый чизкейк)", calories_100g: 297, protein_100g: 33.3, fats_100g: 10.7, carbs_100g: 9.8 },
  { id: 87, name: "Bombbar Печенье протеиновое (Шоколадный брауни)", calories_100g: 270, protein_100g: 25.0, fats_100g: 9.0, carbs_100g: 10.5 },
  { id: 88, name: "Optimum Nutrition 100% Whey Gold Standard (порошок)", calories_100g: 375, protein_100g: 75.0, fats_100g: 3.8, carbs_100g: 10.0 },
  { id: 89, name: "Вкусно и точка: Биг Хит", calories_100g: 235, protein_100g: 11.5, fats_100g: 12.0, carbs_100g: 20.0 },
  { id: 90, name: "Додо Пицца: Пепперони", calories_100g: 270, protein_100g: 10.5, fats_100g: 11.0, carbs_100g: 31.0 },
  { id: 91, name: "Ролл Филадельфия", calories_100g: 168, protein_100g: 6.5, fats_100g: 6.8, carbs_100g: 19.5 }
];

export default function App() {
  const [lang, setLang] = useState('ru');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] || translations['en'] }}>
      <MainApp />
    </LanguageContext.Provider>
  );
}

function MainApp() {
  const { t, lang } = useContext(LanguageContext);
  
  const [mounted, setMounted] = useState(false);
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Voice recognition states mounted at root to avoid scroll/blur glitches
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    try {
      // One-time automatic wipe of previous user history
      const isFreshStartDone = localStorage.getItem('nutribot_v3_fresh_start');
      if (!isFreshStartDone) {
        const legacyKeys = [
          'nutribot_profile', 'nutribot_goals', 'nutribot_meals',
          'nutribot_weights', 'nutribot_water', 'nutribot_custom',
          'nutribot_streak', 'nutribot_sub', 'nutribot_uid', 'nutribot_data'
        ];
        legacyKeys.forEach(k => localStorage.removeItem(k));
        localStorage.setItem('nutribot_v3_fresh_start', 'true');

        setUserProfile(null);
        setDailyGoals(null);
        setIsFirstLaunch(true);
        setMeals([]);
        setWeightHistory([]);
        setWaterLogs({});
        setCustomFoods([]);
        setStreakDays(0);
        setSubscription('bronze');
        setDataLoading(false);
        return;
      }

      const savedProfile = localStorage.getItem('nutribot_profile');
      const savedGoals = localStorage.getItem('nutribot_goals');
      const savedMeals = localStorage.getItem('nutribot_meals');
      const savedWeights = localStorage.getItem('nutribot_weights');
      const savedWater = localStorage.getItem('nutribot_water');
      const savedCustom = localStorage.getItem('nutribot_custom');
      const savedStreak = localStorage.getItem('nutribot_streak');
      const savedSub = localStorage.getItem('nutribot_sub');

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
        setIsFirstLaunch(false);
      }
      if (savedGoals) setDailyGoals(JSON.parse(savedGoals));
      if (savedMeals) setMeals(JSON.parse(savedMeals));
      if (savedWeights) setWeightHistory(JSON.parse(savedWeights));
      if (savedWater) setWaterLogs(JSON.parse(savedWater));
      if (savedCustom) setCustomFoods(JSON.parse(savedCustom));
      if (savedStreak) setStreakDays(parseInt(savedStreak, 10) || 0);
      if (savedSub) setSubscription(savedSub);
    } catch (e) {
      console.warn("LocalStorage initial load notice:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Telegram) {
      const tgScript = document.createElement('script');
      tgScript.src = 'https://telegram.org/js/telegram-web-app.js';
      tgScript.onload = () => { 
        if ((window as any).Telegram?.WebApp) { 
          (window as any).Telegram.WebApp.ready(); 
          (window as any).Telegram.WebApp.expand(); 
        } 
      };
      document.head.appendChild(tgScript);
    }
  }, []);

  useEffect(() => {
    if (!auth) { 
      let localUid = localStorage.getItem('nutribot_uid') || 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('nutribot_uid', localUid);
      setUser({ uid: localUid });
      setAuthLoading(false); 
      setDataLoading(false); 
      return; 
    }

    const unsubAuth = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        setUser(currUser);
        setAuthLoading(false);
      } else {
        try {
          if (typeof (window as any).__initial_auth_token !== 'undefined' && (window as any).__initial_auth_token) { 
            const res = await signInWithCustomToken(auth, (window as any).__initial_auth_token); 
            setUser(res.user);
          } else { 
            const res = await signInAnonymously(auth); 
            setUser(res.user);
          }
        } catch (e) { 
          let localUid = localStorage.getItem('nutribot_uid') || 'user_' + Math.random().toString(36).substring(2, 9);
          localStorage.setItem('nutribot_uid', localUid);
          setUser({ uid: localUid });
        } finally {
          setAuthLoading(false);
        }
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) { setDataLoading(false); return; }
    const uid = user.uid;

    if (!db || uid.startsWith('user_')) {
      setDataLoading(false);
      return;
    }

    let isSubscribed = true;

    const unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'profile'), (docSnap: any) => {
      if (!isSubscribed) return;
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.formData) {
          setUserProfile(data.formData);
          localStorage.setItem('nutribot_profile', JSON.stringify(data.formData));
        }
        if (data.goals) {
          setDailyGoals(data.goals);
          localStorage.setItem('nutribot_goals', JSON.stringify(data.goals));
        }
        setIsFirstLaunch(false);
      }
      setDataLoading(false);
    }, () => { if (isSubscribed) setDataLoading(false); });

    const unsubMeals = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'meals'), (snap: any) => {
      if (!isSubscribed) return;
      const items: any[] = [];
      snap.forEach((d: any) => items.push(d.data()));
      if (items.length > 0) {
        setMeals(items);
        localStorage.setItem('nutribot_meals', JSON.stringify(items));
      }
    }, () => {});

    const unsubWeight = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'weights'), (snap: any) => {
      if (!isSubscribed) return;
      const items: any[] = [];
      snap.forEach((d: any) => items.push(d.data()));
      const sorted = items.sort((a: any, b: any) => b.id - a.id);
      if (sorted.length > 0) {
        setWeightHistory(sorted);
        localStorage.setItem('nutribot_weights', JSON.stringify(sorted));
      }
    }, () => {});

    const unsubWater = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'water'), (docSnap: any) => {
      if (!isSubscribed) return;
      if (docSnap.exists() && docSnap.data().logs) {
        setWaterLogs(docSnap.data().logs);
        localStorage.setItem('nutribot_water', JSON.stringify(docSnap.data().logs));
      }
    }, () => {});

    const unsubCustomFoods = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'customFoods'), (snap: any) => {
      if (!isSubscribed) return;
      const items: any[] = [];
      snap.forEach((d: any) => items.push(d.data()));
      if (items.length > 0) {
        setCustomFoods(items);
        localStorage.setItem('nutribot_custom', JSON.stringify(items));
      }
    }, () => {});

    const unsubStats = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'stats'), (docSnap: any) => {
      if (!isSubscribed) return;
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.subscription) {
          setSubscription(data.subscription);
          localStorage.setItem('nutribot_sub', data.subscription);
        }
        if (typeof data.streakDays !== 'undefined') {
          setStreakDays(data.streakDays);
          localStorage.setItem('nutribot_streak', data.streakDays.toString());
        }
        if (data.lastScanDate === new Date().toDateString()) {
          setScansToday(data.scansToday || 0);
          setBarcodeScansToday(data.barcodeScansToday || 0);
        } else {
          setScansToday(0);
          setBarcodeScansToday(0);
        }
      }
    }, () => {});

    return () => { 
      isSubscribed = false; 
      unsubProfile(); unsubMeals(); unsubWeight(); unsubWater(); unsubStats(); unsubCustomFoods(); 
    };
  }, [user]);

  const formattedSelectedDate = useMemo(() => { 
    const d = new Date(selectedDate); 
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; 
  }, [selectedDate]);

  const todayFormatted = useMemo(() => { 
    const d = new Date(); 
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; 
  }, []);

  const currentDayMeals = useMemo(() => meals.filter((m: any) => m.date === formattedSelectedDate), [meals, formattedSelectedDate]);
  const hasMealsToday = useMemo(() => meals.some((m: any) => m.date === todayFormatted), [meals, todayFormatted]);

  const current = useMemo(() => currentDayMeals.reduce(
    (acc: any, meal: any) => ({
      calories: acc.calories + (meal.total?.calories || 0), 
      protein: acc.protein + (meal.total?.protein || 0),
      fat: acc.fat + (meal.total?.fat || 0), 
      carbs: acc.carbs + (meal.total?.carbs || 0),
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 }
  ), [currentDayMeals]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsListening(false);
      return;
    }

    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRec) {
      setVoiceError(t.micBlocked);
      return;
    }

    try {
      setVoiceError(null);
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang === 'en' ? 'en-US' : 'ru-RU';

      rec.onresult = (e: any) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript + ' ';
        }
        setVoiceText(transcript.trim());
      };

      rec.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setVoiceError(t.micBlocked);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
      setIsListening(true);
    } catch (err: any) {
      console.warn("Speech mic init err:", err);
      setIsListening(false);
      setVoiceError(t.micBlocked);
    }
  }, [isListening, lang, t]);

  const handleVoiceSubmit = useCallback(async () => {
    if (!voiceText.trim()) return;
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
      setIsListening(false);
    }
    setIsAnalyzingVoice(true); 
    setVoiceError(null);
    try { 
      const result = await analyzeTextToFood(voiceText, lang); 
      setIsVoiceModalOpen(false); 
      setVoiceText(''); 
      setPendingMeal(result); 
    } catch { 
      setVoiceError(t.recognitionError); 
    }
    setIsAnalyzingVoice(false);
  }, [voiceText, isListening, lang, t]);

  const handleOnboardingComplete = useCallback(async (goals: any, formData: any) => {
    setUserProfile(formData); 
    setDailyGoals(goals); 
    setIsFirstLaunch(false);
    localStorage.setItem('nutribot_profile', JSON.stringify(formData));
    localStorage.setItem('nutribot_goals', JSON.stringify(goals));

    const d = new Date(); 
    const today = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    const wData = { id: Date.now(), date: today, weight: parseFloat(String(formData.weight).replace(',', '.')) };
    setWeightHistory([wData]);
    localStorage.setItem('nutribot_weights', JSON.stringify([wData]));

    if (user && db && !user.uid.startsWith('user_')) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { formData, goals });
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', wData.id.toString()), wData);
      } catch (err) {
        console.warn("Cloud save profile fallback to local:", err);
      }
    }
  }, [user]);

  const checkAccess = useCallback((requiredTier: string) => {
    const tiers: any = { bronze: 0, silver: 1, gold: 2 };
    if (tiers[subscription] >= tiers[requiredTier]) return true;
    setUpgradePrompt({ show: true, required: requiredTier }); 
    return false;
  }, [subscription]);

  const requestAddMeal = useCallback((mealData: any) => setPendingMeal(mealData), []);

  const confirmAddMeal = useCallback(async (type: string) => {
    if (pendingMeal) {
      const willIgniteStreak = formattedSelectedDate === todayFormatted && !hasMealsToday;
      const d = new Date(); 
      const safeTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
      const newMeal = { ...pendingMeal, type, date: formattedSelectedDate, id: Date.now() + Math.random(), time: safeTime };
      
      setMeals(prev => {
        const next = [...prev, newMeal];
        localStorage.setItem('nutribot_meals', JSON.stringify(next));
        return next;
      });
      setPendingMeal(null); 
      setActiveTab('dashboard');
      
      if (willIgniteStreak) { 
        const newStreak = streakDays + 1; 
        setStreakDays(newStreak);
        localStorage.setItem('nutribot_streak', newStreak.toString());
        
        const jubileeDays = [5, 10, 30, 60, 100, 200, 400];
        if (jubileeDays.includes(newStreak)) {
          setShowStreakPopup(true); 
          setTimeout(() => setShowStreakPopup(false), 4500); 
        }

        if (user && db && !user.uid.startsWith('user_')) {
          setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), { streakDays: newStreak }, {merge:true}).catch(() => {});
        }
      }

      if (user && db && !user.uid.startsWith('user_')) {
        try {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', newMeal.id.toString()), newMeal);
        } catch (err) {
          console.warn("Cloud save meal error:", err);
        }
      }
    }
  }, [pendingMeal, formattedSelectedDate, todayFormatted, hasMealsToday, user, streakDays]);

  const deleteMeal = useCallback(async (id: any) => {
    setMeals(prev => {
      const next = prev.filter((m: any) => m.id !== id);
      localStorage.setItem('nutribot_meals', JSON.stringify(next));
      return next;
    });

    if (user && db && !user.uid.startsWith('user_')) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', id.toString()));
      } catch (err) {
        console.warn("Cloud delete meal error:", err);
      }
    }
  }, [user]);

  const addWeight = useCallback(async (weightStr: any) => {
    const weight = parseFloat(String(weightStr).replace(',', '.'));
    if (isNaN(weight)) return;
    const d = new Date(); 
    const today = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    const wData = { id: Date.now(), date: today, weight };
    
    setWeightHistory(prev => {
      const next = [wData, ...prev];
      localStorage.setItem('nutribot_weights', JSON.stringify(next));
      return next;
    });

    if (user && db && !user.uid.startsWith('user_')) {
      setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', wData.id.toString()), wData).catch(() => {});
    }

    if (userProfile) {
      const newGoals = calculateLocalMacros(userProfile, weight);
      setDailyGoals(newGoals);
      localStorage.setItem('nutribot_goals', JSON.stringify(newGoals));
      if (user && db && !user.uid.startsWith('user_')) {
        setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { formData: userProfile, goals: newGoals }, {merge:true}).catch(() => {});
      }
    }
  }, [userProfile, user]);

  const currentWater = waterLogs[formattedSelectedDate] || 0;
  const handleAddWater = useCallback(async (amount: number) => {
    const newAmount = Math.max((waterLogs[formattedSelectedDate] || 0) + amount, 0);
    const newLogs = { ...waterLogs, [formattedSelectedDate]: newAmount };
    setWaterLogs(newLogs);
    localStorage.setItem('nutribot_water', JSON.stringify(newLogs));

    if (user && db && !user.uid.startsWith('user_')) {
      setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'water'), { logs: newLogs }).catch(() => {});
    }
  }, [formattedSelectedDate, waterLogs, user]);

  const handleWipeAllData = useCallback(async () => {
    const keysToClear = [
      'nutribot_profile', 'nutribot_goals', 'nutribot_meals',
      'nutribot_weights', 'nutribot_water', 'nutribot_custom',
      'nutribot_streak', 'nutribot_sub', 'nutribot_uid', 'nutribot_data'
    ];
    keysToClear.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('nutribot_v3_fresh_start', 'true');

    // Fresh random UID for new session
    const newLocalUid = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('nutribot_uid', newLocalUid);
    setUser({ uid: newLocalUid });

    setUserProfile(null);
    setDailyGoals(null);
    setIsFirstLaunch(true);
    setMeals([]);
    setWeightHistory([]);
    setWaterLogs({});
    setCustomFoods([]);
    setStreakDays(0);
    setSubscription('bronze');
    setShowResetConfirm(false);
    setActiveTab('dashboard');

    if (user && db && !user.uid.startsWith('user_')) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'));
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'water'));
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'));
      } catch (err) {
        console.warn("Cloud wipe error:", err);
      }
    }
  }, [user]);

  const saveCustomRecipeToDB = useCallback(async (recipeItem: any) => {
    setCustomFoods(prev => {
      const next = [recipeItem, ...prev];
      localStorage.setItem('nutribot_custom', JSON.stringify(next));
      return next;
    });

    if (user && db && !user.uid.startsWith('user_')) {
      setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customFoods', recipeItem.id.toString()), recipeItem).catch(() => {});
    }
  }, [user]);

  const updateSubscription = useCallback(async (level: string) => {
    setSubscription(level);
    localStorage.setItem('nutribot_sub', level);

    if (user && db && !user.uid.startsWith('user_')) {
      setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), { subscription: level }, {merge:true}).catch(() => {});
    }
  }, [user]);

  const incrementScan = useCallback(async (type: string) => {
    const todayStr = new Date().toDateString();
    const newStats = { 
      lastScanDate: todayStr, 
      scansToday: type === 'photo' ? scansToday + 1 : scansToday, 
      barcodeScansToday: type === 'barcode' ? barcodeScansToday + 1 : barcodeScansToday 
    };
    if (type === 'photo') setScansToday(p => p+1); 
    if (type === 'barcode') setBarcodeScansToday(p => p+1);

    if (user && db && !user.uid.startsWith('user_')) {
      setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), newStats, {merge:true}).catch(() => {});
    }
  }, [scansToday, barcodeScansToday, user]);

  const streakStyle = useMemo(() => {
    if (streakDays >= 400) return { text: "text-cyan-400", fill: "fill-cyan-400", shadow: "shadow-cyan-500/30", border: "border-cyan-500/50", bg: "bg-cyan-500/20", grad: "from-cyan-500 to-blue-500" };
    if (streakDays >= 100) return { text: "text-red-500", fill: "fill-red-500", shadow: "shadow-red-500/30", border: "border-red-500/50", bg: "bg-red-500/20", grad: "from-red-500 to-rose-600" };
    if (streakDays >= 30) return { text: "text-purple-400", fill: "fill-purple-400", shadow: "shadow-purple-500/30", border: "border-purple-500/50", bg: "bg-purple-500/20", grad: "from-purple-500 to-fuchsia-500" };
    return { text: "text-orange-400", fill: "fill-orange-400", shadow: "shadow-orange-500/30", border: "border-orange-500/50", bg: "bg-orange-500/20", grad: "from-orange-500 to-amber-500" };
  }, [streakDays]);

  if (!mounted || (authLoading && dataLoading && !userProfile)) {
    return (
      <div className="flex flex-col h-screen bg-slate-900 text-slate-100 items-center justify-center">
        <Activity className="text-emerald-500 animate-spin mb-4" size={40}/>
        <p className="text-slate-400 font-medium">{t?.loadingData || "Загрузка..."}</p>
      </div>
    );
  }

  if (isFirstLaunch || !dailyGoals) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {/* Top Navigation Bar */}
      <header className="px-4 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <Activity className="text-emerald-400" size={24} />
          <h1 className="text-lg font-bold">NutriBot</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${hasMealsToday ? `${streakStyle.bg} ${streakStyle.border} ${streakStyle.text} shadow-md ${streakStyle.shadow}` : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
            <Flame size={16} className={hasMealsToday ? `${streakStyle.fill} animate-pulse` : ""} />
            <span className="font-bold text-sm">{streakDays}</span>
          </div>
          <div onClick={() => setActiveTab('profile')} className={`btn-glass text-sm border px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md ${subscription === 'gold' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : subscription === 'silver' ? 'bg-slate-400/10 border-slate-400/30 text-slate-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
            {subscription === 'gold' ? <Crown size={14} /> : subscription === 'silver' ? <Zap size={14} /> : <Shield size={14} />}
            <span className="font-bold tracking-wide">{subscription.toUpperCase()}</span>
          </div>
        </div>
      </header>

      {/* Screen Area */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {activeTab === 'dashboard' && <Dashboard current={current} goals={dailyGoals} meals={currentDayMeals} onAddClick={() => setActiveTab('search')} selectedDate={selectedDate} setSelectedDate={setSelectedDate} requestAddMeal={requestAddMeal} currentWater={currentWater} addWater={handleAddWater} deleteMeal={deleteMeal} checkAccess={checkAccess} />}
        {activeTab === 'camera' && <CameraScanner onSave={requestAddMeal} onCancel={() => setActiveTab('dashboard')} subscription={subscription} scansToday={scansToday} incrementScan={incrementScan} checkAccess={checkAccess} />}
        {activeTab === 'search' && <FoodSearch customFoods={customFoods} saveCustomRecipeToDB={saveCustomRecipeToDB} recentFoods={recentFoods} setRecentFoods={setRecentFoods} onSave={requestAddMeal} checkAccess={checkAccess} subscription={subscription} barcodeScansToday={barcodeScansToday} incrementScan={incrementScan} />}
        {activeTab === 'weight' && <WeightTracker history={weightHistory} onAdd={addWeight} />}
        {activeTab === 'profile' && <UserProfile currentSub={subscription} setSubscription={updateSubscription} onRequestReset={() => setShowResetConfirm(true)} />}
      </main>

      {/* Floating Microphone Button: directly opens reliable root modal */}
      {activeTab === 'dashboard' && (
        <button
          type="button"
          onClick={() => {
            if (checkAccess('silver')) {
              setIsVoiceModalOpen(true);
            }
          }}
          className="btn-glass absolute bottom-24 right-4 bg-emerald-500 text-slate-900 p-4 rounded-full shadow-[0_5px_20px_rgba(16,185,129,0.5)] z-30 flex items-center justify-center outline-none border-0"
          aria-label="Голосовой ввод"
        >
          <Mic size={24} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-white/5 pb-safe pt-2 z-20">
        <div className="flex justify-between items-end px-2 pb-2">
          <div className="flex w-2/5 justify-around">
            <NavButton icon={<Home />} label={t.dashboard} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavButton icon={<Search />} label={t.searchTab} isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          </div>
          <div className="w-1/5 flex justify-center relative">
            <div onClick={() => checkAccess('silver') && setActiveTab('camera')} className="btn-glass absolute bottom-4 bg-emerald-500 text-slate-900 p-4 rounded-full shadow-[0_5px_20px_rgba(16,185,129,0.5)] flex items-center justify-center z-30">
              <Camera size={28} />
            </div>
          </div>
          <div className="flex w-2/5 justify-around">
            <NavButton icon={<Scale />} label={t.weightTab} isActive={activeTab === 'weight'} onClick={() => setActiveTab('weight')} />
            <NavButton icon={<User />} label={t.profileTab} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </div>
      </nav>

      {/* FIXED VOICE INPUT MODAL: Placed directly in root viewport */}
      {isVoiceModalOpen && (
        <div className="absolute inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800/95 w-full rounded-3xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mic className="text-emerald-400"/> {t.recordVoice}
              </h3>
              <button 
                type="button"
                onClick={() => { 
                  if (isListening && recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch(e){}
                    setIsListening(false);
                  }
                  setIsVoiceModalOpen(false); 
                }} 
                className="btn-glass p-2 bg-slate-700/50 rounded-full text-slate-400 hover:text-white"
              >
                <X size={20}/>
              </button>
            </div>
            
            <p className="text-xs text-slate-300 mb-4">{t.dictatePrompt}</p>

            {/* Interactive Pulse Microphone Button */}
            <div className="flex flex-col items-center justify-center my-4">
              <div 
                onClick={toggleListening} 
                className={`btn-glass w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 text-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.5)]'}`}
                style={isListening ? { animation: 'pulseWave 1.2s infinite' } : {}}
              >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </div>
              <span className={`text-xs font-bold mt-2.5 ${isListening ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                {isListening ? t.listening : t.tapToSpeak}
              </span>
            </div>

            {voiceError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3 text-red-400 text-xs text-center">
                {voiceError}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <input 
                type="text" 
                value={voiceText} 
                onChange={e => setVoiceText(String(e.target?.value || ''))} 
                placeholder={t.dictatePlaceholder} 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500"
              />
              <button 
                type="button"
                onClick={handleVoiceSubmit} 
                disabled={isAnalyzingVoice || !voiceText.trim()}
                className={`btn-glass bg-emerald-500 text-slate-900 rounded-xl px-4 flex justify-center items-center ${isAnalyzingVoice || !voiceText.trim() ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isAnalyzingVoice ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Upgrade Gate Modal */}
      {upgradePrompt.show && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800/95 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 text-center animate-in zoom-in-95 duration-300">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${upgradePrompt.required === 'gold' ? 'bg-amber-500/20' : 'bg-slate-400/20'}`}>
              {upgradePrompt.required === 'gold' ? <Crown size={40} className="text-amber-400" /> : <Zap size={40} className="text-blue-400" />}
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

      {/* In-App Confirmation Modal: Reset All Data */}
      {showResetConfirm && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800/95 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.resetTitle}</h3>
            <p className="text-slate-300 text-sm mb-6">{t.resetDesc}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="btn-glass flex-1 py-3 rounded-xl bg-slate-700/60 text-white font-medium text-center"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleWipeAllData}
                className="btn-glass flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-center shadow-lg shadow-red-500/30"
              >
                {t.resetConfirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meal Selection Category Popup */}
      {pendingMeal && (
        <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800/95 w-full rounded-3xl p-6 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-8 duration-300">
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">{t.whereToSave}</h3>
            <p className="text-slate-400 text-sm text-center mb-6">{t.date}: {`${selectedDate.getDate()}.${selectedDate.getMonth()+1}.${selectedDate.getFullYear()}`}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div onClick={() => confirmAddMeal('breakfast')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl block mb-1">🌅</span> {t.breakfast}</div>
              <div onClick={() => confirmAddMeal('lunch')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl block mb-1">☀️</span> {t.lunch}</div>
              <div onClick={() => confirmAddMeal('dinner')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl block mb-1">🌙</span> {t.dinner}</div>
              <div onClick={() => confirmAddMeal('snack')} className="btn-glass bg-slate-700/50 p-4 rounded-2xl font-semibold text-slate-200 flex flex-col items-center gap-2 border border-white/5 text-center"><span className="text-2xl block mb-1">🍎</span> {t.snack}</div>
            </div>
            <div onClick={() => setPendingMeal(null)} className="btn-glass w-full mt-2 py-4 text-slate-400 font-medium bg-slate-800 rounded-xl text-center">{t.cancel}</div>
          </div>
        </div>
      )}

      {/* Streak Celebration Popup */}
      {showStreakPopup && (
        <div onClick={() => setShowStreakPopup(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer">
          <div className="flex flex-col items-center justify-center animate-in zoom-in-50 slide-in-from-bottom-12 duration-500 ease-out">
            <div className="relative mb-6">
               <div className={`absolute w-40 h-40 ${streakStyle.bg} rounded-full blur-[60px] opacity-70 animate-pulse`}></div>
               <Flame size={140} className={`${streakStyle.text} relative z-10 drop-shadow-[0_0_30px_rgba(currentColor,1)] animate-bounce`} fill="currentColor" />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 text-center tracking-widest drop-shadow-lg">ЮБИЛЕЙ!</h2>
            <div className={`bg-gradient-to-r ${streakStyle.grad} text-slate-900 px-8 py-3 rounded-full font-black text-2xl shadow-xl ${streakStyle.shadow} mt-4`}>🔥 {streakDays} ДНЕЙ</div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = React.memo(({ icon, label, isActive, onClick }: any) => (
  <div onClick={onClick} className={`btn-glass flex flex-col items-center gap-1 w-14 ${isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-slate-400'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}<span className="text-[10px] font-semibold">{label}</span>
  </div>
));

const MacroCard = React.memo(({ label, current, goal, color, g }: any) => {
  const percent = Math.min(Math.round((current / (goal || 1)) * 100), 100) || 0;
  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col shadow-lg">
      <span className="text-xs text-slate-400 mb-1">{label}</span>
      <span className="font-bold text-sm mb-2 text-white">{Math.round(current)} / {goal}{g}</span>
      <div className="h-1.5 w-full bg-slate-700/50 rounded-full mt-auto overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
});

const Dashboard = React.memo(({ current, goals, meals, onAddClick, selectedDate, setSelectedDate, requestAddMeal, currentWater, addWater, deleteMeal, checkAccess }: any) => {
  const { t, lang } = useContext(LanguageContext);
  const [adviceData, setAdviceData] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);

  const formattedDate = useMemo(() => {
    const d = new Date(selectedDate);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, [selectedDate]);

  const WATER_GOAL = 2000;
  const getPercent = (val: number, max: number) => Math.min(Math.round((val / (max || 1)) * 100), 100);
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
      const res = await getAIAdviceForRemaining(remaining, lang);
      setAdviceData(res.suggestions); 
    } catch { 
      setAdviceData([{ title: "Идеи блюд", description: "Нейросеть предлагает легкий белковый салат с овощами.", calories: 250, protein: 25, fat: 5, carbs: 15 }]); 
    }
    setLoadingAdvice(false);
  };

  const formatDisplayDate = (d: any) => {
    const today = new Date(), yesterday = new Date(), tomorrow = new Date();
    yesterday.setDate(today.getDate() - 1); tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Сегодня";
    if (d.toDateString() === yesterday.toDateString()) return "Вчера";
    if (d.toDateString() === tomorrow.toDateString()) return "Завтра";
    return `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
  };

  const mealTypes = [
    { id: 'breakfast', label: t.breakfast, icon: '🌅' }, 
    { id: 'lunch', label: t.lunch, icon: '☀️' }, 
    { id: 'dinner', label: t.dinner, icon: '🌙' }, 
    { id: 'snack', label: t.snack, icon: '🍎' }
  ];

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
      {/* Date Carousel */}
      <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/5">
        <div onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d);}} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-xl"><ChevronLeft size={24} /></div>
        <div className="flex items-center gap-2 font-bold text-white text-lg"><CalendarDays size={20} className="text-emerald-400" />{formatDisplayDate(selectedDate)}</div>
        <div onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d);}} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-xl"><ChevronRight size={24} /></div>
      </div>

      {/* Calorie Card */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-slate-400 text-sm font-medium">{t.calsLeft}</h2>
          <div className="text-right"><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.eatenToday}</span><div className="text-sm font-bold text-emerald-400">{current.calories} <span className="text-slate-500 text-xs">{t.kcal}</span></div></div>
        </div>
        <div className="flex items-end gap-2 mb-4 mt-[-10px]"><span className="text-4xl font-bold text-white">{remaining.calories}</span><span className="text-slate-400 text-sm mb-1">{t.from} {goals?.calories || 2000}</span></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-5"><div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${getPercent(current.calories, goals?.calories || 2000)}%` }} /></div>
        <div onClick={handleAskAI} className="btn-glass w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><Lightbulb size={20} className="text-amber-400" /> {t.aiDietitian}</div>
      </div>

      {/* Macronutrient Cards */}
      <div className="grid grid-cols-3 gap-3">
        <MacroCard label={t.proteins} current={current.protein} goal={goals?.protein || 150} color="from-blue-500 to-blue-400" g={t.g} />
        <MacroCard label={t.fats} current={current.fat} goal={goals?.fat || 70} color="from-amber-500 to-amber-400" g={t.g}/>
        <MacroCard label={t.carbs} current={current.carbs} goal={goals?.carbs || 200} color="from-purple-500 to-purple-400" g={t.g}/>
      </div>

      {/* Water Tracking Card */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-3"><h2 className="text-slate-200 font-bold flex items-center gap-2"><Droplet className="text-blue-400" size={20} fill="currentColor" fillOpacity={0.2} /> {t.waterConsumed}</h2><span className="text-sm font-bold text-blue-400">{currentWater} / {WATER_GOAL} {t.ml}</span></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${getPercent(currentWater, WATER_GOAL)}%` }}><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div></div>
        <div className="flex gap-3">
          <div onClick={() => addWater(250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥛 +250 {t.ml}</div>
          <div onClick={() => addWater(-250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥤 -250 {t.ml}</div>
        </div>
      </div>

      {/* Meal Diary Feed */}
      <div className="mt-8 space-y-6 pb-20">
        {mealTypes.map(type => {
          const typeMeals = meals.filter((m: any) => (m.date === formattedDate || !m.date) && m.type === type.id);
          const typeCals = typeMeals.reduce((acc: any, m: any) => acc + (m.total?.calories || 0), 0);
          return (
            <div key={type.id} className="animate-in fade-in">
              <div className="flex justify-between items-center mb-3 px-1"><h4 className="font-bold text-slate-200 flex items-center gap-2"><span className="text-lg">{type.icon}</span> {type.label}</h4><span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">{Math.round(typeCals)} {t.kcal}</span></div>
              {typeMeals.length === 0 ? (
                <div onClick={onAddClick} className="btn-glass w-full bg-slate-800/30 border border-slate-700/50 border-dashed rounded-xl p-4 flex justify-center items-center text-sm text-slate-500"><Plus size={16} className="mr-1"/> {t.addFood}</div>
              ) : (
                <div className="space-y-2">
                  {typeMeals.map((meal: any) => (
                    <div key={meal.id} className="bg-slate-800/80 backdrop-blur-md p-4 rounded-xl flex justify-between items-center border border-white/5 relative">
                      <div className="flex-1 pr-2"><h4 className="font-medium text-slate-100 truncate">{meal.dish_name}</h4><div className="text-xs text-slate-400 mt-1 flex gap-2"><span>Б: {Math.round(meal.total?.protein || 0)}</span><span>Ж: {Math.round(meal.total?.fat || 0)}</span><span>У: {Math.round(meal.total?.carbs || 0)}</span></div></div>
                      <div className="flex items-center gap-3"><div className="text-right"><div className="font-bold text-emerald-400">{Math.round(meal.total?.calories || 0)}</div><div className="text-[10px] text-slate-500">{meal.time}</div></div><div onClick={() => deleteMeal(meal.id)} className="btn-glass p-2 text-slate-500 hover:text-red-400 bg-slate-700/30 rounded-lg"><Trash2 size={18} /></div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Dietitian Suggestions Modal */}
      {showAdviceModal && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900/95 w-full h-[85vh] rounded-t-3xl border-t border-white/10 flex flex-col slide-in-from-bottom-8">
            <div className="flex justify-between items-center p-5 border-b border-white/5"><div className="flex items-center gap-2 text-lg font-bold text-white"><Lightbulb className="text-amber-400" /> {t.aiDietitian}</div><div onClick={() => setShowAdviceModal(false)} className="btn-glass p-2 text-slate-400 bg-slate-800 rounded-full"><X size={20}/></div></div>
            <div className="flex-1 overflow-y-auto p-5">
              {loadingAdvice ? (
                <div className="flex flex-col items-center justify-center mt-20"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-amber-400 animate-pulse font-medium">{t.aiCreating}</p></div>
              ) : (
                <div className="space-y-4">
                  {adviceData && Array.isArray(adviceData) && adviceData.map((advice: any, idx: number) => (
                    <div key={idx} className="bg-slate-800/80 p-5 rounded-2xl border border-white/5 shadow-lg">
                      <h4 className="font-bold text-lg text-white mb-2">{advice?.title}</h4><p className="text-sm text-slate-400 mb-4">{advice?.description}</p>
                      <div className="flex justify-between bg-slate-900/80 rounded-xl p-3">
                        <div className="text-center"><span className="block text-emerald-400 font-bold">{advice?.calories}</span><span className="text-[10px] text-slate-500">ККАЛ</span></div>
                        <div className="text-center"><span className="block text-blue-400 font-bold">{advice?.protein}г</span><span className="text-[10px] text-slate-500">БЕЛКИ</span></div>
                        <div className="text-center"><span className="block text-amber-400 font-bold">{advice?.fat}г</span><span className="text-[10px] text-slate-500">ЖИРЫ</span></div>
                        <div className="text-center"><span className="block text-purple-400 font-bold">{advice?.carbs}г</span><span className="text-[10px] text-slate-500">УГЛЕВОДЫ</span></div>
                      </div>
                      <div onClick={() => { setShowAdviceModal(false); requestAddMeal({ dish_name: advice?.title, total: { calories: advice?.calories, protein: advice?.protein, fat: advice?.fat, carbs: advice?.carbs } }); }} className="btn-glass w-full mt-4 bg-emerald-500/20 text-emerald-400 py-2 rounded-xl text-center text-sm font-bold border border-emerald-500/30"><Plus size={16} className="inline mr-1 mb-0.5"/> {t.addToDiary}</div>
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
  const [status, setStatus] = useState('idle'), [result, setResult] = useState<any>(null), [imagePreview, setImagePreview] = useState<any>(null);
  
  const handleFileChange = async (e: any) => {
    if (subscription === 'silver' && scansToday >= 10) { checkAccess('gold'); return; }
    const file = e.target.files[0]; if (!file) return;
    setImagePreview(URL.createObjectURL(file)); setStatus('scanning');
    try {
      const aiData = await analyzeImageWithGemini(file, false, lang);
      if (!aiData || !aiData.dish_name) throw new Error("Invalid");
      setResult(aiData); setStatus('result');
      if (subscription === 'silver') incrementScan('photo');
    } catch { setStatus('error'); }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 absolute inset-0 z-40 animate-in slide-in-from-bottom duration-300 overflow-y-auto">
      <div className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-md shadow-md sticky top-0 z-10 border-b border-white/5"><div onClick={onCancel} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-full"><ChevronLeft size={24} /></div><h2 className="font-semibold text-lg text-white">{t.aiScanner}</h2><div className="w-10"></div></div>
      <div className="flex-1 p-4 flex flex-col items-center justify-start min-h-full">
        {status === 'idle' && (
          <div className="text-center w-full max-w-sm mt-10 space-y-4">
            {subscription === 'silver' && <div className="bg-slate-800/80 text-sm text-slate-400 p-2 rounded-xl mb-4 border border-white/5">Доступно: <span className="text-white font-bold">{10 - scansToday}/10</span></div>}
            <label className="btn-glass w-full bg-slate-800/80 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-6 flex items-center justify-start gap-6 shadow-lg block"><input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} /><div className="bg-emerald-500/20 p-4 rounded-full inline-block"><Camera size={32} className="text-emerald-400" /></div><div className="text-left inline-block align-middle ml-4"><p className="text-white font-bold text-lg mb-1">{t.takePhoto}</p></div></label>
            <label className="btn-glass w-full bg-slate-800/80 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 flex items-center justify-start gap-6 shadow-lg block"><input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /><div className="bg-blue-500/20 p-4 rounded-full inline-block"><ImagePlus size={32} className="text-blue-400" /></div><div className="text-left inline-block align-middle ml-4"><p className="text-white font-bold text-lg mb-1">{t.fromGallery}</p></div></label>
          </div>
        )}
        {status === 'error' && (
          <div className="text-center mt-10 w-full max-w-sm"><div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6"><AlertCircle size={48} className="text-red-500 mx-auto mb-4" /><h3 className="text-lg font-bold text-white mb-2">{t.recognitionError}</h3><div onClick={() => setStatus('idle')} className="btn-glass w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-xl mt-4 text-center">{t.tryAgain}</div></div></div>
        )}
        {(status === 'scanning' || status === 'result') && imagePreview && (
          <div className="w-full max-w-sm animate-in fade-in flex flex-col items-center pb-10">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden mb-6 border border-white/10 shadow-2xl bg-black"><img src={imagePreview} alt="Еда" className="w-full h-full object-contain" />
              {status === 'scanning' && <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center"><div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-white font-medium text-lg">{t.aiThinking}</p></div>}
            </div>
            {status === 'result' && result && (
              <div className="w-full bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">{result.dish_name}</h3>
                <div className="grid grid-cols-4 gap-2 mb-6 bg-slate-900/80 rounded-xl p-3 border border-white/5">
                  <div className="text-center"><div className="text-sm font-bold text-emerald-400">{Math.round(result.total?.calories || 0)}</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-blue-400">{Math.round(result.total?.protein || 0)}г</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-amber-400">{Math.round(result.total?.fat || 0)}г</div></div>
                  <div className="text-center"><div className="text-sm font-bold text-purple-400">{Math.round(result.total?.carbs || 0)}г</div></div>
                </div>
                <div onClick={() => onSave({ dish_name: result.dish_name, total: result.total })} className="btn-glass w-full bg-emerald-500 text-slate-900 font-bold py-3 px-4 rounded-xl shadow-[0_5px_20px_rgba(16,185,129,0.4)] text-center">{t.addToDiary}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const FoodSearch = React.memo(({ customFoods, saveCustomRecipeToDB, recentFoods, setRecentFoods, onSave, checkAccess, subscription, barcodeScansToday, incrementScan }: any) => {
  const { t, lang } = useContext(LanguageContext);
  const [activeSubTab, setActiveSubTab] = useState('global');
  const [query, setQuery] = useState('');
  const [weight, setWeight] = useState(100), [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false), [recipeName, setRecipeName] = useState(''), [recipeIngredients, setRecipeIngredients] = useState<any[]>([]), [recipeError, setRecipeError] = useState(''); 
  const [isSearchingIngredient, setIsSearchingIngredient] = useState(false), [ingQuery, setIngQuery] = useState(''), [ingSelected, setIngSelected] = useState<any>(null), [ingWeight, setIngWeight] = useState(100);
  const [isScanning, setIsScanning] = useState(false), [scanStatus, setScanStatus] = useState('idle');

  const safeQuery = String(query || ''); const safeIngQuery = String(ingQuery || '');

  const displayList = useMemo(() => {
    const list = activeSubTab === 'global' ? MOCK_CATALOG : customFoods;
    if (safeQuery.trim() === '') return activeSubTab === 'global' ? (recentFoods.length > 0 ? recentFoods : MOCK_CATALOG.slice(0, 30)) : customFoods;
    return list.filter((item: any) => String(item?.name || '').toLowerCase().includes(safeQuery.toLowerCase()));
  }, [safeQuery, activeSubTab, customFoods, recentFoods]);

  const ingSearchResults = useMemo(() => {
    if (safeIngQuery.trim() === '') return [...MOCK_CATALOG, ...customFoods].slice(0, 30);
    return [...MOCK_CATALOG, ...customFoods].filter((item: any) => String(item?.name || '').toLowerCase().includes(safeIngQuery.toLowerCase()));
  }, [safeIngQuery, customFoods]);

  useEffect(() => { setQuery(''); }, [activeSubTab]);

  const handleSelect = (item: any) => { setSelectedItem(item); setWeight(100); };

  const handleSaveToDiary = () => {
    if (!selectedItem) return;
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
    if (setRecentFoods) setRecentFoods((prev: any) => [{ ...selectedItem, id: selectedItem.id || Date.now() }, ...prev.filter((i: any) => i.id !== selectedItem.id)].slice(0, 15));
    setSelectedItem(null); setQuery('');
  };

  const addIngredientToRecipe = () => {
    if (!ingSelected) return;
    const nw = Number(ingWeight) || 0, factor = nw / 100;
    setRecipeIngredients([...recipeIngredients, { ...ingSelected, weight: nw, cals: ingSelected.calories_100g * factor, prot: ingSelected.protein_100g * factor, fat: ingSelected.fats_100g * factor, carbs: ingSelected.carbs_100g * factor }]);
    setIngSelected(null); setIsSearchingIngredient(false); setIngQuery(''); setRecipeError('');
  };

  const removeIngredient = (index: number) => setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  const totalRecipeWeight = recipeIngredients.reduce((s, i) => s + (Number(i.weight) || 0), 0);

  const saveCustomRecipe = () => {
    if (!recipeName || recipeIngredients.length === 0) { setRecipeError(t.tryAgain); return; }
    const factor = totalRecipeWeight > 0 ? 100 / totalRecipeWeight : 0;
    const recipeItem = {
      id: `custom-${Date.now()}`, 
      name: String(recipeName), 
      calories_100g: Math.round(recipeIngredients.reduce((s, i) => s + i.cals, 0) * factor), 
      protein_100g: Number((recipeIngredients.reduce((s, i) => s + i.prot, 0) * factor).toFixed(1)), 
      fats_100g: Number((recipeIngredients.reduce((s, i) => s + i.fat, 0) * factor).toFixed(1)), 
      carbs_100g: Number((recipeIngredients.reduce((s, i) => s + i.carbs, 0) * factor).toFixed(1))
    };
    saveCustomRecipeToDB(recipeItem); setIsCreatingRecipe(false); setRecipeName(''); setRecipeIngredients([]); setRecipeError(''); setActiveSubTab('custom');
  };

  const handleBarcodeFile = async (e: any) => {
    if (subscription === 'bronze' && barcodeScansToday >= 7) { checkAccess('silver'); return; }
    const file = e.target.files[0]; if (!file) return;
    setIsScanning(true); setScanStatus('loading');
    try {
      const aiData = await analyzeImageWithGemini(file, true, lang);
      setScanStatus('idle'); setIsScanning(false);
      if (subscription === 'bronze') incrementScan('barcode');
      handleSelect({ 
        id: Date.now(), 
        name: String(aiData?.name || "Product"), 
        calories_100g: aiData?.calories_100g || 0, 
        protein_100g: aiData?.protein_100g || 0, 
        fats_100g: aiData?.fats_100g || 0, 
        carbs_100g: aiData?.carbs_100g || 0 
      }); 
    } catch { setScanStatus('error'); setIsScanning(false); }
  };

  if (isSearchingIngredient) {
    if (ingSelected) {
      return (
        <div className="p-4 animate-in slide-in-from-right h-full bg-slate-900">
          <div className="flex items-center gap-3 mb-6"><div onClick={() => setIngSelected(null)} className="btn-glass p-2 text-slate-400 bg-slate-800 rounded-full"><ChevronLeft size={24} /></div><h3 className="font-bold text-lg text-white truncate">Вес: {ingSelected.name}</h3></div>
          <div className="flex items-center justify-center gap-4 mb-8"><input type="number" value={ingWeight} onChange={e => setIngWeight(Number(e.target.value))} className="bg-slate-800/80 border border-white/10 rounded-xl py-3 px-4 text-center text-3xl font-bold w-32 text-white outline-none" /><span className="text-xl text-slate-400">{t.g}</span></div>
          <div onClick={addIngredientToRecipe} className="btn-glass w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl text-lg text-center shadow-[0_5px_20px_rgba(16,185,129,0.4)]">{t.addIngredient}</div>
        </div>
      );
    }
    return (
      <div className="p-4 animate-in fade-in flex flex-col h-full bg-slate-900">
        <div className="flex items-center gap-3 mb-6"><div onClick={() => setIsSearchingIngredient(false)} className="btn-glass p-2 text-slate-400 bg-slate-800 rounded-full"><ChevronLeft size={24} /></div><h2 className="text-xl font-bold">{t.ingredient}</h2></div>
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder={t.searchPlaceholder} value={safeIngQuery} onChange={e => setIngQuery(String(e.target?.value || ''))} className="w-full bg-slate-800/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none"/></div>
        <div className="flex-1 overflow-y-auto pb-10 space-y-2">
          {ingSearchResults.map((item: any, idx: number) => (
            <div key={`${item.id || idx}`} onClick={() => { setIngSelected(item); setIngWeight(100); }} className="btn-glass bg-slate-800/80 p-4 rounded-xl flex justify-between items-center border border-white/5 mb-2">
              <div className="pr-2"><h4 className="font-medium text-slate-100 truncate">{item.name}</h4><div className="text-xs text-slate-400 mt-1 flex gap-2"><span>Б: {item.protein_100g}</span><span>Ж: {item.fats_100g}</span><span>У: {item.carbs_100g}</span></div></div>
              <div className="font-bold text-emerald-400 whitespace-nowrap">{item.calories_100g} <span className="text-[10px] text-slate-500">{t.kcal}</span></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isCreatingRecipe) {
    const isReadyToSave = recipeName && recipeIngredients.length > 0;
    return (
      <div className="p-4 animate-in slide-in-from-right flex flex-col h-full bg-slate-900 overflow-y-auto pb-20">
        <div className="flex items-center gap-3 mb-6"><div onClick={() => setIsCreatingRecipe(false)} className="btn-glass p-2 text-slate-400 bg-slate-800 rounded-full"><ChevronLeft size={24} /></div><h2 className="text-xl font-bold">{t.constructor}</h2></div>
        <div className="mb-6"><input type="text" placeholder={t.recipeName} value={recipeName} onChange={e => setRecipeName(String(e.target?.value || ''))} className="w-full bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"/></div>
        {recipeError && <div className="text-red-400 text-sm text-center mb-4 bg-red-500/10 p-2 rounded-xl border border-red-500/30">{recipeError}</div>}
        <div className="mb-6 flex-1">
          <div className="space-y-2 mb-4">
            {recipeIngredients.map((ing: any, idx: number) => (
              <div key={idx} className="bg-slate-800/80 p-3 rounded-xl flex justify-between items-center border border-white/5">
                <div className="pr-2"><p className="font-medium text-sm text-white truncate">{ing.name}</p><p className="text-xs text-slate-400">{ing.weight}г</p></div>
                <div onClick={() => removeIngredient(idx)} className="btn-glass p-2 text-red-400 bg-slate-700/30 rounded-lg"><Trash2 size={18}/></div>
              </div>
            ))}
          </div>
          <div onClick={() => setIsSearchingIngredient(true)} className="btn-glass w-full bg-slate-800 border border-emerald-500/30 text-emerald-400 py-3 rounded-xl flex justify-center items-center gap-2 font-medium"><Plus size={18}/> {t.addIngredient}</div>
        </div>
        {recipeIngredients.length > 0 && (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-3 text-center">{t.kbju100g}</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center"><div className="text-sm font-bold text-emerald-400">{Math.round(recipeIngredients.reduce((s,i)=>s+i.cals,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))}</div></div>
              <div className="text-center"><div className="text-sm font-bold text-blue-400">{((recipeIngredients.reduce((s,i)=>s+i.prot,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))).toFixed(1)}</div></div>
              <div className="text-center"><div className="text-sm font-bold text-amber-400">{((recipeIngredients.reduce((s,i)=>s+i.fat,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))).toFixed(1)}</div></div>
              <div className="text-center"><div className="text-sm font-bold text-purple-400">{((recipeIngredients.reduce((s,i)=>s+i.carbs,0)/(totalRecipeWeight>0?totalRecipeWeight/100:1))).toFixed(1)}</div></div>
            </div>
          </div>
        )}
        <div onClick={saveCustomRecipe} className={`btn-glass w-full py-4 rounded-xl text-center font-bold ${isReadyToSave ? 'bg-emerald-500 text-slate-900 shadow-[0_5px_20px_rgba(16,185,129,0.4)]' : 'bg-slate-700 text-slate-500'}`}>{t.saveRecipe}</div>
      </div>
    );
  }

  return (
    <div className="p-4 animate-in fade-in flex flex-col h-full relative">
      {!selectedItem ? (
        <>
          <div className="flex bg-slate-800/80 backdrop-blur-md p-1 rounded-xl mb-6 border border-white/5">
            <div onClick={() => setActiveSubTab('global')} className={`btn-glass flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center ${activeSubTab === 'global' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}>{t.base}</div>
            <div onClick={() => setActiveSubTab('custom')} className={`btn-glass flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center ${activeSubTab === 'custom' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}>{t.myRecipes}</div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder={t.searchPlaceholder} value={safeQuery} onChange={e => setQuery(String(e.target?.value || ''))} className="w-full bg-slate-800/80 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white outline-none"/></div>
            {activeSubTab === 'global' && (
              <label 
                onClick={(e) => { if (subscription === 'bronze' && barcodeScansToday >= 7) { e.preventDefault(); checkAccess('silver'); } }}
                className={`btn-glass bg-slate-800/80 border border-white/5 rounded-xl px-4 flex justify-center items-center ${isScanning ? 'opacity-50 pointer-events-none' : 'text-slate-400'}`}
              >
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleBarcodeFile}/>
                {isScanning ? <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"/> : <Barcode size={24} />}
              </label>
            )}
          </div>
          {activeSubTab === 'global' && subscription === 'bronze' && <div className="text-xs text-slate-500 mb-4 px-2 font-medium">{t.bronzeF2}: {barcodeScansToday}/7</div>}
          
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
  const [inputWeight, setInputWeight] = useState('');
  const handleSubmit = (e: any) => { e.preventDefault(); const val = parseFloat(String(inputWeight).replace(',', '.')); if (!isNaN(val) && val > 0) { onAdd(val); setInputWeight(''); } };
  
  const chartData = [...history].reverse();
  const maxW = chartData.length > 0 ? Math.max(...chartData.map((h: any) => h.weight)) + 1 : 100;
  const minW = chartData.length > 0 ? Math.max(0, Math.min(...chartData.map((h: any) => h.weight)) - 1) : 0;
  const range = maxW - minW || 1;
  const points = chartData.map((d: any, i: number) => `${(i / Math.max(chartData.length - 1, 1)) * 300},${100 - ((d.weight - minW) / range) * 100}`).join(' ');

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h2 className="text-slate-200 font-semibold mb-4 flex items-center gap-2"><Scale size={20} className="text-emerald-400" /> {t.weightTitle}</h2>
        <form onSubmit={handleSubmit} className="flex gap-3"><input type="text" inputMode="decimal" value={inputWeight} onChange={e => setInputWeight(String(e.target?.value || ''))} placeholder={t.weightPlaceholder} className="flex-1 bg-slate-900/80 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-center"/><button type="submit" className="btn-glass bg-emerald-500 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-[0_5px_15px_rgba(16,185,129,0.3)]">{t.add}</button></form>
      </div>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">{t.chart}</h3>
        {history.length > 1 ? (
          <div className="w-full h-32 relative flex items-center justify-center"><svg viewBox="-10 -10 320 120" className="w-full h-full overflow-visible"><polyline points={points} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" />{chartData.map((d: any, i: number) => <circle key={i} cx={(i / Math.max(chartData.length - 1, 1)) * 300} cy={100 - ((d.weight - minW) / range) * 100} r="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />)}</svg></div>
        ) : (<div className="w-full h-32 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl"><TrendingDown size={32} className="mb-2 opacity-50" /><p className="text-sm text-center px-4">{t.needMoreData}</p></div>)}
      </div>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">{t.history}</h3>
        <div className="space-y-0">{history.map((record: any, index: number) => {
            const prevRecord = history[index + 1], diff = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : 0;
            return (
              <div key={record.id} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0"><span className="text-slate-300 font-medium">{record.date}</span><div className="flex items-center gap-4">{prevRecord ? (<span className={`flex items-center text-xs font-semibold ${diff < 0 ? 'text-emerald-400' : diff > 0 ? 'text-red-400' : 'text-slate-500'}`}>{diff < 0 ? <TrendingDown size={14} className="mr-1"/> : diff > 0 ? <TrendingUp size={14} className="mr-1"/> : <Minus size={14} className="mr-1"/>} {Math.abs(diff as any)}</span>) : <span className="text-xs text-slate-500">{t.start}</span>}<span className="text-lg font-bold w-16 text-right text-white">{record.weight}</span></div></div>
            );
        })}</div>
      </div>
    </div>
  );
});

const UserProfile = React.memo(({ currentSub, setSubscription, onRequestReset }: any) => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const [purchaseStatus, setPurchaseStatus] = useState('idle'), [expandedTier, setExpandedTier] = useState<any>(null), [purchasingTier, setPurchasingTier] = useState<any>(null);

  const handlePurchase = (level: string) => {
    setPurchasingTier(level); setPurchaseStatus('loading');
    setTimeout(() => {
      setPurchaseStatus('confetti'); 
      setTimeout(() => { 
        setPurchaseStatus('success'); 
        setSubscription(level); 
        setTimeout(() => { 
          setPurchaseStatus('idle'); 
          setPurchasingTier(null); 
        }, 3600); 
      }, 500); 
    }, 900);
  };

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 flex justify-between items-center border border-white/5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-emerald-500"><User size={32} className="text-slate-400" /></div>
          <div><h2 className="text-xl font-bold text-white">@telegram_user</h2><p className="text-slate-400 text-sm">{t.inSystemSince}</p></div>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/5 shadow-lg">
        <div className="flex items-center gap-2 text-white font-medium"><Globe size={20} className="text-blue-400"/> {t.language}</div>
        <select value={lang} onChange={e => setLang(String(e.target.value))} className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none font-medium">
          <option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option>
        </select>
      </div>

      <h3 className="font-bold text-lg px-1 mt-8 mb-4">{t.subsLevels}</h3>
      <div className="space-y-4">
        {/* Bronze Plan */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-[2px] rounded-2xl">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full transition-all">
            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-[#cd7f32] flex items-center gap-2"><Shield size={20} /> Bronze</h4><span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">{currentSub === 'bronze' ? t.current : t.free}</span></div>
            <div onClick={() => setExpandedTier(expandedTier === 'bronze' ? null : 'bronze')} className="btn-glass flex items-center gap-1 text-slate-400 text-sm mb-2 w-full justify-between">{expandedTier === 'bronze' ? t.hideDetails : t.allFeatures} <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'bronze' ? 'rotate-180' : ''}`} size={16}/></div>
            {expandedTier === 'bronze' && (
              <ul className="text-sm text-slate-300 space-y-3 mb-4 mt-4 animate-in slide-in-from-top-2 fade-in">
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>Базовый каталог продуктов питания и поиск</span></li>
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>Сканер штрихкодов продуктов (до 7 раз в день)</span></li>
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>Учет выпитой воды, веса и КБЖУ</span></li>
                <li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>Конструктор собственных рецептов</span></li>
                <li className="flex items-start gap-2 opacity-50"><Minus size={16} className="mt-0.5 shrink-0"/> <span>AI-сканирование блюд по фото</span></li>
                <li className="flex items-start gap-2 opacity-50"><Minus size={16} className="mt-0.5 shrink-0"/> <span>Голосовой ввод съеденного</span></li>
                <li className="flex items-start gap-2 opacity-50"><Minus size={16} className="mt-0.5 shrink-0"/> <span>Умный ИИ-диетолог</span></li>
              </ul>
            )}
          </div>
        </div>

        {/* Silver Plan */}
        <div className="bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500 p-[2px] rounded-2xl shadow-lg">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden transition-all">
            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-slate-300 flex items-center gap-2"><Zap size={20} /> Silver</h4><span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">199 ₽ / мес</span></div>
            <div onClick={() => setExpandedTier(expandedTier === 'silver' ? null : 'silver')} className="btn-glass flex items-center gap-1 text-slate-400 text-sm mb-4 w-full justify-between">{expandedTier === 'silver' ? t.hideDetails : t.allFeatures} <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'silver' ? 'rotate-180' : ''}`} size={16}/></div>
            {expandedTier === 'silver' && (
              <ul className="text-sm text-slate-300 space-y-3 mb-6 animate-in slide-in-from-top-2 fade-in">
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-400 mt-0.5 shrink-0"/> <span>Всё, что входит в тариф Bronze</span></li>
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-400 mt-0.5 shrink-0"/> <span>AI-сканирование еды по фото (до 10 раз в день)</span></li>
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-400 mt-0.5 shrink-0"/> <span>Безлимитный сканер штрихкодов</span></li>
                <li className="flex items-start gap-2"><Check size={16} className="text-blue-400 mt-0.5 shrink-0"/> <span>Голосовой ввод съеденного</span></li>
                <li className="flex items-start gap-2 opacity-50"><Minus size={16} className="mt-0.5 shrink-0"/> <span>Умный ИИ-диетолог</span></li>
              </ul>
            )}
            {currentSub !== 'silver' && currentSub !== 'gold' ? (<div onClick={() => handlePurchase('silver')} className="btn-glass w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl text-center">{t.buySilver}</div>) : (currentSub === 'silver' && <div className="w-full text-center text-slate-400 font-bold py-3 bg-slate-800 rounded-xl">{t.yourTier}</div>)}
          </div>
        </div>

        {/* Gold Plan */}
        <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 p-[2px] rounded-2xl shadow-xl shadow-amber-500/20">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden transition-all">
            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-amber-400 flex items-center gap-2"><Crown size={20} /> Gold</h4><span className="text-sm font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg">499 ₽ / мес</span></div>
            <div onClick={() => setExpandedTier(expandedTier === 'gold' ? null : 'gold')} className="btn-glass flex items-center gap-1 text-slate-300 text-sm mb-4 w-full justify-between">{expandedTier === 'gold' ? t.hideDetails : t.allFeatures} <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'gold' ? 'rotate-180' : ''}`} size={16}/></div>
            {expandedTier === 'gold' && (
              <ul className="text-sm text-slate-300 space-y-3 mb-6 relative z-10 animate-in slide-in-from-top-2 fade-in">
                <li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>Всё, что входит в тарифы Bronze и Silver</span></li>
                <li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>Безлимитное AI-сканирование еды по фото</span></li>
                <li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>ИИ-диетолог: персональный подбор блюд</span></li>
                <li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>Высокая скорость обработки нейросетью</span></li>
              </ul>
            )}
            {currentSub !== 'gold' ? (<div onClick={() => handlePurchase('gold')} className="btn-glass w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.4)] text-center">{t.buyGold}</div>) : (<div className="w-full text-center text-amber-400 font-bold py-4 bg-amber-500/10 rounded-xl border border-amber-500/30">{t.proActive}</div>)}
          </div>
        </div>
      </div>

      {/* Reset Data Section */}
      <div className="pt-4 border-t border-white/5 pb-6">
        <button
          type="button"
          onClick={onRequestReset}
          className="btn-glass w-full py-3.5 px-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all shadow-md shadow-red-500/10"
        >
          <Trash2 size={18} />
          <span>{t.resetTitle}</span>
        </button>
      </div>

      {/* FULLSCREEN SUBSCRIPTION CELEBRATION MODAL */}
      {(purchaseStatus === 'confetti' || purchaseStatus === 'success') && (
        <div 
          onClick={() => { setPurchaseStatus('idle'); setPurchasingTier(null); }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 overflow-hidden cursor-pointer"
        >
          {purchasingTier === 'silver' ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <LightningStorm />
              
              {/* Electric Particle Sparks */}
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                {[...Array(40)].map((_, i) => {
                  const angle = (i * 360) / 40 + (Math.random() * 10 - 5);
                  const distance = 110 + Math.random() * 260;
                  const tx = `${Math.cos(angle * Math.PI / 180) * distance}px`;
                  const ty = `${Math.sin(angle * Math.PI / 180) * distance}px`;
                  const size = 3 + Math.random() * 6;
                  const sparkColors = ['#ffffff', '#bae6fd', '#38bdf8', '#60a5fa'];
                  return (
                    <div 
                      key={`spk-${i}`} 
                      className="absolute rounded-full"
                      style={{
                        backgroundColor: sparkColors[i % sparkColors.length],
                        width: size, height: size,
                        left: '50%', top: '50%',
                        '--tx': tx, '--ty': ty,
                        animation: `particle-explode ${0.8 + Math.random() * 1.4}s ease-out infinite`,
                        animationDelay: `${Math.random() * 0.4}s`,
                        boxShadow: '0 0 12px 2px #38bdf8'
                      }}
                    />
                  );
                })}
              </div>

              {/* Central Silver Badge */}
              <div className="flex flex-col items-center justify-center relative z-[160]" style={{ animation: 'zapIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                <div 
                  className="w-28 h-28 bg-gradient-to-br from-slate-200 via-sky-200 to-blue-400 rounded-3xl flex items-center justify-center mb-5 shadow-[0_0_60px_rgba(56,189,248,0.9)] border-2 border-white/60"
                  style={{ animation: 'silverPulseWave 1.6s infinite' }}
                >
                  <Zap size={56} className="text-slate-900 fill-slate-900 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                </div>
                <span className="text-slate-200 font-black text-6xl tracking-widest uppercase drop-shadow-[0_0_25px_rgba(56,189,248,1)]">
                  SILVER
                </span>
                <span className="text-sky-300 font-bold text-lg tracking-wider uppercase mt-2 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
                  {t.silverUnlocked}
                </span>
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
        <div className="animate-in fade-in slide-in-from-right duration-300">
          <div className="mb-6 text-center"><Activity className="text-emerald-400 mx-auto mb-2" size={40} /><h1 className="text-3xl font-black text-white mb-1">NutriBot</h1><p className="text-slate-400 text-sm">Умный трекер КБЖУ</p></div>
          {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-4 text-center">{errorMsg}</div>}
          <div className="space-y-4">
            <div className="bg-slate-800 p-1 rounded-xl flex gap-1">{genderOptions.map(g => (<div key={g.id} onClick={() => setFormData({...formData, gender: g.id})} className={`btn-glass flex-1 py-3 text-sm font-bold rounded-lg text-center ${formData.gender === g.id ? 'bg-emerald-500 text-slate-900 shadow-sm' : 'text-slate-400'}`}>{g.label}</div>))}</div>
            <div className="flex gap-4">
              <div className="flex-1"><label className="text-xs text-slate-400 block mb-1 ml-1">{t.age}</label><input type="number" value={formData.age} onChange={e => setFormData({...formData, age: String(e.target?.value || '')})} placeholder="25" className="w-full bg-slate-800/80 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"/></div>
              <div className="flex-1"><label className="text-xs text-slate-400 block mb-1 ml-1">{t.height}</label><input type="number" value={formData.height} onChange={e => setFormData({...formData, height: String(e.target?.value || '')})} placeholder="175" className="w-full bg-slate-800/80 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"/></div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1"><label className="text-xs text-slate-400 block mb-1 ml-1">{t.weight}</label><input type="number" inputMode="decimal" value={formData.weight} onChange={e => setFormData({...formData, weight: String(e.target?.value || '')})} placeholder="70" className="w-full bg-slate-800/80 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"/></div>
              <div className="flex-1"><label className="text-xs text-slate-400 block mb-1 ml-1">{t.activityLabel}</label><select value={formData.activity} onChange={e => setFormData({...formData, activity: String(e.target?.value || '')})} className="w-full bg-slate-800/80 rounded-xl px-2 py-3 text-white focus:border-emerald-500 outline-none appearance-none text-sm">{activityOptions.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}</select></div>
            </div>
            <div><label className="text-xs text-slate-400 block mb-1 ml-1">{t.goalLabel}</label><div className="flex flex-col gap-2">{goalOptions.map(g => (<div key={g.id} onClick={() => setFormData({...formData, goal: g.id})} className={`btn-glass text-left px-4 py-3 text-sm font-bold rounded-xl border flex justify-between items-center ${formData.goal === g.id ? 'bg-slate-800 border-emerald-500 text-emerald-400' : 'bg-slate-700/50 border-slate-700/50 text-slate-300'}`}>{g.label}{formData.goal === g.id && <CheckCircle2 size={18} />}</div>))}</div></div>
          </div>
          <div onClick={handleCalculate} className="btn-glass mt-8 w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-xl shadow-[0_5px_20px_rgba(16,185,129,0.4)] text-lg text-center">{t.startUsing}</div>
        </div>
      </div>
    </div>
  );
});
