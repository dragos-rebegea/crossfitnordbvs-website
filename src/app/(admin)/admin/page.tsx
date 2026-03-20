import { prisma } from "@/lib/prisma";
import { Users, CreditCard, Calendar, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

const dayMap: Record<number, number> = {
  0: 6, // Sunday -> 6
  1: 0, // Monday -> 0
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

export default async function AdminDashboard() {
  const today = new Date();
  const dayOfWeek = dayMap[today.getDay()];

  const [totalUsers, activeSubscriptions, classesToday, unreadFeedback] =
    await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.class.count({ where: { dayOfWeek, isActive: true } }),
      prisma.feedbackMessage.count({ where: { isRead: false } }),
    ]);

  const stats = [
    {
      label: "Total utilizatori",
      value: totalUsers,
      icon: Users,
    },
    {
      label: "Abonamente active",
      value: activeSubscriptions,
      icon: CreditCard,
    },
    {
      label: "Clase azi",
      value: classesToday,
      icon: Calendar,
    },
    {
      label: "Feedback necitit",
      value: unreadFeedback,
      icon: MessageSquare,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-cardBg rounded-lg p-6 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Icon size={20} className="text-gold" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-grayText">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
