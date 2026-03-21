'use client';

import { useQuery } from '@tanstack/react-query';
import { Receipt, CreditCard, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiGet } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useLanguageStore } from '@/store/language-store';

export default function DealingHandDashboard() {
  const t = useLanguageStore((s) => s.t);
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dealing-hand-dashboard'],
    queryFn: () => apiGet<any>('/dashboard/dealing-hand'),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>
          <p className="text-muted-foreground">{t('dashboard.manageLabBills')}</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.pendingLabBills')}
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.pendingLabBills || 0}</div>
              <Link href="/dealing-hand/lab-bills" className="text-xs text-primary hover:underline">
                {t('dashboard.viewPendingBills')}
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.uploadedLabBills')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.uploadedLabBills || 0}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.totalBillsUploaded')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.paymentQueries')}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.paymentQueries || 0}</div>
              <Link href="/dealing-hand/payments" className="text-xs text-primary hover:underline">
                {t('dashboard.viewPaymentQueries')}
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Lab Bills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.recentLabBills')}</CardTitle>
              <CardDescription>{t('dashboard.labBillsPendingUpload')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dealing-hand/lab-bills">
                {t('common.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {(dashboard?.recentApplications?.length || 0) === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>{t('dashboard.noPendingLabBills')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.recentApplications?.map((app: any) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{app.applicationNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.oemProfile?.companyName} &bull; {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={app.status === 'LAB_TESTING' ? 'warning' : 'default'}>
                        {app.status?.replace(/_/g, ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dealing-hand/lab-bills?app=${app.id}`}>
                          {t('dashboard.uploadBill')}
                        </Link>
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
