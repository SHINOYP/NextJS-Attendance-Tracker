"use client";
import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Download } from "lucide-react";
import ManageStudents from "./ManageStudents";

// Define proper interfaces
interface Student {
    id: string;
    name: string;
    email: string;
    role: string;
    Category?: string;
    rollno?: string;
}

interface AttendanceRecord {
    date: string;
    data: {
        [studentId: string]: boolean;
    };
}

// Updated sample attendance data with string IDs to match MongoDB IDs
const sampleAttendance: AttendanceRecord[] = [
    {
        date: "2025-03-15",
        data: {
            "67df116ced7554a2db5a1997": true, // Shinoy
            "67df117ced7554a2db5a1999": false, // ram
        },
    },
    {
        date: "2025-03-14",
        data: {
            "67df116ced7554a2db5a1997": true,
            "67df117ced7554a2db5a1999": true,
        },
    },
    {
        date: "2025-03-13",
        data: {
            "67df116ced7554a2db5a1997": false,
            "67df117ced7554a2db5a1999": true,
        },
    },
];

export default function CoachViewPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [selectedDate, setSelectedDate] = useState("2025-03-15");
    const [activeTab, setActiveTab] = useState("view");
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(sampleAttendance);
    const [students, setStudents] = useState<Student[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [teamFilter, setTeamFilter] = useState("All");

    // Get attendance for selected date
    const getAttendanceForDate = () => {
        return (
            attendanceData.find((item) => item.date === selectedDate)?.data || {}
        );
    };

    // Filter students based on search and team
    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (student.rollno?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
        const matchesTeam = selectedTeam === "All" || student.Category === selectedTeam;
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
            // Ensure students have rollno property for search functionality
            const studentsWithRollNo = data.students.map((student: Student, index: number) => ({
                ...student,
                rollno: student.rollno || `S${index + 1}` // Generate rollno if not present
            }));
            setStudents(studentsWithRollNo);
        } catch (error) {
            console.error("Error getting students:", error);
            throw error;
        }
    };

    // Function to mark attendance (for future implementation)
    const markAttendance = (studentId: string, isPresent: boolean) => {
        const currentDate = selectedDate;
        setAttendanceData(prevData => {
            // Find if we already have an entry for this date
            const dateIndex = prevData.findIndex(item => item.date === currentDate);

            if (dateIndex >= 0) {
                // Update existing entry
                const newData = [...prevData];
                newData[dateIndex] = {
                    ...newData[dateIndex],
                    data: {
                        ...newData[dateIndex].data,
                        [studentId]: isPresent
                    }
                };
                return newData;
            } else {
                // Create new entry for this date
                return [
                    ...prevData,
                    {
                        date: currentDate,
                        data: {
                            [studentId]: isPresent
                        }
                    }
                ];
            }
        });
    };

    // Generate report data for export
    const generateReportData = () => {
        if (!startDate || !endDate) return null;

        // Filter attendance by date range
        const reportAttendance = attendanceData.filter(item => {
            return item.date >= startDate && item.date <= endDate;
        });

        // Filter students by team if needed
        const reportStudents = students.filter(student => {
            return teamFilter === "All" || student.Category === teamFilter;
        });

        return {
            dateRange: { startDate, endDate },
            team: teamFilter,
            students: reportStudents.map(student => ({
                id: student.id,
                name: student.name,
                rollno: student.rollno || "",
                team: student.Category || "Unassigned",
                percentage: calculateAttendancePercentage(student.id),
                days: reportAttendance.map(day => ({
                    date: day.date,
                    present: day.data[student.id] === true
                }))
            }))
        };
    };

    const exportReport = () => {
        const reportData = generateReportData();
        if (!reportData) {
            alert("Please select start and end dates for the report");
            return;
        }

        // In a real application, you would implement actual export functionality here
        // This is just a placeholder
        console.log("Exporting report:", reportData);
        alert("Report export functionality would be implemented here");
    };

    useEffect(() => {
        getStudents();
    }, [activeTab]);

    return (
        <div className="flex h-screen w-full bg-gray-100">
            <AppSidebar userRole="coach" className="h-screen" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <div className="mx-auto max-w-6xl">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <TabsList>
                                    <TabsTrigger value="view">View Attendance</TabsTrigger>
                                    <TabsTrigger value="manage">Manage Students</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* View Attendance Tab */}
                            <TabsContent value="view" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Attendance Records</CardTitle>
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
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="pl-8 w-48"
                                                />
                                            </div>
                                        </div>

                                        <div className="border rounded-md">
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
                                                            Attendance
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Attendance %
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredStudents.length > 0 ? (
                                                        filteredStudents.map((student) => {
                                                            const attendance = getAttendanceForDate();
                                                            const isPresent = student?.id && attendance[student.id] === true;

                                                            return (
                                                                <tr key={student.id}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {student.rollno || '-'}
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
                                            </table>
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
                                        <Button
                                            className="flex items-center gap-2"
                                            onClick={exportReport}
                                        >
                                            <Download className="h-4 w-4" />
                                            Export Report
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="manage" className="space-y-4">
                                <ManageStudents
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    filteredStudents={filteredStudents.map(student => ({
                                        id: student.id,
                                        name: student.name,
                                        rollno: student.rollno || "",
                                        team: student.Category || "Unassigned"
                                    }))}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}