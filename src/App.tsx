import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Arepa = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

type Order = {
  id: number;
  items: Arepa[];
  total: number;
  createdAt: number;
};

const arepasData: Arepa[] = [
  // Sencilla
  { id: "1", name: "Pollo", description: "Rellena de pollo.", price: 9000, category: "Sencilla" },
  { id: "2", name: "Carne", description: "Rellena de carne.", price: 9000, category: "Sencilla" },

  // Combinada
  { id: "3", name: "Combinada 1", description: "Pollo, Carne.", price: 10000, category: "Combinada" },
  { id: "4", name: "Combinada 2", description: "Pollo, Cábano.", price: 10000, category: "Combinada" },
  { id: "5", name: "Combinada 3", description: "Carne, Cábano.", price: 10000, category: "Combinada" },

  // Mixta
  { id: "6", name: "Mixta 1", description: "Pollo, Carne, Cábano.", price: 11000, category: "Mixta" },
  { id: "7", name: "Mixta 2", description: "Pollo, Carne, Chorizo.", price: 11000, category: "Mixta" },
  { id: "8", name: "Mixta 3", description: "Carne, Cábano, Tocineta.", price: 11000, category: "Mixta" },

  // Super
  { id: "9", name: "Súper 1", description: "Pollo, Carne, Cábano, Jamón de Cordero.", price: 12000, category: "Súper" },
  { id: "10", name: "Súper 2", description: "Pollo, Carne, Chorizo, Tocineta.", price: 12000, category: "Súper" },

  // Super Mixta
  { id: "11", name: "Súper Mixta 1", description: "Pollo, Carne, Cábano, Maíz, Jamón de Cordero.", price: 13000, category: "Súper Mixta" },
  { id: "12", name: "Súper Mixta 2", description: "Pollo, Chorizo, Maíz, Maduro, Tocineta.", price: 13000, category: "Súper Mixta" },

  // Especial
  { id: "13", name: "La Especial Aretaz", description: "Con Todo: Pollo, Carne, Cábano, Chorizo, Tocineta, Maíz, Jamón, Maduro.", price: 15000, category: "Especial" },
];

