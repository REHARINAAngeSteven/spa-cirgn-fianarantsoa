import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle help with Ctrl+? or Ctrl+/
      if ((e.ctrlKey || e.metaKey) && (e.key === '?' || e.key === '/')) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Execute shortcuts
      shortcuts.forEach((shortcut) => {
        const keys = shortcut.key.split('+').map((k) => k.toLowerCase().trim());
        const isCtrl = keys.includes('ctrl') || keys.includes('⌘');
        const isAlt = keys.includes('alt');
        const isShift = keys.includes('shift');
        const mainKey = keys[keys.length - 1];

        if (
          (!isCtrl || e.ctrlKey || e.metaKey) &&
          (!isAlt || e.altKey) &&
          (!isShift || e.shiftKey) &&
          e.key.toLowerCase() === mainKey
        ) {
          if (shortcut.action) {
            e.preventDefault();
            shortcut.action();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 p-3 bg-card border border-border rounded-full shadow-lg hover:bg-accent transition-colors z-50"
        title="Afficher les raccourcis clavier (Ctrl+/)"
      >
        <Keyboard className="w-5 h-5 text-foreground" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="text-foreground">Raccourcis Clavier</h2>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-foreground">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs text-foreground font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 Appuyez sur <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">Ctrl+/</kbd> pour afficher/masquer cette aide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
