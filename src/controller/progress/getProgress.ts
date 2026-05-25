import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/messages";
import { User } from "../../model/userModel";
import { conversationModel } from "../../model/conversationModel";
import mongoose from "mongoose";

const getProgress = async (req: Request, res: Response) => {
  try {
    const userDetails = req.user as User & { _id: string };
    const userId = new mongoose.Types.ObjectId(userDetails._id);

    // Fetch all conversations/messages for this user
    const conversations = await conversationModel.find({ userId }).sort({ timestamp: 1 });

    // Filter user-sent messages only for active practice metrics
    const userMessages = conversations.filter((c) => c.role === "user");

    // Client timezone offset in minutes (default to 0 / UTC)
    const offset = parseInt(req.query.timezoneOffset as string) || 0;

    // Helper to get local date string YYYY-MM-DD
    const getDateString = (date: Date) => {
      const localTime = new Date(date.getTime() - offset * 60 * 1000);
      return localTime.toISOString().split("T")[0];
    };

    // Calculate unique practice dates
    const uniqueDates = Array.from(
      new Set(userMessages.map((m) => getDateString(m.timestamp)))
    ).sort();

    // 1. Streak calculation
    let currentStreak = 0;
    let longestStreak = 0;

    if (uniqueDates.length > 0) {
      const todayStr = getDateString(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getDateString(yesterday);

      const hasPracticedToday = uniqueDates.includes(todayStr);
      const hasPracticedYesterday = uniqueDates.includes(yesterdayStr);

      if (hasPracticedToday || hasPracticedYesterday) {
        let checkDate = hasPracticedToday ? new Date() : yesterday;
        let checkStr = getDateString(checkDate);

        while (uniqueDates.includes(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          checkStr = getDateString(checkDate);
        }
      }

      // Longest streak calculation
      let tempStreak = 0;
      let prevDate: Date | null = null;

      for (const dateStr of uniqueDates) {
        const currentDate = new Date(dateStr + "T00:00:00");
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        prevDate = currentDate;
      }
    }

    // 2. XP calculation
    // Rule: 15 XP per message, 30 XP per grammar correction received, 50 XP per active practice day
    const messagesWithCorrections = userMessages.filter(
      (m) => m.correction || m.correctionContent || m.feedback
    );
    const xpFromMessages = userMessages.length * 15;
    const xpFromCorrections = messagesWithCorrections.length * 30;
    const xpFromDays = uniqueDates.length * 50;
    const totalXp = xpFromMessages + xpFromCorrections + xpFromDays;

    // 3. Grammar Accuracy
    const totalUserMessages = userMessages.length;
    const incorrectMessages = messagesWithCorrections.length;
    const grammarAccuracy =
      totalUserMessages > 0
        ? Math.round(((totalUserMessages - incorrectMessages) / totalUserMessages) * 100)
        : 100;

    // 4. Mode Breakdown
    const modeBreakdown = {
      chat: userMessages.filter((m) => m.conversationMode === "chat").length,
      character: userMessages.filter((m) => m.conversationMode === "character").length,
      debate: userMessages.filter((m) => m.conversationMode === "debate").length,
      roleplay: userMessages.filter((m) => m.conversationMode === "roleplay").length,
    };

    // 5. Weekly Activity (Last 7 Days)
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getDateString(d);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const count = userMessages.filter((m) => getDateString(m.timestamp) === dateStr).length;
      weeklyActivity.push({
        dayName,
        date: dateStr,
        count,
      });
    }

    // 6. Recent Grammar Mistakes (Review Notebook)
    const grammarMistakes = userMessages
      .filter((m) => m.correction || m.correctionContent || m.feedback)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
      .map((m) => ({
        _id: m._id,
        original: m.content,
        corrected: m.correction || m.correctionContent,
        explanation: m.feedback,
        mode: m.conversationMode,
        timestamp: m.timestamp,
      }));

    res.status(200).json({
      status: true,
      message: "Progress data aggregated successfully",
      data: {
        totalMessages: totalUserMessages,
        totalXp,
        currentStreak,
        longestStreak,
        grammarAccuracy,
        modeBreakdown,
        weeklyActivity,
        grammarMistakes,
      },
    });
  } catch (error) {
    console.error("Error aggregating user progress:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getProgress;
