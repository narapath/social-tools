/**
 * Facebook Service - Real Facebook Graph API Integration
 * Uses Direct OAuth Redirect flow (most reliable, works on localhost HTTP)
 * No Facebook JS SDK needed — just redirects to Facebook login page
 */

const FB_API_VERSION = 'v19.0';
const GRAPH_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

// Permissions to request
const PERMISSIONS = [
  'public_profile',
  'email'
];

class FacebookService {
  constructor() {
    this.accessToken = localStorage.getItem('fb_access_token') || null;
    this.appId = localStorage.getItem('fb_app_id') || '';
  }

  // ─── OAuth Redirect Login ────────────────────────────────────
  // Redirects the user to Facebook's login page.
  // After login, Facebook redirects back with the token in the URL hash.
  startLogin(appId) {
    if (!appId) throw new Error('App ID is required');
    
    this.appId = appId;
    localStorage.setItem('fb_app_id', appId);

    const redirectUri = window.location.origin + window.location.pathname;
    const scope = PERMISSIONS.join(',');

    const authUrl = `https://www.facebook.com/${FB_API_VERSION}/dialog/oauth?` +
      `client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&response_type=token` +
      `&display=popup`;

    // Redirect the current page to Facebook OAuth dialog
    window.location.href = authUrl;
  }

  // Check if the URL contains a Facebook OAuth callback token
  handleRedirectCallback() {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return null;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      this.accessToken = accessToken;
      localStorage.setItem('fb_access_token', accessToken);
      if (expiresIn) {
        localStorage.setItem('fb_token_expires', Date.now() + parseInt(expiresIn) * 1000);
      }

      // Clean the URL hash so the token isn't visible
      window.history.replaceState(null, '', window.location.pathname);

      console.log('✅ Facebook token received, expires in', expiresIn, 'seconds');
      return { accessToken, expiresIn };
    }

    // Check for error
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    if (error) {
      window.history.replaceState(null, '', window.location.pathname);
      throw new Error(errorDescription || error);
    }

    return null;
  }

  // Check if token is still valid
  isTokenValid() {
    if (!this.accessToken) return false;
    const expires = localStorage.getItem('fb_token_expires');
    if (expires && Date.now() > parseInt(expires)) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('fb_access_token');
    localStorage.removeItem('fb_token_expires');
  }

  // ─── Graph API Fetch Helpers ─────────────────────────────────
  async graphGet(endpoint, params = {}) {
    if (!this.accessToken) throw new Error('No access token. Please login first.');

    const url = new URL(`${GRAPH_URL}${endpoint}`);
    url.searchParams.set('access_token', this.accessToken);
    Object.entries(params).forEach(([key, val]) => url.searchParams.set(key, val));

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Graph API error');
    }
    return data;
  }

  async graphPost(endpoint, params = {}) {
    if (!this.accessToken) throw new Error('No access token. Please login first.');

    const url = new URL(`${GRAPH_URL}${endpoint}`);
    
    const body = new URLSearchParams();
    body.set('access_token', this.accessToken);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== null && val !== undefined) body.set(key, val);
    });

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: body
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Graph API error');
    }
    return data;
  }

  // ─── Profile ─────────────────────────────────────────────────
  async getProfile() {
    return this.graphGet('/me', { fields: 'id,name,email,picture.width(200).height(200)' });
  }

  // ─── My Groups ───────────────────────────────────────────────
  async getMyGroups(limit = 100) {
    const response = await this.graphGet('/me/groups', {
      fields: 'id,name,privacy,member_count,icon,picture.width(200).height(200),administrator',
      limit: String(limit)
    });
    return response.data || [];
  }

  // ─── Search Groups ───────────────────────────────────────────
  async searchGroups(keyword) {
    try {
      const response = await this.graphGet('/search', {
        type: 'group',
        q: keyword,
        fields: 'id,name,privacy,member_count,picture.width(200).height(200)',
        limit: '50'
      });
      return response.data || [];
    } catch (err) {
      console.warn('Search endpoint unavailable, filtering user groups:', err.message);
      try {
        const groups = await this.getMyGroups(200);
        return groups.filter(g =>
          g.name.toLowerCase().includes(keyword.toLowerCase())
        );
      } catch (e) {
        throw new Error('Cannot search groups: ' + e.message);
      }
    }
  }

  // ─── Post to Group ───────────────────────────────────────────
  async postToGroup(groupId, message, link = null) {
    const params = { message };
    if (link) params.link = link;
    return this.graphPost(`/${groupId}/feed`, params);
  }

  // ─── Batch Post ──────────────────────────────────────────────
  async batchPost(groupIds, message, link = null, delayMs = 3000, onProgress = null) {
    const results = [];
    for (let i = 0; i < groupIds.length; i++) {
      if (onProgress) onProgress(i, groupIds.length);
      try {
        const result = await this.postToGroup(groupIds[i], message, link);
        results.push({ groupId: groupIds[i], success: true, postId: result.id });
      } catch (error) {
        results.push({ groupId: groupIds[i], success: false, error: error.message || String(error) });
      }
      // Delay between posts
      if (i < groupIds.length - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
    return results;
  }

  // ─── Permissions ─────────────────────────────────────────────
  async getPermissions() {
    try {
      const response = await this.graphGet('/me/permissions');
      return response.data || [];
    } catch (e) {
      return [];
    }
  }

  // ─── Validate Token ─────────────────────────────────────────
  async validateToken() {
    try {
      await this.getProfile();
      return true;
    } catch (e) {
      this.logout();
      return false;
    }
  }
}

export default new FacebookService();
