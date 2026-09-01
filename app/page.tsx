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

let app, auth, db, appId = 'default-app-id';
try {
  if (typeof window !== 'undefined') {
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : { apiKey: "AIzaSyDummyKeyForBuild" };
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof __app_id !== 'undefined') appId = __app_id;
  }
} catch (e) { console.error("Firebase init:", e); }

const apiKey = ""; 

const translations = {
  ru: {
    dashboard: "Сводка", searchTab: "Поиск", weightTab: "Вес", profileTab: "Профиль", calsLeft: "Осталось калорий", eatenToday: "Съедено за день", from: "из", kcal: "ккал", aiDietitian: "ИИ-диетолог: Что съесть?", proteins: "Белки", fats: "Жиры", carbs: "Углеводы", g: "г", waterConsumed: "Выпито воды", ml: "мл", addFood: "Добавить еду", breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин", snack: "Перекус", recordVoice: "Запись голосом", dictatePrompt: "Напишите или продиктуйте, что вы съели.", dictatePlaceholder: "Напр: 200г гречки", aiThinking: "Нейросеть анализирует...", aiCreating: "Создаем рецепты...", whereToSave: "Куда записать блюдо?", date: "Дата", cancel: "Отмена", base: "База", myRecipes: "Мои рецепты", searchPlaceholder: "Поиск...", recentAdded: "Недавно добавленные", notFound: "Ничего не найдено", ingredient: "Ингредиент", constructor: "Конструктор", recipeName: "Название блюда", addIngredient: "Добавить ингредиент", saveRecipe: "Сохранить рецепт", kbju100g: "КБЖУ (на 100 грамм)", addToDiary: "Добавить в дневник", weightInfo: "грамм", aiScanner: "AI Сканер еды", takePhoto: "Сделать фото", fromGallery: "Из галереи", recognitionError: "Ошибка распознавания", tryAgain: "Попробовать еще раз", recognized: "Распознанные продукты", weightTitle: "Записать вес (кг)", weightPlaceholder: "Напр. 75.5", add: "Добавить", chart: "График", needMoreData: "Нужен еще один замер", history: "История замеров", start: "Начало", inSystemSince: "Пользователь базы", subsLevels: "Уровни подписки", current: "Текущий", free: "Бесплатно", allFeatures: "Все возможности", hideDetails: "Скрыть подробности", bronzeF1: "Базовый поиск еды", bronzeF2: "скан. штрихкодов", bronzeF3: "ИИ сканер недоступен", silverF1: "Всё, что входит в Bronze", silverF2: "ИИ-фото в день", silverF3: "Безлимитный сканер штрихкодов", goldF1: "Полный доступ ко всем функциям", goldF2: "Безлимитное ИИ-сканирование", goldF3: "Советы ИИ-диетолога", buySilver: "Перейти на Silver", buyGold: "Купить Gold доступ", yourTier: "Ваш текущий тариф", proActive: "Активный PRO-доступ", makingPlan: "Создаем план...", accountSetup: "Настроим NutriBot", activityLabel: "Активность", goalLabel: "Ваша цель", startUsing: "Начать использование", language: "Язык", loadingData: "Загрузка...", reqSub: "Требуется подписка", reqSubDesc: "Эта функция недоступна на вашем текущем тарифе. Перейдите в профиль, чтобы снять ограничения.", toProfile: "В профиль", silverUnlocked: "SILVER РАЗБЛОКИРОВАН", goldUnlocked: "GOLD", male: "Мужской", female: "Женский", age: "Возраст", height: "Рост (см)", weight: "Вес (кг)",
    activities: { min: "Минимальная", low: "Слабая", med: "Средняя", high: "Высокая", ext: "Экстремальная" }, goals: { lose: "Похудение", keep: "Поддержание веса", gain: "Набор массы" }
  },
  en: {
    dashboard: "Dashboard", searchTab: "Search", weightTab: "Weight", profileTab: "Profile", calsLeft: "Calories left", eatenToday: "Eaten today", from: "of", kcal: "kcal", aiDietitian: "AI Dietitian: What to eat?", proteins: "Protein", fats: "Fats", carbs: "Carbs", g: "g", waterConsumed: "Water consumed", ml: "ml", addFood: "Add food", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", recordVoice: "Voice Record", dictatePrompt: "Type or dictate what you ate.", dictatePlaceholder: "e.g., 200g of buckwheat", aiThinking: "AI is analyzing...", aiCreating: "Creating recipes...", whereToSave: "Where to save this meal?", date: "Date", cancel: "Cancel", base: "Database", myRecipes: "My Recipes", searchPlaceholder: "Search...", recentAdded: "Recently added", notFound: "Nothing found", ingredient: "Ingredient", constructor: "Constructor", recipeName: "Recipe name", addIngredient: "Add ingredient", saveRecipe: "Save recipe", kbju100g: "Macros (per 100g)", addToDiary: "Add to diary", weightInfo: "grams", aiScanner: "AI Food Scanner", takePhoto: "Take a photo", fromGallery: "From gallery", recognitionError: "Recognition error", tryAgain: "Try again", recognized: "Recognized products", weightTitle: "Log weight (kg)", weightPlaceholder: "e.g. 75.5", add: "Add", chart: "Chart", needMoreData: "Need one more log", history: "Weight history", start: "Start", inSystemSince: "Cloud Member", subsLevels: "Subscription Tiers", current: "Current", free: "Free", allFeatures: "All features", hideDetails: "Hide details", bronzeF1: "Basic food search", bronzeF2: "barcode scans", bronzeF3: "AI scanner unavailable", silverF1: "Everything in Bronze", silverF2: "AI photo scans per day", silverF3: "Unlimited barcode scanner", goldF1: "Full access to all features", goldF2: "Unlimited AI food scanning", goldF3: "Smart AI Dietitian tips", buySilver: "Upgrade to Silver", buyGold: "Get Gold Access", yourTier: "Your current tier", proActive: "PRO Access Active", makingPlan: "Creating plan...", accountSetup: "Setup NutriBot", activityLabel: "Activity", goalLabel: "Your goal", startUsing: "Start using", language: "Language", loadingData: "Loading...", reqSub: "Subscription Required", reqSubDesc: "This feature is not available on your current plan. Upgrade in profile to unlock.", toProfile: "To Profile", silverUnlocked: "SILVER UNLOCKED", goldUnlocked: "GOLD", male: "Male", female: "Female", age: "Age", height: "Height (cm)", weight: "Weight (kg)",
    activities: { min: "Minimal", low: "Light", med: "Moderate", high: "High", ext: "Extreme" }, goals: { lose: "Weight loss", keep: "Maintain weight", gain: "Muscle gain" }
  },
  pt: {
    dashboard: "Resumo", searchTab: "Buscar", weightTab: "Peso", profileTab: "Perfil", calsLeft: "Restantes", eatenToday: "Comido", from: "de", kcal: "kcal", aiDietitian: "Dietista IA: O que comer?", proteins: "Proteínas", fats: "Gorduras", carbs: "Carbos", g: "g", waterConsumed: "Água", ml: "ml", addFood: "Adicionar comida", breakfast: "Café da manhã", lunch: "Almoço", dinner: "Jantar", snack: "Lanche", recordVoice: "Gravação", dictatePrompt: "Dite o que comeu.", dictatePlaceholder: "ex: 200g arroz", aiThinking: "Analisando...", aiCreating: "Criando...", whereToSave: "Onde salvar?", date: "Data", cancel: "Cancelar", base: "Base", myRecipes: "Receitas", searchPlaceholder: "Buscar...", recentAdded: "Recentes", notFound: "Nada encontrado", ingredient: "Ingrediente", constructor: "Construtor", recipeName: "Nome da receita", addIngredient: "Adicionar ingrediente", saveRecipe: "Salvar receita", kbju100g: "Macros (100g)", addToDiary: "Adicionar ao diário", weightInfo: "gramas", aiScanner: "Scanner IA", takePhoto: "Tirar foto", fromGallery: "Da galeria", recognitionError: "Erro", tryAgain: "Tentar de novo", recognized: "Produtos", weightTitle: "Registrar peso", weightPlaceholder: "ex. 75.5", add: "Adicionar", chart: "Gráfico", needMoreData: "Precisa mais um", history: "Histórico", start: "Início", inSystemSince: "Membro", subsLevels: "Assinaturas", current: "Atual", free: "Grátis", allFeatures: "Funções", hideDetails: "Ocultar", bronzeF1: "Busca básica", bronzeF2: "scans código", bronzeF3: "IA indisponível", silverF1: "Tudo do Bronze", silverF2: "fotos IA/dia", silverF3: "Código ilimitado", goldF1: "Acesso total", goldF2: "IA ilimitada", goldF3: "Dicas de IA", buySilver: "Mudar para Silver", buyGold: "Obter Gold", yourTier: "Seu plano", proActive: "PRO Ativo", makingPlan: "Criando plano...", accountSetup: "Configurar NutriBot", activityLabel: "Atividade", goalLabel: "Objetivo", startUsing: "Começar", language: "Idioma", loadingData: "Carregando...", reqSub: "Assinatura Necessária", reqSubDesc: "Atualize no perfil.", toProfile: "Perfil", silverUnlocked: "SILVER DESBLOQUEADO", goldUnlocked: "GOLD", male: "Masculino", female: "Feminino", age: "Idade", height: "Altura (cm)", weight: "Peso (kg)",
    activities: { min: "Mínima", low: "Leve", med: "Moderada", high: "Alta", ext: "Extrema" }, goals: { lose: "Emagrecimento", keep: "Manter peso", gain: "Ganho de massa" }
  },
  fr: {
    dashboard: "Résumé", searchTab: "Recherche", weightTab: "Poids", profileTab: "Profil", calsLeft: "Restantes", eatenToday: "Mangé", from: "sur", kcal: "kcal", aiDietitian: "Diététicien IA", proteins: "Protéines", fats: "Lipides", carbs: "Glucides", g: "g", waterConsumed: "Eau", ml: "ml", addFood: "Ajouter repas", breakfast: "Petit-déjeuner", lunch: "Déjeuner", dinner: "Dîner", snack: "Collation", recordVoice: "Voix", dictatePrompt: "Dictez ce que vous avez mangé.", dictatePlaceholder: "ex: 200g riz", aiThinking: "Analyse...", aiCreating: "Création...", whereToSave: "Où enregistrer?", date: "Date", cancel: "Annuler", base: "Base", myRecipes: "Recettes", searchPlaceholder: "Rechercher...", recentAdded: "Récents", notFound: "Rien trouvé", ingredient: "Ingrédient", constructor: "Constructeur", recipeName: "Nom recette", addIngredient: "Ajouter ingrédient", saveRecipe: "Enregistrer", kbju100g: "Macros (100g)", addToDiary: "Ajouter au journal", weightInfo: "grammes", aiScanner: "Scanner IA", takePhoto: "Prendre photo", fromGallery: "Galerie", recognitionError: "Erreur", tryAgain: "Réessayer", recognized: "Reconnus", weightTitle: "Enregistrer poids", weightPlaceholder: "ex. 75.5", add: "Ajouter", chart: "Graphique", needMoreData: "Besoin de données", history: "Historique", start: "Début", inSystemSince: "Membre", subsLevels: "Abonnements", current: "Actuel", free: "Gratuit", allFeatures: "Fonctions", hideDetails: "Masquer", bronzeF1: "Recherche", bronzeF2: "scans codes-barres", bronzeF3: "IA indisponible", silverF1: "Tout de Bronze", silverF2: "scans photos/j", silverF3: "Codes-barres illimités", goldF1: "Accès total", goldF2: "IA illimité", goldF3: "Conseils Diététicien", buySilver: "Passer à Silver", buyGold: "Obtenir Gold", yourTier: "Votre forfait", proActive: "PRO Actif", makingPlan: "Création...", accountSetup: "Configurer NutriBot", activityLabel: "Activité", goalLabel: "Objectif", startUsing: "Commencer", language: "Langue", loadingData: "Chargement...", reqSub: "Abonnement Requis", reqSubDesc: "Mettez à niveau dans le profil.", toProfile: "Profil", silverUnlocked: "SILVER DÉBLOQUÉ", goldUnlocked: "GOLD", male: "Homme", female: "Femme", age: "Âge", height: "Taille (cm)", weight: "Poids (kg)",
    activities: { min: "Minimale", low: "Légère", med: "Moyenne", high: "Élevée", ext: "Extrême" }, goals: { lose: "Perte de poids", keep: "Maintien", gain: "Prise de masse" }
  },
  kk: {
    dashboard: "Жиынтық", searchTab: "Іздеу", weightTab: "Салмақ", profileTab: "Профиль", calsLeft: "Қалған калория", eatenToday: "Желінген", from: "барлығы", kcal: "ккал", aiDietitian: "ЖИ-диетолог", proteins: "Ақуыз", fats: "Май", carbs: "Көмірсу", g: "г", waterConsumed: "Ішілген су", ml: "мл", addFood: "Тамақ қосу", breakfast: "Таңғы ас", lunch: "Түскі ас", dinner: "Кешкі ас", snack: "Тіскебасар", recordVoice: "Дауыс жазу", dictatePrompt: "Не жегеніңізді жазыңыз.", dictatePlaceholder: "мыс: 200г күріш", aiThinking: "Талдауда...", aiCreating: "Құруда...", whereToSave: "Қайда сақтау керек?", date: "Күні", cancel: "Болдырмау", base: "База", myRecipes: "Рецепттерім", searchPlaceholder: "Іздеу...", recentAdded: "Жақында", notFound: "Табылмады", ingredient: "Құрамдас", constructor: "Конструктор", recipeName: "Атауы", addIngredient: "Құрамдас қосу", saveRecipe: "Сақтау", kbju100g: "КБЖУ (100г)", addToDiary: "Күнделікке қосу", weightInfo: "грамм", aiScanner: "AI Сканері", takePhoto: "Суретке түсіру", fromGallery: "Галереядан", recognitionError: "Қате", tryAgain: "Қайта көру", recognized: "Танылған өнімдер", weightTitle: "Салмақ жазу", weightPlaceholder: "мыс. 75.5", add: "Қосу", chart: "График", needMoreData: "Тағы өлшем қажет", history: "Тарихы", start: "Бастапқы", inSystemSince: "Жүйеде", subsLevels: "Жазылымдар", current: "Ағымдағы", free: "Тегін", allFeatures: "Мүмкіндіктер", hideDetails: "Жасыру", bronzeF1: "Іздеу", bronzeF2: "штрих-код", bronzeF3: "AI қолжетімсіз", silverF1: "Bronze барлығы", silverF2: "күніне AI-фото", silverF3: "Шексіз штрихкод", goldF1: "Толық рұқсат", goldF2: "Шексіз сканер", goldF3: "ЖИ-диетолог", buySilver: "Silver-ге өту", buyGold: "Gold алу", yourTier: "Тарифіңіз", proActive: "PRO белсенді", makingPlan: "Жоспар құруда...", accountSetup: "NutriBot баптау", activityLabel: "Белсенділік", goalLabel: "Мақсатыңыз", startUsing: "Бастау", language: "Тілі", loadingData: "Жүктеу...", reqSub: "Жазылым қажет", reqSubDesc: "Шектеуді алу үшін профильге өтіңіз.", toProfile: "Профильге", silverUnlocked: "SILVER РҰҚСАТ", goldUnlocked: "GOLD", male: "Ер", female: "Әйел", age: "Жасы", height: "Бойы (см)", weight: "Салмағы (кг)",
    activities: { min: "Минималды", low: "Төмен", med: "Орташа", high: "Жоғары", ext: "Экстремалды" }, goals: { lose: "Арықтау", keep: "Сақтау", gain: "Бұлшықет жинау" }
  }
};

