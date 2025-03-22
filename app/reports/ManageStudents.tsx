"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Edit, Trash } from "lucide-react";
// import { useAlert } from "@/context/AlertContext";
import AddStudent from "./AddStudent";

interface ManageStudentsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredStudents: { id: number; name: string; rollno: string; team: string }[];
}

const ManageStudents: React.FC<ManageStudentsProps> = ({ searchQuery, setSearchQuery, filteredStudents }) => {
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [editingStudent, setEditingStudent] = useState<{ id: number; name: string; rollno: string; team: string } | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // const { showAlert } = useAlert();



    const handleEditStudent = () => {
        if (editingStudent && editingStudent.name && editingStudent.rollno && editingStudent.team) {
            // setStudents(
            //     students.map(student =>
            //         student.id === editingStudent.id ? editingStudent : student
            //     )
            // );
            setIsEditDialogOpen(false);
        }
    };

    // Delete student
    const handleDeleteStudent = (studentId: number) => {
        console.log("Delete student with id:", studentId);
        if (confirm("Are you sure you want to delete this student?")) {
            //  setStudents(students.filter(student => student.id !== studentId));
        }
    };



    return (


        <>
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
                        <AddStudent setIsAddDialogOpen={setIsAddDialogOpen} />

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
                                                {student.rollno}
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
                                                                    <Label htmlFor="edit-rollno">Roll Number</Label>
                                                                    <Input
                                                                        id="edit-rollno"
                                                                        value={editingStudent?.rollno || ''}
                                                                        onChange={(e) => {
                                                                            if (editingStudent) {
                                                                                setEditingStudent({ ...editingStudent, rollno: e.target.value });
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
                        Total students: 10
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
            <Card  >
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
        </>
    )
}

export default ManageStudents