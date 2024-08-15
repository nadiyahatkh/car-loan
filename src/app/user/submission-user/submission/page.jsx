'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Pengajuan(){
    return(
        <div className="w-full max-w-7xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user/submission-user">
                            <img src="/home.png" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <div>Pengajuan</div>
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
                                    Pengajuan Peminjaman
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    Silahkan isi form di samping
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="w-[80%] ml-auto">
                                <Card>
                                    <form action="">
                                        <CardContent className="pe-9 py-2">
                                                <div className="mb-4">
                                                    <Label className="block text-sm mb-2 font-semibold">Tujuan Peminjaman Mobil</Label>
                                                    <Textarea type="text" className="w-full" />
                                                </div>
                                                <div className="mb-4">
                                                    <p className="font-bold text-sm mb-2">Type Mobil</p>
                                                    <div className="flex items-center">
                                                    <RadioGroup defaultValue="comfortable" className="flex items-center space-x-2">
                                                    <div className="space-x-2">
                                                        <RadioGroupItem value="default" id="r1" />
                                                        <Label htmlFor="r1">Mobilio 2018</Label>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <RadioGroupItem value="comfortable" id="r2" />
                                                        <Label htmlFor="r2">Avanza Veloz 2022</Label>
                                                    </div>
                                                    </RadioGroup>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="w-full mr-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Waktu Peminjaman</Label>
                                                            <Input type="password" />
                                                        </div>
                                                        <div className="w-full ml-2">
                                                            <Label className="block text-sm mb-2 font-semibold">Waktu Pengembalian</Label>
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