const LanguageContext = createContext();

const globalStyles = `
  .btn-glass { transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s ease, background-color 0.1s ease; cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; transform: translateZ(0); }
  .btn-glass:active { transform: scale(0.96) translateZ(0); opacity: 0.7; }
  @keyframes zapIn { 0% { transform: scale(0.1) skewX(20deg); opacity: 0; filter: brightness(2); } 60% { transform: scale(1.15) skewX(-10deg); opacity: 1; filter: brightness(1.5); } 100% { transform: scale(1) skewX(0); opacity: 1; filter: brightness(1); } }
  @keyframes floatUp { 0% { transform: translateY(150px) scale(0.8); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
  @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
  @keyframes lightning-bg { 0%, 100% { opacity: 0; } 5%, 15%, 25% { opacity: 0.8; background-color: rgba(30,58,138,0.5); } 10%, 20% { opacity: 0; } 30% { opacity: 0.4; background-color: rgba(30,58,138,0.3); } }
  @keyframes lightning-bolt { 0%, 100% { opacity: 0; } 5%, 15%, 25% { opacity: 1; } 10%, 20% { opacity: 0; } 26% { opacity: 1; } }
  @keyframes lightning-bolt-delay { 0%, 5%, 100% { opacity: 0; } 6%, 16%, 26% { opacity: 1; } 11%, 21% { opacity: 0; } 27% { opacity: 1; } }
  @keyframes rain-fall { to { transform: translateY(120vh) rotate(5deg); } }
  @keyframes particle-explode { 0% { transform: translate(0, 0) scale(0); opacity: 1; } 20% { transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
`;

