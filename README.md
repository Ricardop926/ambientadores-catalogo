# 🌟 Catálogo de Aromas LightGel - NPstore

¡Bienvenido al catálogo digital de ambientadores **LightGel** de **NPstore**!  
Explora los aromas disponibles, elige el tipo y la cantidad, y realiza tu pedido fácilmente por WhatsApp.  
El proyecto está optimizado, desplegado y listo para ser usado desde cualquier dispositivo.

---

## 🚀 Demo en vivo

👉 [Ver catálogo en línea](https://ambientadores-catalogo.vercel.app)

---

## 🛠️ Stack tecnológico

Tecnologías utilizadas para construir y desplegar este proyecto:

<div align="left">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,vercel,js,html,css" />
</div>

---

## 📦 Funcionalidades principales

- ✅ Catálogo dinámico cargado desde una base de datos en [SheetDB.io](https://sheetdb.io)
- 🔍 Filtros por tipo y aroma
- 📦 Almacenamiento de productos seleccionados
- 🛒 Generación automática del resumen del pedido
- 📲 Envío directo del pedido a WhatsApp
- 📱 Diseño responsive con TailwindCSS

---

## 🧠 ¿Cómo se conecta la base de datos?

El catálogo consume una API REST expuesta por **SheetDB.io**, que está protegida mediante variables de entorno:

```env
VITE_SHEETDB_URL=https://sheetdb.io/api/v1/xxxxxxxxxxxxxxxxxxxxx
