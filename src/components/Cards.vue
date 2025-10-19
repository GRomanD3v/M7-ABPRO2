<script setup></script>

<template>
    <main id="app-content" style="display:none;">
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h2 class="card-title fs-5 text-primary mb-3">Crear Nueva Tarea</h2>
                    <form id="create-task-form">
                        <div class="mb-3">
                            <input type="text" id="task-title" class="form-control" placeholder="Título de la tarea" required>
                        </div>
                        <div class="mb-3">
                            <textarea id="task-description" class="form-control" placeholder="Descripción"></textarea>
                        </div>
                        <div class="mb-3">
                            <select id="task-assignee" class="form-select" required>
                                <option value="" selected disabled>Seleccionar asignado</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <input type="date" id="task-deadline" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary">Crear Tarea</button>
                    </form>
                </div>
            </div>
        </main>
</template>