import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function UserManagement() {
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
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex items-center">
                <Card className="rounded-none w-full p-4"> 
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            {/* Left section */}
                            <div>
                                <p className="title font-manrope font-bold text-xl">User Manajaemen</p>
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
                                <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                <TableRow key={invoice.invoice}>
                                    <TableCell className="font-medium">{invoice.name}</TableCell>
                                    <TableCell>{invoice.paymentStatus}</TableCell>
                                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}