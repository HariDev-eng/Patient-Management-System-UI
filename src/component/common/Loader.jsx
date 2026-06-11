import {
    CircularProgress
} from "@mui/material";

export default function Loader() {

    return (
        <div className="flex justify-center p-10">

            <CircularProgress />

        </div>
    );
}