"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";



interface Student {
    id: string;
    name: string;
    email: string;
    role: string;
    Category?: string;
    rollNumber?: string;
    present?: boolean;
}

export default function TakeAttendancePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [attendanceData, setAttendanceData] = useState<Student[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [result, setResult] = useState<{ error?: string; attendanceMarked?: boolean } | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    // Filter students based on search and team // Filter students based on search and team
    const filteredStudents = attendanceData.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            false;
        const matchesTeam =
            selectedTeam === "All" || student.Category === selectedTeam;
        return matchesSearch && matchesTeam;
    });

    // Memoize paginated students
    const paginatedStudents = useMemo(() => {
        const startIndex = (page - 1) * pageSize;
        return filteredStudents.slice(startIndex, startIndex + pageSize);
    }, [filteredStudents, page, pageSize]);


    const getStudents = async () => {
        try {
            const response = await fetch("/api/student", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch student");
            }

            setAttendanceData(
                data.students.map((student: Student) => ({
                    ...student,
                    present: false,
                }))
            );
        } catch (error) {
            console.error("Error getting students:", error);
            throw error;
        }
    };
    // Handle attendance toggle
    const toggleAttendance = (studentId: string) => {
        console.info("clicked");
        setAttendanceData(
            attendanceData.map((student) =>
                student.id == studentId
                    ? { ...student, present: !student.present }
                    : student
            )
        );

    };

    const saveAttendance = async () => {
        console.log(date);
        const attendancePayload = {
            date: date,
            attendances: attendanceData.map((student) => ({
                studentId: student.id,
                status: student.present ? "PRESENT" : "ABSENT",
            })),
        };
        console.log("tale attem");
        try {
            const response = await fetch("/api/attendance/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(attendancePayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to submit attendance");
            }
            else {
                alert("Attendance submitted successfully!");
                setResult({ attendanceMarked: true });
            }


        } catch (error) {
            console.error("Error submitting attendance:", error);
            alert("Failed to submit attendance.");
        }
    };
    // Handle mark all present
    const markAllPresent = () => {
        setAttendanceData(
            attendanceData.map((student) => {
                const shouldUpdate =
                    selectedTeam === "All" || student.Category === selectedTeam;
                return shouldUpdate ? { ...student, present: true } : student;
            })
        );
    };



    useEffect(() => {
        getStudents();
    }, []);


    // Handle pagination
    const totalPages = useMemo(() =>
        Math.ceil(filteredStudents.length / pageSize),
        [filteredStudents.length, pageSize]);

    const goToNextPage = useCallback(() => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }, [page, totalPages]);

    const goToPrevPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);


    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedTeam]);

    useEffect(() => {
        const checkAttendance = async () => {
            if (!date) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/attendance/submit?date=${date}`);
                const data = await response.json();
                setResult(data);
            } catch (error) {
                console.error("Error checking attendance:", error);
                setResult({ error: "Failed to check attendance" });
            } finally {
                setLoading(false);
            }
        }; checkAttendance();
    }, [date]);



    return (
        <div className="flex fle h-screen w-full bg-gray-100">
            <AppSidebar className="h-screen bg-red-600 mr-60" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                        <div className="mx-auto max-w-6xl">
                            <div className="flex md:flex-row flex-col items-center justify-between mb-6">
                                <h1 className="text-2xl mb-4 font-bold">Take Attendance</h1>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="date">Date:</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="date"
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Student Attendance</CardTitle>
                                    <CardDescription>
                                        Mark students present or absent for today&nbsp;s practice
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 mb-6">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                placeholder="Search students..."
                                                className="pl-9"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Select team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Teams</SelectItem>
                                                <SelectItem value="Football">Football</SelectItem>
                                                <SelectItem value="Basketball">Basketball</SelectItem>
                                                <SelectItem value="Swimming">Swimming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={markAllPresent} variant="outline">
                                            Mark All Present
                                        </Button>
                                    </div>

                                    <div className="border overflow-auto rounded-md">
                                        {loading ? (
                                            <>
                                                {Array.from({ length: 8 }).map((_, index) => (
                                                    <Skeleton key={index} className="min-w-full h-10 my-2" />
                                                ))}
                                            </>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Roll No.
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Team
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Present
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white w-full divide-y divide-gray-200">
                                                    {paginatedStudents?.length > 0 ? (
                                                        paginatedStudents?.map((student) => (
                                                            <tr key={student?.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {student?.rollNumber}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {student?.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {student?.Category}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <Checkbox
                                                                        checked={student?.present}
                                                                        disabled={result?.attendanceMarked}
                                                                        onCheckedChange={() =>
                                                                            toggleAttendance(student?.id)
                                                                        }
                                                                        id={`student-${student?.id}`}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                                            >
                                                                No students found matching your criteria
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    {/* Pagination controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-gray-700">
                                                Showing page {page} of {totalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={goToPrevPage}
                                                    disabled={page === 1}
                                                    className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={goToNextPage}
                                                    disabled={page === totalPages}
                                                    className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button
                                        onClick={saveAttendance}
                                        className="flex items-center gap-2"
                                        disabled={result?.attendanceMarked}
                                    >
                                        <Save className="h-4 w-4" />
                                        {result?.attendanceMarked ? "Attendance Already Marked" : "Save Attendance"}

                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </main>
                </div>
            </SidebarInset>

        </div>
    );
}


