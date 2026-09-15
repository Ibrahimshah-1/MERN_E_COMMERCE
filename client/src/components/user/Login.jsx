import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AppContext);
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [emailError, setEmailError] = useState("");
    const [serverError, setServerError] = useState("");

    const onChangeHandler = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "email") {
            setEmailError("");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        setEmailError("");
        setServerError("");

        if (!formData.email.trim()) {
            setEmailError("Email is required");
            return;
        }

        if (!formData.password) {
            setServerError("Password is required");
            return;
        }

        try {
            const result = await login(
                formData.email,
                formData.password
            );

            console.log("Login result:", result);
            navigate('/')

        } catch (error) {
            const message = error.response?.data?.message;

            if (message === "User not found") {
                setEmailError("Email not found");
            } else {
                setServerError(
                    message || "Login failed"
                );
            }
        }
    };

    return (
        <div
            className="container my-5 p-4"
            style={{
                width: "600px",
                border: "2px solid yellow",
                borderRadius: "10px"
            }}
        >
            <h1 className="text-center">
                Login
            </h1>

            <form onSubmit={submitHandler} className="my-3">

                <div className="mb-3">
                    <label className="form-label">
                        Email
                    </label>

                    <input
                        name="email"
                        value={formData.email}
                        onChange={onChangeHandler}
                        type="email"
                        className="form-control"
                    />

                    {emailError && (
                        <div className="text-danger mt-1">
                            {emailError}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Password
                    </label>

                    <input
                        name="password"
                        value={formData.password}
                        onChange={onChangeHandler}
                        type="password"
                        className="form-control"
                    />
                </div>

                {serverError && (
                    <div className="text-danger text-center mb-3">
                        {serverError}
                    </div>
                )}

                <div className="d-grid col-6 mx-auto my-3">
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Login
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Login;