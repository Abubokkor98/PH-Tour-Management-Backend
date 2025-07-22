export interface IDivision {
  name: string;
  slug: string; // A URL-friendly version of the name, used in the route (e.g., in the URL).
  thumbnail?: string;
  description?: string;
}

/**
 * Example:
 *
 * name = "Chattogram Division"
 * slug = "chattogram-division"
 *
 * URL will look like:
 * /division/chattogram-division
 *
 * Slugs are useful for building clean and readable URLs.
 */
