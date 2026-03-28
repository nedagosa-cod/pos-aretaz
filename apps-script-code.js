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
// 2. ENVIAR EL CATÁLOGO DE PRODUCTOS A LA APP PARA LEER DE "PRODUCTOS"
// ------------------------------------------------------------------------------
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Productos');
    
    // Obtenemos todos los datos de la hoja "Productos"
    var data = sheet.getDataRange().getValues();
    var products = [];
    
    // Empezamos desde la segunda fila (i = 1), asumiendo que la fila 1 (índice 0) es de Encabezados
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        
        // Si no hay ID en la primera columna, saltamos la fila por precaución
        if (!row[0] || row[0] === "") continue; 
        
        products.push({
            id: row[0].toString(),       // Columna A: ID
            name: row[1],                // Columna B: Nombre
            description: row[2],         // Columna C: Descripción
            price: Number(row[3]),       // Columna D: Precio
            category: row[4],            // Columna E: Categoría
            segment: row[5] || "Arepas"  // Columna F: Segmento (Bebidas, Fritos, Arepas)
        });
    }

    // Retornamos la lista de productos
    return ContentService.createTextOutput(JSON.stringify(products))
        .setMimeType(ContentService.MimeType.JSON);
        
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
