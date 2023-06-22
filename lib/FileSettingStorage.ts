import {Getter, HashMap} from '@icancode/base';
import SettingStorage from './SettingStorage';
import * as fs from 'fs';
import {join} from 'path';
import MapGetter from './MapGetter';

export interface FileSettingStorageOptions {
  location: string;
}

const defaultFileSettingStorageOptions: FileSettingStorageOptions = {
  location: '.settings',
};

/**
 * FileSettingStorage
 */
export class FileSettingStorage implements SettingStorage {
  private options: FileSettingStorageOptions;
  private directorySetting: string;

  /**
   * Constructor
   * @param {FileSettingStorageOptions} options
   */
  constructor(options?: FileSettingStorageOptions) {
    this.options = {...defaultFileSettingStorageOptions, ...options};
    this.directorySetting = join(process.cwd(), this.options.location);
  }

  /**
   * Get shop's settings by app
   * @param {string} shop shop's id
   * @param {string} app app's id
   * @return {Promise<Getter>}
   */
  getSettings(shop: string, app: string): Promise<Getter> {
    return new Promise((resolve, reject) => {
      let getter = new MapGetter({});
      try {
        if (!fs.existsSync(this.directorySetting)) {
          fs.mkdirSync(this.directorySetting);
        } else {
          if (!fs.lstatSync(this.directorySetting).isDirectory()) {
            throw new Error(`Unable to write settings to ${this.directorySetting}`); // eslint-disable-line
          }

          const filePath = join(this.directorySetting, `${shop}-${app}.json`);
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            const data = fs.readFileSync(filePath, {encoding: 'utf8'});
            getter = new MapGetter(JSON.parse(data));
          }
        }

        resolve(getter);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Set shop's settings by app
   * @param {string} shop shop's id
   * @param {string} app app's id
   * @param {HashMap} settings
   * @return {Promise<void>}
   */
  setSettings(shop: string, app: string, settings: HashMap): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(this.directorySetting)) {
          fs.mkdirSync(this.directorySetting);
        }
        if (!fs.lstatSync(this.directorySetting).isDirectory()) {
          throw new Error(`Unable to write settings to ${this.directorySetting}`); // eslint-disable-line
        }
        const filePath = join(this.directorySetting, `${shop}-${app}.json`);
        fs.writeFileSync(filePath, JSON.stringify(settings));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
