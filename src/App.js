import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- INLINE SVG ICONS (Replaces @phosphor-icons/react) ---
const TrophyIcon = ({ size = 24, className = '', weight = 'fill' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M240,88H212.06A72.12,72.12,0,0,0,216,48a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8,72.12,72.12,0,0,0,3.94,24H16a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h24v48a8,8,0,0,0,8,8H88a8,8,0,0,0,0-16H56V152H200v32H168a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V152h24a8,8,0,0,0,8-8V88ZM56,56H200a56.1,56.1,0,0,1-4,20.26A64.1,64.1,0,0,0,128,64a64.1,64.1,0,0,0-68,12.26A56.1,56.1,0,0,1,56,56Zm168,80H32V104H224Z"></path></svg>
);
const CertificateIcon = ({ size = 24, className = '', weight = 'regular' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M213.54,82.63a8,8,0,0,0-8.68,1.45L128,157.81,51.14,84.08a8,8,0,1,0-10.28,12.19l82.34,70.58a8,8,0,0,0,10.28,0l82.34-70.58A8,8,0,0,0,213.54,82.63ZM224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V74.83l-16.49,14.13-16.83-14.42L128,126.19,65.32,74.54,48.49,60.7,32,74.83V64ZM32,192V91.17l88.86,76.17a16,16,0,0,0,20.28,0L224,91.17V192Z"></path></svg>
);
const DownloadSimpleIcon = ({ size = 24, className = '', weight = 'bold' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M240,136v64a20,20,0,0,1-20,20H36a20,20,0,0,1-20-20V136a12,12,0,0,1,24,0v64a4,4,0,0,0,4,4H220a4,4,0,0,0,4-4V136a12,12,0,0,1,24,0Zm-106.3-5.7-48-48a12,12,0,0,0-17.4,17.4L116.5,152,68.3,200.3a12,12,0,1,0,17.4,17.4l48-48a12,12,0,0,0,0-17.4ZM128,152a12,12,0,0,0,12-12V28a12,12,0,0,0-24,0v112A12,12,0,0,0,128,152Z"></path></svg>
);
const ArrowRightIcon = ({ size = 24, className = '', weight = 'bold' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.49a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
);
const MagnifyingGlassIcon = ({ size = 24, className = '', weight = 'regular' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
);
const CheckCircleIcon = ({ size = 24, className = '', weight = 'fill' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
);
const XCircleIcon = ({ size = 24, className = '', weight = 'fill' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className={className} viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
);

// --- CONTEXT FOR PROGRESS MANAGEMENT ---
const ProgressContext = createContext();

const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState({});

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem('nebrasProgress');
            if (savedProgress) {
                setProgress(JSON.parse(savedProgress));
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage:", error);
        }
    }, []);

    const updateProgress = (trackId) => {
        const newProgress = { ...progress, [trackId]: true };
        setProgress(newProgress);
        try {
            localStorage.setItem('nebrasProgress', JSON.stringify(newProgress));
        } catch (error) {
            console.error("Failed to save progress to localStorage:", error);
        }
    };
    
    const isTrackCompleted = (trackId) => {
        return !!progress[trackId];
    };

    return (
        <ProgressContext.Provider value={{ progress, updateProgress, isTrackCompleted }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);

// --- MOCK DATA (COURSES AND QUIZZES) ---
const tracksData = [
    {
        id: 'python-basics',
        title: 'أساسيات لغة بايثون',
        category: 'برمجة',
        description: 'تعلم أساسيات بايثون، واحدة من أسهل وأقوى لغات البرمجة في العالم. هذا المسار مثالي للمبتدئين.',
        videoId: 'mvZHDpCHphk',
        quiz: [
            { question: 'ما هي الوظيفة المستخدمة لطباعة المخرجات في بايثون؟', options: ['print()', 'console.log()', 'display()', 'echo()'], correctAnswer: 'print()' },
            { question: 'أي من التالي هو نوع بيانات غير قابل للتغيير في بايثون؟', options: ['List', 'Dictionary', 'Set', 'Tuple'], correctAnswer: 'Tuple' },
            { question: 'كيف تبدأ تعليقًا من سطر واحد في بايثون؟', options: ['//', '#', '/*', '<!--'], correctAnswer: '#' },
            { question: 'ما هي الكلمة المفتاحية المستخدمة لتعريف دالة في بايثون؟', options: ['function', 'def', 'fun', 'define'], correctAnswer: 'def' },
            { question: 'ماذا تُرجع `len("مرحباً")`؟', options: ['5', '6', '4', 'خطأ'], correctAnswer: '5' },
        ],
    },
    {
        id: 'html-fundamentals',
        title: 'مدخل إلى HTML5',
        category: 'تطوير الويب',
        description: 'اكتشف هيكل صفحات الويب مع HTML5. تعلم كيفية بناء صفحات ويب بسيطة ومنظمة.',
        videoId: '6QAELgirvjs',
        quiz: [
            { question: 'ماذا يمثل اختصار HTML؟', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language' },
            { question: 'أي وسم يستخدم لإنشاء فقرة نصية؟', options: ['<p>', '<div>', '<span>', '<text>'], correctAnswer: '<p>' },
            { question: 'ما هو الوسم الصحيح لإدراج صورة؟', options: ['<image src="url">', '<img src="url">', '<picture src="url">', '<src img="url">'], correctAnswer: '<img src="url">' },
            { question: 'أي وسم يستخدم لإنشاء رابط تشعبي؟', options: ['<link>', '<a>', '<href>', '<hyperlink>'], correctAnswer: '<a>' },
            { question: 'ما هو دور السمة `alt` في وسم `<img>`؟', options: ['إضافة عنوان للصورة', 'تحديد عرض الصورة', 'عرض نص بديل إذا لم يتم تحميل الصورة', 'إضافة رابط للصورة'], correctAnswer: 'عرض نص بديل إذا لم يتم تحميل الصورة' },
        ],
    },
    {
        id: 'css-for-beginners',
        title: 'تنسيق الصفحات مع CSS3',
        category: 'تطوير الويب',
        description: 'أضف لمسة من الجمال والإبداع لصفحات الويب الخاصة بك باستخدام CSS3. تعلم كيفية التحكم في الألوان والخطوط والتخطيط.',
        videoId: 'qyVkLebgfzY',
        quiz: [
            { question: 'ماذا يمثل اختصار CSS؟', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets' },
            { question: 'أي خاصية تستخدم لتغيير لون خلفية عنصر؟', options: ['color', 'background-color', 'bgcolor', 'background'], correctAnswer: 'background-color' },
            { question: 'كيف تختار عنصرًا له `id="header"`؟', options: ['.header', '#header', 'header', '*header'], correctAnswer: '#header' },
            { question: 'أي خاصية تستخدم لتغيير لون النص؟', options: ['text-color', 'font-color', 'color', 'text-style'], correctAnswer: 'color' },
            { question: 'ما هو نموذج الصندوق (Box Model) في CSS بالترتيب من الداخل للخارج؟', options: ['Margin, Border, Padding, Content', 'Content, Padding, Border, Margin', 'Content, Margin, Border, Padding', 'Padding, Content, Border, Margin'], correctAnswer: 'Content, Padding, Border, Margin' },
        ],
    },
    {
        id: 'javascript-essentials',
        title: 'أساسيات جافاسكريبت',
        category: 'تطوير الويب',
        description: 'اجعل صفحات الويب تفاعلية وديناميكية مع جافاسكريبت، لغة البرمجة الأساسية للويب.',
        videoId: 'gIGGhFlGgLI',
        quiz: [
            { question: 'كيف تعلن عن متغير يمكن تغيير قيمته؟', options: ['const', 'var', 'let', 'جميع ما سبق'], correctAnswer: 'let' },
            { question: 'أي رمز يستخدم للمقارنة الصارمة (قيمة ونوع)؟', options: ['==', '=', '===', '!='], correctAnswer: '===' },
            { question: 'كيف تحصل على عنصر HTML باستخدام id الخاص به؟', options: ['document.getElementById()', 'document.querySelector()', 'document.getElement()', 'window.getElementById()'], correctAnswer: 'document.getElementById()' },
            { question: 'ما هي نتيجة `typeof "5"`؟', options: ['number', 'string', 'object', 'undefined'], correctAnswer: 'string' },
            { question: 'أي دالة تستخدم لتحويل JSON إلى كائن JavaScript؟', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.object()', 'JSON.convert()'], correctAnswer: 'JSON.parse()' },
        ],
    },
    {
        id: 'ai-introduction',
        title: 'مقدمة في الذكاء الاصطناعي',
        category: 'الذكاء الاصطناعي',
        description: 'استكشف عالم الذكاء الاصطناعي المثير، وتعرف على مفاهيمه الأساسية وتطبيقاته العملية التي تغير عالمنا.',
        videoId: '0I9qt2YQlvM',
        quiz: [
            { question: 'ما هو المجال الفرعي من الذكاء الاصطناعي الذي يركز على تدريب الآلات من البيانات؟', options: ['الروبوتات', 'تعلم الآلة', 'معالجة اللغات الطبيعية', 'الرؤية الحاسوبية'], correctAnswer: 'تعلم الآلة' },
            { question: 'ماذا يمثل "اختبار تورينج"؟', options: ['اختبار لسرعة الحاسوب', 'اختبار لقدرة الآلة على إظهار سلوك ذكي لا يمكن تمييزه عن الإنسان', 'اختبار لقوة معالج الرسوميات', 'اختبار لأمان النظام'], correctAnswer: 'اختبار لقدرة الآلة على إظهار سلوك ذكي لا يمكن تمييزه عن الإنسان' },
            { question: 'أي من التالي مثال على "التعلم الخاضع للإشراف"؟', options: ['تجميع العملاء بناءً على سلوك الشراء', 'تصنيف رسائل البريد الإلكتروني إلى "عشوائي" أو "هام"', 'لعب الشطرنج ضد النفس للتحسن', 'اكتشاف أنماط غريبة في المعاملات المالية'], correctAnswer: 'تصنيف رسائل البريد الإلكتروني إلى "عشوائي" أو "هام"' },
        ],
    },
    {
        id: 'cybersecurity-basics',
        title: 'أساسيات الأمن السيبراني',
        category: 'الأمن السيبراني',
        description: 'تعلم كيفية حماية نفسك وبياناتك في العالم الرقمي. اكتشف التهديدات الشائعة وأفضل الممارسات للبقاء آمنًا.',
        videoId: 'MR-jR0IAIQs',
        quiz: [
            { question: 'ما هو "التصيد الاحتيالي" (Phishing)؟', options: ['نوع من الفيروسات', 'هجوم يهدف لسرقة المعلومات الحساسة عن طريق انتحال هوية جهة موثوقة', 'برنامج لتشفير الملفات', 'جدار حماية'], correctAnswer: 'هجوم يهدف لسرقة المعلومات الحساسة عن طريق انتحال هوية جهة موثوقة' },
            { question: 'أي من التالي يعتبر كلمة مرور قوية؟', options: ['12345678', 'password', 'Ahmed2023', 'Tr#v3L!ng@P$ris'], correctAnswer: 'Tr#v3L!ng@P$ris' },
            { question: 'ما هي المصادقة الثنائية (2FA)؟', options: ['استخدام كلمتي مرور', 'عملية تسجيل دخول تتطلب طريقتين للتحقق من الهوية', 'برنامج مكافحة فيروسات', 'تشفير القرص الصلب'], correctAnswer: 'عملية تسجيل دخول تتطلب طريقتين للتحقق من الهوية' },
        ],
    },
    {
        id: 'git-and-github',
        title: 'التحكم في الإصدارات مع Git و GitHub',
        category: 'أدوات المطورين',
        description: 'تعلم كيفية تتبع التغييرات في مشاريعك البرمجية والتعاون مع المطورين الآخرين باستخدام Git و GitHub.',
        videoId: 'fDkR0TDR9dI',
        quiz: [
            { question: 'ما هو الأمر المستخدم لتهيئة مستودع Git جديد؟', options: ['git start', 'git new', 'git init', 'git create'], correctAnswer: 'git init' },
            { question: 'ما هو الأمر المستخدم لإرسال التغييرات الملتزم بها إلى مستودع بعيد؟', options: ['git pull', 'git push', 'git commit', 'git upload'], correctAnswer: 'git push' },
            { question: 'ماذا يفعل الأمر `git clone`؟', options: ['يحذف مستودعًا', 'ينشئ نسخة محلية من مستودع بعيد', 'ينشئ فرعًا جديدًا', 'يدمج فرعين'], correctAnswer: 'ينشئ نسخة محلية من مستودع بعيد' },
            { question: 'ما هو الأمر المستخدم لتسجيل التغييرات في المستودع المحلي؟', options: ['git add', 'git save', 'git stage', 'git commit -m "message"'], correctAnswer: 'git commit -m "message"' },
        ],
    },
    {
        id: 'react-intro',
        title: 'مقدمة إلى React.js',
        category: 'تطوير الويب',
        description: 'اكتشف قوة بناء واجهات المستخدم الحديثة مع React، المكتبة الشهيرة من فيسبوك.',
        videoId: '3AJfX4Cd64c',
        quiz: [
            { question: 'ما هو JSX؟', options: ['امتداد لجافاسكريبت يشبه HTML', 'نوع بيانات في React', 'مكتبة لتنسيق الأنماط', 'نظام إدارة حالة'], correctAnswer: 'امتداد لجافاسكريبت يشبه HTML' },
            { question: 'كيف تمرر البيانات من مكون أب إلى مكون ابن؟', options: ['عبر State', 'عبر Context', 'عبر Props', 'عبر Redux'], correctAnswer: 'عبر Props' },
            { question: 'ما هو الـ Hook المستخدم لإضافة حالة إلى المكونات الدالية؟', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctAnswer: 'useState' },
        ],
    },
];

const categories = [...new Set(tracksData.map(track => track.category))];

// --- REUSABLE UI COMPONENTS ---

const Header = () => (
    <header className="bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-purple-500/10 sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
                <TrophyIcon size={36} className="text-purple-400" />
                <h1 className="text-3xl font-bold text-white tracking-wider">نبراس</h1>
            </Link>
        </nav>
    </header>
);

const Footer = () => (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Nebras Platform. All Rights Reserved.</p>
            <p className="text-sm mt-2">by pplo.dev</p>
        </div>
    </footer>
);

const TrackCard = ({ track, index }) => {
    const { isTrackCompleted } = useProgress();
    const navigate = useNavigate();
    const completed = isTrackCompleted(track.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-2 flex flex-col cursor-pointer"
            onClick={() => navigate(`/track/${track.id}`)}
        >
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">{track.category}</span>
                    {completed && <CheckCircleIcon size={24} className="text-green-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">{track.title}</h3>
                <p className="text-gray-400 text-base flex-grow">{track.description}</p>
                <div className="mt-6 flex items-center justify-between text-cyan-400">
                    <span className="font-semibold">ابدأ التعلم</span>
                    <ArrowRightIcon size={20} />
                </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
        </motion.div>
    );
};

const Quiz = ({ track }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();
    const { updateProgress } = useProgress();

    const handleSelectAnswer = (questionIndex, option) => {
        if (submitted) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: option,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let currentScore = 0;
        track.quiz.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setSubmitted(true);

        if (currentScore === track.quiz.length) {
            updateProgress(track.id);
        }
    };

    const getOptionClass = (question, option, index) => {
        if (!submitted) {
            return selectedAnswers[index] === option 
                ? 'bg-purple-600 border-purple-400' 
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600';
        }
        if (option === question.correctAnswer) return 'bg-green-500/30 border-green-500';
        if (selectedAnswers[index] === option && option !== question.correctAnswer) return 'bg-red-500/30 border-red-500';
        return 'bg-gray-800 border-gray-700 opacity-70';
    };
    
    const allQuestionsAnswered = Object.keys(selectedAnswers).length === track.quiz.length;

    return (
        <div className="mt-12">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">اختبر معلوماتك</h2>
            <form onSubmit={handleSubmit}>
                {track.quiz.map((q, index) => (
                    <motion.div 
                        key={index} 
                        className="bg-gray-800 p-6 rounded-lg mb-6 shadow-md"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <p className="text-xl font-semibold text-white mb-4">{index + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((option, optionIndex) => (
                                <button
                                    type="button"
                                    key={optionIndex}
                                    onClick={() => handleSelectAnswer(index, option)}
                                    disabled={submitted}
                                    className={`p-4 rounded-lg text-right text-white font-medium border-2 transition-all duration-300 ${getOptionClass(q, option, index)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {submitted && (
                            <div className="mt-4 flex items-center gap-2">
                                {selectedAnswers[index] === q.correctAnswer ? <CheckCircleIcon size={20} className="text-green-400" /> : <XCircleIcon size={20} className="text-red-400" />}
                                <span className="text-sm text-gray-300">الإجابة الصحيحة: {q.correctAnswer}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
                
                {!submitted && (
                    <div className="text-center mt-8">
                        <button 
                            type="submit"
                            disabled={!allQuestionsAnswered}
                            className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-3 px-12 rounded-lg text-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                        >
                            إرسال الإجابات
                        </button>
                    </div>
                )}
            </form>

            <AnimatePresence>
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mt-10 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-center"
                    >
                        <h3 className="text-3xl font-bold text-white">نتيجتك</h3>
                        <p className="text-6xl font-bold my-4" style={{ color: score === track.quiz.length ? '#4ade80' : '#f87171' }}>
                            {score} / {track.quiz.length}
                        </p>
                        {score === track.quiz.length ? (
                            <>
                                <p className="text-green-300 text-xl mb-6">ممتاز! لقد أتقنت هذا المسار بنجاح.</p>
                                <button
                                    onClick={() => navigate(`/certificate/${track.id}`)}
                                    className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
                                >
                                    <CertificateIcon size={24} />
                                    الحصول على الشهادة
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-yellow-300 text-xl mb-6">لا بأس، حاول مرة أخرى! الممارسة تصنع الإتقان.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setSelectedAnswers({}); setScore(0); }}
                                    className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
                                >
                                    إعادة الاختبار
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CertificateDisplay = React.forwardRef(({ trackTitle, studentName, date }, ref) => (
    <div ref={ref} className="bg-gray-50 text-gray-900 p-8 md:p-12 rounded-lg shadow-2xl max-w-4xl mx-auto border-8 border-purple-300" style={{ direction: 'ltr' }}>
        <div className="border-2 border-purple-500 p-8 rounded-md text-center relative">
            <div className="absolute top-4 right-4"><TrophyIcon size={48} className="text-yellow-500" /></div>
            <div className="absolute top-4 left-4"><TrophyIcon size={48} className="text-yellow-500" /></div>
            <h1 className="text-5xl font-bold text-purple-800">Certificate of Completion</h1>
            <p className="text-xl mt-8">This is to certify that</p>
            <p className="text-4xl font-extrabold text-cyan-700 my-6 tracking-wider">{studentName || 'Your Name Here'}</p>
            <p className="text-xl">has successfully completed the track</p>
            <p className="text-3xl font-bold text-purple-800 my-4">{trackTitle}</p>
            <div className="mt-12 flex justify-between items-center">
                <div><p className="font-bold">Issue Date</p><p>{date}</p></div>
                <div><p className="font-bold">Nebras Platform</p><p className="text-sm">Your Gateway to Tech Knowledge</p></div>
            </div>
            <div className="absolute bottom-2 right-2 left-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
        </div>
    </div>
));


// --- PAGES ---

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('الكل');

    const filteredTracks = tracksData.filter(track => {
        const matchesCategory = selectedCategory === 'الكل' || track.category === selectedCategory;
        const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) || track.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-6 py-12"
        >
            <div className="text-center mb-12">
                <motion.h1 
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="text-5xl md:text-6xl font-extrabold text-white mb-4"
                >
                    بوابتك نحو <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">إتقان التقنية</span>
                </motion.h1>
                <motion.p 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                    className="text-xl text-gray-300 max-w-3xl mx-auto"
                >
                    منصة نبراس تقدم مسارات تعليمية مجانية باللغة العربية في أحدث المجالات التقنية. ابدأ رحلتك اليوم!
                </motion.p>
            </div>

            <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-10"
            >
                <div className="relative flex-grow mb-6">
                    <input
                        type="text"
                        placeholder="ابحث عن مسار..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-3 pr-12 pl-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <MagnifyingGlassIcon size={24} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button onClick={() => setSelectedCategory('الكل')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === 'الكل' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>الكل</button>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === cat ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{cat}</button>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredTracks.length > 0 ? (
                        filteredTracks.map((track, index) => <TrackCard key={track.id} track={track} index={index} />)
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 text-xl col-span-full mt-8">
                            لا توجد مسارات تطابق بحثك.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const TrackPage = () => {
    const { id } = useParams();
    const track = tracksData.find(t => t.id === id);
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    if (!track) {
        return (
            <div className="text-center py-20 text-white">
                <h2 className="text-3xl">المسار غير موجود</h2>
                <button onClick={() => navigate('/')} className="mt-4 bg-purple-500 px-6 py-2 rounded-lg">العودة للرئيسية</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-6 py-12"
        >
            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                <span className="text-lg bg-cyan-500/20 text-cyan-300 px-4 py-1 rounded-full">{track.category}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white my-4">{track.title}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mb-8">{track.description}</p>
            </motion.div>
            
            <motion.div className="aspect-video rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${track.videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>

            <Quiz track={track} />
        </motion.div>
    );
};

const CertificatePage = () => {
    const { title: trackId } = useParams();
    const { isTrackCompleted } = useProgress();
    const navigate = useNavigate();
    const track = tracksData.find(t => t.id === trackId);
    const certificateRef = useRef();
    const [studentName, setStudentName] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [libsLoaded, setLibsLoaded] = useState(false);

    const loadScript = (src) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.appendChild(script);
    });

    useEffect(() => {
        if (!isTrackCompleted(trackId)) {
            navigate('/');
            return;
        }

        try {
            const savedName = localStorage.getItem('nebrasStudentName');
            if (savedName) setStudentName(savedName);
        } catch (error) {
            console.error("Failed to load name from localStorage:", error);
        }

        if (window.html2canvas && window.jspdf) {
            setLibsLoaded(true);
            return;
        }

        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        ]).then(() => {
            setLibsLoaded(true);
        }).catch(error => {
            console.error("Failed to load PDF libraries:", error);
            alert("Failed to load libraries for certificate generation. Please refresh and try again.");
        });

    }, [trackId, isTrackCompleted, navigate]);

    const handleNameChange = (e) => {
        setStudentName(e.target.value);
        try {
            localStorage.setItem('nebrasStudentName', e.target.value);
        } catch (error) {
            console.error("Failed to save name to localStorage:", error);
        }
    };

    const handleDownload = () => {
        if (!certificateRef.current || !studentName) {
            alert('Please enter your name to download the certificate.');
            return;
        }
        setIsDownloading(true);
        const { jsPDF } = window.jspdf;
        
        window.html2canvas(certificateRef.current, { scale: 2, useCORS: true, backgroundColor: '#f9fafb' })
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [canvas.width, canvas.height] });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${studentName}_${track.id}_certificate.pdf`);
                setIsDownloading(false);
            }).catch(err => {
                console.error("Error generating PDF:", err);
                setIsDownloading(false);
                alert("An error occurred while generating the certificate. Please try again.");
            });
    };

    if (!track) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Congratulations!</h1>
                <p className="text-lg text-gray-300 mt-2">You've earned a certificate for this track. Enter your name and download it.</p>
            </div>

            <div className="max-w-md mx-auto mb-10">
                <label htmlFor="studentName" className="block text-white text-lg font-medium mb-2 text-left">Your Full Name for the Certificate</label>
                <input id="studentName" type="text" value={studentName} onChange={handleNameChange} placeholder="e.g., Alex Smith" className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors text-left" />
            </div>
            
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, type: 'spring' }}>
                <CertificateDisplay ref={certificateRef} trackTitle={track.title} studentName={studentName} date={new Date().toLocaleDateString('en-US')} />
            </motion.div>

            <div className="text-center mt-10">
                <button
                    onClick={handleDownload}
                    disabled={!studentName || isDownloading || !libsLoaded}
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-4 px-12 rounded-lg text-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                    <DownloadSimpleIcon size={28} />
                    {isDownloading ? 'Preparing...' : !libsLoaded ? 'Loading Libraries...' : 'Download Certificate (PDF)'}
                </button>
            </div>
        </motion.div>
    );
};

const NotFoundPage = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-white text-center">
        <h1 className="text-9xl font-bold text-purple-500">404</h1>
        <h2 className="text-4xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-2">Sorry, we couldn't find the page you're looking for.</p>
        <Link to="/" className="mt-8 bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
            Back to Homepage
        </Link>
    </div>
);

function App() {
    return (
        <ProgressProvider>
            <Router>
                <div className="bg-gray-900 min-h-screen font-sans text-white" dir="rtl">
                    <Header />
                    <main className="flex-grow">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/track/:id" element={<TrackPage />} />
                                <Route path="/certificate/:title" element={<CertificatePage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </AnimatePresence>
                    </main>
                    <Footer />
                </div>
            </Router>
        </ProgressProvider>
    );
}

export default App;
