import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Copy, Slash } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function DetailSubmissionUser() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user/submission-user">
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
                <Card className="w-full lg:w-3/4 rounded-none">
                    <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-start">
                            {/* Text Section */}
                            <div className="w-full lg:w-[45%]">
                                <div className="text-base font-semibold">
                                    Detail Pengajuan
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    Informasi detail pengajuan
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <hr />
                        <div className="divide-y divide-gray-100">
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Pengaju</div>
                                <div className="w-full lg:w-2/4">Lindsay Walton</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Waktu Pengajuan</div>
                                <div className="w-full lg:w-2/4">21 Agustus 2024, 10:00 WIB</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Waktu Pengembalian (Estimasi)</div>
                                <div className="w-full lg:w-2/4">21 Agustus 2024, 12:00 WIB</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Tujuan</div>
                                <div className="w-full lg:w-2/4">
                                    <p className="font-semibold">Peminjaman Mobil</p>
                                    <p>
                                        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
                                        consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in
                                        ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui
                                        eu.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Status</div>
                                <div className="w-full lg:w-2/4">Ditolak</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Catatan</div>
                                <div className="w-full lg:w-2/4">
                                    <p className="mb-3">-</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
