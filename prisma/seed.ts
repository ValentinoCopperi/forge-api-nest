import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  OrganizationUserRole,
  PrismaClient,
  ProjectStatus,
  Role,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '../generated/prisma/client';

const BCRYPT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123!';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

type SeedUser = {
  name: string;
  email: string;
  role: Role;
};

const USERS: SeedUser[] = [
  {
    name: 'Valentino Copperi',
    email: 'director@gmail.com',
    role: Role.DIRECTOR,
  },
  {
    name: 'Marcus Whitfield',
    email: 'manager@gmail.com',
    role: Role.GERENTE,
  },
  {
    name: 'Eleanor Brooks',
    email: 'employee@gmail.com',
    role: Role.EMPLEADO,
  },
  {
    name: 'Sofía Mendoza',
    email: 'sofia.mendoza@gmail.com',
    role: Role.GERENTE,
  },
  {
    name: 'Mateo Herrera',
    email: 'mateo.herrera@gmail.com',
    role: Role.EMPLEADO,
  },
  {
    name: 'Lucía Fernández',
    email: 'lucia.fernandez@gmail.com',
    role: Role.EMPLEADO,
  },
  {
    name: 'James Holloway',
    email: 'james.holloway@gmail.com',
    role: Role.EMPLEADO,
  },
  {
    name: 'Charlotte Pierce',
    email: 'charlotte.pierce@gmail.com',
    role: Role.GERENTE,
  },
];

type SeedOrganization = {
  name: string;
  description: string;
  members: Array<{ email: string; role: OrganizationUserRole }>;
  projects: Array<{
    name: string;
    description: string;
    managerEmail: string;
    tasks: Array<{
      title: string;
      description: string;
      status: TaskStatus;
      category: TaskCategory;
      priority: TaskPriority;
      createdByEmail: string;
      designatedToEmail?: string;
    }>;
  }>;
};

