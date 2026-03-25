import { usePOS } from "./hooks/usePOS";
import { TopOrdersBar } from "./components/layout/TopOrdersBar";
import { SegmentSwitcher } from "./components/layout/SegmentSwitcher";
import { MenuGrid } from "./components/menu/MenuGrid";
import { BottomActionCart } from "./components/cart/BottomActionCart";
import { PaymentModal } from "./components/modals/PaymentModal";
import { CustomerNameModal } from "./components/modals/CustomerNameModal";

export default function App() {
  const { state, actions } = usePOS();

  return (
    <div className="flex justify-center h-screen max-h-screen bg-neutral-900 text-neutral-800 font-sans selection:bg-brand-secondary/30 overflow-hidden">
      <div className="w-full max-w-md bg-[#FAFAFA] shadow-2xl flex flex-col relative overflow-hidden">
        
        <TopOrdersBar 
          activeOrders={state.activeOrders} 
          currentTime={state.currentTime} 
          openOrderPayment={actions.openOrderPayment} 
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
        />

        <CustomerNameModal 
          isNameModalOpen={state.isNameModalOpen} 
          setIsNameModalOpen={actions.setIsNameModalOpen} 
          customerName={state.customerName} 
          setCustomerName={actions.setCustomerName} 
          orderCounter={state.orderCounter} 
          finalizeCreateOrder={actions.finalizeCreateOrder} 
        />

      </div>
    </div>
  );
}
