import { eq } from 'drizzle-orm';
import { db } from '@repo/db';
import { users } from '@repo/db/schema';

async function SetAdmin(emails: string[]) {
    if (!emails || emails.length === 0) {
        console.error("no email array")
        process.exit(1);
    }
    try {
        for (const email of emails) {
            console.log(`Processing: ${email}`);

            const updatedUser = await db
                .update(users)
                .set({ role: 'admin' })
                .where(eq(users.email, email))
                .returning({ id: users.id, email: users.email, role: users.role });

            if (updatedUser.length === 0) {
                console.error(`User with email ${email} not found.`);
            } else {
                console.log(`Success! ${updatedUser[0].email} is now an admin.`);
            }
        }
        console.log("Admin Assignment Done")
        process.exit(0);
    } catch (error) {
        console.error('Database error:', error);
        process.exit(1);
    }
}

const SetAdminEmails = ["avichal2018lko@gmail.com"];
const currentAdmins = [];

SetAdmin(SetAdminEmails);