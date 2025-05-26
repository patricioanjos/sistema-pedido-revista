import LoginForm from "../components/LoginForm";

export default function Login() {

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
            <div className="max-w-2xl w-full p-4 lg:px-8 rounded-2xl backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-500/10">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 capitalize bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Administrador
                </h2>
                <LoginForm />
            </div>
        </section>
    )
}