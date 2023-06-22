import {Getter, HashMap} from '@icancode/base';
import SettingStorage from './SettingStorage';
import MapGetter from './MapGetter';
import {DynamoDB, DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

export interface DynamoDBSettingStorageOptions {
  tableName: string;
  config?: DynamoDBClientConfig;
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
  private client: DynamoDBDocumentClient;

  /**
   * Constructor
   * @param {DynamoDBSettingStorageOptions} options
   */
  constructor(options?: DynamoDBSettingStorageOptions) {
    this.options = {...defaultDynamoDBSettingStorageOptions, ...options};
    this.client = DynamoDBDocumentClient.from(
        new DynamoDB({...this.options.config}),
    );
  }

  /**
   * Get shop's settings by app
   * @param {string} shop shop's id
   * @param {string} app app's id
   * @return {Promise<Getter>}
   */
  getSettings(shop: string, app: string): Promise<Getter> {
    return new Promise(async (resolve, reject) => {
      try {
        const command = new GetCommand({
          TableName: this.options.tableName,
          Key: {shop, app},
        });
        const response = await this.client.send(command);
        resolve(new MapGetter(response.Item || {}));
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
    return new Promise(async (resolve, reject) => {
      try {
        const command = new PutCommand({
          TableName: this.options.tableName,
          Item: {...settings, ...{shop, app}},
        });
        await this.client.send(command);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
