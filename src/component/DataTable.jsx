import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";

export default function DataTable({
                                      columns,
                                      rows,
                                  }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((col) => (
                        <TableCell key={col}>
                            {col}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {rows.map((row, idx) => (
                    <TableRow key={idx}>
                        {Object.values(row).map(
                            (value, i) => (
                                <TableCell key={i}>
                                    {value}
                                </TableCell>
                            )
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}