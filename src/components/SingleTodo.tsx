import React, { useState, useEffect, useRef } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Todo } from "@/models/model";
import { BsCheck2All } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import { GiCrossMark } from "react-icons/gi";
type PropTypes = {
  todo: Todo;
  handleCompleted: (id: string, isCompleted: boolean) => void;
  deleteTodo: (id: string) => void;
  handleEdit: (id: string, content: string) => void;
};

const SingleTodo = ({
  todo,
  handleCompleted,
  deleteTodo,
  handleEdit,
}: PropTypes) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<string>(todo.content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-3">
        {edit ? (
          <input
            type="text"
            ref={inputRef}
            className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[30px] grow shadow-sm rounded-md px-4
             focus-visible:outline-yellow-400 text-sm transition-all duration-300"
            value={editedTodo}
            onChange={(e) => setEditedTodo(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleEdit(todo.id, editedTodo);
                setEdit(!edit);
              }
            }}
          />
        ) : (
          <label
            htmlFor={`todo-${todo.id}`}
            className={`font-medium ${todo.completed ? "line-through" : ""}`}
          >
            {todo.content}
          </label>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!todo.completed && !edit && (
          <FiEdit
            size={24}
            className="text-orange-400 hover:text-orange-600 cursor-pointer"
            onClick={() => setEdit(!edit)}
          />
        )}
        {!edit ? (
          <>
            <BsCheck2All
              size={24}
              className="text-green-600 hover:text-green-800 cursor-pointer"
              onClick={() => handleCompleted(todo.id, todo.completed)}
            />
            <MdDeleteForever
              size={24}
              className="text-red-400 hover:text-red-600 cursor-pointer"
              onClick={() => deleteTodo(todo.id)}
            />
          </>
        ) : (
          <>
            <AiOutlineCheck
              size={24}
              className="text-green-600 hover:text-green-800 cursor-pointer"
              onClick={() => {
                handleEdit(todo.id, editedTodo);
                setEdit(!edit);
              }}
            />
            <GiCrossMark
              size={24}
              className="text-red-400 hover:text-red-600 cursor-pointer"
              onClick={() => {
                setEdit(!edit);
                setEditedTodo(todo.content);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SingleTodo;
