'use client'
import React, { useState, useEffect } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAlert } from "@/context/AlertContext";

interface Student {
    id: string;
    name: string;
    rollNumber: string;
    team: string;
}

interface AddStudentProps {
    setIsAddDialogOpen: (open: boolean) => void;
    editStudent?: Student;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (open: boolean) => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ setIsAddDialogOpen, editStudent, isEditDialogOpen, setIsEditDialogOpen }) => {
    const [category, setCategory] = useState<{ id: number; name: string }[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [newStudent, setNewStudent] = useState({ id: "", name: "", rollNumber: "", team: "" });
    const { showAlert } = useAlert();
    console.log("editStudent", editStudent)
    console.log("editStudent", isEditDialogOpen)
    const handleAddStudent = async () => {
        console.info("clicked")
        try {
            const response = await fetch('/api/student', {
                method: isEditDialogOpen ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent)
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || 'Failed to add student');
                throw new Error(data.error || 'Failed to add student');


            } else {
                setNewStudent({ id: "", name: "", rollNumber: "", team: "" });
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                showAlert({
                    title: "Success",
                    message: "Student Created Successfully!",
                    type: "success"
                })
                return data.student;
            }
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    };



    const getCategory = async () => {

        try {
            const response = await fetch('/api/category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add student');
            }
            setCategory(data.category);

        } catch (error) {
            console.error('Error getting category:', error);
            throw error;
        }
    };


    useEffect(() => {
        getCategory();
        if (isEditDialogOpen && editStudent) {
            setNewStudent({
                id: editStudent?.id || "",
                name: editStudent?.name || "",
                rollNumber: editStudent?.rollNumber || "",
                team: editStudent?.team || ""
            });
        }
    }, [editStudent, isEditDialogOpen]);
    return (
        <>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditDialogOpen ? "Edit Student" : "Add new Student"}</DialogTitle>
                    <DialogDescription>
                        {isEditDialogOpen ? "Edit the student details" : "Add a new student to the system"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {errorMsg ? <Label htmlFor="error-msg" className="text-red-500 bg-red-50 py-2 px-2 rounded">{errorMsg}</Label    > : <></>}
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
                        <Label htmlFor="rollno">Roll Number</Label>
                        <Input
                            id="rollno"
                            value={newStudent.rollNumber}
                            onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                            placeholder="Enter student's roll number"
                        />
                    </div>
                    <div className="grid gap-2 w-full">
                        <Label htmlFor="team">Team</Label>
                        <Select

                            value={newStudent.team}
                            onValueChange={(value: string) => setNewStudent({ ...newStudent, team: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                                {category.map((item) => (
                                    <SelectItem key={item?.id} value={item?.name}>{item?.name}</SelectItem>
                                ))}

                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddStudent}>{isEditDialogOpen ? "Save Changes" : "Save"}</Button>
                </DialogFooter>
            </DialogContent>
        </>
    )
}

export default AddStudent