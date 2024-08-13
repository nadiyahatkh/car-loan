import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SubmissionAdmin() {
    const invoices = [
        {
          invoice: "INV001",
          paymentStatus: "Paid",
          paymentMethod: "Credit Card",
        },
        {
          invoice: "INV002",
          paymentStatus: "Pending",
          paymentMethod: "PayPal",
        },
        {
          invoice: "INV003",
          paymentStatus: "Unpaid",
          paymentMethod: "Bank Transfer",
        },
        {
          invoice: "INV004",
          paymentStatus: "Paid",
          paymentMethod: "Credit Card",
        },
        {
          invoice: "INV005",
          paymentStatus: "Paid",
          paymentMethod: "PayPal",
        },
        {
          invoice: "INV006",
          paymentStatus: "Pending",
          paymentMethod: "Bank Transfer",
        },
        {
          invoice: "INV007",
          paymentStatus: "Unpaid",
          paymentMethod: "Credit Card",
        },
      ]
    return (
        <div className="w-full max-w-7xl mx-auto">
    <div className="flex items-center space-x-3 mb-5">
        
        <Card className="rounded-none flex relative">
            <div className="absolute top-2 left-2 bg-gray-200 p-2 rounded-sm">
                <p className="text-sm">Available Now</p>
            </div>
            <div className="flex flex-col p-4 pt-12">
                <p className="font-bold text-sm">Avanza Veloz 2022</p>
            </div>
            <img 
                src="veloc.png" 
                alt="veloc" 
                className="h-24 w-55 ml-auto mt-4" 
            />
        </Card>

        <Card className="rounded-none flex relative">
            <div className="absolute top-2 left-2 bg-gray-200 p-2 rounded-sm">
                <p className="text-sm">Available Now</p>
            </div>
            <div className="flex flex-col p-4 pt-12">
                <p className="font-bold text-sm">Mobilio 2018</p>
            </div>
            <img 
                src="mobilio.png" 
                alt="mobilio" 
                className="h-24 w-55 ml-auto mt-4" 
            />
        </Card>
    </div>

    <div className="flex items-center space-x-3 mb-5">
        <Card className="rounded-none flex relative w-full">
            <CardHeader>
                Pengajuan MObil
            </CardHeader>
        </Card>
    </div>
</div>
    );
}
