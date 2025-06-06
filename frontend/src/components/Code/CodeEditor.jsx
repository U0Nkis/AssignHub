import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getLanguageName, getLanguageId, getLanguageTemplate } from '../../utils/code';
import { showSuccess, showError } from '../../utils/notification';

export const CodeEditor = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const languageId = getLanguageId(language);
    if (languageId) {
      setCode(getLanguageTemplate(languageId));
    }
  }, [language]);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setOutput('');

    try {
      const response = await axios.post('/api/submissions/run', {
        source_code: code,
        language_id: getLanguageId(language),
        input: input
      });

      const { stdout, stderr, compile_output, status } = response.data;

      if (status === 'Accepted') {
        setOutput(stdout);
        showSuccess('Code executed successfully');
      } else if (stderr) {
        setError(stderr);
        showError('Runtime error occurred');
      } else if (compile_output) {
        setError(compile_output);
        showError('Compilation error occurred');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run code');
      showError('Failed to run code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="typescript">TypeScript</option>
        </select>
        <button
          onClick={handleRun}
          disabled={loading}
          className="button primary"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="editor-content">
        <div className="code-area">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            className="code-input"
          />
        </div>

        <div className="io-area">
          <div className="input-area">
            <h3>Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
              className="input-field"
            />
          </div>

          <div className="output-area">
            <h3>Output</h3>
            <pre className="output-field">
              {error ? error : output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}; 