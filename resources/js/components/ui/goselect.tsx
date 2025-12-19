import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GoSelect({ href = "/cotizar", label = "Volver" }) {
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