/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Mail, Lock, Eye, EyeOff} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { APP_LOGO, USER, API, HTTP_STATUS } from "../../../shared/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminAuth = () => {
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
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values: any, { resetForm }: any) => {
    const signinPromise = new Promise<any>((resolve, reject) => {
        const payload = {
          email: values.email,
          password: values.password,
        };
        axios
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
      });

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
          Welcome Back
          </h2>
          <p className="text-gray-600">
          Sign in to continue
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
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
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#141313] focus:border-[#141313] transition-colors"
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
                    className="w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#141313] focus:border-[#141313] transition-colors"
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

              <button
                type="submit"
                className="w-full bg-[#141313] hover:bg-[#4e4e4e] text-white font-medium py-3 px-4 rounded-lg focus:ring-4 focus:ring-[#141313]/50 transition-colors"
              >
                Sign In
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminAuth;
