"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function UserManagement() {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

    const invoices = [
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
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center">
                <Card className="rounded-none w-full"> 
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            {/* Left section */}
                            <div>
                                <p className="title font-manrope font-bold text-lg">User Manajaemen</p>
                                <p className="text-muted-foreground text-sm">
                                A list of all the users in your account including their name, title, email and role.
                                </p>
                            </div>
                            {/* Right section */}
                            <div className="flex items-center space-x-4">
                                {/* Add Asset Button */}
                                <Button variant="solid" className="text-white" style={{ background: "#4F46E5" }}>
                                    <Link href="./user-management/add-user">
                                        Add User
                                    </Link>
                                </Button>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[100px]">Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                <TableRow key={invoice.invoice}>
                                    <TableCell className="font-medium">{invoice.name}</TableCell>
                                    <TableCell>{invoice.paymentStatus}</TableCell>
                                    <TableCell className="text-right flex justify-end">
                                        <Button variant="outline" onClick={() => setIsDeleteAlertOpen(true)} className="mr-2 shadow-md h-8 w-[15%]" style={{ background: "#D1D5DB", color: "#3758C7" }} >Hapus</Button>
                                        <Button variant="primary" className="text-white h-8 w-[15%]" style={{ background: "#4F46E5" }}>
                                          <Link href="/user-management/update-user">
                                                Edit
                                          </Link>
                                        </Button>
                                        <AlertDialog open={isDeleteAlertOpen} onClose={() => setIsDeleteAlertOpen(false)}>
                                          <AlertDialogContent>
                                            <AlertDialogHeader className="">
                                            <div className="flex items-start">
                                                {/* Icon */}
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                                                  <TriangleAlert className="text-red-600" />
                                                </div>

                                                {/* Title and Description */}
                                                <div className="ml-4">
                                                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Anda bisa saja ingin menolak pengajuan ini
                                                  </AlertDialogDescription>
                                                </div>
                                              </div>
                                              </AlertDialogHeader>
                                              <hr className="w-full" />
                                            <AlertDialogFooter className="bg-gray-100 w-full">
                                              <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)} className="font-semibold">Kembali</AlertDialogCancel>
                                              <AlertDialogAction className="bg-red-600 text-white">Hapus</AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                    </CardContent>
                      <hr className="mb-4" />
                    <CardFooter className="flex w-full">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem className="">
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              2
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">8</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              9
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">10</PaginationLink>
                          </PaginationItem>
                          <PaginationItem className="flex justify-end">
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}