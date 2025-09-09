import React, { useState, useCallback, useEffect } from 'react';
import { ZODIAC_SIGNS, PLANETS, CHINESE_ZODIAC_SIGNS } from './constants';
import { ZodiacSign, Horoscope, HoroscopeTimeframe, ZodiacInfo, CompatibilityInfo, PlanetInfo, AstrologicalEvent, ChineseZodiacSign, ChineseZodiacInfo } from './types';
import * as geminiService from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import ZodiacWheel from './components/ZodiacWheel';
import SolarSystemMap from './components/SolarSystemMap';
import Planet from './components/Planet';
import DailyFact from './components/DailyFact';

type View = 'home' | 'astrology' | 'astronomy' | 'cosmicMysteries';
type AstrologyType = 'western' | 'chinese';

const ASTRO_MYTH_TOPICS = [
    "Mars: The God of War",
    "Venus: The Goddess of Love",
    "The Orion Myth",
    "The Big Dipper and the Great Bear",
    "The Milky Way Galaxy Origin",
    "Halley's Comet in History",
    "The Pleiades (Seven Sisters)",
];

const MYSTERY_TOPICS = {
  "Galactic Wonders": ["Andromeda Galaxy", "Black Holes", "Nebulae", "Galaxy Collisions"],
  "Unexplained Phenomena": ["Dark Matter", "Dark Energy", "The Great Attractor", "Fast Radio Bursts (FRBs)"],
  "The Dark Side of Space": ["Rogue Planets", "Supernovae", "Gamma-Ray Bursts", "Space-Time Paradoxes"],
  "Cosmic Curiosities": ["Pillars of Creation", "Life on other planets?", "Diamond Planets", "The Multiverse Theory"]
};

// --- START: Cosmic Background Configuration ---
const STAR_LAYERS = [
    { count: 40, sizeMin: 0.5, sizeMax: 1.5, depth: 10 },
    { count: 25, sizeMin: 1, sizeMax: 2.5, depth: 25 },
];

