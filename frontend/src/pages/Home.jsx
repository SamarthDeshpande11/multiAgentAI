import React, { useState } from "react";
import { auth } from "../../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import api from "../../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data));
    } catch (error) {
      console.log(error);
      setError("Unable to complete login. Please try again.");
    }
  };

  const getErrorMessage = (code, message) => {
    switch (code) {
        case "auth/invalid-email":
            return "Invalid email address.";
        case "auth/user-disabled":
            return "This user account has been disabled.";
        case "auth/user-not-found":
            return "No account found for that email.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/invalid-credential":
            return "Invalid email or password.";
        case "auth/email-already-in-use":
            return "This email is already in use.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
        case "auth/operation-not-allowed":
            return "Email/password sign-in is not enabled in Firebase Authentication.";
        case "auth/network-request-failed":
            return "Network error. Check your connection and try again.";
        default:
            return message || "Authentication error. Please try again.";
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      const token = await response.user.getIdToken();
      await handleLogin(token);
    } catch (err) {
      const errorCode = err?.code || null;
      const errorMessage =
        err?.message || "Authentication error. Please try again.";
      setError(getErrorMessage(errorCode, errorMessage));
      console.error("Firebase auth error", errorCode, errorMessage, err);
    }
  };

  return (
    <div className="h-screen  flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />
      <Artifact />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to CortexAI
              </h2>
              <p className="text-[13px] text-slate-500">
                Please {isSignup ? "create an account" : "log in"} to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#0f1219] px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="you@example.com"
              />

              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#0f1219] px-4 py-3 text-white outline-none focus:border-indigo-500"
                placeholder="Password"
              />

              {isSignup && (
                <>
                  <label className="text-sm text-slate-300">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0f1219] px-4 py-3 text-white outline-none focus:border-indigo-500"
                    placeholder="Confirm password"
                  />
                </>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                className="w-full py-[11px] rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400 transition-all duration-150"
              >
                {isSignup ? "Create account" : "Log in"}
              </button>
            </form>

            <button
              type="button"
              className="text-sm text-slate-400 hover:text-white transition-colors"
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
              }}
            >
              {isSignup
                ? "Already have an account? Log in"
                : "New here? Create an account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
