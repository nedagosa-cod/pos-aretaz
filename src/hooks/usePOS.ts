import { useState, useEffect, useMemo } from "react";
import type { Arepa, Order } from "../types";
import { arepasData } from "../data/products";

export function usePOS() {
  const [currentSelection, setCurrentSelection] = useState<Arepa[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<Order | null>(null);
  const [orderCounter, setOrderCounter] = useState(1);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState("Arepas");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amountReceived, setAmountReceived] = useState("");

  // Memoized filters to prevent unnecessary recalculations
  const segmentProducts = useMemo(() => {
    return arepasData.filter((item) => (item.segment || "Arepas") === selectedSegment);
  }, [selectedSegment]);

  const categories = useMemo(() => {
    return Array.from(new Set(segmentProducts.map(a => a.category)));
  }, [segmentProducts]);

  const activeTotal = useMemo(() => {
    return currentSelection.reduce((sum, item) => sum + item.price, 0);
  }, [currentSelection]);

  // Wait timer interval ticker
  useEffect(() => {
    if (activeOrders.length === 0) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeOrders.length]);

  const addToSelection = (arepa: Arepa) => {
    setCurrentSelection(prev => [...prev, arepa]);
  };

  const removeFromSelection = (index: number) => {
    setCurrentSelection(prev => prev.filter((_, idx) => idx !== index));
  };

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

    setActiveOrders(prev => [...prev, newOrder]);
    setCurrentSelection([]);
    setOrderCounter(prev => prev + 1);
    setIsNameModalOpen(false);
  };

  const openOrderPayment = (order: Order) => {
    setSelectedActiveOrder(order);
    setAmountReceived("");
  };

  const completeOrder = () => {
    if (!selectedActiveOrder) return;
    setActiveOrders(prev => prev.filter(o => o.id !== selectedActiveOrder.id));
    setSelectedActiveOrder(null);
  };

  return {
    state: {
      currentSelection,
      activeOrders,
      selectedActiveOrder,
      orderCounter,
      currentTime,
      selectedCategory,
      selectedSegment,
      isNameModalOpen,
      customerName,
      amountReceived,
      segmentProducts,
      categories,
      activeTotal
    },
    actions: {
      setSelectedCategory,
      setSelectedSegment,
      setCustomerName,
      setIsNameModalOpen,
      setAmountReceived,
      setSelectedActiveOrder,
      addToSelection,
      removeFromSelection,
      handleCreateOrderClick,
      finalizeCreateOrder,
      openOrderPayment,
      completeOrder
    }
  };
}
