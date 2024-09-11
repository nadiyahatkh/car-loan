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
import { Form, FormControl, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { fetchApplicantUserDetail, fetchCar, updateApplicantUser } from "@/app/apiService";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id as localeId } from 'date-fns/locale';

import { TimePicker } from "@/components/time-picker/time-picker";
import { useParams, useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Hearts } from "react-loader-spinner";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";

const FormSchema = z.object({
    purpose: z.string().min(1, { message: "purpose is required." }),
    car_id: z.preprocess((val) => Number(val), z.number().min(1, { message: "Car wajib diisi." })),
    submission_date: z.date().optional(),
    expiry_date: z.date().optional(),
})

export default function UpdatePengajuan() {
    const { id: submissionId } = useParams();
    const { data: session } = useSession();
    const token = session?.user?.token;
    const router = useRouter()
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cars, setCars] = useState([])
    const [carId, setCarId] = useState()
    const form = useForm({
        resolver: zodResolver(FormSchema),
        car_id: "",
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
        const submissionDate = data.submission_date ? format(data.submission_date, "yyyy-MM-dd'T'HH:mm:ss") : null;
        const expiryDate = data.expiry_date ? format(data.expiry_date, "yyyy-MM-dd'T'HH:mm:ss") : null;

        const payload = {
            ...data,
            submission_date: submissionDate,
            expiry_date: expiryDate,
            car_id: Number(data.car_id) || Number(carId),
        };
        setIsLoading(true)
        try{
            const result = await updateApplicantUser({data: payload, token, id: submissionId });
            setOpenSuccess(true)
        } catch (error) {
            const message = JSON.parse(error.message);
            setErrorMessages(Object.values(message.errors).flat());
            setOpenError(true);
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            
          if (token && submissionId) {
            const response = await fetchApplicantUserDetail({ token, id: submissionId });
            form.setValue('car_id', String(response.data.dataApplicant.car.id), {shouldValidate: true})
            form.setValue('submission_date', new Date(response.data.dataApplicant.submission_date), {shouldValidate: true})
            form.setValue('expiry_date', new Date(response.data.dataApplicant.expiry_date), {shouldValidate: true})
            form.setValue('purpose', response.data.dataApplicant.purpose, {shouldValidate: true})
            setCarId(response.data.dataApplicant.car.id);
          }
        };
    
        fetchData();
      }, [token, submissionId]);
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
                        <div>Update Pengajuan</div>
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
                                    Update Pengajuan Peminjaman
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
                                                        render={({ field }) => (
                                                            <RadioGroup
                                                                value={form.watch("car_id")} // Ensure the value matches
                                                                onValueChange={(value) => {
                                                                    form.setValue("car_id", value);
                                                                    setCarId(value);
                                                                }}
                                                                className="space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-2"
                                                            >
                                                                {cars?.map((car) => (
                                                                    <div key={car.id} className="space-x-2">
                                                                        <RadioGroupItem value={String(car.id)} id={`car-${car.id}`} />
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
                                                    <Label className="block text-sm mb-2">Waktu Peminjaman</Label>
                                                    <FormField
                                                        control={form.control}
                                                        name="submission_date"
                                                        render={({ field }) => (
                                                            <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value && 'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value instanceof Date && !isNaN(field.value.getTime())
                                                                        ? format(field.value, "d MMMM yyyy, HH:mm 'WIB'", { locale: localeId }) 
                                                                        : <span>Pilih Waktu Peminjaman</span>
                                                                    }
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <DatePicker
                                                                selected={field.value}
                                                                onChange={(date) => field.onChange(date)}
                                                                showTimeSelect
                                                                dateFormat="Pp"
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                minDate={new Date()}
                                                                inline
                                                                />
                                                            </PopoverContent>
                                                            </Popover>
                                                        )}
                                                        />
                                                    </div>
                                                    <div className="w-full lg:w-[48%]">
                                                    <Label className="block text-sm mb-2">Waktu Pengembalian</Label>
                                                    <FormField
                                                        control={form.control}
                                                        name="expiry_date"
                                                        render={({ field }) => (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal',
                                                                    !field.value && 'text-muted-foreground'
                                                                )}
                                                            >
                                                                {field.value instanceof Date && !isNaN(field.value.getTime())
                                                                    ? format(field.value, "d MMMM yyyy, HH:mm 'WIB'", { locale: localeId }) 
                                                                    : <span>Pilih Waktu pengembalian</span>
                                                                }
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                            </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                            <DatePicker
                                                                selected={field.value}
                                                                onChange={(date) => field.onChange(date)} // Update value on change
                                                                showTimeSelect
                                                                dateFormat="Pp"
                                                                timeFormat="HH:mm"
                                                                timeIntervals={15}
                                                                minDate={new Date()}
                                                                inline
                                                            />
                                                            </PopoverContent>
                                                        </Popover>
                                                        )}
                                                    />
                                                    </div>
                                                </div>
                                                </div>
                                                {/* <div className="mb-4">
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
                                                </div> */}
                                            </CardContent>
                                            <hr className="mb-4" />
                                            <CardFooter className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-2">
                                                <Button type="button" variant="outline" className="shadow-md h-10 w-full sm:w-auto hover:bg-gray-800" style={{ background: "#D1D5DB", color: "#3758C7" }}>
                                                    <Link href="/user/submission-user" className="w-full">
                                                     Kembali
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    type="submit" 
                                                    variant="primary" 
                                                    className="text-white h-10 w-full sm:w-auto" 
                                                    style={{ background: "#4F46E5" }}
                                                >
                                                    {isLoading ? (
                                                            <Hearts
                                                            height="20"
                                                            width="20"
                                                            color="#ffffff"
                                                            ariaLabel="loading"
                                                            />
                                                        ) : (
                                                            "Simpan"
                                                        )}
                                                </Button>
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
                                                        <AlertDialogDescription className="">Anda telah berhasil meng-update applicant.</AlertDialogDescription>
                                                        <AlertDialogAction
                                                            onClick={() => router.push('/user/submission-user')}
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
