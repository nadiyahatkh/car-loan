"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { fetchUsers, removeUsers } from "../apiService";
import { Hearts } from "react-loader-spinner";

export default function UserManagement() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [data, setData] = useState([])
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1)

    useEffect(() => {
      const loadData = async () => {
        try {
          const usersData = await fetchUsers({ token, page });
          setData(usersData.data.data);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };
      if (token) {
        loadData();
      }
    }, [token, page]);

    const handleDelete = async () => {
      setIsLoading(true)
      try {
        await removeUsers({ id: selectedUserId, token });
        setIsDeleteAlertOpen(false);
        setData((prevData) => prevData.filter((user) => user.id !== selectedUserId)); // Hapus user dari data setelah berhasil menghapus
      } catch (error) {
        console.error('Gagal menghapus data:', error);
      } finally {
        setIsLoading(false);
    }
    };
    
    const openDeleteAlert = (userId) => {
      setSelectedUserId(userId);
      setIsDeleteAlertOpen(true);
    };

    // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
                                <TableHead className="">Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((user) => (
                                <TableRow key={user.user}>
                                    <TableCell className="">
                                    <div className="flex items-center space-x-4">
                                      <img
                                        src={user.path} // Replace with actual image path or placeholder
                                        alt={user.Fullname}
                                        className="rounded-full w-10 h-10"
                                      />
                                      <div>
                                        <p className="text-base font-semibold">{user.Fullname}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                      </div>
                                    </div>
                                    </TableCell>
                                    <TableCell>{user.rolename}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" onClick={() => openDeleteAlert(user.id)} className="mr-2 h-8 w-[15%] border bg-gray-200" style={{ color: "#3758C7" }} >Hapus</Button>
                                        <Button variant="primary" className="text-white h-8 w-[15%]" style={{ background: "#4F46E5" }}>
                                          <Link href={`/user-management/update-user/${user.id}`}>
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
                                                  <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Apakah anda yakin ingin menghapus item.
                                                  </AlertDialogDescription>
                                                </div>
                                              </div>
                                              </AlertDialogHeader>
                                              <hr className="w-full" />
                                            <AlertDialogFooter className="w-full">
                                              <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)} className="font-semibold">Kembali</AlertDialogCancel>
                                              <AlertDialogAction 
                                                onClick={handleDelete} 
                                                className="bg-red-600 text-white"
                                              >
                                                  {isLoading ? (
                                                            <Hearts
                                                            height="20"
                                                            width="20"
                                                            color="#ffffff"
                                                            ariaLabel="loading"
                                                            />
                                                        ) : (
                                                            "Hapus"
                                                        )}
                                              </AlertDialogAction>
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

                </Card>
            </div>
        </div>
    )
}