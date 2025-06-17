// src/App.jsx
import { useState, useRef } from 'react';
import { productos } from './data/productos';
import ProductoCard from './components/ProductoCard';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [lista, setLista] = useState(productos);
  const [filtroAroma, setFiltroAroma] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [pedido, setPedido] = useState([]);

  const resumenRef = useRef(null);

  // ✅ Agregar con cantidad
  const agregarAlPedido = (producto) => {
    const existente = pedido.find(p => p.nombre === producto.nombre && p.aroma === producto.aroma);

    if (existente) {
      const actualizado = pedido.map(p =>
        p.nombre === producto.nombre && p.aroma === producto.aroma
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      );
      setPedido(actualizado);
    } else {
      setPedido([...pedido, { ...producto, cantidad: 1 }]);
    }

    toast.success(`${producto.nombre} agregado al pedido`);

    // Scroll hacia el resumen
    setTimeout(() => {
      if (resumenRef.current) {
        resumenRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // ✅ Eliminar producto del pedido
  const eliminarDelPedido = (producto) => {
    const filtrado = pedido.filter(p => !(p.nombre === producto.nombre && p.aroma === producto.aroma));
    setPedido(filtrado);
    toast(`Producto eliminado`);
  };

  // Filtrar productos
  const productosFiltrados = lista.filter(p => {
    return (
      (filtroAroma === "" || p.aroma.toLowerCase().includes(filtroAroma.toLowerCase())) &&
      (filtroTipo === "" || p.tipo.toLowerCase().includes(filtroTipo.toLowerCase()))
    );
  });

  // Generar mensaje de WhatsApp
  const generarMensaje = () => {
    if (pedido.length === 0) return "";
    let detalle = pedido.map(p => `• ${p.nombre} - ${p.aroma} x${p.cantidad}`).join('\n');
    return `Hola, quiero pedir los siguientes ambientadores:\n\n${detalle}\n\nTotal: ${pedido.reduce((sum, p) => sum + p.cantidad, 0)} unidades`;
  };

  const urlWhatsApp = `https://wa.me/573137873766?text=${encodeURIComponent(generarMensaje())}`;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-black via-gray-800 to-gray-600 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-10 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-2xl border-2 border-gray-500">
              <img
                src="/path-to-your-logo.png"
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
          <p className="text-xl md:text-2xl font-medium mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Bienvenido al catálogo de aromas Lightgel de la tienda NPstore
          </p>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gray-400"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gray-400"></div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 justify-center mb-6 mt-4">
        <select onChange={e => setFiltroAroma(e.target.value)} className="p-2 border rounded">
          <option value="">Todos los aromas</option>
          <option value="frutos rojos">Frutos rojos</option>
          <option value="tropical fruit">Tropical fruit</option>
          <option value="brisa marina">Brisa Marina</option>
          <option value="fantasy apple">Fantasy Apple</option>
          <option value="hierbas campestres">Hierbas campestres</option>
          <option value="citrus">Citrus</option>
          <option value="vainilla">Vainilla</option>
        </select>

        <select onChange={e => setFiltroTipo(e.target.value)} className="p-2 border rounded">
          <option value="">Todos los tipos</option>
          <option value="auto">Auto</option>
          <option value="hogar">Hogar</option>
        </select>
      </div>

      {/* Grid de productos */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {productosFiltrados.map((p, i) => (
          <ProductoCard key={i} {...p} onAgregar={agregarAlPedido} />
        ))}
      </div>

      {/* Resumen del pedido */}
      {pedido.length > 0 && (
        <div
          ref={resumenRef}
          className="mt-10 text-center bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto"
        >
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
