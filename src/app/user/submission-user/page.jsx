"use client"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCheck, CheckCheckIcon, FolderXIcon, RefreshCcwIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchApplicantUser, fetchCar } from "@/app/apiService";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/submission-user/status-filter";
import { statuses } from "@/components/submission-user/constants";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

export default function SubmissionUser(){
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [data, setData] = useState([])
    const [cars, setCars] = useState([])
    const [search, setSearch] = useState('')
    const [pendingSearch, setPendingSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState();
    const [page, setPage] = useState(1)

    const defaultDate = {
        from: new Date(2024, 0, 1),
        to: new Date(2024, 11, 31)
      };
    
    const [date, setDate] = useState(defaultDate);

  //   useEffect(() => {
  //     const loadData = async () => {
  //       try {
  //         const response = await fetchCar({ token });
  //         setCars(response.data.data);
  //       } catch (error) {
  //         console.error('Failed to fetch data:', error);
  //       }
  //     };
  //     if (token) {
  //       loadData();
  //     }
  //     }, [token]);

        const submissionData = async () => {
          try {
            const start_date = date.from ? format(date.from, 'yyyy-MM-dd') : '';
            const end_date = date.to ? format(date.to, 'yyyy-MM-dd') : '';
            const applicantData = await fetchApplicantUser({ 
              token, 
              start_date, 
              end_date, 
              search, 
              status: statusFilter, 
              page, 
              car_id: selectedCarId, 
            });
            console.log(applicantData)
            setData(applicantData.Applicant);
            setCars(applicantData.car);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
        
        useEffect(() => {
          if (token) {
            submissionData();
          }
        }, [token, date, search, statusFilter, page, selectedCarId]);

        const handleRowClick = (id) => {
            router.push(`/user/detail-submission/${id}`);
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
          const matchesStatus = statusFilter.length === 0 || statusFilter.includes(applicant.status);
          const matchesCarId = selectedCarId ?  applicant.car_id === selectedCarId : true;
          return matchesStatus && matchesCarId;
        });

        const handlePageChange = (newPage) => {
            setPage(newPage);
          };

          const handleCarSelection = (carId) => {
            setSelectedCarId(carId);
            // Optionally trigger data refresh
            submissionData();
          };      

  return(
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-x-3 mb-5">
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
                            : format(date, "dd MMMM yyyy, HH:mm 'WIB'", { locale: id });
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
                    className="h-24 w-55 ml-auto mt-4" 
                  />
                </Card>
              ))
            ) : (
              <p>No cars available.</p>  // Fallback if cars array is empty
            )}
          </div>



          <div className="flex flex-col">
              <Card className="rounded-none w-full px-4 md:px-9">
                  <CardHeader>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                          <div>
                              <p className="font-bold text-sm">Pengajuan Peminjaman Mobil</p>
                              <p className="text-muted-foreground text-xs">
                                  Daftar semua pengajuan termasuk pengaju, waktu peminjaman dan tujuan.
                              </p>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">

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
                                              "w-full md:w-[300px] justify-start text-left font-normal",
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
                              <Button variant="solid" className="text-white w-full md:w-auto flex items-center" style={{ background: "#4F46E5" }}>
                                  <Link href="/user/submission-user/submission" className="flex items-center space-x-2">
                                      <div className="text-sm">Buat Pengajuan</div>
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
                                  <TableHead className="text-sm font-semibold text-black">Mobil</TableHead>
                                  <TableHead className="text-sm font-semibold text-black">Status</TableHead>
                                  <TableHead className="text-sm font-semibold text-black">Catatan</TableHead>
                                  <TableHead className="text-sm font-semibold text-black">Aksi</TableHead>
                                  <TableHead className="text-sm font-semibold text-black">Approvals</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                          {filteredData?.length > 0 ? (
                                filteredData?.map((applicant) => (
                                        <TableRow key={applicant.id} className="cursor-pointer" onClick={() => handleRowClick(applicant.id)}>
                                            <TableCell className="text-sm">{applicant.purpose}</TableCell>
                                            <TableCell className="text-sm">
                                                {applicant.submission_date ? format(new Date(applicant.submission_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id }) : '-'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {applicant.expiry_date ? format(new Date(applicant.expiry_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id }) : '-'}
                                            </TableCell>
                                            <TableCell>
                                              {applicant.car_name}
                                            </TableCell>
                                            <TableCell >
                                                {applicant.status === 'Disetujui' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <CheckCheck className="w-4 h-4 text-green-500" />
                                                            <p className="text-sm font-semibold text-green-500">Disetujui</p>
                                                        </div>
                                                        ) : applicant.status === 'DiTolak' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                            <p className="text-sm font-semibold text-red-500">Ditolak</p>
                                                        </div>
                                                        ) : applicant.status === 'Belum Disetujui' ? (
                                                            <div className="flex items-center space-x-2">
                                                                <RefreshCcwIcon className="w-4 h-4 text-black" />
                                                                <p className="text-sm font-semibold text-black">Belum Disetujui</p>
                                                            </div>
                                                            ) : (
                                                                <p className="text-sm font-semibold">{applicant.status}</p>
                                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm">{applicant.notes || '-'}</TableCell>
                                            <TableCell className="text-sm">
                                            {(applicant.status !== 'Disetujui' && applicant.status !== 'DiTolak') && (
                                                <Button
                                                    variant="primary"
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    className="text-white h-8 w-20"
                                                    style={{ background: "#4F46E5" }}
                                                >
                                                    <Link href={`/user/submission-user/update-submission/${applicant.id}`}>
                                                        Edit
                                                    </Link>
                                                </Button>
                                            )}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                            {applicant.approvals?.length > 0 ? (
                                              applicant.approvals.map((approval) => (
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
                                
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-sm">
                                        No submissions available.
                                    </TableCell>
                                </TableRow>
                            )}

                          </TableBody>
                      </Table>
                  </CardContent>
                  <CardFooter className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
  {/* Previous Button */}
  <PaginationPrevious
    onClick={() => handlePageChange(page - 1)}
    disabled={page === 1}
    className="px-4 py-2 text-sm"
  >
    Previous
  </PaginationPrevious>

  {/* Pagination Items */}
  <PaginationContent className="flex flex-wrap justify-center md:justify-start space-x-2">
    {Array.from({ length: 5 }).map((_, index) => (
      <PaginationItem key={index}>
        <PaginationLink
          isActive={page === index + 1}
          onClick={() => handlePageChange(index + 1)}
          className="px-2 py-1 text-sm cursor-pointer"
        >
          {index + 1}
        </PaginationLink>
      </PaginationItem>
    ))}
  </PaginationContent>

  {/* Next Button */}
  <PaginationNext
    onClick={() => handlePageChange(page + 1)}
    disabled={page === 5} // Example limit of 5 pages
    className="px-4 py-2 text-sm"
  >
    Next
  </PaginationNext>
</CardFooter>

              </Card>
          </div>
      </div>
  );
}
