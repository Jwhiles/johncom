import React, { useState, useEffect, useRef } from 'react';

/**
 * A safer JavaScript REPL (Read-Eval-Print-Loop) component
 * @param {Object} props
 * @param {string} props.initialCode - Initial code to show in the editor
 * @param {string} props.editorHeight - Height of the editor (CSS value)
 * @param {string} props.outputHeight - Height of the output (CSS value)
 * @param {string} props.runButtonText - Text for the run button
 */
export const JavascriptRepl = ({
  content = '// Write your JavaScript code here\nconsole.log("Hello, world!");\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log("Sum:", numbers.reduce((a, b) => a + b, 0));',
  editorHeight = '200px',
  outputHeight = '150px',
  runButtonText = 'Run'
}) => {
  const [code, setCode] = useState(content);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const frameRef = useRef(null);

  // Cleanup function to remove iframe if component unmounts during execution
  useEffect(() => {
    return () => {
      if (frameRef.current && frameRef.current.parentNode) {
        frameRef.current.parentNode.removeChild(frameRef.current);
      }
    };
  }, []);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const runCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('Running code...');

    // Create a sandbox iframe
    const frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);
    frameRef.current = frame;

    // Get window from the iframe
    const frameWindow = frame.contentWindow;

    // Create a custom console object
    const logs = [];
    frameWindow.console = {
      log: function() {
        const args = Array.from(arguments);
        const message = args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        logs.push(message);
      },
      warn: function() {
        const args = Array.from(arguments);
        logs.push('⚠️ ' + args.join(' '));
      },
      error: function() {
        const args = Array.from(arguments);
        logs.push('🛑 ' + args.join(' '));
      }
    };

    // Limit available APIs
    frameWindow.limitedSetTimeout = function(callback, time) {
      if (time < 100) time = 100; // Minimum timeout
      return setTimeout(callback, time);
    };
    
    try {
      // Create a function from the code with limited access to globals
      const sandboxedCode = `
        "use strict";
        const setTimeout = limitedSetTimeout;
        const document = undefined;
        const window = undefined;
        const location = undefined;
        const parent = undefined;
        const top = undefined;
        
        // User code runs here
        ${code}
      `;
      
      // Use Function constructor instead of eval
      // This executes in the global scope of the iframe
      const fn = new frameWindow.Function(sandboxedCode);
      fn.call(frameWindow);
      
      // Display the output
      setOutput(logs.join('\n') || 'Code executed successfully with no output.');
    } catch (error) {
      // Display any errors
      setOutput('Error: ' + error.message);
    } finally {
      // Clean up
      if (frameRef.current && frameRef.current.parentNode) {
        frameRef.current.parentNode.removeChild(frameRef.current);
        frameRef.current = null;
      }
      setIsRunning(false);
    }
  };

  return (
    <div className="javascript-repl" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      <textarea
        value={code}
        onChange={handleCodeChange}
        style={{
          width: '100%',
          // height: editorHeight,
          fieldSizing: 'content',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontFamily: 'monospace',
          padding: '10px',
          marginBottom: '10px',
          resize: 'vertical'
        }}
      />
      
      <div>
        <button
          onClick={runCode}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          {isRunning ? 'Running...' : runButtonText}
        </button>
      </div>
      
      {output && <>
        <div style={{ marginBottom: '5px', color: '#555', marginTop: '10px' }}>
        Output:
      </div>
      <pre
        style={{
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontFamily: 'monospace',
          padding: '10px',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          backgroundColor: '#f9f9f9'
        }}
      >
        {output}
      </pre>
      </>}
    </div>
  );
};

