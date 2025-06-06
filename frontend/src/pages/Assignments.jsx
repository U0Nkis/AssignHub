import React, { useState, useEffect } from 'react';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment, getStudents } from '../api/api';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', file: null, studentIds: [] });
    const [editAssignment, setEditAssignment] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchAssignments();
        if (role === 'teacher') {
            fetchStudents();
        }
    }, [page]);

    const fetchAssignments = async () => {
        const data = await getAssignments(page, limit);
        setAssignments(data.assignments);
        setTotal(data.total);
    };

    const fetchStudents = async () => {
        const data = await getStudents();
        setStudents(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newAssignment.title);
        formData.append('description', newAssignment.description);
        formData.append('student_ids', JSON.stringify(newAssignment.studentIds));
        if (newAssignment.file) {
            formData.append('file', newAssignment.file);
        }
        await createAssignment(formData);
        fetchAssignments();
        setNewAssignment({ title: '', description: '', file: null, studentIds: [] });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateAssignment(editAssignment.id, {
            title: editAssignment.title,
            description: editAssignment.description,
            student_ids: editAssignment.studentIds,
        });
        fetchAssignments();
        setEditAssignment(null);
    };

    const handleDelete = async (id) => {
        await deleteAssignment(id);
        fetchAssignments();
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Задания</h2>
            {role === 'teacher' && (
                <div className="mb-6">
                    <h3 className="text-xl mb-2">{editAssignment ? 'Редактировать задание' : 'Создать задание'}</h3>
                    <form onSubmit={editAssignment ? handleUpdate : handleSubmit}>
                        <input
                            type="text"
                            placeholder="Название"
                            className="w-full p-2 mb-2 border rounded"
                            value={editAssignment ? editAssignment.title : newAssignment.title}
                            onChange={(e) =>
                                editAssignment
                                    ? setEditAssignment({ ...editAssignment, title: e.target.value })
                                    : setNewAssignment({ ...newAssignment, title: e.target.value })
                            }
                        />
                        <textarea
                            placeholder="Описание"
                            className="w-full p-2 mb-2 border rounded"
                            value={editAssignment ? editAssignment.description : newAssignment.description}
                            onChange={(e) =>
                                editAssignment
                                    ? setEditAssignment({ ...editAssignment, description: e.target.value })
                                    : setNewAssignment({ ...newAssignment, description: e.target.value })
                            }
                        />
                        <select
                            multiple
                            className="w-full p-2 mb-2 border rounded"
                            value={editAssignment ? editAssignment.studentIds : newAssignment.studentIds}
                            onChange={(e) =>
                                editAssignment
                                    ? setEditAssignment({
                                        ...editAssignment,
                                        studentIds: Array.from(e.target.selectedOptions, (option) => parseInt(option.value)),
                                    })
                                    : setNewAssignment({
                                        ...newAssignment,
                                        studentIds: Array.from(e.target.selectedOptions, (option) => parseInt(option.value)),
                                    })
                            }
                        >
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.username}
                                </option>
                            ))}
                        </select>
                        {!editAssignment && (
                            <input
                                type="file"
                                className="mb-2"
                                onChange={(e) => setNewAssignment({ ...newAssignment, file: e.target.files[0] })}
                            />
                        )}
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            {editAssignment ? 'Сохранить' : 'Создать'}
                        </button>
                        {editAssignment && (
                            <button
                                type="button"
                                className="ml-2 bg-gray-500 text-white p-2 rounded"
                                onClick={() => setEditAssignment(null)}
                            >
                                Отмена
                            </button>
                        )}
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="border p-4 rounded">
                        <h3 className="text-xl">{assignment.title}</h3>
                        <p>{assignment.description}</p>
                        {assignment.file_path && (
                            <a href={assignment.file_path} className="text-blue-500">
                                Скачать файл
                            </a>
                        )}
                        {role === 'teacher' && (
                            <div className="mt-2">
                                <button
                                    onClick={() => setEditAssignment(assignment)}
                                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => handleDelete(assignment.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                    Предыдущая
                </button>
                <span>
          Страница {page} из {Math.ceil(total / limit)}
        </span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * limit >= total}
                    className="bg-gray-500 text-white p-2 rounded ml-2"
                >
                    Следующая
                </button>
            </div>
        </div>
    );
};

export default Assignments;
