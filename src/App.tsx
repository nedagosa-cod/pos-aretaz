import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Arepa = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  segment?: string;
};

type Order = {
  id: number;
  items: Arepa[];
  total: number;
  createdAt: number;
  name?: string;
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

  // --- Segmento: Bebidas ---
  { id: "b1", name: "Coca-Cola", description: "Bebida gaseosa tradicional bien fría.", price: 4000, category: "Gaseosas", segment: "Bebidas" },
  { id: "b2", name: "Manzana Postobón", description: "Bebida gaseosa sabor manzana.", price: 3500, category: "Gaseosas", segment: "Bebidas" },
  { id: "b3", name: "Colombiana Postobón", description: "La nuestra, bebida gaseosa dulce.", price: 3500, category: "Gaseosas", segment: "Bebidas" },
  { id: "b4", name: "Uva Postobón", description: "Bebida gaseosa sabor uva.", price: 3500, category: "Gaseosas", segment: "Bebidas" },

  // --- Segmento: Fritos ---
  { id: "f1", name: "Empanada Mixta", description: "Crujiente empanada rellena de pollo y carne.", price: 3500, category: "Empanadas", segment: "Fritos" },
  { id: "f2", name: "Flauta Pollo Queso", description: "Rollo frito crujiente con pollo y doble queso.", price: 4500, category: "Flautas", segment: "Fritos" },
  { id: "f3", name: "Flauta Hawaiana", description: "Rollo crujiente de jamón, queso y dulce de piña.", price: 4500, category: "Flautas", segment: "Fritos" },
  { id: "f4", name: "Papa Rellena Tradicional", description: "Papa rellena al estilo costeño con carne.", price: 5000, category: "Papas Rellenas", segment: "Fritos" },
];

