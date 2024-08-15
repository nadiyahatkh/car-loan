"use client"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { FolderXIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubmissionUser(){
  const [date, setDate] = useState({
      from: new Date(2022, 0, 20),
      to: addDays(new Date(2022, 0, 20), 20),
  });

  const invoices = [
    {
      name: "INV001",
      paymentStatus: "Paid",
      paymentMethod: "Credit Card",
    },
    {
      name: "INV002",
      paymentStatus: "Pending",
      paymentMethod: "PayPal",
    },
    {
      name: "INV003",
      paymentStatus: "Unpaid",
      paymentMethod: "Bank Transfer",
    },
    {
      name: "INV004",
      paymentStatus: "Paid",
      paymentMethod: "Credit Card",
    },
    {
      name: "INV005",
      paymentStatus: "Paid",
      paymentMethod: "PayPal",
    },
    {
      name: "INV006",
      paymentStatus: "Pending",
      paymentMethod: "Bank Transfer",
    },
    {
      name: "INV007",
      paymentStatus: "Unpaid",
      paymentMethod: "Credit Card",
    },
  ]

  return(
      <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3 mb-5">
  <Card className="rounded-none flex relative w-full md:w-auto">
    <div className="absolute top-2 left-2 bg-gray-200 p-2 rounded-sm">
      <p className="text-sm">Available Now</p>
    </div>
    <div className="flex flex-col p-4 pt-12">
      <p className="font-bold text-sm">Avanza Veloz 2022</p>
    </div>
    <img 
      src="/veloc.png" 
      alt="veloc" 
      className="h-24 w-55 ml-auto mt-4" 
    />
  </Card>

  <Card className="rounded-none flex relative w-full md:w-auto mt-3 md:mt-0">
    <div className="absolute top-2 left-2 bg-gray-200 p-2 rounded-sm">
      <p className="text-sm">Available Now</p>
    </div>
    <div className="flex flex-col p-4 pt-12">
      <p className="font-bold text-sm">Mobilio 2018</p>
    </div>
    <img 
      src="/mobilio.png" 
      alt="mobilio" 
      className="h-24 w-55 ml-auto mt-4" 
    />
  </Card>
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
                              {invoices.map((invoice) => (
                                  <TableRow key={invoice.name}>
                                      <TableCell className="font-medium">{invoice.name}</TableCell>
                                      <TableCell>{invoice.paymentStatus}</TableCell>
                                      <TableCell>{invoice.paymentStatus}</TableCell>
                                      <TableCell>{invoice.paymentStatus}</TableCell>
                                      <TableCell className="text-right flex">-</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </div>
      </div>
  );
}
