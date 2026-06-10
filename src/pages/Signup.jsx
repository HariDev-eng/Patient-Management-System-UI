import {
    Button,
    Card,
    CardContent,
    TextField,
} from "@mui/material";

import { useState } from "react";
import { signup } from "../api/authApi";

export default function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const submit = async (e) => {
        e.preventDefault();

        await signup(form);
    };

    return (
        <div className="h-screen flex justify-center items-center bg-slate-100">
            <Card className="w-[400px]">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-5">
                        Create Account
                    </h2>

                    <form
                        onSubmit={submit}
                        className="space-y-4"
                    >
                        <TextField
                            fullWidth
                            label="Username"
                        />

                        <TextField
                            fullWidth
                            label="Email"
                        />

                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                        >
                            Signup
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}