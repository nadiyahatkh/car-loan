'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdateUser (){
    return (
        <div className="w-full max-w-7xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user-management">
                            <img src="/home.png" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <div>Edit User</div>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4">
                {/* Personal Information Card */}
                <Card className="w-[75%] py-4 rounded-none" style={{ background: "#F9FAFB" }}>
                    <CardContent>
                        <div className="flex flex-row items-start">
                            {/* Text Section */}
                            <div className="w-[45%]">
                                <div className="text-lg font-semibold">
                                    Personal Information
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    Use a permanent address where you can receive mail.
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="w-[80%] ml-auto">
                                <Card>
                                    <form action="">
                                        <CardContent className="py-4">
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="w-full mr-2">
                                                            <Label className="block text-sm mb-2 font-semibold">First Name</Label>
                                                            <Input />
                                                        </div>
                                                        <div className="w-full ml-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Last Name</Label>
                                                            <Input />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="w-full mr-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Email Address</Label>
                                                            <Input />
                                                        </div>
                                                        <div className="w-full ml-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Role</Label>
                                                            <Input />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="font-bold text-sm mb-2">Photo</p>
                                                    <div className="flex items-center">
                                                    <img src="" name="foto" alt="Profile Image" className="w-12 h-12 rounded-full mr-4" />
                                                        <input
                                                            name="foto"
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            id="fileInput"
                                                        />
                                                            <button type="button" onClick={() => document.getElementById('fileInput').click()} className="px-4 py-2 font-semibold shadow-sm border rounded-md">Change</button>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="w-full mr-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Password</Label>
                                                            <Input type="password" />
                                                        </div>
                                                        <div className="w-full ml-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Password Confirmation</Label>
                                                            <Input type="password" />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                        </CardContent>
                                            <hr className="mb-4" />
                                            <CardFooter className="flex justify-end">
                                                <Button variant="outline" className="mr-2 shadow-md h-8 w-[15%]" style={{ background: "#D1D5DB", color: "#3758C7" }}>Kembali</Button>
                                                <Button variant="primary" className="text-white h-8 w-[15%]" style={{ background: "#4F46E5" }}>Simpan</Button>
                                            </CardFooter>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}