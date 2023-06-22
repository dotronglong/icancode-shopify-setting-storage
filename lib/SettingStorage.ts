import {Getter, HashMap} from '@icancode/base';

/**
 * SettingStorage
 */
export default interface SettingStorage {
  /**
   * Get shop's settings by app
   * @param {string} shop shop's id
   * @param {string} app app's id
   * @returns {Promise<Getter>}
   */
  getSettings(shop: string, app: string): Promise<Getter>;

  /**
   * Set shop's settings by app
   * @param {string} shop shop's id
   * @param {string} app app's id
   * @param {HashMap} settings
   * @returns {Promise<void>}
   */
  setSettings(shop: string, app: string, settings: HashMap): Promise<void>;
}
