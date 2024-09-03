'use client'
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getSession, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Hearts } from "react-loader-spinner";

export default function SignIn () {
  const router = useRouter();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError("");
    
    // Validate fields
    if (!value.email || !value.password) {
      setError("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: value.email,
        password: value.password,
      });

      if (res && !res.error) {
        const session = await getSession();
        const userRole = session?.user?.role;
        const redirectUrl = +userRole === 1 ? '/submission' : '/user/submission-user';
        router.push(redirectUrl);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.log('Handle login error:', error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 1) {
        router.push('/submission');
      } else {
        router.push('/user/submission-user');
      }
    }
  }, [status, session, router]);

    return(
        <div className="w-full h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/signin.png')" }}>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl mb-10 font-bold">Sign in to your account</h2>
                <div className="bg-white p-10 rounded-lg shadow-lg" style={{ width: '450px' }}>
                    <form onSubmit={handleLogin}>
                    {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">Email address</label>
                            <Input 
                                type="email" 
                                id="email" 
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                onChange={(e) => {
                                    setValue({ ...value, email: e.target.value });
                                  }}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                            <Input 
                                type="password" 
                                id="password" 
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                onChange={(e) => {
                                    setValue({ ...value, password: e.target.value });
                                  }}
                            />
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox id="remember" />
                                <label className="ml-2 text-sm font-medium" htmlFor="remember">Remember me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-blue-700 hover:underline">Forgot password?</Link>
                        </div>
                        <button type="submit" style={{ background: "#4F46E5" }} className="w-full py-2 px-4 text-sm text-white rounded-md hover:bg-blue-600 transition duration-200">
                        {isSubmitting ? (
                            <div className="flex justify-center">
                            <Hearts
                              height="20"
                              width="20"
                              color="#ffffff"
                              ariaLabel="hearts-loading"
                            />
                          </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}