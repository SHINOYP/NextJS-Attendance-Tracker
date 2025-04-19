"use client";
import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
// import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

// Define proper interfaces
interface Student {
    id: string;
    name: string;
    email: string;
    role: string;
    Category?: string;
    rollNumber?: string;
}

interface AttendanceRecord {
    date: string;
    data: {
        [studentId: string]: boolean;
    };
}


export default function CoachViewPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [selectedDate, setSelectedDate] = useState("2025-03-15");
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [teamFilter, setTeamFilter] = useState("All");

    // Get attendance for selected date
    const getAttendanceForDate = () => {
        return (
            attendanceData.find((item) => item.date === selectedDate)?.data || {}
        );
    };

    // Filter students based on search and team
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            false;
        const matchesTeam =
            selectedTeam === "All" || student.Category === selectedTeam;
        return matchesSearch && matchesTeam;
    });

    // Calculate attendance percentage
    const calculateAttendancePercentage = (studentId: string) => {
        let present = 0;
        let total = 0;

        attendanceData.forEach((day) => {
            if (day.data[studentId] !== undefined) {
                total++;
                if (day.data[studentId]) {
                    present++;
                }
            }
        });

        return total > 0 ? ((present / total) * 100).toFixed(1) + "%" : "N/A";
    };

    const getStudents = async () => {
        try {
            setIsLoading(true);
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
            setStudents(data.students);
            setIsLoading(false);
        } catch (error) {
            console.error("Error getting students:", error);
            throw error;
        }
    };

    // const generateReportData = () => {
    //     if (!startDate || !endDate) return null;

    //     const reportAttendance = attendanceData.filter((item) => {
    //         return item.date >= startDate && item.date <= endDate;
    //     });

    //     const reportStudents = students.filter((student) => {
    //         return teamFilter === "All" || student.Category === teamFilter;
    //     });

    //     return {
    //         dateRange: { startDate, endDate },
    //         team: teamFilter,
    //         students: reportStudents.map((student) => ({
    //             id: student.id,
    //             name: student.name,
    //             rollno: student.rollNumber || "",
    //             team: student.Category || "Unassigned",
    //             percentage: calculateAttendancePercentage(student.id),
    //             days: reportAttendance.map((day) => ({
    //                 date: day.date,
    //                 present: day.data[student.id] === true,
    //             })),
    //         })),
    //     };
    // };

    // const exportReport = () => {
    //     const reportData = generateReportData();
    //     if (!reportData) {
    //         alert("Please select start and end dates for the report");
    //         return;
    //     }

    //     // In a real application, you would implement actual export functionality here
    //     // This is just a placeholder
    //     console.log("Exporting report:", reportData);
    //     alert("Report export functionality would be implemented here");
    // };

    const handleDateChange = (date: string) => {
        const value = date
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
            alert("Selected date cannot be in the future.");
            return;
        }
        setSelectedDate(date);
        fetchAttendanceForDate(value)
    };

    const fetchAttendanceForDate = async (date: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/attendance/byDate?date=${date}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch attendance data");
            }

            if (!data.attendanceMarked) {
                alert("No attendance marked for this date.");
                return false;
            }
            const formattedData: { date: string; data: { [key: string]: boolean } } = {
                date,
                data: {}
            };


            data.records.forEach((record: { studentId: string | number; status: string; }) => {
                formattedData.data[record.studentId] = record.status === "PRESENT";
            });


            setAttendanceData(prev => {

                const filtered = prev.filter(item => item.date !== date);

                return [...filtered, formattedData];
            });

            return data.attendanceMarked;
        } catch (error) {
            console.error("Error fetching attendance:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    // Function to fetch attendance data for a date range
    const fetchAttendanceRange = async (start: string, end: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/attendance/range?start=${start}&end=${end}&team=${teamFilter}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch attendance range");
            }

            // Convert the data to our format
            interface DateRecord {
                date: string;
                records: {
                    studentId: string;
                    status: string;
                }[];
            }

            interface FormattedAttendance {
                date: string;
                data: {
                    [studentId: string]: boolean;
                };
            }

            const formattedData: FormattedAttendance[] = data.dates.map((dateRecord: DateRecord) => ({
                date: dateRecord.date,
                data: dateRecord.records.reduce((acc: { [key: string]: boolean }, record) => {
                    acc[record.studentId] = record.status === "PRESENT";
                    return acc;
                }, {})
            }));

            setAttendanceData(formattedData);
            return true;
        } catch (error) {
            console.error("Error fetching attendance range:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            fetchAttendanceRange(startDate, endDate);
        }
    }, [startDate, endDate, teamFilter]);

    return (
        <div className="flex h-screen w-full bg-gray-100">
            <AppSidebar className="h-screen" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />

                </header>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                        <div className="mx-auto max-w-6xl">


                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Attendance Records</CardTitle>
                                    <CardDescription>
                                        View student attendance records and generate reports
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <div className="relative flex-1 min-w-[240px]">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                placeholder="Search students..."
                                                className="pl-9"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Select
                                            value={selectedTeam}
                                            onValueChange={setSelectedTeam}
                                        >
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
                                        <div className="relative">
                                            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                                className="pl-8 w-48"
                                            />
                                        </div>
                                    </div>

                                    <div className="border overflow-auto rounded-md">
                                        {isLoading ? (
                                            <>
                                                {Array.from({ length: 8 }).map((_, index) => (
                                                    <Skeleton key={index} className="min-w-full h-10 my-2" />
                                                ))}
                                            </>
                                        ) : (
                                            <table className="min-w-full divide-y  divide-gray-200">
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
                                                            Attendance
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Attendance %
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y  divide-gray-200">
                                                    {filteredStudents.length > 0 ? (
                                                        filteredStudents.map((student) => {
                                                            const attendance = getAttendanceForDate();
                                                            const isPresent =
                                                                student?.id && attendance[student.id] === true;

                                                            return (
                                                                <tr key={student.id}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {student.rollNumber || "-"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {student.name}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {student.Category || "Unassigned"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        <span
                                                                            className={`px-2 py-1 rounded-full text-xs ${isPresent
                                                                                ? "bg-green-100 text-green-800"
                                                                                : "bg-red-100 text-red-800"
                                                                                }`}
                                                                        >
                                                                            {isPresent ? "Present" : "Absent"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {calculateAttendancePercentage(student.id)}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={5}
                                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                                            >
                                                                No students found matching your criteria
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>)}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div className="flex items-center gap-4">
                                        <Label>Report Range:</Label>
                                        <Input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-40"
                                            placeholder="Start Date"
                                        />
                                        <span>to</span>
                                        <Input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-40"
                                            placeholder="End Date"
                                        />
                                        <Select value={teamFilter} onValueChange={setTeamFilter}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Teams</SelectItem>
                                                <SelectItem value="Football">Football</SelectItem>
                                                <SelectItem value="Basketball">Basketball</SelectItem>
                                                <SelectItem value="Swimming">Swimming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* <Button
                                            className="flex items-center gap-2"
                                            onClick={exportReport}
                                        >
                                            <Download className="h-4 w-4" />
                                            Export Report
                                        </Button> */}
                                </CardFooter>
                            </Card>



                        </div>
                    </main>
                </div>
            </SidebarInset>
        </div>
    );
}
