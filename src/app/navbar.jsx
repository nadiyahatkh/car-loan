'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const disabledNavbar = ["/sign-in"];

export default function Navbar() {
    const pathname = usePathname();

    if (disabledNavbar.includes(pathname)) {
        return <div></div>;
    }
    return(
        <nav className="border-gray-200 dark:bg-gray-900" style={{ background: "#1F2837" }}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
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
            <div className="max-w-screen-xl mx-auto px-4">
                <hr className="mb-4 border-gray-700" />
                <Button variant="outline" className="text-white border-none rounded-none hover:text-gray-400" style={{ background: "#111827" }}>Pengajuan</Button>
                <Button variant="outline" className="text-white border-none rounded-none hover:text-gray-400 ml-3" style={{ background: "#111827" }}>User Manajemen</Button>
            </div>
        </nav>
    )
}