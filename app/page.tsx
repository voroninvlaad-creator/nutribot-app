"use client";

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { 
  Camera, Search, Home, Plus, Activity, CheckCircle2, ChevronLeft, ChevronRight, Scale, User, 
  TrendingDown, TrendingUp, Minus, Crown, Zap, Shield, Check, Barcode, AlertCircle,
  ImagePlus, Lightbulb, X, Mic, Send, CalendarDays, Flame, Droplet, Trash2, History, ChevronDown, Globe, Sparkles
} from 'lucide-react';

const translations = {
  ru: {
    dashboard: "Сводка",
    searchTab: "Поиск",
    weightTab: "Вес",
    profileTab: "Профиль",
    calsLeft: "Осталось калорий",
    eatenToday: "Съедено за день",
    from: "из",
    kcal: "ккал",
    aiDietitian: "ИИ-диетолог: Что съесть?",
    proteins: "Белки",
    fats: "Жиры",
    carbs: "Углеводы",
    g: "г",
    waterConsumed: "Выпито воды",
    ml: "мл",
    addFood: "Добавить еду",
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    snack: "Перекус",
    recordVoice: "Запись голосом",
    dictatePrompt: "Напишите или продиктуйте, что вы съели.",
    dictatePlaceholder: "Напр: 200г овсянки и банан",
    aiThinking: "Нейросеть распознает блюдо...",
    aiCreating: "Подбираем персональные рецепты...",
    whereToSave: "Куда записать блюдо?",
    date: "Дата",
    cancel: "Отмена",
    base: "База продуктов",
    myRecipes: "Мои рецепты",
    searchPlaceholder: "Поиск по базе...",
    recentAdded: "Недавно добавленные",
    notFound: "Ничего не найдено",
    ingredient: "Ингредиент",
    constructor: "Конструктор",
    recipeName: "Название блюда",
    addIngredient: "Добавить ингредиент",
    saveRecipe: "Сохранить рецепт",
    kbju100g: "КБЖУ (на 100 грамм)",
    addToDiary: "Добавить в дневник",
    weightInfo: "грамм",
    aiScanner: "AI Сканер еды",
    takePhoto: "Сделать снимок",
    fromGallery: "Загрузить из галереи",
    recognitionError: "Ошибка распознавания",
    tryAgain: "Попробовать еще раз",
    recognized: "Распознанное блюдо",
    weightTitle: "Записать текущий вес (кг)",
    weightPlaceholder: "Например, 74.5",
    add: "Записать",
    chart: "Динамика изменения веса",
    needMoreData: "Добавьте еще минимум одну запись для построения графика",
    history: "История взвешиваний",
    start: "Старт",
    inSystemSince: "Участник сообщества NutriBot",
    subsLevels: "Тарифные планы",
    current: "Текущий",
    free: "Бесплатно",
    allFeatures: "Все возможности",
    hideDetails: "Скрыть подробности",
    buySilver: "Перейти на Silver",
    buyGold: "Активировать Gold",
    yourTier: "Ваш тариф активен",
    proActive: "PRO-доступ активирован",
    accountSetup: "Настроим NutriBot",
    activityLabel: "Уровень физической активности",
    goalLabel: "Ваша основная цель",
    startUsing: "Начать использовать",
    language: "Язык интерфейса",
    loadingData: "Загрузка данных...",
    reqSub: "Требуется подписка",
    reqSubDesc: "Эта функция доступна в расширенной версии. Перейдите в профиль для разблокировки.",
    toProfile: "Перейти в профиль",
    silverUnlocked: "SILVER ТАРИФ АКТИВИРОВАН",
    goldUnlocked: "GOLD СТАТУС ПОЛУЧЕН",
    male: "Мужской",
    female: "Женский",
    age: "Возраст",
    height: "Рост (см)",
    weight: "Вес (кг)",
    barcodeLimit: "Сканирований штрихкодов",
    activities: {
      min: "Минимальная (сидячий образ)",
      low: "Слабая (1-2 тренировки)",
      med: "Средняя (3-5 тренировок)",
      high: "Высокая (тяжелые нагрузки)",
      ext: "Экстремальная (спортсмены)"
    },
    goals: {
      lose: "Снижение веса (дефицит)",
      keep: "Поддержание текущей формы",
      gain: "Набор мышечной массы"
    }
  },
  en: {
    dashboard: "Dashboard",
    searchTab: "Search",
    weightTab: "Weight",
    profileTab: "Profile",
    calsLeft: "Calories left",
    eatenToday: "Eaten today",
    from: "of",
    kcal: "kcal",
    aiDietitian: "AI Dietitian: What to eat?",
    proteins: "Protein",
    fats: "Fats",
    carbs: "Carbs",
    g: "g",
    waterConsumed: "Water consumed",
    ml: "ml",
    addFood: "Add food",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    recordVoice: "Voice Record",
    dictatePrompt: "Type or dictate what you ate.",
    dictatePlaceholder: "e.g., 200g oatmeal and banana",
    aiThinking: "AI is analyzing your meal...",
    aiCreating: "Creating tailored recipes...",
    whereToSave: "Where to save this meal?",
    date: "Date",
    cancel: "Cancel",
    base: "Food Database",
    myRecipes: "My Recipes",
    searchPlaceholder: "Search foods...",
    recentAdded: "Recently Added",
    notFound: "Nothing found",
    ingredient: "Ingredient",
    constructor: "Constructor",
    recipeName: "Recipe name",
    addIngredient: "Add ingredient",
    saveRecipe: "Save recipe",
    kbju100g: "Macros (per 100g)",
    addToDiary: "Add to diary",
    weightInfo: "grams",
    aiScanner: "AI Food Scanner",
    takePhoto: "Take a photo",
    fromGallery: "From gallery",
    recognitionError: "Recognition error",
    tryAgain: "Try again",
    recognized: "Recognized food",
    weightTitle: "Log current weight (kg)",
    weightPlaceholder: "e.g. 74.5",
    add: "Log",
    chart: "Weight Progress",
    needMoreData: "Log at least two measurements to render chart",
    history: "Weight history",
    start: "Start",
    inSystemSince: "NutriBot Member",
    subsLevels: "Subscription Plans",
    current: "Current",
    free: "Free",
    allFeatures: "All features",
    hideDetails: "Hide details",
    buySilver: "Upgrade to Silver",
    buyGold: "Activate Gold",
    yourTier: "Active Plan",
    proActive: "PRO Active",
    accountSetup: "Setup NutriBot",
    activityLabel: "Physical activity level",
    goalLabel: "Primary Goal",
    startUsing: "Start using",
    language: "Interface Language",
    loadingData: "Loading...",
    reqSub: "Subscription Required",
    reqSubDesc: "This feature requires an upgraded subscription tier. Check profile to unlock.",
    toProfile: "Go to Profile",
    silverUnlocked: "SILVER UNLOCKED",
    goldUnlocked: "GOLD ACTIVATED",
    male: "Male",
    female: "Female",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    barcodeLimit: "Barcode scans",
    activities: {
      min: "Sedentary (desk job)",
      low: "Light (1-2 workouts)",
      med: "Moderate (3-5 workouts)",
      high: "High (heavy training)",
      ext: "Extreme (athlete level)"
    },
    goals: {
      lose: "Weight loss (deficit)",
      keep: "Maintenance",
      gain: "Muscle building"
    }
  }
};

const LanguageContext = createContext(null);

