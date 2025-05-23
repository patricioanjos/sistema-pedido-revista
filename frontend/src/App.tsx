import OrderForm from "./components/OrderForm"

function App() {

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-4 lg:px-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6 capitalize">
          Pedido de revistas de EBD do departamento infantil - AD Brasil
        </h1>
        <OrderForm />
      </div>
    </main>

  )
}

export default App
