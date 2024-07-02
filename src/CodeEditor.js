import React, { useState, useEffect, useRef } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import './CodeEditor.css';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [currentLine, setCurrentLine] = useState(1);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setCode(e.target.value);
    const { selectionStart } = e.target;
    const newLine = e.target.value.substr(0, selectionStart).split('\n').length;
    setCurrentLine(newLine);
  };

  const handleScroll = () => {
    textareaRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const numberOfLines = code.split('\n').length;

  useEffect(() => {
    const textarea = textareaRef.current;
    const handleClick = () => {
      const { selectionStart } = textarea;
      const newLine = textarea.value.substr(0, selectionStart).split('\n').length;
      setCurrentLine(newLine);
    };

    textarea.addEventListener('click', handleClick);
    textarea.addEventListener('scroll', handleScroll);

    return () => {
      textarea.removeEventListener('click', handleClick);
      textarea.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="code-editor-container">
      <div className="line-numbers">
        {Array.from({ length: numberOfLines }, (_, i) => (
          <div
            key={i}
            className={`line-number ${currentLine === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="code-editor">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          className="code-input"
          spellCheck="false"
        />
        <Highlight theme={themes.vsDark} code={code} language="javascript">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} code-preview`} style={style}>
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line, key: i })}
                  className={currentLine === i + 1 ? 'active-line' : ''}
                >
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default CodeEditor;
