"use client"
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Edit, Trash } from "lucide-react";
import { useAlert } from "@/context/AlertContext";
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton";
import AddStudent from "./AddStudent";




// Define proper interfaces
interface Student {
    id: string;
    name: string;
    email: string;
    role: string;
    Category?: string;
    rollNumber?: string;
}
export default function Page() {
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [editingStudent, setEditingStudent] = useState<{ id: string; name: string; rollNumber: string; team: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { showAlert } = useAlert();
    const pageSize = 10;



    // const handleEditStudent = () => {
    //     if (editingStudent && editingStudent.name && editingStudent.rollno && editingStudent.team) {
    //         // setStudents(
    //         //     students.map(student =>
    //         //         student.id === editingStudent.id ? editingStudent : student
    //         //     )
    //         // );
    //         setIsEditDialogOpen(false);
    //     }
    // };
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

    // Memoize paginated students
    const paginatedStudents = useMemo(() => {
        const startIndex = (page - 1) * pageSize;
        return filteredStudents.slice(startIndex, startIndex + pageSize);
    }, [filteredStudents, page, pageSize]);

    const handleDeleteStudent = async (studentId: string) => {
        try {
            const response = await fetch(`/api/student?id=${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensures cookies are sent with the request
            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.error || 'Failed to delete student');
            } else {
                showAlert({
                    title: "Success",
                    message: "Student Deleted Successfully!",
                    type: "success"
                })
                getStudents();
                return data.student;
            }
        }
        catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    };

    const handleEditClick = (student: {
        id: string;
        name: string;
        email: string;
        role: string;
        Category?: string;
        rollNumber?: string;
    }) => {
        setEditingStudent({
            id: student.id,
            name: student.name,
            rollNumber: student.rollNumber || "",
            team: student.Category || "Unknown",
        });

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



    useEffect(() => { getStudents(); }, [])



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
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Manage Students</CardTitle>
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
                                        <AddStudent setIsEditDialogOpen={setIsAddDialogOpen} getStudents={getStudents} setIsAddDialogOpen={setIsAddDialogOpen} editStudent={editingStudent || undefined} isEditDialogOpen={isEditDialogOpen} />

                                    </Dialog >
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


                                    <div className="border rounded-md max-h-[60vh] overflow-auto  ">
                                        {isLoading ? (
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
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {paginatedStudents.length > 0 ? (
                                                        paginatedStudents.map((student) => (
                                                            <tr key={student.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {student.rollNumber}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"> {student.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {student.Category}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                                            <DialogTrigger asChild>
                                                                                <Button variant="outline" size="sm" onClick={() => handleEditClick(student)}>
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <AddStudent setIsAddDialogOpen={setIsAddDialogOpen} getStudents={getStudents} editStudent={editingStudent || undefined} isEditDialogOpen={isEditDialogOpen} setIsEditDialogOpen={setIsEditDialogOpen} />
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
                                <CardFooter className="flex justify-between">
                                    <div className="text-sm text-gray-500">
                                        Total students: {students?.length || 0}
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
                            </Card >

                            {/* Bulk Import Section */}
                            <Card className="mt-10"  >
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
                                            CSV file should contain columns: name, rollno, team
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Import Students</Button>
                                </CardFooter>
                            </Card >
                        </div>
                    </main>
                </div>

            </SidebarInset >

        </div>
    )
}
