'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const disabledNavbar = ["/sign-in"];

export default function Navbar() {
    const pathname = usePathname();

    const routes = [
        {
            href: `/submission`,
            label: `Pengajuan`,
            active: pathname.startsWith(`/submission`),
        },
        {
            href: `/user/submission-user`,
            label: `Pengajuan`,
            active: pathname.startsWith(`/user/submission-user`),
        },
        {
            href: `/user-management`,
            label: `User Manajemen`,
            active: pathname.startsWith(`/user-management`),
        }
    ];

    

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
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                        <hr className="mb-4 border-gray-700" />
                        <div className="flex items-center space-x-3">
                        {routes.map((route) => (
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
