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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export default function Pengajuan() {
    const [date, setDate] = useState()
    return (
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
                                    <form action="">
                                        <CardContent className="pe-9 py-2">
                                            <div className="mb-4">
                                                <Label className="block text-sm mb-2 font-semibold">Tujuan Peminjaman Mobil</Label>
                                                <Textarea type="text" className="w-full" />
                                            </div>
                                            <div className="mb-4">
                                                <p className="font-bold text-sm mb-2">Type Mobil</p>
                                                <RadioGroup defaultValue="comfortable" className="space-y-2 lg:space-y-0 lg:flex lg:items-center lg:space-x-2">
                                                    <div className="space-x-2">
                                                        <RadioGroupItem value="default" id="r1" />
                                                        <Label htmlFor="r1">Mobilio 2018</Label>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <RadioGroupItem value="comfortable" id="r2" />
                                                        <Label htmlFor="r2">Avanza Veloz 2022</Label>
                                                    </div>
                                                </RadioGroup>
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
                                            <Button variant="outline" className="shadow-md h-10 w-full sm:w-auto" style={{ background: "#D1D5DB", color: "#3758C7" }}>Kembali</Button>
                                            <Button variant="primary" className="text-white h-10 w-full sm:w-auto" style={{ background: "#4F46E5" }}>Simpan</Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
