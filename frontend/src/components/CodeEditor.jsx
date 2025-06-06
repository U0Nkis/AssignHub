import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = ({ code, setCode }) => {
    return (
        <AceEditor
            mode="python"
            theme="monokai"
            value={code}
            onChange={setCode}
            width="100%"
            height="300px"
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
            }}
        />
    );
};

export default CodeEditor;