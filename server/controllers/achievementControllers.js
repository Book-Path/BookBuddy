import { pool } from "../config/database.js";

const getMyAchievements = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT achievements.id, achievements.name, achievements.requirement, achievements.metric, achievements.threshold, userachievements.earned_at, userachievements.user_id IS NOT NULL AS earned
      FROM achievements
      LEFT JOIN userachievements
        ON userachievements.achievement_id = achievements.id
        AND userachievements.user_id = $1
      ORDER BY achievements.metric, achievements.threshold
    `, [req.user.id]);

    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export default { getMyAchievements };