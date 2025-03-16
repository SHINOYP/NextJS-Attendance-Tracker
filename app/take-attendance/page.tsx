"use client";
import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Save } from "lucide-react";

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

export default function TakeAttendancePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [attendanceData, setAttendanceData] = useState(
        sampleStudents.map(student => ({ ...student, present: false }))
    );
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Filter students based on search and team
    const filteredStudents = attendanceData.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = selectedTeam === "All" || student.team === selectedTeam;

        return matchesSearch && matchesTeam;
    });

    // Handle attendance toggle
    const toggleAttendance = (studentId: number) => {
        setAttendanceData(
            attendanceData.map(student =>
                student.id === studentId
                    ? { ...student, present: !student.present }
                    : student
            )
        );
    };

    // Handle save attendance
    const saveAttendance = () => {
        // In a real app, you would send this data to your backend
        console.log("Saving attendance for date:", date);
        console.log("Attendance data:", attendanceData);

        // Show success message
        alert("Attendance saved successfully!");
    };

    // Handle mark all present
    const markAllPresent = () => {
        setAttendanceData(
            attendanceData.map(student => {
                const shouldUpdate = selectedTeam === "All" || student.team === selectedTeam;
                return shouldUpdate ? { ...student, present: true } : student;
            })
        );
    };

    return (
        <div className="flex h-screen w-full bg-gray-100">
            <AppSidebar userRole="captain" className="h-screen" />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    <div className="mx-auto max-w-5xl">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">Take Attendance</h1>
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
                                                    Present
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student) => (
                                                    <tr key={student.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {student.rollNumber}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {student.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {student.team}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <Checkbox
                                                                checked={student.present}
                                                                onCheckedChange={() => toggleAttendance(student.id)}
                                                                id={`student-${student.id}`}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No students found matching your criteria
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={saveAttendance} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Attendance
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}