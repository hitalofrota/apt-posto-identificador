import { PrismaClient } from '@prisma/client';
import { 
  format, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isWeekend, 
  addHours 
} from 'date-fns';

const prisma = new PrismaClient();

export const blockService = {
  async getDates() {
    const dates = await prisma.blockedDate.findMany();
    return dates.map(d => d.date);
  },

  async toggleDate(date) {
    const existing = await prisma.blockedDate.findUnique({ where: { date } });
    
    if (existing) {
      await prisma.blockedDate.delete({ where: { date } });
      return { action: "unblocked" };
    }
    
    await prisma.blockedDate.create({ data: { date } });
    return { action: "blocked" };
  },

  async getSlots() {
    const slots = await prisma.blockedSlot.findMany();
    return slots.map(s => `${s.date}|${s.time}`);
  },

  async toggleSlot(date, time) {
    const existing = await prisma.blockedSlot.findUnique({
      where: { date_time: { date, time } }
    });

    if (existing) {
      await prisma.blockedSlot.delete({ where: { id: existing.id } });
      return { action: "unblocked" };
    }
    
    await prisma.blockedSlot.create({ data: { date, time } });
    return { action: "blocked" };
  },

  async toggleMonth(month) {
    const referenceDate = addHours(parseISO(`${month}-01`), 12);
    const start = startOfMonth(referenceDate);
    const end = endOfMonth(start);

    const workDays = eachDayOfInterval({ start, end })
      .filter(d => !isWeekend(d))
      .map(d => format(d, "yyyy-MM-dd"));

    const currentBlocks = await prisma.blockedDate.findMany({
      where: { date: { in: workDays } }
    });

    if (currentBlocks.length === workDays.length) {
      await prisma.blockedDate.deleteMany({ 
        where: { date: { in: workDays } } 
      });
      return { action: "unblocked_month" };
    } 
    
    await prisma.blockedDate.createMany({
      data: workDays.map(d => ({ date: d })),
      skipDuplicates: true
    });
    
    return { action: "blocked_month" };
  }
};