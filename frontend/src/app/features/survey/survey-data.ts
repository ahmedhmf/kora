export interface SurveyQuestion {
    id: string;
    section: number;
    type: 'text' | 'select' | 'rating' | 'multi' | 'choice';
    question: {
        en: string;
        ar: string;
        de: string;
    };
    options?: {
        en: string;
        ar: string;
        de: string;
        value: string;
    }[];
    columns?: {
        en: string;
        ar: string;
        de: string;
    }[];
    rows?: {
        id: string;
        en: string;
        ar: string;
        de: string;
    }[];
}

export interface SurveySection {
    id: number;
    title: {
        en: string;
        ar: string;
        de: string;
    };
}

export const SURVEY_SECTIONS: SurveySection[] = [
    { id: 1, title: { en: 'Club Profile', ar: 'معلومات النادي', de: 'Club-Profil' } },
    { id: 2, title: { en: 'Current Balls You Use', ar: 'الكرات الحالية التي تستخدمونها', de: 'Aktuell verwendete Bälle' } },
    { id: 3, title: { en: 'Problems with Performance', ar: 'مشاكل الأداء', de: 'Probleme mit der Leistung' } },
    { id: 4, title: { en: 'Durability & Maintenance', ar: 'المتانة والصيانة', de: 'Haltbarkeit & Wartung' } },
    { id: 5, title: { en: 'Price & Purchasing', ar: 'السعر والشراء', de: 'Preis & Einkauf' } },
    { id: 6, title: { en: 'Ideal Future Ball', ar: 'الكرة المثالية المستقبلية', de: 'Idealer zukünftiger Ball' } },
];

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
    // Section 1: Club Profile
    {
        id: 'q1',
        section: 1,
        type: 'text',
        question: { en: 'Club name / team:', ar: 'اسم النادي / الفريق:', de: 'Club-Name / Mannschaft:' }
    },
    {
        id: 'q2',
        section: 1,
        type: 'choice',
        question: { en: 'Country and league level:', ar: 'الدولة ومستوى الدوري:', de: 'Land und Liga-Level:' },
        options: [
            { en: 'Premier League / First Division', ar: 'الدوري الممتاز / الدرجة الأولى', de: 'Premier League / Erste Liga', value: '1st' },
            { en: 'Second Division', ar: 'الدرجة الثانية', de: 'Zweite Liga', value: '2nd' },
            { en: 'Third Division', ar: 'الدرجة الثالثة', de: 'Dritte Liga', value: '3rd' },
            { en: 'Youth Academy', ar: 'أكاديمية الشباب', de: 'Jugendakademie', value: 'youth' },
            { en: 'Other', ar: 'أخرى', de: 'Andere', value: 'other' }
        ]
    },
    {
        id: 'q3',
        section: 1,
        type: 'choice',
        question: { en: 'Your role:', ar: 'دورك:', de: 'Ihre Rolle:' },
        options: [
            { en: 'Coach', ar: 'مدرب', de: 'Trainer', value: 'coach' },
            { en: 'Team Manager', ar: 'مدير الفريق', de: 'Teammanager', value: 'manager' },
            { en: 'Equipment Manager', ar: 'مدير المعدات', de: 'Ausrüstungsmanager', value: 'equipment' },
            { en: 'Player', ar: 'لاعب', de: 'Spieler', value: 'player' },
            { en: 'Other', ar: 'أخرى', de: 'Andere', value: 'other' }
        ]
    },
    // Section 2: Current Balls
    {
        id: 'q4_match',
        section: 2,
        type: 'text',
        question: { en: 'Match balls brands/models you use most:', ar: 'ما هي العلامات التجارية/الموديلات التي تستخدمونها أكثر في كرات المباريات:', de: 'Welche Ballmarken/-modelle verwenden Sie am häufigsten für Spielbälle:' }
    },
    {
        id: 'q4_training',
        section: 2,
        type: 'text',
        question: { en: 'Training balls brands/models you use most:', ar: 'ما هي العلامات التجارية/الموديلات التي تستخدمونها أكثر في كرات التدريب:', de: 'Welche Ballmarken/-modelle verwenden Sie am häufigsten für Trainingsbälle:' }
    },
    {
        id: 'q5',
        section: 2,
        type: 'rating',
        question: { en: 'How satisfied are you with your current match ball overall?', ar: 'ما مدى رضاك عن كرة المباراة الحالية بشكل عام؟', de: 'Wie zufrieden sind Sie insgesamt mit Ihrem aktuellen Spielball?' }
    },
    {
        id: 'q6',
        section: 2,
        type: 'choice',
        question: { en: 'How many new balls does your club buy per season?', ar: 'كم عدد الكرات الجديدة التي يشتريها ناديك في الموسم الواحد؟', de: 'Wie viele neue Bälle kauft Ihr Club pro Saison?' },
        options: [
            { en: 'Less than 20', ar: 'أقل من 20', de: 'Weniger als 20', value: '<20' },
            { en: '20–50', ar: '20–50', de: '20–50', value: '20-50' },
            { en: '51–100', ar: '51–100', de: '51–100', value: '51-100' },
            { en: 'More than 100', ar: 'أكثر من 100', de: 'Mehr als 100', value: '>100' }
        ]
    },
    // Section 3: Performance (Simplified as individual ratings for better UI)
    {
        id: 'q7_grip_dry',
        section: 3,
        type: 'rating',
        question: { en: 'Grip when dry', ar: 'القبضة عندما تكون جافة', de: 'Griffigkeit trocken' }
    },
    {
        id: 'q7_grip_sweat',
        section: 3,
        type: 'rating',
        question: { en: 'Grip with sweat/humidity', ar: 'القبضة مع العرق/الرطوبة', de: 'Griffigkeit bei Schweiß/Feuchtigkeit' }
    },
    {
        id: 'q7_grip_resin',
        section: 3,
        type: 'rating',
        question: { en: 'Grip with resin', ar: 'القبضة مع الريزن', de: 'Griffigkeit mit Harz' }
    },
    {
        id: 'q7_softness',
        section: 3,
        type: 'rating',
        question: { en: 'Softness/comfort in hand', ar: 'النعومة/الراحة في اليد', de: 'Weichheit/Komfort in der Hand' }
    },
    {
        id: 'q7_bounce',
        section: 3,
        type: 'rating',
        question: { en: 'Bounce consistency', ar: 'ثبات الارتداد', de: 'Konstantes Sprungverhalten' }
    },
    {
        id: 'q7_flight',
        section: 3,
        type: 'rating',
        question: { en: 'Flight/accuracy', ar: 'الطيران/الدقة', de: 'Flug/Genauigkeit' }
    },
    {
        id: 'q7_visibility',
        section: 3,
        type: 'rating',
        question: { en: 'Visibility (colour/design)', ar: 'الرؤية (اللون/التصميم)', de: 'Sichtbarkeit (Farbe/Design)' }
    },
    {
        id: 'q8',
        section: 3,
        type: 'multi',
        question: { en: 'Biggest problems with today\'s balls:', ar: 'ما هي أكبر المشاكل التي يشتكي منها لاعبوك بخصوص كرات اليوم؟', de: 'Was sind die GRÖSSTEN Probleme bei den heutigen Bällen?' },
        options: [
            { en: 'Not enough grip without resin', ar: 'قبضة غير كافية بدون ريزن', de: 'Nicht genug Griffigkeit ohne Harz', value: 'grip_no_resin' },
            { en: 'Too slippery when sweaty', ar: 'زلقة جداً عند التعرق', de: 'Zu rutschig bei Schweiß', value: 'slippery_sweat' },
            { en: 'Too hard / hurts fingers', ar: 'صلبة جداً / تؤلم الأصابع', de: 'Zu hart / schmerzt an den Fingern', value: 'too_hard' },
            { en: 'Becomes "stone" in winter', ar: 'تصبح "حجراً" في الشتاء', de: 'Wird im Winter "Stein"', value: 'stone_winter' },
            { en: 'Unpredictable bounce', ar: 'ارتداد غير متوقع', de: 'Unvorhersehbares Sprungverhalten', value: 'unpredictable_bounce' },
            { en: 'Loses air too fast', ar: 'تفقد الهواء بسرعة', de: 'Verliert zu schnell Luft', value: 'loses_air' },
            { en: 'Wears out too quickly', ar: 'تبلى بسرعة', de: 'Nutzt sich zu schnell ab', value: 'wears_out' },
            { en: 'Ball gets too dirty with resin', ar: 'تتّسخ كثيراً بالريزن', de: 'Ball wird mit Harz zu schmutzig', value: 'dirty_resin' },
            { en: 'Different balls in league vs training', ar: 'كرات مختلفة في الدوري مقابل التدريب', de: 'Unterschiedliche Bälle in Liga vs. Training', value: 'different_balls' }
        ]
    },
    {
        id: 'q9',
        section: 3,
        type: 'choice',
        question: { en: 'Have you noticed more injuries influenced by the ball?', ar: 'هل لاحظت المزيد من الإصابات أو الألم تعتقد أنها متأثرة بالكرة؟', de: 'Haben Sie vermehrt Verletzungen bemerkt, die vom Ball beeinflusst werden?' },
        options: [
            { en: 'Yes', ar: 'نعم', de: 'Ja', value: 'yes' },
            { en: 'No', ar: 'لا', de: 'Nein', value: 'no' }
        ]
    },
    {
        id: 'q9_desc',
        section: 3,
        type: 'text',
        question: { en: 'If yes, please describe:', ar: 'إذا كانت الإجابة نعم، يرجى الوصف:', de: 'Falls ja, bitte beschreiben:' }
    },
    // Section 4: Durability
    {
        id: 'q10',
        section: 4,
        type: 'choice',
        question: { en: 'Average match ball life before training?', ar: 'في المتوسط، كم من الوقت تبقى كرة المباراة جيدة للمباريات؟', de: 'Wie lange bleibt ein Spielball im Durchschnitt gut genug?' },
        options: [
            { en: 'Less than 3 months', ar: 'أقل من 3 أشهر', de: 'Weniger als 3 Monate', value: '<3m' },
            { en: '3–6 months', ar: '3–6 أشهر', de: '3–6 Monate', value: '3-6m' },
            { en: '6–12 months', ar: '6–12 شهراً', de: '6–12 Monate', value: '6-12m' },
            { en: 'More than 12 months', ar: 'أكثر من 12 شهراً', de: 'Mehr als 12 Monate', value: '>12m' }
        ]
    },
    {
        id: 'q11',
        section: 4,
        type: 'choice',
        question: { en: 'What forces replacement first?', ar: 'ما الذي يجبرك عادةً على استبدال الكرات أولاً؟', de: 'Was zwingt Sie normalerweise zuerst dazu, Bälle zu ersetzen?' },
        options: [
            { en: 'Loss of grip', ar: 'فقدان القبضة', de: 'Verlust der Griffigkeit', value: 'grip' },
            { en: 'Surface damage / peeling', ar: 'تلف السطح / التقشير', de: 'Oberflächenschaden / Abblättern', value: 'surface' },
            { en: 'Split seams', ar: 'انشقاق الخياطة', de: 'Aufgeplatzte Nähte', value: 'seams' },
            { en: 'Loss of pressure', ar: 'فقدان الضغط', de: 'Druckverlust', value: 'pressure' },
            { en: 'Change of league ball', ar: 'تغيير كرة الدوري الرسمية', de: 'Wechsel des offiziellen Ligaballs', value: 'league' }
        ]
    },
    {
        id: 'q12',
        section: 4,
        type: 'choice',
        question: { en: 'How often to re-inflate?', ar: 'كم مرة تحتاج لإعادة نفخ كرات المباريات؟', de: 'Wie oft müssen Sie Ihre Spielbälle aufpumpen?' },
        options: [
            { en: 'Before every session', ar: 'قبل كل جلسة', de: 'Vor jeder Trainingseinheit', value: 'every' },
            { en: 'Once per week', ar: 'مرة في الأسبوع', de: 'Einmal pro Woche', value: 'week' },
            { en: 'Once per month', ar: 'مرة في الشهر', de: 'Einmal pro Monat', value: 'month' },
            { en: 'Rarely / almost never', ar: 'نادراً / تقريباً أبداً', de: 'Selten / fast nie', value: 'never' }
        ]
    },
    {
        id: 'q13',
        section: 4,
        type: 'choice',
        question: { en: 'Do you clean resin?', ar: 'هل تقوم حالياً بتنظيف الريزن من الكرات أو الأرضيات؟', de: 'Reinigen Sie derzeit Harz von Bällen oder Böden?' },
        options: [
            { en: 'Yes, regularly', ar: 'نعم، بانتظام', de: 'Ja, regelmäßig', value: 'yes' },
            { en: 'Sometimes', ar: 'أحياناً', de: 'Manchmal', value: 'sometimes' },
            { en: 'Never', ar: 'أبداً', de: 'Nie', value: 'never' }
        ]
    },
    // Section 5: Price
    {
        id: 'q14',
        section: 5,
        type: 'choice',
        question: { en: 'Typical budget per match ball?', ar: 'ما هي ميزانيتك النموذجية لكل كرة مباراة؟', de: 'Typisches Budget pro Spielball?' },
        options: [
            { en: 'Less than €40', ar: 'أقل من 40 يورو', de: 'Weniger als 40 €', value: '<40' },
            { en: '€40–60', ar: '40–60 يورو', de: '40–60 €', value: '40-60' },
            { en: '€60–80', ar: '60–80 يورو', de: '60–80 €', value: '60-80' },
            { en: 'More than €80', ar: 'أكثر من 80 يورو', de: 'Mehr als 80 €', value: '>80' }
        ]
    },
    {
        id: 'q15',
        section: 5,
        type: 'choice',
        question: { en: 'What is more painful right now?', ar: 'ما هو الأكثر إيلاماً لناديك الآن؟', de: 'Was ist für Ihren Club derzeit am schmerzhaftesten?' },
        options: [
            { en: 'Price per ball', ar: 'السعر لكل كرة', de: 'Preis pro Ball', value: 'price' },
            { en: 'Durability', ar: 'المتانة', de: 'Haltbarkeit', value: 'durability' },
            { en: 'Quality consistency', ar: 'الجودة/الثبات', de: 'Qualität/Konsistenz', value: 'quality' },
            { en: 'Availability / delivery', ar: 'التوفر / وقت التسليم', de: 'Verfügbarkeit / Lieferzeit', value: 'availability' }
        ]
    },
    {
        id: 'q16',
        section: 5,
        type: 'choice',
        question: { en: 'How do you usually get balls?', ar: 'كيف تحصل عادةً على الكرات؟', de: 'Wie beziehen Sie normalerweise Bälle?' },
        options: [
            { en: 'Direct from brand', ar: 'مباشرة من العلامة التجارية', de: 'Direkt von der Marke', value: 'direct' },
            { en: 'Distributor / agent', ar: 'موزع / وكيل', de: 'Verteiler / Agent', value: 'distributor' },
            { en: 'Local sports shop', ar: 'متجر رياضي محلي', de: 'Lokales Sportgeschäft', value: 'shop' },
            { en: 'Federation / league deal', ar: 'صفقة الاتحاد / الدوري', de: 'Verband / Liga-Deal', value: 'federation' }
        ]
    },
    // Section 6: Future
    {
        id: 'q17_1',
        section: 6,
        type: 'text',
        question: { en: 'Change #1 for today\'s handballs:', ar: 'التغيير الأول لكرات اليد اليوم:', de: 'Änderung #1 bei heutigen Handbällen:' }
    },
    {
        id: 'q17_2',
        section: 6,
        type: 'text',
        question: { en: 'Change #2 for today\'s handballs:', ar: 'التغيير الثاني لكرات اليد اليوم:', de: 'Änderung #2 bei heutigen Handbällen:' }
    },
    {
        id: 'q17_3',
        section: 6,
        type: 'text',
        question: { en: 'Change #3 for today\'s handballs:', ar: 'التغيير الثالث لكرات اليد اليوم:', de: 'Änderung #3 bei heutigen Handbällen:' }
    },
    {
        id: 'q18_grip_no_resin',
        section: 6,
        type: 'rating',
        question: { en: 'Excellent grip without resin', ar: 'قبضة ممتازة بدون ريزن', de: 'Ausgezeichnete Griffigkeit ohne Harz' }
    },
    {
        id: 'q18_grip_with_resin',
        section: 6,
        type: 'rating',
        question: { en: 'Works well with resin', ar: 'تعمل بشكل جيد مع الريزن', de: 'Funktioniert gut mit Harz' }
    },
    {
        id: 'q18_soft_feel',
        section: 6,
        type: 'rating',
        question: { en: 'Very soft feel, less pain', ar: 'ملمس ناعم جداً، ألم أقل', de: 'Sehr weiches Gefühl, weniger Schmerz' }
    },
    {
        id: 'q18_long_lasting',
        section: 6,
        type: 'rating',
        question: { en: 'Long-lasting grip', ar: 'قبضة طويلة الأمد', de: 'Langanhaltende Griffigkeit' }
    },
    {
        id: 'q18_easy_clean',
        section: 6,
        type: 'rating',
        question: { en: 'Easy to clean', ar: 'سهلة التنظيف', de: 'Leicht zu reinigen' }
    },
    {
        id: 'q18_approval',
        section: 6,
        type: 'rating',
        question: { en: 'IHF/EHF approval', ar: 'موافقة IHF/EHF', de: 'IHF/EHF-Zulassung' }
    },
    {
        id: 'q18_design',
        section: 6,
        type: 'rating',
        question: { en: 'Attractive design/colours', ar: 'تصميم جذاب/ألوان النادي', de: 'Attraktives Design/Clubfarben' }
    },
    {
        id: 'q19',
        section: 6,
        type: 'choice',
        question: { en: 'Willing to test a new professional ball?', ar: 'هل ترغب في اختبار كرة احترافية جديدة؟', de: 'Bereit, einen neuen Profi-Ball zu testen?' },
        options: [
            { en: 'Yes', ar: 'نعم', de: 'Ja', value: 'yes' },
            { en: 'No', ar: 'لا', de: 'Nein', value: 'no' }
        ]
    },
    {
        id: 'q19_contact',
        section: 6,
        type: 'text',
        question: { en: 'Contact email / WhatsApp:', ar: 'البريد الإلكتروني / الواتساب:', de: 'Kontakt-E-Mail / WhatsApp:' }
    }
];
