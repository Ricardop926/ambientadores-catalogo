// src/components/ProductoCard.jsx

export default function ProductoCard({ nombre, aroma, precio, imagen, onAgregar }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-full sm:w-64 flex flex-col justify-between">
      <img src={imagen} alt={nombre} className="w-full h-40 object-cover rounded-md mb-4" />
      <h2 className="text-xl font-bold text-gray-800">{nombre}</h2>
      <p className="text-sm text-gray-600">{aroma}</p>
      <p className="text-lg text-green-600 font-semibold mt-2">${precio.toLocaleString()}</p>
      
      <button
        onClick={() => onAgregar({ nombre, aroma, precio })}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Agregar al pedido
      </button>
    </div>
  );
}
