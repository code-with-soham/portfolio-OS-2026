// ============================================
// Portfolio OS 2026 — GitHub Service
// ============================================
// Unified service to fetch GitHub data for Portfolio OS.
// Prevents duplicate logic across components.

const GITHUB_USERNAME = 'code-with-soham'; // The actual username
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

export const githubService = {
  /**
   * Fetches the core profile data for the user.
   */
  async fetchProfile() {
    try {
      const res = await fetch(GITHUB_API_URL);
      if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);
      const data = await res.json();
      
      return {
        avatar: data.avatar_url,
        followers: data.followers,
        following: data.following,
        publicRepos: data.public_repos,
        url: data.html_url,
        name: data.name || GITHUB_USERNAME,
        bio: data.bio
      };
    } catch (error) {
      console.error('githubService.fetchProfile Error:', error);
      return null;
    }
  },

  /**
   * Optional: Fetch specific repository details if needed later
   */
  async fetchRepos(sort = 'updated', perPage = 5) {
    try {
      const res = await fetch(`${GITHUB_API_URL}/repos?sort=${sort}&per_page=${perPage}`);
      if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('githubService.fetchRepos Error:', error);
      return [];
    }
  }
};
