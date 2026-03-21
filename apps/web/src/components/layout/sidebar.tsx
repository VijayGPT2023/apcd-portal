'use client';

import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Award,
  Users,
  ClipboardCheck,
  Settings,
  BarChart3,
  UserCog,
  MapPin,
  MessageSquare,
  Receipt,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/store/auth-store';
import { useTranslation } from '@/store/language-store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function getMenuItems(
  t: (key: string) => string,
): Record<string, { label: string; href: string; icon: any }[]> {
  const adminMenu = [
    { label: t('nav.dashboard'), href: '/dashboard/admin', icon: LayoutDashboard },
    { label: t('nav.userManagement'), href: '/admin/users', icon: UserCog },
    { label: t('nav.applications'), href: '/verification', icon: FileText },
    { label: t('nav.certificates'), href: '/admin/certificates', icon: Award },
    { label: t('nav.feeConfig'), href: '/admin/fees', icon: CreditCard },
    { label: t('nav.apcdTypes'), href: '/admin/apcd-types', icon: Settings },
    { label: t('nav.reports'), href: '/admin/reports', icon: BarChart3 },
  ];

  return {
    OEM: [
      { label: t('nav.dashboard'), href: '/dashboard/oem', icon: LayoutDashboard },
      { label: t('nav.applications'), href: '/applications', icon: FileText },
      { label: t('nav.payments'), href: '/payments', icon: CreditCard },
      { label: t('nav.certificates'), href: '/certificates', icon: Award },
      { label: t('nav.queries'), href: '/queries', icon: MessageSquare },
      { label: t('nav.profile'), href: '/profile', icon: Users },
    ],
    OFFICER: [
      { label: t('nav.dashboard'), href: '/dashboard/officer', icon: LayoutDashboard },
      { label: t('nav.verification'), href: '/verification', icon: ClipboardCheck },
      { label: t('nav.fieldVerification'), href: '/field-verification', icon: MapPin },
      { label: t('nav.paymentVerification'), href: '/payments/verify', icon: CreditCard },
      { label: t('nav.queries'), href: '/queries', icon: MessageSquare },
      { label: t('nav.reports'), href: '/reports', icon: BarChart3 },
    ],
    ADMIN: adminMenu,
    SUPER_ADMIN: adminMenu,
    COMMITTEE: [
      { label: t('nav.dashboard'), href: '/dashboard/committee', icon: LayoutDashboard },
      { label: t('nav.pendingReview'), href: '/committee/pending', icon: ClipboardCheck },
      { label: t('nav.myEvaluations'), href: '/committee/evaluations', icon: FileText },
    ],
    FIELD_VERIFIER: [
      { label: t('nav.dashboard'), href: '/dashboard/field-verifier', icon: LayoutDashboard },
      { label: t('nav.myAssignments'), href: '/field-verification/assignments', icon: MapPin },
      { label: t('nav.completed'), href: '/field-verification/completed', icon: ClipboardCheck },
    ],
    DEALING_HAND: [
      { label: t('nav.dashboard'), href: '/dashboard/dealing-hand', icon: LayoutDashboard },
      { label: t('nav.labBills'), href: '/dealing-hand/lab-bills', icon: Receipt },
      { label: t('nav.paymentSupport'), href: '/dealing-hand/payments', icon: CreditCard },
    ],
  };
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const userRole = useUserRole();
  const t = useTranslation();
  const menuItems = getMenuItems(t);
  const items = userRole ? menuItems[userRole] || [] : [];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <span className="font-semibold">{t('nav.menu')}</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu items */}
        <nav className="p-4 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} NPC
          </p>
        </div>
      </aside>
    </>
  );
}
