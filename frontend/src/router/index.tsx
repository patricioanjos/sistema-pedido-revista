import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";

export default function Router() {

    return (
        <Routes>
            <Route path="/" index element={<App />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<ProtectedRoute />}>
                <Route path="settings" element={<div>Página de Configurações Protegida</div>} />
            </Route>
        </Routes>
    )
}