import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const RECEIVER_EMAIL = "chuluunbaatar@gmail.com";

const BATTERY_OPTIONS = [
    { id: 'none', name: 'Үндсэн батарейг солихгүй (Stock Battery)', price: 0, description: 'iPod Classic-ийн үндсэн батарейг хэвээр үлдээнэ.' },
    { id: 'battery_650', name: 'Нимгэн Li-Po Батарей (650mAh)', price: 25000, description: 'Нэмэлт нимгэн лити-полимер батарей. Багтаамж сайтай, цэнэгээ сайн барина.', image: '/battery.jpg' },
    { id: 'battery_2000', name: 'Нимгэн Li-Po Батарей (2000mAh)', price: 35000, description: 'Өндөр багтаамжтай нимгэн лити-полимер батарей. Маш удаан цэнэгээ барина.', image: '/battery-2000mah.webp' }
];

const BACKPLATE_OPTIONS = [
    { id: 'none', name: 'Үндсэн арын гэрийг солихгүй (Stock Backplate)', price: 0, description: 'iPod Classic-ийн үндсэн арын гэрийг хэвээр үлдээнэ.' },
    { id: 'backplate_silver', name: 'Нимгэн мөнгөлөг арын гэр (Universal Silver)', price: 30000, description: 'Нимгэн мөнгөлөг арын гэр. Гялалзсан төмөр гадаргуутай.', image: '/backplate.png' },
    { id: 'u2_gold', name: 'U2 арын гэр (Алтлаг / Gold)', price: 45000, description: 'U2 хэвлэлттэй алтлаг арын гэр. Ардаа U2 хамтлагийн гарын үсэгтэй.', image: '/u2-gold.webp' },
    { id: 'u2_silver', name: 'U2 арын гэр (Мөнгөлөг / Silver)', price: 45000, description: 'U2 хэвлэлттэй мөнгөлөг арын гэр. Ардаа U2 хамтлагийн гарын үсэгтэй.', image: '/u2-silver.webp' },
    { id: 'u2_black', name: 'U2 арын гэр (Хар / Black)', price: 45000, description: 'U2 хэвлэлттэй хар арын гэр. Ардаа U2 хамтлагийн гарын үсэгтэй.', image: '/u2-black.webp' },
    { id: 'u2_rainbow', name: 'U2 арын гэр (Солонгон / Rainbow)', price: 45000, description: 'U2 хэвлэлттэй солонгон өнгийн арын гэр. Ардаа U2 хамтлагийн гарын үсэгтэй.', image: '/u2-rainbow.jpg' }
];

const STORAGE_OPTIONS = [
    { id: 'none', name: 'Үндсэн хатуу дискогоо солихгүй (Stock HDD)', price: 0, description: 'iPod Classic-ийн үндсэн хатуу дискийг хэвээр үлдээнэ.' },
    { id: 'sd_128', name: 'Kingston 128GB SD карт', price: 120000, description: 'Kingston брэндийн өндөр хурдны 128GB SD карт.', image: '/sd-adapter.webp' },
    { id: 'sd_256', name: 'Kingston 256GB SD карт', price: 200000, description: 'Kingston брэндийн өндөр хурдны 256GB SD карт.', image: '/sd-adapter.webp' },
    { id: 'sd_512', name: 'Kingston 512GB SD карт', price: 380000, description: 'Kingston брэндийн өндөр хурдны 512GB SD карт.', image: '/sd-adapter.webp' }
];

