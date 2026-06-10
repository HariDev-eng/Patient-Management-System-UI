import {
    Button,
    Card,
    CardContent,
    TextField,
} from "@mui/material";

import { useState } from "react";
import { login } from "../api/authApi";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response =
            await login(form);

        localStorage.setItem(
            "token",
            response.data.token
        );
    };

    return (
        <div className="h-screen flex justify-center items-center bg-slate-100">
            <Card className="w-[400px]">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-5">
                        Login
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <TextField
                            fullWidth
                            label="Username"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    username:
                                    e.target.value,
                                })
                            }
                        />

                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password:
                                    e.target.value,
                                })
                            }
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}