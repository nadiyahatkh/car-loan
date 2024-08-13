import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { HomeIcon } from "@radix-ui/react-icons";
import { Slash } from "lucide-react";

export default function AddUser(){
    return(
        <div className="w-full max-w-7xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user-management" ><HomeIcon /></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                         <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <div>Add User</div>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
        </div>
    )
}