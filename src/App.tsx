import { usePOS } from "./hooks/usePOS";
import { TopOrdersBar } from "./components/layout/TopOrdersBar";
import { SegmentSwitcher } from "./components/layout/SegmentSwitcher";
import { MenuGrid } from "./components/menu/MenuGrid";
import { BottomActionCart } from "./components/cart/BottomActionCart";
import { PaymentModal } from "./components/modals/PaymentModal";
import { CustomerNameModal } from "./components/modals/CustomerNameModal";
import { AllOrdersModal } from "./components/modals/AllOrdersModal";
import { DashboardModal } from "./components/modals/DashboardModal";
import { Loader2, AlertCircle } from "lucide-react";

export default function App() {
  const { state, actions } = usePOS();

  return (
    <div className="flex justify-center h-screen max-h-screen bg-neutral-900 text-neutral-800 font-sans selection:bg-brand-secondary/30 overflow-hidden">
      <div className="w-full max-w-md bg-[#FAFAFA] shadow-2xl flex flex-col relative overflow-hidden">
        {state.isLoadingProducts ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
            <h2 className="text-xl font-bold font-title">Cargando menú...</h2>
            <p className="text-sm font-medium text-neutral-400">Sincronizando con Google Sheets</p>
          </div>
        ) : state.productsError ? (
          <div className="flex flex-col items-center justify-center flex-1 p-8 space-y-4 text-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-bold text-red-600 font-title">Error de Conexión</h2>
            <p className="text-neutral-600">{state.productsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 mt-4 font-bold text-white rounded-full bg-brand-primary"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <TopOrdersBar 
              activeOrders={state.activeOrders} 
              currentTime={state.currentTime} 
              openOrderPayment={actions.openOrderPayment} 
              openAllOrders={() => actions.setIsAllOrdersModalOpen(true)}
              openDashboard={() => actions.setIsDashboardOpen(true)}
            />

            <SegmentSwitcher 
              selectedSegment={state.selectedSegment} 
              setSelectedSegment={actions.setSelectedSegment} 
              setSelectedCategory={actions.setSelectedCategory} 
            />

            <MenuGrid 
              selectedCategory={state.selectedCategory} 
              setSelectedCategory={actions.setSelectedCategory} 
              categories={state.categories} 
              segmentProducts={state.segmentProducts} 
              addToSelection={actions.addToSelection} 
            />

            <BottomActionCart 
              currentSelection={state.currentSelection} 
              activeTotal={state.activeTotal} 
              removeFromSelection={actions.removeFromSelection} 
              handleCreateOrderClick={actions.handleCreateOrderClick} 
            />

            <PaymentModal 
              selectedActiveOrder={state.selectedActiveOrder} 
              amountReceived={state.amountReceived} 
              setAmountReceived={actions.setAmountReceived} 
              setSelectedActiveOrder={actions.setSelectedActiveOrder} 
              completeOrder={actions.completeOrder} 
              cancelOrder={actions.cancelOrder}
            />

            <CustomerNameModal 
              isNameModalOpen={state.isNameModalOpen} 
              setIsNameModalOpen={actions.setIsNameModalOpen} 
              customerName={state.customerName} 
              setCustomerName={actions.setCustomerName} 
              orderCounter={state.orderCounter} 
              finalizeCreateOrder={actions.finalizeCreateOrder} 
            />

            <AllOrdersModal
              isOpen={state.isAllOrdersModalOpen}
              setIsOpen={actions.setIsAllOrdersModalOpen}
              activeOrders={state.activeOrders}
              currentTime={state.currentTime}
              openOrderPayment={actions.openOrderPayment}
            />

            <DashboardModal
              isOpen={state.isDashboardOpen}
              setIsOpen={actions.setIsDashboardOpen}
            />
          </>
        )}

      </div>
    </div>
  );
}
