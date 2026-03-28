import { useState, useEffect } from "react";
import { ClipboardList, BarChart2 } from "lucide-react";
import type { Order } from "../../types";

type Props = {
  activeOrders: Order[];
  currentTime: number;
  openOrderPayment: (order: Order) => void;
  openAllOrders: () => void;
  openDashboard: () => void;
};

export function TopOrdersBar({ activeOrders, currentTime, openOrderPayment, openAllOrders, openDashboard }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed", err);
    }
  };

  const formatTimeElapsed = (startTime: number) => {
    const diff = currentTime - startTime;
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-[#A63338] to-brand-primary px-4 pt-5 pb-5 min-h-[115px] flex-none flex flex-col justify-end shadow-[0_4px_20px_rgba(186,65,70,0.4)] relative z-20">
      <div className="absolute top-3 left-4">
        <h1 className="text-white/90 font-black tracking-tighter text-lg leading-none">Aretaz</h1>
      </div>
      <div className="absolute top-2.5 right-4 flex gap-2">
        <button 
          onClick={openDashboard}
          title="Dashboard de ventas"
          className="w-7 h-7 flex items-center justify-center rounded bg-white/10 text-white/90 hover:bg-white/25 transition-all shadow-sm active:scale-90"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
        <button 
          onClick={openAllOrders}
          title="Ver todos los pedidos en lista grande"
          className="w-7 h-7 flex items-center justify-center rounded bg-white/10 text-white/90 hover:bg-white/25 transition-all shadow-sm active:scale-90"
        >
          <ClipboardList className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Pantalla Completa"
          className="w-7 h-7 flex items-center justify-center rounded bg-white/10 text-white/90 hover:bg-white/25 transition-all text-sm font-bold shadow-sm active:scale-90"
        >
          {isFullscreen ? "🗗" : "⛶"}
        </button>
      </div>
      {activeOrders.length > 0 ? (
        <div className="flex overflow-x-auto gap-3 scrollbar-hide items-end mt-6">
          {activeOrders.map((order) => {
            const isLate = (currentTime - order.createdAt) > 600000;
            return (
              <div
                key={order.id}
                className="relative flex-none w-[72px] h-[95px] bg-[#FFFbf5] border border-white/60 flex flex-col items-center justify-start pt-2 cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all animate-in zoom-in-90 duration-300"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)" }}
                onClick={() => openOrderPayment(order)}
                title={`Ver y cobrar Pedido #${order.id}`}
              >
                <span className="text-[12px] font-black text-brand-primary text-center leading-none px-1 uppercase mb-0.5 truncate w-full">
                  {order.name ? order.name : `P#${order.id}`}
                </span>
                <span className={`text-[13px] font-black tracking-tighter leading-none mb-1 mt-0.5 ${isLate ? "text-red-700 animate-pulse" : "text-brand-secondary"}`}>
                  {formatTimeElapsed(order.createdAt)}
                </span>
                <span className="text-[10px] text-neutral-500 font-bold mt-1 font-mono bg-stone-200 px-1.5 py-0.5 rounded">
                  {order.items.length} arp
                </span>
              </div>
            );
          })}
          <div className="min-w-[4px] h-full"></div>
        </div>
      ) : (
        <div className="h-[85px] mt-6 flex items-center justify-center border-2 border-dashed border-white/30 rounded-xl bg-black/10">
          <span className="text-xs text-white/70 font-bold uppercase tracking-widest px-4 text-center">Sin Pedidos Activos</span>
        </div>
      )}
    </div>
  );
}
