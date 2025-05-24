import { Link } from "react-router-dom"
import OrderForm from "./components/OrderForm"

function App() {

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between">
        <h1>AD Brasil JF</h1>
        <Link to={"/login"}>Login</Link>
      </header>
      <section className="flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white p-4 lg:px-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6 capitalize">
            Pedido de revistas de EBD do departamento infantil - AD Brasil
          </h2>
          <OrderForm />
        </div>
      </section>
    </main>

  )
}

export default App
