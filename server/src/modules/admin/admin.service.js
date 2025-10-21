import prisma from "../../config/database.js";


export async function listUsers({ search = "", offset = 0, limit = 50 } = {}) {
  const q = String(search || "").trim();
  const roleMatch = ["ADMIN", "USER", "moderator","pending"].find(
  (r) => r.toLowerCase() === q.toLowerCase()
);
  const where = q
    ? {
        OR: [
          { user_name: { contains: q} },
          { user_email: { contains: q} },
          { user_location: { contains: q} },
          ...(roleMatch ? [{ user_role: roleMatch }] : []),
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.user.count({ where: where }),
    prisma.user.findMany({
      where,
      skip: Math.max(Number(offset) || 0, 0),
      take: Math.max(Number(limit) || 50, 1),
      orderBy: { user_joined: "desc" },
    }),
  ]);

  return { data, total };
}

export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { user_joined: "desc" } });
}

export async function getUserTripsDataByUserId(user_id) {
  // try to find by primary id first; fallback to other unique identifiers

  //the below logic will give us only the user data not the trips data  
  // const userTripsData =
  //   (await prisma.user.findUnique({ 
  //     where: { user_id },
  //     include: { trips: true }
  //   })) ||
  //   (await prisma.user.findFirst({
  //     where: {
  //       OR: [{ user_id: user_id }, { user_email: user_id }],
  //     },
  //     include: { trips: true }
  //   }));
  // return userTripsData || null;

  //but this logic will give us both the user and its trips data
    const tripsData = await prisma.trips.findMany({
    where: { user_id: user_id },
    include: { 
      user: true,
      budgets: true,
     }, // optional, if you also want user info
     orderBy: { created_at: "desc" },
  });

  return tripsData;

}

export async function updateUserById(id, updates = {}) {
  const allowed = ["user_name", "user_email", "user_role", "user_status", "user_phoneno"];
  const data = {};
  for (const k of Object.keys(updates || {})) {
    if (allowed.includes(k)) data[k] = updates[k];
  }
  if (Object.keys(data).length === 0) return null;

  try {
    const updated = await prisma.users.update({
      where: { id: String(id) },
      data,
    });
    return updated;
  } catch (err) {
    // Prisma error when record not found: P2025
    if (err?.code === "P2025") return null;
    throw err;
  }
}

export async function updateUser(id, updates = {}) {
  return updateUserById(id, updates);
}

export async function deleteUserById(id) {
  try {
    await prisma.users.delete({ where: { id: String(id) } });
    return true;
  } catch (err) {
    if (err?.code === "P2025") return false;
    throw err;
  }
}

export async function createUser(user = {}) {
  const data = {
    user_name: user.user_name ?? "",
    user_email: user.user_email ?? null,
    user_role: user.user_role ?? "user",
    user_status: user.user_status ?? "active",
    user_phoneno: user.user_phoneno ?? null,
    // include other fields as needed; do NOT include id if Prisma manages it
    ...user,
  };
  const created = await prisma.users.create({ data });
  return created;
}

export default {
  listUsers,
  getAllUsers,
  getUserTripsDataByUserId,
  updateUserById,
  updateUser,
  deleteUserById,
  createUser,
};