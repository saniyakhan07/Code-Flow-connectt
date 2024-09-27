import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../action";
function Editor({ socketRef, roomId,onCodeChange }) {
  const editorRef = useRef(null);
  async function init() {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("realTimeEditor"),
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        style: { height: '100%' }
      }
    );

    editorRef.current.on("change", (instence, changes) => {
      const { origin } = changes;
      const code = instence.getValue();
      onCodeChange(code);
      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
      console.log(code);
    });
  }
  useEffect(() => {
    init();
  },[]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return ()=>{
        socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  }, [socketRef.current]);

  return <textarea id="realTimeEditor" className="bg-green-400"/>;
}

export default Editor;
