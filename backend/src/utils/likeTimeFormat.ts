export function likeFormatTimeDifference(createdAt: Date): string {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - new Date(createdAt).getTime();
    
    
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    
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
  
  