const LightningStorm = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[150]">
    <div className="absolute inset-0 bg-blue-500/10 animate-[lightning-bg_2s_infinite]"></div>
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 0 L150 300 L250 300 L180 800" stroke="#93c5fd" strokeWidth="12" fill="none" className="animate-[lightning-bolt_1.5s_infinite]" style={{ filter: 'drop-shadow(0 0 20px #93c5fd)' }} />
      <path d="M100 0 L70 250 L150 250 L100 600" stroke="#bfdbfe" strokeWidth="6" fill="none" className="animate-[lightning-bolt-delay_2s_infinite]" style={{ filter: 'drop-shadow(0 0 10px #bfdbfe)' }} />
      <path d="M300 100 L260 400 L340 400 L280 800" stroke="#ffffff" strokeWidth="8" fill="none" className="animate-[lightning-bolt_1.8s_infinite]" style={{ filter: 'drop-shadow(0 0 15px #ffffff)' }} />
    </svg>
  </div>
);

const GoldBurstAnimation = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[160] flex flex-col items-center justify-center">
    <div className="absolute w-96 h-96 bg-amber-500/60 blur-[60px] rounded-full animate-pulse"></div>
    <div className="absolute w-64 h-64 bg-yellow-300/40 blur-[40px] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    
    <div className="relative z-10 flex flex-col items-center justify-center" style={{ animation: 'floatUp 0.8s ease-out forwards' }}>
      <Crown size={90} className="text-[#fde047] mb-[-12px] z-20" fill="currentColor" style={{ filter: 'drop-shadow(0 0 20px rgba(253,224,71,0.8))' }} />
      <span className="text-[#fde047] font-black text-7xl tracking-widest z-10 relative" style={{ filter: 'drop-shadow(0 0 25px rgba(253,224,71,1))' }}>GOLD</span>
    </div>

    <div className="absolute inset-0 z-20 flex items-center justify-center">
      {[...Array(80)].map((_, i) => {
        const angle = (i * 360) / 80 + (Math.random() * 10 - 5);
        const distance = 100 + Math.random() * 400;
        const tx = `${Math.cos(angle * Math.PI / 180) * distance}px`;
        const ty = `${Math.sin(angle * Math.PI / 180) * distance}px`;
        const size = 3 + Math.random() * 8;
        return (
          <div 
            key={`l-${i}`} 
            className="absolute bg-yellow-200 rounded-full"
            style={{
              width: `${size}px`, height: `${size}px`,
              left: '20%', top: '50%',
              '--tx': tx, '--ty': ty,
              animation: `particle-explode ${0.8 + Math.random() * 1.5}s ease-out infinite`,
              animationDelay: `${Math.random() * 0.5}s`,
              boxShadow: '0 0 15px 3px #fcd34d'
            }}
          />
        )
      })}
      {[...Array(80)].map((_, i) => {
        const angle = (i * 360) / 80 + (Math.random() * 10 - 5);
        const distance = 100 + Math.random() * 400;
        const tx = `${Math.cos(angle * Math.PI / 180) * distance}px`;
        const ty = `${Math.sin(angle * Math.PI / 180) * distance}px`;
        const size = 3 + Math.random() * 8;
        return (
          <div 
            key={`r-${i}`} 
            className="absolute bg-yellow-200 rounded-full"
            style={{
              width: `${size}px`, height: `${size}px`,
              left: '80%', top: '50%',
              '--tx': tx, '--ty': ty,
              animation: `particle-explode ${0.8 + Math.random() * 1.5}s ease-out infinite`,
              animationDelay: `${Math.random() * 0.5}s`,
              boxShadow: '0 0 15px 3px #fcd34d'
            }}
          />
        )
      })}
    </div>
  </div>
);

async function fetchGeminiWithRetry(prompt, schema, base64Image = null, mimeType = null) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const parts = [{ text: prompt }];
  if (base64Image) { parts.push({ inlineData: { mimeType: mimeType, data: base64Image } }); }
  const payload = { contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", responseSchema: schema } };

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('HTTP error');
      const result = await response.json();
      return JSON.parse(result.candidates[0].content.parts[0].text);
    } catch (error) { retries--; if (retries === 0) throw error; await new Promise(r => setTimeout(r, 1000)); }
  }
}

async function analyzeImageWithGemini(file, isBarcode, lang) {
  const base64Image = await new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = reject;
  });
  const schema = isBarcode ? { type: "OBJECT", properties: { name: { type: "STRING" }, calories_100g: { type: "INTEGER" }, protein_100g: { type: "NUMBER" }, fats_100g: { type: "NUMBER" }, carbs_100g: { type: "NUMBER" } }, required: ["name", "calories_100g", "protein_100g", "fats_100g", "carbs_100g"] } : { type: "OBJECT", properties: { dish_name: { type: "STRING" }, confidence_score: { type: "NUMBER" }, breakdown: { type: "ARRAY", items: { type: "OBJECT", properties: { ingredient: { type: "STRING" }, weight_g: { type: "INTEGER" }, calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } } } }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } } } }, required: ["dish_name", "confidence_score", "breakdown", "total"] };
  const prompt = isBarcode ? `Analyze barcode. Return macros per 100g. Language: ${langMap[lang]}` : `Analyze food photo. Return dish name, ingredients, weights, macros. Language: ${langMap[lang]}`;
  return await fetchGeminiWithRetry(prompt, schema, base64Image, file.type);
}

async function getAIAdviceForRemaining(remaining, lang) {
  const schema = { type: "OBJECT", properties: { suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } }, required: ["title", "description", "calories", "protein", "fat", "carbs"] } } }, required: ["suggestions"] };
  return await fetchGeminiWithRetry(`User has left: Cals: ${remaining.calories}, P: ${remaining.protein}g, F: ${remaining.fat}g, C: ${remaining.carbs}g. Suggest 3 meals. Language: ${langMap[lang]}`, schema);
}

async function analyzeTextToFood(text, lang) {
  const schema = { type: "OBJECT", properties: { dish_name: { type: "STRING" }, total: { type: "OBJECT", properties: { calories: { type: "INTEGER" }, protein: { type: "NUMBER" }, fat: { type: "NUMBER" }, carbs: { type: "NUMBER" } } } }, required: ["dish_name", "total"] };
  return await fetchGeminiWithRetry(`Text: "${text}". Convert to meal, estimate weight & macros. Language: ${langMap[lang]}`, schema);
}

const calculateLocalMacros = (profile, weight) => {
  const w = parseFloat(weight) || 70, h = parseFloat(profile.height) || 170, a = parseInt(profile.age) || 30;
  const multipliers = { min: 1.2, low: 1.375, med: 1.55, high: 1.725, ext: 1.9 };
  let tdee = ((10 * w) + (6.25 * h) - (5 * a) + (profile.gender === 'Мужской' || profile.gender === 'Male' || profile.gender === 'Masculino' || profile.gender === 'Homme' || profile.gender === 'Ер' ? 5 : -161)) * (multipliers[profile.activity] || 1.375);
  if (profile.goal === 'lose') tdee -= 500; if (profile.goal === 'gain') tdee += 500;
  const cals = Math.round(tdee), prot = Math.round(w * (profile.goal === 'gain' ? 2.0 : 1.8)), fat = Math.round(w * 1);
  return { calories: cals, protein: prot, fat: fat, carbs: Math.max(Math.round((cals - (prot * 4) - (fat * 9)) / 4), 0) };
};

