/**
 * Hebrew PDF wording: natural Israeli CV Hebrew (not a literal translation of en.ts), masculine forms, RTL.
 * Tech, product and project names stay in English. Same facts and same ids as en.ts; project names, stacks,
 * links, phone, email, profile URLs and dates are read from the site data by template.ts.
 */
import type { PdfCopy } from '../template.ts';

export const he: PdfCopy = {
    lang: 'he',
    dir: 'rtl',
    documentTitle: 'תומר שרמן – קורות חיים',
    name: 'תומר שרמן',
    headline: 'מפתח Full Stack',
    location: 'רחובות, ישראל',
    present: 'היום',
    monthStyle: 'long',

    headings: {
        summary: 'תקציר',
        skills: 'כישורים',
        projects: 'פרויקטים',
        education: 'השכלה',
        military: 'שירות צבאי',
    },

    summary:
        'מפתח Full Stack שמתחיל מהארכיטקטורה: ממפה קודם את זרימת הנתונים, ואז בונה בשכבות – צד לקוח, API ומסד נתונים – ומשלב AI במערכות באמצעות RAG, שרתי MCP וסוכנים. עובד עם React, TypeScript, Node.js, MySQL ו-MongoDB.',

    skills: [
        { label: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'Redux', 'React Hook Form', 'Vite', 'HTML/CSS'] },
        { label: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'Zod', 'JWT', 'Firebase Auth'] },
        { label: 'מסדי נתונים', items: ['MySQL', 'MongoDB', 'Mongoose'] },
        { label: 'AI וסוכנים', items: ['RAG', 'MCP servers', 'AI agents', 'OpenAI API', 'n8n', 'Prompt engineering'] },
        { label: 'DevOps וכלים', items:['Docker', 'Git', 'GitHub', 'GitHub Pages', 'Firebase', 'ngrok', 'Postman'] },
    ],

    languages: { label: 'שפות', items: ['עברית (שוטפת)', 'אנגלית (ברמה גבוהה)', 'רוסית (בסיסית)'] },

    linkLabels: { Live: 'אתר', Code: 'GitHub', npm: 'npm' },

    projects: [
        {
            id: 'crypto-tracker',
            description: 'מעקב אחר מחירי קריפטו בזמן אמת, עם caching חכם וניהול state גלובלי',
            bullets: [
                'בניתי מנגנון caching חכם: 2 קריאות API בטעינה, polling כל דקה ואפס קריאות בפעולות משתמש',
                'תכננתי ניהול state גלובלי עם Redux: כל קריאת נתונים מגיעה מה-store ולא מה-API',
            ],
        },
        {
            id: 'simple-url-scraper',
            description: 'ספריית scraping לכתובות URL, שפורסמה כחבילת npm',
            bullets: [
                'בניתי ממשק פשוט שסוכני AI יכולים להפעיל: מקבל URL ומחזיר את ה-metadata, ה-headers והקישורים שלו',
            ],
        },
        {
            id: 'vacation-tracker',
            description: 'אפליקציית Express עם CRUD לאדמין והמלצות AI לכל יעד',
            bullets: [
                'בניתי מנגנון הרשאות לפי תפקיד (משתמש ואדמין) עם שרשרת middlewares שמגבילה פעולות CRUD לאדמין בלבד',
                'חשפתי שאילתות DB ככלי MCP באמצעות express-mcp-handler, ושכבת ה-AI מחזירה JSON מובנה לכל יעד',
            ],
        },
        {
            id: 'freelance-price-proposal',
            description: 'כלי מסוג Claude skill שהופך הערות גולמיות של פרילנסר להצעת מחיר',
            bullets: [
                'תכננתי אותו להפיק הצעה מוכנה לשליחה ללקוח, ולצידה רשימה פרטית של מה שהפרילנסר שכח לציין',
                'בניתי אותו על בסיס הצעות מחיר אמיתיות שנאספו מפרילנסרים פעילים, והוא מתאים לכל שפה ולכל מקצוע',
            ],
        },
        {
            id: 'bax',
            description: 'תוסף Chrome שקורא את הדף הפתוח ועונה על שאלות לגביו',
            bullets: [
                'בניתי scraper מבוסס Cheerio שמסנן סקריפטים, ניווט, פרסומות ובאנרי cookies, והופך את הדף לשורות ממוספרות',
                'כתבתי בעצמי את לולאת הסוכן, בלי createAgent של LangChain, עם שני כלים: skim_page ו-read_lines',
            ],
        },
    ],

    education: [
        {
            id: 'john-bryce',
            title: 'מסלול פיתוח Full Stack ו-AI',
            org: 'John Bryce Academy',
            bullets: [
                'תוכנית Full Stack אינטנסיבית בשילוב AI, כולל RAG pipelines, שרתי MCP, סוכני AI ו-OpenAI API',
                'דגש על ארכיטקטורה נקייה, Backend בשכבות וניהול state',
            ],
        },
    ],

    military: [
        {
            id: 'idf-officer',
            // TODO: confirm the exact Hebrew role titles (descriptive rendering of "Field Intelligence Combat Officer" / "Operations Officer").
            title: 'קצין לוחם באיסוף הקרבי וקצין מבצעים',
            org: 'צה"ל', // ASCII quote (as typed on a Hebrew keyboard) so recruiters' searches for צה"ל match
            text: 'פיקדתי על מחלקת לוחמים בתנאי לחץ קיצוניים וקיבלתי החלטות קריטיות בזמן אמת. ניהלתי את חדר המבצעים, שמרתי על תקשורת ברורה בכמה ערוצים ונשאתי באחריות מלאה לניהול המשימות.',
        },
    ],
};
