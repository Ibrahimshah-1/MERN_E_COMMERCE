
import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const { register, verifyEmail } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [emailError, setEmailError] = useState("");
    const [serverError, setServerError] = useState("");

    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [verificationSuccess, setVerificationSuccess] = useState("");

    const onChangeHandler = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "password") {
            setPasswordRequirements({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[@$!%*?#&]/.test(value)
            });
        }

        if (name === "email") {
            setEmailError("");

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (value && !emailPattern.test(value)) {
                setEmailError("Enter a valid email address");
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        setServerError("");
        setEmailError("");

        if (!formData.name.trim()) {
            setServerError("Name is required");
            return;
        }

        if (!formData.email.trim()) {
            setEmailError("Email is required");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {
            setEmailError("Enter a valid email address");
            return;
        }

        if (!formData.password) {
            return;
        }

        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;

        if (!strongPassword.test(formData.password)) {
            return;
        }

        try {
            const result = await register(
                formData.name,
                formData.email,
                formData.password
            );

            console.log("Registration result:", result);

            setShowVerification(true);

        } catch (error) {
            const message = error.response?.data?.message;

            if (message === "User already exists") {
                setEmailError("Email already exists");
            } else {
                setServerError(
                    message || "Registration failed"
                );
            }
        }
    };

    const verifyHandler = async (e) => {
        e.preventDefault();

        setVerificationError("");
        setVerificationSuccess("");

        if (!verificationCode.trim()) {
            setVerificationError("Verification code is required");
            return;
        }

        if (!/^\d{6}$/.test(verificationCode)) {
            setVerificationError("Verification code must be 6 digits");
            return;
        }

        try {
            const result = await verifyEmail(
                formData.email,
                verificationCode
            );

            console.log("Verification result:", result);

            setVerificationSuccess(
                "Email verified successfully. You can now login."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            const message = error.response?.data?.message;

            setVerificationError(
                message || "Email verification failed"
            );
        }
    };

    if (showVerification) {
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
                    Verify Your Email
                </h1>

                <p className="text-center">
                    We sent a verification code to
                </p>

                <p className="text-center fw-bold">
                    {formData.email}
                </p>

                <form onSubmit={verifyHandler} className="my-3">

                    <div className="mb-3">
                        <label className="form-label">
                            Verification Code
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value);
                                setVerificationError("");
                            }}
                            className="form-control"
                            placeholder="Enter 6-digit code"
                        />

                        {verificationError && (
                            <div className="text-danger mt-1">
                                {verificationError}
                            </div>
                        )}

                        {verificationSuccess && (
                            <div className="text-success mt-1">
                                {verificationSuccess}
                            </div>
                        )}
                    </div>

                    <div className="d-grid col-6 mx-auto my-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Verify Email
                        </button>
                    </div>

                </form>
            </div>
        );
    }

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
                User Register
            </h1>

            <form onSubmit={submitHandler} className="my-3">

                <div className="mb-3">
                    <label className="form-label">
                        Name
                    </label>

                    <input
                        name="name"
                        value={formData.name}
                        onChange={onChangeHandler}
                        type="text"
                        className="form-control"
                    />
                </div>

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

                    {formData.password && (
                        <div className="mt-2">

                            {!passwordRequirements.length && (
                                <div className="text-danger">
                                    Password must be at least 8 characters
                                </div>
                            )}

                            {!passwordRequirements.uppercase && (
                                <div className="text-danger">
                                    Password must contain an uppercase letter
                                </div>
                            )}

                            {!passwordRequirements.lowercase && (
                                <div className="text-danger">
                                    Password must contain a lowercase letter
                                </div>
                            )}

                            {!passwordRequirements.number && (
                                <div className="text-danger">
                                    Password must contain a number
                                </div>
                            )}

                            {!passwordRequirements.special && (
                                <div className="text-danger">
                                    Password must contain a special character
                                </div>
                            )}

                        </div>
                    )}
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
                        Register
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Register;

