import type {Todo} from "../types";

const API_URL = 'http://localhost:3000';

export async function getTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_URL}/todos`);
    if (!res.ok) {
        throw new Error("Erreur de chargement des todos");
    }
    return res.json();
}

export async function addTodo(text: string): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) {
        throw new Error("Erreur lors de la création");
    }
    return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
    }
}

export async function toggleTodo(id: number, done: boolean): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos/${id}/done`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done }),
    });
    if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
    }
    return res.json();
}