export default function App() {
  const [currentSelection, setCurrentSelection] = useState<Arepa[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<Order | null>(null);
  const [orderCounter, setOrderCounter] = useState(1);
  const [amountReceived, setAmountReceived] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (activeOrders.length === 0) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeOrders.length]);

  const formatTimeElapsed = (startTime: number) => {
    const diff = currentTime - startTime;
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const categories = Array.from(new Set(arepasData.map(a => a.category)));

  const addToSelection = (arepa: Arepa) => {
    setCurrentSelection([...currentSelection, arepa]);
  };

  const removeFromSelection = (indexToRemove: number) => {
    setCurrentSelection(currentSelection.filter((_, idx) => idx !== indexToRemove));
  };

  const activeTotal = currentSelection.reduce((sum, item) => sum + item.price, 0);

  const handleCreateOrder = () => {
    if (currentSelection.length === 0) return;
    const newOrder: Order = {
      id: orderCounter,
      items: [...currentSelection],
      total: activeTotal,
      createdAt: Date.now()
    };

    setActiveOrders([...activeOrders, newOrder]);
    setCurrentSelection([]);
    setOrderCounter(orderCounter + 1);
  };

  const openOrderPayment = (order: Order) => {
    setSelectedActiveOrder(order);
    setAmountReceived("");
  };

  const completeOrder = () => {
    if (!selectedActiveOrder) return;
    setActiveOrders(activeOrders.filter(o => o.id !== selectedActiveOrder.id));
    setSelectedActiveOrder(null);
  };

  return (
    <div className="flex justify-center h-screen max-h-screen bg-stone-100 text-neutral-800 font-sans selection:bg-brand-secondary/30 overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col relative border-x border-neutral-200/60">

        {/* Navbar */}
        <header className="z-20 bg-white border-b border-brand-tertiary px-6 py-4 flex flex-none items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-brand-primary">
              AretazCash
            </h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-tertiary/40 border border-brand-tertiary flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-brand-primary tracking-wider">AC</span>
          </div>
        </header>

        {/* Top Section: Active Orders (Etiquetas de los pedidos) */}
        <div className="bg-stone-50 border-b border-neutral-200 px-4 pt-2 pb-3 min-h-[105px] flex-none flex flex-col justify-end shadow-inner">
          {activeOrders.length > 0 ? (
            <div className="flex overflow-x-auto gap-2 scrollbar-hide items-end">
              {activeOrders.map((order) => {
                const isLate = (currentTime - order.createdAt) > 600000; // 10 minutes turns red
                return (
                  <div
                    key={order.id}
                    className="relative flex-none w-[68px] h-[90px] bg-gradient-to-b from-brand-secondary/20 to-white border-x border-t border-brand-secondary/30 flex flex-col items-center justify-start pt-1.5 cursor-pointer group shadow-sm hover:from-brand-secondary/30 hover:to-brand-secondary/5 transition-all animate-in zoom-in-90 duration-300"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)"
                    }}
                    onClick={() => openOrderPayment(order)}
                    title={`Ver y cobrar Pedido #${order.id}`}
                  >
                    <span className="text-[11px] font-bold text-brand-primary text-center leading-none px-1 uppercase mb-0.5">
                      P#{order.id}
                    </span>
                    <span className={`text-[12px] font-black tracking-tighter leading-none mb-1 ${isLate ? "text-red-500 animate-pulse" : "text-brand-secondary"}`}>
                      {formatTimeElapsed(order.createdAt)}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-bold mt-0.5 font-mono">
                      {order.items.length} arp
                    </span>
                  </div>
                );
              })}
              <div className="min-w-[4px] h-full"></div>
            </div>
          ) : (
            <div className="h-[80px] flex items-center justify-center border-2 border-dashed border-brand-tertiary/60 rounded-lg bg-white">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Sin Pedidos Activos</span>
            </div>
          )}
        </div>

        {/* Middle Section: Scrollable Arepas List */}
        <main className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-white">
          {selectedCategory ? (
            <section className="space-y-4 animate-in slide-in-from-right-4 duration-300 pb-4">
              <div className="flex items-center gap-3 border-b border-brand-tertiary/70 pb-3 sticky top-0 bg-white z-10 pt-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-neutral-600 hover:text-white hover:bg-brand-primary transition-all font-bold shadow-sm active:scale-90"
                >
                  ←
                </button>
                <h2 className="text-brand-primary font-black text-lg tracking-wide uppercase">{selectedCategory}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {arepasData.filter(a => a.category === selectedCategory).map((item) => (
                  <Card
                    key={item.id}
                    className="bg-white border-brand-tertiary/80 hover:border-brand-primary/40 hover:bg-brand-primary/5 shadow-md hover:shadow-lg transition-all flex flex-col cursor-pointer active:scale-95"
                    onClick={() => addToSelection(item)}
                  >
                    <div className="p-4 pb-2 flex justify-between items-start gap-4">
                      <span className="text-base text-neutral-900 font-black leading-tight">{item.name}</span>
                      <span className="text-base font-black text-brand-secondary shrink-0">${item.price.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="px-4 pb-4 mt-auto">
                      <span className="text-xs text-neutral-500 line-clamp-3 leading-snug font-medium pr-10">{item.description}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ) : (
            categories.map(category => (
              <section key={category} className="space-y-4 animate-in fade-in duration-300">
                <h2
                  className="text-brand-secondary font-black text-sm tracking-wide border-b border-brand-tertiary/70 pb-1 uppercase cursor-pointer hover:text-brand-primary transition-colors flex justify-between items-end group"
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category}</span>
                  <span className="text-[11px] text-neutral-400 font-bold normal-case flex items-center gap-1 group-hover:text-brand-primary transition-colors">
                    Ver todas <span className="text-[10px]">➔</span>
                  </span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {arepasData.filter(a => a.category === category).map((item) => (
                    <Card
                      key={item.id}
                      className="bg-white border-brand-tertiary/80 hover:border-brand-primary/40 hover:bg-brand-primary/5 shadow-sm transition-all flex flex-col cursor-pointer active:scale-95"
                      onClick={() => addToSelection(item)}
                    >
                      <div className="p-3 pb-1 flex justify-between items-start gap-2">
                        <span className="text-sm text-neutral-800 font-bold leading-tight">{item.name}</span>
                        <span className="text-sm font-black text-brand-secondary shrink-0">${item.price.toLocaleString("es-CO")}</span>
                      </div>
                      <div className="px-3 pb-3 mt-auto">
                        <span className="text-[10px] text-neutral-500 line-clamp-2 leading-tight font-medium">{item.description}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>

        {/* Bottom Section: Current Selection & Create Order (Always Visible) */}
        <div className="flex-none bg-white border-t border-brand-tertiary/60 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          {/* Selected Arepas List */}
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

          {/* Subtotal and Checkout Button */}
          <div className="px-5 py-4 pb-safe flex items-center justify-between bg-white">
            <div className="flex flex-col">
              <span className="text-[11px] text-neutral-500 font-bold tracking-wide uppercase">
                {currentSelection.length} {currentSelection.length === 1 ? 'arepa' : 'arepas'}
              </span>
              <span className="text-xl font-black text-brand-primary leading-none mt-0.5">${activeTotal.toLocaleString("es-CO")}</span>
            </div>
            <Button
              onClick={handleCreateOrder}
              disabled={currentSelection.length === 0}
              className="bg-brand-primary hover:bg-[#a3383c] text-white rounded-xl shadow-[0_4px_14px_0_rgba(186,65,70,0.25)] text-sm h-11 px-6 font-bold border-none transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              Crear Pedido
            </Button>
          </div>
        </div>

        {/* Payment & Delivery Modal (Popup sobre etiqueta) */}
        {selectedActiveOrder && (
          <div className="absolute inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full max-h-[85vh] rounded-t-3xl border-t border-neutral-200 p-6 flex flex-col gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black tracking-tight text-neutral-900">Pedido <span className="text-brand-primary">#{selectedActiveOrder.id}</span></h2>
                <button onClick={() => setSelectedActiveOrder(null)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-stone-200 transition-colors font-bold">✕</button>
              </div>

              {/* Order List */}
              <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                {selectedActiveOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-neutral-100 pb-2">
                    <span className="text-neutral-700 text-sm font-bold">{item.name}</span>
                    <span className="text-brand-secondary font-bold text-sm">${item.price.toLocaleString("es-CO")}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-brand-tertiary">
                <span className="text-neutral-900 font-black text-lg">Total a Pagar</span>
                <span className="text-2xl text-brand-primary font-black">${selectedActiveOrder.total.toLocaleString("es-CO")}</span>
              </div>

              {/* Payment Calculator */}
              <div className="space-y-4 bg-stone-50 p-4 rounded-xl border border-brand-tertiary shadow-inner">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-600">Efectivo Recibido ($)</label>
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="Ej. 50000"
                    className="w-full bg-white border border-brand-tertiary rounded-lg px-4 py-3 text-neutral-900 text-lg font-black outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
                  />
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-brand-tertiary shadow-sm">
                  <span className="text-sm font-bold text-neutral-600">Vueltas (Cambio):</span>
                  <span className={`text-xl font-black ${parseFloat(amountReceived || "0") >= selectedActiveOrder.total ? "text-green-600" : "text-brand-primary"}`}>
                    ${Math.max(0, parseFloat(amountReceived || "0") - selectedActiveOrder.total).toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              <Button
                onClick={completeOrder}
                disabled={parseFloat(amountReceived || "0") < selectedActiveOrder.total}
                className="w-full bg-brand-primary hover:bg-[#a3383c] text-white rounded-xl shadow-[0_4px_14px_0_rgba(186,65,70,0.3)] text-base h-12 font-bold border-none transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none mt-2"
              >
                Pedido Entregado
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