const STARS = STAR_LAYERS.map(layer =>
    Array.from({ length: layer.count }).map(() => ({
        size: Math.random() * (layer.sizeMax - layer.sizeMin) + layer.sizeMin,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${Math.random() * 5 + 4}s`,
    }))
);
// --- END: Cosmic Background Configuration ---

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Parallax Background State
    const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

    // Astrology State with Local Storage Persistence
    const [astrologyType, setAstrologyType] = useState<AstrologyType>(() => {
        const saved = localStorage.getItem('astrologyType');
        return (saved === 'western' || saved === 'chinese') ? saved : 'western';
    });
    const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(() => {
        const saved = localStorage.getItem('selectedSign');
        return saved && Object.values(ZodiacSign).includes(saved as ZodiacSign) ? saved as ZodiacSign : null;
    });
    const [timeframe, setTimeframe] = useState<HoroscopeTimeframe>(() => {
        const saved = localStorage.getItem('timeframe');
        return (saved === 'Daily' || saved === 'Weekly' || saved === 'Monthly') ? saved as HoroscopeTimeframe : 'Daily';
    });
    const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
    const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo | null>(null);
    const [sign1, setSign1] = useState<ZodiacSign>(ZodiacSign.Aries);
    const [sign2, setSign2] = useState<ZodiacSign>(ZodiacSign.Taurus);
    const [compatibility, setCompatibility] = useState<CompatibilityInfo | null>(null);
    const [events, setEvents] = useState<AstrologicalEvent[] | null>(null);
    const [isEventsLoading, setIsEventsLoading] = useState<boolean>(false);
    const [birthDate, setBirthDate] = useState<string>('');
    const [birthPlace, setBirthPlace] = useState<string>('');
    const [isDiscoveringSign, setIsDiscoveringSign] = useState<boolean>(false);
    const [discoveredWesternSign, setDiscoveredWesternSign] = useState<ZodiacSign | null>(null);
    const [discoveredChineseSign, setDiscoveredChineseSign] = useState<ChineseZodiacSign | null>(null);

    // Chinese Astrology State with Local Storage Persistence
    const [selectedChineseSign, setSelectedChineseSign] = useState<ChineseZodiacSign | null>(() => {
        const saved = localStorage.getItem('selectedChineseSign');
        return saved && Object.values(ChineseZodiacSign).includes(saved as ChineseZodiacSign) ? saved as ChineseZodiacSign : null;
    });
    const [chineseTimeframe, setChineseTimeframe] = useState<HoroscopeTimeframe>(() => {
        const saved = localStorage.getItem('chineseTimeframe');
        return (saved === 'Daily' || saved === 'Weekly' || saved === 'Monthly') ? saved as HoroscopeTimeframe : 'Daily';
    });
    const [chineseHoroscope, setChineseHoroscope] = useState<Horoscope | null>(null);
    const [chineseZodiacInfo, setChineseZodiacInfo] = useState<ChineseZodiacInfo | null>(null);
    const [chineseSign1, setChineseSign1] = useState<ChineseZodiacSign>(ChineseZodiacSign.Rat);
    const [chineseSign2, setChineseSign2] = useState<ChineseZodiacSign>(ChineseZodiacSign.Ox);
    const [chineseCompatibility, setChineseCompatibility] = useState<CompatibilityInfo | null>(null);
    const [isChineseLoading, setIsChineseLoading] = useState<boolean>(false);

    // Astronomy State
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const [planetInfo, setPlanetInfo] = useState<PlanetInfo | null>(null);
    const [closestPlanet, setClosestPlanet] = useState<string | null>(null);
    const [isFindingClosest, setIsFindingClosest] = useState<boolean>(false);
    const [selectedAstroTopic, setSelectedAstroTopic] = useState<string | null>(null);
    const [astroStory, setAstroStory] = useState<string | null>(null);
    const [astroStoryImage, setAstroStoryImage] = useState<string | null>(null);
    const [isStoryLoading, setIsStoryLoading] = useState<boolean>(false);

    // Cosmic Mysteries State
    const [selectedMysteryTopic, setSelectedMysteryTopic] = useState<string | null>(null);
    const [cosmicContent, setCosmicContent] = useState<string | null>(null);
    const [cosmicContentImage, setCosmicContentImage] = useState<string | null>(null);
    const [isCosmicContentLoading, setIsCosmicContentLoading] = useState<boolean>(false);

    // Daily Facts State
    const [astrologyFact, setAstrologyFact] = useState<string | null>(null);
    const [chineseAstrologyFact, setChineseAstrologyFact] = useState<string | null>(null);
    const [astronomyFact, setAstronomyFact] = useState<string | null>(null);
    const [isFactLoading, setIsFactLoading] = useState<boolean>(true);

    // --- Parallax Effect Handler ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position to a range of -0.5 to 0.5
            const x = (e.clientX - innerWidth / 2) / innerWidth;
            const y = (e.clientY - innerHeight / 2) / innerHeight;
            setParallaxOffset({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- Local Storage Persistence Effects ---
    useEffect(() => {
        localStorage.setItem('astrologyType', astrologyType);
    }, [astrologyType]);

    useEffect(() => {
        if (selectedSign) {
            localStorage.setItem('selectedSign', selectedSign);
        } else {
            localStorage.removeItem('selectedSign');
        }
    }, [selectedSign]);

    useEffect(() => {
        localStorage.setItem('timeframe', timeframe);
    }, [timeframe]);

    useEffect(() => {
        if (selectedChineseSign) {
            localStorage.setItem('selectedChineseSign', selectedChineseSign);
        } else {
            localStorage.removeItem('selectedChineseSign');
        }
    }, [selectedChineseSign]);

    useEffect(() => {
        localStorage.setItem('chineseTimeframe', chineseTimeframe);
    }, [chineseTimeframe]);


    useEffect(() => {
        const fetchEvents = async () => {
            setIsEventsLoading(true);
            setError(null);
            try {
                const eventsData = await geminiService.getTodaysAstrologicalEvents();
                setEvents(eventsData);
            } catch (err) {
                setError('Failed to fetch astrological events. Please try again.');
            } finally {
                setIsEventsLoading(false);
            }
        };

        if (view === 'astrology' && astrologyType === 'western' && !events) {
            fetchEvents();
        }
    }, [view, astrologyType, events]);

    useEffect(() => {
        const fetchDailyFacts = async () => {
            try {
                const [westernAstroFactData, chineseAstroFactData, anomyFactData] = await Promise.all([
                    geminiService.getDailyFact('western astrology'),
                    geminiService.getDailyFact('chinese astrology'),
                    geminiService.getDailyFact('astronomy'),
                ]);
                setAstrologyFact(westernAstroFactData.fact);
                setChineseAstrologyFact(chineseAstroFactData.fact);
                setAstronomyFact(anomyFactData.fact);
            } catch (err) {
                console.error("Failed to fetch daily facts:", err);
            } finally {
                setIsFactLoading(false);
            }
        };

        fetchDailyFacts();
    }, []);

    const handleSelectSign = useCallback(async (sign: ZodiacSign) => {
        setSelectedSign(sign);
        setIsLoading(true);
        setError(null);
        setHoroscope(null);
        setZodiacInfo(null);
        try {
            const [horoscopeData, infoData] = await Promise.all([
                geminiService.generateHoroscope(sign, timeframe),
                geminiService.getZodiacInfo(sign)
            ]);
            setHoroscope(horoscopeData);
            setZodiacInfo(infoData);
        } catch (err) {
            setError('Failed to fetch zodiac data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [timeframe]);

    const handleSelectChineseSign = useCallback(async (sign: ChineseZodiacSign) => {
        setSelectedChineseSign(sign);
        setIsChineseLoading(true);
        setError(null);
        setChineseHoroscope(null);
        setChineseZodiacInfo(null);
        try {
            const [horoscopeData, infoData] = await Promise.all([
                geminiService.generateChineseHoroscope(sign, chineseTimeframe),
                geminiService.getChineseZodiacInfo(sign)
            ]);
            setChineseHoroscope(horoscopeData);
            setChineseZodiacInfo(infoData);
        } catch (err) {
            setError('Failed to fetch Chinese zodiac data. Please try again.');
        } finally {
            setIsChineseLoading(false);
        }
    }, [chineseTimeframe]);

    // Effect to automatically load data for a sign if it's selected but has no data loaded yet.
    // This is useful for signs selected from local storage or from the home page discovery.
    useEffect(() => {
        if (view === 'astrology') {
            if (astrologyType === 'western' && selectedSign && !zodiacInfo && !isLoading) {
                handleSelectSign(selectedSign);
            }
            if (astrologyType === 'chinese' && selectedChineseSign && !chineseZodiacInfo && !isChineseLoading) {
                handleSelectChineseSign(selectedChineseSign);
            }
        }
    }, [view, astrologyType, selectedSign, selectedChineseSign, zodiacInfo, chineseZodiacInfo, isLoading, isChineseLoading, handleSelectSign, handleSelectChineseSign]);

    const handleGetHoroscope = useCallback(async () => {
        if (!selectedSign) return;
        setIsLoading(true);
        setError(null);
        setHoroscope(null);
        try {
            const horoscopeData = await geminiService.generateHoroscope(selectedSign, timeframe);
            setHoroscope(horoscopeData);
        } catch (err) {
            setError('Failed to fetch horoscope. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedSign, timeframe]);

    const handleCheckCompatibility = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCompatibility(null);
        try {
            const compatibilityData = await geminiService.checkCompatibility(sign1, sign2);
            setCompatibility(compatibilityData);
        } catch (err) {
            setError('Failed to check compatibility. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [sign1, sign2]);

    const handleGetChineseHoroscope = useCallback(async () => {
        if (!selectedChineseSign) return;
        setIsChineseLoading(true);
        setError(null);
        setChineseHoroscope(null);
        try {
            const horoscopeData = await geminiService.generateChineseHoroscope(selectedChineseSign, chineseTimeframe);
            setChineseHoroscope(horoscopeData);
        } catch (err) {
            setError('Failed to fetch Chinese horoscope. Please try again.');
        } finally {
            setIsChineseLoading(false);
        }
    }, [selectedChineseSign, chineseTimeframe]);

    const handleCheckChineseCompatibility = useCallback(async () => {
        setIsChineseLoading(true);
        setError(null);
        setChineseCompatibility(null);
        try {
            const compatibilityData = await geminiService.checkChineseCompatibility(chineseSign1, chineseSign2);
            setChineseCompatibility(compatibilityData);
        } catch (err) {
            setError('Failed to check Chinese compatibility. Please try again.');
        } finally {
            setIsChineseLoading(false);
        }
    }, [chineseSign1, chineseSign2]);

    const handleSelectPlanet = useCallback(async (planet: string) => {
        setSelectedPlanet(planet);
        setIsLoading(true);
        setError(null);
        setPlanetInfo(null);
        try {
            const info = await geminiService.getPlanetInfo(planet);
            setPlanetInfo(info);
        } catch (err) {
            setError('Failed to fetch planet data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFindZodiacSign = useCallback(async () => {
        if (!birthDate || !birthPlace) return;
        setIsDiscoveringSign(true);
        setError(null);

        try {
            const [{ zodiacSign }, { chineseZodiacSign }] = await Promise.all([
                geminiService.getZodiacSignFromBirthData(birthDate, birthPlace),
                geminiService.getChineseZodiacSignFromBirthData(birthDate)
            ]);

            if (zodiacSign && chineseZodiacSign) {
                setDiscoveredWesternSign(zodiacSign);
                setSelectedSign(zodiacSign);
                setDiscoveredChineseSign(chineseZodiacSign);
                setSelectedChineseSign(chineseZodiacSign);

                // Clear old data for the signs to force a reload when navigating
                setHoroscope(null);
                setZodiacInfo(null);
                setChineseHoroscope(null);
                setChineseZodiacInfo(null);
            } else {
                setDiscoveredWesternSign(null);
                setDiscoveredChineseSign(null);
                setError('Could not determine your zodiac signs. Please check the details and try again.');
            }
        } catch (err) {
            setDiscoveredWesternSign(null);
            setDiscoveredChineseSign(null);
            setError('Failed to determine your signs. Please try again later.');
        } finally {
            setIsDiscoveringSign(false);
        }
    }, [birthDate, birthPlace]);

    const handleFindClosestPlanet = useCallback(async () => {
        setIsFindingClosest(true);
        setError(null);
        try {
            const { planetName } = await geminiService.getClosestPlanetToEarth();
            setClosestPlanet(planetName);
            await handleSelectPlanet(planetName);
        } catch (err) {
            setError('Failed to find the closest planet. Please try again later.');
        } finally {
            setIsFindingClosest(false);
        }
    }, [handleSelectPlanet]);

    const handleSelectAstroTopic = useCallback(async (topic: string) => {
        setSelectedAstroTopic(topic);
        setIsStoryLoading(true);
        setAstroStory(null);
        setAstroStoryImage(null);
        setError(null);
        try {
            const [{ story }, { imageUrl }] = await Promise.all([
                geminiService.getAstroStory(topic),
                geminiService.generateImageForTopic(topic)
            ]);
            setAstroStory(story);
            setAstroStoryImage(imageUrl);
        } catch (err) {
            setError('Failed to fetch the story and its visual. Please try again later.');
        } finally {
            setIsStoryLoading(false);
        }
    }, []);

    const handleSelectMysteryTopic = useCallback(async (category: string, topic: string) => {
        setSelectedMysteryTopic(topic);
        setIsCosmicContentLoading(true);
        setCosmicContent(null);
        setCosmicContentImage(null);
        setError(null);
        try {
            const [{ content }, { imageUrl }] = await Promise.all([
                geminiService.getCosmicContent(category, topic),
                geminiService.generateImageForTopic(topic)
            ]);
            setCosmicContent(content);
            setCosmicContentImage(imageUrl);
        } catch (err) {
            setError('Failed to fetch this cosmic mystery and its visual. Please try again later.');
        } finally {
            setIsCosmicContentLoading(false);
        }
    }, []);

    const renderCosmicBackground = () => (
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            {/* Nebulae */}
            <div
                className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 bg-fuchsia-500/10 rounded-full blur-3xl opacity-50 animate-[drift_60s_ease-in-out_infinite] transition-transform duration-500 ease-out"
                style={{
                transform: `translate(${parallaxOffset.x * -40}px, ${parallaxOffset.y * -40}px)`
                }}
            />
            <div
                className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-cyan-500/10 rounded-full blur-3xl opacity-50 animate-[drift_80s_ease-in-out_infinite_reverse] transition-transform duration-500 ease-out"
                style={{
                transform: `translate(${parallaxOffset.x * -25}px, ${parallaxOffset.y * -25}px)`
                }}
            />

            {/* Star Layers */}
            {STAR_LAYERS.map((layer, layerIndex) => (
                <div
                    key={layerIndex}
                    className="absolute inset-0 transition-transform duration-500 ease-out"
                    style={{
                    transform: `translate(${parallaxOffset.x * -layer.depth}px, ${parallaxOffset.y * -layer.depth}px)`
                    }}
                >
                    {STARS[layerIndex].map((star, starIndex) => (
                    <div
                        key={starIndex}
                        className="star"
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            top: star.top,
                            left: star.left,
                            animationDelay: star.delay,
                            animationDuration: star.duration,
                        }}
                    />
                    ))}
                </div>
            ))}
        </div>
    );

    const renderHome = () => (
        <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-cyan-300 tracking-wider">Celestial Compass</h1>
            <p className="text-lg text-gray-300 mb-12">Explore the Cosmos, Discover Yourself.</p>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-12 max-w-3xl mx-auto border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                <h3 className="text-2xl font-semibold mb-2 text-center text-cyan-300">Your Cosmic Profile</h3>
                <p className="text-gray-400 text-center mb-6">Enter your birth details to find your zodiac signs and unlock personalized insights.</p>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <input 
                        type="date" 
                        value={birthDate} 
                        onChange={e => setBirthDate(e.target.value)} 
                        className="bg-gray-700 p-3 rounded-md w-full md:w-auto text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
                        aria-label="Birth Date"
                    />
                    <input 
                        type="text" 
                        placeholder="Place of Birth" 
                        value={birthPlace} 
                        onChange={e => setBirthPlace(e.target.value)} 
                        className="bg-gray-700 p-3 rounded-md w-full md:w-auto border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
                        aria-label="Place of Birth"
                    />
                    <button 
                        onClick={handleFindZodiacSign} 
                        disabled={!birthDate || !birthPlace || isDiscoveringSign}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3 rounded-lg transition-colors w-full md:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isDiscoveringSign ? <LoadingSpinner/> : 'Discover My Signs'}
                    </button>
                </div>
                {!isDiscoveringSign && discoveredWesternSign && discoveredChineseSign && (
                    <div className="mt-6 text-center bg-gray-700/50 p-4 rounded-lg border border-cyan-500/30">
                        <h4 className="text-xl font-semibold text-cyan-200 mb-3">Your Cosmic Identity:</h4>
                        <div className="flex justify-center items-center gap-8">
                            <div>
                                <p className="text-gray-400 text-sm">Western Zodiac</p>
                                <p className="text-2xl font-bold text-fuchsia-300 flex items-center gap-2">
                                    <span className="text-3xl" aria-hidden="true">{ZODIAC_SIGNS.find(s => s.name === discoveredWesternSign)?.symbol}</span>
                                    {discoveredWesternSign}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Chinese Zodiac</p>
                                <p className="text-2xl font-bold text-red-300 flex items-center gap-2">
                                     <span className="text-3xl" aria-hidden="true">{CHINESE_ZODIAC_SIGNS.find(s => s.name === discoveredChineseSign)?.symbol}</span>
                                    {discoveredChineseSign}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setView('astrology')} 
                            className="mt-5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-lg transition-colors"
                        >
                            Explore Your Horoscopes →
                        </button>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div onClick={() => setView('astrology')} className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg cursor-pointer border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                    <h2 className="text-3xl font-bold mb-2 text-fuchsia-400">🌟 Astrology</h2>
                    <p className="text-gray-400">Unveil the secrets of the stars with daily horoscopes, zodiac profiles, and compatibility checks.</p>
                </div>
                <div onClick={() => setView('astronomy')} className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg cursor-pointer border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                    <h2 className="text-3xl font-bold mb-2 text-amber-400">🪐 Astronomy</h2>
                    <p className="text-gray-400">Journey through our solar system and learn fascinating facts about the planets.</p>
                </div>
                <div onClick={() => setView('cosmicMysteries')} className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg cursor-pointer border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                    <h2 className="text-3xl font-bold mb-2 text-teal-400">🌌 Cosmic Mysteries</h2>
                    <p className="text-gray-400">Explore galaxies, black holes, dark matter, and other unexplained cosmic phenomena.</p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-300">Daily Cosmic Insights</h2>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                    <DailyFact topic="astrology" fact={astrologyFact} isLoading={isFactLoading} />
                    <DailyFact topic="astronomy" fact={astronomyFact} isLoading={isFactLoading} />
                </div>
            </div>
        </div>
    );
    
    const renderNav = () => {
        const navItems: { label: string; view: View }[] = [
            { label: 'Home', view: 'home' },
            { label: 'Astrology', view: 'astrology' },
            { label: 'Astronomy', view: 'astronomy' },
            { label: 'Cosmic Mysteries', view: 'cosmicMysteries' },
        ];

        return (
            <nav className="p-4 mb-8 bg-black/30 backdrop-blur-md sticky top-0 z-50 border-b border-cyan-500/20 shadow-lg shadow-black/20">
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 max-w-7xl mx-auto">
                    {navItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`text-lg font-semibold transition-all duration-300 pb-1 border-b-2 ${
                                view === item.view
                                    ? 'text-cyan-300 border-cyan-400'
                                    : 'text-gray-400 border-transparent hover:text-white hover:border-cyan-400/50'
                            }`}
                            aria-current={view === item.view ? 'page' : undefined}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </nav>
        );
    };

    const renderWesternAstrology = () => (
        <>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-8 border border-fuchsia-500/20">
                <h3 className="text-2xl font-semibold mb-4 text-center">Select Your Zodiac Sign</h3>
                <ZodiacWheel selectedSign={selectedSign} onSelectSign={handleSelectSign} />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-8 border border-fuchsia-500/20">
                <h3 className="text-2xl font-semibold mb-4 text-center">Today's Astrological Events</h3>
                {isEventsLoading && <LoadingSpinner />}
                {!isEventsLoading && events && (
                    <div className="space-y-4">
                        {events.map((event, index) => (
                            <div key={index} className="bg-gray-700/50 p-4 rounded-lg transition-transform hover:scale-105 duration-300">
                                <h4 className="text-lg font-bold text-fuchsia-300 flex items-center">
                                    <span className="text-2xl mr-3" aria-hidden="true">{event.emoji}</span>
                                    <span>{event.title}</span>
                                </h4>
                                <p className="text-gray-300 mt-1 pl-9">{event.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedSign && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-fuchsia-500/20">
                        <h3 className="text-2xl font-semibold mb-4 text-center">{selectedSign} Details</h3>
                        {isLoading && !zodiacInfo && <LoadingSpinner />}
                        {zodiacInfo && (
                            <div className="space-y-4 text-gray-300">
                                <div><strong className="text-fuchsia-300">Element:</strong> {zodiacInfo.element}</div>
                                <div><strong className="text-fuchsia-300">Ruling Planet:</strong> {zodiacInfo.ruling_planet}</div>
                                <div><strong className="text-fuchsia-300">Personality:</strong> {zodiacInfo.personality_traits.join(', ')}</div>
                                <div><strong className="text-fuchsia-300">Compatibility:</strong> {zodiacInfo.compatibility}</div>
                            </div>
                        )}
                        <h3 className="text-2xl font-semibold my-4 text-center">Horoscope</h3>
                        <div className="flex justify-center space-x-2 my-4">
                            {(['Daily', 'Weekly', 'Monthly'] as HoroscopeTimeframe[]).map(tf => (
                                <button key={tf} onClick={() => setTimeframe(tf)} className={`px-4 py-2 rounded-md text-sm ${timeframe === tf ? 'bg-fuchsia-600' : 'bg-gray-700 hover:bg-fuchsia-800'}`}>{tf}</button>
                            ))}
                        </div>
                        <div className="text-center">
                            <button onClick={handleGetHoroscope} className="bg-fuchsia-700 hover:bg-fuchsia-600 px-6 py-2 rounded-lg transition-colors">Get {timeframe} Horoscope</button>
                        </div>
                        {isLoading && !horoscope && <LoadingSpinner />}
                        {horoscope && (
                            <div className="mt-4 space-y-3">
                                <p><strong className="text-fuchsia-300">❤️ Love:</strong> {horoscope.love}</p>
                                <p><strong className="text-fuchsia-300">💼 Career:</strong> {horoscope.career}</p>
                                <p><strong className="text-fuchsia-300">🌿 Health:</strong> {horoscope.health}</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-fuchsia-500/20">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Compatibility Checker</h3>
                        <div className="flex gap-4 items-center justify-center mb-4">
                            <select value={sign1} onChange={e => setSign1(e.target.value as ZodiacSign)} className="bg-gray-700 p-2 rounded-md w-full">
                                {ZODIAC_SIGNS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                            <span className="text-2xl text-fuchsia-400">+</span>
                            <select value={sign2} onChange={e => setSign2(e.target.value as ZodiacSign)} className="bg-gray-700 p-2 rounded-md w-full">
                                {ZODIAC_SIGNS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="text-center">
                            <button onClick={handleCheckCompatibility} className="bg-fuchsia-700 hover:bg-fuchsia-600 px-6 py-2 rounded-lg transition-colors">Check Compatibility</button>
                        </div>
                        {isLoading && !compatibility && <LoadingSpinner />}
                        {compatibility && (
                            <div className="mt-6 text-center">
                                <div className="text-5xl font-bold text-fuchsia-300 mb-2">{compatibility.percentage}%</div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-fuchsia-500 h-2.5 rounded-full" style={{ width: `${compatibility.percentage}%` }}></div>
                                </div>
                                <p className="mt-4 text-gray-300">{compatibility.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );

    const renderChineseAstrology = () => (
        <>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-8 border border-fuchsia-500/20">
                <h3 className="text-2xl font-semibold mb-4 text-center">Select Your Chinese Zodiac Sign</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4" role="radiogroup" aria-label="Chinese Zodiac Signs">
                    {CHINESE_ZODIAC_SIGNS.map((sign) => {
                        const isSelected = selectedChineseSign === sign.name;
                        return (
                        <button
                            key={sign.name}
                            onClick={() => handleSelectChineseSign(sign.name)}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
                                isSelected ? 'bg-fuchsia-600 shadow-lg shadow-fuchsia-500/50 ring-2 ring-fuchsia-300 z-10' : 'bg-gray-700/80 backdrop-blur-sm hover:bg-fuchsia-800/80 border border-fuchsia-900/50'
                            }`}
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={sign.name}
                        >
                            <span className="text-4xl" aria-hidden="true">{sign.symbol}</span>
                            <span className="text-sm uppercase tracking-wider mt-2">{sign.name}</span>
                        </button>
                        );
                    })}
                </div>
            </div>

            {selectedChineseSign && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-fuchsia-500/20">
                        <h3 className="text-2xl font-semibold mb-4 text-center">{selectedChineseSign} Details</h3>
                        {isChineseLoading && !chineseZodiacInfo && <LoadingSpinner />}
                        {chineseZodiacInfo && (
                            <div className="space-y-4 text-gray-300">
                                <div><strong className="text-fuchsia-300">Element:</strong> {chineseZodiacInfo.element}</div>
                                <div><strong className="text-fuchsia-300">Yin/Yang:</strong> {chineseZodiacInfo.yin_yang}</div>
                                <div><strong className="text-fuchsia-300">Personality:</strong> {chineseZodiacInfo.personality_traits.join(', ')}</div>
                                <div><strong className="text-fuchsia-300">Compatibility:</strong> {chineseZodiacInfo.compatibility}</div>
                            </div>
                        )}
                        <h3 className="text-2xl font-semibold my-4 text-center">Horoscope</h3>
                        <div className="flex justify-center space-x-2 my-4">
                            {(['Daily', 'Weekly', 'Monthly'] as HoroscopeTimeframe[]).map(tf => (
                                <button key={tf} onClick={() => setChineseTimeframe(tf)} className={`px-4 py-2 rounded-md text-sm ${chineseTimeframe === tf ? 'bg-fuchsia-600' : 'bg-gray-700 hover:bg-fuchsia-800'}`}>{tf}</button>
                            ))}
                        </div>
                        <div className="text-center">
                            <button onClick={handleGetChineseHoroscope} className="bg-fuchsia-700 hover:bg-fuchsia-600 px-6 py-2 rounded-lg transition-colors">Get {chineseTimeframe} Horoscope</button>
                        </div>
                        {isChineseLoading && !chineseHoroscope && <LoadingSpinner />}
                        {chineseHoroscope && (
                            <div className="mt-4 space-y-3">
                                <p><strong className="text-fuchsia-300">❤️ Love:</strong> {chineseHoroscope.love}</p>
                                <p><strong className="text-fuchsia-300">💼 Career:</strong> {chineseHoroscope.career}</p>
                                <p><strong className="text-fuchsia-300">🌿 Health:</strong> {chineseHoroscope.health}</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-fuchsia-500/20">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Compatibility Checker</h3>
                        <div className="flex gap-4 items-center justify-center mb-4">
                            <select value={chineseSign1} onChange={e => setChineseSign1(e.target.value as ChineseZodiacSign)} className="bg-gray-700 p-2 rounded-md w-full">
                                {CHINESE_ZODIAC_SIGNS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                            <span className="text-2xl text-fuchsia-400">+</span>
                            <select value={chineseSign2} onChange={e => setChineseSign2(e.target.value as ChineseZodiacSign)} className="bg-gray-700 p-2 rounded-md w-full">
                                {CHINESE_ZODIAC_SIGNS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="text-center">
                            <button onClick={handleCheckChineseCompatibility} className="bg-fuchsia-700 hover:bg-fuchsia-600 px-6 py-2 rounded-lg transition-colors">Check Compatibility</button>
                        </div>
                        {isChineseLoading && !chineseCompatibility && <LoadingSpinner />}
                        {chineseCompatibility && (
                            <div className="mt-6 text-center">
                                <div className="text-5xl font-bold text-fuchsia-300 mb-2">{chineseCompatibility.percentage}%</div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-fuchsia-500 h-2.5 rounded-full" style={{ width: `${chineseCompatibility.percentage}%` }}></div>
                                </div>
                                <p className="mt-4 text-gray-300">{chineseCompatibility.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );

    const renderAstrology = () => (
        <div>
            <h2 className="text-4xl font-bold text-center mb-4 text-fuchsia-400">Astrology</h2>
            
            <div className="flex justify-center mb-6 border-b-2 border-fuchsia-500/20">
                <button 
                    onClick={() => { setAstrologyType('western'); setError(null); }} 
                    className={`px-6 py-3 text-lg font-semibold transition-colors ${astrologyType === 'western' ? 'text-fuchsia-300 border-b-2 border-fuchsia-400' : 'text-gray-400 hover:text-white'}`}
                    aria-current={astrologyType === 'western'}
                >
                    Western
                </button>
                <button 
                    onClick={() => { setAstrologyType('chinese'); setError(null); }} 
                    className={`px-6 py-3 text-lg font-semibold transition-colors ${astrologyType === 'chinese' ? 'text-fuchsia-300 border-b-2 border-fuchsia-400' : 'text-gray-400 hover:text-white'}`}
                    aria-current={astrologyType === 'chinese'}
                >
                    Chinese
                </button>
            </div>
            
            <div className="mb-8">
                {astrologyType === 'western' ? (
                    <DailyFact topic="astrology" fact={astrologyFact} isLoading={isFactLoading} />
                ) : (
                    <DailyFact topic="chinese-astrology" fact={chineseAstrologyFact} isLoading={isFactLoading} />
                )}
            </div>

            {astrologyType === 'western' ? renderWesternAstrology() : renderChineseAstrology()}
        </div>
    );

    const renderAstronomy = () => (
        <div>
            <h2 className="text-4xl font-bold text-center mb-8 text-amber-400">Astronomy</h2>
            
            <div className="mb-8">
                <DailyFact topic="astronomy" fact={astronomyFact} isLoading={isFactLoading} />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-8 border border-amber-500/20">
                <h3 className="text-2xl font-semibold mb-4 text-center">Solar System Overview</h3>
                <SolarSystemMap />
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="md:col-span-1 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-amber-500/20">
                    <h3 className="text-xl font-semibold mb-4 text-center">Select a Planet</h3>
                    <div className="mb-4">
                        <button
                            onClick={handleFindClosestPlanet}
                            disabled={isFindingClosest}
                            className="w-full bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                        >
                            {isFindingClosest ? <LoadingSpinner /> : '🪐 Find Closest to Earth'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {PLANETS.map(planet => {
                            const isSelected = selectedPlanet === planet;
                            const isClosest = closestPlanet === planet;
                            return (
                                <button
                                    key={planet}
                                    onClick={() => handleSelectPlanet(planet)}
                                    className={`w-full flex items-center p-3 rounded-md transition-all duration-300 text-left relative ${
                                        isSelected ? 'bg-amber-500/40' : 'bg-gray-700/50 hover:bg-amber-500/20'
                                    } ${
                                        isClosest ? 'ring-2 ring-amber-300 shadow-lg shadow-amber-500/20' : ''
                                    }`}
                                >
                                    <Planet planetName={planet} className="w-8 h-8 mr-4" />
                                    <span className="text-lg">{planet}</span>
                                    {isClosest && <span className="ml-auto text-xs font-semibold bg-amber-500 text-white px-2 py-1 rounded-full">Closest</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="md:col-span-3 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg min-h-[400px] border border-amber-500/20 flex items-center justify-center">
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && !planetInfo && (
                        <div className="text-center text-gray-400">
                            <p className="text-3xl mb-2" aria-hidden="true">🔭</p>
                            <p>Select a planet to see its details.</p>
                        </div>
                    )}
                    {planetInfo && selectedPlanet && (
                        <div className="text-center w-full">
                            <div className="w-40 h-40 rounded-full mb-6 mx-auto p-1 border-4 border-amber-500/50 shadow-lg shadow-amber-500/20">
                                <Planet planetName={selectedPlanet} className="w-full h-full" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-amber-300">{planetInfo.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-left">
                                <div><strong className="text-amber-300">Mass:</strong> {planetInfo.mass}</div>
                                <div><strong className="text-amber-300">Diameter:</strong> {planetInfo.diameter}</div>
                                <div className="col-span-2"><strong className="text-amber-300">Distance from Sun:</strong> {planetInfo.distance_from_sun}</div>
                            </div>
                            <h4 className="text-xl font-semibold mt-6 mb-2 text-amber-300 text-left">Fun Facts</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-300 text-left">
                                {planetInfo.fun_facts.map((fact, index) => <li key={index}>{fact}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-amber-500/20">
                <h3 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center text-amber-300">
                    <span className="text-3xl mr-3" aria-hidden="true">📜</span>
                    Astronomical History & Myths
                </h3>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {ASTRO_MYTH_TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => handleSelectAstroTopic(topic)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                selectedAstroTopic === topic
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-700 hover:bg-amber-800'
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
                <div className="bg-black/20 p-4 rounded-lg min-h-[300px] flex items-center justify-center">
                    {isStoryLoading && <LoadingSpinner />}
                    {!isStoryLoading && !astroStory && (
                        <p className="text-gray-400 text-center">Select a topic to read its story and see it visualized.</p>
                    )}
                    {astroStory && astroStoryImage && (
                        <div className="grid md:grid-cols-2 gap-6 items-center w-full">
                            <div>
                                <img src={astroStoryImage} alt={`Artistic representation of ${selectedAstroTopic}`} className="w-full h-auto object-cover rounded-lg shadow-lg shadow-amber-500/10 animate-[fadeIn_1s_ease-in-out]" />
                            </div>
                            <div className="max-h-80 overflow-y-auto pr-2">
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{astroStory}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderCosmicMysteries = () => (
        <div>
            <h2 className="text-4xl font-bold text-center mb-8 text-teal-400">Cosmic Mysteries</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(MYSTERY_TOPICS).map(([category, topics]) => (
                    <div key={category} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-teal-500/20">
                        <h3 className="text-2xl font-semibold mb-4 text-center text-teal-300">{category}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {topics.map(topic => (
                                <button
                                    key={topic}
                                    onClick={() => handleSelectMysteryTopic(category, topic)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                        selectedMysteryTopic === topic
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-700 hover:bg-teal-800'
                                    }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 bg-black/20 p-6 rounded-lg min-h-[400px] border border-teal-500/20 flex items-center justify-center">
                {isCosmicContentLoading && <LoadingSpinner />}
                {!isCosmicContentLoading && !cosmicContent && (
                    <div className="text-center text-gray-400">
                        <span className="text-3xl block mb-2" aria-hidden="true">✨</span>
                        Select a topic above to uncover a cosmic mystery and see it visualized.
                    </div>
                )}
                {cosmicContent && cosmicContentImage && (
                    <div className="grid md:grid-cols-2 gap-6 items-center w-full">
                        <div>
                            <img src={cosmicContentImage} alt={`Artistic representation of ${selectedMysteryTopic}`} className="w-full h-auto object-cover rounded-lg shadow-lg shadow-teal-500/10 animate-[fadeIn_1s_ease-in-out]" />
                        </div>
                        <div className="max-h-96 overflow-y-auto pr-2">
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{cosmicContent}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-black p-4 md:p-8 relative overflow-hidden">
            {renderCosmicBackground()}
            <div className="max-w-7xl mx-auto relative z-10">
                {view !== 'home' && renderNav()}
                {error && <div className="bg-red-500/30 text-red-200 p-4 rounded-lg my-4 text-center" role="alert">{error}</div>}
                {view === 'home' && renderHome()}
                {view === 'astrology' && renderAstrology()}
                {view === 'astronomy' && renderAstronomy()}
                {view === 'cosmicMysteries' && renderCosmicMysteries()}
            </div>
        </div>
    );
};

export default App;