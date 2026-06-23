import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const RECEIVER_EMAIL = "chuluunbaatar@gmail.com";

const PARTS_LIST = [
    { id: 'lcd', name: 'Original Disassembly LCD Screen', description: 'Оригиналь задаргааны LCD дэлгэц. Пиксель бүрэн бүтэн (үхсэн пиксельгүй). Өнгө, гэрэлтүүлэг маш сайн биш байж магадгүй.', price: 110000, category: 'parts' },
    { id: 'battery', name: '650mAh Thin Li-Po Battery', description: 'Нэмэлт нимгэн лити-полимер батарей. Багтаамж сайтай, цэнэгээ сайн барина.', price: 25000, category: 'parts' },
    { id: 'faceplate', name: 'Faceplate Metal', description: 'Металл урд гэх (Faceplate). Алтлаг, мөнгөлөг, хар өнгөний сонголттой.', price: 40000, category: 'parts', hasColor: true },
    { id: 'center', name: 'Center Button', description: 'Зөвхөн голын жижиг дугуй товчлуур. (MENU бичигтэй том Clickwheel ороогүй болохыг анхаарна уу!)', price: 10000, category: 'parts', hasColor: true },
    { id: 'backplate', name: 'New Thin Universal Silver Backplate', description: 'Нимгэн мөнгөлөг арын гэх (Backplate). Гялалзсан төмөр гадаргуутай.', price: 30000, category: 'parts' },
    { id: 'shipping', name: 'Улс хоорондын тээвэр (International Shipping)', description: 'Улс хоорондын ачаа тээвэр, карго болон холбогдох үйлчилгээ.', price: 15000, category: 'service' },
    { id: 'labor', name: 'Ажлын хөлс (Labor)', description: 'iPod угсралт, оношилгоо, цэвэрлэгээ болон эд анги солих үйлчилгээ.', price: 50000, category: 'service' }
];

