"use client";
import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Download, UserPlus, Edit, Trash } from "lucide-react";

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

// Sample attendance data
const sampleAttendance = [
    { date: "2025-03-15", data: { 1: true, 2: true, 3: false, 4: true, 5: true, 6: false, 7: true, 8: true } },
    { date: "2025-03-14", data: { 1: true, 2: true, 3: true, 4: false, 5: true, 6: true, 7: false, 8: true } },
    { date: "2025-03-13", data: { 1: false, 2: true, 3: true, 4: true, 5: false, 6: true, 7: true, 8: false } },
];

export default function CoachViewPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [selectedDate, setSelectedDate] = useState("2025-03-15");
    const [students, setStudents] = useState(sampleStudents);
    const [newStudent, setNewStudent] = useState({ name: "", rollNumber: "", team: "" });
    const [activeTab, setActiveTab] = useState("view");
    const [attendanceData, setAttendanceData] = useState(sampleAttendance);
    const [editingStudent, setEditingStudent] = useState<{ id: number; name: string; rollNumber: string; team: string } | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

    // Add new student
    const handleAddStudent = () => {
        if (newStudent.name && newStudent.rollNumber && newStudent.team) {
            setStudents([
                ...students,
                {
                    id: students.length + 1,
                    name: newStudent.name,
                    rollNumber: newStudent.rollNumber,
                    team: newStudent.team
                }
            ]);
            setNewStudent({ name: "", rollNumber: "", team: "" });
            setIsAddDialogOpen(false);
        }
    };

    // Edit student
    const handleEditStudent = () => {
        if (editingStudent && editingStudent.name && editingStudent.rollNumber && editingStudent.team) {
            setStudents(
                students.map(student =>
                    student.id === editingStudent.id ? editingStudent : student
                )
            );
            setIsEditDialogOpen(false);
        }
    };

    // Delete student
    const handleDeleteStudent = (studentId: number) => {
        if (confirm("Are you sure you want to delete this student?")) {
            setStudents(students.filter(student => student.id !== studentId));
        }
    };

    // Generate attendance report
    const generateAttendanceReport = () => {
        alert("Attendance report would be generated here!");
        // In a real app, you would generate a CSV or PDF report
    };

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
                                        <Button onClick={generateAttendanceReport} className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Export Report
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            {/* Manage Students Tab */}
                            <TabsContent value="manage" className="space-y-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Manage Students</CardTitle>
                                            <CardDescription>
                                                Add, edit or remove students from the system
                                            </CardDescription>
                                        </div>
                                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="flex items-center gap-2">
                                                    <UserPlus className="h-4 w-4" />
                                                    Add Student
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add New Student</DialogTitle>
                                                    <DialogDescription>
                                                        Add a new student to the attendance system
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="name">Full Name</Label>
                                                        <Input
                                                            id="name"
                                                            value={newStudent.name}
                                                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                                            placeholder="Enter student's full name"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="rollNumber">Roll Number</Label>
                                                        <Input
                                                            id="rollNumber"
                                                            value={newStudent.rollNumber}
                                                            onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                                                            placeholder="Enter student's roll number"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="team">Team</Label>
                                                        <Select
                                                            value={newStudent.team}
                                                            onValueChange={(value: string) => setNewStudent({ ...newStudent, team: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select team" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Football">Football</SelectItem>
                                                                <SelectItem value="Basketball">Basketball</SelectItem>
                                                                <SelectItem value="Swimming">Swimming</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                                    <Button onClick={handleAddStudent}>Add Student</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
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
                                                            Actions
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
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"> {student.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {student.team}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Dialog open={isEditDialogOpen && editingStudent?.id === student?.id} onOpenChange={(open) => {
                                                                            setIsEditDialogOpen(open);
                                                                            if (open) setEditingStudent(student);
                                                                        }}>
                                                                            <DialogTrigger asChild>
                                                                                <Button variant="outline" size="sm">
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent>
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Edit Student</DialogTitle>
                                                                                    <DialogDescription>
                                                                                        Update student information
                                                                                    </DialogDescription>
                                                                                </DialogHeader>
                                                                                <div className="grid gap-4 py-4">
                                                                                    <div className="grid gap-2">
                                                                                        <Label htmlFor="edit-name">Full Name</Label>
                                                                                        <Input
                                                                                            id="edit-name"
                                                                                            value={editingStudent?.name || ''}
                                                                                            onChange={(e) => setEditingStudent(editingStudent ? { ...editingStudent, name: e.target.value } : null)}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="grid gap-2">
                                                                                        <Label htmlFor="edit-rollNumber">Roll Number</Label>
                                                                                        <Input
                                                                                            id="edit-rollNumber"
                                                                                            value={editingStudent?.rollNumber || ''}
                                                                                            onChange={(e) => {
                                                                                                if (editingStudent) {
                                                                                                    setEditingStudent({ ...editingStudent, rollNumber: e.target.value });
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="grid gap-2">
                                                                                        <Label htmlFor="edit-team">Team</Label>
                                                                                        <Select
                                                                                            value={editingStudent?.team || ''}
                                                                                            onValueChange={(value) => {
                                                                                                if (editingStudent) {
                                                                                                    setEditingStudent({ ...editingStudent, team: value });
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <SelectTrigger id="edit-team">
                                                                                                <SelectValue placeholder="Select team" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent>
                                                                                                <SelectItem value="Football">Football</SelectItem>
                                                                                                <SelectItem value="Basketball">Basketball</SelectItem>
                                                                                                <SelectItem value="Swimming">Swimming</SelectItem>
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    </div>
                                                                                </div>
                                                                                <DialogFooter>
                                                                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                                                                    <Button onClick={handleEditStudent}>Save Changes</Button>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                        <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteStudent(student.id)}>
                                                                            <Trash className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
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
                                    <CardFooter className="flex justify-between">
                                        <div className="text-sm text-gray-500">
                                            Total students: {students.length}
                                        </div>
                                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="flex items-center gap-2">
                                                    <UserPlus className="h-4 w-4" />
                                                    Add Student
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                    </CardFooter>
                                </Card>

                                {/* Bulk Import Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bulk Import Students</CardTitle>
                                        <CardDescription>
                                            Import multiple students from a CSV file
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                            <div className="mb-4">
                                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                                    <UserPlus className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <label htmlFor="file-upload" className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                    Upload a CSV file
                                                </label>
                                                <input id="file-upload" name="file-upload" type="file" accept=".csv" className="sr-only" />
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                or drag and drop
                                            </p>
                                            <p className="mt-2 text-xs text-gray-500">
                                                CSV file should contain columns: name, rollNumber, team
                                            </p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full">Import Students</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}