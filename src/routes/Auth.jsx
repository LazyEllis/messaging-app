import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { createUser, generateToken } from "../lib/api";
import Input from "../components/Input";
import LoadingIcon from "../components/LoadingIcon";
import ErrorAlert from "../components/ErrorAlert";

const signInFields = [
  { id: "email", label: "Email address", type: "email", required: true },
  { id: "password", label: "Password", type: "password", required: true },
];

const signUpFields = [
  { id: "name", label: "Name", type: "text", required: true },
  ...signInFields,
  {
    id: "passwordConfirmation",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
];

const initialSignInData = { email: "", password: "" };

const initialSignUpData = {
  name: "",
  ...initialSignInData,
  passwordConfirmation: "",
};

const getActionText = (isSignUp, isPending) => {
  if (isPending) {
    return isSignUp ? "Signing up..." : "Signing in...";
  }

  return isSignUp ? "Sign up" : "Sign in";
};

const Auth = ({ isSignUp }) => {
  const [formData, setFormData] = useState(
    isSignUp ? initialSignUpData : initialSignInData,
  );

  const navigate = useNavigate();
  const { login } = useAuth();

  const { mutate, error, isPending } = useMutation({
    mutationFn: isSignUp ? createUser : generateToken,
    onSuccess: (data) => {
      login(data.token);
      navigate("/");
    },
  });

  const fields = isSignUp ? signUpFields : signInFields;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <main className="flex min-h-full flex-col justify-center bg-[#393a41] px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl/9 font-semibold tracking-tight text-white">
          {isSignUp ? "Create an account" : "Welcome back!"}
        </h1>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorAlert error={error} />}

          {fields.map((field) => (
            <Input
              key={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              {...field}
            />
          ))}

          <div>
            <button
              type="submit"
              className="bg-blurple-500 focus-visible:outline-blurple-500 hover:bg-blurple-600 flex w-full cursor-pointer justify-center rounded-md px-3.5 py-1.5 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {isPending && <LoadingIcon />}{" "}
              {getActionText(isSignUp, isPending)}
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm/6 text-white">
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            to={isSignUp ? "/sign-in" : "/sign-up"}
            className="text-blurple-400 font-semibold hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Auth;
