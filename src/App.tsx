import React, { useState, useEffect, useRef } from 'react';
import { Heart, Gift, Music, Share2, Calendar, Star, Sparkles, Play, Pause, Volume2 } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showGift, setShowGift] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // SVG pattern for background
  const stardustPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8bbd9' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";


  // Таймер до конца дня
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Конфетти анимация
  const showConfettiAnimation = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Музыка
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Не удалось воспроизвести аудио:", err);
        });
    }
  };


  // Поделиться
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'С днём рождения, Элмира!',
          text: 'Особенное поздравление с днём рождения',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Ошибка при попытке поделиться:', err);
      }
    } else {
      // Fallback для браузеров без Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 relative overflow-x-hidden">
      {/* Звёздная пыль на фоне */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundImage: `url("${stardustPattern}")` }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-200 rounded-full animate-bounce delay-75"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-200 rounded-full animate-bounce delay-150"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-orange-200 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Конфетти */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s'
              }}
            >
              <Heart className="w-4 h-4 text-pink-400" />
            </div>
          ))}
        </div>
      )}

      {/* Audio элемент */}
      <audio ref={audioRef} loop>
        <source src="/src/birthday-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Hero секция */}
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 bg-clip-text mb-6 animate-fade-in">
            С днём рождения, Элмира!
          </h1>
          <p className="font-['Inter'] text-lg md:text-xl text-gray-600 mb-8 animate-slide-up">
            Пусть сегодня исполнится всё, о чём ты мечтала ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => {
                showConfettiAnimation();
                document.getElementById("congratulations")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="group px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              aria-label="Открыть поздравительную открытку"
            >
              <Gift className="inline-block w-5 h-5 mr-2" />
              Открыть открытку
            </button>


            <button
              onClick={toggleMusic}
              className="group px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              aria-label={isPlaying ? "Остановить музыку" : "Включить музыку"}
            >
              {isPlaying ? <Pause className="inline-block w-5 h-5 mr-2" /> : <Play className="inline-block w-5 h-5 mr-2" />}
              {isPlaying ? 'Пауза' : 'Включить музыку'}
            </button>
          </div>

          {/* Индикатор музыки */}
          {isPlaying && (
            <div className="flex items-center justify-center gap-2 text-purple-500 animate-pulse">
              <Volume2 className="w-4 h-4" />
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1 bg-purple-400 rounded-full animate-bounce" style={{ height: `${8 + i * 2}px`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Плавающие сердечки */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-300 opacity-20 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: `${1 + Math.random()}rem`
              }}
            />
          ))}
        </div>
      </section>

      {/* Таймер */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-gray-700 mb-8">
            До конца твоего особенного дня
          </h2>
          <div className="flex justify-center gap-4 md:gap-8">
            {[
              { label: 'Часов', value: timeLeft.hours },
              { label: 'Минут', value: timeLeft.minutes },
              { label: 'Секунд', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={item.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 font-mono animate-pulse">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500 mt-2">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Пожелание-письмо */}
      <section id="congratulations" className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-gray-700 mb-8">
            Дорогая Элмира
          </h2>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-pink-100 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Пусть мы знакомы совсем недолго, но этого времени уже хватило, чтобы понять, какая ты удивительная и светлая девушка.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                В твой день рождения хочу пожелать тебе море радости и исполнения самых заветных мечтаний.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Пусть каждый день дарит тебе улыбки, а впереди будет только счастье, успех и настоящая любовь.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                Прости что меня нет рядом в твой такой день. С днём рождения! 🎉
              </p>
            </div>


            <button
              onClick={() => setShowGift(true)}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              aria-label="Открыть подарок"
            >
              <Gift className="inline-block w-5 h-5 mr-2 group-hover:animate-bounce" />
              Открыть подарок
            </button>
          </div>
        </div>
      </section>

      {/* Модальное окно подарка */}
      {showGift && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center animate-bounce-in relative">
            <button
              onClick={() => setShowGift(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Закрыть"
            >
              ✕
            </button>

            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(8)].map((_, i) => (
                  <Sparkles key={i} className="w-4 h-4 text-yellow-400 animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>

            <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-gray-700 mb-4">
              Твой особенный сюрприз!
            </h3>

            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg mb-6">
              <code className="text-2xl font-bold text-purple-600">Сюрпризаша бат мегирет😁</code>
            </div>
            <p className="text-sm text-gray-500">
              Пусть сюрприз останется сюрпризом😁
            </p>
          </div>
        </div>
      )}



      {/* Финальный блок */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-6">
            "Карчи" с днём рождения!
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
            Пусть в твоей жизни будет больше радостных моментов, искренних улыбок и людей, которые ценят тебя по-настоящему.
            Очень рад, что судьба свела нас, и надеюсь, впереди нас ждёт ещё много тёплых встреч. ✨
          </p>


          <button
            onClick={handleShare}
            className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            aria-label="Поделиться поздравлением"
          >
            <Share2 className="inline-block w-5 h-5 mr-2 group-hover:animate-bounce" />
            Поделиться
          </button>
        </div>
      </section>

      {/* Звёзды */}
      <div className="fixed bottom-4 right-4 pointer-events-none">
        <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
