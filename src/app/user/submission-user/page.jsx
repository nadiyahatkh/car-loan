"use client"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCheckIcon, FolderXIcon, RefreshCcwIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchApplicantUser, fetchCar } from "@/app/apiService";
import { useSession } from "next-auth/react";

export default function SubmissionUser(){
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [data, setData] = useState([])
    const[cars, setCars] = useState([])
  const [date, setDate] = useState({
      from: new Date(2022, 0, 20),
      to: addDays(new Date(2022, 0, 20), 20),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchCar({ token });
        setCars(response.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    if (token) {
      loadData();
    }
    }, [token]);

    useEffect(() => {
        const submissionData = async () => {
          try {
            const applicantData = await fetchApplicantUser({ token });
            console.log(applicantData); 
            setData(applicantData.Applicant.data);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
      
          if (token) {
            submissionData();
          }
        }, [token]);

  return(
      <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3 mb-5">
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
                                  <TableHead className="text-sm font-semibold text-black">Status</TableHead>
                                  <TableHead className="text-sm font-semibold text-black">Catatan</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                          {Array.isArray(data) && data.length > 0 ? (
                                data.map((applicant) => {
                                    let statusIcon;
                                    let statusTextClass;

                                    switch (applicant.status) {
                                        case "Disetujui":
                                            statusIcon = <CheckCheckIcon className="h-4 w-4 text-green-500" />;
                                            statusTextClass = "text-green-500";
                                            break;
                                        case "Ditolak":
                                            statusIcon = <XCircle className="h-4 w-4 text-red-500" />;
                                            statusTextClass = "text-red-500";
                                            break;
                                        case "Belum Disetujui":
                                            statusIcon = <RefreshCcwIcon className="h-4 w-4 font-semibold text-black" />;
                                            statusTextClass = "font-semibold text-black";
                                            break;
                                        default:
                                            statusIcon = null;
                                            statusTextClass = "";
                                            break;
                                    }

                                    return (
                                        <TableRow key={applicant.id}>
                                            <TableCell className="text-sm">{applicant.purpose}</TableCell>
                                            <TableCell className="text-sm">
                                                {applicant.submission_date ? format(new Date(applicant.submission_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id }) : '-'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {applicant.expiry_date ? format(new Date(applicant.expiry_date), "dd MMMM yyyy, HH:mm 'WIB'", { locale: id }) : '-'}
                                            </TableCell>
                                            <TableCell className={`text-sm flex items-center font-semibold ${statusTextClass}`}>
                                                {statusIcon}{applicant.status}
                                            </TableCell>
                                            <TableCell className="text-sm">{applicant.notes || '-'}</TableCell>
                                        </TableRow>
                                    );
                                })
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
              </Card>
          </div>
      </div>
  );
}