export default function App() {
  const [currentSelection, setCurrentSelection] = useState<Arepa[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<Order | null>(null);
  const [orderCounter, setOrderCounter] = useState(1);
  const [amountReceived, setAmountReceived] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState("Arepas");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const segments = [
    { id: "Arepas", icon: "🫓" },
    { id: "Bebidas", icon: "🥤" },
    { id: "Fritos", icon: "🥟" }
  ];

  const segmentProducts = arepasData.filter((item: any) => (item.segment || "Arepas") === selectedSegment);
  const categories = Array.from(new Set(segmentProducts.map((a: any) => a.category)));

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

  const addToSelection = (arepa: Arepa) => {
    setCurrentSelection([...currentSelection, arepa]);
  };

  const removeFromSelection = (indexToRemove: number) => {
    setCurrentSelection(currentSelection.filter((_, idx) => idx !== indexToRemove));
  };

  const activeTotal = currentSelection.reduce((sum, item) => sum + item.price, 0);

  const handleCreateOrderClick = () => {
    if (currentSelection.length === 0) return;
    setCustomerName("");
    setIsNameModalOpen(true);
  };

  const finalizeCreateOrder = () => {
    const newOrder: Order = {
      id: orderCounter,
      name: customerName.trim() ? customerName.substring(0, 10).trim() : undefined,
      items: [...currentSelection],
      total: activeTotal,
      createdAt: Date.now()
    };

    setActiveOrders([...activeOrders, newOrder]);
    setCurrentSelection([]);
    setOrderCounter(orderCounter + 1);
    setIsNameModalOpen(false);
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
    <div className="flex justify-center h-screen max-h-screen bg-neutral-900 text-neutral-800 font-sans selection:bg-brand-secondary/30 overflow-hidden">
      <div className="w-full max-w-md bg-[#FAFAFA] shadow-2xl flex flex-col relative overflow-hidden">

        {/* Top Section: Active Orders (Etiquetas de los pedidos) */}
        <div className="bg-gradient-to-br from-[#A63338] to-brand-primary px-4 pt-5 pb-5 min-h-[115px] flex-none flex flex-col justify-end shadow-[0_4px_20px_rgba(186,65,70,0.4)] relative z-20">
          <div className="absolute top-3 left-4">
             <h1 className="text-white/90 font-black tracking-tighter text-lg leading-none">AretazCash</h1>
          </div>
          {activeOrders.length > 0 ? (
            <div className="flex overflow-x-auto gap-3 scrollbar-hide items-end mt-4">
              {activeOrders.map((order) => {
                const isLate = (currentTime - order.createdAt) > 600000; // 10 minutes turns red
                return (
                  <div 
                    key={order.id} 
                    className="relative flex-none w-[72px] h-[95px] bg-[#FFFbf5] border border-white/60 flex flex-col items-center justify-start pt-2 cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all animate-in zoom-in-90 duration-300"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)"
                    }}
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
            <div className="h-[85px] mt-4 flex items-center justify-center border-2 border-dashed border-white/30 rounded-xl bg-black/10">
              <span className="text-xs text-white/70 font-bold uppercase tracking-widest px-4 text-center">Sin Pedidos Activos</span>
            </div>
          )}
        </div>

        {/* Banner Segment Switcher (Círculos) */}
        <div className="bg-white py-3 px-4 flex justify-center gap-6 overflow-x-auto scrollbar-hide shrink-0 shadow-sm z-10 w-full overflow-hidden">
          {segments.map(seg => (
            <button 
              key={seg.id}
              onClick={() => { setSelectedSegment(seg.id); setSelectedCategory(null); }}
              className="flex items-center justify-center group transition-all"
              title={seg.id}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all shadow-sm ${selectedSegment === seg.id ? "bg-brand-secondary text-neutral-900 scale-110 shadow-[0_4px_12px_rgba(202,168,78,0.4)] ring-4 ring-brand-secondary/20" : "bg-[#FFF4E0] text-[#D49826] hover:bg-[#FCE6BD] hover:text-[#B57C15] group-hover:-translate-y-1"}`}>
                {seg.icon}
              </div>
            </button>
          ))}
        </div>

        {/* Middle Section: Scrollable Arepas List */}
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
                {segmentProducts.filter((a: any) => a.category === selectedCategory).map((item: any) => (
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
               <section key={category as string} className="space-y-4 animate-in fade-in duration-300">
                  <div 
                    className="flex justify-between items-center cursor-pointer group mb-2"
                    onClick={() => setSelectedCategory(category as string)}
                  >
                    <span className="bg-[#FFF4E0] text-[#B57C15] px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase shadow-sm group-hover:bg-brand-secondary group-hover:text-white transition-colors">
                      {category as string}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-bold normal-case flex items-center gap-1 group-hover:text-brand-primary transition-colors">
                      Ver todas <span className="text-[10px]">➔</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {segmentProducts.filter((a: any) => a.category === category).map((item: any) => (
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
              onClick={handleCreateOrderClick}
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
                <h2 className="text-xl font-black tracking-tight text-neutral-900">
                  Pedido <span className="text-brand-primary">#{selectedActiveOrder.id} {selectedActiveOrder.name ? `(${selectedActiveOrder.name})` : ""}</span>
                </h2>
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

        {/* Name Input Modal */}
        {isNameModalOpen && (
          <div className="absolute inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white w-full max-h-[85vh] rounded-t-3xl border-t border-neutral-200 p-6 flex flex-col gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black tracking-tight text-neutral-900">Nombre del Cliente</h2>
                <button onClick={() => setIsNameModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-stone-200 transition-colors font-bold">✕</button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-medium text-neutral-600">
                  Asigna un identificador. Si lo dejas en blanco, el pedido será <strong>P#{orderCounter}</strong>.
                </p>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Juan, Mesa 4, Auto Rojo..."
                  className="w-full bg-stone-50 border border-brand-tertiary rounded-lg px-4 py-3 text-neutral-900 text-lg font-black outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") finalizeCreateOrder();
                  }}
                />
              </div>

              <Button 
                onClick={finalizeCreateOrder}
                className="w-full bg-brand-primary hover:bg-[#a3383c] text-white rounded-xl shadow-[0_4px_14px_0_rgba(186,65,70,0.3)] text-base h-12 font-bold border-none transition-all active:scale-95 mt-2"
              >
                Confirmar y Crear Pedido
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
