'use client'
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { CheckCheck, FolderXIcon, LoaderCircle, XCircleIcon } from "lucide-react";
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
import { id as localeId } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/submission-admin/status-filter";
import { statuses } from "@/components/submission-admin/constans";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


export default function SubmissionAdmin() {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState({});
  const { data: session } = useSession();
  const token = session?.user?.token;
  const currentAdminId = session?.user?.id;
  const [cars, setCars] = useState([])
  const [data, setData] = useState([])
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('')
  const [pendingSearch, setPendingSearch] = useState('');
  const [currentApplicantId, setCurrentApplicantId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [statusFilter, setStatusFilter] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState();
  const [page, setPage] = useState(1)
  const [exportData, setExportData] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
  const defaultDate = {
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  };

  const [date, setDate] = useState(defaultDate);

  const submissionData = async () => {
    try {
      const start_date = date.from ? format(date.from, 'yyyy-MM-dd') : '';
      const end_date = date.to ? format(date.to, 'yyyy-MM-dd') : '';
      const applicantData = await fetchApplicantAdmin({
        token,
        start_date,
        end_date,
        search,
        status: statusFilter,
        page,
        car_id: selectedCarId,
        exportData: false
      });
      console.log('Fetched Applicants:', applicantData.dataApplicant);
      console.log('Fetched Cars:', applicantData.car);
      setData(applicantData.dataApplicant);
      setCars(applicantData.car);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetchApplicantAdmin({
        token,
        start_date: date.from ? format(date.from, 'yyyy-MM-dd') : '',
        end_date: date.to ? format(date.to, 'yyyy-MM-dd') : '',
        search,
        status: statusFilter,
        page,
        car_id: selectedCarId,
        exportData: true
      });
  
      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'applicants.xlsx'); // Ensure this matches your backend filename
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          console.error('Unexpected content type');
        }
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  
  
  
  
  
  
  useEffect(() => {
      if (token) {
        submissionData();
        handleExport()
      }
    }, [token, date, search, statusFilter, page, selectedCarId]);


    // const handleExport = () => {
    //   console.log(handleExport)
    //   setExportData(true); // Set state exportData menjadi true
    //   submissionData(); // Panggil fungsi fetch data dengan parameter export aktif
    //   setExportData(false); // Kembalikan state exportData menjadi false setelah selesai
    // }
    

    const handleAccept = async (id) => {
      setLoadingStatus((prevState) => ({ ...prevState, [id]: true }));
      try {
        await acceptApplicant({ id, token });
        submissionData()
      } catch (error) {
        const message = JSON.parse(error.message);
            setErrorMessages(Object.values(message).flat());
            setOpenError(true);
            console.error('Error updating profile:', error);
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
        
        submissionData()
        setNotes('');
        setCurrentApplicantId(null);
        setIsDialogOpen(false);
      } catch (error) {
        const message = JSON.parse(error.message);
            setErrorMessages(Object.values(message).flat());
            setOpenError(true);
            console.error('Error updating profile:', error);
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

      const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setSearch(pendingSearch);
        }
      };

      const handleOnChangeSearch = (e) => {
          setPendingSearch(e.target.value);
          if (e.target.value === "") {
              setSearch(""); // Trigger search reset when input is cleared
          }
      };

      const filteredData = data?.filter((applicant) => {
        console.log('Selected Car ID:', selectedCarId);
        console.log('Applicant Car ID:', applicant.car_id);
        const matchesStatus = statusFilter.length === 0 || statusFilter.includes(applicant.status);
        const matchesCarId = selectedCarId ?  applicant.car_id === selectedCarId : true;
        return matchesStatus && matchesCarId;
      });

    

    const handlePageChange = (newPage) => {
      setPage(newPage);
    };

    const handleCarSelection = (carId) => {
      setSelectedCarId(carId);
      // console.log('Selected Car ID:', carId);
      submissionData();
    };
    

    return (
        <div className=" w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-5">
            
        {Array.isArray(cars) && cars.length > 0 ? (
          cars.map((car) => (
            <Card key={car.id} onClick={() => handleCarSelection(car.id)} className="rounded-none flex relative w-full md:w-auto cursor-pointer">
              <div className="absolute top-2 left-2 bg-gray-200 p-2 rounded-sm">
                <p className={`text-sm font-semibold ${car.status_name === "Available" ? "text-green-500" : ""}`}>
                  {car.status_name} {car.borrowed_by === "Tidak Ada" ? " " : `| ${car.borrowed_by}`}
                </p>
                <p className="text-sm">
                {car.expiry_date ? 
                  (() => {
                    const date = new Date(car.expiry_date);
                    return isNaN(date.getTime()) 
                      ? '-' 
                      : format(date, "dd MMMM yyyy, HH:mm 'WIB'", { locale: localeId });
                  })()
                  : '-'
                }
                </p>
              </div>
              <div className="flex flex-col p-4 pt-20">
                <p className="font-bold text-sm">{car.name}</p>
              </div>
              <img 
                src={car.path}
                alt={car.name} 
                className="h-24 w-55 ml-8 mt-4" 
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
                        <DataTableFacetedFilter
                                    
                            title="Status"
                            options={statuses}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />
                        {statusFilter.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={() => setStatusFilter([])}
                                className="h-8 px-2 lg:px-3"
                            >
                                Reset
                                <Cross2Icon className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                  <Input
                        placeholder='Searching...'
                        value={pendingSearch}
                        onChange={handleOnChangeSearch}
                        onKeyDown={handleSearchKeyDown}
                        className='max-w-sm'
                    />
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
                    <Button variant="solid" onClick={handleExport} className="text-white flex items-center" style={{ background: "#4F46E5" }}>
                            <img src="/folderX.png" alt="Export Icon" className="w-4 h-4" />
                            <div className="text-sm">Export</div>
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
                          <TableHead className="text-sm font-semibold text-black">Mobil</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Status</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Aksi</TableHead>
                          <TableHead className="text-sm font-semibold text-black">Approvals</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredData?.length > 0 ? (
                            filteredData.map((applicant) => (
                          <TableRow key={applicant.id} className="cursor-pointer" onClick={() => handleRowClick(applicant.id)}>
                              <TableCell className="text-sm">{applicant.purpose}</TableCell>
                              <TableCell className="text-sm">
                              {applicant.submission_date ? format(new Date(applicant.submission_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: localeId }) : '-'}
                              </TableCell>
                              <TableCell className="text-sm">
                              {applicant.expiry_date ? format(new Date(applicant.expiry_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: localeId }) : '-'}
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
                              <TableCell>
                                {applicant.car_name}
                              </TableCell>
                              <TableCell className="">
                               {applicant.status === 'Process' ? (
                                  <div className="flex items-center space-x-2">
                                    <CheckCheck className="w-4 h-4 text-green-500" />
                                    <p className="text-sm font-semibold text-green-500">Process</p>
                                  </div>
                                ) : applicant.status === 'Rejected' ? (
                                  <div className="flex items-center space-x-2">
                                    <XCircleIcon className="w-4 h-4 text-red-500" />
                                    <p className="text-sm font-semibold text-red-500">Rejected</p>
                                  </div>
                                ) : applicant.status === 'Pending' ? (
                                    <div className="flex items-center space-x-2">
                                    <LoaderCircle className="w-4 h-4 text-black" />
                                    <p className="text-sm font-semibold text-black">Pending</p>
                                  </div>
                                ) : applicant.status === 'completed' ? (
                                  <div className="flex items-center space-x-2">
                                      <CheckCheck className="w-4 h-4 text-black" />
                                      <p className="text-sm font-semibold text-black">Completed</p>
                                  </div>
                              ) : (
                                  <p className="text-sm font-semibold">{applicant.status}</p>
                                )}
                              </TableCell>
                              <TableCell>
                                {applicant.status === 'Pending' &&
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
                                }
                              </TableCell>

                              <TableCell className="text-sm">
                                            {applicant.admin_approvals?.length > 0 ? (
                                              applicant.admin_approvals.map((approval) => (
                                                <div key={approval.id} className="flex items-center space-x-2">
                                                  <p className="font-semibold text-black">
                                                    {approval.admin_name}:
                                                  </p>
                                                  {approval.approval_status === "Approved" ? (
                                                    <p className="text-green-500">Approved</p>
                                                  ) : approval.approval_status === "Rejected" ? (
                                                    <p className="text-red-500">Rejected</p>
                                                  ) : (
                                                    <p className="text-yellow-500">Pending</p>
                                                  )}
                                                </div>
                                              ))
                                            ) : (
                                              <p className="text-sm text-gray-500">No approvals yet</p>
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
                <CardFooter className="flex justify-between items-center">
                  <Pagination className="flex w-full justify-between">
                          <PaginationItem className="flex-shrink-0">
                            <PaginationPrevious
                              href="#"
                              onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                            />
                          </PaginationItem>
                          <PaginationContent className="flex items-center space-x-2">
                            {[...Array(10)].map((_, index) => (
                              <PaginationItem key={index}>
                                <PaginationLink
                                  href="#"
                                  isActive={page === index + 1}
                                  onClick={() => handlePageChange(index + 1)}
                                >
                                  {index + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationEllipsis />
                          </PaginationContent>
                          <PaginationItem className="flex-shrink-0">
                            <PaginationNext href="#" onClick={() => handlePageChange(page + 1)} />
                          </PaginationItem>
                        </Pagination>
                    </CardFooter>
                    {/* Success Dialog */}
                    <AlertDialog open={openSuccess} onOpenChange={setOpenSuccess}>
                        <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#DCFCE7" }}>
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <AlertDialogTitle className="">Yeay! Sukses</AlertDialogTitle>
                            <AlertDialogDescription className="">Anda telah berhasil mensetujui applicant ini.</AlertDialogDescription>
                            <AlertDialogAction
                                onClick={() => router.push('/submission')}
                                style={{ background: "#4F46E5" }}
                                className="w-full"
                            >
                                Kembali
                            </AlertDialogAction>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Error Dialog */}
                    <AlertDialog open={openError} onOpenChange={setOpenError}>
                    <AlertDialogContent className="flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: "#FEE2E2" }}>
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </div>
                    <AlertDialogTitle>Yahh! Error</AlertDialogTitle>
                        <AlertDialogDescription>
                        <div className="max-h-32 overflow-y-auto font-semibold">
                            {errorMessages.map((message, index) => (
                            <p key={index} className="text-red-500 italic">{message}</p>
                            ))}
                        </div>
                        </AlertDialogDescription>
                        <AlertDialogAction className="w-full" onClick={() => setOpenError(false)} style={{ background: "#4F46E5" }}>Kembali</AlertDialogAction>
                    </AlertDialogContent>
                    </AlertDialog>
            </Card>
        </div>
        </div>
    );
}
