<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminEmailsRequest;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminEmailsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/emails/index');
    }

    public function store(AdminEmailsRequest $request)
    {
        $validatedData = $request->validated();
        $emails = $validatedData['emails'];

        foreach ($emails as $email) {
            Mail::to($email)->send(new WelcomeEmail('https://www.trainingcorporation.com.co/'));
        }

        return redirect()->route('dashboard.emails.index')->with('success', 'Correos enviados correctamente');

    }
}