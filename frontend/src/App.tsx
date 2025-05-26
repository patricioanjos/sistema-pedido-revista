import { Link } from "react-router-dom"
import OrderForm from "./components/OrderForm"

function App() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <header className="flex justify-between">
        <h1>AD Brasil JF</h1>
        <Link to={"/login"}>Login</Link>
      </header>
      <section className="flex items-center justify-center">
        <div className="max-w-2xl w-full p-4 lg:px-8 rounded-2xl backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-500/10">
          <h2 className="text-2xl md:text-3xl font-semibold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text 
          text-transparent mb-6 capitalize">
            Pedido de revistas de EBD do departamento infantil - AD Brasil
          </h2>
          <OrderForm />
        </div>
      </section>
    </main>

  )
}

export default App
