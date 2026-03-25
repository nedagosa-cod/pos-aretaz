import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Order } from "../../types";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  activeOrders: Order[];
  currentTime: number;
  openOrderPayment: (order: Order) => void;
};

export function AllOrdersModal({ isOpen, setIsOpen, activeOrders, currentTime, openOrderPayment }: Props) {
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const formatTime = (startTime: number) => {
    const diff = currentTime - startTime;
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleExpand = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="absolute inset-0 z-[60] bg-[#FAFAFA] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
      <div className="bg-gradient-to-br from-[#A63338] to-brand-primary p-6 flex justify-between items-center shadow-md pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight">Todos los Pedidos <span className="bg-white/20 px-3 py-1 rounded-full text-lg ml-2">{activeOrders.length}</span></h2>
        <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors font-black text-lg shadow-sm">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 gap-4 content-start">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60 pt-20">
            <span className="text-6xl">🙌</span>
            <p className="text-xl font-bold text-neutral-400">No hay pedidos en cola</p>
          </div>
        ) : (
          activeOrders.map(order => {
            const isLate = (currentTime - order.createdAt) > 600000;
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div 
                key={order.id}
               className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col cursor-pointer transition-all"
               onClick={() => {
                 setIsOpen(false);
                 openOrderPayment(order);
               }}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                    <span className="text-3xl font-black text-brand-primary leading-none uppercase truncate pr-4">
                      {order.name ? order.name : `P#${order.id}`}
                    </span>
                    <button 
                      onClick={(e) => toggleExpand(e, order.id)}
                      className="flex items-center gap-1.5 text-lg text-neutral-500 font-bold leading-none hover:text-brand-secondary transition-colors self-start pt-2 pb-2"
                    >
                      {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-brand-secondary" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 pl-2 shrink-0">
                    <span className={`text-3xl font-black tracking-tighter leading-none ${isLate ? "text-red-600 animate-pulse" : "text-brand-secondary"}`}>
                      {formatTime(order.createdAt)}
                    </span>
                    <span className="text-xl font-black text-neutral-800 leading-none">
                      ${order.total.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div 
                    className="border-t border-neutral-100 pt-4 mt-2 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-stone-50 py-3 px-4 rounded-xl border border-neutral-100">
                        <span className="text-lg font-bold text-neutral-700 leading-tight">{item.name} <span className="text-sm font-medium text-neutral-400 block">{item.category}</span></span>
                        <span className="text-lg font-black text-brand-secondary">${item.price.toLocaleString("es-CO")}</span>
                      </div>
                    ))}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        openOrderPayment(order);
                      }}
                      className="w-full mt-3 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl py-3 font-black text-xl transition-colors border border-brand-primary/20 shadow-sm"
                    >
                      Cobrar y Entregar ➔
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
