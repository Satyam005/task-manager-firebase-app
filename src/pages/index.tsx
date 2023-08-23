import { useState, useEffect } from "react";
import { useAuth } from "../../firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { GoSignOut } from "react-icons/go";
import { AiOutlinePlus } from "react-icons/ai";
import SingleTodo from "@/components/SingleTodo";
import { Todo } from "@/models/model";

export default function Home() {
  const router = useRouter();
  const [todoInput, setTodoInput] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const { authUser, isLoading, signOut } = useAuth();
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    }

    if (!!authUser) {
      fetchTodos(authUser.uid);
    }
  }, [authUser, isLoading]);

  const addTodo = async () => {
    try {
      if (todoInput.length > 0) {
        await addDoc(collection(db, "todos"), {
          owner: authUser?.uid,
          content: todoInput,
          completed: false,
        });
        if (authUser) {
          fetchTodos(authUser.uid);
        }
        setTodoInput("");
      }
    } catch (error) {
      console.error("Error Occurred", error);
    }
  };

  const fetchTodos = async (uid: string) => {
    try {
      let data: any = [];
      const todoQuery = query(
        collection(db, "todos"),
        where("owner", "==", uid)
      );
      const querySnapshot = await getDocs(todoQuery);
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
    } catch (error) {
      console.error("Error Occurred", error);
    }
  };

  const deleteTodo = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "todos", docId));
      if (authUser) {
        fetchTodos(authUser.uid);
      }
    } catch (error) {
      console.error("Error Occurred", error);
    }
  };

  const handleCompleted = async (docId: string, isCompleted: boolean) => {
    try {
      const docRef = doc(db, "todos", docId);

      await updateDoc(docRef, {
        completed: !isCompleted,
      });
      if (authUser) {
        fetchTodos(authUser.uid);
      }
    } catch (error) {
      console.error("Error Occurred", error);
    }
  };

  const handleEdit = async (docId: string, content: string) => {
    try {
      const docRef = doc(db, "todos", docId);

      await updateDoc(docRef, {
        content,
      });
      if (authUser) {
        fetchTodos(authUser.uid);
      }
    } catch (error) {
      console.error("Error Occurred", error);
    }
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event?.key === "Enter" && todoInput.length > 0) {
      addTodo();
    }
  };

  return !authUser ? (
    <Loader />
  ) : (
    <main className="">
      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform
       hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2
        font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={signOut}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">Task Manager</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser.userName}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyUp={onKeyUp}
            />
            <button
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
              onClick={addTodo}
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todos.length > 0 &&
            todos.map((todo, index) => (
              <SingleTodo
                key={todo.id}
                todo={todo}
                handleCompleted={handleCompleted}
                deleteTodo={deleteTodo}
                handleEdit={handleEdit}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
