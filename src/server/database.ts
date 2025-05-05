import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chatbot',
  logging: false,
});

// Define Chat Message model
class ChatMessage extends Model {
  public id!: number;
  public userId!: string;
  public role!: 'user' | 'assistant';
  public content!: string;
  public timestamp!: Date;
}

ChatMessage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'assistant'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'chat_messages',
  timestamps: true,
});

// Define User Preferences model
class UserPreference extends Model {
  public userId!: string;
  public preferredModel!: 'groq' | 'gemini';
  public learningLevel!: string;
  public learningGoal!: string;
}

UserPreference.init({
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  preferredModel: {
    type: DataTypes.ENUM('groq', 'gemini'),
    allowNull: false,
    defaultValue: 'groq',
  },
  learningLevel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  learningGoal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'user_preferences',
  timestamps: true,
});

// Initialize database
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// Database service functions
export const dbService = {
  // Initialize the database
  init: initDatabase,
  
  // Chat message operations
  messages: {
    // Save a new chat message
    async save(userId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
      return await ChatMessage.create({
        userId,
        role,
        content,
        timestamp: new Date(),
      });
    },
    
    // Get chat history for a user
    async getHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
      return await ChatMessage.findAll({
        where: { userId },
        order: [['timestamp', 'DESC']],
        limit,
      });
    },
    
    // Clear chat history for a user
    async clearHistory(userId: string): Promise<number> {
      return await ChatMessage.destroy({
        where: { userId },
      });
    },
  },
  
  // User preferences operations
  preferences: {
    // Save or update user preferences
    async savePreferences(
      userId: string, 
      preferences: { 
        preferredModel?: 'groq' | 'gemini', 
        learningLevel?: string, 
        learningGoal?: string 
      }
    ): Promise<UserPreference> {
      const [userPref, created] = await UserPreference.findOrCreate({
        where: { userId },
        defaults: {
          userId,
          preferredModel: preferences.preferredModel || 'groq',
          learningLevel: preferences.learningLevel || '',
          learningGoal: preferences.learningGoal || '',
        },
      });
      
      if (!created) {
        await userPref.update(preferences);
      }
      
      return userPref;
    },
    
    // Get user preferences
    async getPreferences(userId: string): Promise<UserPreference | null> {
      return await UserPreference.findByPk(userId);
    },
  },
  
  // Raw query execution for advanced use cases
  async executeQuery(sql: string, replacements: any = {}): Promise<any> {
    return await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });
  },
};

export { ChatMessage, UserPreference };