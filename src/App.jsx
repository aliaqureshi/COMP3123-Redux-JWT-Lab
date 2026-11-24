
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
    increment,
    decrement,
    reset,
    login,
    logout
} from "./store";
import "./App.css";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { count, token, username: currentUser } =
        useSelector((state) => state.app);

    // 4. Dispatch
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5001/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            const decoded = jwtDecode(data.token);

            dispatch(login({
                token: data.token,
                username: decoded.username
            }));

            setMessage("Login successful!");
            setPassword("");
        } catch {
            setMessage("Unable to connect to server.");
        }
    };

    const accessDashboard = async () => {
        try {
            const response = await fetch(
                "http://localhost:5001/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            setMessage(data.message);
        } catch {
            setMessage("Unable to connect to server.");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setMessage("Logged out successfully.");
    };

    return (
        <div className="container">
            <h1>React Redux & JWT</h1>
            <p className="subtitle">
                Self-Directed Research and Innovation Lab
            </p>

            {!token ? (
                <div className="panel">
                    <h2>Login</h2>

                    <form onSubmit={handleLogin}>
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button type="submit">Login</button>
                    </form>

                    <p>Demo username: student</p>
                    <p>Demo password: 1234</p>
                </div>
            ) : (
                <>
                    <div className="panel">
                        <h2>Welcome, {currentUser}!</h2>
                        <p>JWT authentication successful.</p>

                        <button onClick={accessDashboard}>
                            Access Protected Dashboard
                        </button>

                        <button
                            className="logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>

                    <div className="panel">
                        <h2>Redux Counter</h2>
                        <div className="counter">{count}</div>

                        <div className="buttons">
                            <button onClick={() =>
                                dispatch(decrement())
                            }>
                                - Decrease
                            </button>

                            <button onClick={() =>
                                dispatch(increment())
                            }>
                                + Increase
                            </button>

                            <button onClick={() =>
                                dispatch(reset())
                            }>
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="panel">
                        <h2>JWT Token</h2>
                        <p className="token">
                            {token.slice(0, 30)}...
                        </p>
                    </div>
                </>
            )}

            {message && (
                <p className="message">{message}</p>
            )}

            <div className="panel">
                <h2>Redux Concepts Demonstrated</h2>

                <p>0 - State</p>
                <p>1 - Store</p>
                <p>2 - Reducer</p>
                <p>3 - Action</p>
                <p>4 - Dispatch</p>
                <p>5 - Subscribe</p>
            </div>
        </div>
    );
}

export default App;
