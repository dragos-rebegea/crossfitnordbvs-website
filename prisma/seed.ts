import { PrismaClient, Role, PackageType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await hash("Admin1234!", 12);
  await prisma.user.upsert({
    where: { email: "admin@crossfitnordbvs.ro" },
    update: {},
    create: {
      email: "admin@crossfitnordbvs.ro",
      name: "Admin BVS",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Trainers
  const trainers = [
    { name: "Silviu Tanase", bio: "Head Coach cu experienta de peste 10 ani in CrossFit. Certificari CrossFit Level 3, specialitat in olimpic weightlifting.", specialties: ["CrossFit", "Weightlifting", "Gymnastics"], order: 1 },
    { name: "Adrian Schuller", bio: "Coach CrossFit Level 2 cu background in atletism. Pasionat de functional fitness si conditioning.", specialties: ["CrossFit", "Conditioning", "Endurance"], order: 2 },
    { name: "Robert Mihaila", bio: "Coach CrossFit Level 2, specialist in mobilitate si gimnastica. Focus pe tehnica si prevenirea accidentarilor.", specialties: ["CrossFit", "Gymnastics", "Mobility"], order: 3 },
    { name: "Cristian Tudor", bio: "Coach CrossFit Level 1, fost sportiv de performanta. Energic si motivant, se concentreaza pe dezvoltarea incepatorilor.", specialties: ["CrossFit", "Strength", "Beginners"], order: 4 },
  ];

  for (const trainer of trainers) {
    await prisma.trainer.upsert({
      where: { id: trainer.name.toLowerCase().replace(/\s/g, "-") },
      update: trainer,
      create: { id: trainer.name.toLowerCase().replace(/\s/g, "-"), ...trainer },
    });
  }

  // Packages - exact RON pricing
  const packages = [
    { name: "1 Sedinta", type: PackageType.SESSION, sessions: 1, duration: 30, price: 60, order: 1 },
    { name: "4 Sedinte", type: PackageType.SESSION, sessions: 4, duration: 30, price: 200, order: 2 },
    { name: "8 Sedinte", type: PackageType.SESSION, sessions: 8, duration: 30, price: 350, isPopular: true, order: 3 },
    { name: "12 Sedinte", type: PackageType.SESSION, sessions: 12, duration: 45, price: 450, order: 4 },
    { name: "16 Sedinte", type: PackageType.SESSION, sessions: 16, duration: 45, price: 550, order: 5 },
    { name: "Nelimitat 1 Luna", type: PackageType.UNLIMITED, sessions: null, duration: 30, price: 400, isPopular: true, order: 6 },
    { name: "Nelimitat 3 Luni", type: PackageType.UNLIMITED, sessions: null, duration: 90, price: 1050, order: 7 },
    { name: "Nelimitat 6 Luni", type: PackageType.UNLIMITED, sessions: null, duration: 180, price: 1800, order: 8 },
    { name: "Nelimitat 12 Luni", type: PackageType.UNLIMITED, sessions: null, duration: 365, price: 3000, order: 9 },
    { name: "Sedinta Drop-in", type: PackageType.SESSION, sessions: 1, duration: 1, price: 70, order: 10 },
    { name: "Pachet Familie (2 pers)", type: PackageType.UNLIMITED, sessions: null, duration: 30, price: 700, order: 11 },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: pkg.name.toLowerCase().replace(/\s/g, "-").replace(/[()]/g, "") },
      update: pkg,
      create: { id: pkg.name.toLowerCase().replace(/\s/g, "-").replace(/[()]/g, ""), ...pkg },
    });
  }

  // Sample weekly class schedule
  const classSchedule = [
    // Monday (0)
    { name: "CrossFit", dayOfWeek: 0, startTime: "07:00", endTime: "08:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 0, startTime: "09:00", endTime: "10:00", capacity: 20, trainerId: "adrian-schuller" },
    { name: "CrossFit", dayOfWeek: 0, startTime: "17:00", endTime: "18:00", capacity: 20, trainerId: "robert-mihaila" },
    { name: "CrossFit", dayOfWeek: 0, startTime: "18:00", endTime: "19:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 0, startTime: "19:00", endTime: "20:00", capacity: 20, trainerId: "cristian-tudor" },
    // Tuesday (1)
    { name: "CrossFit", dayOfWeek: 1, startTime: "07:00", endTime: "08:00", capacity: 20, trainerId: "adrian-schuller" },
    { name: "CrossFit", dayOfWeek: 1, startTime: "09:00", endTime: "10:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 1, startTime: "17:00", endTime: "18:00", capacity: 20, trainerId: "cristian-tudor" },
    { name: "CrossFit", dayOfWeek: 1, startTime: "18:00", endTime: "19:00", capacity: 20, trainerId: "robert-mihaila" },
    { name: "CrossFit", dayOfWeek: 1, startTime: "19:00", endTime: "20:00", capacity: 20, trainerId: "silviu-tanase" },
    // Wednesday (2)
    { name: "CrossFit", dayOfWeek: 2, startTime: "07:00", endTime: "08:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 2, startTime: "09:00", endTime: "10:00", capacity: 20, trainerId: "adrian-schuller" },
    { name: "CrossFit", dayOfWeek: 2, startTime: "17:00", endTime: "18:00", capacity: 20, trainerId: "robert-mihaila" },
    { name: "CrossFit", dayOfWeek: 2, startTime: "18:00", endTime: "19:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 2, startTime: "19:00", endTime: "20:00", capacity: 20, trainerId: "cristian-tudor" },
    // Thursday (3)
    { name: "CrossFit", dayOfWeek: 3, startTime: "07:00", endTime: "08:00", capacity: 20, trainerId: "adrian-schuller" },
    { name: "CrossFit", dayOfWeek: 3, startTime: "09:00", endTime: "10:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 3, startTime: "17:00", endTime: "18:00", capacity: 20, trainerId: "cristian-tudor" },
    { name: "CrossFit", dayOfWeek: 3, startTime: "18:00", endTime: "19:00", capacity: 20, trainerId: "robert-mihaila" },
    { name: "CrossFit", dayOfWeek: 3, startTime: "19:00", endTime: "20:00", capacity: 20, trainerId: "silviu-tanase" },
    // Friday (4)
    { name: "CrossFit", dayOfWeek: 4, startTime: "07:00", endTime: "08:00", capacity: 20, trainerId: "silviu-tanase" },
    { name: "CrossFit", dayOfWeek: 4, startTime: "09:00", endTime: "10:00", capacity: 20, trainerId: "adrian-schuller" },
    { name: "CrossFit", dayOfWeek: 4, startTime: "17:00", endTime: "18:00", capacity: 20, trainerId: "robert-mihaila" },
    { name: "CrossFit", dayOfWeek: 4, startTime: "18:00", endTime: "19:00", capacity: 20, trainerId: "cristian-tudor" },
    // Saturday (5)
    { name: "CrossFit", dayOfWeek: 5, startTime: "10:00", endTime: "11:00", capacity: 25, trainerId: "silviu-tanase" },
    { name: "Open Gym", dayOfWeek: 5, startTime: "11:00", endTime: "12:00", capacity: 15, trainerId: "adrian-schuller" },
  ];

  for (const cls of classSchedule) {
    await prisma.class.create({ data: cls });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
