import { supabase } from '../config.js';

export async function fetchAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*');
  
    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  
    return data;
  }