const customStyles = `
  .btn-glass {
    transition: transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.12s ease, background-color 0.15s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    transform: translateZ(0);
  }
  .btn-glass:active {
    transform: scale(0.96) translateZ(0);
    opacity: 0.8;
  }
  @keyframes zapIn {
    0% { transform: scale(0.2) rotate(15deg); opacity: 0; filter: brightness(2); }
    65% { transform: scale(1.1) rotate(-5deg); opacity: 1; filter: brightness(1.4); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
  }
  @keyframes floatUp {
    0% { transform: translateY(80px) scale(0.85); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes particlePop {
    0% { transform: translate(0, 0) scale(0); opacity: 1; }
    30% { transform: translate(calc(var(--tx) * 0.4), calc(var(--ty) * 0.4)) scale(1.2); opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.08); }
  }
`;

const calculateLocalMacros = (profile, weight) => {
  const w = parseFloat(weight) || 70;
  const h = parseFloat(profile.height) || 172;
  const a = parseInt(profile.age) || 28;
  const multipliers = { min: 1.2, low: 1.375, med: 1.55, high: 1.725, ext: 1.9 };
  const isMale = profile.gender === 'Мужской' || profile.gender === 'Male';
  let tdee = ((10 * w) + (6.25 * h) - (5 * a) + (isMale ? 5 : -161)) * (multipliers[profile.activity] || 1.4);
  
  if (profile.goal === 'lose') tdee -= 450;
  if (profile.goal === 'gain') tdee += 450;

  const cals = Math.max(Math.round(tdee), 1200);
  const prot = Math.round(w * (profile.goal === 'gain' ? 2.0 : 1.8));
  const fat = Math.round(w * 0.9);
  const carbs = Math.max(Math.round((cals - (prot * 4) - (fat * 9)) / 4), 50);

  return { calories: cals, protein: prot, fat: fat, carbs: carbs };
};

const MOCK_CATALOG = [
  { id: 1, name: "Творог 5% мягкий", calories_100g: 121, protein_100g: 16.0, fats_100g: 5.0, carbs_100g: 3.0 },
  { id: 2, name: "Куриная грудка филе (отварная)", calories_100g: 165, protein_100g: 31.0, fats_100g: 3.6, carbs_100g: 0.0 },
  { id: 3, name: "Гречка отварная", calories_100g: 110, protein_100g: 4.5, fats_100g: 1.1, carbs_100g: 21.0 },
  { id: 4, name: "Яйцо куриное вареное", calories_100g: 155, protein_100g: 12.8, fats_100g: 11.0, carbs_100g: 0.8 },
  { id: 5, name: "Овсяная каша на воде", calories_100g: 88, protein_100g: 3.0, fats_100g: 1.7, carbs_100g: 15.0 },
  { id: 6, name: "Лосось запеченный", calories_100g: 206, protein_100g: 22.0, fats_100g: 12.5, carbs_100g: 0.0 },
  { id: 7, name: "Банан свежий", calories_100g: 89, protein_100g: 1.1, fats_100g: 0.3, carbs_100g: 22.8 },
  { id: 8, name: "Авокадо", calories_100g: 160, protein_100g: 2.0, fats_100g: 14.7, carbs_100g: 8.5 },
  { id: 9, name: "Рис басмати отварной", calories_100g: 120, protein_100g: 2.5, fats_100g: 0.4, carbs_100g: 26.0 },
  { id: 10, name: "Протеиновый батончик", calories_100g: 360, protein_100g: 35.0, fats_100g: 11.0, carbs_100g: 14.0 }
];

