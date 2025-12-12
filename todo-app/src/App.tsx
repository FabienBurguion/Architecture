import { useEffect, useState } from "react";
import "./App.css";
import type {Todo} from "./types";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { getTodos, addTodo, deleteTodo, toggleTodo } from "./api/todoApi";

type Filter = "all" | "done" | "todo";

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<Filter>("all");

    useEffect(() => {
        (async () => {
            try {
                const data = await getTodos();
                setTodos(data);
            } catch {
                setError("Impossible de charger les tâches");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleAdd = async (text: string) => {
        try {
            const newTodo = await addTodo(text);
            setTodos((prev) => [...prev, newTodo]);
        } catch {
            setError("Erreur lors de l’ajout");
        }
    };

    const handleToggle = async (id: number, done: boolean) => {
        try {
            const updated = await toggleTodo(id, done);
            setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch {
            setError("Erreur lors de la mise à jour");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteTodo(id);
            setTodos((prev) => prev.filter((t) => t.id !== id));
        } catch {
            setError("Erreur lors de la suppression");
        }
    };

    const handleDeleteDone = async () => {
        const doneTodos = todos.filter((t) => t.done);
        await Promise.all(doneTodos.map((t) => deleteTodo(t.id)));
        setTodos((prev) => prev.filter((t) => !t.done));
    };

    const handleDeleteAll = async () => {
        await Promise.all(todos.map((t) => deleteTodo(t.id)));
        setTodos([]);
    };

    const filteredTodos = todos.filter((t) => {
        if (filter === "done") return t.done;
        if (filter === "todo") return !t.done;
        return true;
    });

    return (
        <div className="page">
            <div className="app-card">
                <h2 className="section-title">TodoInput</h2>
                <TodoInput onAdd={handleAdd} />

                <h2 className="section-title">TodoList</h2>

                <div className="filter-bar">
                    <button
                        className={`filter-btn ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === "done" ? "active" : ""}`}
                        onClick={() => setFilter("done")}
                    >
                        Done
                    </button>
                    <button
                        className={`filter-btn ${filter === "todo" ? "active" : ""}`}
                        onClick={() => setFilter("todo")}
                    >
                        Todo
                    </button>
                </div>

                {loading && <p>Chargement...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && (
                    <TodoList
                        todos={filteredTodos}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                )}

                <div className="bottom-buttons">
                    <button className="danger-btn" onClick={handleDeleteDone}>
                        Delete done tasks
                    </button>
                    <button className="danger-btn" onClick={handleDeleteAll}>
                        Delete all tasks
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
