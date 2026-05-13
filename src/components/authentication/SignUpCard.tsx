import { useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../../lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwordSchema } from "../../lib/validation";

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: passwordSchema,
});

type SignUpData = z.infer<typeof signUpSchema>;

const SignUpCard = () => {
  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);

    setServerError(null);

    // Extra validation safety
    const parsedData = signUpSchema.safeParse(data);

    if (!parsedData.success) {
      console.error(parsedData.error);
      setServerError("Invalid form data.");
      setLoading(false);
      return;
    }

    const validatedData = parsedData.data;

    try {
      const result = await authClient.signUp.email(
        {
          name: validatedData.username,
          email: validatedData.email,
          password: validatedData.password,
        },
        {
          onSuccess: () => {
            window.location.href = "/admin";
          },

          onError: (ctx) => {
            setServerError(
              ctx.error?.message ||
                "Error during sign up"
            );
          },
        }
      );

      if (result.error) {
        setServerError(
          result.error.message ||
            "Error during sign up"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        "An unexpected error occurred";

      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Sign Up
        </h2>

        <p className="text-gray-500 mt-2">
          Pentadbir Masjid Nurul Huda
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSignUp)}
        className="space-y-6"
      >
        {/* USERNAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"

            data-invalid={
              !!form.formState.errors.username
            }

            aria-invalid={
              !!form.formState.errors.username
            }

            {...form.register("username")}
          />

          {form.formState.errors.username && (
            <p className="text-red-500 text-sm mt-2">
              {
                form.formState.errors.username
                  .message
              }
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emel
          </label>

          <input
            type="email"
            placeholder="nama@contoh.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"

            data-invalid={
              !!form.formState.errors.email
            }

            aria-invalid={
              !!form.formState.errors.email
            }

            {...form.register("email")}
          />

          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-2">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kata Laluan
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"

            data-invalid={
              !!form.formState.errors.password
            }

            aria-invalid={
              !!form.formState.errors.password
            }

            {...form.register("password")}
          />

          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-2">
              {
                form.formState.errors.password
                  .message
              }
            </p>
          )}
        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300 transform active:scale-95 disabled:opacity-50"
        >
          {loading
            ? "Sila tunggu..."
            : "Daftar Akaun"}
        </button>

        <div>
          <p>
            Already have an account?

            <Link
              to="/login"
              className="px-2 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpCard;