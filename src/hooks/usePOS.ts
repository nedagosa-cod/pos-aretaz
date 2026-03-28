import { useState, useEffect, useMemo } from "react";
import type { Arepa, Order } from "../types";

export function usePOS() {
  const [products, setProducts] = useState<Arepa[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [currentSelection, setCurrentSelection] = useState<Arepa[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [selectedActiveOrder, setSelectedActiveOrder] = useState<Order | null>(null);
  const [orderCounter, setOrderCounter] = useState(1);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState("Arepas");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isAllOrdersModalOpen, setIsAllOrdersModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amountReceived, setAmountReceived] = useState("");

  // Obtener productos desde Google Sheets
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl) {
          throw new Error("No URL configured");
        }
        const response = await fetch(scriptUrl);
        const data = await response.json();
        
        if (data.status === "error") {
          throw new Error(data.message || "Error al cargar");
        }
        
        setProducts(data);
        setProductsError(null);
      } catch (err: any) {
        console.error("Error obteniendo productos:", err);
        setProductsError("Error al cargar el menú. Verifica la conexión o la configuración de Sheets.");
        // Si quisieramos un fallback, lo pondríamos aquí
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized filters to prevent unnecessary recalculations
  const segmentProducts = useMemo(() => {
    return products.filter((item) => (item.segment || "Arepas") === selectedSegment);
  }, [products, selectedSegment]);

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

  const completeOrder = (method: string = 'Efectivo') => {
    if (!selectedActiveOrder) return;
    
    // Guardamos la referencia de la orden y le adjuntamos el método de pago
    const orderToSubmit = { ...selectedActiveOrder, paymentMethod: method };
    
    // Actualizamos la UI inmediatamente sin esperar por la red
    setActiveOrders(prev => prev.filter(o => o.id !== selectedActiveOrder.id));
    setSelectedActiveOrder(null);

    // Enviamos los datos a Google Sheets de manera asíncrona
    const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (scriptUrl) {
      fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(orderToSubmit),
      }).catch(err => {
        console.error("Error registrando venta en Google Sheets:", err);
      });
    }
  };

  const cancelOrder = () => {
    if (!selectedActiveOrder) return;
    // Logica futura para eliminar de DB
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
      isAllOrdersModalOpen,
      customerName,
      amountReceived,
      segmentProducts,
      categories,
      activeTotal,
      isLoadingProducts,
      productsError
    },
    actions: {
      setSelectedCategory,
      setSelectedSegment,
      setCustomerName,
      setIsNameModalOpen,
      setIsAllOrdersModalOpen,
      setAmountReceived,
      setSelectedActiveOrder,
      addToSelection,
      removeFromSelection,
      handleCreateOrderClick,
      finalizeCreateOrder,
      openOrderPayment,
      completeOrder,
      cancelOrder
    }
  };
}