const ORGANIZATIONS: SeedOrganization[] = [
  {
    name: 'Opus Platform',
    description: 'Organization for managing Opus Platform development.',
    members: [
      { email: 'director@gmail.com', role: OrganizationUserRole.OWNER },
      { email: 'manager@gmail.com', role: OrganizationUserRole.ADMIN },
      { email: 'employee@gmail.com', role: OrganizationUserRole.MEMBER },
      { email: 'sofia.mendoza@gmail.com', role: OrganizationUserRole.ADMIN },
      { email: 'mateo.herrera@gmail.com', role: OrganizationUserRole.MEMBER },
    ],
    projects: [
      {
        name: 'Opus Core API',
        description: 'Backend services and authentication for the Opus ecosystem.',
        managerEmail: 'manager@gmail.com',
        tasks: [
          {
            title: 'Implement organization membership guards',
            description:
              'Add role-based access control for organization actions in NestJS.',
            status: TaskStatus.IN_PROGRESS,
            category: TaskCategory.DESARROLLO,
            priority: TaskPriority.HIGH,
            createdByEmail: 'manager@gmail.com',
            designatedToEmail: 'mateo.herrera@gmail.com',
          },
          {
            title: 'Document OpenAPI array response wrappers',
            description:
              'Align Swagger schemas with ResponseInterceptor for Orval generation.',
            status: TaskStatus.DONE,
            category: TaskCategory.DOCUMENTACION,
            priority: TaskPriority.MEDIUM,
            createdByEmail: 'manager@gmail.com',
            designatedToEmail: 'employee@gmail.com',
          },
          {
            title: 'Design task board wireframes',
            description: 'UX flows for kanban and list views in Opus dashboard.',
            status: TaskStatus.PENDING,
            category: TaskCategory.DISENO,
            priority: TaskPriority.MEDIUM,
            createdByEmail: 'sofia.mendoza@gmail.com',
            designatedToEmail: 'employee@gmail.com',
          },
        ],
      },
      {
        name: 'Opus Admin Dashboard',
        description: 'Internal console for directors and managers.',
        managerEmail: 'sofia.mendoza@gmail.com',
        tasks: [
          {
            title: 'Build organizations overview page',
            description:
              'List organizations of the current user with logo and member count.',
            status: TaskStatus.IN_PROGRESS,
            category: TaskCategory.DESARROLLO,
            priority: TaskPriority.HIGH,
            createdByEmail: 'sofia.mendoza@gmail.com',
            designatedToEmail: 'mateo.herrera@gmail.com',
          },
        ],
      },
    ],
  },
  {
    name: 'World Cup Platform',
    description: 'Organization for organizing World Cup Platform development.',
    members: [
      { email: 'director@gmail.com', role: OrganizationUserRole.OWNER },
      { email: 'charlotte.pierce@gmail.com', role: OrganizationUserRole.ADMIN },
      { email: 'james.holloway@gmail.com', role: OrganizationUserRole.MEMBER },
      { email: 'lucia.fernandez@gmail.com', role: OrganizationUserRole.MEMBER },
      { email: 'manager@gmail.com', role: OrganizationUserRole.MEMBER },
    ],
    projects: [
      {
        name: 'Match Schedule Engine',
        description: 'Scheduling, venues, and kickoff times for tournament fixtures.',
        managerEmail: 'charlotte.pierce@gmail.com',
        tasks: [
          {
            title: 'Model fixture conflicts by stadium',
            description:
              'Prevent overlapping matches when sharing venues across groups.',
            status: TaskStatus.IN_PROGRESS,
            category: TaskCategory.DESARROLLO,
            priority: TaskPriority.HIGH,
            createdByEmail: 'charlotte.pierce@gmail.com',
            designatedToEmail: 'james.holloway@gmail.com',
          },
          {
            title: 'QA timezone display for broadcast partners',
            description:
              'Verify kickoff times render correctly for LATAM and EU regions.',
            status: TaskStatus.PENDING,
            category: TaskCategory.TESTING,
            priority: TaskPriority.MEDIUM,
            createdByEmail: 'charlotte.pierce@gmail.com',
            designatedToEmail: 'lucia.fernandez@gmail.com',
          },
        ],
      },
      {
        name: 'Fan Engagement Portal',
        description: 'Public-facing experience for predictions and live updates.',
        managerEmail: 'manager@gmail.com',
        tasks: [
          {
            title: 'Integrate live score websocket feed',
            description: 'Connect Socket.IO channel for minute-by-minute updates.',
            status: TaskStatus.PENDING,
            category: TaskCategory.DESARROLLO,
            priority: TaskPriority.HIGH,
            createdByEmail: 'manager@gmail.com',
            designatedToEmail: 'james.holloway@gmail.com',
          },
          {
            title: 'Redact copy for Spanish landing page',
            description: 'Localized hero text and CTA for Argentina and Mexico.',
            status: TaskStatus.DONE,
            category: TaskCategory.DOCUMENTACION,
            priority: TaskPriority.LOW,
            createdByEmail: 'lucia.fernandez@gmail.com',
            designatedToEmail: 'lucia.fernandez@gmail.com',
          },
        ],
      },
    ],
  },
  {
    name: 'Andes Logistics Hub',
    description:
      'Plataforma de gestión logística para operaciones en la región andina.',
    members: [
      { email: 'director@gmail.com', role: OrganizationUserRole.OWNER },
      { email: 'sofia.mendoza@gmail.com', role: OrganizationUserRole.ADMIN },
      { email: 'mateo.herrera@gmail.com', role: OrganizationUserRole.MEMBER },
      { email: 'lucia.fernandez@gmail.com', role: OrganizationUserRole.MEMBER },
    ],
    projects: [
      {
        name: 'Rutas Andinas Tracker',
        description: 'Seguimiento de flotas entre Chile, Argentina y Perú.',
        managerEmail: 'sofia.mendoza@gmail.com',
        tasks: [
          {
            title: 'Mapa de rutas con paradas intermedias',
            description:
              'Visualizar checkpoints de carga en el panel del operador.',
            status: TaskStatus.IN_PROGRESS,
            category: TaskCategory.DESARROLLO,
            priority: TaskPriority.HIGH,
            createdByEmail: 'sofia.mendoza@gmail.com',
            designatedToEmail: 'mateo.herrera@gmail.com',
          },
        ],
      },
    ],
  },
  {
    name: 'Northwind Digital Studio',
    description:
      'Digital product agency focused on enterprise web applications.',
    members: [
      { email: 'director@gmail.com', role: OrganizationUserRole.OWNER },
      { email: 'charlotte.pierce@gmail.com', role: OrganizationUserRole.ADMIN },
      { email: 'eleanor.brooks@gmail.com', role: OrganizationUserRole.MEMBER },
      { email: 'james.holloway@gmail.com', role: OrganizationUserRole.MEMBER },
    ],
    projects: [
      {
        name: 'Client Portal Revamp',
        description: 'Modernize the client onboarding and billing experience.',
        managerEmail: 'charlotte.pierce@gmail.com',
        tasks: [
          {
            title: 'Migrate legacy invoice PDFs to S3',
            description: 'Move historical documents to MinIO with presigned URLs.',
            status: TaskStatus.PENDING,
            category: TaskCategory.DESARROLLO,
            priority: TaskPriority.MEDIUM,
            createdByEmail: 'charlotte.pierce@gmail.com',
            designatedToEmail: 'james.holloway@gmail.com',
          },
        ],
      },
    ],
  },
];

