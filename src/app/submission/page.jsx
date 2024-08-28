'use client'
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { CheckCheck, FolderXIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { acceptApplicant, denyApplicant, fetchApplicantAdmin } from "../apiService";
import { useSession } from "next-auth/react";
import { Hearts, TailSpin } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { id } from "date-fns/locale";


export default function SubmissionAdmin() {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState({});
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [cars, setCars] = useState([])
  const [data, setData] = useState([])
  const [notes, setNotes] = useState('');
  const [currentApplicantId, setCurrentApplicantId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const defaultDate = {
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  };

  const [date, setDate] = useState(defaultDate);

  useEffect(() => {
    const submissionData = async () => {
      try {
        const start_date = date.from ? format(date.from, 'yyyy-MM-dd') : '';
        const end_date = date.to ? format(date.to, 'yyyy-MM-dd') : '';
        const applicantData = await fetchApplicantAdmin({ token, start_date, end_date });
        console.log('Data loaded:', applicantData); // Debugging
        setData(applicantData.dataApplicant.data);
        setCars(applicantData.car)
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
      if (token) {
        submissionData();
      }
    }, [token, date]);

    const handleAccept = async (id) => {
      setLoadingStatus((prevState) => ({ ...prevState, [id]: true }));
      try {
        await acceptApplicant({ id, token });
        const applicantData = await fetchApplicantAdmin({ token });
        console.log('Data after accepting:', applicantData); // Debugging
        setData(applicantData.dataApplicant.data);
        setCars(applicantData.car);
      } catch (error) {
        console.error('Error accepting applicant:', error);
      } finally {
        setLoadingStatus((prevState) => ({ ...prevState, [id]: false }));
      }
    };

    const handleDeny = async (event) => {
      event.preventDefault();
      if (!currentApplicantId || !notes) return;
    
      setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: true }));
      try {
        await denyApplicant({ id: currentApplicantId, token, notes });
        const applicantData = await fetchApplicantAdmin({ token });
        console.log('Data after denying:', applicantData); // Debugging
        setData(applicantData.dataApplicant.data);
        setCars(applicantData.car);
        setNotes('');
        setCurrentApplicantId(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error denying applicant:', error);
      } finally {
        setLoadingStatus((prevState) => ({ ...prevState, [currentApplicantId]: false }));
      }
    };
    

      const handleRowClick = (id) => {
        router.push(`/submission/detail-submission/${id}`);
      };

      const resetDateFilter = () => {
        setDate(defaultDate);
      };
    
      const isDateDefault = () => {
        return date.from.getTime() === defaultDate.from.getTime() && date.to.getTime() === defaultDate.to.getTime();
      };

    return (
        <div className=" w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-5">
            
        {Array.isArray(cars) && cars.length > 0 ? (
          cars.map((car) => (
            <Card key={car.id} className="rounded-none flex relative w-full md:w-auto">
              <div className="absolute top-2 left-2 bg-gray-200 p-2 rounded-sm">
                <p className={`text-sm font-semibold ${car.status_name === "Available" ? "text-green-500" : ""}`}>{car.status_name}</p>
              </div>
              <div className="flex flex-col p-4 pt-12">
                <p className="font-bold text-sm">{car.name}</p>
              </div>
              <img 
                src={car.path}
                alt={car.name} 
                className="h-24 w-55 ml-auto mt-4" 
              />
            </Card>
          ))
        ) : (
          <p>No cars available.</p>  // Fallback if cars array is empty
        )}
        </div>

        <div className="flex items-center space-x-3 mb-5">
            <Card className="rounded-none w-full ps-9 pe-8">
                <CardHeader>
                <div className="flex justify-between items-center">
                  {/* Left section */}
                  <div>
                    <p className="title font-manrope font-bold text-sm">Pengajuan Peminjaman Mobil</p>
                    <p className="text-muted-foreground text-xs">
                    Daftar semua pengajuan termasuk pengaju, waktu peminjaman dan tujuan.
                    </p>
                  </div>
                  {/* Right section */}
                  <div className="flex items-center space-x-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>

                    {!isDateDefault() && (
                      <Button variant="outline" className="text-red-500" style={{ color: '#4F46E5', border: 'none' }} onClick={resetDateFilter}>
                          Reset Date
                      </Button>
                    )}
                    <Button variant="solid" className="text-white flex items-center" style={{ background: "#4F46E5" }}>
                        <Link href="./user-management/add-user" className="flex items-center space-x-2">
                            <img src="/folderX.png" alt="Export Icon" className="w-4 h-4" />
                            <div className="text-sm">Export</div>
                        </Link>
                    </Button>
                  </div>
                </div>
                </CardHeader>
                <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead className="text-sm font-semibold text-black">Tujuan</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Waktu Peminjaman</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Waktu Pengembalian</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Peminjaman</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Aksi</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {Array.isArray(data) && data.length > 0 ? (
                            data.map((applicant) => (
                          <TableRow key={applicant.id} className="cursor-pointer" onClick={() => handleRowClick(applicant.id)}>
                              <TableCell className="text-sm">{applicant.purpose}</TableCell>
                              <TableCell className="text-sm">
                              {applicant.submission_date ? format(new Date(applicant.submission_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id }) : '-'}
                              </TableCell>
                              <TableCell className="text-sm">
                              {applicant.expiry_date ? format(new Date(applicant.expiry_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id }) : '-'}
                              </TableCell>
                              <TableCell className="">
                                <div className="flex items-center space-x-4">
                                      <img
                                        src={applicant.path}
                                        alt={applicant.name}
                                        className="rounded-full w-10 h-10"
                                      />
                                      <div>
                                        <p className="text-base font-semibold">{applicant.name}</p>
                                        <p className="text-sm text-muted-foreground">{applicant.email}</p>
                                      </div>
                                    </div>
                              </TableCell>
                              <TableCell className="">
                              {applicant.status === 'Belum Disetujui' ? (
                                  <div className="flex space-x-2">
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentApplicantId(applicant.id); // Set the current applicant ID
                                          }}
                                          className="mr-2 shadow-md h-8 w-[30%]" 
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
                                        <DialogFooter className="">
                                          <Button
                                            type="button" 
                                            variant="outline" 
                                            onClick={(e) => {
                                              e.stopPropagation(); // Stop event bubbling
                                              setIsDialogOpen(false);
                                            }}
                                            className="mr-2 shadow-md h-8 w-[20%]" 
                                            style={{ background: "#D1D5DB", color: "#3758C7" }}
                                          >
                                            Kembali
                                          </Button>
                                          <Button 
                                            type="submit"
                                            variant="primary"
                                            onClick={(e) => e.stopPropagation()}
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
                                    <Button
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Stop event bubbling
                                        handleAccept(applicant.id);
                                      }}
                                      disabled={loadingStatus[applicant.id]} // Disable tombol saat loading
                                      className="mr-2 h-8 w-[30%] text-white"
                                      style={{ background: "#4F46E5" }}
                                    >
                                      {loadingStatus[applicant.id] ? (
                                        <Hearts
                                          height="15"
                                          width="15"
                                          color="#ffffff"
                                          ariaLabel="hearts-loading"
                                        />
                                      ) : (
                                        'Setujui'
                                      )}
                                    </Button>
                                  </div>
                                ) : applicant.status === 'Disetujui' ? (
                                  <div className="flex items-center space-x-2">
                                    <CheckCheck className="w-4 h-4 text-green-500" />
                                    <p className="text-sm font-semibold text-green-500">Disetujui</p>
                                  </div>
                                ) : applicant.status === 'DiTolak' ? (
                                  <div className="flex items-center space-x-2">
                                    <XCircleIcon className="w-4 h-4 text-red-500" />
                                    <p className="text-sm font-semibold text-red-500">Ditolak</p>
                                  </div>
                                ) : (
                                  <p className="text-sm font-semibold">{applicant.status}</p>
                                )}
                              </TableCell>
                          </TableRow>
                          ))
                        ):(
                            <TableRow>
                                    <TableCell colSpan={5} className="text-center text-sm">
                                        No submissions available.
                                    </TableCell>
                                </TableRow>
                          )}
                      </TableBody>
                  </Table>
                </CardContent>
            </Card>
        </div>
        </div>
    );
}
