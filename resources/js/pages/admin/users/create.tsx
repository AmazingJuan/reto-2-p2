import { Button } from '@/components/ui/button';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CreateUser() {
	const { data, setData, post, processing, errors } = useForm({
		name: '',
		email: '',
		password: '',
		phone: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(route('dashboard.users.store'));
	};

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			<Header />

			<main className="mt-20 flex-grow px-4 py-12 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<div className="mb-8">
						<h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-3xl">Crear Usuario</h1>
						<p className="mt-2 text-sm text-gray-600">Completa los campos para registrar un nuevo usuario.</p>
					</div>

					<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
						<form onSubmit={handleSubmit} className="space-y-8 p-8">
							<div className="grid grid-cols-1 gap-6">
								<div>
									<label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
										Nombre <span className="text-red-500">*</span>
									</label>
									<input
										id="name"
										type="text"
										value={data.name}
										onChange={(e) => setData('name', e.target.value)}
										className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
										placeholder="Ingresa el nombre"
									/>
									{errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
								</div>

								<div>
									<label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
										Correo electrónico <span className="text-red-500">*</span>
									</label>
									<input
										id="email"
										type="email"
										value={data.email}
										onChange={(e) => setData('email', e.target.value)}
										className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
										placeholder="correo@ejemplo.com"
									/>
									{errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
								</div>

								<div>
									<label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
										Teléfono <span className="text-red-500">*</span>
									</label>
									<input
										id="phone"
										type="text"
										value={data.phone}
										onChange={(e) => setData('phone', e.target.value)}
										className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
										placeholder="10 a 15 dígitos"
									/>
									{errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
								</div>

								<div>
									<label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
										Contraseña <span className="text-red-500">*</span>
									</label>
									<input
										id="password"
										type="password"
										value={data.password}
										onChange={(e) => setData('password', e.target.value)}
										className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
										placeholder="Mínimo 8 caracteres"
									/>
									{errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
								</div>
							</div>

							<div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
								<Button type="button" onClick={() => window.history.back()} variant="crear" className="bg-red-600 hover:bg-red-700">
									Cancelar
								</Button>
								<Button type="submit" disabled={processing} variant="crear" className="bg-indigo-600 hover:bg-indigo-700">
									{processing ? 'Guardando...' : 'Guardar Usuario'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
