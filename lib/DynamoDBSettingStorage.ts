import {Getter, HashMap} from '@icancode/base';
import SettingStorage from './SettingStorage';
import MapGetter from './MapGetter';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';

export interface DynamoDBSettingStorageOptions {
  tableName: string;
}

const defaultDynamoDBSettingStorageOptions: DynamoDBSettingStorageOptions = {
  tableName: 'shopifySettings',
};

/**
 * FileSettingStorage
 *
 * Table should have shop as PK and app as SK
 */
export class DynamoDBSettingStorage implements SettingStorage {
  private options: DynamoDBSettingStorageOptions;
  private client: DocumentClient;

  /**
   * Constructor
   * @param {DynamoDBSettingStorageOptions} options
   */
  constructor(options?: DynamoDBSettingStorageOptions) {
    this.options = {...defaultDynamoDBSettingStorageOptions, ...options};
    this.client = new DocumentClient();
  }

  /**
   * Get shop's settings by app
   * @param {string} shop shop's id
   * @param {string} app app's id
   * @return {Promise<Getter>}
   */
  getSettings(shop: string, app: string): Promise<Getter> {
    return new Promise((resolve, reject) => {
      try {
        this.client.get({
          TableName: this.options.tableName,
          Key: {
            shop,
            app,
          },
        }, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(new MapGetter(data.Item || {}));
          }
        });
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
        this.client.put({
          TableName: this.options.tableName,
          Item: {...settings, ...{shop, app}},
        }, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
