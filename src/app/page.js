'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navbar from "./navbar";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      {/* <div className="top-section">
        <Navbar />

        <div className="max-w-screen-xl mx-auto px-4 py-2 z-[100]">
        <div className="grid gap-4 grid-cols-2">
          <Card className="rounded-none p-2">
            <CardContent>
              <div className="flex justify-between">
                <p>Available Now</p>
                <img src="veloc.png" alt="veloc" className="" />

              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none">
            <CardContent>
            <div className="flex justify-between">
                <p>Available Now</p>
                <img src="veloc.png" alt="veloc" className="" />

              </div>
            </CardContent>
          </Card>
        </div>

        </div>
      </div>
      <div className="bottom-section p-6">
        <div className="max-w-screen-xl mx-auto px-4">
          <Card className="p-10 rounded-none mb-4">
            <CardHeader>
              <p>Pengajuan Peminjaman Mobil</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell>
                        <div className="flex justify-between">
                          <Button>Tolak</Button>
                          <Button>Tolak</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            
            </CardContent>
          </Card>
        </div>
      </div> */}
      </>
  );
}