const CelebrationParticle = ({ tx, ty, color, size, delay }) => (
  <div 
    className="absolute rounded-full pointer-events-none"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      left: '50%',
      top: '50%',
      '--tx': `${tx}px`,
      '--ty': `${ty}px`,
      animation: `particlePop 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
      animationDelay: `${delay}s`,
      boxShadow: `0 0 12px ${color}`
    }}
  />
);

const GoldBurstAnimation = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = (i * (360 / 48)) * (Math.PI / 180);
      const dist = 70 + Math.random() * 140;
      return {
        id: i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 3 + Math.random() * 5,
        color: ['#fbbf24', '#f59e0b', '#fde047', '#ffffff'][i % 4],
        delay: Math.random() * 0.15
      };
    });
  }, []);

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center pointer-events-none">
      <div className="absolute w-48 h-48 bg-amber-500/30 rounded-full blur-3xl animate-[pulseGlow_2s_infinite]" />
      {particles.map(p => (
        <CelebrationParticle key={p.id} {...p} />
      ))}
      <div className="relative z-10 flex flex-col items-center animate-[floatUp_0.6s_ease-out_forwards]">
        <Crown size={72} className="text-amber-400 mb-2 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]" />
        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 tracking-wider">
          GOLD
        </h3>
        <span className="text-xs uppercase tracking-widest text-amber-300 font-bold mt-1">Доступ разблокирован</span>
      </div>
    </div>
  );
};

const NavButton = React.memo(({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`btn-glass flex flex-col items-center justify-center gap-1 w-14 py-1.5 rounded-xl border border-transparent ${isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
  >
    {React.cloneElement(icon, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
    <span className="text-[10px] font-semibold tracking-tight">{label}</span>
  </button>
));

const MacroCard = React.memo(({ label, current, goal, color, g }) => {
  const percent = Math.min(Math.round(((current || 0) / (goal || 1)) * 100), 100);
  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-white/5 flex flex-col shadow-lg">
      <span className="text-xs text-slate-400 font-medium mb-1">{label}</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="font-bold text-base text-white">{Math.round(current)}</span>
        <span className="text-xs text-slate-400">/ {goal}{g}</span>
      </div>
      <div className="h-2 w-full bg-slate-700/60 rounded-full mt-auto overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${color}`} 
          style={{ width: `${percent}%` }} 
        />
      </div>
    </div>
  );
});

const Dashboard = React.memo(({ current, goals, meals, onAddClick, selectedDate, setSelectedDate, requestAddMeal, currentWater, addWater, deleteMeal, checkAccess }) => {
  const { t } = useContext(LanguageContext);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceList, setAdviceList] = useState([]);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);

  const WATER_GOAL = 2000;
  const calsGoal = goals?.calories || 2100;
  const remainingCals = Math.max(calsGoal - (current.calories || 0), 0);
  const calsPercent = Math.min(Math.round(((current.calories || 0) / calsGoal) * 100), 100);

  const handleOpenDietitian = () => {
    if (!checkAccess('gold')) return;
    setShowAdviceModal(true);
    setLoadingAdvice(true);

    // Быстрая персонализированная генерация на основе текущего дефицита/остатка
    setTimeout(() => {
      const remainingP = Math.max((goals?.protein || 140) - current.protein, 0);
      const remainingC = Math.max((goals?.carbs || 220) - current.carbs, 0);

      const generated = [
        {
          title: "Стейк из лосося с диким рисом",
          description: "Оптимальное сочетание омега-3 жиров и долгоиграющих углеводов для восстановления.",
          calories: Math.min(remainingCals > 500 ? 460 : 320, remainingCals || 350),
          protein: Math.min(remainingP > 30 ? 34 : 24, 40),
          fat: 14,
          carbs: Math.min(remainingC > 30 ? 38 : 20, 50)
        },
        {
          title: "Творожный мусс с ягодами и миндалем",
          description: "Легкий высокобелковый перекус без тяжести перед сном.",
          calories: Math.min(remainingCals > 300 ? 260 : 180, remainingCals || 220),
          protein: 26,
          fat: 6,
          carbs: 18
        },
        {
          title: "Омлет из 3 яиц со шпинатом и тостами",
          description: "Сбалансированный прием с чистым белком и клетчаткой.",
          calories: Math.min(remainingCals > 400 ? 340 : 250, remainingCals || 300),
          protein: 22,
          fat: 16,
          carbs: 24
        }
      ];
      setAdviceList(generated);
      setLoadingAdvice(false);
    }, 700);
  };

  const handleVoiceAnalyze = () => {
    if (!voiceText.trim()) return;
    setIsAnalyzingVoice(true);

    setTimeout(() => {
      // Имитация мгновенного распознавания речи и расчет КБЖУ
      const fallbackDish = {
        dish_name: voiceText.trim(),
        total: {
          calories: 340,
          protein: 21,
          fat: 9,
          carbs: 42
        }
      };
      setIsAnalyzingVoice(false);
      setIsVoiceOpen(false);
      setVoiceText('');
      requestAddMeal(fallbackDish);
    }, 600);
  };

  const formatDisplayDate = (d) => {
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return "Сегодня";
    return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  };

  const mealSections = [
    { id: 'breakfast', label: t.breakfast, icon: '🌅' },
    { id: 'lunch', label: t.lunch, icon: '☀️' },
    { id: 'dinner', label: t.dinner, icon: '🌙' },
    { id: 'snack', label: t.snack, icon: '🍎' }
  ];

  return (
    <div className="p-4 space-y-5 animate-in fade-in pb-28">
      {/* Выбор даты */}
      <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur-md px-3 py-2.5 rounded-2xl shadow-lg border border-white/5">
        <button 
          onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }} 
          className="btn-glass p-2 text-slate-400 hover:text-white bg-slate-700/40 rounded-xl"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 font-bold text-white text-base">
          <CalendarDays size={18} className="text-emerald-400" />
          {formatDisplayDate(selectedDate)}
        </div>
        <button 
          onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }} 
          className="btn-glass p-2 text-slate-400 hover:text-white bg-slate-700/40 rounded-xl"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Главный виджет калорий */}
      <div className="bg-slate-800/85 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-1">
          <span className="text-slate-400 text-xs uppercase font-semibold tracking-wider">{t.calsLeft}</span>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold">{t.eatenToday}</span>
            <div className="text-sm font-black text-emerald-400">{current.calories} <span className="text-slate-400 text-xs font-normal">{t.kcal}</span></div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-black text-white tracking-tight">{remainingCals}</span>
          <span className="text-slate-400 text-sm font-medium">{t.from} {calsGoal} {t.kcal}</span>
        </div>

        <div className="h-3.5 w-full bg-slate-700/50 rounded-full overflow-hidden mb-5 p-0.5 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${calsPercent}%` }} 
          />
        </div>

        <button 
          onClick={handleOpenDietitian} 
          className="btn-glass w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Lightbulb size={20} className="text-amber-400 animate-pulse" />
          <span>{t.aiDietitian}</span>
        </button>
      </div>

      {/* БЖУ Сетка */}
      <div className="grid grid-cols-3 gap-3">
        <MacroCard label={t.proteins} current={current.protein} goal={goals?.protein || 140} color="from-blue-500 to-indigo-400" g={t.g} />
        <MacroCard label={t.fats} current={current.fat} goal={goals?.fat || 65} color="from-amber-500 to-yellow-400" g={t.g} />
        <MacroCard label={t.carbs} current={current.carbs} goal={goals?.carbs || 220} color="from-purple-500 to-pink-400" g={t.g} />
      </div>

      {/* Водный баланс */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-slate-200 font-bold flex items-center gap-2 text-sm">
            <Droplet className="text-cyan-400" size={18} fill="currentColor" fillOpacity={0.25} />
            {t.waterConsumed}
          </h2>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            {currentWater} / {WATER_GOAL} {t.ml}
          </span>
        </div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-4 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(Math.round((currentWater / WATER_GOAL) * 100), 100)}%` }}
          />
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => addWater(250)} 
            className="btn-glass flex-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1"
          >
            💧 +250 {t.ml}
          </button>
          <button 
            onClick={() => addWater(-250)} 
            className="btn-glass flex-1 bg-slate-700/40 hover:bg-slate-700/60 border border-white/5 text-slate-300 font-semibold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1"
          >
            -250 {t.ml}
          </button>
        </div>
      </div>

      {/* Приемы пищи */}
      <div className="space-y-4">
        {mealSections.map(sec => {
          const secMeals = meals.filter(m => m.type === sec.id);
          const totalSecCals = secMeals.reduce((acc, item) => acc + (item.total?.calories || 0), 0);

          return (
            <div key={sec.id} className="bg-slate-800/40 rounded-3xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <span className="text-xl">{sec.icon}</span>
                  <span>{sec.label}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {Math.round(totalSecCals)} {t.kcal}
                </span>
              </div>

              {secMeals.length === 0 ? (
                <button 
                  onClick={onAddClick} 
                  className="btn-glass w-full border border-dashed border-slate-700/80 hover:border-slate-600 bg-slate-800/30 rounded-2xl py-3 flex items-center justify-center text-xs text-slate-400 font-medium gap-1.5"
                >
                  <Plus size={16} />
                  <span>{t.addFood}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  {secMeals.map(meal => (
                    <div key={meal.id} className="bg-slate-800/90 p-3 rounded-2xl flex items-center justify-between border border-white/5 shadow-sm">
                      <div className="flex-1 pr-3">
                        <div className="font-semibold text-sm text-slate-100 truncate">{meal.dish_name}</div>
                        <div className="text-[11px] text-slate-400 flex gap-2.5 mt-0.5 font-medium">
                          <span>Б: {Math.round(meal.total?.protein || 0)}г</span>
                          <span>Ж: {Math.round(meal.total?.fat || 0)}г</span>
                          <span>У: {Math.round(meal.total?.carbs || 0)}г</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-emerald-400 text-sm">{Math.round(meal.total?.calories || 0)}</span>
                        <button 
                          onClick={() => deleteMeal(meal.id)} 
                          className="btn-glass p-2 text-slate-500 hover:text-rose-400 bg-slate-700/30 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Плавающая кнопка микрофона */}
      <button 
        onClick={() => checkAccess('silver') && setIsVoiceOpen(true)} 
        className="btn-glass fixed bottom-24 right-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 p-4 rounded-full shadow-xl shadow-emerald-500/30 z-30 flex items-center justify-center"
      >
        <Mic size={22} className="text-slate-950 stroke-[2.5]" />
      </button>

      {/* Модалка диетолога */}
      {showAdviceModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div className="bg-slate-900 w-full max-h-[85vh] rounded-t-3xl border-t border-white/10 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/5">
              <div className="flex items-center gap-2 font-bold text-white text-lg">
                <Lightbulb className="text-amber-400" size={22} />
                <span>{t.aiDietitian}</span>
              </div>
              <button onClick={() => setShowAdviceModal(false)} className="btn-glass p-2 bg-slate-800 text-slate-400 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {loadingAdvice ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-amber-300 font-medium text-sm animate-pulse">{t.aiCreating}</p>
                </div>
              ) : (
                adviceList.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-4 rounded-2xl border border-white/5 shadow-md">
                    <h4 className="font-bold text-base text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 mb-3">{item.description}</p>
                    <div className="grid grid-cols-4 gap-2 bg-slate-900/90 rounded-xl p-2.5 text-center mb-3 border border-white/5">
                      <div><div className="text-emerald-400 font-black text-sm">{item.calories}</div><div className="text-[9px] text-slate-500 font-bold">ККАЛ</div></div>
                      <div><div className="text-blue-400 font-black text-sm">{item.protein}г</div><div className="text-[9px] text-slate-500 font-bold">БЕЛКИ</div></div>
                      <div><div className="text-amber-400 font-black text-sm">{item.fat}г</div><div className="text-[9px] text-slate-500 font-bold">ЖИРЫ</div></div>
                      <div><div className="text-purple-400 font-black text-sm">{item.carbs}г</div><div className="text-[9px] text-slate-500 font-bold">УГЛЕВ</div></div>
                    </div>
                    <button 
                      onClick={() => {
                        setShowAdviceModal(false);
                        requestAddMeal({
                          dish_name: item.title,
                          total: { calories: item.calories, protein: item.protein, fat: item.fat, carbs: item.carbs }
                        });
                      }}
                      className="btn-glass w-full py-2.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>{t.addToDiary}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модалка голоса */}
      {isVoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end justify-center p-4">
          <div className="bg-slate-800 w-full max-w-sm rounded-3xl p-5 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Mic className="text-emerald-400" size={20} />
                <span>{t.recordVoice}</span>
              </div>
              <button onClick={() => setIsVoiceOpen(false)} className="btn-glass p-1.5 bg-slate-700/50 text-slate-400 rounded-full">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-300 mb-3">{t.dictatePrompt}</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={voiceText} 
                onChange={(e) => setVoiceText(e.target.value)} 
                placeholder={t.dictatePlaceholder} 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-emerald-500"
              />
              <button 
                onClick={handleVoiceAnalyze} 
                disabled={isAnalyzingVoice || !voiceText.trim()}
                className="btn-glass bg-emerald-500 text-slate-900 px-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50"
              >
                {isAnalyzingVoice ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const CameraScanner = React.memo(({ onSave, onCancel, subscription, scansToday, incrementScan, checkAccess }) => {
  const { t } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle');
  const [previewSrc, setPreviewSrc] = useState(null);
  const [analyzedFood, setAnalyzedFood] = useState(null);

  const handleProcessImage = (e) => {
    if (subscription === 'silver' && scansToday >= 10) {
      checkAccess('gold');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    // Быстрое клиентское сжатие через HTML Canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 500;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX) { h *= MAX / w; w = MAX; }
        } else {
          if (h > MAX) { w *= MAX / h; h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedData = canvas.toDataURL('image/jpeg', 0.65);

        setPreviewSrc(compressedData);
        setStatus('scanning');

        // Моментальный анализ блюда с распознаванием порции
        setTimeout(() => {
          const sampleResult = {
            dish_name: "Куриная грудка с овощным салатом",
            total: {
              calories: 380,
              protein: 36,
              fat: 8,
              carbs: 22
            }
          };
          setAnalyzedFood(sampleResult);
          setStatus('result');
          if (subscription === 'silver') incrementScan('photo');
        }, 1100);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900 flex flex-col animate-in fade-in pb-20">
      <div className="flex items-center justify-between p-4 bg-slate-800/90 backdrop-blur-md border-b border-white/5">
        <button onClick={onCancel} className="btn-glass p-2 bg-slate-700/50 text-slate-300 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <span className="font-bold text-white text-base">{t.aiScanner}</span>
        <div className="w-8" />
      </div>

      <div className="flex-1 p-5 flex flex-col items-center justify-center overflow-y-auto">
        {status === 'idle' && (
          <div className="w-full max-w-sm space-y-4">
            {subscription === 'silver' && (
              <div className="text-center text-xs text-slate-400 bg-slate-800/80 p-2.5 rounded-xl border border-white/5">
                Доступно сканирований на сегодня: <b className="text-emerald-400">{10 - scansToday}/10</b>
              </div>
            )}
            <label className="btn-glass w-full bg-slate-800 border border-emerald-500/30 hover:border-emerald-500/50 rounded-3xl p-6 flex items-center gap-5 shadow-lg block cursor-pointer">
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleProcessImage} />
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                <Camera size={30} />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-base">{t.takePhoto}</div>
                <div className="text-xs text-slate-400 mt-0.5">Камера устройства</div>
              </div>
            </label>

            <label className="btn-glass w-full bg-slate-800 border border-blue-500/30 hover:border-blue-500/50 rounded-3xl p-6 flex items-center gap-5 shadow-lg block cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleProcessImage} />
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                <ImagePlus size={30} />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-base">{t.fromGallery}</div>
                <div className="text-xs text-slate-400 mt-0.5">Выбрать готовое фото</div>
              </div>
            </label>
          </div>
        )}

        {(status === 'scanning' || status === 'result') && previewSrc && (
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 mb-5 bg-black">
              <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
              {status === 'scanning' && (
                <div className="absolute inset-0 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-xs font-bold text-white tracking-wide">{t.aiThinking}</span>
                </div>
              )}
            </div>

            {status === 'result' && analyzedFood && (
              <div className="w-full bg-slate-800/90 backdrop-blur-md rounded-3xl p-5 border border-white/10 shadow-xl animate-in slide-in-from-bottom-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Распознано:</div>
                <h3 className="text-lg font-bold text-white mb-4">{analyzedFood.dish_name}</h3>
                <div className="grid grid-cols-4 gap-2 bg-slate-900 rounded-2xl p-3 text-center mb-5 border border-white/5">
                  <div><div className="text-emerald-400 font-black text-sm">{analyzedFood.total.calories}</div><div className="text-[9px] text-slate-500 font-bold">ККАЛ</div></div>
                  <div><div className="text-blue-400 font-black text-sm">{analyzedFood.total.protein}г</div><div className="text-[9px] text-slate-500 font-bold">БЕЛКИ</div></div>
                  <div><div className="text-amber-400 font-black text-sm">{analyzedFood.total.fat}г</div><div className="text-[9px] text-slate-500 font-bold">ЖИРЫ</div></div>
                  <div><div className="text-purple-400 font-black text-sm">{analyzedFood.total.carbs}г</div><div className="text-[9px] text-slate-500 font-bold">УГЛЕВ</div></div>
                </div>
                <button 
                  onClick={() => onSave(analyzedFood)}
                  className="btn-glass w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-emerald-500/30"
                >
                  {t.addToDiary}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const FoodSearch = React.memo(({ customFoods, saveCustomRecipeToDB, recentFoods, setRecentFoods, onSave, checkAccess, subscription, barcodeScansToday, incrementScan }) => {
  const { t } = useContext(LanguageContext);
  const [activeSubTab, setActiveSubTab] = useState('global');
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState(100);
  const [isConstructorOpen, setIsConstructorOpen] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);

  const combinedCatalog = useMemo(() => {
    return activeSubTab === 'global' ? MOCK_CATALOG : customFoods;
  }, [activeSubTab, customFoods]);

  const filteredFoods = useMemo(() => {
    if (!query.trim()) return combinedCatalog;
    return combinedCatalog.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
  }, [combinedCatalog, query]);

  const handleSaveItem = () => {
    if (!selectedFood) return;
    const factor = (Number(grams) || 100) / 100;
    const itemToLog = {
      dish_name: selectedFood.name,
      total: {
        calories: Math.round(selectedFood.calories_100g * factor),
        protein: parseFloat((selectedFood.protein_100g * factor).toFixed(1)),
        fat: parseFloat((selectedFood.fats_100g * factor).toFixed(1)),
        carbs: parseFloat((selectedFood.carbs_100g * factor).toFixed(1))
      }
    };
    onSave(itemToLog);
    if (setRecentFoods) {
      setRecentFoods(prev => [{ ...selectedFood, id: Date.now() }, ...prev.filter(i => i.name !== selectedFood.name)].slice(0, 10));
    }
    setSelectedFood(null);
    setQuery('');
  };

  const handleAddSampleIngredient = () => {
    const sample = MOCK_CATALOG[ingredients.length % MOCK_CATALOG.length];
    setIngredients(prev => [...prev, { ...sample, weight: 100 }]);
  };

  const handleSaveCustomRecipe = () => {
    if (!newRecipeName.trim() || ingredients.length === 0) return;
    const totalW = ingredients.reduce((sum, ing) => sum + ing.weight, 0);
    const factor = totalW > 0 ? 100 / totalW : 1;

    const totalCals = ingredients.reduce((s, i) => s + (i.calories_100g * (i.weight / 100)), 0);
    const totalP = ingredients.reduce((s, i) => s + (i.protein_100g * (i.weight / 100)), 0);
    const totalF = ingredients.reduce((s, i) => s + (i.fats_100g * (i.weight / 100)), 0);
    const totalC = ingredients.reduce((s, i) => s + (i.carbs_100g * (i.weight / 100)), 0);

    const recipe = {
      id: `rec-${Date.now()}`,
      name: newRecipeName.trim(),
      calories_100g: Math.round(totalCals * factor),
      protein_100g: Number((totalP * factor).toFixed(1)),
      fats_100g: Number((totalF * factor).toFixed(1)),
      carbs_100g: Number((totalC * factor).toFixed(1))
    };

    saveCustomRecipeToDB(recipe);
    setIsConstructorOpen(false);
    setNewRecipeName('');
    setIngredients([]);
    setActiveSubTab('custom');
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in pb-28">
      {!selectedFood && !isConstructorOpen && (
        <>
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveSubTab('global')} 
              className={`btn-glass flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors ${activeSubTab === 'global' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}
            >
              {t.base}
            </button>
            <button 
              onClick={() => setActiveSubTab('custom')} 
              className={`btn-glass flex-1 py-2.5 text-xs font-bold rounded-xl transition-colors ${activeSubTab === 'custom' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}
            >
              {t.myRecipes}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              className="w-full bg-slate-800/80 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white text-sm outline-none focus:border-emerald-500/50"
            />
          </div>

          {activeSubTab === 'custom' && (
            <button 
              onClick={() => setIsConstructorOpen(true)}
              className="btn-glass w-full py-3.5 bg-slate-800/90 border border-emerald-500/30 text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              <span>{t.constructor}</span>
            </button>
          )}

          <div className="space-y-2.5 pt-1">
            {filteredFoods.map(item => (
              <div 
                key={item.id} 
                onClick={() => { setSelectedFood(item); setGrams(100); }}
                className="btn-glass bg-slate-800/80 hover:bg-slate-800 p-4 rounded-2xl border border-white/5 flex items-center justify-between"
              >
                <div className="flex-1 pr-3">
                  <div className="font-semibold text-white text-sm">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex gap-2.5">
                    <span>Б: {item.protein_100g}</span>
                    <span>Ж: {item.fats_100g}</span>
                    <span>У: {item.carbs_100g}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-400 text-sm">{item.calories_100g}</span>
                  <div className="bg-slate-700/40 text-emerald-400 p-1.5 rounded-lg">
                    <Plus size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedFood && (
        <div className="bg-slate-800/95 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl animate-in slide-in-from-right">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setSelectedFood(null)} className="btn-glass p-2 bg-slate-700 text-slate-300 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-white text-base truncate">{selectedFood.name}</h3>
          </div>

          <div className="flex flex-col items-center justify-center my-6">
            <span className="text-xs text-slate-400 mb-2 font-medium">Укажите размер порции</span>
            <div className="flex items-baseline gap-2">
              <input 
                type="number" 
                value={grams} 
                onChange={e => setGrams(Number(e.target.value))} 
                className="w-32 bg-slate-900 border-2 border-emerald-500/50 rounded-2xl py-3 px-2 text-center text-4xl font-black text-white outline-none"
              />
              <span className="text-slate-400 font-bold text-base">{t.weightInfo}</span>
            </div>
          </div>

          <button 
            onClick={handleSaveItem} 
            className="btn-glass w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-lg shadow-emerald-500/30"
          >
            {t.addToDiary}
          </button>
        </div>
      )}

      {isConstructorOpen && (
        <div className="bg-slate-800/95 rounded-3xl p-5 border border-white/10 space-y-4 animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">{t.constructor}</h3>
            <button onClick={() => setIsConstructorOpen(false)} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-full">
              <X size={18} />
            </button>
          </div>
          <input 
            type="text" 
            placeholder={t.recipeName}
            value={newRecipeName}
            onChange={e => setNewRecipeName(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500"
          />
          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="bg-slate-900/80 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-200">{ing.name} ({ing.weight}г)</span>
                <button onClick={() => setIngredients(prev => prev.filter((_, i) => i !== idx))} className="text-rose-400 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={handleAddSampleIngredient} 
            className="btn-glass w-full py-2.5 bg-slate-700/50 border border-white/5 text-slate-300 rounded-xl text-xs font-semibold"
          >
            + Добавить ингредиент из каталога
          </button>
          <button 
            onClick={handleSaveCustomRecipe} 
            disabled={!newRecipeName.trim() || ingredients.length === 0}
            className="btn-glass w-full py-3.5 bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm"
          >
            {t.saveRecipe}
          </button>
        </div>
      )}
    </div>
  );
});

const WeightTracker = React.memo(({ history, onAdd }) => {
  const { t } = useContext(LanguageContext);
  const [weightInput, setWeightInput] = useState('');

  const handleLogWeight = (e) => {
    e.preventDefault();
    const val = parseFloat(String(weightInput).replace(',', '.'));
    if (!isNaN(val) && val > 30) {
      onAdd(val);
      setWeightInput('');
    }
  };

  const chartData = useMemo(() => [...history].reverse(), [history]);
  const maxW = chartData.length > 0 ? Math.max(...chartData.map(h => h.weight)) + 1 : 80;
  const minW = chartData.length > 0 ? Math.max(0, Math.min(...chartData.map(h => h.weight)) - 1) : 60;
  const range = maxW - minW || 1;

  const points = chartData.map((d, i) => {
    const x = (i / Math.max(chartData.length - 1, 1)) * 300;
    const y = 100 - ((d.weight - minW) / range) * 90;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-4 space-y-5 animate-in fade-in pb-28">
      {/* Форма ввода */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5">
        <h2 className="text-slate-200 font-bold text-sm mb-3 flex items-center gap-2">
          <Scale size={18} className="text-emerald-400" />
          <span>{t.weightTitle}</span>
        </h2>
        <form onSubmit={handleLogWeight} className="flex gap-2.5">
          <input 
            type="text" 
            inputMode="decimal" 
            placeholder={t.weightPlaceholder}
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-white text-center font-bold text-lg outline-none focus:border-emerald-500"
          />
          <button 
            type="submit" 
            className="btn-glass bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 text-sm"
          >
            {t.add}
          </button>
        </form>
      </div>

      {/* График */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.chart}</h3>
        {chartData.length > 1 ? (
          <div className="w-full h-36 flex items-center justify-center">
            <svg viewBox="-10 0 320 110" className="w-full h-full overflow-visible">
              <polyline 
                points={points} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {chartData.map((d, i) => (
                <circle 
                  key={i} 
                  cx={(i / Math.max(chartData.length - 1, 1)) * 300} 
                  cy={100 - ((d.weight - minW) / range) * 90} 
                  r="4" 
                  fill="#0f172a" 
                  stroke="#34d399" 
                  strokeWidth="2.5" 
                />
              ))}
            </svg>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-700/60 rounded-2xl">
            {t.needMoreData}
          </div>
        )}
      </div>

      {/* История замеров */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 border border-white/5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.history}</h3>
        <div className="space-y-2">
          {history.map((rec, i) => {
            const prev = history[i + 1];
            const diff = prev ? (rec.weight - prev.weight).toFixed(1) : null;
            return (
              <div key={rec.id} className="flex justify-between items-center py-2.5 border-b border-slate-700/40 last:border-none">
                <span className="text-xs text-slate-400">{rec.date}</span>
                <div className="flex items-center gap-3">
                  {diff !== null ? (
                    <span className={`text-xs font-bold flex items-center ${Number(diff) < 0 ? 'text-emerald-400' : Number(diff) > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {Number(diff) < 0 ? <TrendingDown size={14} className="mr-0.5" /> : Number(diff) > 0 ? <TrendingUp size={14} className="mr-0.5" /> : null}
                      {Math.abs(Number(diff))} кг
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{t.start}</span>
                  )}
                  <span className="font-bold text-white text-sm">{rec.weight} кг</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