export function IpodDannyPage() {
    // Select all parts by default (matching Danny's current order)
    const [selectedParts, setSelectedParts] = useState({
        lcd: true,
        battery: true,
        faceplate: true,
        center: true,
        backplate: true,
        shipping: true,
        labor: true
    });

    const [faceplateColor, setFaceplateColor] = useState('black'); // gold, silver, black
    const [centerColor, setCenterColor] = useState('black'); // gold, silver, black
    
    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    // State for submit
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [totalPrice, setTotalPrice] = useState(280000);

    // Calculate total price automatically
    useEffect(() => {
        const total = PARTS_LIST.reduce((sum, item) => {
            return selectedParts[item.id] ? sum + item.price : sum;
        }, 0);
        setTotalPrice(total);
    }, [selectedParts]);

    const handlePartToggle = (id) => {
        setSelectedParts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            alert('Нэр болон Утасны дугаараа оруулна уу.');
            return;
        }

        setStatus('loading');

        // Compile selected parts summary
        const selectedList = PARTS_LIST
            .filter(item => selectedParts[item.id])
            .map(item => {
                let details = `${item.name} (${item.price.toLocaleString()} ₮)`;
                if (item.id === 'faceplate') details += ` [Өнгө: ${faceplateColor.toUpperCase()}]`;
                if (item.id === 'center') details += ` [Өнгө: ${centerColor.toUpperCase()}]`;
                return details;
            })
            .join('\n');

        const payload = {
            _subject: `Шинэ iPod Захиалга - ${name}`,
            Нэр: name,
            Утас: phone,
            Хүргэлтийн_хаяг: selectedParts.shipping ? address : 'Хүргэлтгүй (Шууд авна)',
            Нэмэлт_тайлбар: notes || 'Байхгүй',
            Сонгосон_ангиуд: selectedList,
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
        return 'linear-gradient(135deg, #2b2b2b 0%, #171717 50%, #0a0a0a 100%)';
    };

    const getCenterHex = () => {
        if (centerColor === 'gold') return '#d4af37';
        if (centerColor === 'silver') return '#b3b3b3';
        if (centerColor === 'red') return '#dc2626';
        if (centerColor === 'blue') return '#2563eb';
        if (centerColor === 'green') return '#16a34a';
        if (centerColor === 'purple') return '#9333ea';
        return '#171717';
    };

    return (
        <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans relative pb-20 selection:bg-indigo-500 selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-950/15 blur-[150px] pointer-events-none" />

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
                <div className="text-center mb-12">
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
                        <div className="w-full max-w-sm bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative">
                            <span className="absolute top-4 right-4 bg-white/5 text-[9px] font-mono px-2.5 py-1 rounded-full border border-white/5 text-neutral-400 select-none">
                                LIVE PREVIEW
                            </span>
                            
                            {/* CSS iPod Classic Container */}
                            <motion.div 
                                className="w-60 h-96 rounded-[32px] border-4 border-neutral-800/80 shadow-2xl flex flex-col items-center relative overflow-hidden mt-6"
                                style={{ 
                                    background: getFaceplateHex(),
                                    boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.8)' 
                                }}
                                layout
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
                            </motion.div>

                            {/* Backplate Indicator */}
                            <div className="mt-6 text-center">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                    Backplate: {selectedParts.backplate ? 'Universal Silver (Thin)' : 'Default Backplate'}
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
                                            {selectedParts.shipping && <p><strong className="text-white">Хаяг:</strong> {address}</p>}
                                            <p><strong className="text-white">Нийт төлбөр:</strong> {totalPrice.toLocaleString()} ₮</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            setStatus('idle');
                                            setName('');
                                            setPhone('');
                                            setAddress('');
                                            setNotes('');
                                        }}
                                        className="mt-8 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-colors"
                                    >
                                        Дахин аялуулах
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Upgrade Options Card */}
                                    <div className="bg-neutral-900/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            1. Эд анги болон Сайжруулалтууд (Upgrades)
                                        </h3>

                                        <div className="space-y-4">
                                            {PARTS_LIST.map((part) => (
                                                <div 
                                                    key={part.id}
                                                    onClick={() => handlePartToggle(part.id)}
                                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none ${
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
                                                            
                                                            {/* Color selections if enabled */}
                                                            {selectedParts[part.id] && part.hasColor && (
                                                                <div 
                                                                    className="flex gap-2.5 mt-3 items-center"
                                                                    onClick={(e) => e.stopPropagation()} // Stop click bubbling
                                                                >
                                                                    <span className="text-[11px] text-neutral-400 font-mono">Өнгө:</span>
                                                                    {(part.id === 'faceplate' 
                                                                        ? ['black', 'silver', 'gold', 'blue', 'green', 'red', 'purple']
                                                                        : ['black', 'silver', 'red', 'blue', 'green', 'purple']
                                                                    ).map((color) => {
                                                                        let bg = '#1a1a1a';
                                                                        if (color === 'gold') bg = '#d4af37';
                                                                        else if (color === 'silver') bg = '#c0c0c0';
                                                                        else if (color === 'blue') bg = '#2563eb';
                                                                        else if (color === 'green') bg = '#16a34a';
                                                                        else if (color === 'red') bg = '#dc2626';
                                                                        else if (color === 'purple') bg = '#9333ea';
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

                                    {/* Checkout & Contact Information */}
                                    <div className="bg-neutral-900/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
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

                                        {/* Conditionally show shipping address */}
                                        <AnimatePresence>
                                            {selectedParts.shipping && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-2 overflow-hidden"
                                                >
                                                    <label className="text-xs font-mono uppercase text-neutral-400">Хүргэлтийн хаяг (Delivery Address)</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Дүүрэг, хороо, гудамж, байр, тоот хаяг" 
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        className="w-full px-4 py-3 bg-neutral-950 border border-white/5 hover:border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

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

                                    {/* Payment & Terms Info Card */}
                                    <div className="bg-neutral-900/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 space-y-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            3. Төлбөр хийх дансны мэдээлэл (Payment Info)
                                        </h3>
                                        <p className="text-xs text-neutral-400">
                                            Захиалгаа баталгаажуулахын тулд дараах дансны аль нэг рүү шилжүүлнэ үү.
                                        </p>
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
        </div>
    );
}
