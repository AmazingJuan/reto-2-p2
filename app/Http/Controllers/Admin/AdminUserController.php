<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUserRequest;
use App\Http\Requests\Admin\AdminUserUpdateRequest;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminUserController extends Controller
{
    public function index(): InertiaResponse
    {
        $viewData = [];
        $users = User::all();
        $viewData['users'] = $users;

        return Inertia::render('admin/users/index', ['viewData' => $viewData]);
    }

    public function delete(int $id): RedirectResponse
    {
        try {
            $user = User::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Usuario con ID '.$id.' no encontrado.');
        }

        $user->delete();

        return redirect()->route('dashboard.users.index')->with('success', 'Usuario eliminado exitosamente.');
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('admin/users/create');
    }

    public function store(AdminUserRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        try {
            $validatedData['password'] = Hash::make($validatedData['password']);
            User::create($validatedData);

            return redirect()->route('dashboard.users.index')->with('success', 'Usuario creado exitosamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Error al encriptar la contraseña del usuario.');
        }
    }

    public function edit(int $id): InertiaResponse|RedirectResponse
    {
        try {
            $viewData = [];
            $user = User::findOrFail($id);
            $viewData['user'] = $user;

            return Inertia::render('admin/users/edit', $viewData);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Usuario con ID '.$id.' no encontrado.');
        }
    }

    public function update(AdminUserUpdateRequest $request, int $id): RedirectResponse
    {
        try {
            $user = User::findOrFail($id);

            $validatedData = $request->validated();

            // Si no se envía contraseña, no modificarla; si se envía, encriptar.
            if (empty($validatedData['password'])) {
                unset($validatedData['password']);
            } else {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }

            $user->update($validatedData);

            return redirect()->route('dashboard.users.index')->with('success', 'Usuario actualizado exitosamente.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Usuario con ID '.$id.' no encontrado.');
        }
    }
}
