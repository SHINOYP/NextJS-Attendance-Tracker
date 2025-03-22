"use client";
import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Download } from "lucide-react";
import ManageStudents from "./ManageStudents";


// Sample attendance data
const sampleAttendance = [
    { date: "2025-03-15", data: { 1: true, 2: true, 3: false, 4: true, 5: true, 6: false, 7: true, 8: true } },
    { date: "2025-03-14", data: { 1: true, 2: true, 3: true, 4: false, 5: true, 6: true, 7: false, 8: true } },
    { date: "2025-03-13", data: { 1: false, 2: true, 3: true, 4: true, 5: false, 6: true, 7: true, 8: false } },
];

// Sample student data
const sampleStudents = [
    { id: 1, name: "Alex Johnson", rollNumber: "ST001", team: "Football" },
    { id: 2, name: "Jamie Smith", rollNumber: "ST002", team: "Football" },
    { id: 3, name: "Casey Williams", rollNumber: "ST003", team: "Basketball" },
    { id: 4, name: "Jordan Taylor", rollNumber: "ST004", team: "Basketball" },
    { id: 5, name: "Morgan Brown", rollNumber: "ST005", team: "Swimming" },
    { id: 6, name: "Riley Davis", rollNumber: "ST006", team: "Swimming" },
    { id: 7, name: "Taylor Wilson", rollNumber: "ST007", team: "Football" },
    { id: 8, name: "Sam Martinez", rollNumber: "ST008", team: "Basketball" },
];

export default function CoachViewPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [selectedDate, setSelectedDate] = useState("2025-03-15");

    const [activeTab, setActiveTab] = useState("view");
    const [attendanceData, setAttendanceData] = useState(sampleAttendance);

    const [students, setStudents] = useState(sampleStudents);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [teamFilter, setTeamFilter] = useState("All");

    // Get attendance for selected date
    const getAttendanceForDate = () => {
        return attendanceData.find(item => item.date === selectedDate)?.data || {};
    };



    // Filter students based on search and team
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = selectedTeam === "All" || student.team === selectedTeam;

        return matchesSearch && matchesTeam;
    });


    // Calculate attendance percentage
    const calculateAttendancePercentage = (studentId: number) => {
        let present = 0;
        let total = 0;
        interface AttendanceRecord {
            date: string;
            data: {
                [studentId: number]: boolean;
            };
        }

        attendanceData.forEach((day: AttendanceRecord) => {
            if (day.data[studentId] !== undefined) {
                total++;
                if (day.data[studentId]) {
                    present++;
                }
            }
        });

        return total > 0 ? ((present / total) * 100).toFixed(1) + "%" : "N/A";
    };


    return (
        <div className="flex h-screen w-full bg-gray-100">
            <AppSidebar userRole="coach" className="h-screen" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <div className="mx-auto max-w-6xl">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                                                            // First, ensure attendance is properly typed
                                                            const attendance: { [studentId: number]: boolean } = getAttendanceForDate();

                                                            // Then use this safer version that handles undefined values properly
                                                            const isPresent = student && student.id !== undefined && attendance[student.id] === true;

                                                            return (
                                                                <tr key={student.id}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {student.rollNumber}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {student.name}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {student.team}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        <span className={`px-2 py-1 rounded-full text-xs ${isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                            {isPresent ? 'Present' : 'Absent'}
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
                                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
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
                                        <Button className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Export Report
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            < TabsContent value="manage" className="space-y-4" >

                                <ManageStudents
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}

                                    filteredStudents={filteredStudents}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}