'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiGet } from '@/lib/api';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { useLanguageStore } from '@/store/language-store';

export default function ApplicationsPage() {
  const t = useLanguageStore((s) => s.t);
  const [search, setSearch] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => apiGet<any[]>('/applications/my'),
  });

  const filteredApplications = applications?.filter(
    (app) =>
      app.applicationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      getStatusLabel(app.status).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('nav.applications')}</h1>
            <p className="text-muted-foreground">Manage your empanelment applications</p>
          </div>
          <Button asChild>
            <Link href="/applications/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.newApplication')}
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                {t('common.filter')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              {filteredApplications?.length || 0} application(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredApplications?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t('dashboard.noApplications')}</p>
                <Button asChild>
                  <Link href="/applications/new">{t('dashboard.createFirst')}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications?.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {app.applicationNumber || 'Draft Application'}
                        </p>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusLabel(app.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created: {formatDate(app.createdAt)}
                        {app.submittedAt && ` • Submitted: ${formatDate(app.submittedAt)}`}
                      </p>
                      {app.apcdTypes?.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          APCD Types: {app.apcdTypes.length}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {app.status === 'DRAFT' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/applications/${app.id}/edit`}>Continue</Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/applications/${app.id}`}>{t('common.view')}</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
