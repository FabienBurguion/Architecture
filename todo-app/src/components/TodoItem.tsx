import type {Todo} from "../types";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number, done: boolean) => void;
    onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li className="todo-row">
            <div className="todo-main">
        <span
            className={`todo-text ${todo.done ? "todo-text-done" : ""}`}
            onClick={() => onToggle(todo.id, !todo.done)}
        >
          {todo.text}
        </span>
            </div>
            <div className="todo-actions">
                <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={(e) => onToggle(todo.id, e.target.checked)}
                />
                <button className="icon icon-delete" onClick={() => onDelete(todo.id)}>
                    🗑
                </button>
            </div>
        </li>
    );
}
