import {
    Button
} from "@mui/material";

export default function Patients() {
    return (
        <>
            <div className="flex justify-between mb-5">
                <h1 className="text-3xl font-bold">
                    Patients
                </h1>

                <Button
                    variant="contained"
                >
                    Add Patient
                </Button>
            </div>
        </>
    );
}