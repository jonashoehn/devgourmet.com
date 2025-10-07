import { useState, useEffect, useRef } from 'react';
import { useRecipe } from '../../context';

export function Resources() {
  const { resources } = useRecipe();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const selectedImage = selectedIndex !== null ? resources[selectedIndex] : null;

  // Navigate to previous image (with wrapping)
  const goToPrevious = () => {
    if (selectedIndex === null || resources.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + resources.length) % resources.length);
  };

  // Navigate to next image (with wrapping)
  const goToNext = () => {
    if (selectedIndex === null || resources.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % resources.length);
  };

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        goToNext(); // Swipe left = next
      } else {
        goToPrevious(); // Swipe right = previous
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case 'Escape':
          setSelectedIndex(null);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex, resources.length]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg)]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono">
          RESOURCES
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        {resources.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-[var(--color-ide-text-muted)] text-sm">
                No resources yet.
                <br />
                Add images with resource() or image()
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3">
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {resources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="group cursor-pointer border border-[var(--color-ide-border)] hover:border-[var(--color-accent)] transition-all bg-[var(--color-ide-bg-lighter)]"
                  onClick={() => setSelectedIndex(index)}
                  style={{ aspectRatio: '1', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Thumbnail based on type */}
                  {resource.type === 'image' ? (
                    <img
                      src={resource.url}
                      alt={resource.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ display: 'block' }}
                    />
                  ) : resource.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ide-bg)]">
                      <div className="text-center">
                        <div className="text-5xl mb-2">▶️</div>
                        <div className="text-xs text-[var(--color-ide-text-muted)] font-mono px-2">Video</div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ide-bg)]">
                      <div className="text-center">
                        <div className="text-5xl mb-2">🔗</div>
                        <div className="text-xs text-[var(--color-ide-text-muted)] font-mono px-2">Link</div>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-60 transition-all flex items-center justify-center pointer-events-none">
                    <div className="text-white opacity-0 group-hover:opacity-100 text-center px-2 pointer-events-auto">
                      <div className="text-xs font-mono truncate">{resource.name}</div>
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-1 left-1 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--color-ide-text-muted)] z-10 uppercase">
                    {resource.type}
                  </div>

                  {/* Line number badge */}
                  <div className="absolute top-1 right-1 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--color-ide-text-muted)] z-10">
                    :{resource.line}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            paddingTop: 'max(16px, env(safe-area-inset-top))',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            paddingLeft: 'max(16px, env(safe-area-inset-left))',
            paddingRight: 'max(16px, env(safe-area-inset-right))'
          }}
        >
          <div className="relative max-w-5xl max-h-full w-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-0 right-0 text-white hover:text-[var(--color-accent)] transition-colors font-mono text-sm z-10 px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
              }}
            >
              ✕ Close (ESC)
            </button>

            {/* Counter */}
            {resources.length > 1 && (
              <div className="absolute top-0 left-0 text-white font-mono text-sm px-2 py-1">
                {(selectedIndex ?? 0) + 1} / {resources.length}
              </div>
            )}

            {/* Previous button - hidden on mobile */}
            {resources.length > 1 && (
              <button
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-[var(--color-ide-bg)] bg-opacity-80 hover:bg-opacity-100 border border-[var(--color-ide-border)] text-white hover:text-[var(--color-accent)] transition-all text-2xl z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                title="Previous (←)"
              >
                ‹
              </button>
            )}

            {/* Image container */}
            <div className="relative flex flex-col items-center">
              {/* Swipe hint on mobile */}
              {resources.length > 1 && (
                <div className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 text-white text-xs font-mono opacity-60">
                  ← Swipe →
                </div>
              )}

              {/* Content based on type */}
              {selectedImage.type === 'video' ? (
                <div className="w-full max-w-2xl bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] p-8 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="text-6xl mb-4">▶️</div>
                  <h3 className="text-xl font-semibold text-[var(--color-ide-text)] mb-4">{selectedImage.name}</h3>
                  {selectedImage.description && (
                    <p className="text-sm text-[var(--color-ide-text-muted)] mb-6">{selectedImage.description}</p>
                  )}
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Watch Video →
                  </a>
                </div>
              ) : selectedImage.type === 'link' ? (
                <div className="w-full max-w-2xl bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] p-8 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="text-6xl mb-4">🔗</div>
                  <h3 className="text-xl font-semibold text-[var(--color-ide-text)] mb-4">{selectedImage.name}</h3>
                  {selectedImage.description && (
                    <p className="text-sm text-[var(--color-ide-text-muted)] mb-6">{selectedImage.description}</p>
                  )}
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-sm transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open Link →
                  </a>
                </div>
              ) : (
                <>
                  {!imageLoaded[selectedImage.id] && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-6xl">🖼️</div>
                    </div>
                  )}
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="max-w-full max-h-[70vh] object-contain relative z-0"
                    onClick={(e) => e.stopPropagation()}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [selectedImage.id]: true }))}
                  />
                </>
              )}

              {/* Info (only for images) */}
              {selectedImage.type === 'image' && (
                <div
                  className="mt-4 bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] p-4 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-[var(--color-ide-text)]">
                      {selectedImage.name}
                    </h3>
                    <span className="text-xs font-mono text-[var(--color-ide-text-muted)]">
                      line :{selectedImage.line}
                    </span>
                  </div>
                  {selectedImage.description && (
                    <p className="text-sm text-[var(--color-ide-text-muted)]">
                      {selectedImage.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs font-mono text-[var(--color-ide-text-muted)] break-all">
                    {selectedImage.url}
                  </div>
                </div>
              )}
            </div>

            {/* Next button - hidden on mobile */}
            {resources.length > 1 && (
              <button
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-[var(--color-ide-bg)] bg-opacity-80 hover:bg-opacity-100 border border-[var(--color-ide-border)] text-white hover:text-[var(--color-accent)] transition-all text-2xl z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                title="Next (→)"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
