<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUserRequest;
use App\Http\Requests\Admin\AdminUserUpdateRequest;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminUserController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $search = $request->string('search')->trim()->toString();

        $query = User::query()
            ->select('id', 'name', 'email', 'phone')
            ->orderBy('id');

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like, $search) {
                $q->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('phone', 'like', $like);
                if (ctype_digit($search)) {
                    $q->orWhere('id', (int) $search);
                }
            });
        }

        $viewData['users'] = $query->paginate(15)->withQueryString();
        $viewData['filters'] = [
            'search' => $search,
        ];

        return Inertia::render('admin/users/index', compact('viewData'));
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('admin/users/create');
    }

    public function store(AdminUserRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        try {
            User::query()->create($validatedData);

            return redirect()->route('dashboard.users.index')->with('success', 'Usuario creado correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Ha ocurrido un error al crear el usuario.');
        }
    }

    public function edit(int $id): InertiaResponse|RedirectResponse
    {
        try {
            $user = User::query()->findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Usuario con ID '.$id.' no encontrado.');
        }

        $viewData['user'] = $user;

        return Inertia::render('admin/users/edit', compact('viewData'));
    }

    public function update(AdminUserUpdateRequest $request, int $id): RedirectResponse
    {
        try {
            $user = User::query()->findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Usuario con ID '.$id.' no encontrado.');
        }

        $validatedData = $request->validated();
        if (array_key_exists('password', $validatedData) && $validatedData['password'] === null) {
            unset($validatedData['password']);
        }

        try {
            $user->update($validatedData);

            return redirect()->route('dashboard.users.index')->with('success', 'Usuario actualizado correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Ha ocurrido un error al actualizar el usuario.');
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        if (Auth::id() === (int) $id) {
            return redirect()->route('dashboard.users.index')->with('error', 'No puedes eliminar tu propio usuario.');
        }

        try {
            $user = User::query()->findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Usuario con ID '.$id.' no encontrado.');
        }

        try {
            $user->delete();

            return redirect()->route('dashboard.users.index')->with('success', 'Usuario eliminado correctamente.');
        } catch (Exception $e) {
            return redirect()->route('dashboard.users.index')->with('error', 'Ha ocurrido un error al eliminar el usuario.');
        }
    }
}
