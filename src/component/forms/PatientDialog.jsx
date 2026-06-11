import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";

export default function PatientDialog({
                                          open,
                                          onClose,
                                          form,
                                          setForm,
                                          onSubmit
                                      }) {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle>
                Add Patient
            </DialogTitle>

            <DialogContent>

                <TextField
                    margin="dense"
                    label="First Name"
                    fullWidth
                    value={form.firstName}
                    onChange={e =>
                        setForm({
                            ...form,
                            firstName:
                            e.target.value
                        })
                    }
                />

                <TextField
                    margin="dense"
                    label="Last Name"
                    fullWidth
                    value={form.lastName}
                    onChange={e =>
                        setForm({
                            ...form,
                            lastName:
                            e.target.value
                        })
                    }
                />

                <TextField
                    margin="dense"
                    label="Email"
                    fullWidth
                />

                <TextField
                    margin="dense"
                    label="Phone"
                    fullWidth
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={onSubmit}
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>
    );
}