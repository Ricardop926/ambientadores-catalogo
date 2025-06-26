import { useState, useRef, useEffect } from 'react';
import ProductoCard from './components/ProductoCard';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [lista, setLista] = useState([]);
  const [filtroAroma, setFiltroAroma] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [pedido, setPedido] = useState([]);
  
  // 🔥 Estados para filtros dinámicos
  const [aromasDisponibles, setAromasDisponibles] = useState([]);
  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  
  const resumenRef = useRef(null);
  // .env base de datos 
  const sheetUrl = import.meta.env.VITE_SHEETDB_URL;

  useEffect(() => {
    fetch(sheetUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("🟢 Datos recibidos:", data);
        
        const datosLimpios = data.map((p) => ({
          nombre: p.nombre || "NO NOMBRE",
          aroma: p.aroma || "NO AROMA",
          tipo: p.tipo || "NO TIPO",
          imagen: p.imagen || "https://via.placeholder.com/300x200?text=Sin+imagen"
        }));
        
        setLista(datosLimpios);
        
        // 🔥 Extraer aromas únicos dinámicamente
        const aromasUnicos = [...new Set(datosLimpios.map(p => p.nombre))].filter(a => a !== "NO AROMA");
        setAromasDisponibles(aromasUnicos);
        console.log("🌸 Aromas encontrados:", aromasUnicos);
        
        // 🔥 Extraer tipos únicos dinámicamente
        const tiposUnicos = [...new Set(datosLimpios.map(p => p.tipo))].filter(t => t !== "NO TIPO");
        setTiposDisponibles(tiposUnicos);
        console.log("📦 Tipos encontrados:", tiposUnicos);
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  // ➕ Agregar producto al pedido con cantidad específica
  const agregarAlPedido = (producto, cantidad) => {
    console.log("🔍 Agregando producto:", producto, "Cantidad:", cantidad); // Debug
    
    const existente = pedido.find(p => p.nombre === producto.nombre && p.aroma === producto.aroma);
    
    if (existente) {
      // Si ya existe, sumamos la nueva cantidad
      const actualizado = pedido.map(p =>
        p.nombre === producto.nombre && p.aroma === producto.aroma
          ? { ...p, cantidad: p.cantidad + cantidad }
          : p
      );
      setPedido(actualizado);
      console.log("✅ Producto actualizado, nueva cantidad:", existente.cantidad + cantidad);
    } else {
      // Si no existe, lo agregamos con la cantidad especificada
      const nuevoProducto = { ...producto, cantidad };
      setPedido([...pedido, nuevoProducto]);
      console.log("✅ Producto nuevo agregado con cantidad:", cantidad);
    }
    
    toast.success(`${cantidad} ${producto.nombre} agregado${cantidad > 1 ? 's' : ''} al pedido`);
    
    // 🔥 Auto-scroll hacia el resumen del pedido
    setTimeout(() => {
      if (resumenRef.current) {
        resumenRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100); // Pequeño delay para que el DOM se actualice
  };

  // ❌ Eliminar producto del pedido
  const eliminarDelPedido = (producto) => {
    const filtrado = pedido.filter(p => !(p.nombre === producto.nombre && p.aroma === producto.aroma));
    setPedido(filtrado);
    toast("Producto eliminado");
  };

  // 🔍 Filtro de productos
  const productosFiltrados = lista.filter(p => {
    return (
      (filtroAroma === "" || p.aroma.toLowerCase().includes(filtroAroma.toLowerCase())) &&
      (filtroTipo === "" || p.tipo.toLowerCase().includes(filtroTipo.toLowerCase()))
    );
  });

  // 🟢 Generar texto para WhatsApp
  const generarMensaje = () => {
    if (pedido.length === 0) return "";
    let detalle = pedido.map(p => `• ${p.nombre} x ${p.cantidad}`).join('\n');
    return `Hola, quiero pedir los siguientes ambientadores:\n\n${detalle}\n\nTotal: ${pedido.reduce((sum, p) => sum + p.cantidad, 0)} unidades, cuánto es el valor a pagar`;
  };

  const urlWhatsApp = `https://wa.me/573137873766?text=${encodeURIComponent(generarMensaje())}`;

  return (
   <div className="min-h-screen bg-gray-100 p-4">
  {/* Encabezado */}
  <div className="bg-gradient-to-br from-black via-gray-800 to-gray-600 py-16 px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
    <div className="max-w-5xl mx-auto text-center relative z-10">
      <div className="mb-10 flex justify-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-gray-500">
          <img
            src="/images/logo.png"
            alt="NPstore Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-100 pb-3 leading-relaxed"
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.7), 0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(192,192,192,0.2)'
        }}>
        Catálogo LightGel
      </h1>

      <p className="text-xl text-white mb-6">
        ¡Bienvenid@ al catálogo de aromas <span className="font-bold text-yellow-300">Lightgel</span> de <span className="font-bold text-yellow-300">NPstore</span>!
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-8 text-white">
        <div className="flex items-center gap-2"><span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">1</span> Explora</div>
        <div className="hidden md:block">→</div>
        <div className="flex items-center gap-2"><span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">2</span> Elige cantidad</div>
        <div className="hidden md:block">→</div>
        <div className="flex items-center gap-2"><span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">3</span> Pide por WhatsApp</div>
      </div>

      {/* 🔥 Sección de Redes Sociales */}
      <div className="mt-8 pt-6 border-t border-gray-500">
        <p className="text-lg text-white mb-4">
          📱 <span className="font-semibold">¡Síguenos en nuestras redes sociales!</span>
        </p>
        <div className="flex justify-center items-center gap-6">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/npstoreir?igsh=NHdndXZnZmM4NXc0" // Cambia por tu Instagram real
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-medium">Instagram</span>
          </a>

          

          {/* Facebook (opcional) */}
          <a
            href="https://www.facebook.com/share/1Uv4N5MmfQ/" // Cambia por tu Facebook real
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="font-medium">Facebook</span>
          </a>
        </div>
      </div>
    </div>
  </div>

      <Toaster position="top-right" />

      {/* 🔥 Filtros dinámicos */}
      <div className="flex flex-wrap gap-4 justify-center my-6">
        <select 
          onChange={e => setFiltroAroma(e.target.value)} 
          className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los aromas</option>
          {aromasDisponibles.map(nombre => (
            <option key={nombre} value={nombre}>{nombre}</option>
          ))}
        </select>

        <select 
          onChange={e => setFiltroTipo(e.target.value)} 
          className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los tipos</option>
          {tiposDisponibles.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {/* 🔥 Productos - Responsive mejorado */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {productosFiltrados.map((p, i) => (
          <ProductoCard key={i} {...p} onAgregar={agregarAlPedido} />
        ))}
      </div>

      {/* 🔥 Pedido con auto-scroll e Instagram */}
      {pedido.length > 0 && (
        <div 
          ref={resumenRef} 
          className="mt-10 text-center bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto border-2 border-green-200"
        >
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            🛒 Resumen del pedido:
          </h2>
          <ul className="text-left mb-4">
            {pedido.map((p, i) => (
              <li key={i} className="flex justify-between items-center mb-2 p-2 bg-green-50 rounded">
                <span>✅ {p.nombre} - {p.aroma} (x{p.cantidad})</span>
                <button
                  onClick={() => eliminarDelPedido(p)}
                  className="text-red-500 hover:text-red-700 text-sm ml-4 hover:bg-red-100 px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          
          {/* 🔥 Botones de acción */}
          <div className="space-y-3">
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg transition-colors shadow-lg"
            >
              📱 Enviar pedido por WhatsApp ({pedido.reduce((sum, p) => sum + p.cantidad, 0)} unidades)
            </a>
            
            {/* 🔥 Enlace de Instagram en el resumen */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                ¿Te gustó nuestro catálogo? 
              </p>
              <a
                href="https://instagram.com/npstore_oficial" // Cambia por tu Instagram real
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-medium">¡Síguenos en Instagram!</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;