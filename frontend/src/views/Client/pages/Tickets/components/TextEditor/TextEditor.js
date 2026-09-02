import React, { useRef, useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import styles from "./TextEditor.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faHeading,
  faListOl,
  faListUl,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { stateToHTML } from "draft-js-export-html";

const TextEditor = ({ onChange }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const editorRef = useRef(null);

  const focusEditor = () => {
    if (editorRef.current) editorRef.current.focus();
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    focusEditor();
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    focusEditor();
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onEditorChange = (newState) => {
    setEditorState(newState);
    onChange(stateToHTML(newState.getCurrentContent()));
  };

  const undo = () => {
    setEditorState(EditorState.undo(editorState));
    focusEditor();
  };

  const redo = () => {
    setEditorState(EditorState.redo(editorState));
    focusEditor();
  };

  return (
    <div className={styles.editorContainer} onClick={focusEditor}>
      <div className={styles.toolbar}>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("BOLD");
          }}
          type="button"
          className={
            editorState.getCurrentInlineStyle().has("BOLD")
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("ITALIC");
          }}
          type="button"
          className={
            editorState.getCurrentInlineStyle().has("ITALIC")
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle("UNDERLINE");
          }}
          type="button"
          className={
            editorState.getCurrentInlineStyle().has("UNDERLINE")
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faUnderline} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType("header-one");
          }}
          type="button"
          className={
            RichUtils.getCurrentBlockType(editorState) === "header-one"
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faHeading} /> H1
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType("header-two");
          }}
          type="button"
          className={
            RichUtils.getCurrentBlockType(editorState) === "header-two"
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faHeading} /> H2
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType("ordered-list-item");
          }}
          type="button"
          className={
            RichUtils.getCurrentBlockType(editorState) === "ordered-list-item"
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlockType("unordered-list-item");
          }}
          type="button"
          className={
            RichUtils.getCurrentBlockType(editorState) === "unordered-list-item"
              ? styles.isActive
              : ""
          }
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            undo();
          }}
          type="button"
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            redo();
          }}
          type="button"
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
      <div className={styles.editor}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={onEditorChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
};

export default TextEditor;
