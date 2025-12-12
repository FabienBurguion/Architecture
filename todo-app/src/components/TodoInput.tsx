import { useState } from "react";
import * as React from "react";

interface TodoInputProps {
    onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="todo-input-card">
            <div className="input-row">
                <span className="input-icon">📋</span>
                <input
                    type="text"
                    placeholder="New Todo"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button type="submit" className="primary-btn">
                Add new task
            </button>
        </form>
    );
}
