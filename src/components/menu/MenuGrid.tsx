import { Card } from "@/components/ui/card";
import type { Arepa } from "../../types";

type Props = {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  categories: string[];
  segmentProducts: Arepa[];
  addToSelection: (arepa: Arepa) => void;
};

export function MenuGrid({ selectedCategory, setSelectedCategory, categories, segmentProducts, addToSelection }: Props) {
  return (
    <main className="flex-1 overflow-y-auto p-5 space-y-7 scrollbar-hide bg-[#FAFAFA]">
      {selectedCategory ? (
        <section className="space-y-4 animate-in slide-in-from-right-4 duration-300 pb-4">
          <div className="flex items-center gap-3 pb-3 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-sm z-10 pt-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-600 hover:text-white hover:bg-brand-primary hover:border-brand-primary transition-all font-bold active:scale-90"
            >
              ←
            </button>
            <div className="bg-brand-secondary text-white px-4 py-1.5 rounded-full text-sm font-black tracking-widest uppercase shadow-[0_2px_10px_rgba(202,168,78,0.3)]">
              {selectedCategory}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {segmentProducts.filter(a => a.category === selectedCategory).map(item => (
              <Card
                key={item.id}
                className="bg-white rounded-2xl border-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(186,65,70,0.12)] transition-all flex flex-col cursor-pointer active:scale-95"
                onClick={() => addToSelection(item)}
              >
                <div className="p-4 pb-2 flex justify-between items-start gap-4">
                  <span className="text-base text-neutral-900 font-extrabold leading-tight">{item.name}</span>
                  <span className="text-sm font-black text-white bg-brand-primary px-3 py-1 rounded-full shadow-sm shrink-0">${item.price.toLocaleString("es-CO")}</span>
                </div>
                <div className="px-4 pb-4 mt-auto">
                  <span className="text-xs text-neutral-500 line-clamp-3 leading-snug font-medium pr-10">{item.description}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        categories.length > 0 ? (
          categories.map(category => (
            <section key={category} className="space-y-4 animate-in fade-in duration-300">
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => setSelectedCategory(category)}
              >
                <span className="bg-[#FFF4E0] text-[#B57C15] px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase shadow-sm group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                  {category}
                </span>
                <span className="text-[11px] text-neutral-400 font-bold normal-case flex items-center gap-1 group-hover:text-brand-primary transition-colors">
                  Ver todas <span className="text-[10px]">➔</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {segmentProducts.filter(a => a.category === category).map(item => (
                  <Card
                    key={item.id}
                    className="bg-white rounded-2xl border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_16px_rgba(186,65,70,0.12)] transition-all flex flex-col cursor-pointer active:scale-95 overflow-hidden"
                    onClick={() => addToSelection(item)}
                  >
                    <div className="p-3 pb-1 flex flex-col gap-1.5">
                      <span className="text-sm font-black text-white bg-brand-primary/90 px-2 py-0.5 rounded-full shadow-sm self-start inline-block leading-none">
                        ${item.price.toLocaleString("es-CO")}
                      </span>
                      <span className="text-sm text-neutral-800 font-bold leading-tight mt-1">{item.name}</span>
                    </div>
                    <div className="px-3 pb-3 mt-auto">
                      <span className="text-[10px] text-neutral-500 line-clamp-2 leading-tight font-medium">{item.description}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-3 opacity-60">
            <span className="text-4xl">😅</span>
            <p className="text-sm font-bold text-neutral-500">Aún no hay productos en este segmento.</p>
          </div>
        )
      )}
    </main>
  );
}
