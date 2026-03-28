import { useState, useEffect, useMemo } from "react";
import { X, TrendingUp, ShoppingBag, Banknote, Smartphone, RefreshCw, ChevronDown } from "lucide-react";
import type { SaleRecord } from "../../types";

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string;

// ---------- helpers ----------------------------------------------------------
function parseFecha(raw: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function formatCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

// ---------- component --------------------------------------------------------
export function DashboardModal({ isOpen, setIsOpen }: Props) {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filterMethod, setFilterMethod] = useState<"Todos" | "Efectivo" | "Transferencia">("Todos");
  const [filterPeriod, setFilterPeriod] = useState<"hoy" | "semana" | "mes" | "todo">("hoy");

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${SCRIPT_URL}?action=ventas`);
      const data = await res.json();
      if (data.status === "error") throw new Error(data.message);
      setSales(data);
    } catch (e: any) {
      setError("No se pudieron cargar las ventas. Verifica el Apps Script.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchSales();
  }, [isOpen]);

  // ---------- filtrado -------------------------------------------------------
  const filteredSales = useMemo(() => {
    const now = new Date();
    return sales.filter((s) => {
      // Método de pago
      if (filterMethod !== "Todos" && s.metodoPago !== filterMethod) return false;

      // Período
      const fecha = parseFecha(s.fecha);
      if (!fecha) return true;

      if (filterPeriod === "hoy") {
        return fecha.toDateString() === now.toDateString();
      }
      if (filterPeriod === "semana") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return fecha >= startOfWeek;
      }
      if (filterPeriod === "mes") {
        return (
          fecha.getMonth() === now.getMonth() &&
          fecha.getFullYear() === now.getFullYear()
        );
      }
      return true; // 'todo'
    });
  }, [sales, filterMethod, filterPeriod]);

  // ---------- métricas -------------------------------------------------------
  const totalVentas = filteredSales.reduce((s, r) => s + r.total, 0);
  const totalEfectivo = filteredSales
    .filter((r) => r.metodoPago === "Efectivo")
    .reduce((s, r) => s + r.total, 0);
  const totalTransferencia = filteredSales
    .filter((r) => r.metodoPago === "Transferencia")
    .reduce((s, r) => s + r.total, 0);
  const cantidadPedidos = filteredSales.length;

  const periodoLabels: Record<string, string> = {
    hoy: "Hoy",
    semana: "Esta semana",
    mes: "Este mes",
    todo: "Historial completo",
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-neutral-900/50 backdrop-blur-sm flex items-end justify-center">
      <div className="bg-[#FAFAFA] w-full max-h-[93vh] rounded-t-3xl border-t border-neutral-200 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-full duration-300">

        {/* ---- Header ---- */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-none">
          <div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">Dashboard</h2>
            <p className="text-xs font-semibold text-neutral-400 mt-0.5">Reporte de ventas · {periodoLabels[filterPeriod]}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSales}
              disabled={isLoading}
              title="Actualizar datos"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-neutral-500 hover:bg-stone-200 transition-all active:scale-90 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-neutral-500 hover:bg-stone-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---- Filtros ---- */}
        <div className="px-6 pb-4 flex-none space-y-2.5">
          {/* Período */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {(["hoy", "semana", "mes", "todo"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPeriod(p)}
                className={`flex-none px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  filterPeriod === p
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-brand-primary/40"
                }`}
              >
                {periodoLabels[p]}
              </button>
            ))}
          </div>

          {/* Método de pago */}
          <div className="flex gap-2">
            {(["Todos", "Efectivo", "Transferencia"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMethod(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filterMethod === m
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {m === "Efectivo" && <Banknote className="w-3.5 h-3.5" />}
                {m === "Transferencia" && <Smartphone className="w-3.5 h-3.5" />}
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Métricas ---- */}
        {!isLoading && !error && (
          <div className="px-6 pb-4 flex-none grid grid-cols-2 gap-3">
            {/* Total Vendido */}
            <div className="col-span-2 bg-gradient-to-br from-brand-primary to-[#a3383c] rounded-2xl p-4 text-white shadow-lg shadow-brand-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 opacity-80" />
                <span className="text-xs font-bold opacity-80 uppercase tracking-wider">Total Vendido</span>
              </div>
              <p className="text-3xl font-black tracking-tight">{formatCOP(totalVentas)}</p>
              <p className="text-xs opacity-70 mt-1 font-semibold">{cantidadPedidos} pedido{cantidadPedidos !== 1 ? "s" : ""} entregado{cantidadPedidos !== 1 ? "s" : ""}</p>
            </div>

            {/* Efectivo */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Banknote className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Efectivo</span>
              </div>
              <p className="text-xl font-black text-neutral-900">{formatCOP(totalEfectivo)}</p>
              <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                {filteredSales.filter((r) => r.metodoPago === "Efectivo").length} pedidos
              </p>
            </div>

            {/* Transferencia */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Transf.</span>
              </div>
              <p className="text-xl font-black text-neutral-900">{formatCOP(totalTransferencia)}</p>
              <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                {filteredSales.filter((r) => r.metodoPago === "Transferencia").length} pedidos
              </p>
            </div>
          </div>
        )}

        {/* ---- Contenido principal ---- */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-primary" />
              <p className="text-sm font-semibold text-neutral-400">Cargando ventas...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <p className="text-sm font-bold text-red-500">{error}</p>
              <button
                onClick={fetchSales}
                className="px-5 py-2 rounded-full bg-brand-primary text-white text-sm font-bold"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !error && filteredSales.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
              <ShoppingBag className="w-12 h-12 text-neutral-200" />
              <p className="font-bold text-neutral-400">Sin ventas en este período</p>
              <p className="text-xs text-neutral-300">Cambia el filtro de fecha o método de pago</p>
            </div>
          )}

          {!isLoading && !error && filteredSales.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1 mb-3">
                <ChevronDown className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Detalle — {filteredSales.length} registro{filteredSales.length !== 1 ? "s" : ""}
                </span>
              </div>
              {[...filteredSales].reverse().map((sale, idx) => {
                const fecha = parseFecha(sale.fecha);
                return (
                  <div
                    key={`${sale.id}-${idx}`}
                    className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex gap-3 items-start"
                  >
                    {/* Método badge */}
                    <div
                      className={`flex-none w-9 h-9 rounded-xl flex items-center justify-center ${
                        sale.metodoPago === "Transferencia"
                          ? "bg-blue-50 text-blue-500"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {sale.metodoPago === "Transferencia" ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Banknote className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-sm font-black text-neutral-800 truncate">
                          #{sale.id} {sale.cliente !== "N/A" ? `· ${sale.cliente}` : ""}
                        </span>
                        <span className="text-sm font-black text-brand-primary flex-none">
                          {formatCOP(sale.total)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium truncate mt-0.5">{sale.resumen}</p>
                      {fecha && (
                        <p className="text-[10px] text-neutral-300 font-semibold mt-1">
                          {fecha.toLocaleString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
