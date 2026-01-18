import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps } from '@/types';

type IndexPageProps = PageProps & {
  errors?: Record<string, string | string[]>;
  flash?: {
    success?: string;
    error?: string;
  };
};

export default function BusinessUnitIndex() {
  const { errors, flash } = usePage<IndexPageProps>().props;
  const validationErrors = errors ?? {};
  const flashMessages = flash ?? {};

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-2 space-y-4">
        {flashMessages.success && (
          <div className="p-3 rounded bg-green-100 text-green-700">
            {flashMessages.success}
          </div>
        )}

        {(flashMessages.error || Object.keys(validationErrors).length > 0) && (
          <div className="p-3 rounded bg-red-100 text-red-700 space-y-2">
            {flashMessages.error && <div>{flashMessages.error}</div>}
            {Object.entries(validationErrors).map(([field, message]) => {
              const content = Array.isArray(message) ? message.join(', ') : message;
              return (
                <div key={field}>
                  {field}: {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}