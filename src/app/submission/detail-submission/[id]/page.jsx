'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { acceptApplicant, denyApplicant, fetchApplicantAdminDetail } from "@/app/apiService";
import { format } from "date-fns";
import { id as localeId } from 'date-fns/locale';
import { Hearts } from "react-loader-spinner";

export default function DetailSubmission() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const { id: submissionId } = useParams();
    const router = useRouter();
    const [notes, setNotes] = useState('');
    const [currentApplicantId, setCurrentApplicantId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState({});
    const [detail, setDetail] = useState();

    useEffect(() => {
        const loadDetail = async () => {
          if (token && submissionId) {
            const response = await fetchApplicantAdminDetail({ token, id: submissionId });
            setDetail(response.data.dataApplicant);
          }
        };
        loadDetail();
      }, [token, submissionId]);

    const handleAccept = async () => {
        try {
          await acceptApplicant({ id: submissionId, token });
          router.push('/submission');
        } catch (error) {
          console.error('Error accepting applicant:', error);
        }
    };

    const handleDeny = async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        if (!currentApplicantId || !notes) return; // Ensure we have an ID and notes
    
        setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: true }));
        try {
          await denyApplicant({ id: currentApplicantId, token, notes });
          router.push('/submission');
            
          
        } catch (error) {
          console.error('Error denying applicant:', error);
        } finally {
          setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: false }));
          setNotes(''); // Clear notes after submission
          setCurrentApplicantId(null); // Reset current applicant ID
          setIsDialogOpen(false); 
        }
      };

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, "d MMMM yyyy, HH:mm 'WIB'", { locale: localeId });
    }

    return (
        <>
        <div className="w-full max-w-7xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/submission">
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
                <Card className="w-3/4 rounded-none">
                    <CardHeader>
                        <div className="flex flex-row items-start">
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
                    <CardContent>
                        <hr />
                        <div className="divide-y divide-gray-100">
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Pengaju</div>
                                <div className="w-2/4">{detail?.name}</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Waktu Pengajuan</div>
                                <div className="w-2/4">{formatDate(detail?.submission_date)}</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Waktu Pengembalian (Estimasi)</div>
                                <div className="w-2/4">{formatDate(detail?.expiry_date)}</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Mobil</div>
                                <div className="w-2/4">{detail?.car.name}</div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Tujuan</div>
                                <div className="w-2/4">
                                    <p className="font-semibold">Peminjaman Mobil</p>
                                    {detail?.purpose}
                                </div>
                            </div>
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Status</div>
                                <div className="w-2/4">{detail?.status}</div>
                            </div>

                            {detail?.status === 'DiTolak' && (
                            <div className="flex justify-between items-start py-4 text-sm">
                                <div className="font-semibold w-1/4">Catatan</div>
                                <div className="w-2/4">
                                    <p className="mb-3">{detail?.notes || "-"}</p>
                                </div>
                            </div>
                            )}

                            {detail?.status !== 'Disetujui' && detail?.status !== 'DiTolak' && (
                                <div className="flex justify-center items-center py-4 text-sm">
                                    <div className="w-2/4">
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    className="mr-2 shadow-md h-8 w-[15%]" 
                                                    onClick={() => setCurrentApplicantId(detail.id)}
                                                    style={{ background: "#D1D5DB", color: "#3758C7" }} 
                                                >
                                                    Tolak
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Alasan Penolakan</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleDeny}>
                                                    <div className="grid w-full gap-1.5">
                                                        <Textarea
                                                            id="notes"
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                        />
                                                        <p className="text-sm text-muted-foreground">
                                                            Tuliskan alasan penolakan pengajuan
                                                        </p>
                                                    </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button" className="mr-2 shadow-md h-8 w-[20%]" style={{ background: "#D1D5DB", color: "#3758C7" }}>Kembali</Button>
                                                    <Button 
                                                        type="submit"
                                                        variant="primary"
                                                        className="text-white h-8 w-[20%]"
                                                        style={{ background: "#4F46E5" }}
                                                        disabled={loadingStatus[currentApplicantId]}
                                                      >
                                                        {loadingStatus[currentApplicantId] ? (
                                                          <Hearts height="15" width="15" color="#ffffff" ariaLabel="hearts-loading" />
                                                        ) : (
                                                          'Simpan'
                                                        )}
                                                    </Button>
                                                </DialogFooter>

                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="primary" onClick={handleAccept} className="text-white h-8 w-[15%]" style={{ background: "#4F46E5" }}>Setujui</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </>
    )
}
