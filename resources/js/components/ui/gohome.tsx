import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GoHome({ href = "/", label = "Volver" }) {
    return (
        <div className="ml-5 mt-24">
            <Link href={href}>
                <Button variant="outline">
                    <ArrowLeft />
                    {label}
                </Button>
            </Link>
        </div>
    );
}