const MOCK_CATALOG = [
  { id: 1, name: "Творог 0%", calories_100g: 71, protein_100g: 16.5, fats_100g: 0, carbs_100g: 1.3 },
  { id: 2, name: "Творог 5%", calories_100g: 121, protein_100g: 21, fats_100g: 5, carbs_100g: 3 },
  { id: 3, name: "Творог 9%", calories_100g: 159, protein_100g: 18, fats_100g: 9, carbs_100g: 3 },
  { id: 4, name: "Молоко 2.5%", calories_100g: 54, protein_100g: 2.9, fats_100g: 2.5, carbs_100g: 4.8 },
  { id: 5, name: "Рис белый (сухой)", calories_100g: 344, protein_100g: 6.7, fats_100g: 0.7, carbs_100g: 78.9 },
  { id: 6, name: "Рис белый (отварной)", calories_100g: 116, protein_100g: 2.2, fats_100g: 0.2, carbs_100g: 25.8 },
  { id: 7, name: "Рис бурый (отварной)", calories_100g: 111, protein_100g: 2.6, fats_100g: 0.9, carbs_100g: 22.8 },
  { id: 8, name: "Гречка (сухая)", calories_100g: 313, protein_100g: 12.6, fats_100g: 3.3, carbs_100g: 62.1 },
  { id: 9, name: "Гречка (отварная)", calories_100g: 110, protein_100g: 4.5, fats_100g: 1.1, carbs_100g: 20 },
  { id: 10, name: "Овсянка (сухая)", calories_100g: 366, protein_100g: 11.9, fats_100g: 7.2, carbs_100g: 69.3 },
  { id: 11, name: "Куриная грудка (сырая)", calories_100g: 113, protein_100g: 23.6, fats_100g: 1.9, carbs_100g: 0.4 },
  { id: 12, name: "Куриная грудка (отварная)", calories_100g: 165, protein_100g: 31, fats_100g: 3.6, carbs_100g: 0 },
  { id: 13, name: "Куриная грудка (запеченная)", calories_100g: 172, protein_100g: 30.5, fats_100g: 4.2, carbs_100g: 0 },
  { id: 14, name: "Куриное филе бедра (сырое)", calories_100g: 154, protein_100g: 20.8, fats_100g: 7.4, carbs_100g: 0 },
  { id: 15, name: "Куриное бедро с кожей (запеченное)", calories_100g: 232, protein_100g: 24.5, fats_100g: 14.5, carbs_100g: 0 },
  { id: 16, name: "Индейка филе грудки (сырая)", calories_100g: 104, protein_100g: 23.1, fats_100g: 1.0, carbs_100g: 0 },
  { id: 17, name: "Индейка филе грудки (запеченная)", calories_100g: 135, protein_100g: 29.0, fats_100g: 1.8, carbs_100g: 0 },
  { id: 18, name: "Индейка бедро (запеченное)", calories_100g: 175, protein_100g: 24.0, fats_100g: 8.5, carbs_100g: 0 },
  { id: 19, name: "Говядина постная (сырая)", calories_100g: 158, protein_100g: 22.3, fats_100g: 7.1, carbs_100g: 0 },
  { id: 20, name: "Говядина отварная", calories_100g: 215, protein_100g: 29.8, fats_100g: 10.2, carbs_100g: 0 },
  { id: 21, name: "Стейк из говядины (Рибай)", calories_100g: 271, protein_100g: 24.0, fats_100g: 19.0, carbs_100g: 0 },
  { id: 22, name: "Стейк из говядины (Стриплойн)", calories_100g: 242, protein_100g: 25.5, fats_100g: 15.0, carbs_100g: 0 },
  { id: 23, name: "Стейк из индейки", calories_100g: 145, protein_100g: 27.0, fats_100g: 4.0, carbs_100g: 0 },
  { id: 24, name: "Свинина вырезка", calories_100g: 143, protein_100g: 21.5, fats_100g: 6.3, carbs_100g: 0 },
  { id: 25, name: "Фарш говяжий", calories_100g: 254, protein_100g: 17.2, fats_100g: 20.0, carbs_100g: 0 },
  { id: 26, name: "Фарш куриный", calories_100g: 143, protein_100g: 18.0, fats_100g: 7.8, carbs_100g: 0 },
  { id: 27, name: "Протеиновый батончик Bombbar (шоколад)", calories_100g: 371, protein_100g: 40.0, fats_100g: 11.5, carbs_100g: 6.5 },
  { id: 28, name: "Протеиновый батончик Bombbar (кокос)", calories_100g: 358, protein_100g: 38.0, fats_100g: 12.0, carbs_100g: 7.0 },
  { id: 29, name: "Протеиновое печенье Bombbar", calories_100g: 340, protein_100g: 35.0, fats_100g: 10.0, carbs_100g: 9.0 },
  { id: 30, name: "Яйцо куриное (вареное)", calories_100g: 155, protein_100g: 13, fats_100g: 11, carbs_100g: 1.1 },
  { id: 31, name: "Лосось запеченный", calories_100g: 228, protein_100g: 25.4, fats_100g: 13.6, carbs_100g: 0 },
  { id: 32, name: "Хлеб белый", calories_100g: 266, protein_100g: 8, fats_100g: 3, carbs_100g: 50 },
  { id: 33, name: "Огурец свежий", calories_100g: 15, protein_100g: 0.8, fats_100g: 0.1, carbs_100g: 2.8 },
  { id: 34, name: "Помидор свежий", calories_100g: 18, protein_100g: 0.9, fats_100g: 0.2, carbs_100g: 3.9 },
  { id: 35, name: "Картофель отварной", calories_100g: 82, protein_100g: 2, fats_100g: 0.4, carbs_100g: 16.7 },
  { id: 36, name: "Яблоко", calories_100g: 52, protein_100g: 0.4, fats_100g: 0.4, carbs_100g: 14 },
  { id: 37, name: "Банан", calories_100g: 89, protein_100g: 1.1, fats_100g: 0.3, carbs_100g: 22.8 },
  { id: 38, name: "Макароны отварные", calories_100g: 112, protein_100g: 3.6, fats_100g: 0.4, carbs_100g: 23.5 },
  { id: 39, name: "Сыр Российский", calories_100g: 363, protein_100g: 23.4, fats_100g: 29.5, carbs_100g: 0 },
  { id: 40, name: "Гамбургер", calories_100g: 264, protein_100g: 13, fats_100g: 10, carbs_100g: 31 }
];

export default function Page() {
  const [lang, setLang] = useState('ru');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] || translations['en'] }}>
      <NutriBotApp />
    </LanguageContext.Provider>
  );
}

