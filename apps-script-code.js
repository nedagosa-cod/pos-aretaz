// ==============================================================================
// CÓDIGO GOOGLE APPS SCRIPT PARA ARETAZCASH
// ==============================================================================
// INSTRUCCIONES:
// 1. Usa Ctrl + A para seleccionar todo este texto y Ctrl + C para copiarlo.
// 2. Pégalo en tu editor de Apps Script reemplazando TODO lo que haya ahí.
// 3. Dale al botón de Guardar.
// 4. Ve a Administrar Implementaciones > Editar (Lápiz) > Versión: Nueva versión > Implementar.
// ==============================================================================

var SPREADSHEET_ID = '1HOqxXJShwS9pvAoHfYS4vQb9HwUQfWyeVhSqgriTyo8';

// ------------------------------------------------------------------------------
// 1. RECIBIR PEDIDOS NUEVOS Y GUARDARLOS EN "VENTAS"
// ------------------------------------------------------------------------------
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Ventas');
    
    // Convertimos la información que envía la app a un objeto entendible
    var params = JSON.parse(e.postData.contents);
    
    // Resumimos todos los productos que el cliente compró (Columna D)
    var itemsResumen = params.items.map(function(item) {
      return item.name + " (" + item.category + ") - $" + item.price;
    }).join(", ");

    // Columna B: Fecha en la que se creó la orden
    var fechaActual = new Date(params.createdAt);
    
    // PREPARAMOS LAS COLUMNAS PARA "VENTAS" EXACTAMENTE COMO LAS PEDISTE
    var rowData = [
      params.id,                            // Columna A: ID
      fechaActual,                          // Columna B: Fecha y Hora
      params.name || "N/A",                 // Columna C: Cliente
      itemsResumen,                         // Columna D: Resumen de productos
      params.total,                         // Columna E: Total pagado
      params.paymentMethod || "Efectivo"    // Columna F: Método de Pago (NO OLVIDES PONERLE TÍTULO A LA COLUMNA F)
    ];
    
    // Insertamos la fila al final de todo
    sheet.appendRow(rowData);
    
    // Le informamos a la app que todo salió bien
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Si hay error, le avisamos a la app
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ------------------------------------------------------------------------------
// 2. ENVIAR DATOS A LA APP (PRODUCTOS O VENTAS) SEGÚN EL PARÁMETRO ?action=
// ------------------------------------------------------------------------------
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'productos';

  if (action === 'ventas') {
    return getVentas();
  } else {
    return getProductos();
  }
}

// --- Lee el catálogo de la hoja "Productos" ---
function getProductos() {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Productos');
    var data = sheet.getDataRange().getValues();
    var products = [];

    // Fila 0 es encabezado, empezamos desde i = 1
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row[0] || row[0] === "") continue;
        products.push({
            id: row[0].toString(),       // Columna A: ID
            name: row[1],                // Columna B: Nombre
            description: row[2],         // Columna C: Descripción
            price: Number(row[3]),       // Columna D: Precio
            category: row[4],            // Columna E: Categoría
            segment: row[5] || "Arepas"  // Columna F: Segmento
        });
    }

    return ContentService.createTextOutput(JSON.stringify(products))
        .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- Lee el historial de ventas de la hoja "Ventas" (para el Dashboard) ---
function getVentas() {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Ventas');
    var data = sheet.getDataRange().getValues();
    var ventas = [];

    // Fila 0 es encabezado, empezamos desde i = 1
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row[0] || row[0] === "") continue;
        ventas.push({
            id: row[0].toString(),          // Columna A: ID
            fecha: row[1].toString(),       // Columna B: Fecha y Hora
            cliente: row[2] || "N/A",      // Columna C: Cliente
            resumen: row[3] || "",         // Columna D: Resumen de productos
            total: Number(row[4]),          // Columna E: Total pagado
            metodoPago: row[5] || "Efectivo" // Columna F: Método de Pago
        });
    }

    return ContentService.createTextOutput(JSON.stringify(ventas))
        .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
