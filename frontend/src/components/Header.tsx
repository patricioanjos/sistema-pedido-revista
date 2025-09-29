import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "antd";

export default function Header() {
    const { logout, isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="flex justify-between px-5 py-2">
            <h1 className="text-3xl">AD Brasil JF</h1>

            {location.pathname === '/dashboard' ? (
                <Button onClick={handleLogout} danger>
                    Sair
                </Button>

            ) : (
                <>
                    {isAuthenticated ? (
                        <div>
                            <Link to={"/dashboard"}>Dashboard</Link>
                            <Button onClick={handleLogout} danger>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link to={'/login'}>
                            <Button className="bg-blue-500 text-white">Login</Button>
                        </Link>
                    )}
                </>
            )
            }
        </header>
    )
}