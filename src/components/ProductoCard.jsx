import { useState } from 'react';

export default function ProductoCard({ nombre, aroma, tipo, imagen, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);
  
  const manejarAgregar = () => {
    if (cantidad > 0) {
      onAgregar({ nombre, aroma, tipo, imagen }, cantidad);
      setCantidad(1); // Reset a 1 después de agregar
    }
  };

  const manejarErrorImagen = (e) => {
    console.log("❌ Error cargando imagen:", e.target.src);
    e.target.src = `https://picsum.photos/256/192?random=${Math.floor(Math.random() * 1000)}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
      {/* Contenedor de imagen*/}
      <div className="w-full h-56 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center mb-4">
        <img
          src={imagen || "/placeholder.svg"}
          alt={`${nombre} - ${aroma}`}
          className="object-contain h-full"
          onError={manejarErrorImagen}
        />
      </div>

      {/* Información del producto  */}
      <h3 className="text-xl font-bold mb-2 text-center">{nombre}</h3>
      <p><span className="font-semibold">Aroma:</span> {aroma}</p>
      <p><span className="font-semibold">Tipo:</span> {tipo}</p>

      {/* 🔥 Selector de cantidad */}
      <div className="mt-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
          Cantidad:
        </label>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max="99"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border border-gray-300 rounded-md py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setCantidad(cantidad + 1)}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Botón de agregar */}
      <button
        onClick={manejarAgregar}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        Agregar {cantidad} al pedido
      </button>
    </div>
  );
}
