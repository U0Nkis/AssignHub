import React, { useState, useEffect } from 'react';
import { getSubmissions, submitAssignment, gradeSubmission, runCode } from '../api/api';
import CodeEditor from '../components/CodeEditor';

const Submission = () => {
    const [submissions, setSubmissions] = useState([]);
    const [code, setCode] = useState('');
    const [stdin, setStdin] = useState('');
    const [languageId, setLanguageId] = useState(71); // Python
    const [runResult, setRunResult] = useState(null);
    const [grade, setGrade] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 10;
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchSubmissions();
    }, [page]);

    const fetchSubmissions = async () => {
        const data = await getSubmissions(page, limit);
        setSubmissions(data.submissions);
        setTotal(data.total);
    };

    const handleSubmit = async (assignmentId) => {
        await submitAssignment(assignmentId, { code });
        fetchSubmissions();
        setCode('');
    };

    const handleGrade = async (submissionId) => {
        await gradeSubmission(submissionId, { grade: parseFloat(grade) });
        fetchSubmissions();
        setGrade('');
    };

    const handleRun = async () => {
        const result = await runCode({ source_code: code, language_id: languageId, stdin });
        setRunResult(result);
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Решения</h2>
            {role === 'student' && (
                <div className="mb-6">
                    <CodeEditor code={code} setCode={setCode} />
                    <input
                        type="text"
                        placeholder="Входные данные"
                        className="w-full p-2 mb-2 border rounded"
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                    />
                    <select
                        className="w-full p-2 mb-2 border rounded"
                        value={languageId}
                        onChange={(e) => setLanguageId(parseInt(e.target.value))}
                    >
                        <option value={71}>Python</option>
                        <option value={62}>Java</option>
                        <option value={63}>JavaScript</option>
                        <option value={74}>C++</option>
                    </select>
                    <button
                        onClick={() => handleSubmit(submissions[0]?.assignment_id)}
                        className="bg-blue-500 text-white p-2 rounded mr-2"
                    >
                        Отправить решение
                    </button>
                    <button
                        onClick={handleRun}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Запустить код
                    </button>
                    {runResult && (
                        <div className="mt-4">
                            <h3 className="text-lg">Результат выполнения</h3>
                            <pre className="bg-gray-100 p-2 rounded">
                Вывод: {runResult.stdout || 'Отсутствует'}
                                Ошибки: {runResult.stderr || 'Отсутствуют'}
                                Статус: {runResult.description}
              </pre>
                        </div>
                    )}
                </div>
            )}
            <div className="space-y-4">
                {submissions.map((submission) => (
                    <div key={submission.id} className="border p-4 rounded">
                        <p>Идентификатор задания: {submission.assignment_id}</p>
                        <pre className="bg-gray-100 p-2 rounded">{submission.code}</pre>
                        {submission.grade && <p>Оценка: {submission.grade}</p>}
                        {role === 'teacher' && (
                            <div className="mt-2">
                                <input
                                    type="number"
                                    placeholder="Оценка (0-100)"
                                    className="p-2 border rounded mr-2"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                />
                                <button
                                    onClick={() => handleGrade(submission.id)}
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Выставить оценку
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
                    whiteness="bg-gray-500 text-white p-2 rounded mr-2"
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

export default Submission;
