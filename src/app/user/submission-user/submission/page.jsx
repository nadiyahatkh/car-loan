'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CalendarIcon, Slash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { createApplicantUser, fetchCar } from "@/app/apiService";
import { format } from "date-fns";

const FormSchema = z.object({
    purpose: z.string().min(1, { message: "purpose is required." }),
    car_id: z.string().min(1, { message: "car wajib diisi." }),
    submission_date: z.date().optional(),
    expiry_date: z.date().optional(),
})

export default function Pengajuan() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cars, setCars] = useState([])
    const form = useForm({
        resolver: zodResolver(FormSchema),
    });
    const [date, setDate] = useState()

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

    const onSubmit= async (data) => {
        setIsLoading(true)
        try{
            const result = await createApplicantUser({data, token, path: selectedFiles.map(file => file.file) });
            
            setOpenSuccess(true)
        } catch (error) {
            const message = JSON.parse(error.message)
            setErrorMessages(Object.values(message.error).flat());
            setOpenError(true)
            console.error('Error creating asset:', error);
        } finally {
            setIsLoading(false);
          }
    }
    return (
        <>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user/submission-user">
                            <img src="/home.png" alt="Home" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <div>Pengajuan</div>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4">
                {/* Personal Information Card */}
                <Card className="w-full lg:w-[75%] py-4 rounded-none" style={{ background: "#F9FAFB" }}>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row items-start">
                            {/* Text Section */}
                            <div className="w-full lg:w-[45%]">
                                <div className="text-lg font-semibold">
                                    Pengajuan Peminjaman
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    Silahkan isi form di samping
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="w-full lg:w-[80%] ml-0 lg:ml-auto mt-6 lg:mt-0">
                                <Card>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}>
                                            <CardContent className="pe-9 py-2">
                                                <div className="mb-4">
                                                    <Label className="block text-sm mb-2 font-semibold">Tujuan Peminjaman Mobil</Label>
                                                    <FormField
                                                        control={form.control}
                                                        name="purpose"
                                                        render={({field}) => (
                                                            <Textarea {...field} />

                                                        )}
                                                    
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <p className="font-bold text-sm mb-2">Type Mobil</p>
                                                    <FormField
                                                        control={form.control}
                                                        name="car_id"
                                                        render={({field}) => (
                                                            <RadioGroup defaultValue="comfortable" className="space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-2">
                                                            {cars?.map(car => (
                                                                <div key={car.id} className="space-x-2">
                                                                    <RadioGroupItem value={car.id} id={`car-${car.id}`} />
                                                                    <Label htmlFor={`car-${car.id}`}>{car.name}</Label>
                                                                </div>
                                                            ))}
                                                            </RadioGroup>
                                                            
                                                        )}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex flex-col lg:flex-row justify-between items-center">
                                                        <div className="w-full lg:w-[48%] mb-4 lg:mb-0">
                                                            <Label className="block text-sm mb-2 font-semibold">Waktu Peminjaman</Label>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-[280px] justify-start text-left font-normal",
                                                                        !date && "text-muted-foreground"
                                                                    )}
                                                                    >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                    mode="single"
                                                                    selected={date}
                                                                    onSelect={setDate}
                                                                    initialFocus
                                                                    />
                                                                </PopoverContent>
                                                                </Popover>
                                                        </div>
                                                        <div className="w-full lg:w-[48%]">
                                                            <Label className="block text-sm mb-2 font-semibold">Waktu Pengembalian</Label>
                                                            <Input type="text" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <hr className="mb-4" />
                                            <CardFooter className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-2">
                                                <Button type="button" variant="outline" className="shadow-md h-10 w-full sm:w-auto" style={{ background: "#D1D5DB", color: "#3758C7" }}>Kembali</Button>
                                                <Button type="submit" variant="primary" className="text-white h-10 w-full sm:w-auto" style={{ background: "#4F46E5" }}>Simpan</Button>
                                            </CardFooter>
                                        </form>
                                    </Form>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        
        </>
    )
}