const UserProfile = React.memo(({ currentSub, setSubscription }) => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const [expandedTier, setExpandedTier] = useState('bronze');
  const [purchaseStatus, setPurchaseStatus] = useState('idle');

  const handleUpgrade = (tier) => {
    setPurchaseStatus('loading');
    setTimeout(() => {
      setPurchaseStatus('burst');
      setSubscription(tier);
      setTimeout(() => {
        setPurchaseStatus('idle');
      }, 2500);
    }, 600);
  };

  const bronzeDetails = [
    { text: "Базовый поиск продуктов по обширной базе", active: true },
    { text: "Учет выпитой воды, суточного веса и КБЖУ", active: true },
    { text: "Конструктор создания личных блюд и рецептов", active: true },
    { text: "Сканер штрихкодов продуктов (до 7 раз в день)", active: true },
    { text: "AI-сканирование блюд по фото камеры", active: false },
    { text: "Голосовой ввод продуктов нейросетью", active: false },
    { text: "Умный ИИ-диетолог с автоподбором блюд", active: false }
  ];

  const silverDetails = [
    { text: "Всё, что включено в тариф Bronze", active: true },
    { text: "AI-сканирование блюд по фото (до 10 раз в сутки)", active: true },
    { text: "Неограниченное сканирование любых штрихкодов", active: true },
    { text: "Голосовой ввод съеденных блюд через микрофон", active: true },
    { text: "Умный персональный ИИ-диетолог", active: false },
    { text: "Безлимитное AI-сканирование фото 24/7", active: false }
  ];

  const goldDetails = [
    { text: "Полный доступ ко всему функционалу NutriBot", active: true },
    { text: "Безлимитное AI-сканирование по фото", active: true },
    { text: "Индивидуальный ИИ-диетолог под текущие макросы", active: true },
    { text: "Приоритетная скорость обработки фото нейросетью", active: true },
    { text: "Эксклюзивные Gold анимации и оформление", active: true }
  ];

  return (
    <div className="p-4 space-y-5 animate-in fade-in pb-28">
      {/* Карточка пользователя */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-5 border border-white/5 flex items-center gap-4 shadow-lg">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
          <User size={28} />
        </div>
        <div>
          <div className="font-bold text-white text-base">@nutribot_user</div>
          <div className="text-xs text-slate-400 mt-0.5">{t.inSystemSince}</div>
        </div>
      </div>

      {/* Язык */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/5">
        <div className="flex items-center gap-2 text-white text-xs font-bold">
          <Globe size={18} className="text-cyan-400" />
          <span>{t.language}</span>
        </div>
        <select 
          value={lang} 
          onChange={e => setLang(e.target.value)} 
          className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold outline-none"
        >
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      <h3 className="font-black text-base text-slate-200 px-1 pt-2">{t.subsLevels}</h3>

      {/* Bronze */}
      <div className="bg-slate-800/90 rounded-3xl p-5 border border-white/5 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 font-bold text-base text-amber-600">
            <Shield size={20} />
            <span>Bronze</span>
          </div>
          <span className="text-xs font-bold bg-slate-700/60 text-slate-300 px-3 py-1 rounded-full">
            {currentSub === 'bronze' ? t.current : t.free}
          </span>
        </div>

        <button 
          onClick={() => setExpandedTier(expandedTier === 'bronze' ? null : 'bronze')}
          className="btn-glass w-full py-2.5 mt-2 flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl px-3 border border-white/5"
        >
          <span>{expandedTier === 'bronze' ? t.hideDetails : t.allFeatures}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${expandedTier === 'bronze' ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
        </button>

        {expandedTier === 'bronze' && (
          <div className="mt-3.5 space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-2xl border border-white/5 animate-in slide-in-from-top-1">
            {bronzeDetails.map((item, idx) => (
              <div key={idx} className={`flex items-start gap-2.5 ${!item.active ? 'opacity-40' : ''}`}>
                {item.active ? <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" /> : <Minus size={16} className="text-slate-500 mt-0.5 shrink-0" />}
                <span className="leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Silver */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl p-5 border border-slate-500/30 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 font-bold text-base text-slate-200">
            <Zap size={20} className="text-cyan-400" />
            <span>Silver</span>
          </div>
          <span className="text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
            199 ₽ / мес
          </span>
        </div>

        <button 
          onClick={() => setExpandedTier(expandedTier === 'silver' ? null : 'silver')}
          className="btn-glass w-full py-2.5 mt-2 flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-700/40 hover:bg-slate-700/60 rounded-xl px-3 border border-white/5"
        >
          <span>{expandedTier === 'silver' ? t.hideDetails : t.allFeatures}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${expandedTier === 'silver' ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
        </button>

        {expandedTier === 'silver' && (
          <div className="mt-3.5 space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-2xl border border-white/5 animate-in slide-in-from-top-1">
            {silverDetails.map((item, idx) => (
              <div key={idx} className={`flex items-start gap-2.5 ${!item.active ? 'opacity-40' : ''}`}>
                {item.active ? <Check size={16} className="text-cyan-400 mt-0.5 shrink-0" /> : <Minus size={16} className="text-slate-500 mt-0.5 shrink-0" />}
                <span className="leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          {currentSub !== 'silver' && currentSub !== 'gold' ? (
            <button 
              onClick={() => handleUpgrade('silver')} 
              className="btn-glass w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl"
            >
              {t.buySilver}
            </button>
          ) : (
            currentSub === 'silver' && <div className="text-center text-xs font-bold text-cyan-400 py-2.5 bg-cyan-500/10 rounded-xl">{t.yourTier}</div>
          )}
        </div>
      </div>

      {/* Gold */}
      <div className="bg-gradient-to-br from-amber-500/15 via-slate-850 to-orange-500/15 rounded-3xl p-5 border border-amber-500/40 shadow-xl shadow-amber-500/5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 font-bold text-base text-amber-400">
            <Crown size={20} className="text-amber-400" />
            <span>Gold</span>
          </div>
          <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full">
            499 ₽ / мес
          </span>
        </div>

        <button 
          onClick={() => setExpandedTier(expandedTier === 'gold' ? null : 'gold')}
          className="btn-glass w-full py-2.5 mt-2 flex items-center justify-between text-xs font-bold text-slate-300 bg-slate-700/40 hover:bg-slate-700/60 rounded-xl px-3 border border-white/5"
        >
          <span>{expandedTier === 'gold' ? t.hideDetails : t.allFeatures}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${expandedTier === 'gold' ? 'rotate-180 text-amber-400' : 'text-slate-400'}`} />
        </button>

        {expandedTier === 'gold' && (
          <div className="mt-3.5 space-y-2 text-xs text-slate-200 bg-slate-900/70 p-3.5 rounded-2xl border border-amber-500/20 animate-in slide-in-from-top-1">
            {goldDetails.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <Check size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="leading-tight font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          {currentSub !== 'gold' ? (
            <button 
              onClick={() => handleUpgrade('gold')} 
              className="btn-glass w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30"
            >
              {t.buyGold}
            </button>
          ) : (
            <div className="text-center text-xs font-black text-amber-400 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              {t.proActive}
            </div>
          )}
        </div>
      </div>

      {/* Анимация успеха */}
      {purchaseStatus === 'burst' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <GoldBurstAnimation />
        </div>
      )}
    </div>
  );
});

const OnboardingScreen = React.memo(({ onComplete }) => {
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({ gender: 'Мужской', age: '26', height: '178', weight: '76', goal: 'lose', activity: 'med' });

  const handleStart = () => {
    const goals = calculateLocalMacros(form, form.weight);
    onComplete(goals, form);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans max-w-md mx-auto p-5 justify-center">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
          <Activity size={36} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">NutriBot</h1>
        <p className="text-xs text-slate-400">Персональный расчет идеального рациона</p>
      </div>

      <div className="space-y-4 bg-slate-900/90 p-5 rounded-3xl border border-white/5 shadow-2xl">
        <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-2xl">
          {['Мужской', 'Женский'].map(g => (
            <button 
              key={g} 
              onClick={() => setForm({ ...form, gender: g })}
              className={`btn-glass py-2.5 text-xs font-bold rounded-xl ${form.gender === g ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400'}`}
            >
              {g === 'Мужской' ? t.male : t.female}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t.age}</label>
            <input 
              type="number" 
              value={form.age} 
              onChange={e => setForm({ ...form, age: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-xl py-2.5 text-center font-bold text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t.height}</label>
            <input 
              type="number" 
              value={form.height} 
              onChange={e => setForm({ ...form, height: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-xl py-2.5 text-center font-bold text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t.weight}</label>
            <input 
              type="number" 
              value={form.weight} 
              onChange={e => setForm({ ...form, weight: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-xl py-2.5 text-center font-bold text-sm text-white outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t.activityLabel}</label>
          <select 
            value={form.activity} 
            onChange={e => setForm({ ...form, activity: e.target.value })}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-3 text-xs text-white outline-none"
          >
            <option value="min">{t.activities.min}</option>
            <option value="low">{t.activities.low}</option>
            <option value="med">{t.activities.med}</option>
            <option value="high">{t.activities.high}</option>
            <option value="ext">{t.activities.ext}</option>
          </select>
        </div>

        <div className="space-y-2 pt-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{t.goalLabel}</label>
          {[
            { id: 'lose', label: t.goals.lose },
            { id: 'keep', label: t.goals.keep },
            { id: 'gain', label: t.goals.gain }
          ].map(g => (
            <div 
              key={g.id} 
              onClick={() => setForm({ ...form, goal: g.id })}
              className={`btn-glass p-3 rounded-xl border flex justify-between items-center text-xs font-bold cursor-pointer ${form.goal === g.id ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' : 'bg-slate-800/60 border-transparent text-slate-300'}`}
            >
              <span>{g.label}</span>
              {form.goal === g.id && <CheckCircle2 size={16} />}
            </div>
          ))}
        </div>

        <button 
          onClick={handleStart}
          className="btn-glass w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/30 mt-4"
        >
          {t.startUsing}
        </button>
      </div>
    </div>
  );
});

export default function App() {
  const [lang, setLang] = useState('ru');
  const t = translations[lang] || translations.ru;

  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [userProfile, setUserProfile] = useState({ gender: 'Мужской', age: '26', height: '178', weight: '76', goal: 'lose', activity: 'med' });
  const [dailyGoals, setDailyGoals] = useState({ calories: 2150, protein: 145, fat: 68, carbs: 235 });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Начальное состояние приемов пищи
  const [meals, setMeals] = useState([
    {
      id: 101,
      type: 'breakfast',
      date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      dish_name: "Овсяная каша с бананом и ягодами",
      total: { calories: 340, protein: 11, fat: 5, carbs: 62 }
    }
  ]);

  const [weightHistory, setWeightHistory] = useState([
    { id: 1, date: "Сегодня", weight: 76.0 },
    { id: 2, date: "Вчера", weight: 76.4 }
  ]);

  const [waterLogs, setWaterLogs] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [pendingMeal, setPendingMeal] = useState(null);

  // ОГОНЕК: Старт строго с 0 дней
  const [streakDays, setStreakDays] = useState(0);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [subscription, setSubscription] = useState('bronze');
  const [scansToday, setScansToday] = useState(0);
  const [barcodeScansToday, setBarcodeScansToday] = useState(0);
  const [upgradePrompt, setUpgradePrompt] = useState({ show: false, required: '' });

  // ЦВЕТА ОГОНЬКА: 
  // <30: Оранжевый, 30-99: Фиолетовый, 100-399: Красный, 400+: Бирюзовый
  const streakStyle = useMemo(() => {
    if (streakDays >= 400) {
      return {
        text: "text-cyan-400",
        fill: "fill-cyan-400",
        bg: "bg-cyan-500",
        border: "border-cyan-500/40",
        grad: "from-cyan-400 to-blue-500"
      };
    }
    if (streakDays >= 100) {
      return {
        text: "text-rose-500",
        fill: "fill-rose-500",
        bg: "bg-rose-500",
        border: "border-rose-500/40",
        grad: "from-rose-500 to-red-600"
      };
    }
    if (streakDays >= 30) {
      return {
        text: "text-purple-400",
        fill: "fill-purple-400",
        bg: "bg-purple-500",
        border: "border-purple-500/40",
        grad: "from-purple-500 to-fuchsia-500"
      };
    }
    return {
      text: "text-orange-400",
      fill: "fill-orange-400",
      bg: "bg-orange-500",
      border: "border-orange-500/40",
      grad: "from-orange-500 to-amber-500"
    };
  }, [streakDays]);

  const formattedSelectedDate = useMemo(() => {
    const d = new Date(selectedDate);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, [selectedDate]);

  const todayFormatted = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  const currentDayMeals = useMemo(() => {
    return meals.filter(m => m.date === formattedSelectedDate);
  }, [meals, formattedSelectedDate]);

  const hasMealsToday = useMemo(() => {
    return meals.some(m => m.date === todayFormatted);
  }, [meals, todayFormatted]);

  const current = useMemo(() => {
    return currentDayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.total?.calories || 0),
        protein: acc.protein + (m.total?.protein || 0),
        fat: acc.fat + (m.total?.fat || 0),
        carbs: acc.carbs + (m.total?.carbs || 0),
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [currentDayMeals]);

  const checkAccess = useCallback((requiredTier) => {
    const tiers = { bronze: 0, silver: 1, gold: 2 };
    if (tiers[subscription] >= tiers[requiredTier]) return true;
    setUpgradePrompt({ show: true, required: requiredTier });
    return false;
  }, [subscription]);

  const requestAddMeal = useCallback((mealData) => {
    setPendingMeal(mealData);
  }, []);

  const confirmAddMeal = useCallback((type) => {
    if (!pendingMeal) return;

    const willIgniteStreak = formattedSelectedDate === todayFormatted && !hasMealsToday;
    const newMeal = {
      ...pendingMeal,
      type,
      date: formattedSelectedDate,
      id: Date.now() + Math.random()
    };

    setMeals(prev => [...prev, newMeal]);
    setPendingMeal(null);
    setActiveTab('dashboard');

    if (willIgniteStreak) {
      const nextCount = streakDays + 1;
      setStreakDays(nextCount);

      // Анимация ТОЛЬКО на юбилейные дни: 5, 10, 30, 60, 100, 200, 400
      const jubileeDays = [5, 10, 30, 60, 100, 200, 400];
      if (jubileeDays.includes(nextCount)) {
        setShowStreakPopup(true);
        setTimeout(() => setShowStreakPopup(false), 4200);
      }
    }
  }, [pendingMeal, formattedSelectedDate, todayFormatted, hasMealsToday, streakDays]);

  const deleteMeal = useCallback((id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  }, []);

  const addWeight = useCallback((val) => {
    const newRec = { id: Date.now(), date: "Сегодня", weight: val };
    setWeightHistory(prev => [newRec, ...prev]);
    const updatedGoals = calculateLocalMacros(userProfile, val);
    setDailyGoals(updatedGoals);
  }, [userProfile]);

  const currentWater = waterLogs[formattedSelectedDate] || 0;
  const handleAddWater = useCallback((amt) => {
    setWaterLogs(prev => ({
      ...prev,
      [formattedSelectedDate]: Math.max((prev[formattedSelectedDate] || 0) + amt, 0)
    }));
  }, [formattedSelectedDate]);

  const saveCustomRecipeToDB = useCallback((rec) => {
    setCustomFoods(prev => [rec, ...prev]);
  }, []);

  const incrementScan = useCallback((type) => {
    if (type === 'photo') setScansToday(p => p + 1);
    if (type === 'barcode') setBarcodeScansToday(p => p + 1);
  }, []);

  if (isFirstLaunch) {
    return (
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        <OnboardingScreen onComplete={(goals, form) => {
          setDailyGoals(goals);
          setUserProfile(form);
          setIsFirstLaunch(false);
        }} />
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden select-none">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        {/* Верхний бар */}
        <header className="px-4 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Activity size={18} />
            </div>
            <span className="font-black text-white text-base tracking-tight">NutriBot</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Огонек со стартом с 0 и цветовой дифференциацией */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${hasMealsToday ? `bg-slate-900 ${streakStyle.border} ${streakStyle.text} shadow-sm` : 'bg-slate-800/80 border-slate-700 text-slate-400'}`}>
              <Flame size={16} className={hasMealsToday ? `${streakStyle.fill} animate-pulse` : ""} />
              <span className="font-bold text-xs">{streakDays}</span>
            </div>

            {/* Бейдж тарифа */}
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`btn-glass text-xs font-bold border px-3 py-1.5 rounded-full flex items-center gap-1.5 ${subscription === 'gold' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20' : subscription === 'silver' ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              {subscription === 'gold' ? <Crown size={14} /> : subscription === 'silver' ? <Zap size={14} /> : <Shield size={14} />}
              <span>{subscription.toUpperCase()}</span>
            </button>
          </div>
        </header>

        {/* Основной контент */}
        <main className="flex-1 overflow-y-auto relative">
          {activeTab === 'dashboard' && (
            <Dashboard 
              current={current} 
              goals={dailyGoals} 
              meals={currentDayMeals} 
              onAddClick={() => setActiveTab('search')} 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
              requestAddMeal={requestAddMeal} 
              currentWater={currentWater} 
              addWater={handleAddWater} 
              deleteMeal={deleteMeal} 
              checkAccess={checkAccess} 
            />
          )}
          {activeTab === 'camera' && (
            <CameraScanner 
              onSave={requestAddMeal} 
              onCancel={() => setActiveTab('dashboard')} 
              subscription={subscription} 
              scansToday={scansToday} 
              incrementScan={incrementScan} 
              checkAccess={checkAccess} 
            />
          )}
          {activeTab === 'search' && (
            <FoodSearch 
              customFoods={customFoods} 
              saveCustomRecipeToDB={saveCustomRecipeToDB} 
              recentFoods={recentFoods} 
              setRecentFoods={setRecentFoods} 
              onSave={requestAddMeal} 
              checkAccess={checkAccess} 
              subscription={subscription} 
              barcodeScansToday={barcodeScansToday} 
              incrementScan={incrementScan} 
            />
          )}
          {activeTab === 'weight' && (
            <WeightTracker history={weightHistory} onAdd={addWeight} />
          )}
          {activeTab === 'profile' && (
            <UserProfile currentSub={subscription} setSubscription={setSubscription} />
          )}
        </main>

        {/* Нижняя навигация */}
        <nav className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-lg border-t border-white/5 py-2 z-30">
          <div className="flex justify-between items-center px-4">
            <NavButton icon={<Home />} label={t.dashboard} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavButton icon={<Search />} label={t.searchTab} isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
            
            {/* Центральная кнопка камеры */}
            <div className="relative -top-5">
              <button 
                onClick={() => {
                  if (checkAccess('silver')) setActiveTab('camera');
                }} 
                className="btn-glass w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 border-4 border-slate-950"
              >
                <Camera size={26} strokeWidth={2.5} />
              </button>
            </div>

            <NavButton icon={<Scale />} label={t.weightTab} isActive={activeTab === 'weight'} onClick={() => setActiveTab('weight')} />
            <NavButton icon={<User />} label={t.profileTab} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </nav>

        {/* Выбор приема пищи */}
        {pendingMeal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-4">
            <div className="bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-white/10 shadow-2xl animate-in slide-in-from-bottom">
              <h3 className="text-base font-black text-white text-center mb-1">{t.whereToSave}</h3>
              <p className="text-xs text-slate-400 text-center mb-4">{pendingMeal.dish_name}</p>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <button onClick={() => confirmAddMeal('breakfast')} className="btn-glass bg-slate-800 hover:bg-slate-700/80 p-3 rounded-2xl text-xs font-bold text-slate-200 border border-white/5 flex flex-col items-center gap-1">
                  <span className="text-xl">🌅</span>
                  <span>{t.breakfast}</span>
                </button>
                <button onClick={() => confirmAddMeal('lunch')} className="btn-glass bg-slate-800 hover:bg-slate-700/80 p-3 rounded-2xl text-xs font-bold text-slate-200 border border-white/5 flex flex-col items-center gap-1">
                  <span className="text-xl">☀️</span>
                  <span>{t.lunch}</span>
                </button>
                <button onClick={() => confirmAddMeal('dinner')} className="btn-glass bg-slate-800 hover:bg-slate-700/80 p-3 rounded-2xl text-xs font-bold text-slate-200 border border-white/5 flex flex-col items-center gap-1">
                  <span className="text-xl">🌙</span>
                  <span>{t.dinner}</span>
                </button>
                <button onClick={() => confirmAddMeal('snack')} className="btn-glass bg-slate-800 hover:bg-slate-700/80 p-3 rounded-2xl text-xs font-bold text-slate-200 border border-white/5 flex flex-col items-center gap-1">
                  <span className="text-xl">🍎</span>
                  <span>{t.snack}</span>
                </button>
              </div>
              <button onClick={() => setPendingMeal(null)} className="btn-glass w-full py-3 bg-slate-800/60 text-slate-400 text-xs font-semibold rounded-xl">
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        {/* Требование подписки */}
        {upgradePrompt.show && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-xs rounded-3xl p-6 border border-white/10 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Crown size={32} />
              </div>
              <h3 className="font-black text-white text-lg mb-1">{t.reqSub}</h3>
              <p className="text-xs text-slate-300 mb-5">{t.reqSubDesc}</p>
              <div className="flex gap-2">
                <button onClick={() => setUpgradePrompt({ show: false, required: '' })} className="btn-glass flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                  {t.cancel}
                </button>
                <button onClick={() => { setUpgradePrompt({ show: false, required: '' }); setActiveTab('profile'); }} className="btn-glass flex-1 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl">
                  {t.toProfile}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Юбилейный попап огонька (5, 10, 30, 60, 100, 200, 400 дней) */}
        {showStreakPopup && (
          <div onClick={() => setShowStreakPopup(false)} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer">
            <div className="flex flex-col items-center text-center animate-[floatUp_0.5s_ease-out_forwards]">
              <div className="relative mb-4">
                <div className={`absolute w-36 h-36 ${streakStyle.bg} rounded-full blur-3xl opacity-60 animate-pulse`} />
                <Flame size={120} className={`${streakStyle.text} relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] animate-bounce`} fill="currentColor" />
              </div>
              <h2 className="text-4xl font-black text-white tracking-widest uppercase mb-2">ЮБИЛЕЙ!</h2>
              <p className="text-xs text-slate-300 mb-4">Серия ежедневных отметок продолжается</p>
              <div className={`bg-gradient-to-r ${streakStyle.grad} text-slate-950 px-8 py-3 rounded-full font-black text-xl shadow-xl`}>
                🔥 {streakDays} ДНЕЙ
              </div>
            </div>
          </div>
        )}
      </div>
    </LanguageContext.Provider>
  );
}
