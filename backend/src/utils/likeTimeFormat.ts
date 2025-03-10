export function formatTimeDifference(createdAt: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - new Date(createdAt).getTime();
    
    // Вычисляем разницу в различных единицах времени
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Выбираем наиболее подходящую единицу времени
    if (diffInDays > 0) {
      return `likes your post ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInHours > 0) {
      return `likes your post ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInMinutes > 0) {
      return `likes your post ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `likes your post ${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'} ago`;
    }
  }
  
//   // Пример использования в контроллере, который возвращает информацию о лайках
//   import { Request, Response } from 'express';
//   import Like from '../models/Like';
//   import { formatTimeDifference } from '../utils/timeFormatUtils';
  
//   export async function getLikeNotifications(req: Request, res: Response): Promise<void> {
//     try {
//       const userId = req.params.userId || req.body.userId;
      
//       // Предположим, что мы хотим получить лайки постов текущего пользователя
//       const likes = await Like.find({ /* условие для выбора лайков */ })
//         .populate('user', 'username')
//         .populate('post', 'title');
      
//       // Форматируем данные для отображения
//       const formattedLikes = likes.map(like => ({
//         id: like._id,
//         username: like.user.username,
//         postTitle: like.post.title,
//         timeMessage: formatTimeDifference(like.createdAt)
//       }));
      
//       res.json(formattedLikes);
//     } catch (error) {
      
//       res.status(500).json({ message: 'Server error while fetching likes' });
//     }
//   }