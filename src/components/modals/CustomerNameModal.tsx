import { Button } from "@/components/ui/button";

type Props = {
  isNameModalOpen: boolean;
  setIsNameModalOpen: (val: boolean) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  orderCounter: number;
  finalizeCreateOrder: () => void;
};

export function CustomerNameModal({ isNameModalOpen, setIsNameModalOpen, customerName, setCustomerName, orderCounter, finalizeCreateOrder }: Props) {
  if (!isNameModalOpen) return null;

  return (
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
  );
}
