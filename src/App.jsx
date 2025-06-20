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
    return `Hola, quiero pedir los siguientes ambientadores:\n\n${detalle}\n\nTotal: ${pedido.reduce((sum, p) => sum + p.cantidad, 0)} unidades`;
  };

  const urlWhatsApp = `https://wa.me/573225833639?text=${encodeURIComponent(generarMensaje())}`;

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

      {/* Pedido */}
      {pedido.length > 0 && (
        <div ref={resumenRef} className="mt-10 text-center bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Resumen del pedido:</h2>
          <ul className="text-left mb-4">
            {pedido.map((p, i) => (
              <li key={i} className="flex justify-between items-center mb-2">
                <span>✅ {p.nombre} - {p.aroma} (x{p.cantidad})</span>
                <button
                  onClick={() => eliminarDelPedido(p)}
                  className="text-red-500 hover:text-red-700 text-sm ml-4"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg"
          >
            Enviar pedido por WhatsApp ({pedido.reduce((sum, p) => sum + p.cantidad, 0)} unidades)
          </a>
        </div>
      )}
    </div>
  );
}

export default App;