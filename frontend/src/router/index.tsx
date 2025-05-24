import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import App from "../App";

export default function Router() {

    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
    )
}