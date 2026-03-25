import { Button } from "@/components/ui/button";
import type { Order } from "../../types";

type Props = {
  selectedActiveOrder: Order | null;
  amountReceived: string;
  setAmountReceived: (val: string) => void;
  setSelectedActiveOrder: (order: Order | null) => void;
  completeOrder: () => void;
};

export function PaymentModal({ selectedActiveOrder, amountReceived, setAmountReceived, setSelectedActiveOrder, completeOrder }: Props) {
  if (!selectedActiveOrder) return null;

  return (
    <div className="absolute inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-end justify-center">
      <div className="bg-white w-full max-h-[85vh] rounded-t-3xl border-t border-neutral-200 p-6 flex flex-col gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black tracking-tight text-neutral-900">
            Pedido <span className="text-brand-primary">#{selectedActiveOrder.id} {selectedActiveOrder.name ? `(${selectedActiveOrder.name})` : ""}</span>
          </h2>
          <button onClick={() => setSelectedActiveOrder(null)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-stone-200 transition-colors font-bold">✕</button>
        </div>

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
  );
}
