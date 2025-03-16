/**
 * Types for the root outlet context used throughout the application
 * This allows for proper typing when using useOutletContext in route components
 */

/**
 * Root outlet context interface
 * Define the properties that will be passed through the outlet context
 */
export interface RootOutletContext {
  /**
   * User authentication state and information
   */
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
  
  /**
   * Any application-wide state or utilities
   * Can be expanded as needed
   */
  isAuthenticated: boolean;
}