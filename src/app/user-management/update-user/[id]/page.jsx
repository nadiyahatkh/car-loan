'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUsersDetail, updateUsers } from "@/app/apiService";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Hearts } from "react-loader-spinner";

const FormSchema = z.object({
    FirstName: z.string().min(1, { message: "FirstName is required." }),
    LastName: z.string().min(1, { message: "LastName is required." }),
    email: z.string().email({ message: "Invalid email address." }).min(1, { message: "Email is required." }),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    path: z.any().optional(),
});

export default function UpdateUser (){
    const { id } = useParams()
    const { data: session } = useSession();
    const token = session?.user?.token;
    const [profileImage, setProfileImage] = useState();
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Buat salinan data dan hapus password/password_confirmation jika tidak diisi
            const filteredData = { ...data };
    
            if (!data.password) {
                delete filteredData.password;
            }
    
            if (!data.password_confirmation) {
                delete filteredData.password_confirmation;
            }
    
            

            console.log('Filtered Data:', filteredData);
    
            const result = await updateUsers({ data: filteredData, token });
            setOpenSuccess(true);
        } catch (error) {
            const message = JSON.parse(error.message);
            setErrorMessages(Object.values(message.errors).flat());
            setOpenError(true);
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        const fetchData = async () => {
            if(token && id) {
                const response = await fetchUsersDetail({ token, id });
                form.setValue('FirstName', response.data.FirstName)
                form.setValue('LastName', response.data.LastName)
                form.setValue('email', response.data.email)
                form.setValue('password', response.data.password)
                form.setValue('password_confirmation', response.data.password_confirmation)
                setProfileImage(response.data.path);
            }
        };
        fetchData()
      }, [token, id])

      const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
            form.setValue('path', e.target.files);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user-management">
                            <img src="/home.png" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <div>Edit User</div>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4">
                {/* Personal Information Card */}
                <Card className="w-[75%] py-4 rounded-none" style={{ background: "#F9FAFB" }}>
                    <CardContent>
                        <div className="flex flex-row items-start">
                            {/* Text Section */}
                            <div className="w-[45%]">
                                <div className="text-lg font-semibold">
                                    Personal Information
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    Use a permanent address where you can receive mail.
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="w-[80%] ml-auto">
                                <Card>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}>
                                            <CardContent className="py-4">
                                                    <div className="mb-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="w-full mr-2">
                                                            <Label className="block text-sm mb-2 font-semibold">First Name</Label>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="FirstName"
                                                                    render={({field}) => (
                                                                        <>
                                                                            <Input {...field} type="text" />
                                                                            {form.formState.errors.FirstName && (
                                                                                <FormMessage type="error" className="italic">{form.formState.errors.FirstName.message}</FormMessage>
                                                                            )}
                                                                        </>

                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="w-full ml-2">
                                                                <Label className="block text-sm mb-2 font-semibold">Last Name</Label>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="LastName"
                                                                    render={({field}) => (
                                                                        <>
                                                                            <Input {...field} type="text" />
                                                                            {form.formState.errors.LastName && (
                                                                                <FormMessage type="error" className="italic">{form.formState.errors.LastName.message}</FormMessage>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="w-full mr-2">
                                                                <Label className="block text-sm mb-2 font-semibold">Email Address</Label>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="email"
                                                                    render={({field}) => (
                                                                        <>
                                                                            <Input {...field} type="email" />
                                                                            {form.formState.errors.email && (
                                                                                <FormMessage type="error" className="italic">{form.formState.errors.email.message}</FormMessage>
                                                                            )}
                                                                        </>

                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <p className="font-bold text-sm mb-2">Photo</p>
                                                        <div className="flex items-center">
                                                        <img src={profileImage} name="path" alt="Profile Image" className="w-12 h-12 rounded-full mr-4" />
                                                            <input
                                                                name="path"
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                id="fileInput"
                                                                onChange={handleProfileImageChange}
                                                            />
                                                                <button type="button" onClick={() => document.getElementById('fileInput').click()} className="px-4 py-2 font-semibold shadow-sm border rounded-md">Change</button>
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="flex justify-between items-center">
                                                            <div className="w-full mr-2">
                                                                <Label className="block text-sm mb-2 font-semibold">Password</Label>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="password"
                                                                    render={({ field }) => (
                                                                    <>
                                                                    <Input {...field} placeholder="****" type="password" />
                                                                    {form.formState.errors.password && (
                                                                        <FormMessage type="error" className="italic">{form.formState.errors.password.message}</FormMessage>
                                                                        )}
                                                                    </>
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="w-full ml-2">
                                                                <Label className="block text-sm mb-2 font-semibold">Password Confirmation</Label>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="password_confirmation"
                                                                    render={({ field }) => (
                                                                    <>
                                                                    <Input {...field} placeholder="****" type="password" />
                                                                    {form.formState.errors.password_confirmation && (
                                                                        <FormMessage type="error" className="italic">{form.formState.errors.password_confirmation.message}</FormMessage>
                                                                        )}
                                                                    </>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                            </CardContent>
                                                <hr className="mb-4" />
                                                <CardFooter className="flex justify-end">
                                                    <Button variant="outline" type="button" className="mr-2 shadow-md h-8 w-[15%]" style={{ background: "#D1D5DB", color: "#3758C7" }}>Kembali</Button>
                                                    <Button 
                                                        variant="primary" 
                                                        type="submit" 
                                                        className="text-white h-8 w-[15%]" 
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
                                                        <AlertDialogDescription className="">Anda telah berhasil menambahkan user baru.</AlertDialogDescription>
                                                        <AlertDialogAction
                                                            onClick={() => router.push('/user-management')}
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
    )
}