function NutriBotApp() {
  const { t, lang } = useContext(LanguageContext);
  
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [dailyGoals, setDailyGoals] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [meals, setMeals] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [waterLogs, setWaterLogs] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [pendingMeal, setPendingMeal] = useState(null);
  const [streakDays, setStreakDays] = useState(1);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [subscription, setSubscription] = useState('bronze'); 
  const [scansToday, setScansToday] = useState(0); 
  const [barcodeScansToday, setBarcodeScansToday] = useState(0); 
  const [upgradePrompt, setUpgradePrompt] = useState({ show: false, required: '' });

  useEffect(() => {
    if (!window.Telegram) {
      const tgScript = document.createElement('script');
      tgScript.src = 'https://telegram.org/js/telegram-web-app.js';
      tgScript.onload = () => { if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); } };
      document.head.appendChild(tgScript);
    }
  }, []);

  useEffect(() => {
    if (!auth) { setAuthLoading(false); setDataLoading(false); return; }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { await signInWithCustomToken(auth, __initial_auth_token); } 
        else { await signInAnonymously(auth); }
      } catch (e) { 
        console.error("Auth err", e); 
        setUser({ uid: 'offline-user-' + Math.random().toString(36).substring(7) });
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!user || !db) { setDataLoading(false); return; }
    let isSubscribed = true;
    const uid = user.uid;

    const unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'profile'), (docSnap) => {
      if (!isSubscribed) return;
      if(docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data.formData); setDailyGoals(data.goals); setIsFirstLaunch(false);
      } else { setIsFirstLaunch(true); }
      setDataLoading(false);
    }, (err) => {
      console.error("Profile sync error:", err);
      if (isSubscribed) setDataLoading(false);
    });

    const unsubMeals = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'meals'), (snap) => {
      if (!isSubscribed) return;
      const items = []; snap.forEach(d => items.push(d.data())); setMeals(items);
    }, (err) => console.error("Meals sync error:", err));

    const unsubWeight = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'weights'), (snap) => {
      if (!isSubscribed) return;
      const items = []; snap.forEach(d => items.push(d.data())); setWeightHistory(items.sort((a,b) => b.id - a.id));
    }, (err) => console.error("Weight sync error:", err));

    const unsubWater = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'water'), (docSnap) => {
      if (!isSubscribed) return;
      if(docSnap.exists()) setWaterLogs(docSnap.data().logs || {});
    }, (err) => console.error("Water sync error:", err));

    const unsubCustomFoods = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'customFoods'), (snap) => {
      if (!isSubscribed) return;
      const items = []; snap.forEach(d => items.push(d.data())); setCustomFoods(items);
    }, (err) => console.error("Custom foods sync error:", err));

    const unsubStats = onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'stats'), (docSnap) => {
      if (!isSubscribed) return;
      if(docSnap.exists()) {
        const data = docSnap.data();
        setSubscription(data.subscription || 'bronze'); setStreakDays(data.streakDays || 1);
        if(data.lastScanDate === new Date().toDateString()) {
          setScansToday(data.scansToday || 0); setBarcodeScansToday(data.barcodeScansToday || 0);
        } else { setScansToday(0); setBarcodeScansToday(0); }
      }
    }, (err) => console.error("Stats sync error:", err));

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

  const handleOnboardingComplete = useCallback(async (goals, formData) => {
    setUserProfile(formData); setDailyGoals(goals); setIsFirstLaunch(false);
    const d = new Date(); const today = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    const wData = { id: Date.now(), date: today, weight: parseFloat(String(formData.weight).replace(',', '.')) };
    setWeightHistory([wData]);
    if(user && db) {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { formData, goals }).catch(console.error);
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', wData.id.toString()), wData).catch(console.error);
    }
  }, [user]);

  const checkAccess = useCallback((requiredTier) => {
    const tiers = { bronze: 0, silver: 1, gold: 2 };
    if (tiers[subscription] >= tiers[requiredTier]) return true;
    setUpgradePrompt({ show: true, required: requiredTier }); return false;
  }, [subscription]);

  const requestAddMeal = useCallback((mealData) => setPendingMeal(mealData), []);

  const confirmAddMeal = useCallback(async (type) => {
    if(pendingMeal) {
      const willIgniteStreak = formattedSelectedDate === todayFormatted && !hasMealsToday;
      const d = new Date(); const safeTime = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
      const newMeal = { ...pendingMeal, type, date: formattedSelectedDate, id: Date.now() + Math.random(), time: safeTime };
      setMeals(prev => [...prev, newMeal]); setPendingMeal(null); setActiveTab('dashboard');
      if (willIgniteStreak) { 
        setShowStreakPopup(true); setTimeout(() => setShowStreakPopup(false), 3500); 
        const newStreak = streakDays + 1; setStreakDays(newStreak);
        if(user && db) setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), { streakDays: newStreak }, {merge:true});
      }
      if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', newMeal.id.toString()), newMeal);
    }
  }, [pendingMeal, formattedSelectedDate, todayFormatted, hasMealsToday, user, streakDays]);

  const deleteMeal = useCallback(async (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    if(user && db) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'meals', id.toString()));
  }, [user]);

  const addWeight = useCallback(async (weightStr) => {
    const weight = parseFloat(String(weightStr).replace(',', '.'));
    if(isNaN(weight)) return;
    const d = new Date(); const today = `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
    const wData = { id: Date.now(), date: today, weight };
    setWeightHistory(prev => [wData, ...prev]);
    if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'weights', wData.id.toString()), wData);
    if (userProfile) {
      const newGoals = calculateLocalMacros(userProfile, weight);
      setDailyGoals(newGoals);
      if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'profile'), { formData: userProfile, goals: newGoals }, {merge:true});
    }
  }, [userProfile, user]);

  const currentWater = waterLogs[formattedSelectedDate] || 0;
  const handleAddWater = useCallback(async (amount) => {
    const newAmount = Math.max((waterLogs[formattedSelectedDate] || 0) + amount, 0);
    const newLogs = { ...waterLogs, [formattedSelectedDate]: newAmount };
    setWaterLogs(newLogs);
    if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'water'), { logs: newLogs });
  }, [formattedSelectedDate, waterLogs, user]);

  const saveCustomRecipeToDB = useCallback(async (recipeItem) => {
    setCustomFoods(prev => [recipeItem, ...prev]);
    if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'customFoods', recipeItem.id.toString()), recipeItem);
  }, [user]);

  const updateSubscription = useCallback(async (level) => {
    setSubscription(level);
    if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), { subscription: level }, {merge:true});
  }, [user]);

  const incrementScan = useCallback(async (type) => {
    const todayStr = new Date().toDateString();
    const newStats = { lastScanDate: todayStr, scansToday: type === 'photo' ? scansToday + 1 : scansToday, barcodeScansToday: type === 'barcode' ? barcodeScansToday + 1 : barcodeScansToday };
    if (type === 'photo') setScansToday(p => p+1); if (type === 'barcode') setBarcodeScansToday(p => p+1);
    if(user && db) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'stats'), newStats, {merge:true});
  }, [scansToday, barcodeScansToday, user]);

  if (authLoading || dataLoading) return (<div className="flex flex-col h-screen bg-slate-900 text-slate-100 items-center justify-center"><Activity className="text-emerald-500 animate-spin mb-4" size={40}/><p className="text-slate-400 font-medium">{t?.loadingData}</p></div>);
  if (isFirstLaunch || !dailyGoals) return <OnboardingScreen onComplete={handleOnboardingComplete} />;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      <header className="px-4 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2"><Activity className="text-emerald-400" size={24} /><h1 className="text-lg font-bold">NutriBot</h1></div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${hasMealsToday ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)]' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
            <Flame size={16} className={hasMealsToday ? "fill-orange-400 animate-pulse text-orange-400" : ""} />
            <span className="font-bold text-sm">{hasMealsToday ? streakDays : streakDays}</span>
          </div>
          <div onClick={() => setActiveTab('profile')} className={`btn-glass text-sm border px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md ${subscription === 'gold' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : subscription === 'silver' ? 'bg-slate-400/10 border-slate-400/30 text-slate-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
            {subscription === 'gold' ? <Crown size={14} /> : subscription === 'silver' ? <Zap size={14} /> : <Shield size={14} />}
            <span className="font-bold tracking-wide">{subscription.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 relative">
        {activeTab === 'dashboard' && <Dashboard current={current} goals={dailyGoals} meals={currentDayMeals} onAddClick={() => setActiveTab('search')} selectedDate={selectedDate} setSelectedDate={setSelectedDate} requestAddMeal={requestAddMeal} currentWater={currentWater} addWater={handleAddWater} deleteMeal={deleteMeal} checkAccess={checkAccess} />}
        {activeTab === 'camera' && <CameraScanner onSave={requestAddMeal} onCancel={() => setActiveTab('dashboard')} subscription={subscription} scansToday={scansToday} incrementScan={incrementScan} checkAccess={checkAccess} />}
        {activeTab === 'search' && <FoodSearch customFoods={customFoods} saveCustomRecipeToDB={saveCustomRecipeToDB} recentFoods={recentFoods} setRecentFoods={setRecentFoods} onSave={requestAddMeal} checkAccess={checkAccess} subscription={subscription} barcodeScansToday={barcodeScansToday} incrementScan={incrementScan} />}
        {activeTab === 'weight' && <WeightTracker history={weightHistory} onAdd={addWeight} />}
        {activeTab === 'profile' && <UserProfile currentSub={subscription} setSubscription={updateSubscription} />}
      </main>

      <nav className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-white/5 pb-safe pt-2 z-20">
        <div className="flex justify-between items-end px-2 pb-2">
          <div className="flex w-2/5 justify-around">
            <NavButton icon={<Home />} label={t.dashboard} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavButton icon={<Search />} label={t.searchTab} isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          </div>
          <div className="w-1/5 flex justify-center relative">
            <div onClick={() => checkAccess('silver') && setActiveTab('camera')} className="btn-glass absolute bottom-4 bg-gradient-to-tr from-emerald-500 to-emerald-400 text-slate-900 p-4 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.4)] flex items-center justify-center z-30"><Camera size={28} /></div>
          </div>
          <div className="flex w-2/5 justify-around">
            <NavButton icon={<Scale />} label={t.weightTab} isActive={activeTab === 'weight'} onClick={() => setActiveTab('weight')} />
            <NavButton icon={<User />} label={t.profileTab} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </div>
        </div>
      </nav>

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

      {showStreakPopup && (
        <div onClick={() => setShowStreakPopup(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer">
          <div className="flex flex-col items-center justify-center animate-in zoom-in-50 slide-in-from-bottom-12 duration-500 ease-out">
            <div className="relative mb-6">
               <div className="absolute w-40 h-40 bg-orange-500 rounded-full blur-[60px] opacity-70 animate-pulse"></div>
               <Flame size={140} className="text-orange-500 relative z-10 drop-shadow-[0_0_30px_rgba(249,115,22,1)] animate-bounce" fill="currentColor" />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 text-center tracking-widest drop-shadow-lg">ОГОНЕК<br/>ПРОДЛЕН!</h2>
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-900 px-8 py-3 rounded-full font-black text-2xl shadow-[0_0_20px_rgba(249,115,22,0.6)] mt-4">🔥 {streakDays}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = React.memo(({ icon, label, isActive, onClick }) => (
  <div onClick={onClick} className={`btn-glass flex flex-col items-center gap-1 w-14 ${isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-slate-400'}`}>
    {React.cloneElement(icon, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}<span className="text-[10px] font-semibold">{label}</span>
  </div>
));

const Dashboard = React.memo(({ current, goals, meals, onAddClick, selectedDate, setSelectedDate, requestAddMeal, currentWater, addWater, deleteMeal, checkAccess }) => {
  const { t, lang } = useContext(LanguageContext);
  const [adviceData, setAdviceData] = useState(null), [loadingAdvice, setLoadingAdvice] = useState(false), [showAdviceModal, setShowAdviceModal] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false), [voiceText, setVoiceText] = useState(''), [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false), [voiceError, setVoiceError] = useState(false);

  const WATER_GOAL = 2000, getPercent = (val, max) => Math.min(Math.round((val / max) * 100), 100);
  const remaining = { calories: Math.max((goals?.calories || 2000) - current.calories, 0), protein: Math.max(Math.round((goals?.protein || 150) - current.protein), 0), fat: Math.max(Math.round((goals?.fat || 70) - current.fat), 0), carbs: Math.max(Math.round((goals?.carbs || 200) - current.carbs), 0) };

  const handleAskAI = async () => {
    if (!checkAccess('gold')) return;
    setShowAdviceModal(true); setLoadingAdvice(true);
    try { setAdviceData((await getAIAdviceForRemaining(remaining, lang)).suggestions); } catch { setAdviceData([{ title: "Fallback", description: "Error fetching.", calories: 250, protein: 25, fat: 5, carbs: 15 }]); }
    setLoadingAdvice(false);
  };

  const handleVoiceSubmit = async () => {
    if(!voiceText.trim()) return;
    setIsAnalyzingVoice(true); setVoiceError(false);
    try { const result = await analyzeTextToFood(voiceText, lang); setIsVoiceModalOpen(false); setVoiceText(''); requestAddMeal(result); } catch { setVoiceError(true); }
    setIsAnalyzingVoice(false);
  };

  const formatDisplayDate = (d) => {
    const today = new Date(), yesterday = new Date(), tomorrow = new Date();
    yesterday.setDate(today.getDate() - 1); tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return "Сегодня";
    if (d.toDateString() === yesterday.toDateString()) return "Вчера";
    if (d.toDateString() === tomorrow.toDateString()) return "Завтра";
    return `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
  };

  const mealTypes = [{ id: 'breakfast', label: t.breakfast, icon: '🌅' }, { id: 'lunch', label: t.lunch, icon: '☀️' }, { id: 'dinner', label: t.dinner, icon: '🌙' }, { id: 'snack', label: t.snack, icon: '🍎' }];

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/5">
        <div onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d);}} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-xl"><ChevronLeft size={24} /></div>
        <div className="flex items-center gap-2 font-bold text-white text-lg"><CalendarDays size={20} className="text-emerald-400" />{formatDisplayDate(selectedDate)}</div>
        <div onClick={() => {const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d);}} className="btn-glass p-2 text-slate-400 bg-slate-700/50 rounded-xl"><ChevronRight size={24} /></div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-slate-400 text-sm font-medium">{t.calsLeft}</h2>
          <div className="text-right"><span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{t.eatenToday}</span><div className="text-sm font-bold text-emerald-400">{current.calories} <span className="text-slate-500 text-xs">{t.kcal}</span></div></div>
        </div>
        <div className="flex items-end gap-2 mb-4 mt-[-10px]"><span className="text-4xl font-bold text-white">{remaining.calories}</span><span className="text-slate-400 text-sm mb-1">{t.from} {goals?.calories || 2000}</span></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-5"><div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${getPercent(current.calories, goals?.calories || 2000)}%` }} /></div>
        <div onClick={handleAskAI} className="btn-glass w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]"><Lightbulb size={20} className="text-amber-400" /> {t.aiDietitian}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MacroCard label={t.proteins} current={current.protein} goal={goals?.protein || 150} color="from-blue-500 to-blue-400" g={t.g} />
        <MacroCard label={t.fats} current={current.fat} goal={goals?.fat || 70} color="from-amber-500 to-amber-400" g={t.g}/>
        <MacroCard label={t.carbs} current={current.carbs} goal={goals?.carbs || 200} color="from-purple-500 to-purple-400" g={t.g}/>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-3"><h2 className="text-slate-200 font-bold flex items-center gap-2"><Droplet className="text-blue-400" size={20} fill="currentColor" fillOpacity={0.2} /> {t.waterConsumed}</h2><span className="text-sm font-bold text-blue-400">{currentWater} / {WATER_GOAL} {t.ml}</span></div>
        <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${getPercent(currentWater, WATER_GOAL)}%` }}><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div></div>
        <div className="flex gap-3">
          <div onClick={() => addWater(250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥛 +250 {t.ml}</div>
          <div onClick={() => addWater(-250)} className="btn-glass flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 py-2 rounded-xl flex justify-center items-center">🥤 -250 {t.ml}</div>
        </div>
      </div>

      <div className="mt-8 space-y-6 pb-20">
        {mealTypes.map(type => {
          const typeMeals = meals.filter(m => m.type === type.id);
          const typeCals = typeMeals.reduce((acc, m) => acc + (m.total?.calories || 0), 0);
          return (
            <div key={type.id} className="animate-in fade-in">
              <div className="flex justify-between items-center mb-3 px-1"><h4 className="font-bold text-slate-200 flex items-center gap-2"><span className="text-lg">{type.icon}</span> {type.label}</h4><span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">{Math.round(typeCals)} {t.kcal}</span></div>
              {typeMeals.length === 0 ? (
                <div onClick={onAddClick} className="btn-glass w-full bg-slate-800/30 border border-slate-700/50 border-dashed rounded-xl p-4 flex justify-center items-center text-sm text-slate-500"><Plus size={16} className="mr-1"/> {t.addFood}</div>
              ) : (
                <div className="space-y-2">
                  {typeMeals.map(meal => (
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

      <div onClick={() => checkAccess('silver') && setIsVoiceModalOpen(true)} className="btn-glass fixed bottom-24 right-4 bg-emerald-500 text-slate-900 p-4 rounded-full shadow-[0_5px_20px_rgba(16,185,129,0.5)] z-30"><Mic size={24} /></div>

      {isVoiceModalOpen && (
        <div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-800/95 w-full rounded-3xl p-6 border border-white/10 slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Mic className="text-emerald-400"/> {t.recordVoice}</h3><div onClick={() => setIsVoiceModalOpen(false)} className="btn-glass p-2 bg-slate-700/50 rounded-full text-slate-400"><X size={20}/></div></div>
            <p className="text-sm text-slate-300 mb-4">{t.dictatePrompt}</p>
            {voiceError && <p className="text-red-400 text-xs mb-3 text-center">{t.tryAgain}</p>}
            <div className="flex gap-2 mb-4">
              <input type="text" value={voiceText} onChange={e => setVoiceText(String(e.target?.value || ''))} placeholder={t.dictatePlaceholder} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"/>
              <div onClick={handleVoiceSubmit} className={`btn-glass bg-emerald-500 text-slate-900 rounded-xl px-4 flex justify-center items-center ${isAnalyzingVoice || !voiceText ? 'opacity-50 pointer-events-none' : ''}`}>{isAnalyzingVoice ? <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"/> : <Send size={20} />}</div>
            </div>
          </div>
        </div>
      )}

      {showAdviceModal && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900/95 w-full h-[85vh] rounded-t-3xl border-t border-white/10 flex flex-col slide-in-from-bottom-8">
            <div className="flex justify-between items-center p-5 border-b border-white/5"><div className="flex items-center gap-2 text-lg font-bold text-white"><Lightbulb className="text-amber-400" /> {t.aiDietitian}</div><div onClick={() => setShowAdviceModal(false)} className="btn-glass p-2 text-slate-400 bg-slate-800 rounded-full"><X size={20}/></div></div>
            <div className="flex-1 overflow-y-auto p-5">
              {loadingAdvice ? (
                <div className="flex flex-col items-center justify-center mt-20"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-amber-400 animate-pulse font-medium">{t.aiCreating}</p></div>
              ) : (
                <div className="space-y-4">
                  {adviceData && Array.isArray(adviceData) && adviceData.map((advice, idx) => (
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

const MacroCard = React.memo(({ label, current, goal, color, g }) => {
  const percent = Math.min(Math.round((current / goal) * 100), 100) || 0;
  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col shadow-lg">
      <span className="text-xs text-slate-400 mb-1">{label}</span>
      <span className="font-bold text-sm mb-2 text-white">{Math.round(current)} / {goal}{g}</span>
      <div className="h-1.5 w-full bg-slate-700/50 rounded-full mt-auto overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} /></div>
    </div>
  );
});

const FoodSearch = React.memo(({ customFoods, saveCustomRecipeToDB, recentFoods, setRecentFoods, onSave, checkAccess, subscription, barcodeScansToday, incrementScan }) => {
  const { t, lang } = useContext(LanguageContext);
  const [activeSubTab, setActiveSubTab] = useState('global');
  const [query, setQuery] = useState('');
  const [weight, setWeight] = useState(100), [selectedItem, setSelectedItem] = useState(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false), [recipeName, setRecipeName] = useState(''), [recipeIngredients, setRecipeIngredients] = useState([]), [recipeError, setRecipeError] = useState(''); 
  const [isSearchingIngredient, setIsSearchingIngredient] = useState(false), [ingQuery, setIngQuery] = useState(''), [ingSelected, setIngSelected] = useState(null), [ingWeight, setIngWeight] = useState(100);
  const [isScanning, setIsScanning] = useState(false), [scanStatus, setScanStatus] = useState('idle');

  const safeQuery = String(query || ''); const safeIngQuery = String(ingQuery || '');

  const displayList = useMemo(() => {
    const list = activeSubTab === 'global' ? MOCK_CATALOG : customFoods;
    if (safeQuery.trim() === '') return activeSubTab === 'global' ? (recentFoods.length > 0 ? recentFoods : MOCK_CATALOG.slice(0, 15)) : customFoods;
    return list.filter(item => String(item?.name || '').toLowerCase().includes(safeQuery.toLowerCase()));
  }, [safeQuery, activeSubTab, customFoods, recentFoods]);

  const ingSearchResults = useMemo(() => {
    if (safeIngQuery.trim() === '') return [...MOCK_CATALOG, ...customFoods].slice(0, 15);
    return [...MOCK_CATALOG, ...customFoods].filter(item => String(item?.name || '').toLowerCase().includes(safeIngQuery.toLowerCase()));
  }, [safeIngQuery, customFoods]);

  useEffect(() => { setQuery(''); }, [activeSubTab]);

  const handleSelect = (item) => { setSelectedItem(item); setWeight(100); };

  const handleSaveToDiary = () => {
    if(!selectedItem) return;
    const factor = (Number(weight) || 0) / 100;
    const finalItem = { dish_name: selectedItem.name, total: { calories: Math.round(selectedItem.calories_100g * factor), protein: parseFloat((selectedItem.protein_100g * factor).toFixed(1)), fat: parseFloat((selectedItem.fats_100g * factor).toFixed(1)), carbs: parseFloat((selectedItem.carbs_100g * factor).toFixed(1)) } };
    onSave(finalItem);
    if (setRecentFoods) setRecentFoods(prev => [{ ...selectedItem, id: selectedItem.id || Date.now() }, ...prev.filter(i => i.id !== selectedItem.id)].slice(0, 15));
    setSelectedItem(null); setQuery('');
  };

  const addIngredientToRecipe = () => {
    if(!ingSelected) return;
    const nw = Number(ingWeight) || 0, factor = nw / 100;
    setRecipeIngredients([...recipeIngredients, { ...ingSelected, weight: nw, cals: ingSelected.calories_100g * factor, prot: ingSelected.protein_100g * factor, fat: ingSelected.fats_100g * factor, carbs: ingSelected.carbs_100g * factor }]);
    setIngSelected(null); setIsSearchingIngredient(false); setIngQuery(''); setRecipeError('');
  };

  const removeIngredient = (index) => setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));

  const totalRecipeWeight = recipeIngredients.reduce((s, i) => s + (Number(i.weight) || 0), 0);

  const saveCustomRecipe = () => {
    if(!recipeName || recipeIngredients.length === 0) { setRecipeError(t.tryAgain); return; }
    const factor = totalRecipeWeight > 0 ? 100 / totalRecipeWeight : 0;
    const recipeItem = {
      id: `custom-${Date.now()}`, name: String(recipeName), calories_100g: Math.round(recipeIngredients.reduce((s, i) => s + i.cals, 0) * factor), protein_100g: Number((recipeIngredients.reduce((s, i) => s + i.prot, 0) * factor).toFixed(1)), fats_100g: Number((recipeIngredients.reduce((s, i) => s + i.fat, 0) * factor).toFixed(1)), carbs_100g: Number((recipeIngredients.reduce((s, i) => s + i.carbs, 0) * factor).toFixed(1))
    };
    saveCustomRecipeToDB(recipeItem); setIsCreatingRecipe(false); setRecipeName(''); setRecipeIngredients([]); setRecipeError(''); setActiveSubTab('custom');
  };

  const handleBarcodeFile = async (e) => {
    if (subscription === 'bronze' && barcodeScansToday >= 7) { checkAccess('silver'); return; }
    const file = e.target.files[0]; if (!file) return;
    setIsScanning(true); setScanStatus('loading');
    try {
      const aiData = await analyzeImageWithGemini(file, true, lang);
      setScanStatus('idle'); setIsScanning(false);
      if (subscription === 'bronze') incrementScan('barcode');
      handleSelect({ id: Date.now(), name: String(aiData?.name || "Product"), calories_100g: aiData?.calories_100g || 0, protein_100g: aiData?.protein_100g || 0, fats_100g: aiData?.fats_100g || 0, carbs_100g: aiData?.carbs_100g || 0 }); 
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
          {ingSearchResults.map((item, idx) => (
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
            {recipeIngredients.map((ing, idx) => (
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
            {displayList.length > 0 ? displayList.map((item, idx) => (
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

const CameraScanner = React.memo(({ onSave, onCancel, subscription, scansToday, incrementScan, checkAccess }) => {
  const { t, lang } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle'), [result, setResult] = useState(null), [imagePreview, setImagePreview] = useState(null);
  
  const handleFileChange = async (e) => {
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

const WeightTracker = React.memo(({ history, onAdd }) => {
  const { t } = useContext(LanguageContext);
  const [inputWeight, setInputWeight] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); const val = parseFloat(String(inputWeight).replace(',', '.')); if (!isNaN(val) && val > 0) { onAdd(val); setInputWeight(''); } };
  
  const chartData = [...history].reverse();
  const maxW = chartData.length > 0 ? Math.max(...chartData.map(h => h.weight)) + 1 : 100;
  const minW = chartData.length > 0 ? Math.max(0, Math.min(...chartData.map(h => h.weight)) - 1) : 0;
  const range = maxW - minW || 1;
  const points = chartData.map((d, i) => `${(i / Math.max(chartData.length - 1, 1)) * 300},${100 - ((d.weight - minW) / range) * 100}`).join(' ');

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h2 className="text-slate-200 font-semibold mb-4 flex items-center gap-2"><Scale size={20} className="text-emerald-400" /> {t.weightTitle}</h2>
        <form onSubmit={handleSubmit} className="flex gap-3"><input type="text" inputMode="decimal" value={inputWeight} onChange={e => setInputWeight(String(e.target?.value || ''))} placeholder={t.weightPlaceholder} className="flex-1 bg-slate-900/80 border border-white/5 rounded-xl px-4 py-3 text-white outline-none text-center"/><button type="submit" className="btn-glass bg-emerald-500 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-[0_5px_15px_rgba(16,185,129,0.3)]">{t.add}</button></form>
      </div>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">{t.chart}</h3>
        {history.length > 1 ? (
          <div className="w-full h-32 relative flex items-center justify-center"><svg viewBox="-10 -10 320 120" className="w-full h-full overflow-visible"><polyline points={points} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" />{chartData.map((d, i) => <circle key={i} cx={(i / Math.max(chartData.length - 1, 1)) * 300} cy={100 - ((d.weight - minW) / range) * 100} r="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />)}</svg></div>
        ) : (<div className="w-full h-32 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl"><TrendingDown size={32} className="mb-2 opacity-50" /><p className="text-sm text-center px-4">{t.needMoreData}</p></div>)}
      </div>
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/5">
        <h3 className="text-sm font-medium text-slate-400 mb-4">{t.history}</h3>
        <div className="space-y-0">{history.map((record, index) => {
            const prevRecord = history[index + 1], diff = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : 0;
            return (
              <div key={record.id} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0"><span className="text-slate-300 font-medium">{record.date}</span><div className="flex items-center gap-4">{prevRecord ? (<span className={`flex items-center text-xs font-semibold ${diff < 0 ? 'text-emerald-400' : diff > 0 ? 'text-red-400' : 'text-slate-500'}`}>{diff < 0 ? <TrendingDown size={14} className="mr-1"/> : diff > 0 ? <TrendingUp size={14} className="mr-1"/> : <Minus size={14} className="mr-1"/>} {Math.abs(diff)}</span>) : <span className="text-xs text-slate-500">{t.start}</span>}<span className="text-lg font-bold w-16 text-right text-white">{record.weight}</span></div></div>
            );
        })}</div>
      </div>
    </div>
  );
});

const UserProfile = React.memo(({ currentSub, setSubscription }) => {
  const { t, lang, setLang } = useContext(LanguageContext);
  const [purchaseStatus, setPurchaseStatus] = useState('idle'), [expandedTier, setExpandedTier] = useState(null), [purchasingTier, setPurchasingTier] = useState(null);

  const handlePurchase = (level) => {
    setPurchasingTier(level); setPurchaseStatus('loading');
    setTimeout(() => {
      setPurchaseStatus('confetti'); 
      setTimeout(() => { setPurchaseStatus('success'); setSubscription(level); setTimeout(() => { setPurchaseStatus('idle'); setPurchasingTier(null); }, 3500); }, 500); 
    }, 1000);
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
          <option value="ru">🇷🇺 Русский</option><option value="en">🇬🇧 English</option><option value="pt">🇵🇹 Português</option><option value="fr">🇫🇷 Français</option><option value="kk">🇰🇿 Қазақша</option>
        </select>
      </div>

      <h3 className="font-bold text-lg px-1 mt-8 mb-4">{t.subsLevels}</h3>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-[2px] rounded-2xl">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full transition-all">
            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-[#cd7f32] flex items-center gap-2"><Shield size={20} /> Bronze</h4><span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">{currentSub === 'bronze' ? t.current : t.free}</span></div>
            <div onClick={() => setExpandedTier(expandedTier === 'bronze' ? null : 'bronze')} className="btn-glass flex items-center gap-1 text-slate-400 text-sm mb-2 w-full justify-between">{expandedTier === 'bronze' ? t.hideDetails : t.allFeatures} <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'bronze' ? 'rotate-180' : ''}`} size={16}/></div>
            {expandedTier === 'bronze' && (<ul className="text-sm text-slate-300 space-y-3 mb-4 mt-4 animate-in slide-in-from-top-2 fade-in"><li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>{t.bronzeF1}</span></li><li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>{t.bronzeF2} <b>(7)</b></span></li><li className="flex items-start gap-2 opacity-50"><Minus size={16} className="mt-0.5 shrink-0"/> <span>{t.bronzeF3}</span></li></ul>)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500 p-[2px] rounded-2xl shadow-lg">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden transition-all">
            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-slate-300 flex items-center gap-2"><Zap size={20} /> Silver</h4><span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg">199 ₽ / мес</span></div>
            <div onClick={() => setExpandedTier(expandedTier === 'silver' ? null : 'silver')} className="btn-glass flex items-center gap-1 text-slate-400 text-sm mb-4 w-full justify-between">{expandedTier === 'silver' ? t.hideDetails : t.allFeatures} <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'silver' ? 'rotate-180' : ''}`} size={16}/></div>
            {expandedTier === 'silver' && (<ul className="text-sm text-slate-300 space-y-3 mb-6 animate-in slide-in-from-top-2 fade-in"><li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>{t.silverF1}</span></li><li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>{t.silverF2} <b>(10)</b></span></li><li className="flex items-start gap-2"><Check size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span>{t.silverF3}</span></li></ul>)}
            {currentSub !== 'silver' && currentSub !== 'gold' ? (<div onClick={() => handlePurchase('silver')} className="btn-glass w-full bg-slate-700 text-white font-medium py-3 rounded-xl text-center">{t.buySilver}</div>) : (currentSub === 'silver' && <div className="w-full text-center text-slate-400 font-bold py-3 bg-slate-800 rounded-xl">{t.yourTier}</div>)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 p-[2px] rounded-2xl shadow-xl shadow-amber-500/20">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden transition-all">
            <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-lg text-amber-400 flex items-center gap-2"><Crown size={20} /> Gold</h4><span className="text-sm font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg">499 ₽ / мес</span></div>
            <div onClick={() => setExpandedTier(expandedTier === 'gold' ? null : 'gold')} className="btn-glass flex items-center gap-1 text-slate-300 text-sm mb-4 w-full justify-between">{expandedTier === 'gold' ? t.hideDetails : t.allFeatures} <ChevronDown className={`transition-transform duration-300 ${expandedTier === 'gold' ? 'rotate-180' : ''}`} size={16}/></div>
            {expandedTier === 'gold' && (<ul className="text-sm text-slate-300 space-y-3 mb-6 relative z-10 animate-in slide-in-from-top-2 fade-in"><li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>{t.goldF1}</span></li><li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>{t.goldF2}</span></li><li className="flex items-start gap-2 text-white"><Check size={16} className="text-amber-400 mt-0.5 shrink-0"/> <span>{t.goldF3}</span></li></ul>)}
            {currentSub !== 'gold' ? (<div onClick={() => handlePurchase('gold')} className="btn-glass w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.4)] text-center">{t.buyGold}</div>) : (<div className="w-full text-center text-amber-400 font-bold py-4 bg-amber-500/10 rounded-xl border border-amber-500/30">{t.proActive}</div>)}
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

const OnboardingScreen = React.memo(({ onComplete }) => {
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