export function IpodDannyPage() {
    // Selection state
    const [selectedParts, setSelectedParts] = useState({
        lcd: true,
        faceplate: true,
        center: true,
        clickwheel: false,
        case: true,
        adapter: false,
        bypass: false,
        shipping: true,
        labor: true
    });

    const [batteryOption, setBatteryOption] = useState('battery_650');
    const [backplateOption, setBackplateOption] = useState('backplate_silver');
    const [storageOption, setStorageOption] = useState('none');

    const [faceplateColor, setFaceplateColor] = useState('black'); // gold, silver, black, blue, green, red, purple
    const [centerColor, setCenterColor] = useState('black'); // gold, silver, red, blue, green, purple, yellow, black
    
    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // State for submit
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [totalPrice, setTotalPrice] = useState(300000);

    // Lightbox Modal States
    const [activePhoto, setActivePhoto] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Auto-configure adapter and bypass based on storage choice
    useEffect(() => {
        if (storageOption === 'none') {
            setSelectedParts(prev => ({
                ...prev,
                adapter: false,
                bypass: false
            }));
        } else if (storageOption === 'sd_128') {
            setSelectedParts(prev => ({
                ...prev,
                adapter: true,
                bypass: false
            }));
        } else if (storageOption === 'sd_256' || storageOption === 'sd_512') {
            setSelectedParts(prev => ({
                ...prev,
                adapter: true,
                bypass: true
            }));
        }
    }, [storageOption]);

    // Reset error when active photo changes
    useEffect(() => {
        setImageError(false);
    }, [activePhoto]);

    // Calculate total price automatically
    useEffect(() => {
        let total = 0;
        
        // Base checkboxes
        if (selectedParts.lcd) total += 110000;
        if (selectedParts.faceplate) total += 40000;
        if (selectedParts.center) total += 10000;
        if (selectedParts.clickwheel) total += 40000;
        if (selectedParts.case) total += 20000;
        if (selectedParts.adapter) total += 60000;
        if (selectedParts.bypass) total += 20000;
        if (selectedParts.shipping) total += 20000;
        if (selectedParts.labor) total += 60000;
        
        // Battery option
        const selectedBattery = BATTERY_OPTIONS.find(b => b.id === batteryOption);
        if (selectedBattery) total += selectedBattery.price;
        
        // Backplate option
        const selectedBackplate = BACKPLATE_OPTIONS.find(b => b.id === backplateOption);
        if (selectedBackplate) total += selectedBackplate.price;
        
        // Storage option
        const selectedStorage = STORAGE_OPTIONS.find(s => s.id === storageOption);
        if (selectedStorage) total += selectedStorage.price;

        setTotalPrice(total);
    }, [selectedParts, batteryOption, backplateOption, storageOption]);

    const handlePartToggle = (id) => {
        if (id === 'shipping' || id === 'labor') return;
        setSelectedParts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Compile selected parts string
    const getSelectedPartsSummary = () => {
        let selectedList = [];
        
        if (selectedParts.lcd) selectedList.push(`- LCD дэлгэц (110,000 ₮)`);
        if (selectedParts.faceplate) selectedList.push(`- Металл урд гэр [Өнгө: ${faceplateColor.toUpperCase()}] (40,000 ₮)`);
        if (selectedParts.center) selectedList.push(`- Голын товчлуур [Өнгө: ${centerColor.toUpperCase()}] (10,000 ₮)`);
        if (selectedParts.clickwheel) selectedList.push(`- Click wheel (40,000 ₮)`);
        
        const storage = STORAGE_OPTIONS.find(s => s.id === storageOption);
        if (storage && storage.price > 0) selectedList.push(`- ${storage.name} (${storage.price.toLocaleString()} ₮)`);
        if (selectedParts.adapter) selectedList.push(`- SD card adapter (60,000 ₮)`);
        if (selectedParts.bypass) selectedList.push(`- Bypassing 128GB limit (20,000 ₮)`);
        
        const battery = BATTERY_OPTIONS.find(b => b.id === batteryOption);
        if (battery && battery.price > 0) selectedList.push(`- ${battery.name} (${battery.price.toLocaleString()} ₮)`);
        
        const backplate = BACKPLATE_OPTIONS.find(b => b.id === backplateOption);
        if (backplate && backplate.price > 0) selectedList.push(`- ${backplate.name} (${backplate.price.toLocaleString()} ₮)`);
        
        if (selectedParts.case) selectedList.push(`- Тунгалаг кэйс (20,000 ₮)`);
        if (selectedParts.shipping) selectedList.push(`- Улс хоорондын тээвэр (20,000 ₮)`);
        if (selectedParts.labor) selectedList.push(`- Ажлын хөлс (60,000 ₮)`);
        
        return selectedList.join('\n');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            alert('Нэр болон Утасны дугаараа оруулна уу.');
            return;
        }

        setStatus('loading');

        const selectedListStr = getSelectedPartsSummary();

        const payload = {
            _subject: `Шинэ iPod Захиалга - ${name}`,
            Нэр: name,
            Утас: phone,
            Хүргэлт: 'Шууд авна (Хүргэлтгүй)',
            Нэмэлт_тайлбар: notes || 'Байхгүй',
            Сонгосон_ангиуд: selectedListStr,
            Нийт_дүн: `${totalPrice.toLocaleString()} ₮`,
            Faceplate_Өнгө: faceplateColor,
            Center_Button_Өнгө: centerColor,
        };

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${RECEIVER_EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    const getFaceplateHex = () => {
        if (faceplateColor === 'gold') return 'linear-gradient(135deg, #f3d075 0%, #d4af37 50%, #aa8210 100%)';
        if (faceplateColor === 'silver') return 'linear-gradient(135deg, #e6e6e6 0%, #b3b3b3 50%, #808080 100%)';
        if (faceplateColor === 'blue') return 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1e3a8a 100%)';
        if (faceplateColor === 'green') return 'linear-gradient(135deg, #4ade80 0%, #16a34a 50%, #14532d 100%)';
        if (faceplateColor === 'red') return 'linear-gradient(135deg, #f87171 0%, #dc2626 50%, #7f1d1d 100%)';
        if (faceplateColor === 'purple') return 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #581c87 100%)';
        if (faceplateColor === 'yellow') return 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)';
        return 'linear-gradient(135deg, #2b2b2b 0%, #171717 50%, #0a0a0a 100%)';
    };

    const getCenterHex = () => {
        if (centerColor === 'gold') return '#d4af37';
        if (centerColor === 'silver') return '#b3b3b3';
        if (centerColor === 'red') return '#dc2626';
        if (centerColor === 'blue') return '#2563eb';
        if (centerColor === 'green') return '#16a34a';
        if (centerColor === 'purple') return '#9333ea';
        if (centerColor === 'yellow') return '#eab308';
        return '#171717';
    };

    const getBackplateName = () => {
        const selected = BACKPLATE_OPTIONS.find(b => b.id === backplateOption);
        return selected ? selected.name : 'Үндсэн арын гэр';
    };

    return (
        <div 
            className="min-h-screen text-neutral-100 font-sans relative pb-20 selection:bg-indigo-500 selection:text-white"
            style={{
                backgroundColor: '#070708',
                backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
                backgroundAttachment: 'fixed'
            }}
        >

            <div className="max-w-6xl mx-auto px-4 pt-8">
                {/* Back Link */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-mono tracking-wide">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Буцах
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12 flex flex-col items-center">
                    <img 
                        src="/ipod-mongolia-logo.jpg" 
                        alt="iPod Mongolia Logo" 
                        className="h-28 w-auto mb-2 invert mix-blend-screen opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <span className="text-[11px] font-mono tracking-[0.25em] text-indigo-400 uppercase">Custom Workshop</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                        iPod Classic Modding
                    </h1>
                    <p className="text-neutral-400 mt-3 max-w-xl mx-auto text-sm md:text-base">
                        Та өөрийн хүссэн эд ангиудыг сонгон захиалж, өнгө болон багтаамжийг тохируулан угсруулаарай.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
                    {/* Live Preview Column */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-12">
                        <div className="w-full max-w-sm bg-neutral-900/80 md:bg-neutral-900/40 md:backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative">
                            <span className="absolute top-4 right-4 bg-white/5 text-[9px] font-mono px-2.5 py-1 rounded-full border border-white/5 text-neutral-400 select-none">
                                LIVE PREVIEW
                            </span>
                            
                            {/* CSS iPod Classic Container */}
                            <div 
                                className="w-60 h-96 rounded-[32px] border-4 border-neutral-800/80 shadow-2xl flex flex-col items-center relative overflow-hidden mt-6"
                                style={{ 
                                    background: getFaceplateHex(),
                                    boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.8)' 
                                }}
                            >
                                {/* Highlight overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-[28px]" />

                                {/* LCD Screen */}
                                <div className={`w-[88%] h-36 rounded-xl mt-6 relative overflow-hidden transition-all duration-500 border border-neutral-950 flex flex-col justify-between p-3 select-none ${
                                    selectedParts.lcd 
                                        ? 'bg-[#f0f4f8] shadow-[inset_0_2px_5px_rgba(0,0,0,0.15)] text-neutral-900' 
                                        : 'bg-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] text-neutral-800'
                                }`}>
                                    {selectedParts.lcd ? (
                                        <>
                                            <div className="flex justify-between items-center text-[9px] font-bold border-b border-neutral-300 pb-1 w-full opacity-80">
                                                <span>iPod</span>
                                                <div className="flex items-center gap-1">
                                                    <span>▶</span>
                                                    <div className="w-4 h-2 border border-neutral-800 rounded-[2px] p-[1px] flex">
                                                        <div className="bg-neutral-800 h-full w-[80%]" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 flex items-center justify-between mt-2">
                                                <div className="flex flex-col text-[10px] font-bold gap-1 w-[60%]">
                                                    <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded-[3px] w-fit">Now Playing</span>
                                                    <span className="truncate">Chuka's Mix</span>
                                                    <span className="text-[8px] opacity-60 truncate">Endurance Space</span>
                                                </div>
                                                <div className="w-12 h-12 bg-neutral-300 rounded border border-neutral-400 flex items-center justify-center font-bold text-[18px] text-neutral-500 shadow-sm">
                                                    🎵
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="w-full mt-2">
                                                <div className="w-full h-1.5 bg-neutral-300 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 h-full w-[65%]" />
                                                </div>
                                                <div className="flex justify-between text-[7px] font-bold opacity-60 mt-1">
                                                    <span>2:14</span>
                                                    <span>-1:23</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-mono text-[10px] opacity-40">
                                            Screen Off
                                        </div>
                                    )}
                                </div>

                                {/* Click Wheel */}
                                <div className="w-40 h-40 rounded-full bg-neutral-800 border-2 border-neutral-700/30 flex items-center justify-center relative mt-10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]">
                                    <span className="absolute top-2.5 text-[8px] font-mono font-bold text-neutral-400/80 tracking-widest pointer-events-none">MENU</span>
                                    <span className="absolute bottom-2.5 text-[8px] font-bold text-neutral-400/80 pointer-events-none">▶||</span>
                                    <span className="absolute right-3.5 text-[8px] font-bold text-neutral-400/80 pointer-events-none">▶▶|</span>
                                    <span className="absolute left-3.5 text-[8px] font-bold text-neutral-400/80 pointer-events-none">|◀◀</span>

                                    {/* Center Button */}
                                    <div 
                                        className="w-12 h-12 rounded-full border border-neutral-900/10 shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)] transition-colors duration-300"
                                        style={{ backgroundColor: getCenterHex() }}
                                    />
                                </div>
                            </div>

                            {/* Backplate Indicator */}
                            <div className="mt-6 text-center">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-relaxed block">
                                    {getBackplateName()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customizer Panel Column */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-neutral-900/40 border border-emerald-500/20 rounded-3xl p-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                                        ✓
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Амжилттай илгээгдлээ!</h2>
                                    <p className="text-neutral-400 mt-2 text-sm max-w-sm mx-auto">
                                        Таны захиалгын мэдээлэл хүлээж авагчийн имэйл хаяг руу амжилттай илгээгдлээ. Бид тун удахгүй холбогдох болно.
                                    </p>
                                    
                                    <div className="mt-8 p-4 bg-neutral-950/60 rounded-xl text-left border border-white/5 max-w-md mx-auto">
                                        <h4 className="text-xs font-mono uppercase text-indigo-400 mb-2">Захиалгын мэдээлэл</h4>
                                        <div className="text-xs space-y-1.5 text-neutral-300">
                                            <p><strong className="text-white">Нэр:</strong> {name}</p>
                                            <p><strong className="text-white">Утас:</strong> {phone}</p>
                                            <p><strong className="text-white">Хүргэлт:</strong> Шууд авна (Хүргэлтгүй)</p>
                                            <p><strong className="text-white">Нийт төлбөр:</strong> {totalPrice.toLocaleString()} ₮</p>
                                            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-neutral-400 whitespace-pre-line leading-relaxed">
                                                {getSelectedPartsSummary()}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setStatus('idle');
                                            setName('');
                                            setPhone('');
                                            setNotes('');
                                            setStorageOption('none');
                                            setBatteryOption('battery_650');
                                            setBackplateOption('backplate_silver');
                                        }}
                                        className="mt-8 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                                    >
                                        Дахин аялуулах
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Upgrade Options Card */}
                                    <div className="bg-neutral-900/80 md:bg-neutral-900/20 md:backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            1. Эд анги болон Сайжруулалтууд (Upgrades)
                                        </h3>

                                        <div className="space-y-6">
                                            {/* Category 1: Front design & LCD */}
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">1.1 Урд хэсэг болон Дэлгэц (Front & Screen)</h4>
                                                <div className="space-y-3">
                                                    {OTHER_PARTS.filter(p => p.category === 'parts' && ['lcd', 'faceplate', 'center', 'clickwheel'].includes(p.id)).map((part) => (
                                                        <div 
                                                            key={part.id}
                                                            onClick={() => handlePartToggle(part.id)}
                                                            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 select-none cursor-pointer ${
                                                                selectedParts[part.id] 
                                                                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                                                                    : 'bg-neutral-900/10 border-white/5 hover:border-white/10'
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-1 shrink-0 transition-all ${
                                                                    selectedParts[part.id]
                                                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                                                        : 'border-neutral-700'
                                                                }`}>
                                                                    {selectedParts[part.id] && <span className="text-[10px]">✓</span>}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-sm text-neutral-100">{part.name}</h4>
                                                                    <p className="text-xs text-neutral-400 mt-1 max-w-md leading-relaxed">{part.description}</p>
                                                                    
                                                                    {part.image && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setActivePhoto({ url: part.image, title: part.name, filename: part.image.substring(1) });
                                                                            }}
                                                                            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
                                                                        >
                                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                                                <circle cx="12" cy="13" r="4"></circle>
                                                                            </svg>
                                                                            Зураг харах (View Photo)
                                                                        </button>
                                                                    )}

                                                                    {/* Color selections if enabled */}
                                                                    {selectedParts[part.id] && part.hasColor && (
                                                                        <div 
                                                                            className="flex gap-2.5 mt-3 items-center"
                                                                            onClick={(e) => e.stopPropagation()} // Stop click bubbling
                                                                        >
                                                                            <span className="text-[11px] text-neutral-400 font-mono">Өнгө:</span>
                                                                            {(part.id === 'faceplate' 
                                                                                ? ['black', 'silver', 'gold', 'blue', 'green', 'red', 'purple']
                                                                                : ['black', 'silver', 'red', 'blue', 'green', 'purple', 'yellow']
                                                                            ).map((color) => {
                                                                                let bg = '#1a1a1a';
                                                                                if (color === 'gold') bg = '#d4af37';
                                                                                else if (color === 'silver') bg = '#c0c0c0';
                                                                                else if (color === 'blue') bg = '#2563eb';
                                                                                else if (color === 'green') bg = '#16a34a';
                                                                                else if (color === 'red') bg = '#dc2626';
                                                                                else if (color === 'purple') bg = '#9333ea';
                                                                                else if (color === 'yellow') bg = '#eab308';
                                                                                return (
                                                                                    <button
                                                                                        key={color}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            if (part.id === 'faceplate') setFaceplateColor(color);
                                                                                            if (part.id === 'center') setCenterColor(color);
                                                                                        }}
                                                                                        className={`w-5 h-5 rounded-full border transition-all relative ${
                                                                                            (part.id === 'faceplate' ? faceplateColor === color : centerColor === color)
                                                                                                ? 'ring-2 ring-indigo-500 border-transparent scale-110'
                                                                                                : 'border-white/20'
                                                                                        }`}
                                                                                        style={{ background: bg }}
                                                                                        title={color.toUpperCase()}
                                                                                    />
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <span className="text-sm font-semibold text-indigo-300 font-mono">
                                                                    +{part.price.toLocaleString()} ₮
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Category 2: Storage Upgrades */}
                                            <div className="space-y-4 border-t border-white/5 pt-6">
                                                <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">1.2 Багтаамж (Storage & SD Card)</h4>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {STORAGE_OPTIONS.map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            onClick={() => setStorageOption(opt.id)}
                                                            className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                                                                storageOption === opt.id
                                                                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                                                                    : 'bg-neutral-900/10 border-white/5 hover:border-white/10'
                                                            }`}
                                                        >
                                                            <div>
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <span className="font-bold text-sm text-neutral-100">{opt.name}</span>
                                                                    <span className="text-xs font-semibold text-indigo-300 font-mono whitespace-nowrap">
                                                                        {opt.price > 0 ? `+${opt.price.toLocaleString()} ₮` : 'Үндсэн'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{opt.description}</p>
                                                            </div>
                                                            {opt.image && opt.id !== 'none' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActivePhoto({ url: opt.image, title: opt.name, filename: opt.image.substring(1) });
                                                                    }}
                                                                    className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
                                                                >
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                                        <circle cx="12" cy="13" r="4"></circle>
                                                                    </svg>
                                                                    Зураг харах
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* SD card helpers: Adapter & Bypass limit */}
                                                {storageOption !== 'none' && (
                                                    <div className="space-y-3 mt-4 p-4 bg-neutral-950/40 rounded-2xl border border-white/5">
                                                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-2">Шаардлагатай Дагалдах Сонголтууд:</span>
                                                        
                                                        {OTHER_PARTS.filter(p => ['adapter', 'bypass'].includes(p.id)).map((part) => (
                                                            <div 
                                                                key={part.id}
                                                                onClick={() => handlePartToggle(part.id)}
                                                                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-4 select-none cursor-pointer ${
                                                                    selectedParts[part.id] 
                                                                        ? 'bg-indigo-950/10 border-indigo-500/20 text-neutral-100' 
                                                                        : 'bg-neutral-900/5 border-white/5 text-neutral-400 hover:border-white/10'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                                                        selectedParts[part.id]
                                                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                                                            : 'border-neutral-700'
                                                                    }`}>
                                                                        {selectedParts[part.id] && <span className="text-[8px]">✓</span>}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-bold text-xs">{part.name}</span>
                                                                        <span className="text-[10px] text-neutral-500 ml-2">({part.description})</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right shrink-0">
                                                                    <span className="text-xs font-semibold font-mono text-indigo-300">
                                                                        +{part.price.toLocaleString()} ₮
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Category 3: Battery Option */}
                                            <div className="space-y-4 border-t border-white/5 pt-6">
                                                <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">1.3 Батарей (Battery Option)</h4>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {BATTERY_OPTIONS.map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            onClick={() => setBatteryOption(opt.id)}
                                                            className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                                                                batteryOption === opt.id
                                                                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                                                                    : 'bg-neutral-900/10 border-white/5 hover:border-white/10'
                                                            }`}
                                                        >
                                                            <div>
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <span className="font-bold text-sm text-neutral-100">{opt.name}</span>
                                                                </div>
                                                                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{opt.description}</p>
                                                            </div>
                                                            
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <span className="text-xs font-semibold text-indigo-300 font-mono">
                                                                    {opt.price > 0 ? `+${opt.price.toLocaleString()} ₮` : 'Үндсэн'}
                                                                </span>
                                                                {opt.image && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActivePhoto({ url: opt.image, title: opt.name, filename: opt.image.substring(1) });
                                                                        }}
                                                                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                                                    >
                                                                        Зураг
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Category 4: Backplate Option */}
                                            <div className="space-y-4 border-t border-white/5 pt-6">
                                                <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">1.4 Арын гэр (Backplate Option)</h4>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {BACKPLATE_OPTIONS.map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            onClick={() => setBackplateOption(opt.id)}
                                                            className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                                                                backplateOption === opt.id
                                                                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                                                                    : 'bg-neutral-900/10 border-white/5 hover:border-white/10'
                                                            }`}
                                                        >
                                                            <div>
                                                                <span className="font-bold text-sm text-neutral-100 block">{opt.name}</span>
                                                                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{opt.description}</p>
                                                            </div>
                                                            
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <span className="text-xs font-semibold text-indigo-300 font-mono">
                                                                    {opt.price > 0 ? `+${opt.price.toLocaleString()} ₮` : 'Үндсэн'}
                                                                </span>
                                                                {opt.image && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActivePhoto({ url: opt.image, title: opt.name, filename: opt.image.substring(1) });
                                                                        }}
                                                                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                                                    >
                                                                        Зураг
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Category 5: Case / Protection */}
                                            <div className="space-y-4 border-t border-white/5 pt-6">
                                                <h4 className="text-xs font-mono uppercase text-indigo-400 tracking-wider">1.5 Хамгаалалт болон Кэйс (Case & Protection)</h4>
                                                
                                                {OTHER_PARTS.filter(p => p.id === 'case').map((part) => (
                                                    <div 
                                                        key={part.id}
                                                        onClick={() => handlePartToggle(part.id)}
                                                        className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 select-none cursor-pointer ${
                                                            selectedParts[part.id] 
                                                                ? 'bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.05)]' 
                                                                : 'bg-neutral-900/10 border-white/5 hover:border-white/10'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-1 shrink-0 transition-all ${
                                                                selectedParts[part.id]
                                                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                                                    : 'border-neutral-700'
                                                            }`}>
                                                                {selectedParts[part.id] && <span className="text-[10px]">✓</span>}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-neutral-100">{part.name}</h4>
                                                                <p className="text-xs text-neutral-400 mt-1 max-w-md leading-relaxed">{part.description}</p>
                                                                
                                                                {part.image && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActivePhoto({ url: part.image, title: part.name, filename: part.image.substring(1) });
                                                                        }}
                                                                        className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
                                                                    >
                                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                                            <circle cx="12" cy="13" r="4"></circle>
                                                                        </svg>
                                                                        Зураг харах
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <span className="text-sm font-semibold text-indigo-300 font-mono">
                                                                +{part.price.toLocaleString()} ₮
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Category 6: Service Fees (Required) */}
                                            <div className="space-y-4 border-t border-white/5 pt-6">
                                                <h4 className="text-xs font-mono uppercase text-neutral-500 tracking-wider">1.6 Үйлчилгээний хураамж (Required Services)</h4>
                                                
                                                <div className="space-y-3">
                                                    {OTHER_PARTS.filter(p => p.isRequired).map((part) => (
                                                        <div 
                                                            key={part.id}
                                                            className="p-4 rounded-2xl border bg-neutral-950/40 border-white/5 opacity-80 cursor-default flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-5 h-5 rounded-md bg-indigo-600/50 border border-indigo-500/50 text-white flex items-center justify-center mt-1 shrink-0">
                                                                    <span className="text-[10px]">✓</span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-sm text-neutral-400">{part.name}</h4>
                                                                    <p className="text-xs text-neutral-500 mt-1 max-w-md leading-relaxed">{part.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <span className="text-sm font-semibold text-indigo-400/75 font-mono">
                                                                    +{part.price.toLocaleString()} ₮
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout & Contact Information */}
                                    <div className="bg-neutral-900/80 md:bg-neutral-900/20 md:backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            2. Захиалагчийн мэдээлэл (Customer Details)
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-mono uppercase text-neutral-400">Нэр (Name) *</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    placeholder="Нэрээ оруулна уу" 
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-3 bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-mono uppercase text-neutral-400">Утасны дугаар (Phone) *</label>
                                                <input 
                                                    type="tel" 
                                                    required
                                                    placeholder="Утасны дугаараа оруулна уу" 
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full px-4 py-3 bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-mono uppercase text-neutral-400">Тэмдэглэл / Нэмэлт тайлбар (Notes)</label>
                                            <textarea 
                                                rows="3"
                                                placeholder="Жишээ: Click Wheel өнгийг Silver болгож, Faceplate-ийг алтан өнгөөр солино уу..." 
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                className="w-full px-4 py-3 bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment & Contact Info Card */}
                                    <div className="bg-neutral-900/80 md:bg-neutral-900/20 md:backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 space-y-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            3. Төлбөр хийх болон Холбоо барих мэдээлэл (Payment & Contact)
                                        </h3>
                                        
                                        <div>
                                            <h4 className="text-xs font-mono uppercase text-indigo-400 mb-2">Шилжүүлэг хийх дансууд:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 flex flex-col justify-between">
                                                    <span className="text-[10px] font-mono text-neutral-500">Хаан Банк</span>
                                                    <span className="text-base font-bold text-white mt-1">5111 573 367</span>
                                                </div>
                                                <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 flex flex-col justify-between">
                                                    <span className="text-[10px] font-mono text-neutral-500">М Банк</span>
                                                    <span className="text-base font-bold text-white mt-1">MN53 0039 00 8000 969699</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <h4 className="text-xs font-mono uppercase text-indigo-400 mb-2">Холбоо барих мэдээлэл:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-neutral-950/40 rounded-2xl border border-white/5 flex flex-col justify-between">
                                                    <span className="text-[10px] font-mono text-neutral-500">Утасны дугаар</span>
                                                    <span className="text-base font-bold text-white mt-1">99029760</span>
                                                </div>
                                                <a 
                                                    href="https://facebook.com/iPodMongolia" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-4 bg-neutral-950/40 hover:bg-neutral-900/60 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col justify-between group cursor-pointer"
                                                >
                                                    <span className="text-[10px] font-mono text-neutral-500 group-hover:text-indigo-400 transition-colors">Facebook хуудас</span>
                                                    <span className="text-base font-bold text-white mt-1 flex items-center gap-1 group-hover:text-indigo-300 transition-colors">
                                                        facebook.com/iPodMongolia
                                                        <span className="text-xs text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300/90 leading-relaxed space-y-1.5 mt-2">
                                            <p>⚠️ <strong>Санамж:</strong> Олон улсын тээврээс шалтгаалж, бүтээгдэхүүн бэлэн болох хугацаа янз бүр байж болно.</p>
                                            <p>💳 Төлбөрийг дансанд хийснээр захиалга баталгаажна.</p>
                                        </div>
                                    </div>

                                    {/* Total Price Widget & Submit Button */}
                                    <div className="bg-neutral-900/30 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                                        <div>
                                            <span className="text-xs font-mono uppercase text-neutral-500">Нийт дүн (Total Amount)</span>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                                                    {totalPrice.toLocaleString()} ₮
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-75 transition-all text-white font-bold rounded-xl text-sm tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)] shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Илгээж байна...
                                                </>
                                            ) : (
                                                'Захиалах (Submit Order)'
                                            )}
                                        </button>
                                    </div>
                                    
                                    {status === 'error' && (
                                        <div className="text-red-400 text-xs font-mono text-center">
                                            Захиалга илгээхэд алдаа гарлаа. Та дахин оролдоно уу.
                                        </div>
                                    )}
                                </form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {activePhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActivePhoto(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full bg-neutral-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 cursor-default flex flex-col max-h-[95vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setActivePhoto(null)}
                                className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white p-2 rounded-full transition-all cursor-pointer z-10"
                                title="Хаах"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            {/* Title & Info */}
                            <div className="mb-4">
                                <h3 className="text-base font-bold text-white tracking-wide pr-10">{activePhoto.title}</h3>
                                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Файлын зам: public/{activePhoto.filename}</p>
                            </div>

                            {/* Image Container */}
                            <div className="relative w-full bg-neutral-950/40 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 p-2 min-h-[300px]">
                                {!imageError ? (
                                    <img
                                        src={activePhoto.url}
                                        alt={activePhoto.title}
                                        onError={() => setImageError(true)}
                                        className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-md"
                                    />
                                ) : (
                                    <div className="p-6 text-center max-w-md flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
                                            ⚠️
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Зураг оруулаагүй байна</h4>
                                            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                                                Энэ эд ангийн бодит зургийг харуулахын тулд төслийн <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200 text-[11px] font-mono">public/</code> хавтас руу <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-indigo-300 text-[11px] font-mono">{activePhoto.filename}</code> нэртэй зураг байршуулах шаардлагатай.
                                            </p>
                                            <div className="mt-4 p-4 bg-neutral-950 rounded-2xl text-left border border-white/5">
                                                <span className="text-[10px] text-indigo-400 font-mono block mb-1">ЗААВАР (HOW TO ADD):</span>
                                                <ol className="text-[10px] text-neutral-400 list-decimal pl-4 space-y-1.5">
                                                    <li>Зургийн файлыг <code className="text-neutral-200 font-mono">{activePhoto.filename}</code> гэж нэрлэх.</li>
                                                    <li>Үүнийг <code className="text-neutral-200 font-mono">public/</code> хавтсанд хуулах.</li>
                                                    <li>Өөрчлөлтийг GitHub-руу commit, push хийж байршуулах.</li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
