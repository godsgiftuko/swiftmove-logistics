/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { APP_LOGO, USER, API, HTTP_STATUS } from "../../../shared/constants";
import { EUserRole } from "../../../server/src/models/user.model";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ButtonLoader from "./ButtonLoader";
import api from "../lib/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(
        USER.MIN_PASSWORD_LENGTH,
        `Password must be at least ${USER.MIN_PASSWORD_LENGTH} characters`
      ),
    ...(isLogin
      ? {}
      : {
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          phone: Yup.string()
            .required("Last name is required")
            .min(
              USER.PHONE_LENGTH,
              `Phone number must be ${USER.PHONE_LENGTH} digits`
            ),
          isDriver: Yup.bool().required("isDriver is required"),
          password: Yup.string()
            .required("Password is required")
            .min(
              USER.MIN_PASSWORD_LENGTH,
              `Password must be at least ${USER.MIN_PASSWORD_LENGTH} characters`
            ),
        }),
  });

  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    rememberMe: false,
    isDriver: false,
  };

  const handleSubmit = (values: any, { resetForm }: any) => {
    if (isLogin) {
      const signinPromise = new Promise<any>((resolve, reject) => {
        setSubmitting(true);
        const payload = {
          email: values.email,
          password: values.password,
        };
        api
          .post(`${API.PREFIX}/auth/login`, payload)
          .then(({ data: resp }) => {
            const user = resp.data.user;
            const token = resp.data.token;

            loginUser(user, token);
            resolve(resp.message);
          })
          .catch((error) => {
            if (error?.status === HTTP_STATUS.BAD_REQUEST) {
              return reject(error.response.data.message);
            }
            const errors = error.response.data.formattedErrors as Array<{
              field: string;
              message: string;
              value: string;
            }>;
            reject(errors);
          });
      }).finally(() => setSubmitting(false));

      toast
        .promise(signinPromise, {
          loading: "Signing in...",
          success: (msg) => {
            resetForm();
            setTimeout(() => {
              navigate("/dashboard");
            }, 3000);
            return msg;
          },
        })
        .catch((err) => {
          if (Array.isArray(err)) {
            err.forEach((e: any) => toast.error(e.message));
          } else {
            toast.error(err);
          }
        });
    } else {
      const signupPromise = new Promise<any>((resolve, reject) => {
        setSubmitting(true);
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          phone: values.phone,
          role: values.isDriver ? EUserRole.driver : EUserRole.manager,
        };
        api
          .post(`${API.PREFIX}/auth/register`, payload)
          .then(({ data: resp }) => {
            const user = resp.data.user;
            const token = resp.data.token;

            loginUser(user, token);
            resolve(resp.message);
          })
          .catch((error) => {
            if (error?.status === HTTP_STATUS.CONFLICT) {
              return reject(error.response.data.message);
            }
            const errors = error.response.data.formattedErrors as Array<{
              field: string;
              message: string;
              value: string;
            }>;
            reject(errors);
          }).finally(() => setSubmitting(false));;
      });

      toast
        .promise(signupPromise, {
          loading: "Signing up...",
          success: (msg) => {
            resetForm();
            setTimeout(() => {
              navigate("/dashboard");
            }, 3000);
            return msg;
          },
        })
        .catch((err) => {
          if (Array.isArray(err)) {
            err.forEach((e: any) => toast.error(e.message));
          } else {
            toast.error(err);
          }
        });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8">
        <div className="flex justify-center">
          <Link to={"/"}>
            <img className="md:h-30 h-20" src={APP_LOGO.TRANSPARENT} alt="" />
          </Link>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? "Sign in to your account to continue"
              : "Sign up to get started with your account"}
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
              {!isLogin && (
                <div className="flex gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cf1112] focus:border-[#cf1112] transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <ErrorMessage
                      name="firstName"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cf1112] focus:border-[#cf1112] transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Field
                      type="text"
                      id="phone"
                      name="phone"
                      className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cf1112] focus:border-[#cf1112] transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#cf1112] focus:border-[#cf1112] transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#cf1112] focus:border-[#cf1112] transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Field
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-[#cf1112] focus:ring-[#cf1112] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-[#cf1112] hover:text-[#b50e0f]"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Field
                      id="isDriver"
                      name="isDriver"
                      type="checkbox"
                      className="h-4 w-4 text-[#cf1112] focus:ring-[#cf1112] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isDriver"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      I am a driver
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-[#cf1112] hover:text-[#b50e0f]"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#cf1112] hover:bg-[#b50e0f] text-white font-medium py-3 px-4 rounded-lg focus:ring-4 focus:ring-[#cf1112]/50 transition-colors"
              >
                {
                  submitting 
                  ? <ButtonLoader />
                  : isLogin ? "Sign In" : "Sign up"
                }
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="font-medium text-[#cf1112] hover:text-[#b50e0f]"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
