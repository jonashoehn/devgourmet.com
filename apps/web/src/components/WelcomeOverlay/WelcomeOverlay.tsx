import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Code, Sparkle, Cookie } from '@phosphor-icons/react';

const COOKIE_NAME = 'devgourmet_welcome_accepted';
const COOKIE_EXPIRY_DAYS = 365;

export function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`));

    if (!hasAccepted) {
      // Show overlay after a short delay for dramatic effect
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie for 1 year
    const date = new Date();
    date.setTime(date.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    document.cookie = `${COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 p-4"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10, y: 100 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 200,
            }}
            className="relative max-w-2xl w-full bg-[var(--color-ide-bg-lighter)] border-4 border-[var(--color-accent)] shadow-2xl"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Sparkle decorations */}
            <motion.div
              className="absolute -top-6 -left-6 hidden sm:block"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkle size={48} weight="fill" className="text-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -right-6 hidden sm:block"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              <Sparkle size={48} weight="fill" className="text-yellow-400" />
            </motion.div>

            {/* Header */}
            <div className="bg-[var(--color-accent)] px-8 py-6 text-center">
              <div className="flex justify-center items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <ChefHat size={48} weight="fill" className="text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-4xl"
                >
                  ✕
                </motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Code size={48} weight="fill" className="text-white" />
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-white font-mono">
                Welcome to DevGourmet!
              </h1>
              <p className="text-white text-sm mt-2 opacity-90">
                Where recipes meet code (and somehow it makes sense)
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 space-y-6">
              <div className="text-[var(--color-ide-text)] space-y-4">
                <p className="text-lg">
                  Hey there, culinary coder! 👋
                </p>

                <p>
                  You've stumbled into <span className="text-[var(--color-keyword)] font-semibold">DevGourmet</span> -
                  the world's first (and possibly only) recipe app that thinks it's an IDE.
                  Because why use a boring recipe card when you can <code className="px-2 py-1 bg-[var(--color-ide-bg)] text-[var(--color-function)]">cook()</code> with variables?
                </p>

                <div className="bg-[var(--color-ide-bg)] p-4 border-l-4 border-[var(--color-accent)] font-mono text-sm">
                  <div className="text-[var(--color-comment)]">// Example:</div>
                  <div><span className="text-[var(--color-keyword)]">let</span> servings = <span className="text-[var(--color-number)]">4</span>;</div>
                  <div><span className="text-[var(--color-function)]">add</span>(<span className="text-[var(--color-string)]">"pasta"</span>, <span className="text-[var(--color-number)]">400</span> * servings, <span className="text-[var(--color-string)]">"grams"</span>);</div>
                  <div><span className="text-[var(--color-function)]">cook</span>(<span className="text-[var(--color-number)]">9</span>, <span className="text-[var(--color-string)]">"minutes"</span>);</div>
                </div>

                <p className="text-sm">
                  <span className="font-semibold">What to expect:</span>
                </p>
                <ul className="text-sm space-y-2 pl-6">
                  <li className="list-disc">🔢 Dynamic ingredient scaling (because math is delicious)</li>
                  <li className="list-disc">⏱️ Built-in timers (no more burnt garlic!)</li>
                  <li className="list-disc">📸 Visual references (images & videos)</li>
                  <li className="list-disc">💻 Syntax highlighting (yep, for recipes)</li>
                  <li className="list-disc">🎨 Dark mode only (we're developers, duh)</li>
                </ul>

                <div className="border-t border-[var(--color-ide-border)] pt-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Cookie size={24} className="text-[var(--color-warning)] flex-shrink-0 mt-1" />
                    <div className="text-sm text-[var(--color-ide-text-muted)]">
                      <p className="mb-2">
                        <span className="font-semibold text-[var(--color-ide-text)]">The Cookie & Data Situation:</span>
                      </p>
                      <p>
                        We use <span className="font-mono text-[var(--color-number)]">minimal cookies</span> for:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Remembering you've seen this welcome message</li>
                        <li>Keeping you logged in when you create an account</li>
                      </ul>
                      <p className="mt-2">
                        No tracking, no analytics, no selling your data. Just the essentials to make the app work.
                      </p>
                      <p className="mt-2 italic">
                        (Still way less cookies than in our cookie recipe 🍪)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accept Button */}
              <div className="text-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  className="px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-lg font-semibold transition-colors shadow-lg"
                >
                  Let's Cook! 🚀
                </motion.button>
                <p className="text-xs text-[var(--color-ide-text-muted)] mt-3">
                  By clicking this button, you agree to the cookie usage described above and to have fun (maybe learn something too)
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
