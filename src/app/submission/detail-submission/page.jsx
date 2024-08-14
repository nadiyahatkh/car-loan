'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Copy, Slash } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DetailSubmission() {
    const [isDialogTolakOpen, setIsDialogTolakOpen] = useState(false)
    return (
        <div className="w-full max-w-7xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user-management">
                            <img src="/home.png" alt="Home" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <div>Detail</div>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4">
                {/* Personal Information Card */}
                <Card className="w-3/4 rounded-none">
                    <CardHeader>
                        <div className="flex flex-row items-start">
                            {/* Text Section */}
                            <div className="w-[45%]">
                                <div className="text-base font-semibold">
                                    Detail Pengajuan
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    Informasi detail pengajuan
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="">
                    <hr />
                        <div className="divide-y divide-gray-100">
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Pengaju</div>
                                <div className="w-2/4">Lindsay Walton</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Waktu Pengajuan</div>
                                <div className="w-2/4">21 Agustus 2024, 10:00 WIB</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Waktu Pengembalian (Estimasi)</div>
                                <div className="w-2/4">21 Agustus 2024, 12:00 WIB</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Tujuan</div>
                                <div className="w-2/4">
                                    <p className="font-semibold">Peminjaman Mobil</p>
                                    Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
                                    consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in
                                    ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui
                                    eu.
                                </div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Status</div>
                                <div className="w-2/4">Ditolak</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Catatan</div>
                                <div className="w-2/4">
                                    <p className="mb-3">-</p>
                                    <div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="mr-2 shadow-md h-8 w-[15%]" style={{ background: "#D1D5DB", color: "#3758C7" }} >Tolak</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="message-2">Alasan Penolakan</Label>
                                            <Textarea id="message-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Tuliskan alasan penolakan pengajuan
                                            </p>
                                            </div>
                                            <DialogFooter className="">
                                                <Button variant="outline" className="mr-2 shadow-md h-8 w-[20%]" style={{ background: "#D1D5DB", color: "#3758C7" }}>Kembali</Button>
                                                <Button variant="primary" className="text-white h-8 w-[20%]" style={{ background: "#4F46E5" }}>Simpan</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                        </Dialog>
                                        
                                        <Button variant="primary" className="text-white h-8 w-[15%]" style={{ background: "#4F46E5" }}>Setujui</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
