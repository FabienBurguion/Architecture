import type {Todo} from "../types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: number, done: boolean) => void;
    onDelete: (id: number) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
    if (todos.length === 0) {
        return <p className="empty">No tasks yet.</p>;
    }

    return (
        <ul className="todo-list">
            {todos.map((t) => (
                <TodoItem
                    key={t.id}
                    todo={t}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
