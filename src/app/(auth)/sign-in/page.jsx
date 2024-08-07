import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function SignIn () {
    return(
        <div className="w-full h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/signin.png')" }}>
            <div className="flex flex-col items-center">
                <h2 className="text-2xl mb-10 font-bold">Sign in to your account</h2>
                <div className="bg-white p-10 rounded-lg shadow-lg" style={{ width: '450px' }}>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">Email address</label>
                            <Input type="email" id="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                            <Input type="password" id="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox id="remember" />
                                <label className="ml-2 text-sm font-medium" htmlFor="remember">Remember me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-blue-700 hover:underline">Forgot password?</Link>
                        </div>
                        <button type="submit" style={{ background: "#4F46E5" }} className="w-full py-2 px-4 text-sm text-white rounded-md hover:bg-blue-600 transition duration-200">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    )
}