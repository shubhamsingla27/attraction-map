import { Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import User from "./components/User";
import Admin from "./components/Admin";

import RequireAuth from "./components/RequireAuth";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* Protected Route */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<User />} />
                    <Route path="user" element={<User />} />
                    <Route path="admin" element={<Admin />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
