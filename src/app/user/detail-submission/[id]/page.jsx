"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Copy, Slash } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchApplicantUserDetail } from "@/app/apiService";
import { useEffect, useState } from "react";
import { id as localeId } from 'date-fns/locale';
import { format } from "date-fns";

export default function DetailSubmissionUser() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const { id: submissionId } = useParams();
    const [detail, setDetail] = useState();

    useEffect(() => {
        const loadDetail = async () => {
          if (token && submissionId) {
            const response = await fetchApplicantUserDetail({ token, id: submissionId });
            setDetail(response.data.dataApplicant);
          }
        };
        loadDetail();
      }, [token, submissionId]);


      function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, "d MMMM yyyy, HH:mm 'WIB'", { locale: localeId });
    }
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
                                <div className="w-full lg:w-2/4">{detail?.name}</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Waktu Pengajuan</div>
                                <div className="w-full lg:w-2/4">{formatDate(detail?.submission_date)}</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Waktu Pengembalian (Estimasi)</div>
                                <div className="w-full lg:w-2/4">{formatDate(detail?.expiry_date)}</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Mobil</div>
                                <div className="w-full lg:w-2/4">{detail?.car.name}</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Tujuan</div>
                                <div className="w-full lg:w-2/4">
                                    <p className="font-semibold">Peminjaman Mobil</p>
                                    <p>
                                        {detail?.purpose}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Status</div>
                                <div className="w-full lg:w-2/4">{detail?.status}</div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-full lg:w-1/4">Catatan</div>
                                <div className="w-full lg:w-2/4">
                                    <p className="mb-3">{detail?.notes || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
