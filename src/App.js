import React, { useState } from "react"
import { parse } from "papaparse"

import { makeStyles } from "@material-ui/core/styles"
import {
    createMuiTheme,
    ThemeProvider,
    CssBaseline,
    Container,
    Typography,
    Card,
    CardContent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    CircularProgress
} from "@material-ui/core"
import { green, blue, red } from "@material-ui/core/colors"

const DARK_THEME = {
    palette: {
        type: "dark",
        primary: blue,
        secondary: red
    }
}

const useStyles = makeStyles({
    textCenter: {
        textAlign: "center"
    },
    root: {
        minWidth: 275
    },
    highLighted: {
        border: `3px solid ${green[900]}`,
        backgroundColor: green[600]
    },
    mt5: {
        marginTop: "3rem"
    },
    py5: {
        paddingTop: "3rem",
        paddingBottom: "3rem"
    }
})

const humanizeHeaders = str =>
    str
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toUpperCase()

function App() {
    const classes = useStyles()
    const [isDropping, setIsDropping] = useState(false)
    const [isParsing, setIsParsing] = useState(false)

    const [fileInfo, setFileInfo] = useState({
        name: "",
        lastModified: "",
        size: "",
        type: ""
    })
    const [headerFields, setHeaderFields] = useState([])
    const [parsedCSV, setParsedCSV] = useState([])

    return (
        <ThemeProvider theme={createMuiTheme(DARK_THEME)}>
            <CssBaseline />
            <Container maxWidth="lg">
                <div className={`${classes.textCenter} ${classes.mt5}`}>
                    <Typography variant="h3">CSV DND</Typography>
                </div>

                <div
                    // onDragEnter={() => setIsDropping(true)}
                    onDragLeave={() => setIsDropping(false)}
                    onDragOver={e => {
                        e.preventDefault()
                        setIsDropping(true)
                    }}
                    onDrop={e => {
                        e.preventDefault()
                        setIsParsing(true)
                        setIsDropping(false)

                        Array.from(e.dataTransfer.files)
                            .filter(file => file.type === "text/csv")
                            .forEach(async file => {
                                let text = await file.text()

                                const result = parse(text, { header: true })

                                console.log(result)

                                setIsParsing(false)
                                setFileInfo({
                                    name: file.name,
                                    lastModified: file.lastModified,
                                    size: file.size,
                                    type: file.type
                                })
                                setHeaderFields([...result.meta.fields])
                                setParsedCSV([...result.data])
                            })
                    }}
                >
                    <Card
                        className={`${classes.root} ${classes.py5} ${classes.mt5} ${
                            isDropping ? classes.highLighted : ""
                        }`}
                    >
                        <CardContent className={`${classes.textCenter}`}>
                            <Typography variant="h5" color="textSecondary" gutterBottom>
                                Drop a CSV file here
                            </Typography>
                            {fileInfo.name ? (
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    {fileInfo.name}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className={classes.mt5}>
                    {isParsing ? (
                        <div className={classes.textCenter}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <TableContainer component={Paper} elevation={4}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headerFields.map((header, index) => (
                                            <TableCell key={`${header}-${index}`}>{humanizeHeaders(header)}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parsedCSV.map((content, index) => (
                                        <TableRow key={`content-${index}`}>
                                            {headerFields.map((header, index) => (
                                                <TableCell key={`content-${header}-${index}`}>
                                                    {content[header]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>

                <ul></ul>
            </Container>
        </ThemeProvider>
    )
}

export default App
