import { Button } from "@/components/ui/button";
import type { Arepa } from "../../types";

type Props = {
  currentSelection: Arepa[];
  activeTotal: number;
  removeFromSelection: (index: number) => void;
  handleCreateOrderClick: () => void;
};

export function BottomActionCart({ currentSelection, activeTotal, removeFromSelection, handleCreateOrderClick }: Props) {
  return (
    <div className="flex-none bg-white border-t border-brand-tertiary/60 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {currentSelection.length > 0 && (
        <div className="px-5 py-3 border-b border-neutral-100 bg-stone-50/80 flex gap-2 overflow-x-auto scrollbar-hide">
          {currentSelection.map((item, idx) => (
            <div key={idx} className="flex-none bg-white border border-brand-tertiary rounded-lg py-1.5 px-3 flex items-center gap-2 animate-in slide-in-from-right-2 shadow-sm">
              <span className="text-xs font-bold text-neutral-700 whitespace-nowrap">{item.name}</span>
              <button
                onClick={() => removeFromSelection(idx)}
                className="text-brand-primary hover:text-red-500 text-xs font-bold leading-none p-1 -mr-1 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-4 pb-safe flex items-center justify-between bg-white">
        <div className="flex flex-col">
          <span className="text-[11px] text-neutral-500 font-bold tracking-wide uppercase">
            {currentSelection.length} {currentSelection.length === 1 ? 'artículo' : 'artículos'}
          </span>
          <span className="text-xl font-black text-brand-primary leading-none mt-0.5">${activeTotal.toLocaleString("es-CO")}</span>
        </div>
        <Button
          onClick={handleCreateOrderClick}
          disabled={currentSelection.length === 0}
          className="bg-brand-primary hover:bg-[#a3383c] text-white rounded-xl shadow-[0_4px_14px_0_rgba(186,65,70,0.25)] text-sm h-11 px-6 font-bold border-none transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
        >
          Crear Pedido
        </Button>
      </div>
    </div>
  );
}
