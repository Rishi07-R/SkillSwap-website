import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  INITIAL_PROFILES,
  INITIAL_SKILLS,
  INITIAL_USER_SKILLS,
  INITIAL_REQUESTS,
  INITIAL_EXCHANGES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

// Storage keys for local persistence
const STORAGE_KEYS = {
  PROFILES: 'skillswap_profiles',
  SKILLS: 'skillswap_skills',
  USER_SKILLS: 'skillswap_user_skills',
  REQUESTS: 'skillswap_requests',
  EXCHANGES: 'skillswap_exchanges',
  REVIEWS: 'skillswap_reviews',
  NOTIFICATIONS: 'skillswap_notifications',
};

// Initialize LocalStorage with seed data if not present
function getLocalItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return fallback;
  }
}

function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// Ensure mock tables are initialized
export function initLocalStore() {
  getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  getLocalItem(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  getLocalItem(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
  getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  getLocalItem(STORAGE_KEYS.EXCHANGES, INITIAL_EXCHANGES);
  getLocalItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

// Reset store to fresh initial state
export function resetLocalStore() {
  setLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  setLocalItem(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  setLocalItem(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
  setLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  setLocalItem(STORAGE_KEYS.EXCHANGES, INITIAL_EXCHANGES);
  setLocalItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  setLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

// ==============================================================================
// DATA SERVICE API
// ==============================================================================

export const DataService = {
  // PROFILES
  async getProfiles() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    }
    return getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },

  async getProfileById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    }
    const profiles = getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return profiles.find(p => p.id === id) || null;
  },

  async updateProfile(id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
    const profiles = getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const index = profiles.findIndex(p => p.id === id);
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates };
      setLocalItem(STORAGE_KEYS.PROFILES, profiles);
      return profiles[index];
    }
    return null;
  },

  // SKILLS DIRECTORY
  async getSkills() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('skills').select('*').order('name');
      if (error) throw error;
      return data;
    }
    return getLocalItem(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },

  // USER SKILLS
  async getAllUserSkills() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('user_skills').select('*, skills(*)');
      if (error) throw error;
      return data;
    }
    return getLocalItem(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
  },

  async getUserSkills(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('user_skills').select('*, skills(*)').eq('user_id', userId);
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
    return all.filter(s => s.userId === userId);
  },

  async addUserSkill(skillEntry) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('user_skills').insert(skillEntry).select().single();
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
    const newEntry = {
      id: 'us-' + Date.now(),
      ...skillEntry
    };
    all.push(newEntry);
    setLocalItem(STORAGE_KEYS.USER_SKILLS, all);
    return newEntry;
  },

  async removeUserSkill(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('user_skills').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const all = getLocalItem(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
    const filtered = all.filter(s => s.id !== id);
    setLocalItem(STORAGE_KEYS.USER_SKILLS, filtered);
    return true;
  },

  // EXCHANGE REQUESTS
  async getExchangeRequests(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('exchange_requests')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    return all.filter(r => r.senderId === userId || r.receiverId === userId);
  },

  async createExchangeRequest(request) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exchange_requests').insert(request).select().single();
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    
    // Prevent duplicate pending requests
    const existing = all.find(
      r => r.senderId === request.senderId && r.receiverId === request.receiverId && r.status === 'pending'
    );
    if (existing) {
      throw new Error('A pending exchange request already exists between you and this member.');
    }

    const newRequest = {
      id: 'req-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...request
    };
    all.unshift(newRequest);
    setLocalItem(STORAGE_KEYS.REQUESTS, all);

    // Also create a notification for the receiver
    this.createNotification({
      userId: request.receiverId,
      title: 'New Swap Proposal!',
      message: `${request.senderName} proposed to teach you ${request.offeredSkillName} for ${request.wantedSkillName}.`,
      type: 'request_received',
      link: '/requests'
    });

    return newRequest;
  },

  async updateRequestStatus(requestId, status, userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('exchange_requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const req = all.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    req.status = status;
    setLocalItem(STORAGE_KEYS.REQUESTS, all);

    // If accepted, auto-generate an active Exchange session
    if (status === 'accepted') {
      const exchanges = getLocalItem(STORAGE_KEYS.EXCHANGES, INITIAL_EXCHANGES);
      const newExchange = {
        id: 'exch-' + Date.now(),
        userAId: req.senderId,
        userBId: req.receiverId,
        userAName: req.senderName,
        userBName: req.receiverName,
        userAAvatar: req.senderAvatar,
        userBAvatar: req.receiverAvatar,
        skillAId: req.offeredSkillId,
        skillAName: req.offeredSkillName,
        skillBId: req.wantedSkillId,
        skillBName: req.wantedSkillName,
        status: 'active',
        meetingLink: 'https://meet.google.com/swap-' + Math.random().toString(36).substring(7),
        scheduleDetails: 'To be scheduled by participants',
        sharedNotes: 'Kickoff notes: Welcome to your skill swap! Discuss goals and schedule your sessions.',
        userACompleted: false,
        userBCompleted: false,
        createdAt: new Date().toISOString(),
      };
      exchanges.unshift(newExchange);
      setLocalItem(STORAGE_KEYS.EXCHANGES, exchanges);

      // Notify sender
      this.createNotification({
        userId: req.senderId,
        title: 'Proposal Accepted! 🎉',
        message: `${req.receiverName} accepted your skill exchange proposal! Go to exchanges to coordinate.`,
        type: 'request_accepted',
        link: `/exchanges/${newExchange.id}`
      });
    }

    if (status === 'rejected') {
      this.createNotification({
        userId: req.senderId,
        title: 'Proposal Update',
        message: `${req.receiverName} was unable to accept your swap proposal at this time.`,
        type: 'request_rejected',
        link: '/requests'
      });
    }

    return req;
  },

  // EXCHANGES
  async getExchanges(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('exchanges')
        .select('*')
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.EXCHANGES, INITIAL_EXCHANGES);
    return all.filter(e => e.userAId === userId || e.userBId === userId);
  },

  async getExchangeById(exchangeId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exchanges').select('*').eq('id', exchangeId).single();
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.EXCHANGES, INITIAL_EXCHANGES);
    return all.find(e => e.id === exchangeId) || null;
  },

  async updateExchange(exchangeId, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('exchanges').update(updates).eq('id', exchangeId).select().single();
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.EXCHANGES, INITIAL_EXCHANGES);
    const index = all.findIndex(e => e.id === exchangeId);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      setLocalItem(STORAGE_KEYS.EXCHANGES, all);
      return all[index];
    }
    return null;
  },

  async confirmExchangeCompletion(exchangeId, currentUserId) {
    const exchange = await this.getExchangeById(exchangeId);
    if (!exchange) throw new Error('Exchange not found');

    const isUserA = exchange.userAId === currentUserId;
    const isUserB = exchange.userBId === currentUserId;

    if (!isUserA && !isUserB) {
      throw new Error('Unauthorized to complete this exchange');
    }

    const updates = {};
    if (isUserA) updates.userACompleted = true;
    if (isUserB) updates.userBCompleted = true;

    const bothComplete = (isUserA ? true : exchange.userACompleted) && (isUserB ? true : exchange.userBCompleted);
    if (bothComplete) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();

      // Increment completed exchanges for both profiles
      const profiles = getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      [exchange.userAId, exchange.userBId].forEach(uid => {
        const p = profiles.find(pr => pr.id === uid);
        if (p) p.exchangesCompleted = (p.exchangesCompleted || 0) + 1;
      });
      setLocalItem(STORAGE_KEYS.PROFILES, profiles);
    }

    return await this.updateExchange(exchangeId, updates);
  },

  // REVIEWS
  async getReviews(userId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('reviews').select('*');
      if (userId) query = query.eq('reviewee_id', userId);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (userId) return all.filter(r => r.revieweeId === userId);
    return all;
  },

  async createReview(review) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').insert(review).select().single();
      if (error) throw error;
      return data;
    }
    const all = getLocalItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);

    // Prevent duplicate reviews for the same exchange by the same reviewer
    const existing = all.find(r => r.exchangeId === review.exchangeId && r.reviewerId === review.reviewerId);
    if (existing) {
      throw new Error('You have already submitted a review for this exchange.');
    }

    const newReview = {
      id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...review
    };
    all.unshift(newReview);
    setLocalItem(STORAGE_KEYS.REVIEWS, all);

    // Recompute profile rating & count
    const userReviews = all.filter(r => r.revieweeId === review.revieweeId);
    const avg = (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(2);
    
    const profiles = getLocalItem(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const targetProfile = profiles.find(p => p.id === review.revieweeId);
    if (targetProfile) {
      targetProfile.rating = parseFloat(avg);
      targetProfile.reviewsCount = userReviews.length;
      setLocalItem(STORAGE_KEYS.PROFILES, profiles);
    }

    // Send notification
    this.createNotification({
      userId: review.revieweeId,
      title: 'New Review Received! ⭐',
      message: `${review.reviewerName} gave you a ${review.rating}-star review: "${review.comment?.slice(0, 50)}..."`,
      type: 'review_received',
      link: '/reviews'
    });

    return newReview;
  },

  // NOTIFICATIONS
  async getNotifications(userId) {
    const all = getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createNotification(notif) {
    const all = getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: 'notif-' + Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notif
    };
    all.unshift(newNotif);
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  },

  async markNotificationRead(id) {
    const all = getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const n = all.find(item => item.id === id);
    if (n) {
      n.isRead = true;
      setLocalItem(STORAGE_KEYS.NOTIFICATIONS, all);
    }
    return true;
  },

  async markAllNotificationsRead(userId) {
    const all = getLocalItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    all.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, all);
    return true;
  }
};