async function upsertUser({ name, email, role }: SeedUser) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash },
  });

  await prisma.userRole.upsert({
    where: { userId_role: { userId: user.id, role } },
    update: {},
    create: { userId: user.id, role },
  });

  return user;
}

async function seedOrganization(
  organization: SeedOrganization,
  userIdsByEmail: Map<string, number>,
) {
  const directorId = userIdsByEmail.get('director@gmail.com');

  if (!directorId) {
    throw new Error('Director user is required to seed organizations.');
  }

  let org = await prisma.organization.findFirst({
    where: { name: organization.name, deletedAt: null },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: organization.name,
        description: organization.description,
        createdByUserId: directorId,
      },
    });
  } else {
    org = await prisma.organization.update({
      where: { id: org.id },
      data: {
        description: organization.description,
        updatedByUserId: directorId,
      },
    });
  }

  for (const member of organization.members) {
    const userId = userIdsByEmail.get(member.email);

    if (!userId) {
      continue;
    }

    await prisma.organizationUser.upsert({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId,
        },
      },
      update: { role: member.role },
      create: {
        organizationId: org.id,
        userId,
        role: member.role,
      },
    });
  }

  for (const projectSeed of organization.projects) {
    const managerId = userIdsByEmail.get(projectSeed.managerEmail);

    if (!managerId) {
      continue;
    }

    let project = await prisma.project.findFirst({
      where: {
        name: projectSeed.name,
        organizationId: org.id,
        deletedAt: null,
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: projectSeed.name,
          description: projectSeed.description,
          organizationId: org.id,
          managerId,
          createdByUserId: directorId,
          status: ProjectStatus.ACTIVE,
        },
      });
    } else {
      project = await prisma.project.update({
        where: { id: project.id },
        data: {
          description: projectSeed.description,
          managerId,
        },
      });
    }

    for (const taskSeed of projectSeed.tasks) {
      const createdBy = userIdsByEmail.get(taskSeed.createdByEmail);
      const designatedTo = taskSeed.designatedToEmail
        ? userIdsByEmail.get(taskSeed.designatedToEmail)
        : undefined;

      if (!createdBy) {
        continue;
      }

      const existingTask = await prisma.task.findFirst({
        where: {
          title: taskSeed.title,
          projectId: project.id,
          deletedAt: null,
        },
      });

      if (existingTask) {
        await prisma.task.update({
          where: { id: existingTask.id },
          data: {
            description: taskSeed.description,
            status: taskSeed.status,
            category: taskSeed.category,
            priority: taskSeed.priority,
            designatedTo: designatedTo ?? null,
            designatedBy: createdBy,
          },
        });
        continue;
      }

      await prisma.task.create({
        data: {
          title: taskSeed.title,
          description: taskSeed.description,
          status: taskSeed.status,
          category: taskSeed.category,
          priority: taskSeed.priority,
          projectId: project.id,
          createdBy,
          designatedBy: createdBy,
          designatedTo,
        },
      });
    }
  }

  return org;
}

async function main() {
  const userIdsByEmail = new Map<string, number>();

  for (const user of USERS) {
    const created = await upsertUser(user);
    userIdsByEmail.set(user.email, created.id);
    console.log(`User ready: ${user.email} (${user.role})`);
  }

  for (const organization of ORGANIZATIONS) {
    const org = await seedOrganization(organization, userIdsByEmail);
    console.log(`Organization ready: ${org.name}`);
  }

  console.log('\nSeed completed.');
  console.log(`Default password for all users: ${DEFAULT_PASSWORD}`);
  console.log('Login accounts:');
  console.log('  director@gmail.com  -> DIRECTOR');
  console.log('  manager@gmail.com   -> GERENTE');
  console.log('  employee@gmail.com  -> EMPLEADO');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
