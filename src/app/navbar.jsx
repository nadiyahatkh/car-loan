'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const disabledNavbar = ["/sign-in"];

export default function Navbar() {
    const router = useRouter();
    const { status, data: session } = useSession();
    const pathname = usePathname();
    const userRole = session?.user?.role;
    

    const handleSignOut = () => {
        signOut({ callbackUrl: '/sign-in' }); // Redirect to login page after sign out
    };

    const routes = [
        {
            href: `/submission`,
            label: `Pengajuan`,
            active: pathname.startsWith(`/submission`),
            roles: [1]
        },
        {
            href: `/user/submission-user`,
            label: `Pengajuan`,
            active: pathname.startsWith(`/user/submission-user`),
            roles:[2]
        },
        {
            href: `/user-management`,
            label: `User Manajemen`,
            active: pathname.startsWith(`/user-management`),
            roles: [1]
        }
    ];

    const filteredRoutes = routes.filter(route => route.roles.includes(userRole));

    

    if (disabledNavbar.includes(pathname)) {
        return <div></div>;
    }
    return (
        <nav className="border-gray-200 dark:bg-gray-900" style={{ background: "transparent" }}>
            <div className="py-4">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between mb-6">
                        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/Vector.png" className="h-5 w-6" alt="Profile" />
                        </a>
                        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <img className="w-8 h-8 rounded-full" src="/signin.png" alt="user photo" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                    {status === 'authenticated' ? (
                                        <button className="flex items-center p-1 rounded-md hover:bg-gray-100 w-full" onClick={handleSignOut}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log Out
                                        </button>
                                    ) : (
                                        <button className="flex items-center p-1 rounded-md hover:bg-gray-100 w-full" onClick={() => router.push("/sign-in")}>
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Log In
                                        </button>
                                    )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                        <hr className="mb-4 border-gray-700" />
                        <div className="flex items-center space-x-3">
                        {filteredRoutes.map((route) => (
                            <Link key={route.href} href={route.href} className="flex items-center">
                                <Button
                                    variant="outline"
                                    className={`text-white border-none rounded-sm hover:text-gray-400 ${route.active ? 'bg-[#111827]' : 'bg-transparent'}`}
                                >
                                    {route.label}
                                </Button>
                            </Link>
                        ))}
                        </div>

                </div>
            </div>
        </nav>
    )
}
